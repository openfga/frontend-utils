export const indentDSL = (rawDsl: string, removeEmptyLines: boolean = false) => {
  const indentType = "";
  const indentRelation = "  ";
  const indentDefine = "    ";

  return rawDsl
    .split("\n")
    .filter((line: string) => (removeEmptyLines ? line.trim().length > 0 : true))
    .map((line: string) => {
      const selectedLine = line.trim();
      const keyword = selectedLine.split(" ")[0];
      let indentation: string = "";
      switch (keyword) {
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
