import { ChakraProvider } from "@chakra-ui/react";
import theme from "../../theme";

import LandingPage from "./LandingPage/LandingPage";
import ExplanationPage from "./ExplanationPage/ExplanationPage";
import GetStartedPage from "./GetStartedPage/GetStartedPage";

const Home = () => {
  const onLearnMore = () => {
    const ele = document.querySelector("#LearnMore");
    if (ele) ele.scrollIntoView({ behavior: "smooth" });
  };

  const onGetStarted = () => {
    const ele = document.querySelector("#GetStarted");
    if (ele) ele.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <ChakraProvider theme={theme}>
      <LandingPage onLearnMore={onLearnMore} />
      <div id="LearnMore"></div>
      <ExplanationPage onGetStarted={onGetStarted} />
      <div id="GetStarted"></div>
      <GetStartedPage />
    </ChakraProvider>
  );
};

export default Home;
