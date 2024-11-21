/**
 * @license MIT
 * Copyright 2024 prognostica GmbH
 * See LICENSE file in the project root for full license information.
 */
import cssnano from "cssnano";
import postcssImport from "postcss-import";

export default {
  plugins: [
    postcssImport(),
    cssnano({
      preset: "default",
    }),
  ],
};

