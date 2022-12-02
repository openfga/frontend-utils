import { openfgaLight } from "./supported-themes/openfga-light";
import { openfgaDark } from "./supported-themes/openfga-dark";
import { OpenFgaThemeConfiguration, SupportedTheme } from "./types";

export * from "./types";
export { languageDefinition } from "../syntax-highlighters/prism/language-definition";

export const supportedThemes: Record<SupportedTheme, OpenFgaThemeConfiguration> = {
  [SupportedTheme.OpenFgaLight]: openfgaLight,
  [SupportedTheme.OpenFgaDark]: openfgaDark,
};
