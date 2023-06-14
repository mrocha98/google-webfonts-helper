import request from "supertest";
import { initApp } from "./app";

describe("GET /api/not_defined", () => {
  it("should respond with 404", async () => {
    const app = await initApp();
    await request(app).get("/api/not_defined").timeout(4000).expect(404);
  });
});

describe("GET /", () => {
  it("should respond with 404", async () => {
    const app = await initApp();
    await request(app).get("/").timeout(4000).expect(404);
  });
});
