require('dotenv').config();
const mongoose = require('mongoose');
// console.log(process.env.MONGO_URI)
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('DB connected'))
    .catch(err => console.error('DB not connected:', err.message));

module.exports = mongoose;