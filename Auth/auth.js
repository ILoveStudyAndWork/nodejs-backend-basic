const User = require("../model/User")

exports.register = async (req, res, next) => {
  const { username, password } = req.body
  if (password.length < 6) {
    return res.status(400).json({ message: "Password less than 6 characters" })
  }
  try {
    await User.create({
      username,
      password,
    }).then(user =>
      res.status(200).json({
        message: "User successfully created",
        user,
      })
    )
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
    const user = await User.findOne({ username, password })
    if (!user) {
      res.status(401).json({
        message: "Login not successful",
        error: "User not found",
      })
    } else {
      res.status(200).json({
        message: "Login successful",
        user,
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
  if (role && id) {
    if (role === "admin") {
      await User.findById(id)
        .then((user) => {
          if (user.role != "admin") {
            user.role = role;
            user.save()
              .then((user) => res.status(201).json({ message: "Update successful", user }))
              .catch((err) => {
                if (err) {
                  res
                    .status("400")
                    .json({ message: "An error occurred", error: err.message });
                  process.exit(1);
                }
              });
          } else {
            res.status(400).json({ mesage: "User is already an Admni" });
          }
        })
        .catch((error) => {
          res
            .status(400)
            .json({ message: "An error occurred", error: error.message })
        });
    } else {
      res.status(400).json({
        message: "Role is not admin"
      })
    }
  } else {
    res.status(400).json({ message: "Role or Id is not present" })
  }

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




