import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/HomePage/Home";
import AuditPage from "./components/AuditPage/AuditPage";
import DownloadPage from "./components/DownloadPage/DownloadPage";
import "./main.css";
import NavBar from "./components/Nav/NavBar";
import AuditorSignupPage from "./components/AuditorSignup/AuditorSignupPage";

const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <div className="App">
          <NavBar />
        </div>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/audit" element={<AuditPage />}></Route>
          <Route path="/download" element={<DownloadPage />}></Route>
          <Route path="/auditorSignup" element={<AuditorSignupPage />}></Route>
        </Routes>
      </Router>
    </ChakraProvider>
  );
};

export default App;
