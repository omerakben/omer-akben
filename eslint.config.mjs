import nextConfig from "eslint-config-next";

const eslintConfig = [
  ...nextConfig,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      ".claude/**",
      "archive/**",
      "**/archive/**",
      "scripts/**",
    ],
  },
  {
    rules: {
      // Allow inline styles for dynamic runtime values (e.g., sidebar width)
      "@next/next/no-css-tags": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/error-boundaries": "off",
    },
  },
];

export default eslintConfig;
