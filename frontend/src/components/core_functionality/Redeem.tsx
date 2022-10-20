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

const Redeem = () => {
  return (
    <ChakraProvider theme={theme}>
      <Flex textAlign="center" fontSize="xl">
        <Spacer></Spacer>
        <Grid maxH="100%" maxW="60%" p={3}>
          <Formik
            initialValues={{}}
            onSubmit={(values, actions) => {
              setTimeout(() => {
                alert(JSON.stringify(values, null, 2))
                fetch('/api/login', {
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
                <Field name='amount'>
                  {({ field, form }: { field: any, form: any }) => (
                    <FormControl>
                      <FormLabel>Amount of Stablecoin you want to redeem</FormLabel>
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

export default Redeem;