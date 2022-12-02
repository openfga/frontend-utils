import { OpenFgaDslThemeTokenType, OpenFgaThemeConfiguration } from "../types";

export const openfgaLight: OpenFgaThemeConfiguration = {
  name: "openfga-light",
  baseTheme: "vs",
  background: {
    color: "#141517",
  },
  colors: {
    [OpenFgaDslThemeTokenType.DEFAULT]: "#B4B2BE",
    [OpenFgaDslThemeTokenType.COMMENT]: "#65676E",
    [OpenFgaDslThemeTokenType.KEYWORD]: "#B4B2BE",
    [OpenFgaDslThemeTokenType.TYPE]: "#13A688",
    [OpenFgaDslThemeTokenType.RELATION]: "#635DFF",
    [OpenFgaDslThemeTokenType.DIRECTLY_ASSIGNABLE]: "#FF44DD",
  },
  styles: {
    [OpenFgaDslThemeTokenType.KEYWORD]: "italic",
  },
};
