import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("API running with TS..."));

app.listen(5000, () => console.log("Backend running on 5000"));
