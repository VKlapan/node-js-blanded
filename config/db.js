const { connect, set } = require("mongoose");

set("strictQuery", false);

const connectDb = async () => {
  try {
    const db = await connect(process.env.MONGODB_URI);
    console.log(
      `mongoDb is connected: ${db.connection.name}, on PORT ${db.connection.port}, on HOST ${db.connection.host}`
        .green.italic
    );
  } catch (error) {
    console.log(error.message.red.bold);
    process.exit(1);
  }
};

module.exports = connectDb;

// const Cat = mongoose.model("Cat", { name: String });

// const kitty = new Cat({ name: "Zildjian" });

// kitty.save().then(() => console.log("meow"));
