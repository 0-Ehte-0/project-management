"use client"

import { useState, useContext } from "react"
import { useNavigate, Link } from "react-router-dom"
import { ProjectContext } from "../context/ProjectContext"

const NewProject = () => {
  const { createProject } = useContext(ProjectContext)
  const navigate = useNavigate()

  const [project, setProject] = useState({
    name: "",
    description: "",
    status: "Planning",
    dueDate: "",
  })

  const { name, description, status, dueDate } = project

  const onChange = (e) => {
    setProject({ ...project, [e.target.name]: e.target.value })
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    try {
      await createProject(project)
      navigate("/")
    } catch (err) {
      console.error("Error creating project:", err)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Link to="/" className="text-gray-600 hover:text-gray-900">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Create New Project</h1>
          <p className="text-gray-600">Add a new project to your workspace</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-2xl mx-auto">
        <form onSubmit={onSubmit}>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Project Details</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={onChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter project name"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={onChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your project"
                  rows="3"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={status}
                    onChange={onChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Planning">Planning</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={dueDate}
                    onChange={onChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Team Members</label>
                <div className="border border-gray-300 rounded-md p-4">
                  <p className="text-sm text-gray-500 mb-2">
                    You'll be able to add team members after creating the project
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t px-6 py-4 flex justify-between">
            <Link to="/" className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50">
              Cancel
            </Link>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NewProject
