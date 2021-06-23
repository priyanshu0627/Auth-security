//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine','ejs');

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

userSchema.plugin(encrypt,{secret: process.env.SECRET,encryptedFields: ['password']});

const User = mongoose.model("User",userSchema);

const newData = new User({
  email: "adasd@asdd.com",
  password: "asdasd"
});

newData.save();

app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.post("/login",function(req,res){
  const email = req.body.username;
  const password = req.body.password;

  User.findOne({email: email},function(err,userFound){
    if (err) {
      console.log(err);
    } else {
      if(userFound){
        if(userFound.password === password){
        res.render("secrets");
      }
      }
    }
  });
});

app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){
  const newEntry = new User({
    email: req.body.username,
    password: req.body.password
  });

  newEntry.save(function(err){
    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});

app.listen(3000 ,function(req,res){
  console.log("Up and running");
});
