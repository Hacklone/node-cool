import { Command, flags } from '@oclif/command';
import * as path from 'path';
import * as vfs from 'vinyl-fs';
import * as replace from 'gulp-replace';
const map = require('map-stream');

export default class New extends Command {
  public static description = 'Create new cool project';

  public static examples = [
    `$ cool new --name my-project`,
  ];

  public static flags = {
    help: flags.help({ char: 'h' }),
    name: flags.string({ char: 'n', description: 'name of the project' }),
    path: flags.string({ char: 'p', description: 'path where to create new project' }),
  };

  public async run() {
    const { flags } = this.parse(New);

    const projectName = flags.name || 'CoolProject';
    const pathToGenerate = path.resolve(process.cwd(), flags.path ?? '.');

    this.log(`Generating new Cool project called '${projectName}' at '${pathToGenerate}'`);

    await this._copyBlueprintAsync(projectName, pathToGenerate);

    this.log('Finished creating project');
  }

  private _copyBlueprintAsync(projectName: string, pathToGenerate: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const blueprintFolder = path.resolve(__dirname, '../blueprint');

      vfs.src([blueprintFolder + '/**/*'])
        .pipe(map((file: any, cb: Function) => {
          console.log(file.path);

          cb(null, file);
        }))
        .pipe(replace('<% PROJECT_NAME %>', projectName))
        .pipe(vfs.dest(pathToGenerate))
        .on('error', (err: any) => {
          reject(err);
        })
        .on('end', () => {
          resolve();
        });
    });
  }
}
