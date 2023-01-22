console.log("webpack test");
import "./css/styles.css";

class User {
  #name;
  constructor() {
    this.#name = "Klapan";
  }

  getName() {
    console.log(this.#name);
  }
}

const Vladimir = new User();
Vladimir.getName();

console.log("webpack test 2");
