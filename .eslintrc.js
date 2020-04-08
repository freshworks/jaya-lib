module.exports =  {
  root: true,
  parser:  '@typescript-eslint/parser',  // Specifies the ESLint parser
  plugins: [
    "@typescript-eslint",
    "typescript-sort-keys"
  ],
  extends:  [
    'plugin:@typescript-eslint/recommended',  // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'prettier/@typescript-eslint',  // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'plugin:prettier/recommended',  // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
 parserOptions:  {
    ecmaVersion:  2018,  // Allows for the parsing of modern ECMAScript features
    sourceType:  'module',  // Allows for the use of imports
  },
  rules:  {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    "camelcase": 0,
    "@typescript-eslint/camelcase": ["error", {properties: "never"}],
    "@typescript-eslint/no-unused-vars": "error",
    "typescript-sort-keys/interface": 2,
    "typescript-sort-keys/string-enum": 2,
    "no-await-in-loop": 0,
    "no-restricted-syntax": 2,
    // "max-len": ["error", { "code": 110 }],
    "quotes": ["error", "single"],
    "sort-keys": ["error", "asc", {"caseSensitive": true, "natural": false, "minKeys": 2}],
    "complexity": ["error", 10],
    "no-console": "error"
  }
};