import { Box, Grid, Image, Flex, chakra, VStack } from "@chakra-ui/react";
import InformationPane from "../../Common/InformationPane";
import RightPane from "./RightPane";
import MockupPhone from "./MockupPhone";

const LandingPage = ({ onLearnMore }: { onLearnMore: () => void }) => {
  return (
    <InformationPane colour="rcoinBlue.1100">
      {/* Row containing image and logo with tagline */}
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
    </InformationPane>
  );
};

export default LandingPage;
