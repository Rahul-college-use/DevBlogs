const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    title: { type: String, required: true },
    image: { type: String, required: true },
   
})

module.exports = mongoose.model('categoryModel',categorySchema)