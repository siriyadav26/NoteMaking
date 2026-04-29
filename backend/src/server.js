import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import notesRoutes from "./routes/notesRoutes.js";
import { connectdB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());

// TEMP: disable rate limiter (it’s causing errors)
// app.use(rateLimiter);

// API routes FIRST
app.use("/api/notes", notesRoutes);

// Serve frontend AFTER API
app.use(express.static(path.join(__dirname, "../public")));

// Catch-all route (VERY IMPORTANT — must be LAST)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

// Start server
connectdB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
  });
});
