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

        const post = await Post.findById(req.params.id)
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
