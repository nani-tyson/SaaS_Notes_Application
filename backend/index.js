import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";

//configs
import connectDB from "./config/db.js";

//routes
import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import tenantRoutes from "./routes/tenantRoutes.js";
import userRoutes from "./routes/userRoutes.js";



const app = express();
app.use(express.json());
app.use(cors({
    origin : [process.env.LOCAL_FRONTEND_URL, process.env.DEPLOYED_FRONTEND_URL],
    credentials : true,
}));
app.use(urlencoded({ extended: true }));

dotenv.config();
const PORT = process.env.PORT || 5000;

//health check route
app.get('/health', (req, res) => res.json({ status: 'ok' }));


app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/tenants", tenantRoutes);
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});

export default app;