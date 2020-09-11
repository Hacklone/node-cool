/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Command, flags } from '@oclif/command';
import * as path from 'path';
import * as vfs from 'vinyl-fs';
import * as replace from 'gulp-replace';
import * as childProcess from 'child_process';
import map = require('map-stream');

export default class New extends Command {
  public static description = 'Create new @node-cool project';

  public static examples = [`$ node-cool new --name my-project`];

  public static flags = {
    help: flags.help({ char: 'h' }),
    name: flags.string({ char: 'n', description: 'name of the project' }),
    path: flags.string({
      char: 'p',
      description: 'path where to create new project',
    }),
  };

  public async run(): Promise<void> {
    const { flags } = this.parse(New);

    const projectName = flags.name || 'CoolProject';
    const pathToGenerate = path.resolve(process.cwd(), flags.path ?? '.');

    this.log(`Generating new Cool project called '${projectName}' at '${pathToGenerate}'`);

    await this._copyBlueprintAsync(projectName, pathToGenerate);

    await this._installNPMDependencies(pathToGenerate);

    this.log('Finished creating project');
  }

  private _copyBlueprintAsync(projectName: string, pathToGenerate: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.log('Copying project files:');

      const blueprintFolder = path.resolve(__dirname, '../blueprint');

      vfs
        .src([blueprintFolder + '/**/*'])
        .pipe(
          map((file: { path: string }, cb: (error: Error | null, file: unknown) => void) => {
            this.log(`\t\t${file.path}`);

            cb(null, file);
          }),
        )
        .pipe(replace('---project-name---', projectName))
        .pipe(vfs.dest(pathToGenerate))
        .on('error', (err: unknown) => {
          this.error('Failed to copy project files');

          reject(err);
        })
        .on('end', () => {
          this.log('Finished copying project files');

          resolve();
        });
    });
  }

  private _installNPMDependencies(pathToGenerate: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.log('Install npm dependencies');

      childProcess
        .spawn('npm install', {
          cwd: pathToGenerate,
        })
        .on('exit', code => {
          if (code) {
            this.error('Installing npm dependencies failed');

            reject();
          } else {
            this.log('Installing npm dependencies finished');

            resolve();
          }
        });
    });
  }
}
