const express = require("express")
const router = express.Router()
const Project = require("../models/Project")
const Task = require("../models/Task")
const auth = require("../middleware/auth")

// Get all projects
router.get("/", auth, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ createdBy: req.user.id }, { team: req.user.id }],
    }).populate("team", "name avatar")

    res.json(projects)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

// Get project by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("team", "name avatar role")

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    // Check if user is authorized to view this project
    if (
      !project.team.some((member) => member._id.toString() === req.user.id) &&
      project.createdBy.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Not authorized" })
    }

    // Get tasks for this project
    const tasks = await Task.find({ project: req.params.id }).populate("assignee", "name avatar")

    res.json({ project, tasks })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

// Create new project
router.post("/", auth, async (req, res) => {
  try {
    const { name, description, status, dueDate, team } = req.body

    const newProject = new Project({
      name,
      description,
      status,
      dueDate,
      team: team || [],
      createdBy: req.user.id,
    })

    // Add creator to team if not already included
    if (!newProject.team.includes(req.user.id)) {
      newProject.team.push(req.user.id)
    }

    const project = await newProject.save()
    res.status(201).json(project)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

// Update project
router.put("/:id", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    // Check if user is authorized to update this project
    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" })
    }

    const { name, description, status, dueDate, team } = req.body

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { name, description, status, dueDate, team },
      { new: true },
    ).populate("team", "name avatar")

    res.json(updatedProject)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete project
router.delete("/:id", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    // Check if user is authorized to delete this project
    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" })
    }

    // Delete all tasks associated with this project
    await Task.deleteMany({ project: req.params.id })

    // Delete the project
    await Project.findByIdAndDelete(req.params.id)

    res.json({ message: "Project deleted" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
