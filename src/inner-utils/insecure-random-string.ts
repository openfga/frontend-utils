// Source: https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript/8084248#8084248
export const insecureRandomString = () => (Math.random() + 1).toString(36);
