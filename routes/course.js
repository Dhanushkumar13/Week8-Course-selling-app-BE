const {Router} = require('express');
const courseRouter = Router();

courseRouter.post('/buy-course', async(req,res)=>{
    res.json({
        message: "signup endpoint"
    })
})

courseRouter.get('/preview', async(req,res)=>{
    res.json({
        message: "course preview endpoint"
    })
})

module.exports={
    courseRouter: courseRouter
}