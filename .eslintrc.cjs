module.exports = {
  ignorePatterns: [".eslintrc.cjs", "dist/**/*.js", "jest.config.js"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  root: true,
  parserOptions: {
    project: "./tsconfig.json",
  },
};
