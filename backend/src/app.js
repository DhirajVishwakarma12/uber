const express = require("express")
const authRoutes = require("./routes/auth.route")
const captainRoutes = require("./routes/captain.route")
const cookieParser = require("cookie-parser")
const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use("/api/auth",authRoutes)
app.use("/api/captain",captainRoutes)


module.exports =app;

