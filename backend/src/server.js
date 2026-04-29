import express from "express";
import dotenv from "dotenv";
import path from "path";

import notesRoutes from "./routes/notesRoutes.js";
import { connectdB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// IMPORTANT for ES modules
const __dirname = path.resolve();

// ✅ Middleware
app.use(express.json());
app.use(rateLimiter);

// ✅ API Routes
app.use("/api/notes", notesRoutes);

// ✅ Serve frontend (production)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../public")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "index.html"));
  });
}

// ✅ Start server after DB connects
connectdB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
  });
});
