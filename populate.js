import { readFile } from 'fs/promises' 
import dotenv from 'dotenv'
dotenv.config()
import connectDB from './db/connect.js' // we don't do it in server js so need to connect to db
import Job from './models/Job.js'

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    await Job.deleteMany() // clean out the db (optional)

    const jsonProducts = JSON.parse( // array of mock data
      await readFile(new URL('./mock-data.json', import.meta.url)) // this is because of use of es6 modules (not common js)
    )
    await Job.create(jsonProducts)
    console.log('Success!!!!')
    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

start() 
// node populate.js - to run and populate db