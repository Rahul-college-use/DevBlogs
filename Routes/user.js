const express = require('express')
const userModel = require('../Models/userModel')
const mongoose = require('mongoose')
const Router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

Router.post('/signup', async (req, res) => {
    try {
        const Already = await userModel.findOne({ email: req.body.email })
        if (Already) {
            return res.status(409).json({
                message: "User Already exists ",
            })
        }
        bcrypt.hash(req.body.password, 10, async (err, hash) => {
            if (err) {
                return res.status(500).json({
                    message: "Internal Server Error"
                })
            }
            const newUser = new userModel({
                _id: new mongoose.Types.ObjectId,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: hash
            })

            await newUser.save()

            return res.status(200).json({
                message: "=> Successfully Registation Now You can Login <=",
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: hash
            })

        })

    } catch (err) {
        // console.error(err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
})

const MAX_ATTEMPTS = 5;
const LOCK_TIME = 60 * 60 * 1000;

Router.post('/login', async (req, res) => {
    // console.log("login post request")
    // const body = await userModel.find({email: req.body.email})
    // console.log(body)
    try {
        const { email, password } = req.body

        const isEmailValid = await userModel.findOne({ email: email })
        if (!isEmailValid) {
            return res.status(409).json({
                message: "Email Dose not Exists"
            })
        }
        // console.log(isEmailValid.email)

        const now = Date.now();

        // 1. Check if account is locked
        if (isEmailValid.lockUntil && isEmailValid.lockUntil > now) {
            const remainingMinutes = Math.ceil((isEmailValid.lockUntil - now) / (1000 * 60));
            return res.status(429).json({
                message: `Account is locked due to too many failed login attempts. Try again after ${remainingMinutes} minutes.`
            });
        }

        // 2. Compare password
        const passcheck = await bcrypt.compare(password, isEmailValid.password)
        if (!passcheck) {
            isEmailValid.loginAttempts = (isEmailValid.loginAttempts || 0) + 1;

            if (isEmailValid.loginAttempts >= 5) {
                isEmailValid.lockUntil = now + (60 * 60 * 1000);
                await isEmailValid.save();
                return res.status(429).json({
                    message: "Too many failed attempts. Account is locked for 1 hour."
                });
            }

            await isEmailValid.save();
            return res.status(400).json({
                message: `Email or Password invalid. Attempts left: ${5 - isEmailValid.loginAttempts}`
            });
        }

        if (isEmailValid.loginAttempts > 0 || isEmailValid.lockUntil) {
            isEmailValid.loginAttempts = 0;
            isEmailValid.lockUntil = undefined;
            await isEmailValid.save();
        }

        const token = jwt.sign(
            {
                firstName: isEmailValid.firstName,
                lastName: isEmailValid.lastName,
                email: isEmailValid.email,
                userid: isEmailValid._id,
            }, "SecertKey",
            {
                expiresIn: "2d"
            }
        )

        return res.status(200).json({
            message: "Login successful",
            firstName: isEmailValid.firstName,
            lastName: isEmailValid.lastName,
            email: isEmailValid.email,
            userid: isEmailValid._id,
            token:token
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }

})

module.exports = Router