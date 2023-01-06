import MobileLeftPane from "./MobileLeftPane";
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
import InformationPane from "../../Common/InformationPane";
import RightPane from "./RightPane";
import MockupPhone from "./MockupPhone";

const DesktopLandingPage = ({ onLearnMore }: { onLearnMore: () => void }) => {
  return (
    <Box>
      <Flex justifyItems="center" justifyContent={"center"} direction="row">
        <Image src="phonemockup.png" width={"60%"} fit="contain" />
        <Box marginTop={"25%"}>
          <RightPane onLearnMore={onLearnMore} />
        </Box>
      </Flex>
      <VStack alignItems="Center">
        <Box
          textAlign="left"
          fontSize="2xl"
          fontWeight="bold"
          color="rcoinBlue.1000"
        >
          Auditable in{" "}
          <chakra.span fontSize="2xl" color="rcoinBlue.1200" fontWeight="bold">
            real time
          </chakra.span>
          {"\n"}all the time.
        </Box>
        <Box
          textAlign="left"
          fontSize="2xl"
          fontWeight="bold"
          color="rcoinBlue.1000"
        >
          Instant on-chain transfers powered by the{" "}
          <chakra.span fontSize="2xl" color="rcoinBlue.1300" fontWeight="bold">
            Solana Blockchain.
          </chakra.span>
        </Box>
      </VStack>
    </Box>
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
    <InformationPane colour="rcoinBlue.1100">
      {pageContent}
      {/* Row containing image and logo with tagline */}
    </InformationPane>
  );
};

export default LandingPage;
