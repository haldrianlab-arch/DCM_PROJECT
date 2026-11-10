import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,

  // CLAUDE.md dan tech.md §3: src/domain/ murni, tanpa database, Next.js, atau React.
  {
    files: ["src/domain/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "next",
                "next/*",
                "react",
                "react-dom",
                "react/*",
                "drizzle-orm",
                "drizzle-orm/*",
                "@neondatabase/*",
                "better-auth",
                "better-auth/*",
                "@/server/*",
                "@/app/*",
                "@/components/*",
              ],
              message:
                "src/domain/ harus murni (tanpa database, Next.js, atau React). Terima data lewat parameter.",
            },
          ],
        },
      ],
    },
  },

  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "playwright-report/**",
    "test-results/**",
    "db/migrations/**",
  ]),
]);

export default eslintConfig;
