import { useState } from "react";
import { Box } from "@chakra-ui/react";

import DrawerComponent from "./DrawerComponent";
import NavBarButtons from "./NavBarButtons";

export default function NavBar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <Box bg="rcoinBlue.500" px={4}>
        <DrawerComponent isOpen={isDrawerOpen} setIsOpen={setIsDrawerOpen} />
        <NavBarButtons setIsDrawerOpen={setIsDrawerOpen} />
      </Box>
    </>
  );
}
