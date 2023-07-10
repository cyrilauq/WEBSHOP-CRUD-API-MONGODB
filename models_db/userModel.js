const mongoose = require("mongoose");

/**
 * Schema is the same as table, so we create the table.
 * To do that we give an object, each property of the object is a column
 * Then we give to each property an object, to tell its type, if it's require or not...
 * required take a table as a value, first a boolean, second the message to display if the boolean is not respected
 */
const userSchema = mongoose.Schema(
  {
    lastname: {
      type: String,
      required: [true, "Please enter a user lastname"],
    },
    firstname: {
      type: String,
      required: [true, "Please enter a user firstname"],
    },
    email: {
      type: String,
      required: [true, "Please enter a user email"],
    },
    username: {
      type: String,
      required: [true, "Please enter a user username"],
    },
    password: {
      type: String,
      required: [true, "Please enter a user password"],
    },
    salt: {
      type: String,
      required: [true, "Please enter a user salt"],
    },
    image: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;