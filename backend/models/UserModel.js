const { Schema, model } = require("mongoose");

const schemaUser = Schema({
  userName: {
    type: String,
    required: false,
    default: "User Anonymous",
  },
  userEmail: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  userPassword: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: false,
    default: null,
  },
  roles: [
    {
      type: String,
      ref: "Role",
    },
  ],
});

module.exports = model("user", schemaUser);
