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


            const requestOptions = {
                method: "GET",
            };

            fetch("/api/test_transaction", requestOptions)
             .then((res) => res.json())
                .then((data) => {
                    var transactionBytes: Uint8Array = new Uint8Array(
                        data.transaction_bytes
                    );
                    console.log(transactionBytes)
                    const transaction = Transaction.from(transactionBytes);
                    transaction.recentBlockhash = blockhash;

                    return phantomProvider.signAndSendTransaction(transaction);
                })
                .then((signature) => {
                    console.log(signature);
                });
        }
    };

    const  createTokenAccount = async () => {
        if (phantomProvider) {
            const network = "http://api.devnet.solana.com";
            const connection = new Connection(network);
            let blockhash = (await connection.getLatestBlockhash("finalized"))
                .blockhash;

            // let txhash = await connection.requestAirdrop(provider.publicKey!, 1e9);
            // console.log(`txhash: ${txhash}`);


            const requestOptions = {
                method: "GET",
                // Get this one from frontend
                owner_pubkey: "8PMmSSiBA8JS1KG37WSRZaLiASW8dqquJi3kmrg1HX6r"
            };

            fetch("/api/create_token_account", requestOptions)
             .then((res) => res.json())
                .then((data) => {
                  console.log(data)
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
    const issueTokens = async () => {
        if (phantomProvider) {
            const network = "http://api.devnet.solana.com";
            const connection = new Connection(network);
            let blockhash = (await connection.getLatestBlockhash("finalized"))
                .blockhash;

            // let txhash = await connection.requestAirdrop(provider.publicKey!, 1e9);
            // console.log(`txhash: ${txhash}`);


            const requestOptions = {
                method: "GET",
                requestor_pubkey: "8PMmSSiBA8JS1KG37WSRZaLiASW8dqquJi3kmrg1HX6r",
                amount: 3
            };

            fetch("/api/issue_tokens", requestOptions)
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


    const redeemTokens = async () => {
        if (phantomProvider) {
            const network = "http://api.devnet.solana.com";
            const connection = new Connection(network);
            let blockhash = (await connection.getLatestBlockhash("finalized"))
                .blockhash;

            // let txhash = await connection.requestAirdrop(provider.publicKey!, 1e9);
            // console.log(`txhash: ${txhash}`);


            const requestOptions = {
                method: "GET",
                requestor_pubkey: "8PMmSSiBA8JS1KG37WSRZaLiASW8dqquJi3kmrg1HX6r",
                amount: 3
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
                    <Button onClick={createTokenAccount}>
                        Create Token Account
                    </Button>
                    <Button onClick={redeemTokens}>
                        Redeem Tokens
                    </Button>
                    <Button onClick={issueTokens}>
                        Issue Tokens
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
