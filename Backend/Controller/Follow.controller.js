const Follow = require("../Models/Follow");
const User = require("../Models/User");

exports.followUser = async (req, res) => {
  try {
    const followerId = req.user.id;
    const followingId = req.params.userId;

    const user = await User.findById(followerId)
    if(!user){
        return res.status(404).json({
            message:"You do not have an active Account"
        })
    }

    if (followerId === followingId) {
      return res.status(400).json({
        message: "You cannot follow yourself.",
      });
    }

    const userToFollow = await User.findById(followingId);

    if (!userToFollow) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const existingFollow = await Follow.findOne({
      follower: followerId,
      following: followingId,
    });

    if (existingFollow) {
      return res.status(409).json({
        message: "You are already following this user.",
      });
    }

    await Follow.create({
      follower: followerId,
      following: followingId,
    });

    user.followingCount += 1
    userToFollow.followersCount += 1

    await user.save()
    await userToFollow.save()

    return res.status(201).json({
      message: "User followed successfully.",
    });
  } catch (error) {
    // MongoDB duplicate key error.
    if (error.code === 11000) {
      return res.status(409).json({
        message: "You are already following this user.",
      });
    }

    return res.status(500).json({
      message: "Failed to follow user.",
      error: error.message,
    });
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    const followerId = req.user.id;
    const followingId = req.params.userId;

    const user = await User.findById(followerId)
    if(!user){
        return res.status(404).json({
            message:"You do not have an active Account"
        })
    }

    const userToUnFollow = await User.findById(followingId);
    if (!userToUnFollow) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const follow = await Follow.findOneAndDelete({
      follower: followerId,
      following: followingId,
    });

    if (!follow) {
      return res.status(404).json({
        message: "You are not following this user.",
      });
    }

    user.followingCount += 1
    userToUnFollow.followersCount += 1

    await user.save()
    await userToUnFollow.save()

    return res.status(200).json({
      message: "User unfollowed successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to unfollow user.",
      error: error.message,
    });
  }
};

exports.getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;

    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 20, 50);
    const skip = (page - 1) * limit;

    const followers = await Follow.find({
      following: userId,
    })
      .populate("follower", "username profilePicture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      message: "Followers fetched successfully.",
      page,
      limit,
      followers,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch followers.",
      error: error.message,
    });
  }
};

exports.getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;

    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 20, 50);
    const skip = (page - 1) * limit;

    const following = await Follow.find({
      follower: userId,
    })
      .populate("following", "username profilePicture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      message: "Following fetched successfully.",
      page,
      limit,
      following,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch following.",
      error: error.message,
    });
  }
};