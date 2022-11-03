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
} from '@chakra-ui/react'
import { Field, Form, Formik } from 'formik'
import { useState } from 'react';
import { PopupAlert } from '../Alerts/PopupAlert';

const Issue = () => {

  const [issueSuccess, setIssueSuccess] = useState(false)
  const [isPopupVisible, setPopupVisible] = useState(false)
  const [popupMessage, setPopupMessage] = useState("")
  //Add ability to view the successful transaction on the blockchain
  const [transactionSignature, setTransactionSignature] = useState("")

  return (
    <ChakraProvider theme={theme}>
      <Flex textAlign="center" fontSize="xl">
        <Spacer></Spacer>
          <Grid maxH="100%" maxW="60%" p={3}>
          {isPopupVisible &&
            <PopupAlert
              isVisible={isPopupVisible}
              setVisible={setPopupVisible}
              isSuccessful={issueSuccess}
              alertMessage={popupMessage}
            ></PopupAlert>}
            <Formik
              initialValues={{ amount_in_rands: "" }}
              onSubmit={(values, actions) => {
                setPopupVisible(false)
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
                      if (data["success"]) {
                        setIssueSuccess(true)
                        setTransactionSignature(data["transaction_signature"])
                        setPopupMessage("Transaction completed successfully")
                      } else {
                        setIssueSuccess(false)
                        setPopupMessage(data["exception"])
                      }
                      setPopupVisible(true)
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

export default Issue;
