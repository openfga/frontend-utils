import { Keywords } from "./keywords";
export const indentDSL = (rawDsl: string, removeEmptyLines = false) => {
  const indentModel = "";
  const indentSchema = "  ";
  const indentType = "";
  const indentRelation = "  ";
  const indentDefine = "    ";

  return rawDsl
    .split("\n")
    .filter((line: string) => (removeEmptyLines ? line.trim().length > 0 : true))
    .map((line: string) => {
      const selectedLine = line.trim();
      const keyword = selectedLine.split(" ")[0];
      let indentation = "";
      switch (keyword) {
        case Keywords.MODEL:
          indentation = indentModel;
          break;
        case Keywords.SCHEMA:
          indentation = indentSchema;
          break;
        case "type":
          indentation = indentType;
          break;
        case "relations":
          indentation = indentRelation;
          break;
        case "define":
          indentation = indentDefine;
          break;
        default:
          break;
      }
      return `${indentation}${selectedLine}`;
    })
    .join("\n");
};
