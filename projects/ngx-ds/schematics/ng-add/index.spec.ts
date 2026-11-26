import { join } from 'node:path';
import { firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { SchematicTestRunner, type UnitTestTree } from '@angular-devkit/schematics/testing';
import { STYLESHEET, ngAdd, type NgAddOptions } from './index.cjs';

const runner = new SchematicTestRunner('ngx-ds', join(__dirname, '../collection.json'));

function run(options: NgAddOptions, tree: UnitTestTree): Promise<UnitTestTree> {
  return firstValueFrom(runner.callRule(ngAdd(options), tree)) as Promise<UnitTestTree>;
}

function styles(tree: UnitTestTree, project = 'app', target = 'build'): unknown[] {
  const workspace = JSON.parse(tree.readContent('/angular.json'));
  return workspace.projects[project].architect[target].options.styles;
}

describe('ng-add', () => {
  let tree: UnitTestTree;

  beforeEach(async () => {
    tree = await runner.runExternalSchematic('@schematics/angular', 'workspace', {
      name: 'workspace',
      newProjectRoot: 'projects',
      version: '21.0.0',
    });
    tree = await runner.runExternalSchematic(
      '@schematics/angular',
      'application',
      { name: 'app', style: 'scss' },
      tree,
    );
  });

  it('prepends the stylesheet to the build styles', async () => {
    tree = await run({ project: 'app' }, tree);
    expect(styles(tree)).toEqual([STYLESHEET, 'projects/app/src/styles.scss']);
  });

  it('adds @lucide/angular with the peer dependency range', async () => {
    tree = await run({ project: 'app' }, tree);
    const pkg = JSON.parse(tree.readContent('/package.json'));
    expect(pkg.dependencies['@lucide/angular']).toBe('^1.80.0');
  });

  it('keeps an existing @lucide/angular version', async () => {
    const pkg = JSON.parse(tree.readContent('/package.json'));
    pkg.dependencies['@lucide/angular'] = '1.2.3';
    tree.overwrite('/package.json', JSON.stringify(pkg));

    tree = await run({ project: 'app' }, tree);
    expect(JSON.parse(tree.readContent('/package.json')).dependencies['@lucide/angular']).toBe(
      '1.2.3',
    );
  });

  it('does not add the stylesheet twice', async () => {
    tree = await run({ project: 'app' }, tree);
    tree = await run({ project: 'app' }, tree);
    expect(styles(tree).filter((entry) => entry === STYLESHEET)).toHaveLength(1);
  });

  it('uses the only application when no project is given', async () => {
    tree = await run({}, tree);
    expect(styles(tree)[0]).toBe(STYLESHEET);
  });

  it('asks for --project when there are several applications', async () => {
    tree = await runner.runExternalSchematic(
      '@schematics/angular',
      'application',
      { name: 'other' },
      tree,
    );
    await expect(run({}, tree)).rejects.toThrow(/--project/);
  });

  it('rejects an unknown project', async () => {
    await expect(run({ project: 'missing' }, tree)).rejects.toThrow(/does not exist/);
  });

  it('rejects a library', async () => {
    tree = await runner.runExternalSchematic(
      '@schematics/angular',
      'library',
      { name: 'lib' },
      tree,
    );
    await expect(run({ project: 'lib' }, tree)).rejects.toThrow(/library/);
  });
});
