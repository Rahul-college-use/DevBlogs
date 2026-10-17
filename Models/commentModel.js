const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: { type: String, required: true },
    comment: { type: String, required: true },
    blogId: { type: String, required: true },
    userName: { type: String, required: true },
    date: { type: Date, default: Date.now }
}
)

module.exports = mongoose.model('commentModel', commentSchema)