const Post = require('../Models/Post')
const {uploadPostPicture} = require('../Services/Cloudinary.service');


exports.createPost = async (req, res) => {
  try {
    const { content } = req.body;

    const files = req.files || [];

    if (!content?.trim() && (!req.files || req.files.length === 0)) {
      return res.status(400).json({
        message: "A post must contain text or an image.",
      });
    }

    const images = [];

    for (const file of files) {
      const image= await uploadPostPicture(file.buffer)

      images.push(image);
    }

    const post = await Post.create({
      author: req.user.id,
      content,
      images,
    });

    return res.status(201).json({
      message: "Post created successfully.",
      post,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create post.",
      error: error.message,
    });
  }
};

exports.getAllPost = async (req,res)=>{
    try{
        const posts = await Post.find().sort({createdAt:-1})
        
        res.status(200).json({
            posts
        })
    }catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}