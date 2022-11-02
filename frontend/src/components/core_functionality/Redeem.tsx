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
import { useState, useEffect } from "react";
import { PhantomSigner } from "../phantom/Phantom";
import { Transaction } from "@solana/web3.js";
import { PopupAlert } from "../Alerts/PopupAlert";


const Redeem = () => {

  const [readyToSign, setReadyToSign] = useState(false)
  const [transactionBytes, setTransactionBytes] = useState([]);
  const [signedTransaction, setSignedTransaction] = useState<Transaction | null>(null);
  const [redeemSuccess, setRedeemSuccess] = useState(false)
  const [isPopupVisible, setPopupVisible] = useState(false)
  const [popupMessage, setPopupMessage] = useState("")
  //Add ability to view the successful transaction on the blockchain
  const [transactionSignature, setTransactionSignature] = useState("")

  useEffect(() => {
    if (signedTransaction) {
      setPopupVisible(false)
      fetch('/api/complete-redeem', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(
          {
            "transaction_bytes": Array.from(signedTransaction.serialize()),
          }
        )
      })
        .then((res) => res.json())
        .then((data) => {
          if(data.success) {
            setRedeemSuccess(true)
            setPopupMessage("Transaction completed successfully!")
          } else {
            setRedeemSuccess(false)
            setPopupMessage(data["exception"])
          }
          setPopupVisible(true)
        })
    }

  }, [signedTransaction]);


  return (
    <ChakraProvider theme={theme}>
      <Flex textAlign="center" fontSize="xl">
        <Spacer></Spacer>
        <Grid maxH="100%" maxW="60%" p={3}>
          {isPopupVisible &&
            <PopupAlert
              isVisible={isPopupVisible}
              setVisible={setPopupVisible}
              isSuccessful={redeemSuccess}
              alertMessage={popupMessage}
            ></PopupAlert>}

          {readyToSign &&
            <PhantomSigner transactionBytes={transactionBytes} setSignedTransaction={setSignedTransaction}></PhantomSigner>
          }

          {!readyToSign &&
            <Formik
              initialValues={{
                amount_in_coins: ""
              }}
              onSubmit={(values, actions) => {
                setPopupVisible(false)
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
                      if(data.success) {
                        setRedeemSuccess(true)
                        setTransactionBytes(data.transaction_bytes);
                        setPopupMessage("Transaction request created successfully, please sign the transaction now.")
                        setReadyToSign(true);
                      } else {
                        setRedeemSuccess(false)
                        setPopupMessage(data["exception"])
                      }
                      setPopupVisible(true)
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
          }
        </Grid>
        <Spacer></Spacer>
      </Flex>
    </ChakraProvider>
  );
};

export default Redeem;
