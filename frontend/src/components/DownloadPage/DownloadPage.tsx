import { Image, Box, HStack, Grid, Link } from "@chakra-ui/react";
import InformationPane from "../Common/InformationPane";
import MockupPhone from "../HomePage/LandingPage/MockupPhone";

const DownloadPage = () => {
  return (
    <InformationPane colour={"rcoinBlue.1000"}>
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
            <HStack justifyContent="center">
              <Image
                src="android.svg"
                maxWidth="200px"
                transition="transform 0.15s ease-out, background 0.15s ease-out"
                _hover={{
                  transform: "scale(1.03, 1.03)",
                }}
                onClick={() => {
                  window.open("https://play.google.com/store/games");
                }}
              />
              <Image
                src="ios.svg"
                maxWidth="200px"
                transition="transform 0.15s ease-out, background 0.15s ease-out"
                _hover={{
                  transform: "scale(1.03, 1.03)",
                }}
                onClick={() => {
                  window.open("https://www.apple.com/app-store/");
                }}
              />
            </HStack>
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

export default DownloadPage;
