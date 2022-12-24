const express = require("express");
const filmsController = require("../controllers/FilmsController.js");

const router = express.Router();

router.get("/", filmsController.getAll);

router.get("/:id", filmsController.getOne);

router.post("/", filmsController.add);

router.delete("/:id", filmsController.remove);

router.put("/:id", filmsController.update);

module.exports = router;
