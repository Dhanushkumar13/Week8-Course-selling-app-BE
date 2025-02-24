const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const {userRouter} = require("./routes/user")
const {courseRouter} = require('./routes/course')
const {adminRouter} = require('./routes/admin');

const app = express();

app.use(express.json());
app.use(cors());
dotenv.config()

//routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/admin',adminRouter);
app.use('/api/v1/course',courseRouter);

async function main(){
    await mongoose.connect(process.env.MONGO_URL)
    app.listen(3000);
    console.log("PORT is running on 3000");
}

main();
