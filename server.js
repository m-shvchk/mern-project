import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();

// db ans authenticate user

import connectDB from "./db/connect.js"
// !!! to use ES6 module import/export we should add "type": "module" in package.json
// and then use full name of the imported file (with .js extension)

// router

import authRouter from './routes/authRoutes.js'
import jobsRouter from './routes/jobsRoutes.js'

// middleware
import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";

app.use(express.json())

app.get("/", (req, res) => {
  res.send("Welcome!");
});

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', jobsRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;


const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () => console.log(`Server is listening on port ${port}...`));
  } catch (err) {
    console.log(err)
  }
}

start()