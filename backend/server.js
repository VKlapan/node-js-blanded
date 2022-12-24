require("colors");
const dotenv = require("dotenv");
const path = require("path");
const connectDb = require("../config/db.js");

const express = require("express");

const notFound = require("./middlewares/notFound.js");
const errorMiddleware = require("./middlewares/errorMiddleware.js");

const app = express();

// setup app to read JSON and forms
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const CONFIG_PATH = path.join(__dirname, "..", "config", ".env");

//load config
dotenv.config({ path: CONFIG_PATH });
//set routes

app.use("/api/v1/films", require("./routes/filmsRoutes.js"));

app.use(notFound);
app.use(errorMiddleware);

connectDb();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on PORT ${process.env.PORT}!`.cyan);
});
