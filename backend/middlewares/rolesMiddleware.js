const jwt = require("jsonwebtoken");

module.exports = (rolesArray) => {
  return (req, res, next) => {
    // if (req.method === "OPTIONS") {
    //   next();
    // }
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
        const { roles: userRoles } = decoded.data;
        let hasRole = false;
        userRoles.forEach((role) => {
          if (rolesArray.includes(role)) {
            hasRole = true;
          }
        });
        if (!hasRole) {
          return res
            .status(403)
            .json({ code: 403, message: "You don't have permission" });
        }
      }

      next();
    } catch (error) {
      return res.status(403).json({ code: 403, message: "Unauthorized" });
    }
  };
};
