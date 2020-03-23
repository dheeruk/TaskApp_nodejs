const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require("bcryptjs")
const jwt=require("jsonwebtoken")
const Task=require("./task")
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique:true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email inavlid")
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error("Age must be possitive number")
            }
        }

    },
    password: {
        type: String,
        required: true,
        trim: true,
        //minLength:7
        validate(value) {
            if (value.length <= 6) {
                throw new Error("Password length must be greter than 6")
            } else if (value.includes("password")) {
                throw new Error("Password can not be password")
            }
        }

    },
    tokens:[{
        token:{
            type:String,
            required:true
        }

    }],
    avatar:{
        type:Buffer,
    }
},{
    timestamps:true
})


userSchema.pre("remove",async function(req,res,next){
    const user=this
    await Task.deleteMany({owner:user._id})
    next()

})


userSchema.virtual("task",{
    ref:"Task",
    localField:"_id",
    foreignField:"owner"
})




userSchema.methods.toJSON=function(){
    const user=this
    // console.log(typeof(user))
    const userObj=user.toObject() 
    delete userObj.password
    delete userObj.tokens  
    // console.log(typeof(userObj))
    return userObj

}


userSchema.methods.generateAuthToken = async function(){
    const user=this
    const token=jwt.sign({_id: user._id.toString()},"thisisthetest")
    user.tokens=user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.pre("save", async function (next) {
    const user = this
    if (user.isModified("password")) { // it will return true when user created and password updated
        const password = user.password
        const hashPassword = await bcrypt.hash(password, 8)
        user.password = hashPassword
    }
    next()
})

userSchema.statics.findByCredentials = async (email,password)=>{
    const user=await User.findOne({email:email})
    if(!user){
        throw new Error("Unable to login")
    }
    const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error("Unable to login")
    }
    return user
}



const User = mongoose.model('User', userSchema)
module.exports = User