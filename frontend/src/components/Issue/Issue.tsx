import {
  FormControl,
  FormLabel,
  Heading,
  Input,
  Button,
  InputGroup,
  InputLeftElement,
  ChakraProvider,
  theme,
  Grid,
  Flex,
  Spacer,
  NumberInput,
  Hide,
  Show,
  NumberInputField,
  Text
} from '@chakra-ui/react'
import { Field, Form, Formik } from 'formik'
import { useState } from 'react';
import { PaystackButton } from 'react-paystack';
import '../../main.css'
import IssueDetails from './IssueDetails';

const Issue = () => {

  const [amount, setAmount] = useState(0)

  const format_input = (s: string) => {
    const val: number = parseInt(s)
    if (val >= 0) {
      return val
    }

    return 0
  }

  const format_output = (val: number) => val

  return (
    <ChakraProvider theme={theme}>
      <Flex textAlign="center" fontSize="xl">
        <Spacer></Spacer>
        <Grid maxH="100%" maxW="60%" p={3}>
          <NumberInput
            onChange={(input: string) => setAmount(format_input(input))}
            value={format_output(amount)}
            isInvalid={amount < 10}

          >
            <NumberInputField placeholder='Amount (Rcoin)' />
          </NumberInput>
          <IssueDetails amount={amount}></IssueDetails>


        </Grid>
        <Spacer></Spacer>
      </Flex>
    </ChakraProvider >
  )
}

export default Issue;
