module.exports = {
  extends: "expo",
  plugins: ["import"],
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
  rules: {
    // Ensure imports are resolved correctly
    "import/no-unresolved": "error",
  },
};
