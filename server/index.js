const express = require("express")
const cors = require("cors")
require("dotenv").config()
const connectDB = require("./config/db")

const app = express()

// Connect to MongoDB
connectDB()

app.use(cors())
app.use(express.json())

const uploadRoute = require("./routes/uploadRoute")
const authRoute = require("./routes/authRoute")

app.use("/api", uploadRoute)
app.use("/api/auth", authRoute)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})