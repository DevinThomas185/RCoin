import { Flex, HStack, Button, Image, Spacer } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const NavBarButtons = ({
  setIsDrawerOpen,
}: {
  setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <Flex
      h={16}
      maxW="1080px"
      marginLeft="auto"
      marginRight="auto"
      alignItems={"center"}
      justifyContent={"space-between"}
    >
      <HStack spacing={2} alignItems={"center"}>
        <Button variant="reactive" onClick={() => setIsDrawerOpen(true)}>
          Ξ
        </Button>
        <Link to={"/"}>
          <Button variant="reactive" w="60px">
            <Image src="small_logo.png" boxSize="40px" fit="contain" />
          </Button>
        </Link>
      </HStack>
      <Spacer />
      <Link to={"/download"}>
        <Button variant={"reactive"}>Download The App</Button>
      </Link>
    </Flex>
  );
};

export default NavBarButtons;
