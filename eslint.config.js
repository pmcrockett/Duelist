"use strict";

// Import the ESLint plugin locally
//const underscorePlugin = require("./eslint-plugin-require-param-underscore");
import underscorePlugin from "./eslint-plugin-require-param-underscore.js";
import eslintConfigPrettier from "eslint-config-prettier";

//module.exports = [
export default [
  {
    // files: ["**/*.js"],
    languageOptions: {
      sourceType: "module",
      ecmaVersion: "latest",
    },
    // Using the eslint-plugin-example plugin defined locally
    plugins: { underscore: underscorePlugin },
    rules: {
      "underscore/require-param-underscore": "warn",
    },
  },
  eslintConfigPrettier,
];
