const fs = require('fs');
const path = require('path')

const mongooseLoader = require("./loaders/mongooseLoader");
const expressLoader = require("./loaders/expressLoader");
const publicLoader = require("./loaders/publicLoader");
const winstonLoader = require("./loaders/winstonLoader");
const { autocodeRoutes, autocodeClient } = require("../dist/autocode");

const AutocodeClient = require("../dist/autocode-client");
const AppClient = require("../dist/app-client");

// Init loaders
async function initApp() {
  // logging
  winstonLoader();

  // Database
  await mongooseLoader();

  // express
  const { app, port } = expressLoader(autocodeRoutes);

  // public Url
  publicLoader(app);

  const manifest = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../dist/.vite", "manifest.json"), "utf-8")
  );
  const scriptFilename = manifest["src/client/components/index.jsx"].file;


  // // autocode
  autocodeClient(
    app,
    AutocodeClient,
    AppClient, // Custom Components
    "", //Head Scripts
    `<script src="/${scriptFilename}"></script>`
  );

  return port;
}

initApp()
  .then((port) => console.log(`Successfully started the server: ${port}`))
  .catch((error) => console.error("Application is crashed: " + error));
