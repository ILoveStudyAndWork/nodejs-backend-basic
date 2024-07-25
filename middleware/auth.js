const jwt = require("jsonwebtoken")
const jwtSecret =
    "14f84451c59a1b19823171d6e36332e2688caad12f3f59b8342f253650140a214ad11f"

exports.adminAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({ message: "Not authorized, token not available" })
    }

    jwt.verify(token, jwtSecret, (err, decodedToken) => {
        if (err || decodedToken.role !== "admin") {
            return res.status(401).json({ message: "Not authorized" })
        } else {
            next()
        }
    })
}

exports.userAuth = (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
      jwt.verify(token, jwtSecret, (err, decodedToken) => {
        if (err) {
          return res.status(401).json({ message: "Not authorized" })
        } else {
          if (decodedToken.role !== "Basic") {
            return res.status(401).json({ message: "Not authorized" })
          } else {
            next()
          }
        }
      })
    } else {
      return res
        .status(401)
        .json({ message: "Not authorized, token not available" })
    }
  }