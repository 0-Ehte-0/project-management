"use client"

import { useContext } from "react"
import PropTypes from "prop-types"
import ProjectContext from "../../context/project/projectContext"

const ProjectItem = ({ project }) => {
  const projectContext = useContext(ProjectContext)
  const { deleteProject, setCurrent, clearCurrent, getTasks } = projectContext

  const { _id, name, description, status } = project

  const onDelete = () => {
    deleteProject(_id)
    clearCurrent()
  }

  const onSelect = () => {
    setCurrent(project)
    getTasks(_id)
  }

  return (
    <div className="card bg-light">
      <h3 className="text-primary text-left">
        {name}{" "}
        <span
          style={{ float: "right" }}
          className={
            "badge " +
            (status === "In Progress" ? "badge-success" : status === "Completed" ? "badge-primary" : "badge-light")
          }
        >
          {status}
        </span>
      </h3>
      <p>{description}</p>
      <p>
        <button className="btn btn-dark btn-sm" onClick={onSelect}>
          Select
        </button>
        <button className="btn btn-primary btn-sm" onClick={() => setCurrent(project)}>
          Edit
        </button>
        <button className="btn btn-danger btn-sm" onClick={onDelete}>
          Delete
        </button>
      </p>
    </div>
  )
}

ProjectItem.propTypes = {
  project: PropTypes.object.isRequired,
}

export default ProjectItem
