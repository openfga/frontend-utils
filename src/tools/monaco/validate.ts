import type * as MonacoEditor from "monaco-editor";

import { Marker } from "./typings";
import { DSLSyntaxSingleError, ModelValidationSingleError } from "@openfga/syntax-transformer/dist/errors";
import { errors, validator } from "@openfga/syntax-transformer";

export function validateDSL(monaco: typeof MonacoEditor, dsl: string): Marker[] {
  const markers: Marker[] = [];
  try {
    validator.validateDSL(dsl);
  } catch (err) {
    for (const singleErr of (err as errors.BaseMultiError<errors.BaseError>).errors) {
      let source;

      if (singleErr instanceof DSLSyntaxSingleError) {
        source = "SyntaxError";
      } else if (singleErr instanceof ModelValidationSingleError) {
        source = "ModelValidationError";
      } else {
        throw new Error("Unhandled Exception: " + JSON.stringify(singleErr, null, 4));
      }

      const extraInformation: Marker["extraInformation"] = {};
      const errorMetadata = singleErr.metadata;
      if (errorMetadata) {
        if ("errorType" in errorMetadata) {
          extraInformation.error = errorMetadata.errorType;
        }
        ["typeName", "relation"].forEach((field) => {
          if (field in errorMetadata) {
            (extraInformation as any)[field] = (errorMetadata as any)[field];
          }
        });
      }

      markers.push({
        message: singleErr.msg,
        severity: monaco.MarkerSeverity.Error,
        startColumn: (singleErr?.column?.start || 0) + 1,
        endColumn: (singleErr?.column?.end || 0) + 1,
        startLineNumber: (singleErr?.line?.start || 0) + 1,
        endLineNumber: (singleErr?.line?.end || 0) + 1,
        source,
        extraInformation,
      });
    }
  }

  return markers;
}
