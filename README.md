# OpenFGA Syntax Transformer

The [OpenFGA](https://openfga.dev) API accepts a JSON syntax for the configuration of the authorization model. The OpenFGA docs showcase an alternate friendlier syntax that can be used to build an OpenFGA authorization model.

This module transforms between the JSON syntax accepted by the OpenFGA API and the friendlier syntax you see throughout the documentation.

## Table of Contents

- [About OpenFGA](#about-openfga)
- [Resources](#resources)
- [Installation](#installation)
- [Contributing](#contributing)
- [Author](#author)
- [License](#license)

## About OpenFGA

[OpenFGA](https://openfga.dev) is an open source Fine-Grained Authorization solution inspired by [Google's Zanzibar paper](https://research.google/pubs/pub48190/). It was created by the FGA team at [Auth0](https://auth0.com) based on [Auth0 Fine-Grained Authorization (FGA)](https://fga.dev), available under [a permissive license (Apache-2)](https://github.com/openfga/rfcs/blob/main/LICENSE) and welcomes community contributions.

OpenFGA is designed to make it easy for application builders to model their permission layer, and to add and integrate fine-grained authorization into their applications. OpenFGA’s design is optimized for reliability and low latency at a high scale.

It allows in-memory data storage for quick development, as well as pluggable database modules - with initial support for PostgreSQL.

It offers an [HTTP API](https://openfga.dev/docs/api) and has SDKs for programming languages including [Node.js/JavaScript](https://github.com/openfga/js-sdk), [GoLang](https://github.com/openfga/go-sdk) and [.NET](https://github.com/openfga/dotnet-sdk).

More SDKs and integrations such as Rego are planned for the future.

## Resources

- [OpenFGA Documentation](https://openfga.dev/docs)
- [OpenFGA API Documentation](https://openfga.dev/api)
- [Twitter](https://twitter.com/openfga)
- [OpenFGA Discord Community](https://discord.gg/8naAwJfWN6)
- [Zanzibar Academy](https://zanzibar.academy)
- [Google's Zanzibar Paper (2019)](https://research.google/pubs/pub48190/)

## Installation

```bash
npm install --save @openfga/syntax-transformer // OR yarn add @openfga/syntax-transformer
```

## Usage

### From the JSON Syntax to the Friendly Syntax
```javascript
const { apiSyntaxToFriendlySyntax } = require("@openfga/syntax-transformer");

const friendlySyntax = apiSyntaxToFriendlySyntax({
  "type_definitions": [
    {
      "type": "folder",
      "relations": {
        "editor": {
          "this": {}
        }
      }
    }
  ]
});
```
### From the Friendly Syntax to the JSON Syntax
```javascript
const { friendlySyntaxToApiSyntax } = require("@openfga/syntax-transformer");

const apiSyntax = friendlySyntaxToApiSyntax(`type document
  relations
    define blocked as self
    define editor as self but not blocked
type team
  relations
    define member as self
`);
```

## Configuration Syntaxes

The two below Syntaxes are equivalent. Find out more on OpenFGA's configuration language [here](https://openfga.dev/docs/configuration-language).

### JSON Syntax

```json
{
  "type_definitions": [
    {
      "type": "folder",
      "relations": {
        "editor": {
          "this": {}
        }
      }
    },
    {
      "type": "document",
      "relations": {
        "parent": {
          "this": {}
        },
        "editor": {
          "union": {
            "child": [
              {
                "this": {}
              },
              {
                "tupleToUserset": {
                  "tupleset": {
                    "object": "",
                    "relation": "parent"
                  },
                  "computedUserset": {
                    "object": "",
                    "relation": "editor"
                  }
                }
              }
            ]
          }
        }
      }
    }
  ]
}
```

### Friendly Syntax

```python
type folder
  relations
    define editor as self
type document
  relations
    define parent as self
    define editor as self or editor from parent

```

## Contributing
Take a look at our [Contributing Guide](./CONTRIBUTING.md)

## Author
[OpenFGA](https://openfga.dev) team

## License
[Apache-2.0](./LICENSE)
