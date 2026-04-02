import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import connectDB from "./src/config/database.js";

const PORT = process.env.PORT || 5000;

//  DB connect first
connectDB()
  .then(() => {
    console.log("MongoDB Connected ");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} `);
    });
  })
  .catch((err) => {
    console.log("DB ERROR ❌", err.message);
  });

//  health route (test ke liye)
app.get("/", (req, res) => {
  res.send("API Running ");
});