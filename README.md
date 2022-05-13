# OpenFGA Syntax Transformer

The [OpenFGA](https://openfga.dev) API accepts a JSON syntax for the configuration of the authorization model. The OpenFGA docs showcase an alternate friendlier syntax that can be used to build an OpenFGA authorization model.

This module transforms between the JSON syntax accepted by the OpenFGA API and the friendlier syntax you see throughout the documentation.

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