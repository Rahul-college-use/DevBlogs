const express = require('express')
const authcheck = require('../middleware/authcheck')
const Router = express.Router()
const commentModel = require('../Models/commentModel')
const mongoose = require('mongoose')
const BlogModel = require('../Models/BlogModel')
const jwt = require('jsonwebtoken')

//post
Router.post('', authcheck, async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const verify = jwt.verify(token, 'SecertKey')
        const userName = verify.firstName + " " + verify.lastName

        // console.log(userName)
        const { comment, blogId } = req.body

        const findBlog = await BlogModel.find({ _id: blogId })
        if (!findBlog) {

            return res.status(500).json({
                message: "Error in comment post"
            })
        }
        const commentPost = new commentModel({
            _id: new mongoose.Types.ObjectId,
            userId: verify.userid,
            comment,
            blogId,
            userName,
        })
        await commentPost.save()
        return res.status(200).json({
            message: "Comment post Successfull"
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "internal server error"
        })
    }
})

//get
Router.get('/:id', async (req, res) => {
    const blogPostid = req.params.id
    const findBlog = await commentModel.find({ blogId: blogPostid })
    return res.status(200).json({
        message: "Fetch all comment",
        findBlog
    })
})


//update
Router.put('/update/:id', authcheck, async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const verify = jwt.verify(token, 'SecertKey')
        const cmtPostid = req.params.id
        const { comment } = req.body
        const cmtPost = await commentModel.find({ _id: cmtPostid, userId: verify.userid }).updateOne({
            comment,
        })
        if (!cmtPost.modifiedCount == 0) {

            return res.status(200).json({
                message: "Update Post Successfull",
                comment,
            })
        }
        if (cmtPost.matchedCount > 0 && cmtPost.modifiedCount == 0) {
            return res.status(200).json({
                message: "save no any change at all",
                cmtPost
            })
        }

        return res.status(401).json({
            message: "Unauthorized",
            // cmtPost

        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal server error"
        })
    }
})
//delete 
Router.delete("/delete/:id", authcheck, async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const verify = jwt.verify(token,"SecertKey")
        const cmtId = req.params.id
        const deleteCmt = await commentModel.deleteOne({ _id: cmtId,userId:verify.userid })
        if (deleteCmt.deletedCount > 0) {
            return res.status(200).json({
                message:"Delete message successfull"
            })
        }
         return res.status(401).json({
                message:"unauthorized"
            })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "internall server error"
        })
    }
})
module.exports = Router