import {
  ChakraProvider,
  Box,
  Grid,
  theme,
} from "@chakra-ui/react"

import IssuePage from "./IssuePage"
import TradePage from "./TradePage"
import Welcome from "../components/Welcome"


const Home = () => {
  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3}>
          <IssuePage pageName={"Issue"} title={"From ZAR to our Stablecoin"} colour={'red'} link={"issue"}
            image="https://images.pexels.com/photos/4482896/pexels-photo-4482896.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            message={"Securely purchase RCoin with your bank card using Paystack. Your balance will update live with the corresponding anonymised transaction being visible on the audit page."} />
          <TradePage pageName={"Trade"} title={"Trade Stablecoin with others"} colour={'blue'} link={"issue"}
            message={"Enter the email address of any RCoin account owner and specify the amount you want to send. Harnessing the power of a decentralised blockchain, the fees are much lower than traditional transfer methods."} />
          <IssuePage pageName={"Redeem"} title={"From Stablecoin back to ZAR"} colour={'yellow'} link={"redeem"}
            image="https://images.pexels.com/photos/8555256/pexels-photo-8555256.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            message={"You can be assured that you can always redeem your RCoin to ZAR due to our live auditing. The amount will be transferred into your bank account immediately."} />
        </Grid>
      </Box>
    </ChakraProvider>
  )
}

export default Home;