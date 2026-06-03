const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const reactNativePlugin = require("eslint-plugin-react-native");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
  {
    plugins: {
      "react-native": reactNativePlugin,
    },
    rules: {
      "react-native/no-raw-text": "error",
      "import/no-unresolved": "off",
      "import/namespace": "off",
      "import/no-duplicates": "off",
      "import/no-named-as-default": "off",
      "import/no-named-as-default-member": "off",
      "react-native/no-unused-styles": "warn",
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
  },
]);
