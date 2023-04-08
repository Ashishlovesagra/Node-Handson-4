const express = require("express");
const route = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltround = 10;
const userData = [];

route.post("/register", async (req, res) => {
  const userInfo = req.body;
  console.log(userData);
  try {
    if (
      userInfo.name == null ||
      userInfo.email == null ||
      userInfo.password == null ||
      userInfo.phone == null
    ) {
      res.status(403).send({
        message: "please provide complate information",
      });
      return;
    }
    // Hash the password
    const hashpassword = await bcrypt.hash(userInfo.password, saltround);
    // Create a new user
    const newUser = {
      name: userInfo.name,
      phone: userInfo.phone,
      email: userInfo.email,
      password: hashpassword,
    };
    // Save the user to the userData
    userData.push(newUser);
    // Return success status code and message
    res.status(201).send({
      message: "User successfully registered",
    });
  } catch (error) {
    // Return error status code and message
    res.status(500).json({
      message: "User has not registered, please try again",
    });
  }
});

route.post("/login", async (req, res) => {

    //validation of data or user input
    userData.forEach(async (loginData) => {
      // Find the user by email
      if (req.body.email === loginData.email) {
        // Compare the hashed password with the provided password
        const validate = await bcrypt.compare(
          req.body.password,
          loginData.password
        );
        // If the passwords don't match, return an error message
        if (!validate) {
          return res.status(401).send({ message: "Incorrect Password, Try Again" });
        }

        // Create a JWT token
        try{
        const token = jwt.sign({ userId: loginData.email }, "secretKey");
        // Return success status code, message, and token
        res.status(200).send({
          message: "User has logged in successfully",
          token,
        });
        }catch(error){
            res.status(500).send({
            message: "Login failed, please try again",
       });
        }
      }
    });
});

module.exports = route;
