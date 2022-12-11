require("colors");
const dotenv = require("dotenv");
const path = require("path");
const connectDb = require("../config/db.js");

const CONFIG_PATH = path.join(__dirname, "..", "config", ".env");

//load config
dotenv.config({ path: CONFIG_PATH });

connectDb();
