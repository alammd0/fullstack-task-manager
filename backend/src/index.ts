import express from "express";
import cors from "cors";
import { authRouter } from "./router/auth";
import { adminRouter } from "./router/admin";
import { taskRouter } from "./router/task";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/task", taskRouter);

app.get("/", (req, res) => res.send("API running with TS..."));

app.listen(5000, () => console.log("Backend running on 5000"));
