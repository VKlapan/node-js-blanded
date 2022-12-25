const express = require("express");
const filmsController = require("../controllers/FilmsController.js");
const rolesMiddleware = require("../middlewares/rolesMiddleware");

const router = express.Router();

router.get("/", rolesMiddleware(["ADMIN", "CUSTOMER"]), filmsController.getAll);

router.get("/:id", filmsController.getOne);

router.post("/", rolesMiddleware(["EDITOR"]), filmsController.add);

router.delete("/:id", filmsController.remove);

router.put("/:id", filmsController.update);

module.exports = router;

/* 
roles
["USER", "EDITOR", "MODERATOR"]

USER 
MODERATOR
EDITOR

ADMIN

CUSTOMER

*/
