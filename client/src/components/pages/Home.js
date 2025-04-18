"use client"

import { useContext, useEffect } from "react"
import Projects from "../projects/Projects"
import ProjectForm from "../projects/ProjectForm"
import ProjectFilter from "../projects/ProjectFilter"
import AuthContext from "../../context/auth/authContext"
import Tasks from "../tasks/Tasks"
import TaskForm from "../tasks/TaskForm"
import ProjectContext from "../../context/project/projectContext"

const Home = () => {
  const authContext = useContext(AuthContext)
  const projectContext = useContext(ProjectContext)
  const { current } = projectContext

  useEffect(() => {
    authContext.loadUser()
    // eslint-disable-next-line
  }, [])

  return (
    <div className="grid-2">
      <div>
        <ProjectForm />
        <ProjectFilter />
        <Projects />
      </div>
      <div>
        {current ? (
          <div>
            <h3 className="text-primary">Tasks for {current.name}</h3>
            <TaskForm />
            <Tasks />
          </div>
        ) : (
          <h3>Select a project to view tasks</h3>
        )}
      </div>
    </div>
  )
}

export default Home
