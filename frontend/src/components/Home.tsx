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
            message={"Safely purchase Stablecoin with your bank card using stripe. Your balance will update liveThe transaction will then be on the blockchain updating your balance live."} />
          <TradePage pageName={"Trade"} title={"Trade Stablecoin with others"} colour={'blue'} link={"issue"}
            message={"Enter the address of any other user of stablecoin and select the amount you want to send. With the transaction on the blockchain the fees will be much lower than traditional transfer methods."} />
          <IssuePage pageName={"Redeem"} title={"From Stablecoin back to ZAR"} colour={'green'} link={"redeem"}
            image="https://images.pexels.com/photos/8555256/pexels-photo-8555256.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            message={"Since we have a live auditable system you can be assured you can always redeem your Stablecoin to ZAR. The amount will be transferred into your bank account immediately."} />
        </Grid>
      </Box>
    </ChakraProvider>
  )
}

export default Home;