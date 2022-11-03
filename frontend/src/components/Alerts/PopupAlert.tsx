import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, CloseButton } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";

export const PopupAlert = ({
  isVisible,
  setVisible,
  isSuccessful,
  alertMessage
}: {
  isVisible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  isSuccessful: boolean;
  alertMessage: string
}) => {

  const onClose = () => {
    setVisible(false)
  }

  return (
    <>
    {isVisible && (
    <Alert status={(isSuccessful ? 'success' : 'error')}>
      <AlertIcon />
      <Box>
        <AlertTitle>{(isSuccessful ? 'Success!' : 'Failure!')}</AlertTitle>
        <AlertDescription>
          {alertMessage}
        </AlertDescription>
      </Box>
      <CloseButton
        alignSelf='flex-start'
        position='relative'
        right={-1}
        top={-1}
        onClick={onClose}
      />
    </Alert>)}
  </>
  );
}
