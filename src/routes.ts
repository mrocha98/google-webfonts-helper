import * as express from "express";
import { getApiFonts, getApiFontsById } from "./api/fonts.controller";
import { getHealthy } from "./api/healthy.controller";

export function setupRoutes(app: express.Express) {
  app.route("/api/fonts").get(getApiFonts);

  app.route("/api/fonts/:id").get(getApiFontsById);

  app.route("/-/healthy").get(getHealthy);

  // All undefined asset or api routes should return a 404
  app.route("/*").get(function (req, res) {
    res.sendStatus(404);
  });
}
