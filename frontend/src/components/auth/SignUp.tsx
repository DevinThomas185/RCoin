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
  InputGroup
} from '@chakra-ui/react'
import { Field, Form, Formik } from 'formik'
import { useState } from 'react'
import { PhantomSigner } from '../phantom/Phantom'
const SignUp = () => {

  const [readyToSign, setReadyToSign] = useState(false)
  const [transactionBytes, setTransactionBytes] = useState([])
  const [showPassword, setShowPassword] = useState(false)

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
              bank_account: "",
              sort_code: "",
              wallet_id: ""
            }}
            onSubmit={(values, actions) => {
              setTimeout(() => {
                // alert(JSON.stringify(values, null, 2))
                fetch('/api/signup', {
                  method: "POST",
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(values, null, 2)
                })
                .then((res) => res.json())
                .then((data) => {
                  setTransactionBytes(data.transaction_bytes)
                  setReadyToSign(true)

                })
                actions.setSubmitting(false)
              }, 1000)
            }}
          >
            {(props) => (
              <Form>
                <Field name='first_name'>
                  {({ field, form }: { field: any, form: any }) => (
                    <FormControl isRequired>
                      <FormLabel>First name</FormLabel>
                      <Input {...field} placeholder='your first name' />
                    </FormControl>
                  )}
                </Field>
                <Field name='last_name'>
                  {({ field, form }: { field: any, form: any }) => (
                    <FormControl isRequired>
                      <FormLabel>Last name</FormLabel>
                      <Input {...field} placeholder='your last name' />
                    </FormControl>
                  )}
                </Field>
                <Field name='wallet_id'>
                  {({ field, form }: { field: any, form: any }) => (
                    <FormControl isRequired>
                      <FormLabel>Wallet ID</FormLabel>
                      <Input {...field} placeholder='your wallet ID' />
                    </FormControl>
                  )}
                </Field>
                <Field name='email'>
                  {({ field, form }: { field: any, form: any }) => (
                    <FormControl isRequired>
                      <FormLabel>Email</FormLabel>
                      <Input {...field} placeholder='your email address' />
                    </FormControl>
                  )}
                </Field>
                <Field name='password'>
                  {({ field, form }: { field: any, form: any }) => (
                    <FormControl isRequired>
                      <FormLabel>Password</FormLabel>
                      <InputGroup>
                        <Input {...field} placeholder='your password' type={showPassword ? 'text' : 'password'} />
                        <InputRightElement>
                          <Button size='sm' onClick={() => {setShowPassword(!showPassword)}}>
                            {showPassword ? "Hide" : "Show"}
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                    </FormControl>
                  )}
                </Field>
                <Button
                  mt={4}
                  colorScheme='red'
                  isLoading={props.isSubmitting}
                  type='submit'
                >
                  Sign Up
                </Button>
              </Form>
            )}
          </Formik>
          }
        </Grid>
        <Spacer></Spacer>
      </Flex>
    </ChakraProvider>
  )
}

export default SignUp;