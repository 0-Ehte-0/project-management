"use client"

import { useContext, useEffect } from "react"
import { Link } from "react-router-dom"
import { ProjectContext } from "../context/ProjectContext"
import ProjectCard from "../components/projects/ProjectCard"

const Dashboard = () => {
  const { projects, loading, getProjects } = useContext(ProjectContext)

  useEffect(() => {
    getProjects()
    // eslint-disable-next-line
  }, [])

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-gray-600">Create and manage your projects</p>
        </div>
        <Link
          to="/projects/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
              clipRule="evenodd"
            />
          </svg>
          New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600 mb-4">You don't have any projects yet.</p>
          <Link
            to="/projects/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md inline-block"
          >
            Create Your First Project
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard
