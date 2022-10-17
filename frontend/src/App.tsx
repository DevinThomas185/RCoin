import { Flex, Link, Spacer } from "@chakra-ui/react";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Issue from "./components/core_functionality/Issue";
import Trade from "./components/core_functionality/Trade";
import Home from "./components/Home";
import './main.css';

const RequireAuth = (child: JSX.Element, isAuth: boolean) => {

  if (!isAuth) {
    return <Navigate to="/login" />
  }

  return child;
}

const App = () => {
  const [isAuth, setIsAuth] = useState(true);
  let navbar;
  if (isAuth) {
    navbar = (
      <Flex className="navbar">
        <Spacer></Spacer>
        <Link href="/">Home</Link>
        <Spacer></Spacer>
        <Spacer></Spacer>
        <Spacer></Spacer>
        <Link href="/issue">Issue</Link>
        <Spacer></Spacer>
        <Link href="/trade">Trade</Link>
        <Spacer></Spacer>
        <Link href="/redeem">Redeem</Link>
        <Spacer></Spacer>
      </Flex>

    )
  } else {
    navbar = (
      <Flex className="navbar">
        <Spacer></Spacer>
        <Link href="/">Home</Link>
        <Spacer></Spacer>
        <Link href="/issue">Sign</Link>
        <Spacer></Spacer>
        <Link href="/trade">Trade</Link>
        <Spacer></Spacer>
        <Link href="/redeem">Redeem</Link>
        <Spacer></Spacer>
      </Flex>
    )
  }
  return (
    <Router>
      <div className="App">
        {navbar}
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