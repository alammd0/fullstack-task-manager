import request from "supertest";
import { app } from "../../index"; 
import { closeDb, resetDb } from "../utils/db";

beforeEach(async () => {
  await resetDb();
});

afterAll(async () => {
  await closeDb();
});

describe("authentication integration test", () => {
  it("should register user correctly", async () => {
    const uniqueEmail = `user${Date.now()}@gmail.com`;

    const res = await request(app).post("/api/v1/auth/register")
      .send({ name: "user", email: uniqueEmail, password: "123456" });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("User registered successfully");
    expect(res.body.user.email).toBe(uniqueEmail);
  });

  it("should login user correctly", async () => {
    const uniqueEmail = `user${Date.now()}@gmail.com`;

    // 1. register user
    await request(app).post("/api/v1/auth/register")
      .send({ name: "user", email: uniqueEmail, password: "123456" });

    // 2. login user
    const res = await request(app).post("/api/v1/auth/login")
      .send({ email: uniqueEmail, password: "123456" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Login successful");
    expect(res.body.token).toBeTruthy();
  });
});
