// Load environment variables
import dotenv from "dotenv";
dotenv.config();

import "express-async-errors";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import xss from "xss-clean";
import rateLimit from "express-rate-limit";


// middleware
import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import authRouter from "./routes/auth.js";
import jobRouter from "./routes/jobs.js";
import connectDB from "./db/connect.js";
import authToken from "./middleware/authentication.js"

const app = express();
app.set("trust proxy",1)
app.use(rateLimit({
  windowMs:15*60*1000,
  max:100,
}))
app.use(express.json())

app.use(helmet());
app.use(cors());
app.use(xss());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authToken,jobRouter);

// middlewares
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.Mongo_URL);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
