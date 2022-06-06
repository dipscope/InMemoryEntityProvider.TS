# InMemoryEntityProvider.TS

![GitHub](https://img.shields.io/github/license/dipscope/InMemoryEntityProvider.TS) ![NPM](https://img.shields.io/npm/v/@dipscope/in-memory-entity-provider) ![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg) -->

`InMemoryEntityProvider.TS` is an implementation of `EntityProvider` for `EntityStore.TS` package. You can find detailed information on the [project page](https://github.com/dipscope/EntityStore.TS).

## Give a star :star:

If you like or are using this project please give it a star. Thanks!

## Table of contents

* [What issues it solves?](#what-issues-it-solves)
* [Installation](#installation)
* [Configuration](#configuration)
* [Versioning](#versioning)
* [Contributing](#contributing)
* [Authors](#authors)
* [Notes](#notes)
* [License](#license)

## What issues it solves?

`InMemoryEntityProvider` perfectly fits for development state. It allows you to avoid using backend service until you really need one. It supports all available methods provided by entity store. Also it's a good choice if you want to try things out and see how entity store is actually works.

## Installation

`InMemoryEntityProvider.TS` is available from NPM, both for browser (e.g. using webpack) and NodeJS:

```
npm i @dipscope/in-memory-entity-provider
```

_This package is a plugin for `EntityStore.TS` package. Please [read documentation](https://github.com/dipscope/EntityStore.TS) after installation._

## Configuration

Configuration is pretty simple. You have to just import and use it. No additional configuration is required. 

```typescript
import { InMemoryEntityProvider } from '@dipscope/in-memory-entity-provider';
import { AppEntityStore } from './app';

// Create entity provider.
const entityProvider = new InMemoryEntityProvider(); 

// Create entity store.
const appEntityStore = new AppEntityStore(entityProvider);
```

`InMemory` entity provider supports all methods defined in the `EntitySet`.

## Versioning

We use [SemVer](http://semver.org) for versioning. For the versions available, see the versions section on [NPM project page](https://www.npmjs.com/package/@dipscope/in-memory-entity-provider).

See information about breaking changes, release notes and migration steps between versions in [CHANGELOG.md](https://github.com/dipscope/InMemoryEntityProvider.TS/blob/main/CHANGELOG.md) file.

## Contributing

Please read [CONTRIBUTING.md](https://github.com/dipscope/InMemoryEntityProvider.TS/blob/main/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Authors

* **Dmitry Pimonov** - *Initial work* - [dpimonov](https://github.com/dpimonov)

See also the list of [contributors](https://github.com/dipscope/InMemoryEntityProvider.TS/contributors) who participated in this project.

## Notes

Thanks for checking this package.

Feel free to create an issue if you find any mistakes in documentation or have any improvements in mind.

We wish you good luck and happy coding!

## License

This project is licensed under the Apache 2.0 License - see the [LICENSE.md](https://github.com/dipscope/InMemoryEntityProvider.TS/blob/main/LICENSE.md) file for details.
