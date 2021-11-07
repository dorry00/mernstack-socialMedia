const router = require("express").Router()
const Post = require("../Models/Post")
const User = require("../Models/User")

//create a single post

router.post("/", async (req,res) =>{

    const newPost = new Post(req.body)
    try{
        const savedPost = await newPost.save()
         res.status(200).json(savedPost)        

    }
    catch(err){
        return res.status(500).json(err)
    }



});

//get one post
router.get("/:id" , async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id)
        if(!post){
            res.status(404).json("No such post")

        }
        return res.status(200).json(post)

    } catch(err){

        return res.status(500).json(err)
    }

    

})

//like and dislike a post post

router.put("/:id/like" , async (req,res)=>{
   
    try{
        const post = await Post.findById(req.params.id)
        if(!post.likes.includes(req.body.userId)){
      
          await post.updateOne({$push :{likes:req.body.userId}})
           res.status(200).json("You liked this post")

    }

    else{
        await post.updateOne({$pull :{likes : req.body.userId}})
        res.status(200).json("you disliked this post")

    }
}
    catch(err){
        return res.status(500).json(err)
    }





})


//update a post
router.put("/:id" , async (req,res)=>{
   
        try{
            const post = await Post.findById(req.params.id)
            if(req.body.userId=== post.userId){
        
              await post.updateOne({$set:req.body}, {new:true})
            res.status(200).json("post successfully updated")

        }
        else{
            res.status(401).json("you can only update your post")

        }
    }
        catch(err){
            return res.status(500).json(err)
        }

    

    

})


//delete one post

router.put("/:id" , async (req,res)=>{
   
    try{
        const post = await Post.findById(req.params.id)
        if(req.body.userId=== post.userId){
      
          await post.deleteOne()
           res.status(200).json("post deleted successfully")

    }
    else{
        res.status(401).json("you can only delete your post")

    }
}
    catch(err){
        return res.status(500).json(err)
    }





})

//get all the posts feom the  users friends

router.get("/timeline/all", async(req,res)=>{
   
    try{
const currentUser = await User.findById(req.body.userId)
const userPosts = await Post.find({userId: currentUser._id})
const friendPosts = await Promise.all(
    currentUser.followings.map (friendId=>{
        Post.find({userId:friendId})
    })
)

return res.status(200).json(userPosts.concat(...friendPosts))

        
    }
    catch(err){
    return res.status(500).json(err)
    }
})


module.exports = router