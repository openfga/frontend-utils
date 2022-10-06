@preprocessor typescript

types           -> (_newline):* (type (relations (define):+):*):* {%
    data => {
         // @ts-ignore
		const types = data[1].map((datum : any) => {
		    const relations = datum[1][0] ? datum[1][0][1].flat() : [];
		    return { ...datum[0], relations }
		})
		let schemaVersion = "1.0"
        // @ts-ignore
		types.forEach(type => {
             // @ts-ignore
			type.relations.forEach(relation => {
				if (relation.allowedTypes.length > 0) {
					schemaVersion = "1.1"
				}
			})
		})
		return {types: types, schemaVersion: schemaVersion}
	}	
	
%}

type            -> _multiline_comment _type _naming (_newline):+ {%
    data => ({ comment: data[0], type: data[2] })
%}
relations       -> _multiline_comment _relations {%
    data => data[1]
%}
define          -> (_newline):+ _multiline_comment define_initial (_relation_types):? _as (define_base | define_or | define_and | define_but_not) (_newline):* {%
    (data, _location, reject) => {
        const relation = data[2];

        // self and this are reserved keywords
        if (["self", "this"].includes(relation)) {
            return reject;
        }

        const def = data[5][0];
        const definition = def.type ? def :
            {
                type: 'single',
                targets: [def]
            }
		const allowedTypes = data[3] ? data[3][0] : []

        return { comment: data[1], allowedTypes, relation, definition };
    }
%}

define_initial      -> _define _naming {%
	data => data[1]
%}

define_base  -> _optional_space (_naming | from_phrase) _optional_space {%
    data => {
		const entry = data[1][0];
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
define_but_not  -> define_base _but_not define_base {%
    data => ({ base: data[0], diff: data[2], type: "exclusion" })
%}
from_phrase -> _naming _spacing _from _spacing _naming {%
    data => ({ target: data[0], from: data[4] })
%}

_multiline_comment        -> (_comment):* {%
    data => data.flat(3).join('\n')
%}
_comment        -> " ":* "#" _spacing _naming (_spacing _word):*  _newline {%
    data => data.flat(3).join('').trim().substring(1).trim()
%}
_word           -> ([a-z] | [A-Z] | [0-9] |  "_" |  "-" | "," | "&" | "+" | "/" | "$" ):+ _optional_space {%
    data => data.flat(3).join('').trim()
%}

_relation_types -> ":" _optional_space "[" _array_of_types "]" _spacing {%
    data => data[3]
%}

_array_of_types -> ("$"):? ([a-zA-Z0-9_#\-,\s]):+ {%
    data => data.flat(3).join('').split(",").map(i => i.trim())
%}

_from           -> "from"
_as             -> "as"
_or             -> "or"
_and            -> "and"
_but_not        -> "but not"

_self           -> "self"
_define          -> "    define" _spacing
_relations      -> "  relations" _optional_space
_type           -> "type" _spacing
_no_relations   -> "none" (_newline):*
_naming         -> (("$"):? ( [a-z] | [A-Z] | [0-9] |  "_" |  "-" ):+) _optional_space {%
    data => data.flat(3).join('').trim()
%}
_optional_space -> " ":*
_spacing        -> " ":+
_newline        -> _optional_space "\n"
