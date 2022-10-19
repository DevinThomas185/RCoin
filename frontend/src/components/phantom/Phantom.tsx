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
            const byteArray: number[] = []; // from backend
            var data = new Uint8Array(byteArray);
            const transaction = Transaction.from(data);
            transaction.recentBlockhash = blockhash;
            // (provider as any).signAndSendTransaction()

            // Request signature from phantom
            const { signature } = await phantomProvider.signAndSendTransaction(
                transaction
            );
            console.log(signature);
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

export default PhantomSigner
