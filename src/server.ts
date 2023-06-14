import "./load-env";
import http from "node:http";
import { config } from "./config";
import { initApp } from "./app";

async function bootstrap(): Promise<void> {
  const app = await initApp();
  const server = http.createServer(app);
  server.timeout = config.TIMEOUT_MS;

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
}

bootstrap();
