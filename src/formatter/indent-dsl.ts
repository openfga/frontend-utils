import { Keyword } from "../keyword";

const SINGLE_INDENTATION = "  ";

function getIndentationComposite(count = 0): string {
  let indentation = "";

  for (let index = 1; index <= count; index++) {
    indentation += SINGLE_INDENTATION;
  }

  return indentation;
}

function getIndentationForKeyword(keyword: Keyword | string): string {
  let indentationCount = 0;
  switch (keyword) {
    case Keyword.SCHEMA:
    case Keyword.RELATIONS:
      indentationCount = 1;
      break;
    case Keyword.DEFINE:
      indentationCount = 2;
      break;
    case Keyword.MODEL:
    case Keyword.TYPE:
    default:
      indentationCount = 0;
  }

  return getIndentationComposite(indentationCount);
}

export const indentDSL = (rawDsl: string, removeEmptyLines = false) => {
  return rawDsl
    .split("\n")
    .filter((line: string) => (removeEmptyLines ? line.trim().length > 0 : true))
    .map((line: string) => {
      const selectedLine = line.trim();
      const keyword = selectedLine.split(" ")[0];
      const indentation = getIndentationForKeyword(keyword);
      return `${indentation}${selectedLine}`;
    })
    .join("\n");
};
