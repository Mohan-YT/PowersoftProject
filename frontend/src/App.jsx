import React from "react"

import { BrowserRouter as Router,Routes,Route } from "react-router-dom"
import Main from "./dashboard/Main.jsx"
import MainEmployePage from "./features/employees/MainEmployePage.jsx"
import MainProjectPage from "./features/projects/MainProject.jsx"
import MainTasksPage from "./features/tasks/MainTasksPage.jsx"


function App() {

  return (
    <>
      <Router>
          <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/employee" element={<MainEmployePage />} />
              <Route path="/project" element={<MainProjectPage />} />
              <Route path="/task" element={<MainTasksPage />} />
          </Routes>
      </Router>
    </>
  )
}

export default App
