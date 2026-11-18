// Changelog fragments: every PR adds a file to .changes/ instead of editing CHANGELOG.md,
// so two PRs never conflict on the same lines. See .changes/README.md.
//
//   npm run changelog              print the next release notes (Unreleased + fragments)
//   npm run changelog -- --check   validate the fragments (CI)
//   npm run changelog -- --release write them to CHANGELOG.md under the version in
//                                  projects/ngx-ds/package.json and delete the fragments
//
// Options:
//   --date <YYYY-MM-DD>   release date (default: today, UTC)
//
// Fragments are Markdown with `### <Section>` headings. Allowed sections, in output order:
// Added, Changed, Deprecated, Removed, Fixed, Security.

import { readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parseArgs } from 'node:util';

const SECTIONS = ['Added', 'Changed', 'Deprecated', 'Removed', 'Fixed', 'Security'];
const CHANGES_DIR = '.changes';
const CHANGELOG = 'CHANGELOG.md';
const PACKAGE = 'projects/ngx-ds/package.json';
const RELEASES_URL = 'https://github.com/jdpo2008/ngx-ds/releases/tag';

const { values: args } = parseArgs({
  options: {
    check: { type: 'boolean', default: false },
    release: { type: 'boolean', default: false },
    date: { type: 'string' },
  },
});

/** Splits Markdown into `{ section: body[] }` by `### ` headings. Returns errors for unknown ones. */
function parseSections(text, source) {
  const sections = {};
  const errors = [];
  let current = null;
  let buffer = [];
  const flush = () => {
    const body = buffer.join('\n').trim();
    if (current && body) (sections[current] ??= []).push(body);
    else if (!current && body)
      errors.push(`${source}: text before the first "### <Section>" heading`);
    buffer = [];
  };
  for (const line of text.split(/\r?\n/)) {
    const heading = /^###\s+(.+?)\s*$/.exec(line);
    if (heading) {
      flush();
      current = heading[1];
      if (!SECTIONS.includes(current)) {
        errors.push(`${source}: unknown section "### ${current}" (use ${SECTIONS.join(', ')})`);
      }
    } else if (/^#{1,2}\s/.test(line)) {
      errors.push(`${source}: only "### <Section>" headings are allowed, found "${line.trim()}"`);
    } else {
      buffer.push(line);
    }
  }
  flush();
  return { sections, errors };
}

function render(sections) {
  return SECTIONS.filter((name) => sections[name]?.length)
    .map((name) => `### ${name}\n\n${sections[name].join('\n')}`)
    .join('\n\n');
}

const fragmentFiles = (await readdir(CHANGES_DIR))
  .filter((name) => name.endsWith('.md') && name.toLowerCase() !== 'readme.md')
  .sort();

const merged = {};
const errors = [];
for (const name of fragmentFiles) {
  const { sections, errors: fileErrors } = parseSections(
    await readFile(join(CHANGES_DIR, name), 'utf8'),
    `${CHANGES_DIR}/${name}`,
  );
  errors.push(...fileErrors);
  if (!Object.keys(sections).length && !fileErrors.length) {
    errors.push(`${CHANGES_DIR}/${name}: empty fragment`);
  }
  for (const [section, bodies] of Object.entries(sections))
    (merged[section] ??= []).push(...bodies);
}

const raw = await readFile(CHANGELOG, 'utf8');
const eol = raw.includes('\r\n') ? '\r\n' : '\n';
const changelog = raw.replace(/\r\n/g, '\n');

// Entries still written by hand under [Unreleased] go first.
const unreleased = /^## \[Unreleased\]\n([\s\S]*?)(?=^## \[)/m.exec(changelog);
if (!unreleased) errors.push(`${CHANGELOG}: no "## [Unreleased]" section followed by a release`);
const handWritten = unreleased ? parseSections(unreleased[1], `${CHANGELOG} [Unreleased]`) : null;
if (handWritten) errors.push(...handWritten.errors);

if (errors.length) {
  for (const error of errors) console.error(`error: ${error}`);
  process.exit(1);
}

const all = {};
for (const source of [handWritten.sections, merged]) {
  for (const [section, bodies] of Object.entries(source)) (all[section] ??= []).push(...bodies);
}
const notes = render(all);

if (args.check) {
  console.log(`${fragmentFiles.length} fragment(s) OK.`);
  process.exit(0);
}

if (!args.release) {
  console.log(notes || '(no unreleased changes)');
  process.exit(0);
}

const { version } = JSON.parse(await readFile(PACKAGE, 'utf8'));
if (version.includes('-')) {
  console.error(
    `error: ${version} is a prerelease. Prereleases keep the fragments; ` +
      'run --release when you bump to the stable version.',
  );
  process.exit(1);
}
if (new RegExp(`^## \\[${version.replace(/\./g, '\\.')}\\]`, 'm').test(changelog)) {
  console.error(`error: ${CHANGELOG} already has a ${version} section. Bump the version first.`);
  process.exit(1);
}
if (!notes) {
  console.error('error: nothing to release (no fragments and an empty [Unreleased] section).');
  process.exit(1);
}

const date = args.date ?? new Date().toISOString().slice(0, 10);
let updated = changelog.replace(
  unreleased[0],
  `## [Unreleased]\n\n## [${version}] - ${date}\n\n${notes}\n\n`,
);
const link = `[${version}]: ${RELEASES_URL}/v${version}`;
updated = /^\[\d[^\]]*\]: /m.test(updated)
  ? updated.replace(/^\[\d[^\]]*\]: /m, `${link}\n$&`)
  : `${updated.trimEnd()}\n\n${link}\n`;

await writeFile(CHANGELOG, updated.replace(/\n/g, eol));
for (const name of fragmentFiles) await rm(join(CHANGES_DIR, name));
console.log(`${CHANGELOG}: added ${version} - ${date} from ${fragmentFiles.length} fragment(s).`);
