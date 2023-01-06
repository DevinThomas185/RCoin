import {
  Image,
  Box,
  HStack,
  Grid,
  useBreakpointValue,
  Flex,
} from "@chakra-ui/react";
import InformationPane from "../Common/InformationPane";
import MockupPhone from "../HomePage/LandingPage/MockupPhone";

const MainLogo = () => {
  return <Image margin="auto" src="big_logo.png" height="80px" fit="contain" />;
};

const StoresStack = () => {
  return (
    <HStack justifyContent="center">
      <StoreButton
        pictureSrc="android.svg"
        websiteLink="https://play.google.com/store/games"
      />
      <StoreButton
        pictureSrc="ios.svg"
        websiteLink="https://www.apple.com/app-store/"
      />
    </HStack>
  );
};

const StoreButton = ({
  pictureSrc,
  websiteLink,
}: {
  pictureSrc: string;
  websiteLink: string;
}) => {
  return (
    <Image
      src={pictureSrc}
      maxWidth="200px"
      transition="transform 0.15s ease-out, background 0.15s ease-out"
      _hover={{
        transform: "scale(1.03, 1.03)",
      }}
      onClick={() => {
        window.open(websiteLink);
      }}
    />
  );
};

const MobileDownloadPage = () => {
  return (
    <InformationPane gradientDirection="to-br" gradientStrength={500}>
      <Flex
        bg="rcoinBlue.50"
        gap={0}
        direction="column"
        alignItems="center"
        borderRadius="25px"
        padding="5px"
        height="fit-content"
      >
        <Box
          textAlign="left"
          fontSize="6xl"
          fontWeight="bold"
          color="rcoinBlue.600"
        >
          Get Our App
        </Box>
        <HStack alignSelf="center">
          <MockupPhone overrideHeight="330px" />
          <Grid gap={5} padding="10px">
            <MainLogo />
            <StoreButton
              pictureSrc="android.svg"
              websiteLink="https://play.google.com/store/games"
            />
            <StoreButton
              pictureSrc="ios.svg"
              websiteLink="https://www.apple.com/app-store/"
            />
          </Grid>
        </HStack>
        <Flex direction="row">
          <Box
            margin="10px"
            textAlign="left"
            fontSize="2xl"
            maxW="55%"
            fontWeight="bold"
            color="rcoinBlue.700"
          >
            Use the RCoin app to purchase tokens, execute transactions, and
            withdraw your funds.
          </Box>
          <Box alignSelf="center">
            <MockupPhone overrideHeight="400px" alternativeVariant={true} />
          </Box>
        </Flex>
      </Flex>
    </InformationPane>
  );
};

const DesktopDownloadPage = () => {
  return (
    <InformationPane gradientDirection="to-br" gradientStrength={500}>
      <Grid
        bg="rcoinBlue.50"
        alignItems="center"
        borderRadius="25px"
        maxWidth="1080px"
        maxHeight="550px"
      >
        <Image src="big_logo.png" boxSize="250px" height="80px" fit="contain" />
        <HStack marginLeft="20px" marginRight="20px" alignItems="stretch">
          <Grid>
            <Box
              textAlign="left"
              fontSize="6xl"
              fontWeight="bold"
              color="rcoinBlue.600"
            >
              Get The Rcoin App
            </Box>
            <Box
              textAlign="left"
              fontSize="3xl"
              fontWeight="bold"
              color="rcoinBlue.700"
            >
              Use our app to purchase tokens, execute transactions, and withdraw
              your funds.
            </Box>
            <StoresStack />
          </Grid>
          <Box alignSelf="center">
            <MockupPhone overrideHeight="800px" />
          </Box>
          <Box alignSelf="center">
            <MockupPhone overrideHeight="800px" alternativeVariant={true} />
          </Box>
        </HStack>
      </Grid>
    </InformationPane>
  );
};

const DownloadPage = () => {
  const useMobileView = useBreakpointValue({
    base: true,
    md: false,
  });

  return useMobileView ? <MobileDownloadPage /> : <DesktopDownloadPage />;
};

export default DownloadPage;
