require("colors");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const path = require("path");
const connectDb = require("../config/db.js");

const express = require("express");
const { engine } = require("express-handlebars");

const notFound = require("./middlewares/notFound.js");
const errorMiddleware = require("./middlewares/errorMiddleware.js");
const authMiddleware = require("./middlewares/authMiddleware");

const app = express();

app.use(express.static("public"));

//set templates engine
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "backend/views");

// setup app to read JSON and forms
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const CONFIG_PATH = path.join(__dirname, "..", "config", ".env");

//load config
dotenv.config({ path: CONFIG_PATH });
//set routes

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get("/about", (req, res) => {
  res.render("about");
});

// app.post("/send", (req, res) => {
//   //res.send(req.body);
//   const { userName, userEmail } = req.body;

//   res.render("send", { msg: "Thanks!", userName, userEmail });
// });

const sendEmail = require("./services/sendEmail");

app.post("/send", async (req, res) => {
  const { userName, userEmail } = req.body;

  try {
    await sendEmail(req.body);
    res.render("send", { msg: "Thanks!", userName, userEmail });
  } catch (error) {
    console.log(error);
  }
});

app.use("/api/v1/films", require("./routes/filmsRoutes.js"));

// реєстрація - збереження користувача в системі (створення облікового запису)
// авторизация - перевірка даних, які ввів користувач, з даними з Бази даних
// аутентифікація  - перевірка прав виконувати певні дії (чи можна заходити в адмінку тощо)

const User = require("./models/UserModel");
const Role = require("./models/RoleModel");
const bcrypt = require("bcrypt");

app.use(
  "/register",
  (req, res, next) => {
    console.log("Спрацював Joi");
    next();
  },
  async (req, res) => {
    // робимо валідацію обов"язкових полів - чи передали, чи ні
    //console.log(req.body);

    const { userEmail, userPassword } = req.body;

    if (!userEmail) {
      return res
        .status(400)
        .json({ code: 400, message: "Please, provide required fields" });
    }

    // 1) шукаємо користувача в Базі даних

    const user = await User.findOne({ userEmail });
    const hasRole = await Role.findOne({ value: "ADMIN" });
    //  якщо користувач є - пропонуємо залогінитись

    if (user) {
      return res
        .status(409)
        .json({ code: 409, message: "User already exists. Please, login" });
    }

    //  якщо користувача немає, то
    // 2) хешуємо пароль

    const hashPassword = bcrypt.hashSync(userPassword, 5);
    //console.log(hashPassword);

    // 3) зберігаємо користувача в Базі

    const newUser = await User.create({
      ...req.body,
      userPassword: hashPassword,
      roles: [hasRole.value],
    });
    if (!newUser) {
      return res
        .status(400)
        .json({ code: 400, message: "Unable to save on DB" });
    }

    return res.status(201).json({ code: 201, user: newUser });
  }
);
//авторизація
app.use(
  "/login",
  (req, res, next) => {
    console.log("Спрацював Joi");
    next();
  },
  async (req, res) => {
    // 1) перевіряємо, чи ввів користувач необхідні поля
    const { userEmail, userPassword } = req.body;

    if (!userEmail || !userPassword) {
      return res
        .status(400)
        .json({ code: 400, message: "Please, provide required fields" });
    }

    // 2) переврити поля на валідність:
    //    - шукаємо користувача в Базі

    const user = await User.findOne({ userEmail });

    //    - розшифровуємо пароль

    const isValidPassword = bcrypt.compareSync(userPassword, user.userPassword);

    // 3) Якщо логін чи пароль не валідні - повідомляємо про ввод некоректних даних

    if (!user || !isValidPassword) {
      return res
        .status(400)
        .json({ code: 400, message: "Wrong login or password" });
    }

    // 4) Якщо все валідне, то видаємо токен
    const data = { id: user._id, roles: user.roles };
    user.token = generateToken(jwt, data);
    await user.save();

    if (!user.token) {
      return res
        .status(400)
        .json({ code: 400, message: "Unable create token" });
    }

    return res.status(200).json({
      code: 200,
      data: {
        email: user.userEmail,
        token: user.token,
      },
    });
  }
);

app.use("/logout", authMiddleware, async (req, res) => {
  const id = req.user._id;
  const user = await User.findById(id);

  user.token = null;
  await user.save();

  if (user.token) {
    res.status(400).json({ code: 400, message: "Unable to logout" });
  }

  res.status(200).json({ code: 200, message: "Logout success" });
});

function generateToken(jwt, data) {
  const payload = { data };

  return jwt.sign(payload, "pizza", {
    expiresIn: "2h",
  });
}

app.use(notFound);
app.use(errorMiddleware);

connectDb();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on PORT ${process.env.PORT}!`.cyan);
});
