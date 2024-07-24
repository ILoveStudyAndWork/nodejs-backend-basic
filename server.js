const express = require("express")

const connectDB = require("./db");
connectDB();

const app = express()
app.use(express.json())

app.use("/api/auth", require("./Auth/route"))

const PORT = 5000

const server = app.listen(PORT, () =>
    console.log(`Server Connected to port ${PORT}`)
)

// what is process here
process.on("unhandledRejection", err => {
    console.log(`An error occurred: ${err.message}`)
    server.close(() => process.exit(1))
})