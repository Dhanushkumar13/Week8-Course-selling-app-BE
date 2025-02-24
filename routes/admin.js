const {Router} = require('express');
const adminRouter = Router();

adminRouter.post('/login', async(req,res)=>{
    res.json({
        message: "signup endpoint"
    })
})

adminRouter.post('/signin', async(req,res)=>{
    res.json({
        message: "course preview endpoint"
    })
})

adminRouter.post('/create', async(req,res)=>{
    res.json({
        message: "course preview endpoint"
    })
})

adminRouter.put('/edit', async(req,res)=>{
    res.json({
        message: "course preview endpoint"
    })
})


adminRouter.get('/bulk', async(req,res)=>{
    res.json({
        message: "course preview endpoint"
    })
})


module.exports={
    adminRouter: adminRouter
}