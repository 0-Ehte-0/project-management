const express = require("express")
const router = express.Router()
const auth = require("../middleware/auth")
const Project = require("../models/Project")
const Task = require("../models/Task")

// @route   GET api/projects
// @desc    Get all user's projects
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id }).sort({ date: -1 })
    res.json(projects)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   POST api/projects
// @desc    Add new project
// @access  Private
router.post("/", auth, async (req, res) => {
  const { name, description, status } = req.body

  try {
    const newProject = new Project({
      name,
      description,
      status,
      user: req.user.id,
    })

    const project = await newProject.save()
    res.json(project)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   PUT api/projects/:id
// @desc    Update project
// @access  Private
router.put("/:id", auth, async (req, res) => {
  const { name, description, status } = req.body

  // Build project object
  const projectFields = {}
  if (name) projectFields.name = name
  if (description) projectFields.description = description
  if (status) projectFields.status = status

  try {
    let project = await Project.findById(req.params.id)

    if (!project) return res.status(404).json({ msg: "Project not found" })

    // Make sure user owns project
    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" })
    }

    project = await Project.findByIdAndUpdate(req.params.id, { $set: projectFields }, { new: true })

    res.json(project)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   DELETE api/projects/:id
// @desc    Delete project
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)

    if (!project) return res.status(404).json({ msg: "Project not found" })

    // Make sure user owns project
    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" })
    }

    // Delete all tasks associated with this project
    await Task.deleteMany({ project: req.params.id })

    // Delete the project
    await Project.findByIdAndRemove(req.params.id)

    res.json({ msg: "Project removed" })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

module.exports = router
