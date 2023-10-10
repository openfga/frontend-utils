import { Keyword } from "../../../constants/keyword";
import { defaultDocumentationMap } from "../../../documentation/concepts";
import { MonacoEditor } from "../typings";
import type { editor, languages, Position } from "monaco-editor";

export type DocumentationMap = Partial<Record<Keyword, { summary: string; link?: string }>>;

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
