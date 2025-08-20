import request from "supertest";
import { app } from "../../index"; 
import { closeDb, resetDb } from "../utils/db";

let token: string = "";
let userId: number = 0;

beforeAll(async () => {
  await resetDb();

  const uniqueEmail = `user${Date.now()}@gmail.com`;

  await request(app).post("/api/v1/auth/register")
    .send({ name: "user", email: uniqueEmail, password: "123456" });

  const res = await request(app).post("/api/v1/auth/login")
    .send({ email: uniqueEmail, password: "123456" });

  token = res.body.token;
  userId = res.body.user.id;
});

afterAll(async () => {
  await closeDb();
});

describe("Task integration test", () => {
  it("Should create multiple tasks correctly", async () => {
    const titles = ["Task One", "Task Two", "Task Three"];

    for (const title of titles) {
      const res = await request(app).post("/api/v1/task/tasks")
        .set("Authorization", `${token}`)
        .send({
          title,
          description: "Sample Task Description",
          status: "Open",
          priority: "Low",
          dueDate: "2025-01-01",
          assignedTo: userId
        });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("Task created successfully");
      expect(res.body.tasks.title).toBe(title);
    }
  });

  it("Should get all tasks correctly", async () => {
    const res = await request(app).get("/api/v1/task/tasks")
      .set("Authorization", `${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Tasks fetched successfully");
  });

  it("Should get tasks by status correctly", async () => {
    const res = await request(app).get("/api/v1/task/tasks")
      .set("Authorization", `${token}`)
      .query({ status: "Open" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Tasks fetched successfully");
  })
});
