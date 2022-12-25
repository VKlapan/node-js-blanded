const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const authMiddleware = async (req, res, next) => {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      const [Bearer, token] = req.headers.authorization.split(" ");

      if (!token) {
        return res.status(400).json({
          code: 400,
          message: "Please, provide token",
        });
      }

      const decoded = jwt.verify(token, "pizza");
      const { id } = decoded.data;

      const user = await User.findById(id);
      req.user = user;
    }

    next();
  } catch (error) {}
};

module.exports = authMiddleware;
