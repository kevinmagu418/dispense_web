import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/**
 * Two classes of rule are demoted to warnings.
 *
 * 1. The next/core-web-vitals config in eslint-config-next v16 ships the React
 *    Compiler-era react-hooks rules as errors. They fire on legitimate patterns
 *    used throughout this site: a scroll listener that sets state (Navbar), a
 *    ScrollTrigger callback that tracks the active stage (ProductStory) and an
 *    analytics effect that pushes a page view. Each is intentional, bounded and
 *    cleaned up, so they are warnings rather than build blockers.
 * 2. Image-element guidance: the site uses next/image everywhere it can; `<img>`
 *    appears only inside SVG icons, which the rule cannot distinguish.
 *
 * Classic correctness rules stay errors.
 */
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/immutability": "warn",
      "@next/next/no-img-element": "warn",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "public/**",
  ]),
]);

export default eslintConfig;
