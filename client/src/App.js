import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Navbar from "./components/layout/Navbar"
import Home from "./components/pages/Home"
import About from "./components/pages/About"
import Register from "./components/auth/Register"
import Login from "./components/auth/Login"
import Alerts from "./components/layout/Alerts"
import PrivateRoute from "./components/routing/PrivateRoute"
import ProjectState from "./context/project/ProjectState"
import AuthState from "./context/auth/AuthState"
import AlertState from "./context/alert/AlertState"
import "./App.css"

const App = () => {
  return (
    <AuthState>
      <ProjectState>
        <AlertState>
          <Router>
            <div className="App">
              <Navbar />
              <div className="container">
                <Alerts />
                <Routes>
                  <Route path="/" element={<PrivateRoute component={Home} />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login />} />
                </Routes>
              </div>
            </div>
          </Router>
        </AlertState>
      </ProjectState>
    </AuthState>
  )
}

export default App
