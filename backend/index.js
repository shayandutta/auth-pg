import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";


dotenv.config();

const app = express();
app.use(cookieParser());
app.use(express.json());


const PORT = process.env.PORT || 3000;

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});