import { Box } from "@chakra-ui/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Success = ({
  timeout,
  redirect,
}: {
  timeout: number;
  redirect: string;
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate(redirect);
    }, timeout);
  }, []);
  return <Box>Successful</Box>;
};
