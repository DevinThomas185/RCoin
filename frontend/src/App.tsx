import { Box } from "@chakra-ui/react";
import * as React from "react";
import { useState } from "react";
import { BrowserRouter as Router, Link as RouterLink, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Home from "./components/Home";

const RequireAuth = (child: JSX.Element, isAuth: boolean) => {

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
  const [isAuth, setIsAuth] = useState(false);
  let header;
  if (isAuth) {
    header = (
      <ul className="App-header">
        <li>
          <RouterLink to="/">Home</RouterLink>
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
    )
  } else {
    header = (
      <ul>
        <li>
          <RouterLink to="/">Home</RouterLink>
        </li>
        <li>
          <RouterLink to="/sign-up">Sign up</RouterLink>
        </li>
        <li>
          <RouterLink to="/login">Login</RouterLink>
        </li>
      </ul>
    )
  }
  return (
    <Router>
      <div className="App">
        {header}
      </div>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/issue' element={RequireAuth(<Home />, isAuth)}></Route>
        <Route path='/trade' element={RequireAuth(<Home />, isAuth)}></Route>
        <Route path='/redeem' element={RequireAuth(<Home />, isAuth)}></Route>
        <Route path='/login' element={<Home />}></Route>
        <Route path='/sign-up' element={<Home />}></Route>
      </Routes>
    </Router>
  )
}

export default App;