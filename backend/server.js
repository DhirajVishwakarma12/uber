const dotenv = require("dotenv")
const http = require("http")
const app = require("./src/app")
const connectToDB = require("./src/db/db")
const server = http.createServer(app)

dotenv.config()
connectToDB()

PORT = process.env.PORT || 5000

app.listen(PORT , ()=>{
    console.log(`Server is running on port : ${PORT}`)
})