# ILP Module Loader
> An ILP module loader and type definitions for common types

[![NPM Package](https://img.shields.io/npm/v/ilp-module-loader.svg?style=flat)](https://npmjs.org/package/ilp-module-loader)
[![CircleCI](https://circleci.com/gh/interledgerjs/ilp-module-loader.svg?style=shield)](https://circleci.com/gh/interledgerjs/ilp-module-loader)
[![Known Vulnerabilities](https://snyk.io/test/github/interledgerjs/ilp-module-loader/badge.svg)](https://snyk.io/test/github/interledgerjs/ilp-module-loader)

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
| plugin  | mirror     | MirrorPlugin    | A plugin that mirrors calls. i.e. sendData invokes dataHandler   |
| backend | one-to-one | OneToOneBackend | A backend that does no asset conversions but can apply a spread. |

## Defaults

Known types all have default modules and options defined which will be used if no values are provided or can be found in the environment.

| Type    | Default        | Falback |
|---------|----------------|---------|
| plugin  | ilp-plugin-btp | mirror  |
| log     | debug          | console |
| store   | in-memory      |         |
| backend | one-to-one     |         |

**NOTE:** As this package is intended to have as few dependencies as possible it will attempt to load the defaults but if these are not built-in and also not found then it will fallback to simple built-in modules.

For example, to use the `ilp-plugin-btp` plugin as a default it must be installed.

```sh
> npm install ilp-module ilp-plugin-btp
```
This will allow the following to work seemlessly and will create and instance of `ilp-plugin-btp`:
```js
const plugin = require('ilp-module').createPlugin()
```

## Loading Algorithm

The name and constructor options of the module are resolved from the supplied parameters, or the appropriate environment variables, or finally the defaults are used (see above). Using the resolved name it loads the module in the following ways, in this order:

 1. If the name matches the `ilp-{type}-{name}` pattern it is loaded as a standard module of that name. 
 2. If not then it will be loaded by path where the path is the result of the following:
```js
path.resolve(process.env['ILP_MODULE_ROOT'] || process.cwd(), `./${type}s/`, resolvedName)
```
 3. Finally it will attempt to load a built-in module using the resolved name (if the module type is known).

### Overriding default modules

The result of this is that an application may provide an alternative implementation of a built-in module by simply providing a module of the same name in the module root. As an example, an application that wishes to use an alternative implementation of the `debug` logger may place a `logger` implementation in the file `./loggers/debug.js` relative to the application working directory (or custom module root specified via `process.env['ILP_MODULE_ROOT']`).

## Configuration

The name of the module to load can be passed as a parameter or will be loaded from the environment variable `ILP_{TYPE}` if defined.

The module loader can be passed configuration as a parameter or it is loaded from the environment variable `ILP_{TYPE}_OPTIONS` (assumed to be a JSON serialized object) if defined.

Example: Loading a module called `ilp-store-redis` with appropriate options
```js
const store = require('ilp-module').createStore('ilp-store-redis', { prefix: 'ilp', port: 6379 })
```
Example: Loading the same module using environment variabales.
```js
//These would usually be set outside the application
process.env['ILP_STORE'] = 'ilp-store-redis'
process.env['ILP_STORE_OPTIONS'] = '{"prefix": "ilp", "port": "6379" }'

// The following would load the module name and options from the env variables
const store = require('ilp-module').createStore()
```
### Required Options

In general the constructor options are simply an object however some types have required properties:

- logger: `{ namespace: 'some-namespace'}`
- store: `{ prefix: 'key-prefix'}`
- backend: `{ spread: 0.01}` 

These are enforced if using TypeScript and overriding the known-module interfaces (`IlpPlugin`, `IlpLogger`, `IlpBackend` and `IlpStore`) or using the convenience functions (`createPlugin()` etc).

For all modules except the `logger` a `logger` instances is expected as one of the services. The loader will determine an apporpriate namespace and call `createLogger()` if one is not provided.

## Usage

A full blown call to the loader looks as follows. (Note: Only `type` is required.)

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
const plugin = require('ilp-module').createStore(name?, options?, services?)
const plugin = require('ilp-module').createBackend(name?, options?, services?)
```

## Developers

Module developers can depend on this package and use the provided type definitions to develop their own instances of known module types or custom modules.

Modules can either be published as standalone packages (and should be appropriately named: `ilp-{type}-{name}`) or can be put into a local folder in the application (`./{type}s/{name}.js`).

## Example

For a deeper insight into how the package is used run the example and look at the tests.

Run the example from the `example` folder (note that it loads a custom module from the `widgets` folder):
```sh
example> node app.js
```
Or run it from the root but specify the module root:
```sh
> ILP_MODULE_ROOT=$PWD/example node example/app.js
```

Note the different behaviour if the `debug` and `ilp-plugin-btp` modules are available or not.
