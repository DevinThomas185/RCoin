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
  InputRightElement,
  InputGroup,
  Text,
} from "@chakra-ui/react";

import { Link } from "react-router-dom";
import { Field, Form, Formik } from "formik";
import { useState } from "react";
import { PhantomSigner } from "../phantom/Phantom";
import { PopupAlert } from "../Alerts/PopupAlert";
const SignUp = () => {
  const [readyToSign, setReadyToSign] = useState(false);
  const [transactionBytes, setTransactionBytes] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [issueSuccess, setIssueSuccess] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  //Add ability to view the successful transaction on the blockchain
  const [transactionSignature, setTransactionSignature] = useState("");

  return (
    <ChakraProvider theme={theme}>
      <Flex textAlign="center" fontSize="xl">
        <Spacer></Spacer>
        <Grid maxH="100%" maxW="60%" p={3}>
          {isPopupVisible && (
            <PopupAlert
              isVisible={isPopupVisible}
              setVisible={setPopupVisible}
              isSuccessful={issueSuccess}
              alertMessage={popupMessage}
            ></PopupAlert>
          )}
          {readyToSign && (
            <PhantomSigner
              transactionBytes={transactionBytes}
              redirect="/"
            ></PhantomSigner>
          )}

          {!readyToSign && (
            <Formik
              initialValues={{
                first_name: "",
                last_name: "",
                wallet_id: "",
                email: "",
                password: "",
                bank_account: "",
                sort_code: "",
                document_number: "",
                recipient_code: "",
              }}
              onSubmit={(values, actions) => {
                setTimeout(() => {
                  fetch("/api/signup", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(values, null, 2),
                  })
                    .then((res) => res.json())
                    .then((data) => {
                      if (data["success"]) {
                        setIssueSuccess(true);
                        setTransactionBytes(data.transaction_bytes);
                        setPopupMessage(
                          "Account created successfully! Please connect the wallet now."
                        );
                        setReadyToSign(true);
                      } else {
                        setIssueSuccess(false);
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
                  <Field name="email">
                    {({ field, form }: { field: any; form: any }) => (
                      <FormControl isRequired>
                        <FormLabel>Email</FormLabel>
                        <Input {...field} placeholder="your email address" />
                      </FormControl>
                    )}
                  </Field>
                  <Field name="first_name">
                    {({ field, form }: { field: any; form: any }) => (
                      <FormControl isRequired>
                        <FormLabel>First name</FormLabel>
                        <Input {...field} placeholder="your first name" />
                      </FormControl>
                    )}
                  </Field>
                  <Field name="last_name">
                    {({ field, form }: { field: any; form: any }) => (
                      <FormControl isRequired>
                        <FormLabel>Last name</FormLabel>
                        <Input {...field} placeholder="your last name" />
                      </FormControl>
                    )}
                  </Field>
                  <Field name="wallet_id">
                    {({ field, form }: { field: any; form: any }) => (
                      <FormControl isRequired>
                        <FormLabel>Wallet ID</FormLabel>
                        <Input {...field} placeholder="your wallet ID" />
                      </FormControl>
                    )}
                  </Field>
                  <Field name="bank_account">
                    {({ field, form }: { field: any; form: any }) => (
                      <FormControl isRequired>
                        <FormLabel>Bank Account Number</FormLabel>
                        <Input
                          {...field}
                          placeholder="your bank account number"
                        />
                      </FormControl>
                    )}
                  </Field>
                  <Field name="sort_code">
                    {({ field, form }: { field: any; form: any }) => (
                      <FormControl isRequired>
                        <FormLabel>Bank Code</FormLabel>
                        <Input {...field} placeholder="your bank code" />
                      </FormControl>
                    )}
                  </Field>
                  <Field name="document_number">
                    {({ field, form }: { field: any; form: any }) => (
                      <FormControl isRequired>
                        <FormLabel>ID Number</FormLabel>
                        <Input {...field} placeholder="your id number" />
                      </FormControl>
                    )}
                  </Field>
                  <Field name="password">
                    {({ field, form }: { field: any; form: any }) => (
                      <FormControl isRequired>
                        <FormLabel>Password</FormLabel>
                        <InputGroup>
                          <Input
                            {...field}
                            placeholder="your password"
                            type={showPassword ? "text" : "password"}
                          />
                          <InputRightElement>
                            <Button
                              size="sm"
                              onClick={() => {
                                setShowPassword(!showPassword);
                              }}
                            >
                              {showPassword ? "Hide" : "Show"}
                            </Button>
                          </InputRightElement>
                        </InputGroup>
                      </FormControl>
                    )}
                  </Field>
                  <Button
                    mt={4}
                    colorScheme="red"
                    isLoading={props.isSubmitting}
                    type="submit"
                  >
                    Sign Up
                  </Button>
                </Form>
              )}
            </Formik>
          )}
          <Text marginTop={10}>
            {"Already have an account? "}
            <Text display="inline" as="u" color="#A5315B">
              <Link to="/login">Log in</Link>
            </Text>
          </Text>
        </Grid>
        <Spacer></Spacer>
      </Flex>
    </ChakraProvider>
  );
};

export default SignUp;
