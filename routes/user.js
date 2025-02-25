const {Router} = require('express');
const {z} = require('zod');
const bcrypt = require('bcrypt');
const {adminModel, userModel, purchaseModel, courseModel} = require('../db');
const jwt = require('jsonwebtoken')
// const {JWT_SECRET} = require('../config')
const {userAuthMiddleware} = require('../auth/userAuth');

const userRouter = Router();


//validation using zod
userRouter.post('/login', async(req,res)=>{
    try {

        const requiredBody= z.object({
            email: z.string().min(3).max(100).regex( /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{3,100}$/, "Must include one special char one caps one small"),
            password: z.string().min(3).max(100),
            firstName: z.string().min(3).max(100),
            lastName: z.string().min(3).max(100).regex()
       })
   
       const parsedSafeData = requiredBody.safeParse(req.body);
   
       if(!parsedSafeData){
           res.json({
               message: "Incorrect Format",
               error: parsedSafeData.error
           })
       }
   
       const email = req.body.email;
       const password = req.body.password;
       const firstName = req.body.firstname;
       const lastName = req.body.lastname;
   
       //hashing password using bcrypt
       const hashedPassword = await bcrypt.hash(password,5);
       console.log(hashedPassword);

        await userModel.create({
            email: email,
            password: hashedPassword,
            firstName: firstName,
            lastName: lastName
        })
    
        res.json({
            message: "logged In"
        })
    } catch (error) {
        res.json({
            message: "Error occured" + error
        })
    }
})

userRouter.post('/signin',userAuthMiddleware, async(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;

    const user = await userModel.findOne({
        email: email,
    })

    if(!user){
        json.status(403).json({
            message: "User not found"
        })
    }

    const convertedPassword = await bcrypt.compare(password, user.password);
    console.log(password, user.password);

    if(convertedPassword){
        const token = jwt.sign({
            id: user._id.toString()
        },process.env.JWT_SECRET_ADMIN)
        res.json({
            token: token
        })
    }else{
        res.status(403).json({
            message:"Incorrect credentials"
        })
    }
    
})

userRouter.get('/purchases',userAuthMiddleware, async(req,res)=>{
    const userId = req.userId;
    const courseId = req.body.courseId;

    const purchases = await purchaseModel.find({
        userId,
    })

    const coursesData = await courseModel.find({
        _id: {$in: purchases.map(x => x.courseId)}
    })
    
    res.json({
        purchases,
        coursesData
    })
})

module.exports={
    userRouter: userRouter
}