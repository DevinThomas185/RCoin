import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Text,
  Grid,
  Image,
  HStack,
  Input,
  Spacer,
  useBreakpointValue,
  Flex,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { useState } from "react";
import { Link } from "react-router-dom";
import InformationPane from "../Common/InformationPane";

const AuditorSignupForm = () => {
  function validateInput(value: string) {
    let error;
    if (!value) {
      error = "Please enter a valid email address";
    }
    return error;
  }

  return (
    <Formik
      initialValues={{ email: "" }}
      onSubmit={(values, actions) => {
        setTimeout(() => {
          fetch("/api/add-auditor", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values, null, 2),
          }).then((res) => {
            if (!res.ok) {
              throw new Error("Auditor Signup Failed");
            }
            return res.json();
          });

          actions.setSubmitting(false);
        }, 1000);
      }}
    >
      {(props) => (
        <Form>
          <Grid
            padding="10px"
            width="100%"
            borderRadius="25px"
            bg="rcoinBlue.100"
          >
            <FormLabel marginLeft="10px">
              Enter your email address to send a request for an invitation.
            </FormLabel>
            <HStack>
              <Field name="email" validate={validateInput}>
                {({ field, form }: { field: any; form: any }) => (
                  <FormControl
                    isInvalid={form.errors.name && form.touched.name}
                  >
                    <Input
                      {...field}
                      borderRadius="25px"
                      bg="rcoinBlue.50"
                      placeholder="name@email.com"
                    />
                    <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Button
                width="150px"
                variant="reactive"
                isLoading={props.isSubmitting}
                type="submit"
                loadingText="Submitting"
              >
                Submit
              </Button>
            </HStack>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

const MobileAuditorSignupPage = () => {
  return (
    <Grid marginLeft="auto" marginRight="auto" p={3} gap={5}>
      <Grid
        bg="rcoinBlue.50"
        borderRadius="25px"
        maxWidth="1080px"
        padding="10px"
        alignItems="stretch"
        height="fit-content"
        gap={10}
      >
        <Box
          textAlign="left"
          fontSize="4xl"
          fontWeight="bold"
          color="rcoinBlue.600"
          marginLeft="10px"
        >
          Become An Auditor
        </Box>
        <Image justifySelf="center" src="paystack_big.png" width="200px" />
        <Box
          textAlign="left"
          fontSize="2xl"
          fontWeight="bold"
          color="rcoinBlue.700"
          marginLeft="10px"
        >
          Sign up to view our Paystack reserve account.
        </Box>
        <AuditorSignupForm />
      </Grid>
      <Box justifySelf="center">
        <Link to={"/audit"} onClick={() => window.scrollTo(0, 0)}>
          <Button variant="reactive" size="lg">
            Check our Audit
          </Button>
        </Link>
      </Box>
    </Grid>
  );
};

const DesktopAuditorSignupPage = () => {
  return (
    <InformationPane colour={"rcoinBlue.1000"}>
      <Grid
        bg="rcoinBlue.50"
        alignItems="flex-end"
        borderRadius="25px"
        maxWidth="1080px"
        maxHeight="350px"
        padding="10px"
      >
        <HStack height="100%" spacing={20}>
          <Grid alignItems="stretch" height="100%">
            <Box
              textAlign="left"
              fontSize="5xl"
              fontWeight="bold"
              color="rcoinBlue.600"
              marginLeft="10px"
            >
              Become An Auditor
            </Box>
            <Box
              textAlign="left"
              fontSize="3xl"
              fontWeight="bold"
              maxWidth="80%"
              color="rcoinBlue.700"
              marginLeft="10px"
            >
              Sign up to view our Paystack reserve account.
            </Box>
            <Box alignSelf="flex-end">
              <AuditorSignupForm />
            </Box>
          </Grid>
          <Grid height="100%">
            <Image
              marginTop="20px"
              marginRight="30px"
              src="paystack_big.png"
              width="300px"
            />
            <Box justifySelf="flex-end" alignSelf="flex-end">
              <Link to={"/audit"} onClick={() => window.scrollTo(0, 0)}>
                <Button variant="reactiveDark" size="lg">
                  Check our Audit
                </Button>
              </Link>
            </Box>
          </Grid>
        </HStack>
      </Grid>
    </InformationPane>
  );
};

const AuditorSignupPage = () => {
  const useMobileView = useBreakpointValue({
    base: true,
    md: false,
  });

  return useMobileView ? (
    <MobileAuditorSignupPage />
  ) : (
    <DesktopAuditorSignupPage />
  );
};

export default AuditorSignupPage;
