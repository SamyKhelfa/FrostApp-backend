const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  role: String,
  profilePicture: String,
  program: {
    type: Schema.Types.ObjectId,
    ref: "Program",
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
