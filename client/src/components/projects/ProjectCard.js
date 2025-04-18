import { Link } from "react-router-dom"
import { format } from "date-fns"

const ProjectCard = ({ project }) => {
  const progress = Math.round((project.completedTasks / project.tasks.length) * 100) || 0

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{project.name}</h3>
            <p className="text-gray-600 mt-1">{project.description}</p>
          </div>
          <div className="dropdown">
            <button className="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
            {/* Dropdown menu would go here */}
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500 mt-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
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
          <span>Due {format(new Date(project.dueDate), "MMM d, yyyy")}</span>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Tasks:</span>
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
              <span>{project.completedTasks || 0}</span>
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
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{(project.tasks && project.tasks.length - project.completedTasks) || 0}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t px-6 py-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex -space-x-2">
            {project.team &&
              project.team.map((member) => (
                <div key={member._id} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                  <img
                    src={member.avatar || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
          </div>
          <div
            className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
              project.status === "Completed"
                ? "bg-green-100 text-green-800"
                : project.status === "In Progress"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {project.status}
          </div>
        </div>
      </div>

      <Link
        to={`/projects/${project._id}`}
        className="block bg-gray-50 text-center py-2 text-blue-600 hover:bg-gray-100 transition"
      >
        View Project
      </Link>
    </div>
  )
}

export default ProjectCard
