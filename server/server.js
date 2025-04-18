const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const userRoutes = require("./routes/users")
const projectRoutes = require("./routes/projects")
const taskRoutes = require("./routes/tasks")
const authRoutes = require("./routes/auth")
const path = require("path") // Added path module

// Load environment variables
require("dotenv").config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/projects", projectRoutes)
app.use("/api/tasks", taskRoutes)

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("../client/build"))

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"))
  })
}

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
