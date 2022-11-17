import { Grid } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import React from "react";
import AuditHeader from "./AuditHeader";
import TransactionTable from "./TransactionTable";

const AuditPage = () => {
  const [transactions, setTransactions] = React.useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/audit/transactions", { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data["transactions"]);
        setIsLoaded(true);
      });
  }, []);

  const gradientSetting = `linear(to-br, white, rcoinBlue.500)`;

  return (
    <Grid gap={1} bgGradient={gradientSetting}>
      <AuditHeader />
      <TransactionTable transactions={transactions} isLoaded={isLoaded} />
    </Grid>
  );
};

export default AuditPage;
