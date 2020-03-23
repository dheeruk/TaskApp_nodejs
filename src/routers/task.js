const express=require("express")
const router=new express.Router()
const Task=require("../models/task")
const auth=require("../middleware/auth")


router.get("/tasks",auth, async (req, res) => {
    const _id=req.user._id
    const match={}
    const sort={}
    if(req.query.completed){
        match.completed=req.query.completed==="true"
    }
    if(req.query.sortBy){
        const parts=req.query.sortBy.split(":")
        sort[parts[0]]=parts[1]==="desc"?-1:1
    }
    // const tasks=await Task.find({owner:_id})
    await req.user.populate({
        path:"task",
        match,
        options:{
            limit:parseInt(req.query.limit),
            skip:parseInt(req.query.skip),
            sort
        }
    }).execPopulate()
    res.send(req.user.task)
})


// get a task by id

router.get("/tasks/:id",auth, async (req, res) => {
    const _id = req.params.id
    try{
        const task=await Task.findOne({_id,owner:req.user._id})
        
        if(!task){
            return res.status(404).send()
        }
        res.send(task)

    }catch(e){
        res.status(500).send()
    }

})

router.post("/tasks",auth, (req, res) => {
    const task = new Task({
        ...req.body,
        owner:req.user._id
    })
    task.save().then((task) => {
        res.status(201).send(task)
    }).catch((error) => {
        res.status(400).send(error)

    })
})


router.delete("/tasks/:_id",auth,async (req,res)=>{
    
   try{
    const _id=req.params._id
    const task=await Task.findOne({_id,owner:req.user._id}) //findOneAndDelete
    if(!task){
        return res.status(404).send()
    }
    task.remove()
    res.send(task)
   }catch(e){
    res.send(e)
   }
})

module.exports=router