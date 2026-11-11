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
        res.status(500).json({
            message: error.message
        })
    }
}

exports.updateProfilePicture = async (req, res) => {
  let uploadedImage;
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please select a profile picture." });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    uploadedImage = await uploadProfilePicture(req.file.buffer);
    const oldPublicId = user.profilePicturePublicId;

    user.profilePicture = uploadedImage.url;
    user.profilePicturePublicId = uploadedImage.publicId;
    await user.save();

    // Delete the previous Cloudinary asset only after the new image is saved.
    if (oldPublicId) {
      try {
        await deleteProfilePicture(oldPublicId);
      } catch (deleteError) {
        console.error("Failed to delete previous profile picture:", deleteError);
      }
    }

    return res.status(200).json({
      message: "Profile picture updated successfully.",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        profilePicturePublicId: user.profilePicturePublicId,
      },
    });
  } catch (error) {
    if (uploadedImage?.publicId) {
      try {
        await deleteProfilePicture(uploadedImage.publicId);
      } catch (cleanupError) {
        console.error("Failed to clean up uploaded image:", cleanupError);
      }
    }
    console.error("Profile picture update failed:", error);
    return res.status(500).json({ message: "Failed to update profile picture." });
  }
};

exports.updateUser = async (req,res)=>{
    try{
        const {firstName,lastName,bio,location} = req.body

        if(!firstName || !lastName || !bio || !location){
            return res.status(400).json({
                message:"All fields are required"
            })
        }

        const user = await User.findById(req.user.id)
        if(!user){
            return res.status(404).json({
                message:"User not found"
            })
        }

        user.firstName = firstName
        user.lastName = lastName
        user.bio = bio
        user.location = location

        await user.save()

        res.status(201).json({
            message:"User profile succesfully update",
            user
        })
    }catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}

exports.changePassword = async (req,res)=>{
    try{
        const {currentPassword,newPassword} = req.body
        
        if(!newPassword || !currentPassword){
            return res.status(400).json({
                message:"All fields are required"
            })
        }

        if(newPassword.length < 6){
            return res.status(400).json({
                message:"Password must be greater 6 characters"
            })
        }

        const user = await User.findById(req.user.id)
        
        if(!user){
            return res.status(404).json({
                message:"User not found!"
            })
        }


        const isPasswordAMatch = await bcrypt.compare(currentPassword,user.password)
        if(!isPasswordAMatch){
            return res.status(400).json({
                message:"Incorrect Password"
            })
        }

        const arePasswordsTheSame = await bcrypt.compare(newPassword,user.password)
        if(arePasswordsTheSame){
            return res.status(400).json({
                message:"New password can not be same as previous password"
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword,10)

        user.password = hashedPassword

        await user.save()

        res.status(200).json({
            message:"password updated successfully"
        })
    }catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}
exports.searchUsers = async (req, res) => {
  try {
    const query = (req.query.q || "").trim();
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 30);
    const skip = (page - 1) * limit;

    const filter = { _id: { $ne: req.user.id } };
    if (query) {
      const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const matcher = new RegExp(escaped, "i");
      filter.$or = [
        { firstName: matcher },
        { lastName: matcher },
        { username: matcher },
      ];
    }

    const [users, following] = await Promise.all([
      User.find(filter)
        .select("firstName lastName username bio profilePicture location followersCount followingCount")
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      require("../Models/Follow").find({ follower: req.user.id }).select("following").lean(),
    ]);

    const followingIds = new Set(following.map((item) => String(item.following)));
    const results = users.map((user) => ({
      ...user,
      isFollowing: followingIds.has(String(user._id)),
    }));

    return res.status(200).json({ users: results, page, limit });
  } catch (error) {
    return res.status(500).json({ message: "Could not search users.", error: error.message });
  }
};
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select("firstName lastName username bio profilePicture location followersCount followingCount")
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isFollowing = req.user.id === String(user._id)
      ? false
      : Boolean(await require("../Models/Follow").exists({ follower: req.user.id, following: user._id }));

    return res.status(200).json({ user: { ...user, isFollowing } });
  } catch (error) {
    return res.status(500).json({ message: "Could not fetch user profile.", error: error.message });
  }
};
