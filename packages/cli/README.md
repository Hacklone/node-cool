@node-cool/cli
=========

Cool server framework CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@node-cool/cli.svg)](https://npmjs.org/package/@node-cool/cli)
[![Downloads/week](https://img.shields.io/npm/dw/@node-cool/cli.svg)](https://npmjs.org/package/@node-cool/cli)
[![License](https://img.shields.io/npm/l/@node-cool/cli.svg)](https://github.com/Hacklone/node-cool/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @node-cool/cli
$ cool COMMAND
running command...
$ cool (-v|--version|version)
@node-cool/cli/1.0.0 darwin-x64 node-v12.13.1
$ cool --help [COMMAND]
USAGE
  $ cool COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`cool help [COMMAND]`](#cool-help-command)
* [`cool new`](#cool-new)

## `cool help [COMMAND]`

display help for cool

```
USAGE
  $ cool help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.0/src/commands/help.ts)_

## `cool new`

Create new cool project

```
USAGE
  $ cool new

OPTIONS
  -h, --help       show CLI help
  -n, --name=name  name of the project
  -p, --path=path  path where to create new project

EXAMPLE
  $ cool new --name my-project
```

_See code: [src/commands/new.ts](https://github.com/Hacklone/node-cool/blob/v1.0.0/src/commands/new.ts)_
<!-- commandsstop -->
