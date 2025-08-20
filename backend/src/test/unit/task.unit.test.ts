
import { TaskPriority, TaskStatus } from "@prisma/client";

describe("Task unit test", () => {
    it("should create task correctly", async () => {
        const task = { title : "Sample Task", description : "Sample Task Description", status : TaskStatus.Open};
        expect(task.status).toBe("Open");
    });

    it("should the task priority is Hight", async () => {
        const task = { title : "Sample Task", description : "Sample Task Description", priority : TaskPriority.High};

        expect(task.priority).toBe("High");
    });
})
