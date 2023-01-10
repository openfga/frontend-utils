import { openfgaDark } from "./supported-themes/openfga-dark";
import { OpenFgaThemeConfiguration, SupportedTheme } from "./theme.typings";

export * from "./theme.typings";
export { languageDefinition } from "../syntax-highlighters/prism/language-definition";

export const supportedThemes: Record<SupportedTheme, OpenFgaThemeConfiguration> = {
  [SupportedTheme.OpenFgaDark]: openfgaDark,
};
