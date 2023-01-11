import { Box, Image } from "@chakra-ui/react";
import { useState } from "react";

const MAIN_APP_SCREEN_SRC = "app_mockup.png";
const SECONDARY_APP_SCREEN_SRC = "app_transparency.png";
const APP_BALANCE_SCREEN = "app_balance.png";
const APP_TRANSFER_SCREEN = "app_transfer.png";

const MockupPhone = ({
  alternativeVariant,
  overrideHeight,
}: {
  alternativeVariant?: boolean;
  overrideHeight?: string;
}) => {
  const [primaryScreen, secondaryScreen] = alternativeVariant
    ? [APP_BALANCE_SCREEN, APP_TRANSFER_SCREEN]
    : [MAIN_APP_SCREEN_SRC, SECONDARY_APP_SCREEN_SRC];

  const [mockupScreen, setMockupScreen] = useState<string>(primaryScreen);
  const height =
    typeof overrideHeight != "undefined" ? overrideHeight : "600px";

  const onPhoneClick = () => {
    if (mockupScreen === primaryScreen) {
      setMockupScreen(secondaryScreen);
    } else {
      setMockupScreen(primaryScreen);
    }
  };

  return (
    // <Box justifySelf="right" alignItems="center" onClick={onPhoneClick}>
    //   <Image
    //     src={mockupScreen}
    //     maxHeight={height}
    //     fit="contain"
    //     transition="transform 0.15s ease-out, background 0.15s ease-out"
    //     _hover={{
    //       transform: "scale(1.03, 1.03)",
    //     }}
    //   />
    // </Box>
    <Box>
      <Image
        src="phonemockup.png"
        // boxSize="300px"
        // width={""}
        fit="contain"
      />
    </Box>
  );
};

export default MockupPhone;
