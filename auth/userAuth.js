const jwt = require('jsonwebtoken');
// const {JWT_SECRET} = require('../config');

function userAuthMiddleware(req,res,next){
    try {
        const token = req.headers.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN);

    if(decoded){
        req.userId = decoded.id;
        next();
    }else{
        res.status(403).json({
            message: "You are not logged in"
        })
    }
    } catch (error) {
        res.json({
            message: "Error: " + error
        })
    }
}
module.exports = {
    userAuthMiddleware: userAuthMiddleware
}