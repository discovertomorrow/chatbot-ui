/**
 * @license MIT
 * Copyright 2024 prognostica GmbH
 * See LICENSE file in the project root for full license information.
 */

import babel from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

const babelConfig = {
  babelHelpers: "bundled",
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: false, // No polyfills will be added
        targets: "> 0.25%, not dead", // Specify your target environments
      },
    ],
  ],
};

const bundle = {
  input: "src/index.js",
  output: {
    file: "dist/bundle.esm.min.js",
    format: "es", // ES6 module format
    inlineDynamicImports: true,
  },
  plugins: [resolve(), commonjs(), babel(babelConfig), terser({})],
};

export default [bundle];

