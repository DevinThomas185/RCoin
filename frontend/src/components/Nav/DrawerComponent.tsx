import React from "react"
import { 
    Button, 
    DrawerCloseButton, 
    Drawer, 
    DrawerOverlay, 
    DrawerContent, 
    DrawerHeader, 
    DrawerBody, 
    Stack,
    Spacer,
} from "@chakra-ui/react"

import { Link } from "react-router-dom"

function DrawerComponent({isOpen, setIsOpen}: {isOpen: boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>>}) {
    return (
        <>
            <Drawer
                isOpen={isOpen}
                placement='left'
                onClose={() => setIsOpen(false)}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Rcoin</DrawerHeader>

                    <DrawerBody>
                        <Stack height='50%' spacing='6'>
                            <Spacer/>
                            <Link to='/audit'>
                                <Button width='100%'>Audit</Button>
                            </Link>
                            <Link to='/issue'>
                                <Button width='100%'>Issue</Button>
                            </Link>
                            <Link to='/trade'>
                                <Button width='100%'>Trade</Button>
                            </Link>
                            <Link to='/redeem'>
                                <Button width='100%'>Redeem</Button>
                            </Link>
                            <Link to='/transaction-history'>
                                <Button width='100%'>Transaction History</Button>
                            </Link>
                        </Stack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default DrawerComponent