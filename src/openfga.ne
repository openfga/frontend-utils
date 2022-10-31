@preprocessor typescript

types           ->   (_newline):* (model_schema):? (type (_relations (_multiline_comment define):+):*):* {%
    // @ts-ignore
    (data) => {
        // @ts-ignore
        const types = data[2].map((datum) => {
            // @ts-ignore
            const relations = (datum[1] && datum[1][0] && datum[1][0][1].map(innerDatum => innerDatum[1])) || [];

            return { ...datum[0], relations }
        })

        // @ts-ignore
        const schemaVersion = data[1]? data[1].flat(3).join("") : "1.0";

        return {types: types, schemaVersion: schemaVersion}
    }
%}

model_schema    ->  _multiline_comment _model (_newline):+ _schema _spacing _version (_newline):+ {%
    data => data[5]
%}

type            ->  _multiline_comment _type _naming (_newline):+{%
    data => ({ comment: data[0], type: data[2] })
%}
relations       ->  _relations {%
    data => data[0]
%}
define          ->  _newline define_initial (_spacing | _relation_types) _as _spacing (define_base | define_or | define_and | define_but_not) (_newline):*  {%
    (data, _location, reject) => {
        const relation = data[1];
        // Not supported yet
        const comment = "";
        const def = data[5][0];
        const definition = def.type ? def :
            {
                type: 'single',
                targets: [def]
            }
        let allowedTypes = data[2] ? data[2][0] : [];
        if (allowedTypes.length && typeof allowedTypes[0] !== "string") {
          allowedTypes = [];
        }

        return { comment, allowedTypes, relation, definition };
    }
%}

define_initial      -> _define _naming {%
	data => data[1]
%}

define_base  ->  (_naming | from_phrase) {%
    data => {
		const entry = data[0][0];
		let target, rewrite, from
		if (typeof entry === "string") {
			if (entry === "self") {
				rewrite = "direct";
			} else {
				rewrite = "computed_userset";
				target = entry;
			}
		} else {
			from = entry.from;
		    target = entry.target;
			rewrite = "tuple_to_userset";
		}
		return { rewrite, target, from  }
	}
%}

define_or       -> define_base (_spacing _or _spacing define_base):+ {%
    // @ts-ignore
    data => ({ targets: [data[0], ...data[1].map((datum) => datum[3])], type: "union" })
%}
define_and      -> define_base (_spacing _and _spacing define_base):+ {%
    // @ts-ignore
    data => ({ targets: [data[0], ...data[1].map((datum) => datum[3])], type: "intersection" })
%}
define_but_not  -> define_base _spacing _but_not _spacing define_base {%
    data => ({ base: data[0], diff: data[4], type: "exclusion" })
%}
from_phrase -> _naming _spacing _from _spacing _naming {%
    data => ({ target: data[0], from: data[4] })
%}

_multiline_comment        -> (_comment):* {%
    data => data.flat(3).join('\n')
%}
_comment        -> (_newline):?  _optional_space "#" _optional_space _word (_spacing _word):*  (_newline):?  {%
    data => data.flat(3).join('').trim().substring(1).trim()
%}
_word           -> ([a-z] | [A-Z] | [0-9] |  "_" |  "-" | "," | "&" | "+" | "/" | "$" ):+ _optional_space {%
    data => data.flat(3).join('').trim()
%}

_relation_types -> _optional_space ":" _optional_space "[" _array_of_types "]" _spacing {%
    data => data[4]
%}

_array_of_types -> ("$"):? ([a-zA-Z0-9_#\-,\s]):* {%
    data => data.flat(3).join('').split(",").map(i => i.trim()).filter(word => word.length)
%}

_from           -> "from"
_as             -> "as"
_or             -> "or"
_and            -> "and"
_but_not        -> "but not"

_self           -> "self"
_define          -> "    define" _spacing
_relations      -> "  relations" (_newline):*
_type           -> "type" _spacing
_no_relations   -> "none" (_newline):*
_naming         -> (("$"):? ( [a-z] | [A-Z] | [0-9] |  "_" |  "-" ):+) {%
    data => data.flat(3).join('').trim()
%}
_optional_space -> " ":*
_spacing        -> " ":+
_newline        -> _optional_space "\n"
_model          -> "model"
_schema         -> "  schema"
_period         -> "."
_version        -> (([0-9]):+) _period (([0-9]):+)
