import {
  FormControl,
  FormLabel,
  Input,
  ChakraProvider,
  theme,
  Grid,
  Flex,
  Spacer,
  Button,
  InputGroup,
  InputLeftElement,
  Heading
} from '@chakra-ui/react'
import { Field, Form, Formik } from 'formik'
import { useState } from 'react';

const Issue = ({ email }: { email: string }) => {

  const [issueSuccess, setIssueSuccess] = useState(false)
  const [dataReturned, setDataReturned] = useState(false)

  if (dataReturned && issueSuccess) {
    return (
      <ChakraProvider theme={theme}>
        <Flex textAlign="center" fontSize="xl">
          <Heading textAlign='center'>
            Success!
          </Heading>
        </Flex>
      </ChakraProvider>
    )
  } else if (dataReturned && !issueSuccess) {
    return (
      <ChakraProvider theme={theme}>
        <Flex textAlign="center" fontSize="xl">
          <Heading textAlign='center'>
            Failure!
          </Heading>
        </Flex>
      </ChakraProvider>
    )
  } else {
    return (
      <ChakraProvider theme={theme}>
        <Flex textAlign="center" fontSize="xl">
          <Spacer></Spacer>
          <Grid maxH="100%" maxW="60%" p={3}>
            <Formik
              initialValues={{ email: email, amount_in_rands: "" }}
              onSubmit={(values, actions) => {
                setTimeout(() => {
                  fetch('/api/issue', {
                    method: "POST",
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(values, null, 2)
                  })
                    .then((res) => res.json())
                    .then((data) => {
                      if (data["status"] == "success") {
                        setIssueSuccess(true)
                      }
                      setDataReturned(true)
                    })
                  actions.setSubmitting(false)
                }, 1000)
              }}
            >
              {(props) => (
                <Form>
                  <Field name='amount_in_rands'>
                    {({ field, form }: { field: any, form: any }) => (
                      <FormControl>
                        <FormLabel>Amount of RAND to exchange</FormLabel>
                        <InputGroup>
                          <InputLeftElement
                            pointerEvents='none'
                            color='gray.300'
                            fontSize='1.2em'
                            children='R'
                          />
                          <Input {...field} placeholder='enter amount here' />
                        </InputGroup>
                      </FormControl>
                    )}
                  </Field>
                  <Button
                    mt={4}
                    colorScheme='teal'
                    isLoading={props.isSubmitting}
                    type='submit'
                  >
                    Submit
                  </Button>
                </Form>
              )}
            </Formik>
          </Grid>
          <Spacer></Spacer>
        </Flex>
      </ChakraProvider>
    )
  }
}

export default Issue;
