import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import memoryRoutes from "./routes/memory.routes.js"

const app = express();

app.use(cors({
    origin:"http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.get("/",(req,res)=>{
    return res.send("Home route (health check API)")
})

app.use("/api/auth", authRoutes);
app.use("/api/memory", memoryRoutes);

export default app;