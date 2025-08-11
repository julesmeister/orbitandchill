import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // TypeScript specific rules
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-non-null-assertion": "off", // Allows ! operator
      "@typescript-eslint/ban-ts-comment": "off", // Allows @ts-ignore, @ts-nocheck
      "@typescript-eslint/no-empty-function": "off", // Allows empty functions
      "@typescript-eslint/no-inferrable-types": "off", // Allows explicit type annotations
      "@typescript-eslint/no-var-requires": "off", // Allows require() in TypeScript

      // React specific rules
      "react/no-unescaped-entities": "off", // Allows quotes in JSX without escaping
      "react/display-name": "off", // Not needed for component display names
      "react/no-children-prop": "off", // Allows passing children as a prop
      "react/prop-types": "off", // Not needed with TypeScript

      // React Hooks rules
      "react-hooks/exhaustive-deps": "warn", // Downgrade to warning instead of error

      // General JavaScript rules
      "no-console": "off", // Allows console.log statements
      "no-empty": "off", // Allows empty blocks
      "no-empty-pattern": "off", // Allows empty destructuring
      "prefer-const": "warn", // Downgrade to warning
      "no-unreachable": "warn", // Downgrade to warning

      // Import rules
      "import/no-anonymous-default-export": "off", // Allows anonymous default exports

      // Accessibility rules (be careful with these)
      "@next/next/no-img-element": "off", // Allows <img> instead of Next.js Image
      
      // ESLint directives - suppress warnings about unused disable comments
      "eslint-comments/no-unused-disable": "off", // Ignore unused eslint-disable comments
      "@eslint-community/eslint-comments/no-unused-disable": "off", // Alternative rule name
      "eslint-comments/no-unused-enable": "off", // Also suppress unused enable warnings
    },
  },
];

export default eslintConfig;
