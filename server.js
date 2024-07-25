const express = require("express")
const cookieParser = require("cookie-parser");
const { adminAuth, userAuth } = require("./middleware/auth.js");
const connectDB = require("./db");
connectDB();

const app = express()
app.use(express.json())
app.set("view engine", "ejs");
app.use(cookieParser());
app.use("/api/auth", require("./Auth/route"))

app.get("/", (req, res) => res.render("home"));
app.get("/register", (req, res) => res.render("register"));
app.get("/login", (req, res) => res.render("login"));
app.get("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: "1" });
  res.redirect("/");
});
app.get("/admin", adminAuth, (req, res) => res.render("admin"));
app.get("/basic", userAuth, (req, res) => res.render("user"));

const PORT = 5001
const server = app.listen(PORT, () =>
    console.log(`Server Connected to port ${PORT}`)
)

process.on("unhandledRejection", err => {
    console.log(`An error occurred: ${err.message}`)
    server.close(() => process.exit(1))
})