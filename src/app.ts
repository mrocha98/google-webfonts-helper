/* eslint-disable @typescript-eslint/no-var-requires */
import "./load-env";
import express, { Express } from "express";
import JSZip from "jszip";
import { config } from "./config";
import { initStore } from "./logic/store";
import { setupRoutes } from "./routes";

export async function initApp(): Promise<Express> {
  // use native promises
  JSZip.external.Promise = Promise;

  const app = express();

  const env = app.get("env");

  // http://expressjs.com/en/api.html
  app.set("x-powered-by", false);

  if (config.ENABLE_MIDDLEWARE_COMPRESSION) {
    app.use(require("compression")());
  }

  if (env === "production") {
    if (config.ENABLE_MIDDLEWARE_ACCESS_LOG) {
      app.use(require("morgan")(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]'));
    }
  } else {
    app.use(require("morgan")("dev"));
    app.use(require("errorhandler")()); // Error handler - has to be last
  }

  setupRoutes(app);

  await initStore();

  return app;
}
