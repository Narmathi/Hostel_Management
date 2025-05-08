import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import cookieParser from 'cookie-parser';


dotenv.config();
const app = express();


app.use(cookieParser());

app.use(bodyParser.json());

app.use(cors({
    origin: 'http://localhost:5173',  
    credentials: true                
  }));



app.use("/api/hostel", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
