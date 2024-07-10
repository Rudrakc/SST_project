const express = require("express");
const User = require("../models/userModel");
const bcrypt = require('bcrypt')

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const UserExists = await User.findOne({ email: req.body.email });
        if (UserExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;

        const newUser = new User(req.body);
        await newUser.save();
        res.status(200).json(newUser);
    } catch (error) {
        
    }
});

router.post("/login", async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).json({ message: "User does not exist, please register" });
    }

    //Compare password
    const isValidPassword = await bcrypt.compare(req.body.password, user.password);
    if (!isValidPassword) {
        return res.status(400).json({ message: "Invalid password" });
    }

    res.status(200).send("User successfully logged in");
  
});


module.exports = router;