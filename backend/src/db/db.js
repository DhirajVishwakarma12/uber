const mongoose = require("mongoose")

const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Db connected successfully...")
    } catch (err) {
        console.log("Db not connected successfully. ", err.message)
        process.exit(1)
    }
}

module.exports = connectToDB