const express = require('express')
const authcheck = require('../middleware/authcheck')
const Router = express.Router()
const categoryModel = require('../Models/categoryModel')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

// add post
Router.post('/add', authcheck, async (req, res) => {
    // console.log(req.body)

    try {
        const authHeader = req.headers.authorization.split(" ")[1]
        const verify = jwt.verify(authHeader, "SecertKey")
        const userId = verify.userid
        const { title, image, } = req.body
        // console.log(title, image)

        if (title && image) {
            const newPost = new categoryModel({
                _id: new mongoose.Types.ObjectId,
                userId,
                title,
                image
            })
            await newPost.save()
            return res.status(200).json({
                message: `Successfully Add New Post title ${title} `
            })
        }
        return res.status(401).json({
            message:"Fill all Field in category section"
        })



    } catch (err) {
        // console.log(err)
        return res.status(500).json({
            message: "internal server error "
        })
    }
})
// get post 
Router.get('/', authcheck, async (req, res) => {
    const authHeader = req.headers.authorization.split(" ")[1]
    const verify = jwt.verify(authHeader, "SecertKey")
    const userId = verify.userid

    const findOwnPost = await categoryModel.find({ userId })
    return res.status(200).json({
        message: "fetch successfully",
        findOwnPost
    })
})

//delete Post 
Router.delete('/delete/:id', authcheck, async (req, res) => {
    try {
        const authHeader = req.headers.authorization.split(" ")[1]
        const verify = jwt.verify(authHeader, "SecertKey")
        const postId = req.params.id
        const deletePost = await categoryModel.deleteOne({ _id: postId, userId: verify.userid })
        // console.log(deletePost)
        if (!deletePost) {
            return res.status(409).json({
                message: "Delete Post failed"
            })
        }
        if (!deletePost.deletedCount == 0) {
            return res.status(200).json({
                message: "Delete Post Successfull"
            })
        }
        return res.status(401).json({
            message: "Unauthrized"
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal Server error"
        })
    }
})

//update
Router.put('/update/:id', authcheck, async (req, res) => {
    try {
        const authHeader = req.headers.authorization.split(" ")[1]
        const verify = jwt.verify(authHeader, "SecertKey")
        const userId = verify.userid
        const { title, image, } = req.body
        const postId = req.params.id
        const updatePost = await categoryModel.findOneAndUpdate({ _id: postId, userId: userId }).updateOne({
            title,
            image
        })

        if (!updatePost.modifiedCount == 0) {

            return res.status(200).json({
                message: "Update Post Successfull",
                title,
                image
            })
        }
        if (updatePost.matchedCount > 0 && updatePost.modifiedCount == 0) {
            return res.status(200).json({
                message: "save no any change at all",
                // updatePost
            })
        }

        return res.status(401).json({
            message: "Unauthorized",
            // updatePost
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "internal server error"
        })
    }
})
module.exports = Router