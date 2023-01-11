import {
  Grid,
  Image,
  Box,
  chakra,
  VStack,
  Flex,
  HStack,
  Button,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

const MobileLeftPane = ({ onLearnMore }: { onLearnMore: () => void }) => {
  return (
    <Box>
      <Image
        src="RCoinWebLogo.png"
        width={"50%"}
        marginRight="auto"
        marginLeft="auto"
        marginTop={"10px"}
        fit="contain"
      />
      <Image src="phonemockup.png" width={"100%"} fit="contain" />

      <Box
        textAlign="center"
        fontSize="4xl"
        fontWeight="medium"
        color="rcoinBlue.1000"
        display="flex"
        marginBottom={"25px"}
      >
        The future of online transactions today.
      </Box>

      <VStack alignItems="Center">
        <Box
          textAlign="center"
          fontSize="xl"
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
          textAlign="center"
          fontSize="xl"
          fontWeight="bold"
          color="rcoinBlue.1000"
        >
          Instant on-chain transfers powered by the{" "}
          <chakra.span fontSize="2xl" color="rcoinBlue.1300" fontWeight="bold">
            Solana Blockchain.
          </chakra.span>
        </Box>
        <HStack>
          <Link to={"/audit"} onClick={() => window.scrollTo(0, 0)}>
            <Button variant="reactiveOutline" color="rcoinBlue.1000" size="lg">
              Check our Audit
            </Button>
          </Link>
          <Button
            onClick={onLearnMore}
            variant="reactiveOutline"
            color="rcoinBlue.1000"
            size="lg"
          >
            Learn More
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default MobileLeftPane;
