import { HStack, useBreakpointValue } from "@chakra-ui/react";
import InformationPane from "../../Common/InformationPane";

import LeftPane from "./LeftPane";
import MobileLeftPane from "./MobileLeftPane";
import MockupPhone from "./MockupPhone";

const DesktopLandingPage = ({ onLearnMore }: { onLearnMore: () => void }) => {
  return (
    <HStack justifyItems="center">
      <LeftPane onLearnMore={onLearnMore} />
      <MockupPhone />
    </HStack>
  );
};

const MobileLandingPage = ({ onLearnMore }: { onLearnMore: () => void }) => {
  return <MobileLeftPane onLearnMore={onLearnMore} />;
};

const LandingPage = ({ onLearnMore }: { onLearnMore: () => void }) => {
  const useMobileView = useBreakpointValue({
    base: true,
    md: false,
  });

  const pageContent = useMobileView ? (
    <MobileLandingPage onLearnMore={onLearnMore} />
  ) : (
    <DesktopLandingPage onLearnMore={onLearnMore} />
  );

  return (
    <InformationPane gradientDirection="to-br" gradientStrength={500}>
      {pageContent}
    </InformationPane>
  );
};

export default LandingPage;
