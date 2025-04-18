const express = require("express")
const router = express.Router()
const auth = require("../middleware/auth")
const Task = require("../models/Task")
const Project = require("../models/Project")

// @route   GET api/tasks/project/:projectId
// @desc    Get all tasks for a project
// @access  Private
router.get("/project/:projectId", auth, async (req, res) => {
  try {
    // Check if project exists and user owns it
    const project = await Project.findById(req.params.projectId)

    if (!project) return res.status(404).json({ msg: "Project not found" })

    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" })
    }

    const tasks = await Task.find({ project: req.params.projectId }).sort({ date: -1 })
    res.json(tasks)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   POST api/tasks
// @desc    Add new task
// @access  Private
router.post("/", auth, async (req, res) => {
  const { title, description, status, project } = req.body

  try {
    // Check if project exists and user owns it
    const projectDoc = await Project.findById(project)

    if (!projectDoc) return res.status(404).json({ msg: "Project not found" })

    if (projectDoc.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" })
    }

    const newTask = new Task({
      title,
      description,
      status,
      project,
      user: req.user.id,
    })

    const task = await newTask.save()
    res.json(task)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   PUT api/tasks/:id
// @desc    Update task
// @access  Private
router.put("/:id", auth, async (req, res) => {
  const { title, description, status } = req.body

  // Build task object
  const taskFields = {}
  if (title) taskFields.title = title
  if (description) taskFields.description = description
  if (status) taskFields.status = status

  try {
    let task = await Task.findById(req.params.id)

    if (!task) return res.status(404).json({ msg: "Task not found" })

    // Make sure user owns task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" })
    }

    task = await Task.findByIdAndUpdate(req.params.id, { $set: taskFields }, { new: true })

    res.json(task)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// @route   DELETE api/tasks/:id
// @desc    Delete task
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)

    if (!task) return res.status(404).json({ msg: "Task not found" })

    // Make sure user owns task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" })
    }

    await Task.findByIdAndRemove(req.params.id)

    res.json({ msg: "Task removed" })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

module.exports = router
