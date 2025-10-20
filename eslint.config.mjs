import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "archive/**",
      "**/archive/**",
      "scripts/**",
    ],
  },
  {
    rules: {
      // Allow inline styles for dynamic runtime values (e.g., sidebar width)
      "@next/next/no-css-tags": "off",
    },
  },
];

export default eslintConfig;
