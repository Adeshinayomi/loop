const express = require("express");
const router = express.Router();

const {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
} = require("../Controller/Follow.controller");

const protect = require("../Middleware/auth.middleware");


router.post("/:userId/follow", protect, followUser);
router.delete("/:userId/follow", protect, unfollowUser);

router.get("/:userId/followers", getFollowers);
router.get("/:userId/following", getFollowing);

module.exports = router;