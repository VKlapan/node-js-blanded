const { Schema, model } = require("mongoose");

const schemaRole = Schema({
  value: {
    type: String,
    unique: true,
    index: true,
    required: false,
    default: "USER",
  },
});

module.exports = model("Role", schemaRole);
