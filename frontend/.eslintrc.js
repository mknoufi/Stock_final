module.exports = {
  root: true,
  extends: "expo",
  plugins: ["import"],
  env: {
    es2022: true,
    node: true,
    browser: true,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project: "./tsconfig.json",
      },
      node: {
        extensions: [".ts", ".tsx", ".js", ".jsx"],
      },
    },
  },
  globals: {
    TextEncoder: "readonly",
    TextDecoder: "readonly",
    WebAssembly: "readonly",
    crypto: "readonly",
    performance: "readonly",
  },
  rules: {
    // Ensure imports are resolved correctly
    // Ensure imports are resolved correctly
    "import/no-unresolved": [
      "error",
      {
        ignore: ["^expo", "^react-native", "^@react-navigation", "^expo-.*"],
      },
    ],
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
  },
  overrides: [
    {
      files: [
        "**/*.test.ts",
        "**/*.test.tsx",
        "**/*.spec.ts",
        "**/*.spec.tsx",
        "jest.setup.js",
        "jest.polyfills.js",
      ],
      env: {
        jest: true,
        node: true,
        browser: true,
      },
      globals: {
        jest: "readonly",
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
      },
      rules: {
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-require-imports": "off",
        "no-undef": "off",
        eqeqeq: "off",
      },
    },
    {
      files: ["e2e/**/*.ts", "e2e/**/*.tsx"],
      env: {
        node: true,
        browser: true,
      },
      rules: {
        "@typescript-eslint/no-unused-vars": "off",
        "no-undef": "off",
        "no-unused-expressions": "off",
      },
    },
    {
      files: ["scripts/**/*.js"],
      env: {
        node: true,
      },
      globals: {
        __dirname: "readonly",
        __filename: "readonly",
        require: "readonly",
        module: "readonly",
        process: "readonly",
      },
      rules: {
        "no-undef": "off",
      },
    },
    {
      files: ["**/*.bundle.js", "**/*.min.js"],
      env: {
        browser: true,
        node: true,
      },
      rules: {
        "no-var": "off",
        "no-unused-expressions": "off",
        eqeqeq: "off",
        "@typescript-eslint/no-unused-vars": "off",
      },
    },
  ],
};
