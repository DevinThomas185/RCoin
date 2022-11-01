import { Box, Button, Center, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack } from "@chakra-ui/react"
import { CodeBlock } from "./CodeBlock"

const CodeModal = ({isOpen, setOpen} : {isOpen: boolean, setOpen: any}) => {
    let AuditCode = `import requests
                    
api_key = "empty"

response = requests.get(
    "https://api.paystack.co/balance",
    headers={"Authorization": "Bearer {}".format(api_key)},
)

print(response.json())`
    
    return (
        <>
          {/* <Button onClick={onOpen}>Open Modal</Button> */}
    
          <Modal isOpen={isOpen} size={'xl'} onClose={() => setOpen(false)}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Verify Backing Balance</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Center>
                        <Stack>
                            <Box>
                                <CodeBlock code={AuditCode} language={'python'} showLineNumbers={true} />
                            </Box>
                            <Button>Fetch Balance</Button>
                    </Stack>
                </Center>
              </ModalBody>
    
              <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={() => setOpen(false)}>
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )
}

export default CodeModal