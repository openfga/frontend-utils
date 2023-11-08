import { OpenFgaDslThemeTokenType, OpenFgaThemeConfiguration } from "../theme.typings";

export const openfgaDark: OpenFgaThemeConfiguration = {
  name: "openfga-dark",
  baseTheme: "vs-dark",
  background: {
    color: "#141517",
  },
  colors: {
    [OpenFgaDslThemeTokenType.DEFAULT]: "#FFFFFF",
    [OpenFgaDslThemeTokenType.COMMENT]: "#737981",
    [OpenFgaDslThemeTokenType.KEYWORD]: "#AAAAAA",
    [OpenFgaDslThemeTokenType.TYPE]: "#79ED83",
    [OpenFgaDslThemeTokenType.RELATION]: "#20F1F5",
    [OpenFgaDslThemeTokenType.DIRECTLY_ASSIGNABLE]: "#CEEC93",
    [OpenFgaDslThemeTokenType.CONDITION]: "#79ED83",
    [OpenFgaDslThemeTokenType.CONDITION_PARAM]: "#20F1F5",
    [OpenFgaDslThemeTokenType.CONDITION_PARAM_TYPE]: "#AAAAAA",
  },
  styles: {},
};
