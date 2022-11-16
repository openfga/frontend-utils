/* eslint-disable max-len */

import { Keyword } from "../../keyword";
import type * as MonacoEditor from "monaco-editor";
import type { editor, languages, Position } from "monaco-editor";
import { SchemaVersion } from "../../parser";
import { assertNever } from "../../inner-utils/assert-never";

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
# There are users
type user
# there are group
type group
  relations
    # a group can have members
    define member as self
# there are folders
type folder
  relations
    # folders can have owners
    define owner as self
    # folders can have parent folders
    define parent as self
    # folders can have viewers; viewers are:
    # - those with whom the folder has been directly shared (self)
    # - those who are ownwers of the folder (owner)
    # - those who are viewers of the parent of the folder (viewer from parent)
    define viewer as self or owner or viewer from parent
    # folders have the create file permissions; only owners can have this permission and it cannot be directly granted (no self)
    define can_create_file as owner
# there are documents
type doc
  relations
    # documents have owners
    define owner as self
    # documents have parent folders
    define parent as self
    # documents have viewers
    define viewer as self
    # documents have the change owner permission; only owners can have this permission and it cannot be directly granted (no self)
    define can_change_owner as owner
    # documents have the share permission; only owners or the owners of the parent folder (owner from parent) have this permissions and it cannot be directly granted (no self)
    define can_share as owner or owner from parent
    # documents have the write permission; only owners or the owners of the parent folder (owner from parent) have this permissions and it cannot be directly granted (no self)
    define can_write as owner or owner from parent
    # documents have the read permission; only direct viewers, direct owners or viewers of the parent folder have this permissions and it cannot be directly granted (no self)
    define can_read as viewer or owner or viewer from parent`,
          range,
        },
        {
          label: "sample-expenses",
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: `# Expenses Sample
# there are employees
type employee
  relations
    # employees have managers; an employee's manager is anyone who is their direct manager
    define manager as self
    # employees can be managed by their direct managers as well as whoever can manage their direct managers
    define can_manage as manager or can_manage from manager
# there are reports
type report
  relations
    # reports have submitters; a report's submitter is anyone who has submitted the report
    define submitter as self
    # reports have approvers; a report's approver is anyone who can manage the submitter of the report
    # note that an employee cannot be directly be assigned to be an approver (self is not allowed)
    define approver as can_manage from submitter`,
          range,
        },
        {
          label: "sample-github",
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: `# GitHub Sample
# There are users
type user
# there are organizations
type organization
  relations
    # Organizations can have users who own them
    define owner as self
    # Organizations can have members (any owner of the organization is automatically a member)
    define member as self or owner
    # Organizations has a set of permissions, such as repository admin, writer and reader
    define repo_admin as self
    define repo_reader as self
    define repo_writer as self
# there are teams
type team
  relations
    # teams have members
    define member as self
# there are repositories
type repo
  relations
    # repositories have organizations who own them
    define owner as self
    # repository have admins, they can be assigned or inherited (anyone who has the repository admin role on the owner organization is an owner on the repo)
    define admin as self or repo_admin from owner
    # maintainers on a repo are anyone who is directly assigned or anyone who is an owner on the repo
    define maintainer as self or admin
    # repo writers are users who are directly assigned, anyone who is a maintainer or anyone who has the repository writer role on the owner organization
    define writer as self or maintainer or repo_writer from own
    # triagers on a repo are anyone who is directly assigned or anyone who is a writer on the repo
    define triager as self or writerer
    # repo readers are users who are directly assigned, anyone who is a triafer or anyone who has the repository reader role on the owner organization
    define reader as self or triager or repo_reader from owner`,
          range,
        },
      ],
    };
  };

const provideCompletionItemsOneDotOne =
  (monaco: typeof MonacoEditor) =>
  (model: editor.ITextModel, position: Position): languages.CompletionList => {
    // TODO
    throw new Error("Unimplemented");
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
