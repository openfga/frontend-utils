import { Keyword } from "./keyword";
import { SchemaVersion } from "./schema-version";
import { LANGUAGE_NAME } from "./language-name";
import { DEFAULT_SCHEMA_VERSION } from "./default-schema-version";

export const enums = {
  Keyword,
  SchemaVersion,
};

export { LANGUAGE_NAME, DEFAULT_SCHEMA_VERSION };

const constants = {
  LANGUAGE_NAME,
  DEFAULT_SCHEMA_VERSION,
  enums,
};

export default constants;
