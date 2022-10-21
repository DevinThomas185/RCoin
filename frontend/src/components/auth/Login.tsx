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
import {useNavigate} from "react-router-dom"
import { Field, Form, Formik } from 'formik'
const Login = ({setIsAuth, setEmail}: {setIsAuth: React.Dispatch<React.SetStateAction<boolean>>, setEmail: React.Dispatch<React.SetStateAction<string>>}) => {

  const navigate = useNavigate();
  
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
                      setEmail((values as any).email)
                      navigate('/')
                    } else {
                      setIsAuth(false)
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
                      <Input {...field} placeholder='your password' type='password' />
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