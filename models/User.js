import mongoose from "mongoose";

const { Schema, model } = mongoose;
// User Schema
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  },
});

const User = model("User", userSchema);

export default User;