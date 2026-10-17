const express = require('express')
const app = express()
const db = require('./DB_connect/db')
const body_parser = require('body-parser')
const cors = require('cors')
const dns = require('dns')
dns.setServers(['1.1.1.1', '8.8.8.8', '8.8.4.4', '1.0.0.1'])


const userRoute = require('./Routes/user') // signup login
const catRoute = require('./Routes/category') // own post get delete
const BlogRoute = require('./Routes/blog')
const commentRoute = require('./Routes/comment')

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Add this line to handle preflight OPTIONS requests explicitly
app.options('*', cors());

app.use(express.json())

app.use(body_parser.json())

app.use('/user', userRoute)
app.use('/category', catRoute)
app.use('/blog', BlogRoute)
app.use('/comment', commentRoute)



module.exports = app