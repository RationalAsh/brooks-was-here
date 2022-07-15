import React, { useEffect, useRef, useState } from 'react'
import { Button, Card, CardGroup, Col, Container, Form, Row, Toast, ToastContainer } from 'react-bootstrap'
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, SystemProgram, Transaction, ConfirmOptions, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { FC, useCallback } from 'react';
import { Metaplex, keypairIdentity, Nft } from "@metaplex-foundation/js";
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
    const [walletNFTs, setWalletNFTs] = useState<Nft[]>([]);
    const [walletNFTMetaData, setWalletNFTMetadata] = useState<any[]>([])

    const metaplexRef = useRef(metaplex);

    const creatorList = []

    useEffect(() => {
        const fetchNFTs = async () => {
            const nftdata: Nft[] = await metaplex.nfts().findAllByOwner(publicKey);
            const metadatalst = await Promise.all(nftdata.map(async (item) => await (await fetch(item.uri)).json() ));
            console.log(nftdata);
            setWalletNFTs(nftdata);
            setWalletNFTMetadata(metadatalst);
        }

        fetchNFTs()
            .then(res => {
                console.log(walletNFTs);
                console.log(walletNFTMetaData);
            })
            .catch(err => {
                console.log(err);
            });

    }, [isMinting, publicKey])

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
    const NFTCardItem = ({props} : {props: any}) => {
        if (props) {
            return (
                <Col className="justify-content-md-center">
                <Card className="shadow">
                    <Card.Img variant="top" src={props.external_url ? props.external_url : ""}/>
                    <Card.Body>
                        <Card.Title>{props.name ? props.name : "No Name"}</Card.Title>
                        <Card.Text>
                        {props.description ? props.description : "No descrption"}
                        </Card.Text>
                        <Button variant="primary">Go somewhere</Button>
                    </Card.Body>
                </Card>
                </Col>
            )
        } else {
            return null
        }
    }

    return (
    <>
    <Container className="container-xs px-2 py-3">
        <Form>
            {/* Place to enter message and mint your own NFT */}
            <Row className="justify-content-md-center">
                <Col xs lg="6">
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
        </Form>
    </Container>
    {/* Place to display the messages that have been submitted so far. */}
    <Container fluid="md">
        <Row className="px-2 py-4 text-center">
            <Col><h1>Your Mints</h1></Col>
        </Row>
        <Row className="px-1 py-3">
            <CardGroup>
            { walletNFTMetaData.length === 0 ?
                null:
                walletNFTMetaData.map((nftItem, idx) => <NFTCardItem key={idx} props={nftItem}/>) }
            </CardGroup>
        </Row>
    </Container>
    </>
    )
}