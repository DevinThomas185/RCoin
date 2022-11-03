import { Box, Button, Spinner } from "@chakra-ui/react";
import { useState } from "react";
import { usePhantom } from "../../hooks/Phantom";
import { PhantomProvider } from "../../types/Phantom";
import { Transaction, Connection } from "@solana/web3.js";
import { Success } from "../Success";

export const PhantomSigner = ({
  transactionBytes,
  redirect,
  setSignedTransaction,
  setPopupMessage,
  setPopupVisible,
}: {
  transactionBytes: number[];
  redirect: string;
  setSignedTransaction?: React.Dispatch<
    React.SetStateAction<Transaction | null>
  >;
  setPopupMessage?: React.Dispatch<React.SetStateAction<string>>;
  setPopupVisible?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const phantomProvider = usePhantom();

  const [walletKey, setWalletKey] = useState<PhantomProvider | undefined>(
    undefined
  );

  // We need to bake in what happens when it fails also, next iteration!!
  const [transactionSuccess, setTransactionSuccess] = useState(false);
  const [pending, setPending] = useState(false);

  const connectWallet = async () => {
    // @ts-ignore
    const { solana } = window;

    if (solana) {
      try {
        const response = await solana.connect();
        console.log("wallet account ", response.publicKey.toString());
        setWalletKey(response.publicKey.toString());
        if (setPopupVisible != null) {
          setPopupVisible(false);
        }
      } catch (err) {
        // { code: 4001, message: 'User rejected the request.' }
      }
    }
  };

  const disconnectWallet = async () => {
    // @ts-ignore
    const { solana } = window;

    if (walletKey && solana) {
      await (solana as PhantomProvider).disconnect();
      setWalletKey(undefined);
    }
  };

  const sign = async () => {
    if (phantomProvider) {
      const network = "http://api.devnet.solana.com";
      const connection = new Connection(network);

      // let txhash = await connection.requestAirdrop(provider.publicKey!, 1e9);
      // console.log(`txhash: ${txhash}`);

      const transaction = Transaction.from(new Uint8Array(transactionBytes));

      const blockhash = (await connection.getLatestBlockhash("finalized"))
        .blockhash;

      transaction.recentBlockhash = blockhash;

      // We do not want to sign and send so set state and return
      if (setSignedTransaction) {
        const signedTransaction = await phantomProvider.signTransaction(
          transaction
        );

        setSignedTransaction(signedTransaction);
        return;
      }

      setPending(true);
      const signature = await phantomProvider.signAndSendTransaction(
        transaction
      );
      setPending(false);
      // ensure it is actually true later
      setTransactionSuccess(true);
      if (setPopupVisible != null && setPopupMessage != null) {
        setPopupMessage("Transaction signed successfully");
        setPopupVisible(true);
      }
      console.log(signature);
    }
  };

  return (
    <>
      {pending ? (
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      ) : (
        <>
          {transactionSuccess && <Success timeout={3000} redirect={redirect} />}

          {phantomProvider && !walletKey && !transactionSuccess && (
            <Button onClick={connectWallet}>Connect to Phantom Wallet</Button>
          )}

          {phantomProvider && walletKey && !transactionSuccess && (
            <Button onClick={sign}>Sign Transaction</Button>
          )}

          {!phantomProvider && !transactionSuccess && (
            <p>
              No provider found
              <Button
                onClick={() => {
                  window.open("https://phantom.app/", "_blank");
                }}
              >
                Install Phantom Browser extension
              </Button>
            </p>
          )}
        </>
      )}
    </>
  );
};
