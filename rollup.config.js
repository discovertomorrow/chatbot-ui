/**
 * @license MIT
 * Copyright 2024 prognostica GmbH
 * See LICENSE file in the project root for full license information.
 */

import babel from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";

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

const terserConfig = {
  output: {
    comments: function (node, comment) {
      return comment.type === "comment2" && /^!/.test(comment.value);
    },
  },
};

const header = `/*!
 * @license MIT
 * Copyright 2024 prognostica GmbH
 */`;

const chatbotui = {
  input: "src/chatbotui.js",
  output: {
    file: "dist/chatbotui.esm.min.js",
    format: "es", // ES6 module format
    banner: header,
  },
  plugins: [babel(babelConfig), terser(terserConfig)],
};

const chatbotuiWithFiles = {
  input: "src/chatbotui-with-files.js",
  output: {
    file: "dist/chatbotui-with-files.esm.min.js",
    format: "es", // ES6 module format
    banner: header,
  },
  plugins: [babel(babelConfig), terser(terserConfig)],
};

export default [chatbotui, chatbotuiWithFiles];

