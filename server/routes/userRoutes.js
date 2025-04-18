const express = require("express")
const router = express.Router()
const User = require("../models/User")
const auth = require("../middleware/auth")

// Get user profile
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

// Get all users (for team selection)
router.get("/", auth, async (req, res) => {
  try {
    const users = await User.find().select("name email avatar role")
    res.json(users)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

// Update user profile
router.put("/me", auth, async (req, res) => {
  try {
    const { name, avatar } = req.body

    const updatedUser = await User.findByIdAndUpdate(req.user.id, { name, avatar }, { new: true }).select("-password")

    res.json(updatedUser)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
