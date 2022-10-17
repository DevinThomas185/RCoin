import { useState } from "react";
import { BrowserRouter as Router, Link as RouterLink, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Issue from "./components/core_functionality/Issue";
import Trade from "./components/core_functionality/Trade";
import Home from "./components/Home";

const RequireAuth = (child: JSX.Element, isAuth: boolean) => {

  if (!isAuth) {
    return <Navigate to="/login" />
  }

  return child;
}

const App = () => {
  const [isAuth, setIsAuth] = useState(true);
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
        <Route path='/issue' element={RequireAuth(<Issue />, isAuth)}></Route>
        <Route path='/trade' element={RequireAuth(<Trade />, isAuth)}></Route>
        <Route path='/redeem' element={RequireAuth(<Home />, isAuth)}></Route>
        <Route path='/login' element={<Home />}></Route>
        <Route path='/sign-up' element={<Home />}></Route>
      </Routes>
    </Router>
  )
}

export default App;