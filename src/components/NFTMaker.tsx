import React, { useEffect, useRef, useState } from 'react'
import { Button, Card, Col, Container, Form, Row, Toast, ToastContainer } from 'react-bootstrap'
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, SystemProgram, Transaction, ConfirmOptions, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { FC, useCallback } from 'react';
import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";
import { createInitializeMintInstruction, createMint, createTransferInstruction, getMinimumBalanceForRentExemptAccount, getOrCreateAssociatedTokenAccount, MINT_SIZE, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { setMaxListeners } from 'stream';
import { useMetaplex } from './useMetaplex';
import { execPath } from 'process';

type Props = {}

export interface NFTData {

}

function ToastMessage(message: string) {
    return (
        <ToastContainer className="p-3" position='bottom-center'>
        <Toast delay={3000} autohide>
        <Toast.Header>
            <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
            <strong className="me-auto">Bootstrap</strong>
            <small>11 mins ago</small>
        </Toast.Header>
        <Toast.Body>message</Toast.Body>
        </Toast>
        </ToastContainer>
    );
}

export default function NFTMaker({}: Props) {
    // Get the wallet adapter state hooks.
    const { connection } = useConnection();
    const { publicKey, sendTransaction, wallet } = useWallet();
    const [ nftMessage, setNFTMessage ] = useState("");
    const { metaplex } = useMetaplex() as any;
    const [isTextFocused, setIsTextFocused] = useState(false);
    const [ isMinting, setIsMinting ] = useState(false);
    const holdingWallet = new PublicKey("4Xqz6w6rLuzFrPUMo63HaRMaKgSjtGs7VsWh81XfJKqV");
    const [walletNFTs, setWalletNFTs] = useState([]);

    const metaplexRef = useRef(metaplex);

    const creatorList = []

    useEffect(() => {
        const fetchNFTs = async () => {
            const nftdata = await metaplex.nfts().findAllByOwner(holdingWallet);
            console.log(nftdata);
            setWalletNFTs(nftdata);
        }

        fetchNFTs()
            .then(res => {
                console.log(walletNFTs);
            })
            .catch(err => {
                console.log(err);
            });

    }, [isMinting])

    // Function to mint the NFT.
    async function createNFT() {
        if (metaplex && publicKey) {
            setIsMinting(true);
            try {
                console.log("https://us-central1-fig-leaf-capital.cloudfunctions.net/nft-metadata-function?" + (new URLSearchParams({name: nftMessage, creator: publicKey.toString()}).toString()))
                const response = await metaplex.nfts().create({
                    uri: "https://us-central1-fig-leaf-capital.cloudfunctions.net/nft-metadata-function?" + (new URLSearchParams({name: nftMessage, creator: publicKey.toString()}).toString()),
                    symbol: "BWH",
                });
                setIsMinting(false);
            } catch (error) {
                console.log(error);
                setIsMinting(false);
            }
        }
    }

    // Function to get all NFTs in account
    async function getRelevantNFTs() {
        const response = await metaplex.nfts().findAllByOwner(holdingWallet);
        console.log(response.filter((item:any) => item.symbol === "BWH"));
        return response
    }


    function handleMessageChange(event: any) {
        setNFTMessage(event.target.value);
    }

    function onFocusOut(event: any) {
        setIsTextFocused(false);
    }

    function onFocusIn(event: any) {
        setIsTextFocused(true);
    }

    // Component to display a line of the NFT.

    return (
    <>
    <Container className="container-xs px-2 py-2">
        <Form>
            {/* Place to enter message and mint your own NFT */}
            <Row className="justify-content-md-center">
                <Col xs lg="8">
                    <Form.Control className={ isTextFocused ? "shadow-lg" : "shadow" }
                                  size="lg" type="text" 
                                  placeholder="So was Red"
                                  onChange={ handleMessageChange } 
                                  onBlur={ onFocusOut } 
                                  onFocus={ onFocusIn }
                                  readOnly={ isMinting }/>
                </Col>
                <Col xs lg="2">
                    <Button variant="primary" size="lg" 
                            className={ isTextFocused ? "shadow-lg" : "shadow" }
                            onClick={createNFT}>
                        Mint!
                    </Button>
                </Col>
            </Row>
            {/* Place to display the messages that have been submitted so far. */}
        </Form>
    </Container>
    <Container>
        <Row className="px-2 py-3">
            <Col>
                <Card style={{ width: '18rem' }} className="shadow">
                <Card.Img variant="top" src="holder.js/100px180" />
                <Card.Body>
                    <Card.Title>Card Title</Card.Title>
                    <Card.Text>
                    Some quick example text to build on the card title and make up the
                    bulk of the card's content.
                    </Card.Text>
                    <Button variant="primary">Go somewhere</Button>
                </Card.Body>
                </Card>
            </Col>
        </Row>
    </Container>
    </>
    )
}

    // // Function to mint the NFT. 
    // // Since the wallet adapter does not work nicely with metaplex and spl-token yet, 
    // // we manually combine the code from both the libraries:
    // // https://github.com/solana-labs/solana-program-library/blob/48fbb5b7/token/js/src/actions/createMint.ts#L29
    // // https://github.com/solana-labs/solana-web3.js/blob/e3dc440/src/util/send-and-confirm-transaction.ts#L18
    // // https://github.com/longmengua/solana-frontend/blob/9231643fa85ff115404ad37f07453a3d47e160a1/solana/module/components/index/index.tsx
    // // https://stackoverflow.com/questions/70224185/how-to-transfer-custom-spl-token-by-solana-web3-js-and-solana-sol-wallet-ad
    // // https://solanacookbook.com/references/nfts.html#how-to-create-an-nft
    // async function mintNFT() {
    //     // Setup the function parameters to mint an NFT.
    //     const programId = TOKEN_PROGRAM_ID;
    //     const keypair = Keypair.generate();
    //     const freezeAuthority = null;
    //     const decimals = 9; // Since we're making an NFT, the decimals are zero.
    //     const lamports = await getMinimumBalanceForRentExemptAccount(connection);
    //     // const lamports = 0.01*LAMPORTS_PER_SOL;

    //     console.log(lamports);
        
    //     try {
    //         if (!publicKey) {
    //         } else {
    
    //             // Set up the transaction to mint a new NFT.
    //             const transaction = new Transaction().add(
    //                 SystemProgram.createAccount({
    //                     fromPubkey: publicKey,
    //                     newAccountPubkey: keypair.publicKey,
    //                     space: MINT_SIZE,
    //                     lamports,
    //                     programId,
    //                 }),
    //                 createInitializeMintInstruction(
    //                     keypair.publicKey, 
    //                     decimals, 
    //                     publicKey, 
    //                     publicKey, 
    //                     programId
    //                 )
    //             );
                
    //             // Send the transaction
    //             const signature = await sendTransaction(transaction, connection, {signers: [keypair]});
    
    //             // Get the latest block hash
    //             const latestBlockHash = await connection.getLatestBlockhash();
    
    //             // Use this to confirm the transaction
    //             await connection.confirmTransaction(
    //                 { blockhash: latestBlockHash.blockhash,
    //                   lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    //                   signature: signature
    //                 }
    //             );
    //         }

    //     } catch (error) {
    //         console.log(error);
    //     }
    // }