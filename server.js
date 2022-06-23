import express from 'express'
import notFoundMiddleware from './middleware/not-found.js'
import errorHandlerMiddleware from './middleware/error-handler.js'
// !!! to use ES6 module import/export we should add "type": "module" in package.json
// and then use full name of the imported file (with .js extension)
const app = express()


// middleware

app.get('/', (req, res) => {
  res.send('Welcome!')
})

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Server is listening on port ${port}...`))