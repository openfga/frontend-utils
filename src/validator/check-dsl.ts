import validateDsl, { ValidationOptions, ValidationRegex } from "@openfga/language/validator/validate-dsl";
import {
  DSLSyntaxError,
  DSLSyntaxSingleError,
  ModelValidationSingleError,
  ModelValidationError,
} from "@openfga/language/errors";

export {
  ValidationOptions,
  ValidationRegex,
  DSLSyntaxSingleError,
  ModelValidationError,
  ModelValidationSingleError,
  DSLSyntaxError,
};

export const checkDSL = (codeInEditor: string, options: ValidationOptions = {}) => {
  validateDsl(codeInEditor, options);
};
