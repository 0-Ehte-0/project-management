const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const auth = require("../middleware/auth")
const User = require("../models/User")

// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  Public
router.post("/", async (req, res) => {
  const { email, password } = req.body

  try {
    // Check if user exists
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" })
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" })
    }

    // Return JWT
    const payload = {
      user: {
        id: user.id,
      },
    }

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" }, (err, token) => {
      if (err) throw err
      res.json({ token })
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   GET api/auth
// @desc    Get logged in user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    res.json(user)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

module.exports = router
