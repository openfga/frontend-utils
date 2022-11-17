import type { editor } from "monaco-editor";

import {
  getThemeTokenStyle,
  OpenFgaDslThemeToken,
  OpenFgaThemeConfiguration,
  SupportedTheme,
  supportedThemes,
} from "../utilities/theme";
import { LANGUAGE_NAME } from "../constants";

function buildMonacoTheme(themeConfig: OpenFgaThemeConfiguration): editor.IStandaloneThemeData {
  return {
    base: themeConfig.baseTheme || "vs",
    inherit: true,
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

const monacoThemes: Record<string, editor.IStandaloneThemeData> = {};
Object.values(SupportedTheme).forEach((themeName) => {
  monacoThemes[themeName] = buildMonacoTheme(supportedThemes[themeName]);
});

export { monacoThemes, buildMonacoTheme };
