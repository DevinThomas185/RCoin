import * as React from "react"
import { BrowserRouter as Router, Link as RouterLink, Routes, Route } from "react-router-dom"
import About from "./components/About"
import Home from "./components/Home"

export const App = () => (
  <Router>
    <div className="App">
      <ul className="App-header">
        <li>
          <RouterLink to="/">Home</RouterLink>
        </li>
        <li>
          <RouterLink to="/about">About Us</RouterLink>
        </li>
      </ul>
    </div>
    <Routes>
      <Route path='/' element={<Home />}></Route>
      <Route path='/about' element={<About />}></Route>
    </Routes>
  </Router>

)
