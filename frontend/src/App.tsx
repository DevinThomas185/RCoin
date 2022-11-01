import { Flex, Spacer, ChakraProvider, theme, Text} from "@chakra-ui/react";
import { useState } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    Link,
} from "react-router-dom";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import Login from "./components/auth/Login";
import SignUp from "./components/auth/SignUp";
import Issue from "./components/core_functionality/Issue";
import Redeem from "./components/core_functionality/Redeem";
import Trade from "./components/core_functionality/Trade";
import Home from "./components/Home";
import Audit from "./components/AuditPage";
import "./main.css";
import NavBar from "./components/Nav/NavBar";
import TransactionHistoryPage from "./components/TransactionHistoryPage";

const RequireAuth = (child: JSX.Element, isAuth: boolean, isLoadingAuth: boolean) => {    
    // This is for when we have an /authenticated endpoint and we can check without having
    // to log back in
    if (isLoadingAuth) {
        return <></>
    }

    
    if (!isAuth) {
        return <Navigate to="/login" />;
    }

    return child;
};

const App = () => {
    const [isAuth, setIsAuth] = useState(false);
    const [isLoadingAuth, setIsLoadingAuth] = useState(false); // we are initially loading
    const [email, setEmail] = useState("");

    return (
        <ChakraProvider theme={theme}>
            <Router>
                <div className="App">
                    <NavBar isAuth={isAuth} setIsAuth={setIsAuth}/>    
                </div>
                <Routes>
                    <Route path="/" element={<Home email={email} isAuth={isAuth}/>}></Route>
                    <Route
                        path="/issue"
                        element={RequireAuth(<Issue email={email} />, isAuth, isLoadingAuth)}
                    ></Route>
                    <Route
                        path="/trade"
                        element={RequireAuth(<Trade email={email} />, isAuth, isLoadingAuth)}
                    ></Route>
                    <Route
                        path="/redeem"
                        element={RequireAuth(<Redeem email={email} />, isAuth, isLoadingAuth)}
                    ></Route>
                    <Route path="/login" element={<Login setIsAuth={setIsAuth} setEmail={setEmail} />}></Route>
                    <Route path="/sign-up" element={<SignUp />}></Route>
                    <Route path='/audit' element={<Audit email={email} isAuth={isAuth} />}> </Route>
                    <Route path='/transaction-history' element={<TransactionHistoryPage email={email} isAuth={isAuth} />}> </Route>
                </Routes>
            </Router>
        </ChakraProvider>
    );
};

export default App;
