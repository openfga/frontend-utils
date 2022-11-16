export const ulidPattern = /[0-9A-HJKMNP-TV-Z]{26}/;
export const ulidValidate = (id: string) => ulidPattern.test(id);
