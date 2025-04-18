const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const User = require("../models/User")

// Register user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Check if user already exists
    let user = await User.findOne({ email })

    if (user) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
    })

    await user.save()

    // Generate JWT token
    const payload = {
      user: {
        id: user.id,
      },
    }

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" }, (err, token) => {
      if (err) throw err
      res.json({ token })
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Check if user exists
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Check password
    const isMatch = await user.comparePassword(password)

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Generate JWT token
    const payload = {
      user: {
        id: user.id,
      },
    }

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" }, (err, token) => {
      if (err) throw err
      res.json({ token })
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
