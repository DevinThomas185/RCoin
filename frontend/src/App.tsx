import * as React from "react";
import {
    ChakraProvider,
    Box,
    Text,
    Link,
    VStack,
    Code,
    Grid,
    theme,
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import Test from "./components/Test";
import { Logo } from "./Logo";
import { PhantomSigner } from "./components/phantom/Phantom";

export const App = () => (
    <ChakraProvider theme={theme}>
        <Box textAlign="center" fontSize="xl">
            <Grid minH="100vh" p={3}>
                <ColorModeSwitcher justifySelf="flex-end" />
                <Test></Test>
                <PhantomSigner></PhantomSigner>
            </Grid>
        </Box>
    </ChakraProvider>
);
