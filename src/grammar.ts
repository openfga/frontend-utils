import { Parser, Grammar } from "nearley";
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import * as compile from "nearley/lib/compile";
// @ts-ignore
import * as generate from "nearley/lib/generate";
// @ts-ignore
import * as nearleyGrammar from "nearley/lib/nearley-language-bootstrapped";
/* eslint-enable @typescript-eslint/ban-ts-comment */

// From: https://github.com/paul-kline/bnf-playground/blob/7e0155dc9a3aa92f507be27a6d04f663bc504e85/ts/BNFController.ts
function compileGrammar(sourceCode: string): Grammar {
  const grammarParser = new Parser(nearleyGrammar);
  grammarParser.feed(sourceCode);
  const grammarAst = grammarParser.results[0];
  const grammarInfoObject = compile(grammarAst, {});
  const grammarJs = generate(grammarInfoObject, "grammar");
  const module = { exports: {} };
  // eslint-disable-next-line no-eval
  eval(grammarJs);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  return module.exports;
}

export const grammar: Grammar = compileGrammar(`
types           -> (_newline):* (type relations (_no_relations | (define_or | define_and | define_but_not | define_base):*)):* 

type            -> (_comment):* _type _naming (_newline):+
relations       -> (_comment):* _relations
define_or       -> (_comment):* (define_raw (_or):+) (_newline):*
define_and      -> (_comment):* (define_raw (_and):+) (_newline):*
define_but_not  -> (_comment):* (define_raw (_but_not):+) (_newline):*
define_base     -> (_comment):* define_raw (_newline):*
define_raw      -> _define _naming _spacing _as (_naming | _from)

_as             -> "as" _spacing
_or             -> "or" _spacing (_naming | _from)
_and            -> "and" _spacing (_naming | _from)
_but_not        -> "but not" _spacing (_naming | _from)
_from           -> _naming _spacing "from" _spacing _naming

_define         -> (_newline):+ "    define" _spacing
_relations      -> "  relations" _optional_space
_type           -> "type" _spacing
_no_relations   -> "none" (_newline):*
_naming         -> (("$"):? ( [a-z] | [A-Z] | [0-9] |  "_" |  "-" ):+) " ":*
_comment        -> " ":* "#" _spacing [\\w]:* " ":* _newline
_optional_space -> " ":*
_spacing        -> " ":+
_newline        -> _optional_space "\\n"
`);
