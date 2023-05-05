import { AuthorizationModel as ApiAuthorizationModel } from "@openfga/sdk";

import { apiSyntaxToFriendlySyntax, SchemaVersion } from "../../..";
import { SINGLE_INDENTATION } from "../../../formatter/indent-dsl";
import { Keyword } from "../../../constants/keyword";
import { CompletionItem, CompletionList, ITextModel, VsCodeEditorType, Position } from "../vscode.types";

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

function getSuggestions(editor: VsCodeEditorType, samples: CompletionExtraOptions["samples"] = {}) {
  const suggestions: CompletionItem[] = [];
  ["entitlements", "expenses", "gdrive", "generic", "github", "iot", "slack", "customRoles"].forEach((key) => {
    const sampleModel = samples?.[key];
    if (sampleModel) {
      suggestions.push({
        label: `sample-${key}`,
        kind: editor.CompletionItemKind.Struct,
        insertText: apiSyntaxToFriendlySyntax(sampleModel),
      });
    }
  });
  return suggestions;
}

export const provideCompletionItemsOneDotOne =
  (editor: VsCodeEditorType, completionExtraOptions: CompletionExtraOptions = {}) =>
  (model: ITextModel, position: Position): CompletionList => {
    let suggestions: CompletionItem[] = [];

    if (position.character === 2) {
      suggestions = [
        {
          label: Keyword.TYPE,
          kind: editor.CompletionItemKind.Function,
          // eslint-disable-next-line no-template-curly-in-string
          insertText: `${Keyword.TYPE} \${1:typeName}
${SINGLE_INDENTATION}${Keyword.RELATIONS}
${SINGLE_INDENTATION}${SINGLE_INDENTATION}${Keyword.DEFINE} \${2:relationName}: [\${3:typeName}]`,
          insertTextFormat: editor.InsertTextFormat.PlainText,
          insertTextMode: editor.InsertTextMode.asIs,
        },
        {
          label: "type_group",
          kind: editor.CompletionItemKind.Class,
          // eslint-disable-next-line no-template-curly-in-string
          insertText: `${Keyword.TYPE} \${1:group}
${SINGLE_INDENTATION}${Keyword.RELATIONS}
${SINGLE_INDENTATION}${SINGLE_INDENTATION}${Keyword.DEFINE} \${2:member}: [\${3:user, group#member}]`,
          insertTextFormat: editor.InsertTextFormat.Snippet,
          insertTextMode: editor.InsertTextMode.asIs,
        },
        {
          label: Keyword.TYPE,
          kind: editor.CompletionItemKind.Keyword,
          insertText: Keyword.TYPE,
          insertTextFormat: editor.InsertTextFormat.PlainText,
          insertTextMode: editor.InsertTextMode.asIs,
        },
        {
          label: Keyword.MODEL,
          kind: editor.CompletionItemKind.Function,
          // eslint-disable-next-line no-template-curly-in-string
          insertText: `${Keyword.MODEL}
${SINGLE_INDENTATION}${Keyword.SCHEMA} ${SchemaVersion.OneDotOne}`,
          insertTextFormat: editor.InsertTextFormat.Snippet,
          insertTextMode: editor.InsertTextMode.asIs,
        },
        {
          label: Keyword.MODEL,
          kind: editor.CompletionItemKind.Keyword,
          insertText: Keyword.TYPE,
          insertTextFormat: editor.InsertTextFormat.PlainText,
          insertTextMode: editor.InsertTextMode.asIs,
        },
      ];
    } else if (position.character === 4) {
      suggestions = [
        {
          label: Keyword.RELATIONS,
          kind: editor.CompletionItemKind.Keyword,
          insertText: Keyword.RELATIONS,
          insertTextFormat: editor.InsertTextFormat.PlainText,
          insertTextMode: editor.InsertTextMode.asIs,
        },
      ];
    } else if (position.character > 6) {
      suggestions = [
        {
          label: Keyword.OR,
          kind: editor.CompletionItemKind.Operator,
          insertText: Keyword.OR,
          insertTextFormat: editor.InsertTextFormat.PlainText,
          insertTextMode: editor.InsertTextMode.asIs,
        },
        {
          label: Keyword.AND,
          kind: editor.CompletionItemKind.Operator,
          insertText: Keyword.AND,
          insertTextFormat: editor.InsertTextFormat.PlainText,
          insertTextMode: editor.InsertTextMode.asIs,
        },
        {
          label: Keyword.BUT_NOT,
          kind: editor.CompletionItemKind.Keyword,
          insertText: Keyword.BUT_NOT,
          insertTextFormat: editor.InsertTextFormat.PlainText,
          insertTextMode: editor.InsertTextMode.asIs,
        },
        {
          label: Keyword.FROM,
          kind: editor.CompletionItemKind.Function,
          // eslint-disable-next-line no-template-curly-in-string
          insertText: `\${1:relation1} ${Keyword.FROM} \${1:relation2}`,
          insertTextFormat: editor.InsertTextFormat.Snippet,
          insertTextMode: editor.InsertTextMode.asIs,
        },
        {
          label: Keyword.FROM,
          kind: editor.CompletionItemKind.Keyword,
          insertText: Keyword.FROM,
          insertTextFormat: editor.InsertTextFormat.PlainText,
          insertTextMode: editor.InsertTextMode.asIs,
        },
      ];
    } else if (position.character === 6) {
      suggestions = [
        {
          label: "define-assignable",
          kind: editor.CompletionItemKind.Property,
          // eslint-disable-next-line no-template-curly-in-string
          insertText: "define ${1:relationName}: [${2:typeName}]",
          insertTextFormat: editor.InsertTextFormat.Snippet,
          insertTextMode: editor.InsertTextMode.asIs,
        },
        {
          label: "define-from-other-relation",
          kind: editor.CompletionItemKind.Property,
          // eslint-disable-next-line no-template-curly-in-string
          insertText: "define ${1:relationName}: ${2:otherRelationName}",
          insertTextFormat: editor.InsertTextFormat.Snippet,
          insertTextMode: editor.InsertTextMode.asIs,
        },
        {
          label: "define-from-other-relation-assignable",
          kind: editor.CompletionItemKind.Property,
          // eslint-disable-next-line no-template-curly-in-string
          insertText: "define ${1:relationName}: [${2:typeName}] or ${3:otherRelationName}",
          insertTextFormat: editor.InsertTextFormat.Snippet,
          insertTextMode: editor.InsertTextMode.asIs,
        },
        {
          label: "define-from-object",
          kind: editor.CompletionItemKind.Property,
          // eslint-disable-next-line no-template-curly-in-string
          insertText: "define ${1:relationName}: ${2:relationInRelatedObject} from ${3:relationInThisType}}",
          insertTextFormat: editor.InsertTextFormat.Snippet,
          insertTextMode: editor.InsertTextMode.asIs,
        },
        {
          label: "define",
          kind: editor.CompletionItemKind.Keyword,
          insertText: "define",
          insertTextFormat: editor.InsertTextFormat.PlainText,
          insertTextMode: editor.InsertTextMode.asIs,
        },
      ];
    } else {
      suggestions = getSuggestions(editor, completionExtraOptions.samples);
    }

    return editor.CompletionList.create(suggestions);
  };

export const provideCompletionItems =
  (editor: VsCodeEditorType, completionExtraOptions: CompletionExtraOptions = {}) =>
  (model: ITextModel, position: Position): CompletionList => {
    return provideCompletionItemsOneDotOne(editor, completionExtraOptions)(model, position);
  };
