import {
  Image,
  Box,
  HStack,
  Grid,
  useBreakpointValue,
  Flex,
  VStack,
} from "@chakra-ui/react";
import InformationPane from "../Common/InformationPane";
import MockupPhone from "../HomePage/LandingPage/MockupPhone";

const download_app = () => {
  fetch("/api/download_release_build", { method: "GET" })
    .then((res) => res.blob())
    .then((data) => {
      var a = document.createElement("a");
      a.href = window.URL.createObjectURL(data);
      a.download = "RCoin.apk";
      a.click();
    });
};

const MainLogo = () => {
  return <Image margin="auto" src="big_logo.png" height="80px" fit="contain" />;
};

const StoresStack = () => {
  return (
    <HStack justifyContent="left">
      <StoreButton
        pictureSrc="android.svg"
        websiteLink="https://play.google.com/store/games"
      />
      <StoreButton
        pictureSrc="ios.svg"
        // websiteLink="https://www.apple.com/app-store/"
        websiteLink="https://drive.proton.me/urls/2E82K47PZ4#phHLBdfJt4Cn"
      />
    </HStack>
  );
};

const StoreButton = ({
  pictureSrc,
  websiteLink,
  overrideWidth,
}: {
  pictureSrc: string;
  websiteLink: string;
  overrideWidth?: string;
}) => {
  const width = overrideWidth ? overrideWidth : "200px";
  return (
    <Image
      src={pictureSrc}
      maxWidth={width}
      transition="transform 0.15s ease-out, background 0.15s ease-out"
      _hover={{
        transform: "scale(1.03, 1.03)",
      }}
      onClick={() => {
        if (pictureSrc == "android.svg") {
          download_app();
        } else {
          window.open(websiteLink);
        }
      }}
    />
  );
};

const MobileDownloadPage = () => {
  return (
    <InformationPane colour={"rcoinBlue.1000"}>
      <Box>
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
            <MainLogo />
            <Image src="phonemockup.png" maxWidth="50%" fit="contain" />
          </HStack>
          <Box
            margin="10px"
            textAlign="left"
            fontSize="2xl"
            fontWeight="bold"
            color="rcoinBlue.700"
          >
            Use the RCoin app to purchase tokens, execute transactions, and
            withdraw your funds.
          </Box>
        </Flex>
        <HStack marginLeft="10px" marginTop="10px">
          <StoreButton
            pictureSrc="android.svg"
            websiteLink="https://play.google.com/store/games"
            overrideWidth="170px"
          />
          <StoreButton
            pictureSrc="ios.svg"
            websiteLink="https://www.apple.com/app-store/"
            overrideWidth="170px"
          />
        </HStack>
      </Box>
    </InformationPane>
  );
};

const DesktopDownloadPage = () => {
  return (
    <InformationPane colour={"rcoinBlue.1000"}>
      <Grid
        bg="rcoinBlue.50"
        alignItems="center"
        borderRadius="25px"
        maxWidth="1080px"
        maxHeight="450px"
      >
        <HStack marginLeft="20px" alignItems="stretch" marginRight="20px">
          <Grid>
            <Box
              textAlign="left"
              fontSize="5xl"
              fontWeight="bold"
              color="rcoinBlue.600"
            >
              Get The RCoin App
            </Box>
            <Box
              textAlign="left"
              fontSize="3xl"
              fontWeight="bold"
              maxWidth="80%"
              color="rcoinBlue.700"
            >
              Use our app to purchase tokens, execute transactions, and withdraw
              your funds.
            </Box>
            <StoresStack />
          </Grid>
          <Box>
            <MockupPhone overrideHeight="800px" />
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
