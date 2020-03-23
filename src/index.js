const express = require("express")
require("./db/mongoose")
// const User = require("./models/user")
// const auth=require("./middleware/auth")
const app = express()
const userRouter = require("./routers/user")
const taskRouter = require("./routers/task")
app.use(express.json())

//middleware
// app.use((req, res, next) => {
//     if (req.method === "GET") {
//         res.send("GET request not allowed")
//     } else {
//         next()
//     }
// })


//maintenece middle ware

// app.use((req,res)=>{
//     res.status(503).send("Sorry Website now maintenence mode")
// })




// const multer=require("multer")
// const upload=multer({
//     dest:"images"
// })

// app.post("/upload",upload.single("upload"),(req,res)=>{
//     res.send()
// })







app.use(userRouter)
app.use(taskRouter)








// const Task=require("./models/task")
// // const User=require("./models/user")
// const main=async ()=>{
//     const user=await User.findById("5e731aa1d16b4f7fcf30f9b3")
//     await user.populate("task").execPopulate()
//     console.log(user.task)
// }

// main()








//generating json web token

// const jwt = require("jsonwebtoken")
// const jsonWebToken = async () => {
//     const token = jwt.sign({ _id: "dheeraj123" }, "thisisthetest")
//     console.log(token)
//     const verify = await jwt.verify(token, "thisisthetest")
//     console.log(verify)
// }
// jsonWebToken()








// const bcrypt=require("bcryptjs")
// async function hashPassword(password){
//    const hashedPassword=await bcrypt.hash(password,8)
//    console.log(hashedPassword)
//    const isMatch=await bcrypt.compare(password,hashedPassword)
//    console.log(isMatch)
// }

// hashPassword("dheeraj123")


//create new user
// app.post("/users", (req, res) => {
//     const user = new User(req.body)
//     user.save().then((user) => {
//         res.status(201).send(user)
//     }).catch((error) => {
//         res.status(400).send(error)
//     })
// })



// app.get("/users", (req, res) => {

//     User.find({}).then((user) => {
//         res.send(user)
//     }).catch((error) => {
//         res.status(500).send(error)
//     })
// })


// reading user by id



// app.get("/users/:id", (req, res) => {   // without async
//     const _id = req.params.id
//     User.findById(_id).then((user) => {
//         if (!user) {
//             return res.status(404).send("user not found")
//         }
//         res.send(user)
//     }).catch((error) => {
//         res.status(500).send(error)
//     })

// })



//create new task


// get all tasks







const port=process.env.PORT

app.listen(port, () => {
    console.log("Server started ....." + port)
})