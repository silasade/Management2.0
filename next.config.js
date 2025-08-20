/** @type {import('next').NextConfig} */

import path from "path";

const nextConfig = {
  /* config options here */
  sassOptions: {
    // Absolute Import Alias for Scss Base Styles
    includePaths: [path.join(process.cwd(), "src/base-styles/")],
    // Enable @debug, @warn scss functionality
    logger: {
      warn: function (message) {
        console.warn(message);
      },
      debug: function (message) {
        console.log(message);
      },
    },
  },
};

export default nextConfig;
