const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://rahulcollegeuse_db_user:fUa2mDXf6hv6xIx9@cluster0.nu3p15w.mongodb.net//blog').then(() => {
    console.log("DB connected")
}).catch((err) => {
    console.log("DB not connected")
})
module.exports = mongoose