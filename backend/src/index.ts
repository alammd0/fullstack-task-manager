import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { authRouter } from "./router/auth";
import { adminRouter } from "./router/admin";
import { taskRouter } from "./router/task";


dotenv.config();
export const app = express();
app.use(cors());
app.use(express.json());


app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/task", taskRouter);

app.get("/", (req, res) => res.send("API running with TS..."));

// app.listen(5000, () => console.log("Backend running on 5000"));
// only run the server if not in tests
if (process.env.NODE_ENV !== "test") {
  app.listen(5000, () => console.log("Backend running on 5000"));
}
