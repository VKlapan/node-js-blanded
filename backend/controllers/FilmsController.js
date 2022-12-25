// http://localhost:62000/api/v1/films
const Film = require("../models/FilmModel.js");

class FilmsController {
  async add(req, res) {
    const { title, year, rate } = req.body;

    if (!title || !year || !rate) {
      const error = new Error("Please, provide all fields");
      error.status = 400;
      throw error;
    }

    const film = await Film.create({ ...req.body });
    if (!film) {
      res.status(400);
      throw new Error("Unnable to save!");
    }

    res.status(201).json({ code: 201, data: film });
  }

  async getAll(req, res) {
    const films = await Film.find({});
    if (!films) {
      res.status(400);
      throw new Error("Unnable to fetch!");
    }

    res.status(200).json({ code: 200, data: films, qty: films.length });
  }

  async getOne(req, res) {
    console.log("Get One");
  }

  async remove(req, res) {
    console.log("Remove");
  }

  async update(req, res) {
    console.log("Update");
  }
}

module.exports = new FilmsController();
