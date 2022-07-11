import React, { useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, SystemProgram, Transaction, ConfirmOptions } from '@solana/web3.js';
import { FC, useCallback } from 'react';
import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";
import { createInitializeMintInstruction, createMint, getMinimumBalanceForRentExemptAccount, MINT_SIZE, TOKEN_PROGRAM_ID } from '@solana/spl-token';

type Props = {}

export interface NFTData {

}

export default function MarkMaker({}: Props) {
    // Get the wallet adapter state hooks.
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const [ nftMessage, setNFTMessage ] = useState("");

    // Function to mint the NFT. 
    // Since the wallet adapter does not work nicely with metaplex and spl-token yet, 
    // we manually combine the code from both the libraries:
    // https://github.com/solana-labs/solana-program-library/blob/48fbb5b7/token/js/src/actions/createMint.ts#L29
    // https://github.com/solana-labs/solana-web3.js/blob/e3dc440/src/util/send-and-confirm-transaction.ts#L18
    async function mintNFT() {
        // Setup the function parameters to mint an NFT.
        const lamports = await getMinimumBalanceForRentExemptAccount(connection);
        const programId = TOKEN_PROGRAM_ID;
        const keypair = Keypair.generate();
        const freezeAuthority = null;
        const decimals = 0; // Since we're making an NFT, the decimals are zero.
        
        if (!publicKey) {

        } else {

            // Set up the transaction to mint a new NFT.
            const transaction = new Transaction().add(
                SystemProgram.createAccount({
                    fromPubkey: publicKey,
                    newAccountPubkey: keypair.publicKey,
                    space: MINT_SIZE,
                    lamports,
                    programId,
                }),
                createInitializeMintInstruction(
                    keypair.publicKey, 
                    decimals, 
                    publicKey, 
                    freezeAuthority, 
                    programId
                )
            );
            
            // Send the transaction
            const signature = await sendTransaction(transaction, connection);

            // Get the latest block hash
            const latestBlockHash = await connection.getLatestBlockhash();

            // Use this to confirm the transaction
            await connection.confirmTransaction(
                { blockhash: latestBlockHash.blockhash,
                  lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
                  signature: signature
                }
            );
        }
    }
    
    // Create a memoized callback to the minting function that only changes
    // if the wallet details or the connection changes.
    const onMintRequested = useCallback(mintNFT, [publicKey, sendTransaction, connection]);

    return (
    <Container fluid="sm" className="px-2 py-2">
        <Form as={Row} className="mb-3">
            <Col sm={9}>
            <Form.Control className="shadow" size="lg" type="text" placeholder="So was Red" />
            </Col>
            <Col sm={2}>
            <Button variant="primary" type="submit" size="lg" className="shadow">
                Write
            </Button>
            </Col>
        </Form>
    </Container>
    )
}