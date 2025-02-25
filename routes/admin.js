const {Router} = require('express');
const adminRouter = Router();
const {adminModel, courseModel} = require("../db");
const jwt = require('jsonwebtoken');
const {z} = require('zod');
const bcrypt = require('bcrypt');
const {JWT_SECRET_ADMIN} = require('../config');
const { adminAuthMiddleware } = require('../auth/adminAuth');

adminRouter.post('/login', async(req,res)=>{
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

        await adminModel.create({
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

adminRouter.post('/signin', async(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;

    const user = await adminModel.findOne({
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
        },JWT_SECRET_ADMIN)
        res.json({
            token: token
        })
    }else{
        res.status(403).json({
            message:"Incorrect credentials"
        })
    }
})

adminRouter.post('/create', adminAuthMiddleware, async(req,res)=>{
    const adminId = req.userId;

    const{title,description,price,imageURL} = req.body

    const course = await courseModel.create({
        title, description, price, imageURL, creatorId: adminId
    })
    res.json({
        message: "course created",
        courseId: course._id
    })
})

adminRouter.put('/edit',adminAuthMiddleware, async(req,res)=>{
    const adminId = req.userId;

    const{title,description,price,imageURL,courseId} = req.body

    const courseEdit = await courseModel.updateOne({
       _id: courseId,
       creatorId: adminId
    },{
        title,
        description,
        imageURL,
        price
    })

    res.json({
        message: "course details has been modified",
        courseId: courseEdit._id
    },{
        title,description,price,imageURL
    })
})


adminRouter.get('/bulk',adminAuthMiddleware, async(req,res)=>{

    const adminId = req.userId

    const{title,description,price,imageURL,courseId} = req.body

    const courses = await courseModel.find({
        
        creatorId: adminId
    })

    res.json({
        message: "course updated",
        courses
    })
})


module.exports={
    adminRouter: adminRouter
}