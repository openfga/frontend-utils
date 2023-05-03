import { LANGUAGE_NAME } from "../../constants";
import { OpenFgaDslThemeToken, OpenFgaThemeConfiguration, SupportedTheme, supportedThemes } from "../../theme";
import { getThemeTokenStyle } from "../../theme/utils";
import { IStandaloneThemeData } from "./monaco-editor.types";

function buildMonacoTheme(themeConfig: OpenFgaThemeConfiguration): IStandaloneThemeData {
  return {
    base: themeConfig.baseTheme || "vs",
    inherit: false,
    colors: {
      "editor.background": themeConfig.background.color,
    },
    rules: Object.values(OpenFgaDslThemeToken).map((token) => {
      const style = getThemeTokenStyle(token, themeConfig);
      return {
        token: `${token}.${LANGUAGE_NAME}`,
        ...style,
      };
    }),
  };
}

const monacoThemes: Record<string, IStandaloneThemeData> = {};
Object.values(SupportedTheme).forEach((themeName) => {
  monacoThemes[themeName] = buildMonacoTheme(supportedThemes[themeName]);
});

export { monacoThemes, buildMonacoTheme };
