const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_CLASSIFIED } = require("../keys");
const requireLogin = require("../middleware/requireLogin");

router.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(422).json({ error: "Please fill in all fields" });
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res
          .status(422)
          .json({ error: "User with that email already exists" });
      }
      bcrypt.hash(password, 12).then((hashedpassword) => {
        //the higher the number the more secure//
        const user = new User({
          email,
          name,
          password: hashedpassword,
        });
        user
          .save()
          .then((user) => {
            res.json({ message: "Sign Up Successful" });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "Please add email or password" });
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "Invalid email or password" });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((doMatch) => {
        if (doMatch) {
          //  res.json({ message: "Successfully logged in" });//
          const token = jwt.sign({ _id: savedUser._id }, JWT_CLASSIFIED);
          const { _id, name, email } = savedUser;
          res.json({ token, user: { _id, name, email } });
        } else {
          return res.status(422).json({ error: "Invalid email or password" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

module.exports = router;

//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
