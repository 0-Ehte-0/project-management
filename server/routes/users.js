const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const User = require("../models/User")

// @route   POST api/users
// @desc    Register a user
// @access  Public
router.post("/", async (req, res) => {
  const { name, email, password } = req.body

  try {
    // Check if user already exists
    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ msg: "User already exists" })
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
    })

    await user.save()

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

module.exports = router
