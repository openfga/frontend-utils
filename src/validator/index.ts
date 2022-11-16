import { checkDSL } from "./check-dsl";
export { ValidationOptions, ValidationRegex } from "./check-dsl";
import { ulidValidate } from "./ulid-regex";

const validator = {
  checkDSL,
  ulidValidate,
};

export default validator;
