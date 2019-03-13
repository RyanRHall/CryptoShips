// paths.js

// Paths will export some path variables that we'll
// use in other Webpack config and server files

const path = require("path");
const fs = require("fs");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
  appAssets: resolveApp("app/src"), // For images and other assets
  appBuild: resolveApp("app/build"), // Prod built files end up here
  appConfig: resolveApp("app/config"), // App config files
  appHtml: resolveApp("app/src/index.html"),
  appIndexJs: resolveApp("app/src/js/index.jsx"), // Main entry point
  appSrc: resolveApp("app/src") // App source
};
