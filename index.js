import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";

//configs
import connectDB from "./config/db.js";

//routes


const app = express();
app.use(express.json());
app.use(cors({
    origin : [process.env.LOCAL_FRONTEND_URL, process.env.DEPLOYED_FRONTEND_URL],
    credentials : true,
}));
app.use(urlencoded({ extended: true }));

dotenv.config();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});