const express = require('express')
const authcheck = require('../middleware/authcheck')
const Router = express.Router()
const BlogModel = require('../Models/BlogModel')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

//post
Router.post('', authcheck, async (req, res) => {
    // console.log("step 1")
    const authHeader = req.headers.authorization.split(" ")[1]
    // console.log("step 2"+ authHeader)
    const verify = jwt.verify(authHeader, "SecertKey")
    const userId = verify.userid
    const { title, image, categoryId, categoryName, descripation, status } = req.body
    // console.log(verify.firstName + " "+verify.lastName)

    try {

        const newBlog = new BlogModel({
            _id: new mongoose.Types.ObjectId,
            userId,
            title,
            image,
            categoryId,
            categoryName,
            descripation,
            status,
            userName: verify.firstName + " " + verify.lastName,

        })
        await newBlog.save()
        return res.status(200).json({
            message: `Successfully Add New Blog title ${title} Category in ${categoryName} `,
            newBlog
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "internal server error "
        })
    }
})

//get
Router.get('/', authcheck, async (req, res) => {
    const authHeader = req.headers.authorization.split(" ")[1]
    const verify = jwt.verify(authHeader, "SecertKey")
    const userId = verify.userid

    const findOwnPost = await BlogModel.find({ userId })
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
        const deletePost = await BlogModel.deleteOne({ _id: postId, userId: verify.userid })
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
        const { title, image, categoryId, categoryName, descripation, status } = req.body
        const postId = req.params.id
        const updatePost = await BlogModel.findOneAndUpdate({ _id: postId, userId: userId }).updateOne({
            title,
            image,
            categoryId,
            categoryName,
            descripation,
            status
        })

        if (!updatePost.modifiedCount == 0) {

            return res.status(200).json({
                message: "Update Post Successfull",
                title,
                image,
                categoryId,
                categoryName,
                descripation,
                status
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

//get all blog
Router.get('/get-all', async (req, res) => {
    const findAllPost = await BlogModel.find({ status: 'post' }).select("_id userId title image descripation categoryId categoryName userName status")
    return res.status(200).json({
        message: "fetch successfully",
        findAllPost
    })
})
//fiiter by category 
Router.get('/category/:id', authcheck, async (req, res) => {
    const findPost = await BlogModel.find({ status: 'post',categoryId:req.params.id }).select("_id userId title image descripation categoryId categoryName userName status")
    return res.status(200).json({
        message: "fetch successfully",
        findPost
    })
})
module.exports = Router
