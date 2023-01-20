const path = require("path");
const {
  enableImportsFromExternalPaths,
} = require("@loophealth/craco-shared-config");

// List of external packages.
const ui = path.resolve(__dirname, "../../packages/ui");
const api = path.resolve(__dirname, "../../packages/api");

module.exports = {
  plugins: [
    {
      plugin: {
        overrideWebpackConfig: ({ webpackConfig }) => {
          enableImportsFromExternalPaths(webpackConfig, [ui, api]);
          return webpackConfig;
        },
      },
    },
  ],
};
