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
const SignUp = () => {

  return (
    <ChakraProvider theme={theme}>
      <Flex textAlign="center" fontSize="xl">
        <Spacer></Spacer>
        <Grid maxH="100%" maxW="60%" p={3}>
          <Formik
            initialValues={{
              bank_account: "",
              sort_code: "",
              wallet_id: ""
            }}
            onSubmit={(values, actions) => {
              setTimeout(() => {
                alert(JSON.stringify(values, null, 2))
                fetch('/api/signup', {
                  method: "POST",
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(values, null, 2)
                })
                  .then(response => alert(response.status))
                actions.setSubmitting(false)
              }, 1000)
            }}
          >
            {(props) => (
              <Form>
                <Field name='first_name'>
                  {({ field, form }: { field: any, form: any }) => (
                    <FormControl>
                      <FormLabel>First name</FormLabel>
                      <Input {...field} placeholder='your first name' />
                    </FormControl>
                  )}
                </Field>
                <Field name='last_name'>
                  {({ field, form }: { field: any, form: any }) => (
                    <FormControl>
                      <FormLabel>Last name</FormLabel>
                      <Input {...field} placeholder='your last name' />
                    </FormControl>
                  )}
                </Field>
                <Field name='email'>
                  {({ field, form }: { field: any, form: any }) => (
                    <FormControl>
                      <FormLabel>Email</FormLabel>
                      <Input {...field} placeholder='your email address' />
                    </FormControl>
                  )}
                </Field>
                <Field name='password'>
                  {({ field, form }: { field: any, form: any }) => (
                    <FormControl>
                      <FormLabel>Password</FormLabel>
                      <Input {...field} placeholder='your password' type='password' />
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

export default SignUp;