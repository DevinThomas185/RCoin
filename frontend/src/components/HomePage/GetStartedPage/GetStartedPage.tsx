import {
  Box,
  Grid,
  Image,
  Flex,
  chakra,
  VStack,
  HStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import DesktopGetStartedPage from "./DesktopGetStartedPage";
import MobileGetStartedPage from "./MobileGetStartedPage";
import InformationPane from "../../Common/InformationPane";

const LandingPage = ({ onLearnMore }: { onLearnMore: () => void }) => {
  const useMobileView = useBreakpointValue({
    base: true,
    md: false,
  });

  const pageContent = useMobileView ? (
    <MobileGetStartedPage />
  ) : (
    <DesktopGetStartedPage />
  );

  return (
    <InformationPane colour="rcoinBlue.1100">{pageContent}</InformationPane>
  );
};

export default LandingPage;
