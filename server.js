import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import 'express-async-errors' // helps pass error to error handler middleware without try/catch + next() in the controller
import morgan from 'morgan' // HTTP request logger middleware for node.js

import { dirname } from 'path'
import { fileURLToPath } from 'url'
import path from 'path'

// db ans authenticate user
import connectDB from "./db/connect.js"
// !!! to use ES6 module import/export we should add "type": "module" in package.json and then use full name of the imported file (with .js extension)

// router
import authRouter from './routes/authRoutes.js'
import jobsRouter from './routes/jobsRoutes.js'

// middleware
import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import authenticateUser from './middleware/auth.js'

if (process.env.NODE_ENV !== 'production') { // we don't need morgan package in production
  app.use(morgan('dev')) // :method :url :status :response-time ms - :res[content-length]
}

const __dirname = dirname(fileURLToPath(import.meta.url)) // a workaround (__dirname is not available by default in es6 modules)

app.use(express.json())
app.use(express.static(path.resolve(__dirname, './client/build'))) //only when ready to deploy

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authenticateUser, jobsRouter)

// point to the index.html in build folder - where the react router is (only when ready to deploy):
app.get('*', function (req, res) {
  res.sendFile(path.resolve(__dirname, './client/build', 'index.html'))
})

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