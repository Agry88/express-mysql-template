import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Initialize app engine
const app = express();

// General middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: [process.env.FRONT_URL!]}));

export default app

