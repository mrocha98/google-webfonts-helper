/* eslint-disable @typescript-eslint/no-var-requires */
import "./load-env";
import * as express from "express";
import * as http from "http";
import * as JSZip from "jszip";
import { config } from "./config";
import { initStore } from "./logic/store";
import { setupRoutes } from "./routes";

// use native promises
JSZip.external.Promise = Promise;

export const app = express();

export function ready() {
  return init;
}

const init = (async () => {
  const server = http.createServer(app);
  server.timeout = config.TIMEOUT_MS;

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

  // Start server
  server.listen(config.PORT, config.IP, function () {
    console.log(
      "Express server listening on %d, in %s mode (timeout=%dms, compress=%s, accesslog=%s)",
      config.PORT,
      app.get("env"),
      server.timeout,
      config.ENABLE_MIDDLEWARE_COMPRESSION,
      config.ENABLE_MIDDLEWARE_ACCESS_LOG
    );
  });

  process.once("SIGINT", function () {
    console.log("SIGINT received, closing server...");
    server.close();
  });

  process.once("SIGTERM", function () {
    console.log("SIGTERM received, closing server...");
    server.close();
  });
})();
