const Comment = require('../Models/comment')
const Post  = require('../Models/Post')
exports.createComment = async (req,res)=>{
    try{
        const {content} = req.body

        if(!content){
            return res.status(400).json({
                message:"Type a message"
            })
        }

        const post = await Post.findById(req.params.postId)
        if(!post){
            return res.status(404).json({
                message:"Post not found!"
            })
        }

        const comment = await Comment.create({
            post,
            author:req.user.id,
            content,
        })

        post.commentsCount += 1
        
        await post.save()

        res.status(201).json({
            message:"Comment added successfully",
            comment
        })
    }catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}
exports.updateComment = async (req,res)=>{
    try{
        const {content} = req.body

        if(!content){
            return res.status(400).json({
                message:"Type a message"
            })
        }

        const comment = await Comment.find(req.params.commentId)
        if(!comment){
            return res.status(404).json({
                message:"Comment not found!"
            })
        }

        const updatedComment = await Comment.findByIdAndUpdate(req.params.commentId,{
            content
        })


        res.status(201).json({
            message:"Comment updated successfully",
            updatedComment
        })
    }catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}

exports.getCommentOnPost = async (req,res) =>{
    try{
        const post = await Post.findById(req.params.postId)
        if(!post){
            return res.status(404).json({
                message:"Post not found!"
            })
        }

        const comments = await Comment.find({post}).sort({createdAt:-1})

        res.status(200).json({
            message:"comments retrieve successfully",
            comments
        })
        
    }catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}

exports.deleteComment =  async (req,res)=>{
    try{
        const comment = await Comment.findById(req.params.commentId)

        if(!comment){
            return res.status(404).json({
                message:"Comment not found"
            })
        }

        await Comment.findByIdAndDelete(req.params.commentId)

        res.status(200).json({
            message:"comment deleted successfully",
        })
    }catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}