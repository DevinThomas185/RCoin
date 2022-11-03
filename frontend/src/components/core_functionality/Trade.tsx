import {
  FormControl,
  FormLabel,
  Input,
  ChakraProvider,
  theme,
  Grid,
  Flex,
  Spacer,
  FormErrorMessage,
  Button,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { useState } from "react";
import { PopupAlert } from "../Alerts/PopupAlert";
import { PhantomSigner } from "../phantom/Phantom";

const Trade = () => {
  const [readyToSign, setReadyToSign] = useState(false);
  const [transactionBytes, setTransactionBytes] = useState([]);
  const [tradeSuccess, setTradeSuccess] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  //Add ability to view the successful transaction on the blockchain
  const [transactionSignature, setTransactionSignature] = useState("");

  return (
    <ChakraProvider theme={theme}>
      <Flex
        textAlign="center"
        alignItems="center"
        flexDirection={{ base: "column" }}
        fontSize="xl"
      >
        <Grid maxH="100%" maxW="60%" p={3}>
          {isPopupVisible && (
            <PopupAlert
              isVisible={isPopupVisible}
              setVisible={setPopupVisible}
              isSuccessful={tradeSuccess}
              alertMessage={popupMessage}
            ></PopupAlert>
          )}
        </Grid>
        <Spacer></Spacer>
        <Grid maxH="100%" maxW="60%" p={3}>
          {readyToSign && (
            <PhantomSigner
              transactionBytes={transactionBytes}
              redirect="/"
            ></PhantomSigner>
          )}
          {/* {readyToSign &&
            <PhantomSigner
              transactionBytes={transactionBytes}
              setPopupMessage={setPopupMessage}
              setPopupVisible={setPopupVisible}
            ></PhantomSigner>
          } */}

          {!readyToSign && (
            <Formik
              initialValues={{ recipient_wallet: "", coins_to_transfer: "" }}
              onSubmit={(values, actions) => {
                setPopupVisible(false);
                setTimeout(() => {
                  // alert(JSON.stringify(values, null, 2))
                  fetch("/api/trade", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(values, null, 2),
                  })
                    .then((res) => res.json())
                    .then((data) => {
                      if (data.success) {
                        setTransactionBytes(data.transaction_bytes);
                        setReadyToSign(true);
                        setTradeSuccess(true);
                        setPopupMessage(
                          "Transaction request created successfully, please sign it now."
                        );
                      } else {
                        setTradeSuccess(false);
                        setPopupMessage(data.exception);
                      }
                      setPopupVisible(true);
                    });

                  actions.setSubmitting(false);
                }, 1000);
              }}
            >
              {(props) => (
                <Form>
                  <Field name="recipient_wallet">
                    {({ field, form }: { field: any; form: any }) => (
                      <FormControl>
                        <FormLabel>Wallet of receiver</FormLabel>
                        <Input {...field} placeholder="enter wallet here" />
                      </FormControl>
                    )}
                  </Field>
                  <Field name="coins_to_transfer">
                    {({ field, form }: { field: any; form: any }) => (
                      <FormControl>
                        <FormLabel>
                          Amount of Stablecoin you want to send
                        </FormLabel>
                        <Input {...field} placeholder="enter amount here" />
                      </FormControl>
                    )}
                  </Field>
                  <Button
                    mt={4}
                    colorScheme="teal"
                    isLoading={props.isSubmitting}
                    type="submit"
                  >
                    Submit
                  </Button>
                </Form>
              )}
            </Formik>
          )}
        </Grid>
        <Spacer></Spacer>
      </Flex>
    </ChakraProvider>
  );
};

export default Trade;
