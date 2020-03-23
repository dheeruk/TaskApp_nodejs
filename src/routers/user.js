const User = require("../models/user")
const express = require("express")
const auth = require("../middleware/auth")
const router = new express.Router()
const multer = require("multer")
const sharp = require("sharp")
const {sendWelcomeMail,userCancelationMail}=require("../emails/account")
// const bcrypt=require("bcryptjs")
router.post("/users", async (req, res) => {
    const userObj = new User(req.body)
    try {
        await userObj.save()
        sendWelcomeMail("dheerajk15cs19@gmail.com",userObj.name)
        const token = await userObj.generateAuthToken()
        res.status(200).send({ user: userObj, token })
    } catch (error) {
        res.status(500).send(error)
    }
})







router.get("/users", async (req, res) => {
    try {
        const users = await User.find({})
        res.status(200).send(users)
    } catch (error) {
        res.status(500).send(error)
    }
})


//getting login user profile

router.get("/user/me", auth, async (req, res) => {
    res.send(req.user)
})



router.post("/users/login", async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)

        if (!user) {
            return res.status(400).send()
        }
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send()
    }


})


router.post("/users/logout", auth, async (req, res) => {
    req.user.tokens = req.user.tokens.filter((token) => {
        return req.token != token.token
    })
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})


router.post("/users/logoutAll", auth, async (req, res) => {
    req.user.tokens = []
    await req.user.save()
    res.send()
})



router.get("/users/:id", async (req, res) => {   // using async function 
    const _id = req.params.id
    try {
        const user = await User.findById(_id)
        if (!user) {
            return res.status(404).send({ "message": "no user exists" })
        }
        res.status(200).send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})


router.patch("/users/me", auth, async (req, res) => {
    const allowedUpdate = ["name", "age", "password", "email"]
    const updates = Object.keys(req.body)
    const isValid = updates.every((update) => allowedUpdate.includes(update))
    if (isValid) {
        try {
            // const user=await User.findById(req.params.id)
            // if (!user) {

            //     return res.status(404).send("user does not exists")
            // }


            updates.forEach((update) => {
                req.user[update] = req.body[update]
            })
            // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
            await req.user.save()
            res.status(200).send(req.user)
        } catch (error) {
            res.status(500).send(error)
        }

    } else {
        return res.send("does not exists")
    }


}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})





router.delete("/users/me", auth, async (req, res) => {

    try {
        // const user = await User.findByIdAndDelete(req.params.id)
        // if (user) {
        //     return res.send(user)
        // } else {
        //     res.status(404).send("user not found")
        // }

        await req.user.remove()
        userCancelationMail("dheerajk15cs19@gmail.com",req.user.name)

        res.send(req.user)

    } catch (e) {
        res.send(e)
    }

}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

const upload = multer({
    // dest:"avatars",
    limits: {
        fileSize: 5000000
    },
    fileFilter(req, file, cb) {
        // if(!file.originalname.endsWith("pdf")){
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error("please upload only image file"))
        }
        cb(undefined, true)
    }
})



router.post("/users/me/avatar", auth, upload.single("avatar"), async (req, res) => {
    const buffer=await sharp(req.file.buffer).resize(250,250).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})


router.delete("/users/me/avatar", auth, async (req, res) => {
    console.log(req.user.name)
    req.user.avatar = undefined
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})



router.get("/users/:id/avatar",async (req, res) => {
   try{
    const user=await User.findById(req.params.id)
    if(!user){
        res.status(404).send()
    }
   res.set("content-type","image/jpg")
  res.send(user.avatar)
   }catch(error){

   }
})




module.exports = router