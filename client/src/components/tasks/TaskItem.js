"use client"

import { useContext } from "react"
import PropTypes from "prop-types"
import ProjectContext from "../../context/project/projectContext"

const TaskItem = ({ task }) => {
  const projectContext = useContext(ProjectContext)
  const { deleteTask, updateTask } = projectContext

  const { _id, title, description, status } = task

  const onDelete = () => {
    deleteTask(_id)
  }

  const onStatusChange = (e) => {
    updateTask({
      ...task,
      status: e.target.value,
    })
  }

  return (
    <div className="card bg-light">
      <h3 className="text-primary text-left">
        {title}{" "}
        <select
          value={status}
          onChange={onStatusChange}
          style={{ float: "right" }}
          className={
            "badge " +
            (status === "In Progress" ? "badge-success" : status === "Done" ? "badge-primary" : "badge-light")
          }
        >
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </h3>
      <p>{description}</p>
      <p>
        <button className="btn btn-danger btn-sm" onClick={onDelete}>
          Delete
        </button>
      </p>
    </div>
  )
}

TaskItem.propTypes = {
  task: PropTypes.object.isRequired,
}

export default TaskItem
