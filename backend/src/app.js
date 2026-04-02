import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import memoryRoutes from "./routes/memory.routes.js"
import collectionRoutes from "./routes/collection.route.js";

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.get("/",(req,res)=>{
    return res.send("Home route (health check API)")
})

app.use("/api/auth", authRoutes);
app.use("/api/memory", memoryRoutes);
app.use("/api/collection", collectionRoutes);

export default app;