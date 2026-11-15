const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const blacklistModel = require("../models/blacklisting.model")
const captainModel = require("../models/captain.model")


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



module.exports.Authcaptain = async (req,res,next) => {
    
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    
    if(!token){
        return res.status(400).json({
            message:"unauthorized Captain"
        })
    }
    const isblacklisted = await blacklistModel.findOne({token})

    if(isblacklisted){
        return res.status(400).json({
            message:"unauthorized user"
        })
    }

    try {
        const decoded = jwt.verify(token,process.env.JWT_SCRECT)
        const captain = await captainModel.findById(decoded.id)

        req.cap = captain;

        return next()


    } catch (error) {
        console.log("unauthorized captain")
        return res.status(200).json({
            error:"Unauthorized user error"
        })
    }
}

