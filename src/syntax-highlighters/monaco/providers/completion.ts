import type * as MonacoEditor from "monaco-editor";
import type { editor, languages, Position } from "monaco-editor";

import { SINGLE_INDENTATION } from "../../../formatter/indent-dsl";
import { Keyword } from "../../../constants/keyword";
import { assertNever } from "../../../inner-utils/assert-never";
import { SchemaVersion } from "../../../constants/schema-version";
import { apiSyntaxToFriendlySyntax } from "../../../";
import { AuthorizationModel as ApiAuthorizationModel } from "@openfga/sdk";

type AuthorizationModel = Required<Pick<ApiAuthorizationModel, "schema_version" | "type_definitions">>;

export type CompletionExtraOptions = {
  samples?: Record<string, AuthorizationModel> & {
    entitlements?: AuthorizationModel;
    expenses?: AuthorizationModel;
    gdrive?: AuthorizationModel;
    generic?: AuthorizationModel;
    github?: AuthorizationModel;
    iot?: AuthorizationModel;
    slack?: AuthorizationModel;
    customRoles?: AuthorizationModel;
  };
};

function getSuggestions(
  monaco: typeof MonacoEditor,
  range: MonacoEditor.IRange | languages.CompletionItemRanges,
  schemaVersion: SchemaVersion,
  samples: CompletionExtraOptions["samples"] = {},
) {
  const suggestions: languages.CompletionItem[] = [];
  ["entitlements", "expenses", "gdrive", "generic", "github", "iot", "slack", "customRoles"].forEach((key) => {
    const sampleModel = samples?.[key];
    if (sampleModel) {
      suggestions.push({
        label: `sample-${key}`,
        kind: monaco.languages.CompletionItemKind.Struct,
        insertText: apiSyntaxToFriendlySyntax(
          schemaVersion === SchemaVersion.OneDotOne
            ? sampleModel
            : {
                schema_version: SchemaVersion.OneDotZero,
                type_definitions: sampleModel.type_definitions.map((typeDef) => ({
                  type: typeDef.type,
                  relations: typeDef.relations,
                })),
              },
        ),
        range,
      });
    }
  });
  return suggestions;
}

const provideCompletionItemsOneDotZero =
  (monaco: typeof MonacoEditor, completionExtraOptions: CompletionExtraOptions = {}) =>
  (model: editor.ITextModel, position: Position): languages.CompletionList => {
    let suggestions: languages.CompletionItem[] = [];
    const word = model.getWordUntilPosition(position);
    const range = {
      startLineNumber: position.lineNumber,
      endLineNumber: position.lineNumber,
      startColumn: word.startColumn,
      endColumn: word.endColumn,
    };

    if (position.column === 2) {
      suggestions = [
        {
          label: Keyword.TYPE,
          kind: monaco.languages.CompletionItemKind.Function,
          // eslint-disable-next-line no-template-curly-in-string
          insertText: `${Keyword.TYPE} \${1:typeName}
  ${Keyword.RELATIONS}
    ${Keyword.DEFINE} \${2:relation} as \${3:self}`,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range,
        },
        {
          label: "type_group",
          kind: monaco.languages.CompletionItemKind.Function,
          // eslint-disable-next-line no-template-curly-in-string
          insertText: `${Keyword.TYPE} \${1:group}
  ${Keyword.RELATIONS}
    ${Keyword.DEFINE} \${2:member} as \${3:self}`,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range,
        },
        {
          label: Keyword.TYPE,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: Keyword.TYPE,
          range,
        },
      ];
    } else if (position.column === 4) {
      suggestions = [
        {
          label: Keyword.RELATIONS,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: Keyword.RELATIONS,
          range,
        },
      ];
    } else if (position.column > 6) {
      suggestions = [
        {
          label: Keyword.OR,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: Keyword.OR,
          range,
        },
        {
          label: Keyword.AS,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: Keyword.AS,
          range,
        },
        {
          label: Keyword.SELF,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: Keyword.SELF,
          range,
        },
        {
          label: Keyword.FROM,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: Keyword.FROM,
          range,
        },
      ];
    } else if (position.column === 6) {
      suggestions = [
        {
          label: "define",
          kind: monaco.languages.CompletionItemKind.Function,
          // eslint-disable-next-line no-template-curly-in-string
          insertText: "define ${1:relation} as ${2:self}",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range,
        },
        {
          label: "define-from-other-relation",
          kind: monaco.languages.CompletionItemKind.Function,
          // eslint-disable-next-line no-template-curly-in-string
          insertText: "define ${1:relation} as ${2:other_relation}",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range,
        },
        {
          label: "define-from-object",
          kind: monaco.languages.CompletionItemKind.Function,
          // eslint-disable-next-line no-template-curly-in-string
          insertText: "define ${1:relation} as ${2:relation_in_other_object} from ${2:another_relation}",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range,
        },
        {
          label: "define",
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: "define",
          range,
        },
      ];
    } else {
      suggestions = getSuggestions(monaco, range, SchemaVersion.OneDotOne, completionExtraOptions.samples);
    }

    return {
      suggestions,
    };
  };

const provideCompletionItemsOneDotOne =
  (monaco: typeof MonacoEditor, completionExtraOptions: CompletionExtraOptions = {}) =>
  (model: editor.ITextModel, position: Position): languages.CompletionList => {
    let suggestions: languages.CompletionItem[] = [];
    const word = model.getWordUntilPosition(position);
    const range = {
      startLineNumber: position.lineNumber,
      endLineNumber: position.lineNumber,
      startColumn: word.startColumn,
      endColumn: word.endColumn,
    };

    if (position.column === 2) {
      suggestions = [
        {
          label: Keyword.TYPE,
          kind: monaco.languages.CompletionItemKind.Function,
          // eslint-disable-next-line no-template-curly-in-string
          insertText: `${Keyword.TYPE} \${1:typeName}
${SINGLE_INDENTATION}${Keyword.RELATIONS}
${SINGLE_INDENTATION}${SINGLE_INDENTATION}${Keyword.DEFINE} \${2:relationName}: [\${3:typeName}]`,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range,
        },
        {
          label: "type_group",
          kind: monaco.languages.CompletionItemKind.Function,
          // eslint-disable-next-line no-template-curly-in-string
          insertText: `${Keyword.TYPE} \${1:group}
${SINGLE_INDENTATION}${Keyword.RELATIONS}
${SINGLE_INDENTATION}${SINGLE_INDENTATION}${Keyword.DEFINE} \${2:member}: [\${3:user, group#member}]`,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range,
        },
        {
          label: Keyword.TYPE,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: Keyword.TYPE,
          range,
        },
        {
          label: Keyword.MODEL,
          kind: monaco.languages.CompletionItemKind.Function,
          // eslint-disable-next-line no-template-curly-in-string
          insertText: `${Keyword.MODEL}
${SINGLE_INDENTATION}${Keyword.SCHEMA} \${1:1.1}`,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range,
        },
        {
          label: Keyword.MODEL,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: Keyword.TYPE,
          range,
        },
      ];
    } else if (position.column === 4) {
      suggestions = [
        {
          label: Keyword.RELATIONS,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: Keyword.RELATIONS,
          range,
        },
      ];
    } else if (position.column > 6) {
      suggestions = [
        {
          label: Keyword.OR,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: Keyword.OR,
          range,
        },
        {
          label: Keyword.AND,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: Keyword.AND,
          range,
        },
        {
          label: Keyword.BUT_NOT,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: Keyword.BUT_NOT,
          range,
        },
        {
          label: Keyword.FROM,
          kind: monaco.languages.CompletionItemKind.Function,
          // eslint-disable-next-line no-template-curly-in-string
          insertText: `\${1:relation1} ${Keyword.FROM} \${1:relation2}`,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range,
        },
        {
          label: Keyword.FROM,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: Keyword.FROM,
          range,
        },
      ];
    } else if (position.column === 6) {
      suggestions = [
        {
          label: "define-assignable",
          kind: monaco.languages.CompletionItemKind.Function,
          // eslint-disable-next-line no-template-curly-in-string
          insertText: "define ${1:relationName}: [${2:typeName}]",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range,
        },
        {
          label: "define-from-other-relation",
          kind: monaco.languages.CompletionItemKind.Function,
          // eslint-disable-next-line no-template-curly-in-string
          insertText: "define ${1:relationName}: ${2:otherRelationName}",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range,
        },
        {
          label: "define-from-other-relation-assignable",
          kind: monaco.languages.CompletionItemKind.Function,
          // eslint-disable-next-line no-template-curly-in-string
          insertText: "define ${1:relationName}: [${2:typeName}] or ${3:otherRelationName}",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range,
        },
        {
          label: "define-from-object",
          kind: monaco.languages.CompletionItemKind.Function,
          // eslint-disable-next-line no-template-curly-in-string
          insertText: "define ${1:relationName}: ${2:relationInRelatedObject} from ${3:relationInThisType}}",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range,
        },
        {
          label: "define",
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: "define",
          range,
        },
      ];
    } else {
      suggestions = getSuggestions(monaco, range, SchemaVersion.OneDotOne, completionExtraOptions.samples);
    }

    return {
      suggestions,
    };
  };

export const provideCompletionItems =
  (
    monaco: typeof MonacoEditor,
    schemaVersion = SchemaVersion.OneDotZero,
    completionExtraOptions: CompletionExtraOptions = {},
  ) =>
  (model: editor.ITextModel, position: Position): languages.ProviderResult<languages.CompletionList> => {
    switch (schemaVersion) {
      case SchemaVersion.OneDotZero:
        return provideCompletionItemsOneDotZero(monaco, completionExtraOptions)(model, position);
      case SchemaVersion.OneDotOne:
        return provideCompletionItemsOneDotOne(monaco, completionExtraOptions)(model, position);
      default:
        assertNever(schemaVersion);
    }
  };
