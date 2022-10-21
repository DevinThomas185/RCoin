import {
  ChakraProvider,
  Box,
  Grid,
  theme,
} from "@chakra-ui/react"
import Welcome from "../components/Welcome"

const Home = ({email, isAuth}: {email: string, isAuth: boolean}) => {
  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3}>
          <Welcome email={email} isAuth={isAuth}/>
        </Grid>
      </Box>
    </ChakraProvider>
  )
}

export default Home;