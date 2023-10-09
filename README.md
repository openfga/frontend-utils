# OpenFGA Frontend Utils

Exposes helpful utilities for building authoring experiences of OpenFGA Models.

Currently used in the OpenFGA Docs and the FGA Playground to provide theming, model validation and diagnostics and graphic capabilities.

[![npm](https://img.shields.io/npm/v/@openfga/frontend-utils.svg?style=flat)](https://www.npmjs.com/package/@openfga/frontend-utils)
[![Release](https://img.shields.io/github/v/release/openfga/frontend-utils?sort=semver&color=green)](https://github.com/openfga/frontend-utils/releases)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](./LICENSE)
[![FOSSA Status](https://app.fossa.com/api/projects/custom%2B4989%2Fgithub.com%2Fopenfga%2Ffrontend-utils.svg?type=shield)](https://app.fossa.com/reports/fb48e89d-655d-4656-8c7d-4eaa77e19e72)
[![Discord Server](https://img.shields.io/discord/759188666072825867?color=7289da&logo=discord "Discord Server")](https://discord.gg/8naAwJfWN6)
[![Twitter](https://img.shields.io/twitter/follow/openfga?color=%23179CF0&logo=twitter&style=flat-square "@openfga on Twitter")](https://twitter.com/openfga)

## Table of Contents

- [About OpenFGA](#about-openfga)
- [Resources](#resources)
- [Syntax Transformer & CLI](#syntax-transformer--cli)
- [Installation](#installation)
- [Features](#features)
- [Usage](#usage)
- [Contributing](#contributing)
- [Author](#author)
- [License](#license)

## About OpenFGA

[OpenFGA](https://openfga.dev) is an open source Fine-Grained Authorization solution inspired by [Google's Zanzibar paper](https://research.google/pubs/pub48190/). It was created by the FGA team at [Auth0](https://auth0.com) based on [Auth0 Fine-Grained Authorization (FGA)](https://fga.dev), available under [a permissive license (Apache-2)](https://github.com/openfga/rfcs/blob/main/LICENSE) and welcomes community contributions.

OpenFGA is designed to make it easy for application builders to model their permission layer, and to add and integrate fine-grained authorization into their applications. OpenFGA’s design is optimized for reliability and low latency at a high scale.

It allows in-memory data storage for quick development, as well as pluggable database modules - with initial support for PostgreSQL.

It offers an [HTTP API](https://openfga.dev/api/service) and a [gRPC API](https://buf.build/openfga/api/file/main:openfga/v1/openfga_service.proto). It has SDKs for [Node.js/JavaScript](https://www.npmjs.com/package/@openfga/sdk), [GoLang](https://github.com/openfga/go-sdk), [Python](https://github.com/openfga/python-sdk) and [.NET](https://www.nuget.org/packages/OpenFga.Sdk). Look in our [Community section](https://github.com/openfga/community#community-projects) for third-party SDKs and tools.

More SDKs and integrations such as Rego are planned for the future.

## Resources

- [OpenFGA Documentation](https://openfga.dev/docs)
- [OpenFGA API Documentation](https://openfga.dev/api)
- [Twitter](https://twitter.com/openfga)
- [OpenFGA Discord Community](https://discord.gg/8naAwJfWN6)
- [Zanzibar Academy](https://zanzibar.academy)
- [Google's Zanzibar Paper (2019)](https://research.google/pubs/pub48190/)

## Syntax Transformer & CLI

The Syntax Transformer has a new home in the [language repo](https://github.com/openfga/language).

The CLI can now be found at https://github.com/openfga/cli.

## Installation

```bash
npm install --save @openfga/frontend-utils
```

## Features

- Theming (for Monaco and Prism)
- Graphing
- Diagnostics (for Monaco and VS Code)
- Snippets (for Monaco and VS Code)
- Hover suggestions (for Monaco and VS Code)

## Usage

TBD

## Contributing
Take a look at our [Contributing Guide](./CONTRIBUTING.md)

## Author
[OpenFGA](https://openfga.dev) team

## License
[Apache-2.0](./LICENSE)
