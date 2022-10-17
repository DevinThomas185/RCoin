import { Box } from "@chakra-ui/react";
import * as React from "react";
import { useState } from "react";
import { BrowserRouter as Router, Link as RouterLink, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Home from "./components/Home";

const RequireAuth = (child: Element, isAuth: boolean) => {

  if (!isAuth) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" />
  }

  return child;
}


const App = () => {
  const [isAuth, setIsAuth] = useState(true);
  return (
    <Router>
      <div className="App">
        <ul className="App-header">
          <li>
            <RouterLink to="/">Home</RouterLink>
          </li>
          <li>
            <RouterLink to="/login">Login</RouterLink>
          </li>
          <li>
            <RouterLink to="/sign_up">Sign up</RouterLink>
          </li>
          <li>
            <RouterLink to="/issue">Issue</RouterLink>
          </li>
          <li>
            <RouterLink to="/trade">Trade</RouterLink>
          </li>
          <li>
            <RouterLink to="/redeem">Redeem</RouterLink>
          </li>
        </ul>
      </div>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/about' element={<Home />}></Route>
      </Routes>
    </Router>
  )
}

export default App;