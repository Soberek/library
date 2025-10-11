import globals from "globals";
import tseslint from "typescript-eslint";
import { FlatCompat } from "@eslint/eslintrc"; 

const compat = new FlatCompat({
  baseDirectory: process.cwd(),
});

export default [
  // Configuration for JavaScript files
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        process: true,
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
  },
  // Configuration for TypeScript/React files
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        process: true,
      },
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.app.json'],
        tsconfigRootDir: process.cwd(),
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
  },
  // Ignore paths
  {
    ignores: [
      "build/**", 
      "dist/**", 
      "node_modules/**", 
      "coverage/**", 
      "*.d.ts", 
      "jest.config.cjs", 
      "src/setupTests.js",
      "**/*.test.{ts,tsx}", 
      "vite.config.ts"
    ],
  }
];
