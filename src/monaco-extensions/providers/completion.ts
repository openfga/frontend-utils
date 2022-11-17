/* eslint-disable max-len */

import type * as MonacoEditor from "monaco-editor";
import type { editor, languages, Position } from "monaco-editor";

import { SINGLE_INDENTATION } from "../../formatter/indent-dsl";
import { Keyword } from "../../constants/keyword";
import { assertNever } from "../../inner-utils/assert-never";
import { SchemaVersion } from "../../constants/schema-version";

const provideCompletionItemsOneDotZero =
  (monaco: typeof MonacoEditor) =>
  (model: editor.ITextModel, position: Position): languages.CompletionList => {
    const word = model.getWordUntilPosition(position);
    const range = {
      startLineNumber: position.lineNumber,
      endLineNumber: position.lineNumber,
      startColumn: word.startColumn,
      endColumn: word.endColumn,
    };

    if (position.column === 2) {
      return {
        suggestions: [
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
        ],
      };
    }

    if (position.column === 4) {
      return {
        suggestions: [
          {
            label: Keyword.RELATIONS,
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: Keyword.RELATIONS,
            range,
          },
        ],
      };
    }

    if (position.column > 6) {
      return {
        suggestions: [
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
        ],
      };
    }

    if (position.column === 6) {
      return {
        suggestions: [
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
        ],
      };
    }

    return {
      suggestions: [
        {
          label: "sample-gdrive",
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: `# Google Drive Sample
type user
type group
  relations
    define member as self
type folder
  relations
    define owner as self
    define parent as self
    define viewer as self or owner or viewer from parent
    define can_create_file as owner
type doc
  relations
    define owner as self
    define parent as self
    define viewer as self
    define can_change_owner as owner
    define can_share as owner or owner from parent
    define can_write as owner or owner from parent
    define can_read as viewer or owner or viewer from parent`,
          range,
        },
        {
          label: "sample-expenses",
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: `# Expenses Sample
type employee
  relations
    define manager as self
    define can_manage as manager or can_manage from manager
type report
  relations
    define submitter as self
    define approver as can_manage from submitter`,
          range,
        },
        {
          label: "sample-github",
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: `# GitHub Sample
type user
type organization
  relations
    define owner as self
    define member as self or owner
    define repo_admin as self
    define repo_reader as self
    define repo_writer as self
type team
  relations
    define member as self
type repo
  relations
    define owner as self
    define admin as self or repo_admin from owner
    define maintainer as self or admin
    define writer as self or maintainer or repo_writer from own
    define triager as self or writerer
    define reader as self or triager or repo_reader from owner`,
          range,
        },
      ],
    };
  };

const provideCompletionItemsOneDotOne =
  (monaco: typeof MonacoEditor) =>
  (model: editor.ITextModel, position: Position): languages.CompletionList => {
    const word = model.getWordUntilPosition(position);
    const range = {
      startLineNumber: position.lineNumber,
      endLineNumber: position.lineNumber,
      startColumn: word.startColumn,
      endColumn: word.endColumn,
    };

    if (position.column === 2) {
      return {
        suggestions: [
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
        ],
      };
    }

    if (position.column === 4) {
      return {
        suggestions: [
          {
            label: Keyword.RELATIONS,
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: Keyword.RELATIONS,
            range,
          },
        ],
      };
    }

    if (position.column > 6) {
      return {
        suggestions: [
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
        ],
      };
    }

    if (position.column === 6) {
      return {
        suggestions: [
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
        ],
      };
    }

    return {
      suggestions: [
        {
          label: "sample-gdrive",
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: `# Google Drive Sample
${Keyword.TYPE} user
${Keyword.TYPE} folder
${SINGLE_INDENTATION}${Keyword.RELATIONS}
${SINGLE_INDENTATION}${SINGLE_INDENTATION}${Keyword.DEFINE}parent: [folder]
${SINGLE_INDENTATION}${SINGLE_INDENTATION}${Keyword.DEFINE}owner: [user]
${SINGLE_INDENTATION}${SINGLE_INDENTATION}${Keyword.DEFINE}editor: [user]
${SINGLE_INDENTATION}${SINGLE_INDENTATION}${Keyword.DEFINE}viewer: [user]
${SINGLE_INDENTATION}${SINGLE_INDENTATION}${Keyword.DEFINE}can_create_file: owner
${SINGLE_INDENTATION}${SINGLE_INDENTATION}${Keyword.DEFINE}can_delete: owner
${SINGLE_INDENTATION}${SINGLE_INDENTATION}${Keyword.DEFINE}can_edit: editor ${Keyword.OR} owner
${SINGLE_INDENTATION}${SINGLE_INDENTATION}${Keyword.DEFINE}can_view: viewer ${Keyword.OR} editor ${Keyword.OR} owner
${Keyword.TYPE} folder
${SINGLE_INDENTATION}${Keyword.RELATIONS}
${SINGLE_INDENTATION}${SINGLE_INDENTATION}${Keyword.DEFINE}parent: [folder]
${SINGLE_INDENTATION}${SINGLE_INDENTATION}${Keyword.DEFINE}owner: [user] or owner from parent
${SINGLE_INDENTATION}${SINGLE_INDENTATION}${Keyword.DEFINE}editor: [user] or editor from parent
${SINGLE_INDENTATION}${SINGLE_INDENTATION}${Keyword.DEFINE}viewer: [user] or viewer from parent
${SINGLE_INDENTATION}${SINGLE_INDENTATION}${Keyword.DEFINE}can_create_file: owner
${SINGLE_INDENTATION}${SINGLE_INDENTATION}${Keyword.DEFINE}can_delete: owner
${SINGLE_INDENTATION}${SINGLE_INDENTATION}${Keyword.DEFINE}can_edit: editor ${Keyword.OR} owner
${SINGLE_INDENTATION}${SINGLE_INDENTATION}${Keyword.DEFINE}can_view: viewer ${Keyword.OR} editor ${Keyword.OR} owner`,
          range,
        },
      ],
    };
  };

export const provideCompletionItems =
  (monaco: typeof MonacoEditor, schemaVersion = SchemaVersion.OneDotZero) =>
  (model: editor.ITextModel, position: Position): languages.ProviderResult<languages.CompletionList> => {
    switch (schemaVersion) {
      case SchemaVersion.OneDotZero:
        return provideCompletionItemsOneDotZero(monaco)(model, position);
      case SchemaVersion.OneDotOne:
        return provideCompletionItemsOneDotOne(monaco)(model, position);
      default:
        assertNever(schemaVersion);
    }
  };
