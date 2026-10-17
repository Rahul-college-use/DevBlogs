const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization.split(" ")[1]
        // console.log("Check auth " + authHeader)
        const verify = jwt.verify(authHeader,"SecertKey")
        // console.log(verify)
        if(!verify){
            return res.status(409).json({
                message:"Unauthorized user found"
            })
        }
        next()


    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal server error "
        })
    }
}