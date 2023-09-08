import { checkDSL } from "./check-dsl";
import { ulidValidate } from "./ulid-regex";

import {
  ValidationOptions,
  ValidationRegex,
  DSLSyntaxSingleError,
  DSLSyntaxError,
  ModelValidationError,
  ModelValidationSingleError,
} from "./check-dsl";
export { ModelValidationError, ModelValidationSingleError, DSLSyntaxError, DSLSyntaxSingleError };

const validator = {
  checkDSL,
  ulidValidate,
};

export default validator;
