import React from "react";
import {
  Image,
  Button,
  DrawerCloseButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Stack,
} from "@chakra-ui/react";

import { Link, useNavigate } from "react-router-dom";

function DrawerComponent({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const navigate = useNavigate();
  const buttonAction = () => {
    setIsOpen(false);
    navigate("/");
    const ele = document.querySelector("#LearnMore");
    if (ele) ele.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <>
      <Drawer
        isOpen={isOpen}
        returnFocusOnClose={false}
        placement="left"
        onClose={() => setIsOpen(false)}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <Image src="big_logo.png" boxSize="120px" fit="contain" />
          </DrawerHeader>
          <DrawerBody>
            <Stack height="100%" spacing="6">
              <Button variant="reactive" onClick={buttonAction} width="100%">
                Learn More
              </Button>
              <Link to="/audit">
                <Button variant="reactive" width="100%">
                  Real-Time Audit
                </Button>
              </Link>
              <Link to="/auditorSignup">
                <Button variant="reactive" width="100%">
                  Become an Auditor
                </Button>
              </Link>
              <Link to="/download">
                <Button variant="reactive" width="100%">
                  Download Rcoin App
                </Button>
              </Link>
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default DrawerComponent;
