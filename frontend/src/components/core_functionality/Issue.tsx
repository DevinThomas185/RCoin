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
  Button
} from '@chakra-ui/react'
import { Field, Form, Formik } from 'formik'
import { useState } from 'react';

const Issue = ({email}: {email: string}) => {

  return (
    <ChakraProvider theme={theme}>
      <Flex textAlign="center" fontSize="xl">
        <Spacer></Spacer>
        <Grid maxH="100%" maxW="60%" p={3}>
          <Formik
            initialValues={{"email": email}}
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
                  console.log(data)
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
                      <Input {...field} placeholder='enter amount here' />
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

export default Issue;
