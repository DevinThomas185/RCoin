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
import { PhantomSigner } from "../phantom/Phantom";

const Redeem = ({ email }: { email: string }) => {

  const [readyToSign, setReadyToSign] = useState(false)
  const [transactionBytes, setTransactionBytes] = useState([]);

  return (
    <ChakraProvider theme={theme}>
      <Flex textAlign="center" fontSize="xl">
        <Spacer></Spacer>
        <Grid maxH="100%" maxW="60%" p={3}>
          {readyToSign &&
            <PhantomSigner transactionBytes={transactionBytes}></PhantomSigner>
          }

          {!readyToSign &&
            <Formik
              initialValues={{
                email: email,
                amount_in_rands: ""
              }}
              onSubmit={(values, actions) => {
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
                      setTransactionBytes(data.transaction_bytes);
                      setReadyToSign(true);
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
