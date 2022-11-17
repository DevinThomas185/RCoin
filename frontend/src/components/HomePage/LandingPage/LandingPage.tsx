import { Box, Grid, HStack } from "@chakra-ui/react";
import InformationPane from "../../Common/InformationPane";

import LeftPane from "./LeftPane";
import MockupPhone from "./MockupPhone";

const LandingPage = ({ onLearnMore }: { onLearnMore: () => void }) => {
  return (
    <InformationPane gradientDirection="to-br" gradientStrength={500}>
      <HStack justifyItems="center">
        <LeftPane onLearnMore={onLearnMore} />
        <MockupPhone />
      </HStack>
    </InformationPane>
  );
};

export default LandingPage;
