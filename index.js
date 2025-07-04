import express from "express";

import session from "express-session";
import mongoose from "mongoose";
import passport from "passport";
import User from "./models/User.js";
import bcrypt from "bcryptjs";
import "./local.js";
import MongoStore from "connect-mongo";
import { verifyUser } from "./middleware/verify.js";
import dotenv from "dotenv";
dotenv.config();
mongoose
  .connect(process.env.MONGO_URI)
  .finally(() => console.log(`MONGO_ACTIVE!`));
const app = express();

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60000 * 60,
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

app.post(`/api/register`, async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(401)
      .json({ err: "Fill in the Username, Email, and Password Field!" });
  }

  const user = await User.findOne({ email });

  if (user) {
    return res.status(401).json({ err: "User Already Exists!" });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    username,
    email,
    password: hashPassword,
  });

  return res.status(201).json({
    id: newUser._id,
    username: newUser.username,
    email: newUser.email,
  });
});

//
app.post(`/api/login`, passport.authenticate("local"), (req, res) => {
  return res.json({
    id: req.user._id,
    username: req.user.username,
    email: req.user.email,
  });
});

app.get(`/api/me`, verifyUser, (req, res) => {
  return res.status(200).json({
    id: req.user._id,
    username: req.user.username,
    email: req.user.email,
  });
});

app.get(`/api/logout`, async (req, res) => {
  req.logOut((err) => {
    if (err) {
      return res.status(500).json({ err: "Error Found!" });
    }
  });
  res.sendStatus(200);
});
app.listen(4000, () => console.log("Server Running on  PORT: 4000"));
