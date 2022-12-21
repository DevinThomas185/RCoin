import { Box, Grid, HStack, useBreakpointValue } from "@chakra-ui/react";
import InformationPane from "../../Common/InformationPane";

import LeftPane from "./LeftPane";
import MockupPhone from "./MockupPhone";

const LandingPage = ({ onLearnMore }: { onLearnMore: () => void }) => {
  const showMockupPhone = useBreakpointValue(
    {
      base: false,
      md: true,
    },
    {
      fallback: "md",
    }
  );
  return (
    <InformationPane gradientDirection="to-br" gradientStrength={500}>
      <HStack justifyItems="center">
        <LeftPane onLearnMore={onLearnMore} />
        {showMockupPhone ? <MockupPhone /> : null}
      </HStack>
    </InformationPane>
  );
};

export default LandingPage;
