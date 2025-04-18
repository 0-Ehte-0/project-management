"use client"

import { Fragment, useContext } from "react"
import { CSSTransition, TransitionGroup } from "react-transition-group"
import TaskItem from "./TaskItem"
import ProjectContext from "../../context/project/projectContext"

const Tasks = () => {
  const projectContext = useContext(ProjectContext)

  const { tasks } = projectContext

  if (tasks.length === 0) {
    return <h4>No tasks for this project</h4>
  }

  return (
    <Fragment>
      <TransitionGroup>
        {tasks.map((task) => (
          <CSSTransition key={task._id} timeout={500} classNames="item">
            <TaskItem task={task} />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </Fragment>
  )
}

export default Tasks
