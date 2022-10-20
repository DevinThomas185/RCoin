import { Flex, Spacer, ChakraProvider, theme, Box} from "@chakra-ui/react";
import { useState } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
    Navigate,
    Link,
} from "react-router-dom";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import Login from "./components/auth/Login";
import SignUp from "./components/auth/SignUp";
import Issue from "./components/core_functionality/Issue";
import Trade from "./components/core_functionality/Trade";
import Home from "./components/Home";
import "./main.css";

const RequireAuth = (child: JSX.Element, isAuth: boolean) => {
    if (!isAuth) {
        return <Navigate to="/login" />;
    }

    return child;
};

const App = () => {
    const [isAuth, setIsAuth] = useState(false);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true); // we are initially loading

    let navbar;
    if (isAuth) {
        navbar = (
            <Flex className="navbar">
                <Spacer></Spacer>
                <Link to="/">Home</Link>
                <Spacer></Spacer>
                <Spacer></Spacer>
                <Spacer></Spacer>
                <Link to="/issue">Issue</Link>
                <Spacer></Spacer>
                <Link to="/trade">Send Money</Link>
                <Spacer></Spacer>
                <Link to="/redeem">Redeem</Link>
                <Spacer></Spacer>
                <ColorModeSwitcher/>
            </Flex>
        );
    } else {
        navbar = (
            <Flex className="navbar">
                <Spacer></Spacer>
                <Link to="/">Home</Link>
                <Spacer></Spacer>
                <Link to="/sign-up">Sign Up</Link>
                <Spacer></Spacer>
                <Link to="/login">Login</Link>
                <Spacer></Spacer>
                <ColorModeSwitcher/>
            </Flex>
        );
    }
    return (
        <ChakraProvider theme={theme}>
            <Router>
                <div className="App">{navbar}</div>
                <Routes>
                    <Route path="/" element={<Home />}></Route>
                    <Route
                        path="/issue"
                        element={RequireAuth(<Issue />, isAuth)}
                    ></Route>
                    <Route
                        path="/trade"
                        element={RequireAuth(<Trade />, isAuth)}
                    ></Route>
                    <Route
                        path="/redeem"
                        element={RequireAuth(<Home />, isAuth)}
                    ></Route>
                    <Route path="/login" element={<Login setIsAuth={setIsAuth} />}></Route>
                    <Route path="/sign-up" element={<SignUp />}></Route>
                </Routes>
            </Router>
        </ChakraProvider>
    );
};

export default App;
