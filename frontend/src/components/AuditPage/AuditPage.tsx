import { Grid } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import React from "react";
import AuditHeader from "./AuditHeader";
import TransactionTable from "./TransactionTable";

const AuditPage = () => {
  const [transactions, setTransactions] = React.useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [firstQueryTime, setFirstQueryTime] = useState(Date.now());

  useEffect(() => {
    fetch("/api/audit/transactions", { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        setFirstQueryTime(Date.now());
        setTransactions(data["transactions"]);
        setIsLoaded(true);
      });
  }, []);

  const handleTransactionTableScroll = (e: any) => {
    const hasReachedBottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        {
          offset: transactions.length,
          limit: 10,
          first_query_time: firstQueryTime,
        },
        null,
        2
      ),
    };
    if (hasReachedBottom) {
      fetch("/api/audit/more_transactions", requestOptions)
        .then((res) => res.json())
        .then((data) => {
          setTransactions(transactions.concat(data["transactions"]));
          setIsLoaded(true);
        });
    }
  };

  const gradientSetting = `linear(to-br, white, rcoinBlue.400)`;

  return (
    <Grid gap={1} bgGradient={gradientSetting}>
      <AuditHeader />
      <TransactionTable
        transactions={transactions}
        isLoaded={isLoaded}
        onScroll={handleTransactionTableScroll}
      />
    </Grid>
  );
};

export default AuditPage;
