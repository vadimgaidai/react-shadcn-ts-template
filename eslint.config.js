import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import eslintPluginImport from 'eslint-plugin-import'
import eslintPluginReact from 'eslint-plugin-react'
import eslintPluginReactHooks from 'eslint-plugin-react-hooks'
import eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
// import eslintPluginTailwind from 'eslint-plugin-tailwindcss'
import eslintPluginQuery from '@tanstack/eslint-plugin-query'
import eslintPluginStylistic from '@stylistic/eslint-plugin'

export default tseslint.config(
  {
    ignores: ['dist', 'node_modules', '*.config.*', 'src/components/ui', 'commitlint.config.*'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      eslintPluginPrettierRecommended,
      eslintPluginQuery.configs['flat/recommended'],
    ],
    plugins: {
      import: eslintPluginImport,
      react: eslintPluginReact,
      'jsx-a11y': eslintPluginJsxA11y,
      'react-hooks': eslintPluginReactHooks,
      // tailwind: eslintPluginTailwind,
      stylistic: eslintPluginStylistic,
      '@tanstack/query': eslintPluginQuery,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        project: ['tsconfig.*?.json'],
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
          moduleDirectory: ['node_modules', './'],
        },
      },
    },
    rules: {
      ...eslintPluginReactHooks.configs.recommended.rules,

      // Core JavaScript rules
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-var': 'error',
      'prefer-const': 'error',
      'no-param-reassign': 'error',
      'no-shadow': 'error',
      'no-multi-spaces': 'error',
      'no-loop-func': 'error',
      'prefer-arrow-callback': 'error',

      // React specific rules
      'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
      'react/react-in-jsx-scope': 'off',
      'react/jsx-props-no-spreading': 'error',
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],
      'react/require-default-props': 'off',
      'react/button-has-type': 'error',

      // TypeScript rules
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/ban-ts-comment': 'warn',

      // Import rules
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import/prefer-default-export': 'error',
      'import/no-default-export': 'off',
      'import/no-cycle': 'error',

      // Stylistic rules
      'stylistic/semi': ['error', 'never'],
      'stylistic/jsx-quotes': ['error', 'prefer-double'],
      'stylistic/quote-props': ['error', 'consistent-as-needed'],
      'stylistic/arrow-parens': ['error', 'always'],

      // Accessibility
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-is-valid': 'error',
    },
  },
  {
    files: ['**/*.test.{ts,tsx}', '**/*.stories.{ts,tsx}'],
    rules: {
      'import/no-default-export': 'off',
      'react/jsx-props-no-spreading': 'off',
      'query/exhaustive-deps': 'off',
      'no-console': 'off',
    },
  }
)
