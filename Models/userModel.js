const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date }
})

module.exports = mongoose.model('user', userSchema)