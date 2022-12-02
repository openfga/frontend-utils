import { Keyword } from "../../../constants/keyword";
import type { editor, languages, Position } from "monaco-editor";
import type * as MonacoEditor from "monaco-editor";

export type DocumentationMap = Partial<Record<Keyword, { summary: string; link?: string }>>;

export const defaultDocumentationMap: DocumentationMap = {
  [Keyword.TYPE]: {
    summary: `A type or grouping of objects that have similar characteristics. For example:
- workspace
- repository
- organization
- document`,
    link: "https://openfga.dev/docs/concepts#what-is-a-type",
  },
  [Keyword.RELATIONS]: {
    summary:
      "A **relation** defines the possible relationship between an [object](https://openfga.dev/docs/concepts#what-is-an-object) and a [user](https://openfga.dev/docs/concepts#what-is-a-user).",
    link: "https://openfga.dev/docs/concepts#what-is-a-relation",
  },
  [Keyword.SELF]: {
    summary:
      "Allows direct relationship between users and objects if there is a tuple between the user and the object.",
    link: "https://openfga.dev/docs/configuration-language#the-direct-relationship-keyword",
  },
  [Keyword.AND]: {
    summary:
      "The intersection operator used to indicate that a relationship exists if the user is in all the sets of users.",
    link: "https://openfga.dev/docs/configuration-language#the-intersection-operator",
  },
  [Keyword.OR]: {
    summary:
      "he union operator is used to indicate that a relationship exists if the user is in any of the sets of users",
    link: "https://openfga.dev/docs/configuration-language#the-union-operator",
  },
  [Keyword.BUT_NOT]: {
    summary:
      "The exclusion operator is used to indicate that a relationship exists if the user is in the base userset, but not in the excluded userset.",
    link: "https://openfga.dev/docs/configuration-language#the-exclusion-operator",
  },
  [Keyword.FROM]: {
    summary: "Allows referencing relations on related objects.",
    link: "https://openfga.dev/docs/configuration-language#referencing-relations-on-related-objects",
  },
  [Keyword.SCHEMA]: {
    summary:
      "Defines the schema version to be used, 1.0 or 1.1. Note that we are planning to deprecate the 1.0 schema soon.",
    link: "https://openfga.dev/docs//modeling/migrating-schema-1-1",
  },
};

function getDocumentation(keyword: Keyword, documentationMap: DocumentationMap): { value: string }[] | undefined {
  const definition = documentationMap[keyword];
  if (!definition) {
    return undefined;
  }

  const { link, summary } = definition;
  const documentation = [
    { value: "**Documentation**" },
    {
      value: summary,
    },
  ];
  if (link) {
    documentation.push({ value: `[Learn more](${link})` });
  }
  return documentation;
}

export const providerHover =
  (monaco: typeof MonacoEditor, documentationMap = defaultDocumentationMap) =>
  (model: editor.ITextModel, position: Position): languages.Hover | undefined => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const wordMeta = model.getWordAtPosition(position)!;

    if (!wordMeta) {
      return;
    }

    const { startColumn, endColumn, word } = wordMeta;

    const contents = getDocumentation(word as Keyword, documentationMap as any);
    if (!contents) {
      return;
    }
    return {
      range: new monaco.Range(position.lineNumber, startColumn, position.lineNumber, endColumn),
      contents,
    };
  };
