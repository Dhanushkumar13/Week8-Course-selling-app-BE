const {Router} = require('express');

const userRouter = Router();

userRouter.post('/login', async(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name
})

userRouter.post('/signup', async(req,res)=>{
    res.json({
        message: "signup endpoint"
    })
})

userRouter.get('/purhases', async(req,res)=>{
    res.json({
        message: "signup endpoint"
    })
})


module.exports={
    userRouter: userRouter
}