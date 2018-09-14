# ILP Module Loader
> An ILP module loader and type definitions for common types

[![NPM Package](https://img.shields.io/npm/v/ilp-module.svg?style=flat)](https://npmjs.org/package/ilp-module)
[![CircleCI](https://circleci.com/gh/interledgerjs/ilp-module.svg?style=shield)](https://circleci.com/gh/interledgerjs/ilp-module)
[![Known Vulnerabilities](https://snyk.io/test/github/interledgerjs/ilp-module/badge.svg)](https://snyk.io/test/github/interledgerjs/ilp-module)

The Interledger.js project has established a convention for pluggable code modules. Various components use pluggable modules which are loaded either as ES modules or from the application source code.

This module provides the common module loading logic for all module types.

## Conventions

- An ILP module MUST export its constructor as its default export.
- The constructor's first argument should be an object with the constructor options.
- The constructor may have a second argument which will be an object providing services used by the module (usually other modules) such as a logger or key/value store.
- The module is either published and therefor accessed via its name or is in a folder in the root of the calling project, named after the plural of the module type. (Example: for a `store` module called `memory` the loader will look for `./stores/memory.js` relative to the root of the application)
- The convention for module naming is `ilp-{type}-{name}`. Example: The store module `ilp-store-memory` or the BTP plugin module `ilp-plugin-btp`.

## Types

The following types are currently defined and therefor also have default implementations
 - `logger` : A logger that is used to capture logs of different levels
 - `plugin` : An ILP plugin used to establish and settle peer connections
 - `store` : A key/value store used to persist data by ILP components
 - `backend` : A rates backend for asset conversions

## Built-In Modules

The following built-in modules are provided with this package:

| Type    | Name       | Class           | Description                                                      |
|---------|------------|-----------------|------------------------------------------------------------------|
| log     | debug      | DebugLogger     | Uses the external `debug` module to write logs.                  |
| log     | console    | ConsoleLogger   | Wraps the appropriate `console` methods                          |
| store   | in-memory  | InMemoryStore   | A simple in-memory store                                         |
| backend | one-to-one | OneToOneBackend | A backend that does no asset conversions but can apply a spread. |

## Defaults

Known types all have default modules and options defined which will be used if no values are provided or can be found in the environment.

| Type    | Default        |
|---------|----------------|
| plugin  | ilp-plugin-btp |
| log     | debug          |
| store   | in-memory      |
| backend | one-to-one     |

**NOTE**: `ilp-plugin-btp` is not a dependency of this package, it must be installed manually if it is used through the default plugin option. Example:

```sh
> npm install ilp-module ilp-plugin-btp
```
This will allow the following to work seemlessly:
```js
const plugin = require('ilp-module').createPlugin()
```

## Loading Algorithm

The name and constructor options of the module are resolved from the supplied parameters, or the appropriate environment variables or finally the defaults are used (see below). Using the resolved name it loads the module in the following ways, in this order:

 1. If the name matches the `ilp-{type}-{name}` pattern it is loaded as a standard module of that name. 
 2. If not then it will be loaded by path where the path is the result of the following:
```js
path.resolve(process.env['ILP_MODULE_ROOT'] || process.cwd(), `./${type}s/`, resolvedName)
```
 3. Finally it will be attempt to load a built-in module using the resolved name (if the module type is known).

## Configuration

The name of the module to load can be passed as a parameter or will be loaded from the environment variable `ILP_{TYPE}` if defined.

The module loader can be passed configuration as a parameter or it is loaded from the environment variable `ILP_{TYPE}_OPTIONS` (assumed to be a JSON serialized object) if defined.

Example: Loading a module called `ilp-store-redis` with appropriate options
```js
const store = require('ilp-module').createModule('store', 'ilp-store-redis', { prefix: 'ilp', port: 6379 })
```
### Required Options

In general the constructor options are simply an object however some types have required properties:

- logger: `{ namespace: 'some-namespace'}`
- store: `{ prefix: 'key-prefix'}`
- backend: `{ spread: 0.01}` 

## Usage

A full blown call to the loader loks as follows. Only `type` is required.

```js
const type = 'store' // Or 'logger', 'backend', 'plugin'
const name = 'ilp-store-redis' // Optional
const options = { prefix: 'ilp', port: 6379 } // Specific to implementation. Some types have required options.
const services = { log: require('ilp-module').createLogger()}
const module = require('ilp-module').createModule(type, name, options, services)
```

There are convenience functions for known modules,:

```js
const plugin = require('ilp-module').createLogger(namespace)
const plugin = require('ilp-module').createCustomLogger(name?, options?, services?)
const plugin = require('ilp-module').createPlugin(name?, options?, services?)
const plugin = require('ilp-module').createBackend(name?, options?, services?)
```

## Developers

Module developers can depend on this package and use the provided type definitions.

Modules can either be published as standalone packages (and should be appropriately named: `ilp-{type}-{name}`) or can be put into a local folder in the application (`./{type}s/{name}.js`).
