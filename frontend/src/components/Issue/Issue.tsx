import {
  Button,
  ChakraProvider,
  theme,
  Grid,
  Flex,
  Spacer,
  NumberInput,
  NumberInputField,
  Text,
  Box,
  Spinner,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { PaystackButton } from "react-paystack";
import { useNavigate } from "react-router-dom";
import "../../main.css";
import { Success } from "../Success";

const Issue = () => {
  const [amount, setAmount] = useState(0);

  const navigate = useNavigate();
  const finalRef = useRef(null);
  const [issueSuccess, setIssueSuccess] = useState(false);
  const [dataReturned, setDataReturned] = useState(false);
  const [pending, setPending] = useState(false);
  const [paystackOpen, setPaystackOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const service_charge_perc = 0.15;
  const service_charge_val = Math.round(100 * 0.15 * amount) / 100; // Round to 2 sf
  const to_charge = service_charge_val + amount;

  const format_input = (s: string) => {
    const val: number = parseInt(s);
    if (val >= 0) {
      return val;
    }

    return 0;
  };

  const format_output = (val: number) => val;

  return (
    <ChakraProvider theme={theme}>
      <Flex textAlign="center" fontSize="xl">
        <Spacer></Spacer>
        <Grid maxH="100%" maxW="60%" p={3}>
          {!pending && !issueSuccess && (
            <>
              <NumberInput
                onChange={(input: string) => setAmount(format_input(input))}
                value={format_output(amount)}
                isInvalid={amount < 10}
              >
                <NumberInputField placeholder="Amount (Rcoin)" />
              </NumberInput>

              <Box
                ref={finalRef}
                tabIndex={-1}
                aria-label="Focus moved to this box"
              >
                Minimum transaction amount is 10 ZAR
              </Box>

              <Button
                mt={4}
                onClick={() => {
                  if (amount >= 10) setIsOpen(true);
                }}
              >
                Checkout
              </Button>
            </>
          )}

          {pending && (
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          )}

          {issueSuccess && <Success timeout={3000} redirect={"/"} />}

          <Modal
            finalFocusRef={finalRef}
            isOpen={isOpen}
            size={"lg"}
            onClose={() => setIsOpen(false)}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Modal Title</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <>
                  <Text>
                    Rcoin deposited to your stablecoin account: {amount}
                  </Text>
                  <Text>
                    Service charge ({(service_charge_perc * 100).toFixed(2)}%) ={" "}
                    {service_charge_val.toFixed(2)}{" "}
                  </Text>
                  <Text>Total: {to_charge.toFixed(2)}</Text>
                </>
              </ModalBody>

              <ModalFooter>
                <Button
                  colorScheme="blue"
                  mr={3}
                  onClick={() => setIsOpen(false)}
                >
                  Close
                </Button>
                <PaystackButton
                  email={"email@email.com"}
                  amount={Math.floor(100 * to_charge)}
                  publicKey="pk_test_74b1d55fbad5fc6c5bb27a7d6030a0e575aa75f4"
                  text="Pay"
                  onSuccess={() => {
                    setPending(true);
                    setTimeout(() => {
                      fetch("/api/issue", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify(
                          { amount_in_rands: amount },
                          null,
                          2
                        ),
                      })
                        .then((res) => res.json())
                        .then((data) => {
                          if (data["success"]) {
                            setIssueSuccess(true);
                            setPending(false);
                          }
                          // spins forever for now
                        });
                      // actions.setSubmitting(false)
                    }, 1000);
                    setIsOpen(false);
                  }}
                  onClose={() => setIsOpen(false)}
                  currency="ZAR"
                />
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Grid>
        <Spacer></Spacer>
      </Flex>
    </ChakraProvider>
  );
};

export default Issue;
