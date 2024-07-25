const User = require("../model/User")
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const jwtSecret =
  "14f84451c59a1b19823171d6e36332e2688caad12f3f59b8342f253650140a214ad11f"

exports.register = async (req, res, next) => {
  const { username, password } = req.body
  if (password.length < 6) {
    return res.status(400).json({ message: "Password less than 6 characters" })
  }
  try {
    bcrypt.hash(password, 10)
      .then(async (hash) => {
        await User.create({
          username, password: hash
        })
          .then((user) => {
            const maxAge = 3 * 60 * 60;
            const token = jwt.sign(
              { id: user._id, username, role: user.role },
              jwtSecret,
              {
                expiresIn: maxAge,
              }
            );
            res.cookie("jwt", token, {
              httpOnly: true,
              maxAge: maxAge * 1000,
            });
            res.status(201).json({
              message: "User successfully created",
              user,
            })
          }

          )
      })
  } catch (err) {
    res.status(401).json({
      message: "User not successful created",
      error: error.mesage,
    })
  }
}

exports.login = async (req, res, next) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({
      message: "Username or Password not present"
    })
  }

  try {
    const user = await User.findOne({ username })
    if (!user) {
      res.status(401).json({
        message: "Login not successful",
        error: "User not found",
      })
    } else {
      bcrypt.compare(password, user.password)
        .then(function (result) {
          if (result) {
            const maxAge = 3 * 60 * 60;
            const token = jwt.sign(
              { id: user._id, username, role: user.role },
              jwtSecret,
              { expiresIn: maxAge }
            );
            res.cookie("jwt", token, {
              httpOnly: true,
              maxAge: maxAge * 1000,
            });
            res.status(201).json({
              message: "Login successful",
              user,
            })
          } else {
            res.status(400).json({ message: "Login not successful" })
          }
        })
    }
  } catch (error) {
    res.status(400).json({
      message: "An error occurred",
      error: error.message,
    })
  }
}


exports.update = async (req, res, next) => {
  const { role, id } = req.body;
  if (!(id && role)) {
    res.status(400).json({ message: "Role or Id is not present" })
  }

  if (role !== "admin") {
    res.status(400).json({
      message: "Role is not admin"
    })
  }

  await User.findById(id)
    .then((user) => {
      if (user.role === "admin") {
        res.status(400).json({ mesage: "User is already an Admni" });
        process.exit(1);
      }
      user.role = role;
      user.save()
        .then((user) => res.status(201).json({ message: "Update successful", user }))
        .catch((err) => {
          if (err) {
            res
              .status("400")
              .json({ message: "An error occurred", error: err.message });
          }
        });
    })
    .catch((error) => {
      res
        .status(400)
        .json({ message: "An error occurred", error: error.message })
    });
}

exports.deleteUser = async (req, res, next) => {
  const { id } = req.body;
  await User.findById(id)
    .then((user) => user.deleteOne())
    .then((user) =>
      res.status(201).json({ message: "User successfully deleted", user })
    )
    .catch(error => {
      res
        .status(400)
        .json({ message: "An error occurred", error: error.message })
    })
}




