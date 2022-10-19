import { Box, Button } from "@chakra-ui/react";
import { useState } from "react";
import { usePhantom } from "../../hooks/Phantom";
import { PhantomProvider } from "../../types/Phantom";
import { Transaction, Connection } from "@solana/web3.js";

export const PhantomSigner = () => {
    const phantomProvider = usePhantom();

    //   console.log(phantomProvider);

    const [walletKey, setWalletKey] = useState<PhantomProvider | undefined>(
        undefined
    );

    const connectWallet = async () => {
        // @ts-ignore
        const { solana } = window;

        console.log(solana);

        if (solana) {
            try {
                const response = await solana.connect();
                console.log("wallet account ", response.publicKey.toString());
                setWalletKey(response.publicKey.toString());
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
    const signTransaction = async () => {
        if (phantomProvider) {
            const network = "http://api.devnet.solana.com";
            const connection = new Connection(network);
            let blockhash = (await connection.getLatestBlockhash("finalized"))
                .blockhash;

            // let txhash = await connection.requestAirdrop(provider.publicKey!, 1e9);
            // console.log(`txhash: ${txhash}`);

            // Decode transaction from backend
            //byteArray = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,2,5,88,136,61,56,255,3,19,225,124,184,129,70,14,56,226,77,35,231,196,97,74,254,16,116,63,238,96,42,93,47,213,195,6,27,246,117,60,44,169,145,62,173,91,70,173,221,228,137,59,40,9,171,247,152,188,169,152,153,205,104,239,185,206,2,226,204,14,94,197,224,149,121,31,6,227,220,152,245,60,73,159,247,103,83,13,218,203,95,246,184,57,40,217,113,56,45,6,221,246,225,215,101,161,147,217,203,225,70,206,235,121,172,28,180,133,237,95,91,55,145,58,140,245,133,126,255,0,169,82,207,124,15,142,43,230,101,208,173,27,0,243,200,197,159,54,18,255,58,171,40,82,190,63,105,82,100,205,157,156,177,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,3,4,2,4,1,0,10,12,0,202,154,59,0,0,0,0,9]

            const requestOptions = {
                method: "GET",
            };

            fetch("/api/test_transaction", requestOptions)
                .then((res) => res.json())
                .then((data) => {
                    var transactionBytes: Uint8Array = new Uint8Array(
                        data.transaction_bytes
                    );
                    const transaction = Transaction.from(transactionBytes);
                    transaction.recentBlockhash = blockhash;

                    return phantomProvider.signAndSendTransaction(transaction);
                })
                .then((signature) => {
                    console.log(signature);
                });
        }
    };

    return (
        <>
            {phantomProvider && !walletKey && (
                <Button onClick={connectWallet}>
                    Connect to Phantom Wallet
                </Button>
            )}

            {phantomProvider && walletKey && (
                <Box>
                    <>Connected account {walletKey}</>
                    <Button onClick={signTransaction}>
                        Sign test transaction
                    </Button>
                </Box>
            )}

            {!phantomProvider && (
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
    );
};
