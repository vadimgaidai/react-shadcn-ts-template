import js from "@eslint/js"
import eslintPluginStylistic from "@stylistic/eslint-plugin"
import eslintPluginQuery from "@tanstack/eslint-plugin-query"
import eslintPluginImport from "eslint-plugin-import"
import eslintPluginJsxA11y from "eslint-plugin-jsx-a11y"
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended"
import eslintPluginReact from "eslint-plugin-react"
import eslintPluginReactHooks from "eslint-plugin-react-hooks"
import globals from "globals"
import tseslint from "typescript-eslint"

export default tseslint.config(
  {
    ignores: ["dist", "node_modules", "*.config.*", "src/shared/ui", "commitlint.config.*"],
  },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      eslintPluginPrettierRecommended,
      eslintPluginQuery.configs["flat/recommended"],
    ],
    plugins: {
      import: eslintPluginImport,
      react: eslintPluginReact,
      "jsx-a11y": eslintPluginJsxA11y,
      "react-hooks": eslintPluginReactHooks,
      stylistic: eslintPluginStylistic,
      "@tanstack/query": eslintPluginQuery,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        project: ["tsconfig.*?.json"],
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
          moduleDirectory: ["node_modules", "./"],
        },
      },
    },
    rules: {
      ...eslintPluginReactHooks.configs.recommended.rules,

      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-alert": "error",
      "no-var": "error",
      "prefer-const": "error",
      "no-param-reassign": "error",
      "no-shadow": "error",
      "no-multi-spaces": "error",
      "no-loop-func": "error",
      "no-tabs": "error",
      "prefer-arrow-callback": "error",

      "react/jsx-filename-extension": ["error", { extensions: [".tsx"] }],
      "react/react-in-jsx-scope": "off",
      "react/jsx-props-no-spreading": "error",
      "react/function-component-definition": [
        "error",
        {
          namedComponents: "arrow-function",
          unnamedComponents: "arrow-function",
        },
      ],
      "react/require-default-props": "off",
      "react/button-has-type": "error",
      "react/jsx-props-no-spreading": "warn",

      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/ban-ts-comment": "warn",

      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "import/prefer-default-export": "off",
      "import/no-default-export": "off",
      "import/no-cycle": "error",

      "stylistic/semi": ["error", "never"],
      "stylistic/jsx-quotes": ["error", "prefer-double"],
      "stylistic/quote-props": ["error", "consistent-as-needed"],
      "stylistic/arrow-parens": ["error", "always"],

      "jsx-a11y/alt-text": "error",
      "jsx-a11y/anchor-is-valid": "error",
    },
  },
  {
    files: ["**/*.test.{ts,tsx}", "**/*.stories.{ts,tsx}"],
    rules: {
      "import/no-default-export": "off",
      "react/jsx-props-no-spreading": "off",
      "query/exhaustive-deps": "off",
      "no-console": "off",
    },
  }
)
