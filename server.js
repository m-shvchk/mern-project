import express from "express";
const app = express();
// import cors from 'cors' // package to deal with CORS errors
import dotenv from "dotenv";
dotenv.config();
import 'express-async-errors' // helps pass error to error handler middleware without try/catch + next() in the controller
 
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

// app.use(cors()) // applying CORS package as a middleware
app.use(express.json())

app.get("/", (req, res) => { // dummy route
  res.json({msg: "Welcome!"});
});

app.get("/api/v1", (req, res) => {
  res.json({msg: "API"});
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