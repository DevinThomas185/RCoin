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
  InputRightElement
} from '@chakra-ui/react'
import { useNavigate } from "react-router-dom"
import { Field, Form, Formik } from 'formik'
import { useState } from 'react';
const Login = ({setIsAuth, setEmail}: {setIsAuth: React.Dispatch<React.SetStateAction<boolean>>, setEmail: React.Dispatch<React.SetStateAction<string>>}) => {

  setIsAuth(false)
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  
  return (
    <ChakraProvider theme={theme}>
      <Flex textAlign="center" fontSize="xl">
        <Spacer></Spacer>
        <Grid maxH="100%" maxW="60%" p={3}>
          <Formik
            initialValues={{}}
            onSubmit={(values, actions) => {
              setTimeout(() => {
                fetch('/api/login', {
                  method: "POST",
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(values, null, 2)
                })
                  .then(response => {
                    if (response.status === 200) {
                      setIsAuth(true)
                      setIsInvalid(false)
                      setEmail((values as any).email)
                      navigate('/')
                    } else {
                      setIsAuth(false)
                      setIsInvalid(true)
                    }
                  })
                actions.setSubmitting(false)
              }, 1000)
            }}
          >
            {(props) => (
              <Form>
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
                      <InputGroup>
                        <Input {...field} placeholder='your password' type={showPassword ? "text" : "password"} isInvalid={isInvalid} />
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
                  Log In
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

export default Login;