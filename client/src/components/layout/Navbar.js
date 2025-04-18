"use client"

import { Fragment, useContext } from "react"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import AuthContext from "../../context/auth/authContext"
import ProjectContext from "../../context/project/projectContext"

const Navbar = ({ title, icon }) => {
  const authContext = useContext(AuthContext)
  const projectContext = useContext(ProjectContext)

  const { isAuthenticated, logout, user } = authContext
  const { clearProjects } = projectContext

  const onLogout = () => {
    logout()
    clearProjects()
  }

  const authLinks = (
    <Fragment>
      <li>Hello {user && user.name}</li>
      <li>
        <a onClick={onLogout} href="#!">
          <i className="fas fa-sign-out-alt"></i> <span className="hide-sm">Logout</span>
        </a>
      </li>
    </Fragment>
  )

  const guestLinks = (
    <Fragment>
      <li>
        <Link to="/register">Register</Link>
      </li>
      <li>
        <Link to="/login">Login</Link>
      </li>
    </Fragment>
  )

  return (
    <div className="navbar bg-primary">
      <h1>
        <i className={icon} /> {title}
      </h1>
      <ul>{isAuthenticated ? authLinks : guestLinks}</ul>
    </div>
  )
}

Navbar.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string,
}

Navbar.defaultProps = {
  title: "Project Manager",
  icon: "fas fa-clipboard-list",
}

export default Navbar
