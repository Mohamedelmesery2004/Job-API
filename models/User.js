import Mongoose from "mongoose";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
export const userSchema = new Mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    maxlength: 50,
    minlength: 3,
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 6,
  },
});
userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.createJWT = function () {
  return JWT.sign({ userID: this._id, name: this.name }, process.env.secert, {
    expiresIn: "30h",
  });
};

userSchema.methods.comparePassword = async function (candatePass) {
  const match = await bcrypt.compare(candatePass,this.password)
  
  return match;
}
const User = Mongoose.model("User", userSchema);
export default User;
