"use client"

import { useContext, useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { ProjectContext } from "../context/ProjectContext"
import TaskItem from "../components/tasks/TaskItem"

const ProjectDetail = () => {
  const { id } = useParams()
  const { currentProject, tasks, loading, getProject, createTask } = useContext(ProjectContext)
  const [activeTab, setActiveTab] = useState("all")
  const [newTaskTitle, setNewTaskTitle] = useState("")

  useEffect(() => {
    getProject(id)
    // eslint-disable-next-line
  }, [id])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newTaskTitle.trim() === "") return

    createTask({
      title: newTaskTitle,
      project: id,
      status: "not-started",
    })

    setNewTaskTitle("")
  }

  const filteredTasks = () => {
    if (activeTab === "all") return tasks
    return tasks.filter((task) =>
      activeTab === "in-progress"
        ? task.status === "in-progress"
        : activeTab === "completed"
          ? task.status === "completed"
          : task.status === "not-started",
    )
  }

  if (loading || !currentProject) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  const progress = Math.round((tasks.filter((t) => t.status === "completed").length / tasks.length) * 100) || 0

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
          <h1 className="text-2xl font-bold">{currentProject.name}</h1>
          <p className="text-gray-600">{currentProject.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Tasks</h2>
                <form onSubmit={handleSubmit} className="flex">
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Add a new task..."
                    className="border rounded-l-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded-r-md hover:bg-blue-700">
                    Add
                  </button>
                </form>
              </div>

              <div className="flex border-b mb-4">
                <button
                  className={`px-4 py-2 ${activeTab === "all" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
                  onClick={() => setActiveTab("all")}
                >
                  All Tasks
                </button>
                <button
                  className={`px-4 py-2 ${activeTab === "in-progress" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
                  onClick={() => setActiveTab("in-progress")}
                >
                  In Progress
                </button>
                <button
                  className={`px-4 py-2 ${activeTab === "completed" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
                  onClick={() => setActiveTab("completed")}
                >
                  Completed
                </button>
              </div>

              <div className="space-y-4">
                {filteredTasks().length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No tasks found.</p>
                ) : (
                  filteredTasks().map((task) => <TaskItem key={task._id} task={task} />)
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Project Overview</h2>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Due {new Date(currentProject.dueDate).toLocaleDateString()}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-green-500 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{tasks.filter((t) => t.status === "completed").length} completed</span>
                  </div>
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-400 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{tasks.length - tasks.filter((t) => t.status === "completed").length} remaining</span>
                  </div>
                </div>

                <div
                  className={`text-xs font-medium px-2.5 py-0.5 rounded-full inline-block ${
                    currentProject.status === "Completed"
                      ? "bg-green-100 text-green-800"
                      : currentProject.status === "In Progress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {currentProject.status}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Team</h2>

              <div className="space-y-4">
                {currentProject.team &&
                  currentProject.team.map((member) => (
                    <div key={member._id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img
                          src={member.avatar || "/placeholder.svg"}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-gray-500">{member.role || "Team Member"}</p>
                      </div>
                    </div>
                  ))}

                <button className="w-full border border-gray-300 rounded-md py-2 text-gray-600 hover:bg-gray-50 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Add Team Member
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetail
