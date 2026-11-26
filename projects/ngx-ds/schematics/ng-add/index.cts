import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  type Rule,
  type SchematicContext,
  SchematicsException,
  type Tree,
  chain,
} from '@angular-devkit/schematics';
import {
  ExistingBehavior,
  type WorkspaceDefinition,
  addDependency,
  readWorkspace,
  updateWorkspace,
} from '@schematics/angular/utility';

export interface NgAddOptions {
  /** Application to set up. Defaults to the project of the current directory. */
  project?: string;
}

/** Global stylesheet with the design tokens and the dark theme (no Tailwind). */
export const STYLESHEET = 'node_modules/@jdpo2008/ngx-ds/styles/ngx-ds.scss';

export function ngAdd(options: NgAddOptions): Rule {
  return async (tree: Tree) => {
    const workspace = await readWorkspace(tree);
    const projectName = options.project ?? onlyApplication(workspace);
    const project = workspace.projects.get(projectName);

    if (!project) {
      throw new SchematicsException(`Project "${projectName}" does not exist in angular.json.`);
    }
    if (project.extensions['projectType'] !== 'application') {
      throw new SchematicsException(
        `"${projectName}" is a library. Run ng add in an application, or pass --project.`,
      );
    }
    if (!project.targets.get('build')) {
      throw new SchematicsException(`Project "${projectName}" has no build target.`);
    }

    return chain([
      addDependency('@lucide/angular', peerVersion('@lucide/angular'), {
        existing: ExistingBehavior.Skip,
      }),
      addStylesheet(projectName),
      logNextSteps(),
    ]);
  };
}

/** The single application in the workspace, used when no project is given. */
function onlyApplication(workspace: WorkspaceDefinition): string {
  const apps = [...workspace.projects]
    .filter(([, project]) => project.extensions['projectType'] === 'application')
    .map(([name]) => name);

  if (apps.length !== 1) {
    throw new SchematicsException(
      'Could not tell which application to set up. Pass it with --project.',
    );
  }
  return apps[0];
}

/** Version range this release declares for a peer dependency. */
function peerVersion(name: string): string {
  const pkg = JSON.parse(readFileSync(join(__dirname, '../../package.json'), 'utf-8'));
  const version = pkg.peerDependencies?.[name];
  if (!version) {
    throw new SchematicsException(`Missing peer dependency "${name}" in ngx-ds package.json.`);
  }
  return version;
}

/** Prepends the stylesheet to the build target's styles (and to test, when it has styles). */
function addStylesheet(projectName: string): Rule {
  return updateWorkspace((workspace) => {
    const project = workspace.projects.get(projectName);
    if (!project) return;

    for (const [name, target] of project.targets) {
      const required = name === 'build';
      if (!required && !Array.isArray(target.options?.['styles'])) continue;

      target.options ??= {};
      const styles = (target.options['styles'] ?? []) as (string | { input: string })[];
      const present = styles.some(
        (entry) => (typeof entry === 'string' ? entry : entry.input) === STYLESHEET,
      );
      if (!present) {
        target.options['styles'] = [STYLESHEET, ...styles];
      }
    }
  });
}

function logNextSteps(): Rule {
  return (_tree: Tree, context: SchematicContext) => {
    context.logger.info(`ngx-ds: added ${STYLESHEET} to the styles in angular.json.`);
    context.logger.info(
      'ngx-ds: components use the Poppins font family but do not load it. ' +
        'Load it in index.html, or set --ngx-primary-font-family to another font.',
    );
    context.logger.info(
      'ngx-ds: labels default to Spanish and dates to es-ES. For English, add ' +
        "provideNgxDs({ locale: 'en-US' }) to your providers.",
    );
  };
}
