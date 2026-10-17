const mongoose = require('mongoose')

const BlogSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: { type: String, required: true },
    title: { type: String, required: true },
    image: { type: String, required: true },
    descripation: { type: String, required: true },
    categoryId: { type: String, required: true },
    categoryName: { type: String, required: true },
    userName: { type: String, required: true },
    status: {
        type: String, required: true,
        enum: ["draft", "post"],
        default: "post"
    },
})

module.exports = mongoose.model('BlogModel', BlogSchema)