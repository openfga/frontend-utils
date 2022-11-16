@preprocessor typescript

types           ->  (types_10 | types_10_defined | types_11) {%
     data => {return (data[0][0]) ? data[0][0]: (data[0][1]) ? data[0][1] : data[0][2]}
%}

types_10           ->   (_newline):* (type (_relations (_multiline_comment define_10):+):*):* {%
    // @ts-ignore
    (data) => {
        // @ts-ignore
        const types = data[1].map((datum) => {
            // @ts-ignore
            const relations = (datum[1] && datum[1][0] && datum[1][0][1].map(innerDatum => innerDatum[1])) || [];

            return { ...datum[0], relations }
        })

        // @ts-ignore
        const schemaVersion = "1.0";

        return {types: types, schemaVersion: schemaVersion}
    }
%}

types_10_defined ->   (_newline):* model_schema_10 (type (_relations (_multiline_comment define_10):+):*):* {%
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

types_11   ->   (_newline):* model_schema_11 (type (_relations (_multiline_comment define_11):+):*):* {%
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

model_schema_10    ->  _multiline_comment _model (_newline):+ _schema _spacing _version_10 (_newline):+ {%
    data => data[5]
%}

model_schema_11   ->  _multiline_comment _model (_newline):+ _schema _spacing _version_11 (_newline):+ {%
    data => data[5]
%}


type            ->  _multiline_comment _type _naming (_newline):+{%
    data => ({ comment: data[0], type: data[2] })
%}
relations       ->  _relations {%
    data => data[0]
%}

define_10          ->  _newline define_initial _spacing _as _spacing (define_base | define_or | define_and | define_but_not) (_newline):*  {%
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
        // Note that this is in typescript.  Thus, if the grammer is to be used in js only environment, remove the type
        const allowedTypes: string[] = [];

        return { comment, allowedTypes, relation, definition};
    }
%}

define_11          ->  _newline define_initial _colon _spacing (define_base_11 | define_or_11 | define_and_11 | define_but_not_11) (_newline):*  {%
    (data, _location, reject) => {
        const relation = data[1];
        // Not supported yet
        const comment = "";
        const def = data[4][0];
        const definition = def.type ? def :
            {
                type: 'single',
                targets: [def]
            }
        const allowedTypes = def.allowedTypes;

        return { comment, allowedTypes, relation, definition};
    }
%}

define_initial      -> _define _naming {%
    data => data[1]
%}

define_base  ->  ( _naming | from_phrase) {%
    data => {
        const entry = data[0][0];
        let target, rewrite, from;
        // Note that this is in typescript.  Thus, if the grammer is to be used in js only environment, remove the type
        const allowedTypes: string[] = [];
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
        return { rewrite, target, from, allowedTypes  }
    }
%}

define_base_11  ->  (_relation_types | _naming | from_phrase) {%
    data => {
        if (data[0][0].allowedTypes) {
            return {rewrite: "direct", target: null, from: null, allowedTypes: data[0][0].allowedTypes}
        }
        const entry = data[0][0];
        let target, rewrite, from;
        // Note that this is in typescript.  Thus, if the grammer is to be used in js only environment, remove the type
        const allowedTypes: string[] = [];
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
        return { rewrite, target, from, allowedTypes  }
    }
%}

define_or       -> define_base (_spacing _or _spacing define_base):+ {%
    // @ts-ignore
    data => ({ targets: [data[0], ...data[1].map((datum) => datum[3])], type: "union", allowedTypes:[]  })
%}

define_or_11       -> define_base_11 (_spacing _or _spacing define_base_11):+ {%
    // @ts-ignore
    data => ({ targets: [data[0], ...data[1].map((datum) => datum[3])], type: "union", allowedTypes: data[0].allowedTypes.concat(...data[1].map((datum) => datum[3].allowedTypes)) })
%}

define_and      -> define_base (_spacing _and _spacing define_base):+ {%
    // @ts-ignore
    data => ({ targets: [data[0], ...data[1].map((datum) => datum[3])], type: "intersection", allowedTypes: []  })
%}

define_and_11      -> define_base_11 (_spacing _and _spacing define_base_11):+ {%
    // @ts-ignore
    data => ({ targets: [data[0], ...data[1].map((datum) => datum[3])], type: "intersection", allowedTypes: data[0].allowedTypes.concat(...data[1].map((datum) => datum[3].allowedTypes))  })
%}

define_but_not  -> define_base _spacing _but_not _spacing define_base {%
    data => ({ base: data[0], diff: data[4], type: "exclusion", allowedTypes: [] })
%}

define_but_not_11  -> define_base_11 _spacing _but_not _spacing define_base_11 {%
    data => ({ base: data[0], diff: data[4], type: "exclusion", allowedTypes: data[0].allowedTypes })
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

_colon -> _optional_space ":"

_relation_types ->  "[" _optional_space (_array_of_types):? "]" {%
    data => (data[2])? {allowedTypes: data[2][0]} : {allowedTypes: []}
%}

_array_of_types -> (_allowed_naming _optional_space _comma _optional_space):* _allowed_naming _optional_space {%
    data => {
        if (data[0].length) {
            // @ts-ignore
            return [...data[0].map((datum) => datum[0]), data[1]];
        }
        return [data[1]];
    }
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
_allowed_naming         -> (("$"):? ( [a-z] | [A-Z] | [0-9] |  "_" |  "-" | "#" ):+ (":*"):?) {%
    data => data.flat(3).join('').trim()
%}
_optional_space -> " ":*
_spacing        -> " ":+
_newline        -> _optional_space "\n"
_model          -> "model"
_schema         -> "  schema"
_period         -> "."
_comma          -> ","
_version        -> (([0-9]):+) _period (([0-9]):+)
_version_10     -> "1.0"
_version_11     -> "1.1"