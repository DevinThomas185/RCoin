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
  Box,
  Spinner,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { useState, useEffect } from "react";
import { PhantomSigner } from "../phantom/Phantom";
import { Transaction } from "@solana/web3.js";
import { Success } from "../Success";
import { PopupAlert } from "../Alerts/PopupAlert";

enum RedeemState {
  Idle = "Idle",
  Pending = "Pending",
  Successful = "Successful",
  Failure = "Failure",
}

const Redeem = () => {
  const [readyToSign, setReadyToSign] = useState(false);
  const [transactionBytes, setTransactionBytes] = useState([]);
  const [redeemState, setRedeemState] = useState(RedeemState.Idle);

  const [signedTransaction, setSignedTransaction] =
    useState<Transaction | null>(null);

  const [redeemSuccess, setRedeemSuccess] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  //Add ability to view the successful transaction on the blockchain
  const [transactionSignature, setTransactionSignature] = useState("");

  useEffect(() => {
    if (signedTransaction) {
      setPopupVisible(false);
      setRedeemState(RedeemState.Pending);
      fetch("/api/complete-redeem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transaction_bytes: Array.from(signedTransaction.serialize()),
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setRedeemSuccess(true);
            setRedeemState(RedeemState.Successful);
            setPopupMessage("Transaction completed successfully!");
          } else {
            setRedeemSuccess(false);
            setPopupMessage(data["exception"]);
          }
          setPopupVisible(true);
        });
    }
  }, [signedTransaction]);

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
              isSuccessful={redeemSuccess}
              alertMessage={popupMessage}
            ></PopupAlert>
          )}
        </Grid>
        <Spacer></Spacer>
        <Grid maxH="100%" maxW="60%" p={3}>
          {readyToSign && (
            <>
              {redeemState === RedeemState.Pending && (
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                  size="xl"
                />
              )}
              {redeemState === RedeemState.Successful && (
                <Success timeout={3000} redirect={"/"} />
              )}
              {redeemState === RedeemState.Idle && (
                <PhantomSigner
                  transactionBytes={transactionBytes}
                  setSignedTransaction={setSignedTransaction}
                  redirect="/"
                ></PhantomSigner>
              )}
            </>
          )}

          {/* {readyToSign &&
            <PhantomSigner
              transactionBytes={transactionBytes}
              setSignedTransaction={setSignedTransaction}
              setPopupVisible={setPopupVisible}
              setPopupMessage={setPopupMessage}
            ></PhantomSigner>
          } */}

          {!readyToSign && (
            <Formik
              initialValues={{
                amount_in_coins: "",
              }}
              onSubmit={(values, actions) => {
                setPopupVisible(false);
                setTimeout(() => {
                  fetch("/api/redeem", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(values, null, 2),
                  })
                    .then((res) => res.json())
                    .then((data) => {
                      if (data.success) {
                        setRedeemSuccess(true);
                        setTransactionBytes(data.transaction_bytes);
                        setPopupMessage(
                          "Transaction request created successfully, please sign the transaction now."
                        );
                        setReadyToSign(true);
                      } else {
                        setRedeemSuccess(false);
                        setPopupMessage(data["exception"]);
                      }
                      setPopupVisible(true);
                    });

                  actions.setSubmitting(false);
                }, 1000);
              }}
            >
              {(props) => (
                <Form>
                  <Field name="amount_in_coins">
                    {({ field, form }: { field: any; form: any }) => (
                      <FormControl>
                        <FormLabel>
                          Amount of Stablecoin you want to redeem
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

export default Redeem;
