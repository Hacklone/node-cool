# @node-cool/cli

Cool server framework CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@node-cool/cli.svg)](https://npmjs.org/package/@node-cool/cli)
[![Downloads/week](https://img.shields.io/npm/dw/@node-cool/cli.svg)](https://npmjs.org/package/@node-cool/cli)
[![License](https://img.shields.io/npm/l/@node-cool/cli.svg)](https://github.com/Hacklone/node-cool/blob/master/package.json)

<!-- toc -->

- [@node-cool/cli](#node-coolcli)
- [Usage](#usage)
- [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
$ npm install -g @node-cool/cli
$ node-cool COMMAND
running command...
$ node-cool (-v|--version|version)
@node-cool/cli/1.0.3 darwin-x64 node-v12.13.1
$ node-cool --help [COMMAND]
USAGE
  $ node-cool COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`node-cool help [COMMAND]`](#node-cool-help-command)
- [`node-cool new`](#node-cool-new)

## `node-cool help [COMMAND]`

display help for node-cool

```
USAGE
  $ node-cool help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.0/src/commands/help.ts)_

## `node-cool new`

Create new @node-cool project

```
USAGE
  $ node-cool new

OPTIONS
  -h, --help       show CLI help
  -n, --name=name  name of the project
  -p, --path=path  path where to create new project

EXAMPLE
  $ node-cool new --name my-project
```

_See code: [src/commands/new.ts](https://github.com/Hacklone/node-cool/blob/v1.0.3/src/commands/new.ts)_

<!-- commandsstop -->
