import js from '@eslint/js'
import typescriptParser from '@typescript-eslint/parser'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import reactNativePlugin from 'eslint-plugin-react-native'
import importPlugin from 'eslint-plugin-import'

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        global: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        Buffer: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'react-native': reactNativePlugin,
      import: importPlugin,
    },
    rules: {
      // Disable rules that conflict with Biome
      'no-unused-vars': 'off',
      'no-undef': 'off',
      quotes: 'off',
      semi: 'off',
      indent: 'off',
      'comma-dangle': 'off',
      'object-curly-spacing': 'off',
      'array-bracket-spacing': 'off',
      'space-before-function-paren': 'off',
      'keyword-spacing': 'off',
      'space-infix-ops': 'off',
      'eol-last': 'off',
      'no-trailing-spaces': 'off',

      // TypeScript rules are handled by Biome
      // '@typescript-eslint/no-unused-vars' → covered by Biome
      // '@typescript-eslint/no-explicit-any' → covered by Biome

      // React rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // React Native specific rules
      'react-native/no-unused-styles': 'error',
      'react-native/split-platform-components': 'error',
      'react-native/no-inline-styles': 'warn',
      'react-native/no-raw-text': 'off',

      // Import restrictions for monorepo
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            // packages cannot import from apps
            {
              target: './packages/**/*',
              from: './apps/**/*',
              message: 'Packages cannot import from apps. This violates the dependency direction in monorepo.',
            },
            // apps cannot import from other apps (but allow internal imports within same app)
            {
              target: './apps/main/**/*',
              from: './apps/!(main)/**/*',
              message: 'Apps cannot import from other apps. Keep apps isolated.',
            },
          ],
        },
      ],

      // Prevent deep imports from react-native
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['react-native/**'],
              message: 'Direct deep imports from react-native are not allowed. Use the main entry point.',
            },
          ],
        },
      ],

    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: ['./apps/*/tsconfig.json', './packages/*/tsconfig.json'],
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
  },
  {
    // TypeScript specific overrides
    files: ['**/*.{ts,tsx}'],
    rules: {
      'no-undef': 'off', // TypeScript handles this
    },
  },
  {
    // Ignore patterns
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      '.expo/**',
      'ios/**',
      'android/**',
      '**/*.generated.*',
      'coverage/**',
      '.claude/**',
    ],
  },
]