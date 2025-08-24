import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = Number(process.env.API_PORT) || 3001;

app.get("/health", (_req, res) => res.json({ ok: true }));

app.listen(port, () => {
  console.log(`[api] ready on http://localhost:${port}`);
});
