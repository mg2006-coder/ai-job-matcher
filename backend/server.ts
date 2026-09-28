import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import jobsRouter from "./routes/jobs";
import candidatesRouter from "./routes/candidates";
import matchesRouter from "./routes/matches";

dotenv.config();

const app = express();
const PORT = Number(process.env.BACKEND_PORT || 5000);

app.use(
  cors({
    origin: true,
  })
);

app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "ai-job-matcher-api",
  });
});

app.use("/api/jobs", jobsRouter);
app.use("/api/candidates", candidatesRouter);
app.use("/api/matches", matchesRouter);

app.use(
  (
    error: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(error);

    res.status(500).json({
      error: error?.message || "Internal server error.",
    });
  }
);

app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});
