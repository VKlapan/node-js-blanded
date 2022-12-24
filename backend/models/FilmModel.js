const { Schema, model } = require("mongoose");

const schemaFilm = Schema({
  title: String,
  year: Number,
  rate: Number,
});

module.exports = model("film", schemaFilm);

//  {
//   title, year, rate;
// }
