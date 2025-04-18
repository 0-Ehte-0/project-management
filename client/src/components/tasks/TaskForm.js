"use client"

import { useState, useContext, useEffect } from "react"
import ProjectContext from "../../context/project/projectContext"

const TaskForm = () => {
  const projectContext = useContext(ProjectContext)

  const { addTask, updateTask, current, clearCurrent } = projectContext

  const [task, setTask] = useState({
    title: "",
    description: "",
    status: "To Do",
    project: current ? current._id : "",
  })

  useEffect(() => {
    if (current) {
      setTask({
        ...task,
        project: current._id,
      })
    }
    // eslint-disable-next-line
  }, [current])

  const { title, description, status } = task

  const onChange = (e) => setTask({ ...task, [e.target.name]: e.target.value })

  const onSubmit = (e) => {
    e.preventDefault()
    if (title === "") return

    addTask({
      ...task,
      project: current._id,
    })

    setTask({
      title: "",
      description: "",
      status: "To Do",
      project: current._id,
    })
  }

  return (
    <form onSubmit={onSubmit}>
      <h2 className="text-primary">Add Task</h2>
      <input type="text" placeholder="Title" name="title" value={title} onChange={onChange} required />
      <input type="text" placeholder="Description" name="description" value={description} onChange={onChange} />
      <h5>Status</h5>
      <select name="status" value={status} onChange={onChange}>
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>
      <div>
        <input type="submit" value="Add Task" className="btn btn-primary btn-block" />
      </div>
    </form>
  )
}

export default TaskForm
