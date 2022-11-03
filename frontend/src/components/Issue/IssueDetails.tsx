import {
    Box,
    Button,
    Text,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    Flex,
    Grid,
} from "@chakra-ui/react";

import { useRef, useState } from "react";
import { PaystackButton } from 'react-paystack';
import { PopupAlert } from "../Alerts/PopupAlert";


function IssueDetails({ amount }: { amount: number }) {
    const finalRef = useRef(null)
    const [issueSuccess, setIssueSuccess] = useState(false)
    const [dataReturned, setDataReturned] = useState(false)
    const [isPopupVisible, setPopupVisible] = useState(false)
    const [popupMessage, setPopupMessage] = useState("")
  //Add ability to view the successful transaction on the blockchain
    const [isOpen, setIsOpen] = useState(false)
    const service_charge_perc = 0.15
    const service_charge_val = Math.round(100 * 0.15 * amount) / 100  // Round to 2 sf
    const to_charge = service_charge_val + amount

    return (
        <>
          <Flex textAlign="center" alignItems="center" flexDirection={{base: 'column'}} fontSize="xl">
          <Grid maxH="100%" maxW="100%" p={3}>
            {isPopupVisible &&
              <PopupAlert
                isVisible={isPopupVisible}
                setVisible={setPopupVisible}
                isSuccessful={issueSuccess}
                alertMessage={popupMessage}
              ></PopupAlert>}
          </Grid>
          </Flex>

            <Box ref={finalRef} tabIndex={-1} aria-label='Focus moved to this box'>
                Minimum transaction amount is 10 ZAR
            </Box>

            <Button mt={4} onClick={() => { if (amount >= 10) setIsOpen(true) }}>
                Checkout
            </Button>
            <Modal finalFocusRef={finalRef} isOpen={isOpen} size={"lg"} onClose={() => setIsOpen(false)}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Modal Title</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <>
                            <Text>Rcoin deposited to your stablecoin account: {amount}</Text>
                            <Text>Service charge ({(service_charge_perc * 100).toFixed(2)}%) = {service_charge_val.toFixed(2)} </Text>
                            <Text>Total: {to_charge.toFixed(2)}</Text>
                        </>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={() => setIsOpen(false)}>
                            Close
                        </Button>
                        <PaystackButton
                            email={'email@email.com'}
                            amount={Math.floor(100 * to_charge)}
                            publicKey='pk_test_74b1d55fbad5fc6c5bb27a7d6030a0e575aa75f4'
                            text='Pay'
                            onSuccess={() => {
                                setTimeout(() => {
                                    fetch('/api/issue', {
                                        method: "POST",
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({ 'amount_in_rands': amount }, null, 2)
                                    })
                                        .then((res) => res.json())
                                        .then((data) => {
                                            if (data.success) {
                                                setIssueSuccess(true)
                                                setPopupMessage("Tokens issued successfully!")
                                            } else {
                                                setIssueSuccess(false)
                                                setPopupMessage(data["exception"])
                                                setDataReturned(true)
                                            }
                                              setPopupVisible(true)
                                            })
                                    // actions.setSubmitting(false)
                                }, 1000)
                                setIsOpen(false)
                            }
                            }
                            onClose={() => setIsOpen(false)}
                            currency='ZAR'
                        />
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}


export default IssueDetails
