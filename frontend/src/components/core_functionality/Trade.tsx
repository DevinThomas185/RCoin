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
import { PhantomSigner } from '../phantom/Phantom';

const Trade = ({ email }: { email: string }) => {

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
              initialValues={{ sender_email: email, recipient_wallet: "", coins_to_transfer: "" }}
              onSubmit={(values, actions) => {
                setTimeout(() => {
                  // alert(JSON.stringify(values, null, 2))
                  fetch('/api/trade', {
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
                  <Field name='recipient_wallet'>
                    {({ field, form }: { field: any, form: any }) => (
                      <FormControl>
                        <FormLabel>Wallet of receiver</FormLabel>
                        <Input {...field} placeholder='enter wallet here' />
                      </FormControl>
                    )}
                  </Field>
                  <Field name='coins_to_transfer'>
                    {({ field, form }: { field: any, form: any }) => (
                      <FormControl>
                        <FormLabel>Amount of Stablecoin you want to send</FormLabel>
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
          }
        </Grid>
        <Spacer></Spacer>
      </Flex>
    </ChakraProvider>
  )
}

export default Trade;
