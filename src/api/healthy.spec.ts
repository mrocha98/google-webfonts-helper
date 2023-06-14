import request from "supertest";
import { initApp } from "../app";

describe("GET /-/healthy", () => {
  it("should respond with 200", async () => {
    const app = await initApp();
    await request(app)
      .get("/-/healthy")
      .timeout(4000)
      .expect(200)
      .expect("Content-Type", /text\/plain/);
  });
});
