// These rules should match the rules as specified in
// https://github.com/openfga/api/blob/main/openfga/v1/openfga.proto

// eslint-disable-next-line no-useless-escape
export const defaultTypeRule = "^[^:#@\\s]{1,254}$";
// eslint-disable-next-line no-useless-escape
export const defaultRelationRule = "^[^:#@\\s]{1,50}$";
