import { Keyword } from "../keyword";
import type { editor } from "monaco-editor";

export const theme: editor.IStandaloneThemeData = {
  base: "vs-dark",
  inherit: true,
  colors: {
    "editor.background": "#141517",
  },
  rules: [
    { token: `${Keyword.TYPE_RESTRICTIONS}.openfga`, foreground: "00676E" },
    { token: "keyword.openfga", foreground: "00676E" },
    { token: "type.openfga", foreground: "00676E" },
    { token: "relation.openfga", foreground: "00676E" },
    { token: "comment.openfga", foreground: "65676E" },
  ],
};
