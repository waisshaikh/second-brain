import dotenv from "dotenv";
dotenv.config();

import path from "path";
import app from "./src/app.js";
import connectDB from "./src/config/database.js";

connectDB();

const __dirname = path.resolve();

// SERVE FRONTEND FROM backend/dist
app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});