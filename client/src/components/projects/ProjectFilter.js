"use client"

import { useContext, useRef, useEffect } from "react"
import ProjectContext from "../../context/project/projectContext"

const ProjectFilter = () => {
  const projectContext = useContext(ProjectContext)
  const text = useRef("")

  const { filterProjects, clearFilter, filtered } = projectContext

  useEffect(() => {
    if (filtered === null) {
      text.current.value = ""
    }
  })

  const onChange = (e) => {
    if (text.current.value !== "") {
      filterProjects(e.target.value)
    } else {
      clearFilter()
    }
  }

  return (
    <form>
      <input ref={text} type="text" placeholder="Filter Projects..." onChange={onChange} />
    </form>
  )
}

export default ProjectFilter
