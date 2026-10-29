const Like = require('../Models/Like')
const Post = require('../Models/Post')

exports.likePost = async (req,res)=>{
    try{
      const post = await Post.findById(req.params.postId)
      if(!post){
        return res.status(404).json({
            message:"Post not found"
        })
      }  
      const newLike = await Like.create({
        post,
        user:req.user.id
      })

      post.likesCount += 1
      await post.save()

      res.status(200).json({
        message:'Like added sucessfully',
        newLike
      })
    }catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}

exports.unLikePost = async (req,res)=>{
    try{
        const post = await Post.findById(req.params.postId)
        if(!post){
            return res.status(404).json({
                message:"Post not found!"
            })
        }

        await Like.deleteOne({user:req.user.id})

        post.likesCount -= 1

        await post.save()

        res.status(200).json({
            message:'Like removed succesfully'
        })

    }catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}