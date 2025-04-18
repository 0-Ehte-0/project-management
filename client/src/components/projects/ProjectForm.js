"use client"

import { useState, useContext, useEffect } from "react"
import ProjectContext from "../../context/project/projectContext"

const ProjectForm = () => {
  const projectContext = useContext(ProjectContext)

  const { addProject, updateProject, clearCurrent, current } = projectContext

  useEffect(() => {
    if (current !== null) {
      setProject(current)
    } else {
      setProject({
        name: "",
        description: "",
        status: "Not Started",
      })
    }
  }, [projectContext, current])

  const [project, setProject] = useState({
    name: "",
    description: "",
    status: "Not Started",
  })

  const { name, description, status } = project

  const onChange = (e) => setProject({ ...project, [e.target.name]: e.target.value })

  const onSubmit = (e) => {
    e.preventDefault()
    if (current === null) {
      addProject(project)
    } else {
      updateProject(project)
    }
    clearAll()
  }

  const clearAll = () => {
    clearCurrent()
  }

  return (
    <form onSubmit={onSubmit}>
      <h2 className="text-primary">{current ? "Edit Project" : "Add Project"}</h2>
      <input type="text" placeholder="Name" name="name" value={name} onChange={onChange} required />
      <input type="text" placeholder="Description" name="description" value={description} onChange={onChange} />
      <h5>Status</h5>
      <select name="status" value={status} onChange={onChange}>
        <option value="Not Started">Not Started</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>
      <div>
        <input type="submit" value={current ? "Update Project" : "Add Project"} className="btn btn-primary btn-block" />
      </div>
      {current && (
        <div>
          <button className="btn btn-light btn-block" onClick={clearAll}>
            Clear
          </button>
        </div>
      )}
    </form>
  )
}

export default ProjectForm
