import { Box, Button, Center, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack } from "@chakra-ui/react"
import _ from "lodash";
import { useState } from "react";
import { CodeBlock } from "./CodeBlock"
var JSONPretty = require('react-json-pretty');

const CodeModal = ({isOpen, setOpen} : {isOpen: boolean, setOpen: any}) => {
  // api key is hidden until we can get paystack to give us correct key
  let AuditCode = `import requests
                    
api_key = "empty"

response = requests.get(
    "https://api.paystack.co/balance",
    headers={"Authorization": "Bearer {}".format(api_key)},
)

print(response.json())`

  const [pasystackResponse, setPayStackResponse] = useState({});
  
  const handleFetchBalance = () => {
    const requestOptions = {
      method: "GET",
      headers: { "Authorization": "Bearer empty" },
    }
    fetch("https://api.paystack.co/balance", requestOptions)
      .then(res => res.json())
      .then(data => {
        setPayStackResponse(data);
      })
  }

  const handleClose = () => {
    setPayStackResponse({})
    ;setOpen(false)
  }

  return (
      <>
        {/* <Button onClick={onOpen}>Open Modal</Button> */}
  
        <Modal isOpen={isOpen} size={'xl'} onClose={handleClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Verify Backing Balance</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Center>
                      <Stack>
                          {_.isEmpty(pasystackResponse) &&
                            <>
                              <CodeBlock code={AuditCode} language={'python'} showLineNumbers={true} />
                              <Button onClick={handleFetchBalance}>Fetch Balance</Button>
                            </>
                          }
                          {!_.isEmpty(pasystackResponse) &&
                            <JSONPretty data={pasystackResponse} />
                          }
                      </Stack>
              </Center>
            </ModalBody>
  
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={handleClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
}

export default CodeModal