import { ReactNode, useState } from 'react';
import {
  Box,
  Flex,
  Avatar,
  HStack,
  // Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Icon,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';

import { Link, useNavigate } from 'react-router-dom';
import DrawerComponent from './DrawerComponent';

const Links = ['Dashboard', 'Projects', 'Team'];

// const NavLink = ({ children }: { children: ReactNode }) => (
//   <Link
//     px={2}
//     py={1}
//     rounded={'md'}
//     _hover={{
//       textDecoration: 'none',
//       bg: useColorModeValue('#611f37', '#611f37'),
//     }}
//     textColor='white'
//     href={'#'}>
//     {children}
//   </Link>
// );

export default function NavBar({ isAuth, setIsAuth }: { isAuth: boolean, setIsAuth: React.Dispatch<React.SetStateAction<boolean>> }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  let navigate = useNavigate();

  const handleSignOut = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }
    fetch("/api/logout", requestOptions)
      .then(res => res.json())
      .then(data => {
        if (data["success"]) {
          setIsAuth(false);
        }
        // what to do when fails
        navigate("/");
      })


  }

  return (
    <>
      <Box bg={useColorModeValue('#A5315B', '#611f37')} px={4}>
        <DrawerComponent isOpen={isDrawerOpen} setIsOpen={setIsDrawerOpen} />
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            <Link to='/'>
              <Icon viewBox="0 0 633.04 828.2" color='white'>
                <path
                  fill='currentColor'
                  d="M888.11,462.91c23.72-144-55.59-236.94-219.61-237.56L647.13,352.79c66.23,8.32,92.89,46.22,82.6,110.12C718,535,669.36,571.22,580.94,571.22H476.53l35.23-210,22.79-135.85H379.94L259.2,952.62H413l43-257.82H567.8L663,952.62H832.71L725.11,669.94C813.89,634.43,871.78,562.34,888.11,462.91Z"
                />
              </Icon>
            </Link>
            <Button onClick={() => setIsDrawerOpen(true)}>
              Ξ
            </Button>
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}>
              {/* {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))} */}
            </HStack>
          </HStack>
          <Flex alignItems={'center'}>
            {isAuth ?
              <Menu>
                <MenuButton
                  marginTop='5'
                  as={Button}
                  rounded={'full'}
                  variant={'link'}
                  cursor={'pointer'}
                  minW={0}>
                  <Avatar
                    size={'sm'}
                    src={
                      'https://pps.whatsapp.net/v/t61.24694-24/64228162_662454224270851_2362121713744871424_n.jpg?ccb=11-4&oh=01_AdTDj8I2uJqv8KTpGYJY7D_VCG0FTpQu7WsHQc-YTlOTOw&oe=636BE5AC'
                    }
                  />
                </MenuButton>
                <MenuList>
                  <MenuItem>Account Settings</MenuItem>
                  <MenuItem>TODO</MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
                </MenuList>
              </Menu>
              :
              <Link to='login'>
                <Button>
                  Log In
                </Button>
              </Link>
            }
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {/* {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))} */}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}