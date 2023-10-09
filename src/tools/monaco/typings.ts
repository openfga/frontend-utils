export type * as MonacoEditor from "monaco-editor";

import type { editor } from "monaco-editor";
import { errors } from "@openfga/syntax-transformer";

type ValidationError = errors.ValidationError;

export interface Marker extends editor.IMarkerData {
  severity: number;
  startColumn: number;
  endColumn: number;
  startLineNumber: number;
  endLineNumber: number;
  message: string;
  source: string;
  extraInformation?: { error?: ValidationError; typeName?: string; relation?: string };
}
