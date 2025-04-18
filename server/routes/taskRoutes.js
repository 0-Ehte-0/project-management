const express = require("express")
const router = express.Router()
const Task = require("../models/Task")
const Project = require("../models/Project")
const auth = require("../middleware/auth")

// Get all tasks for a project
router.get("/project/:projectId", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId)

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    // Check if user is authorized to view tasks for this project
    if (!project.team.includes(req.user.id) && project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" })
    }

    const tasks = await Task.find({ project: req.params.projectId }).populate("assignee", "name avatar")

    res.json(tasks)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

// Create new task
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, status, project, assignee } = req.body

    // Check if project exists and user is authorized
    const projectDoc = await Project.findById(project)

    if (!projectDoc) {
      return res.status(404).json({ message: "Project not found" })
    }

    if (!projectDoc.team.includes(req.user.id) && projectDoc.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" })
    }

    const newTask = new Task({
      title,
      description,
      status,
      project,
      assignee,
    })

    const task = await newTask.save()

    // Populate assignee info before sending response
    const populatedTask = await Task.findById(task._id).populate("assignee", "name avatar")

    res.status(201).json(populatedTask)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

// Update task
router.put("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)

    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    // Check if user is authorized to update this task
    const project = await Project.findById(task.project)

    if (!project.team.includes(req.user.id) && project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" })
    }

    const { title, description, status, assignee } = req.body

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, status, assignee },
      { new: true },
    ).populate("assignee", "name avatar")

    res.json(updatedTask)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete task
router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)

    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    // Check if user is authorized to delete this task
    const project = await Project.findById(task.project)

    if (!project.team.includes(req.user.id) && project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" })
    }

    await Task.findByIdAndDelete(req.params.id)

    res.json({ message: "Task deleted" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
