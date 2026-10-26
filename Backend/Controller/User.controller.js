const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const {uploadProfilePicture,deleteProfilePicture} = require('../Services/Cloudinary.service')

exports.createUser = async (req, res) => {
    try {
        const { firstName, lastName, username, email, bio, profilePicture, location, password } = req.body;

        if (!firstName || !lastName || !username || !email || !password) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const existingemail = await User.findOne({ email });
        if (existingemail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username already exists" });
        }

        if(password.length < 6){
            return res.status(400).json({message:"Password must be longer than 6 characters!"})
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ 
            firstName,
            lastName,
            username,
            email,
            bio,
            profilePicture,
            location,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json(newUser);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.userLogin = async (req,res)=>{
    try{
        const {email, password} = req.body

        if(!email || !password){
            return res.status(400).json({
                message:"All fields a required"
            })
        }

        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({
                message:"Invalid credentials"
            })
        }

        const isPasswordAMatch=await bcrypt.compare(password,user.password)
        if(!isPasswordAMatch){
            return res.status(400).json({
                message:"Invalid credentials"
            })
        }

        const token=jwt.sign({
            id:user._id, 
            email:user.email,
        }, 
        process.env.JWT_SECRET, 
        {
            expiresIn: process.env.JWT_EXPIRES_IN

        })

        res.status(200).json({
            message:'Login successful',
            user,
            token
        })
    }catch(error){

    }
}

exports.updateProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please select a profile picture.",
      });
    }


    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const uploadedImage = await uploadProfilePicture(
      req.file.buffer
    );

    const oldPublicId = user.profilePicture;

    user.profilePicture = uploadedImage.url
    
    await user.save();

    if (oldPublicId) {
      try {
        await deleteProfilePicture(oldPublicId);
      } catch (error) {
        console.error(
          "Failed to delete previous profile picture:",
          error
        );
      }
    }

    return res.status(200).json({
      message: "Profile picture updated successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    if (uploadedImage?.publicId) {
      try {
        await deleteProfilePicture(uploadedImage.publicId);
      } catch (cleanupError) {
        console.error(
          "Failed to clean up uploaded image:",
          cleanupError
        );
      }
    }

    console.error("Profile picture update failed:", error);

    return res.status(500).json({
      message: "Failed to update profile picture.",
    });
  }
};