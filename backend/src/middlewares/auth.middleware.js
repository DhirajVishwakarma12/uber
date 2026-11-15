const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const blacklistModel = require("../models/blacklisting.model")


module.exports.authUser = async function(req,res,next) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(400).json({
            message:"unauthorized user"
        })
    }
    const blacklisted = await blacklistModel.findOne({token});

    if(blacklisted){
        return res.status(400).json({
            message:"unauthorized user"
        })
    }

    try {
        const decoded = jwt.verify(token,process.env.JWT_SCRECT)
        const user = await userModel.findById(decoded.id)

        req.user = user

        return next();
        
    } catch (error) {
        console.log("middleware error")
        return res.status.json({
            error:"Unauthorized user error"
        })
    }
}

