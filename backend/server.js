import dotenv from "dotenv";
dotenv.config();

import path from "path";
import app from "./src/app.js";
import connectDB from "./src/config/database.js";

connectDB();

const __dirname = path.resolve();

// SERVE FRONTEND BUILD
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)});