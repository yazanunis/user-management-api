import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Joi from 'joi'

import User from "../models/userModel.js";

export const getUsers= async (req, res) => {
    try {
        if(req.user.role !== "admin") {
            return res.status(403).send("Access Denied")
        }

        const users = await User.find({ _id: { $ne: req.user.id } }).select(("-password"))
        res.status(200).json(users)
    } catch (error) { 
        res.status(404).json({ message: error.message })
    }
}

export const getUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id).select("-password")
        res.status(200).json(user)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params
        await User.findByIdAndDelete(id)
        res.json({ message: "Account deleted" })

    } catch (error) {
        res.json({ message: error.message }) 
    }
} 

export const updateUser = async (req, res) => {
    try {
        const { name, email } = req.body
        const updatedUser = await User.findByIdAndUpdate(req.params.id, 
            { $set: { name, email } },
            { new: true }
        ).select("-password")
        res.status(200).json(updatedUser)
    } catch (error) {
        res.json({ message: error.message })
    }
}

export const loginUser = async (req, res) => {
    try {
        const user = req.body
        const userWithEmail = await User.findOne({ email: user.email })
        if(!userWithEmail) {
            res.status(404).json({ message: "Email dosn't exist" })
            return
        }

        const isCorrect = await bcrypt.compare(user.password, userWithEmail.password)

        if(!isCorrect) {
            res.status(404).json({ message: "Password is not correct!" })
            return
        }
        
        const payload = {
            id: userWithEmail._id,
            role: userWithEmail.role
        }
        const token = jwt.sign(payload, process.env.JWT_Secret, {expiresIn: '1h'})

        res.status(200).json({
            message: "Login Successfully",
            token,
            user: {
                id: userWithEmail._id,
                name: userWithEmail.name,
                email: userWithEmail.email,
                role: userWithEmail.role
            }
        })
    } catch (error) {
        res.json({ message: error.message })
    }
}


export const registerUser = async (req, res) => {
    try {
        const user = req.body

        const validPassword = Joi.object({
            password: Joi.string().min(8).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        })

        const { error } = validPassword.validate({password: user.password})
        if(error) {
            return res.status(400).json({ message: "Your password must be at least 8 characters long and must include capital letters and symbols" })
        }
        
        const userWithEmail = await User.findOne({ email: user.email })
        if(userWithEmail) {
            res.status(404).json({ message: "Email already exist!" })
            return
        }
 
        const random = await bcrypt.genSalt(15)
        const hashPassword = await bcrypt.hash(user.password, random)

        const newUser = new User({
            name: user.name,
            email: user.email,
            password: hashPassword
        })

        await newUser.save()

        const payload = {
            id: newUser._id,
            role: newUser.role
        }
        const token = jwt.sign(payload, process.env.JWT_Secret, {expiresIn: '1h'})

        res.status(201).json({
            message: "Account Created Successfully",
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        })
    } catch (error) {
        res.json({ message: error.message }) 
    }
}

