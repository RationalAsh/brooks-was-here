import { useEffect, useRef, useState } from 'react'
import { Button, Card, CardGroup, Col, Container, Form, Modal, Row, Spinner, Toast, ToastContainer } from 'react-bootstrap'
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { Nft } from "@metaplex-foundation/js";
import { useMetaplex } from './useMetaplex';

type Props = {}

export interface NFTData {

}

export default function NFTMaker({}: Props) {
    // Get the wallet adapter state hooks.
    const { connection } = useConnection();
    const { publicKey, sendTransaction, wallet } = useWallet();
    const [ nftMessage, setNFTMessage ] = useState<string>("");
    const { metaplex } = useMetaplex() as any;
    const [isTextFocused, setIsTextFocused] = useState(false);
    const [ isMinting, setIsMinting ] = useState(false);
    const holdingWallet = new PublicKey("4Xqz6w6rLuzFrPUMo63HaRMaKgSjtGs7VsWh81XfJKqV");
    const [walletNFTs, setWalletNFTs] = useState<Nft[]>([]);
    const [walletNFTMetaData, setWalletNFTMetadata] = useState<any[]>([])
    const [validated, setValidated] = useState(false);
    const [mintingToast, setMintingToast] = useState(false);
    const [mintDoneToast, setMintDoneToast] = useState(false);
    const [showMintFailed, setShowMintFailedModal] = useState(false);
    

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

    }, [isMinting, publicKey, metaplex])

    // Function to mint the NFT.
    async function createNFT() {
        if (metaplex && publicKey) {
            setIsMinting(true);
            setMintingToast(true);
            try {
                console.log("https://us-central1-fig-leaf-capital.cloudfunctions.net/nft-metadata-function?" + (new URLSearchParams({name: nftMessage, creator: publicKey.toString()}).toString()))
                const response = await metaplex.nfts().create({
                    uri: "https://us-central1-fig-leaf-capital.cloudfunctions.net/nft-metadata-function?" + (new URLSearchParams({name: nftMessage, creator: publicKey.toString()}).toString()),
                    symbol: "BWH",
                });
                setIsMinting(false);
                setMintingToast(false);
                setMintDoneToast(true);
            } catch (error) {
                console.log(error);
                setIsMinting(false);
                setShowMintFailedModal(true);
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
                <Col xs='12' md='6' lg='4'>
                <Card className="shadow">
                    <Card.Img variant="top" src={props.external_url ? props.external_url : ""}/>
                    <Card.Body>
                        <Card.Title>{props.name ? props.name : "No Name"}</Card.Title>
                        <Card.Text>
                        {props.description ? props.description : "No descrption"}
                        </Card.Text>
                        <Button href={props.external_url ? props.external_url : ""}
                                target="_blank" 
                                variant="primary">
                            Go to source
                        </Button>
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
        <Form validated={validated}>
            {/* Place to enter message and mint your own NFT */}
            <Row className="justify-content-md-center">
                <Col xs lg="6">
                    <Form.Control className={ isTextFocused ? "shadow-lg" : "shadow" }
                                  size="lg" type="text" 
                                  placeholder="Name your NFT."
                                  onChange={ handleMessageChange } 
                                  onBlur={ onFocusOut } 
                                  onFocus={ onFocusIn }
                                  readOnly={ isMinting }
                                  required/>
                </Col>
                <Col xs lg="2">
                    <Button variant="primary" size="lg" 
                            className={ isTextFocused ? "shadow-lg" : "shadow" }
                            onClick={createNFT}
                            disabled={nftMessage.length === 0}>
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
        <Row className="px-1 py-3 justify-content-md-center">
            {/* <CardGroup className='justify-content-md-center'> */}
            { walletNFTMetaData.length === 0 ?
                (!publicKey ? "Connect a wallet to see your mints." : <Spinner animation="border"/>) :
                walletNFTMetaData.map((nftItem, idx) => <NFTCardItem key={idx} props={nftItem}/>) }
            {/* </CardGroup> */}
        </Row>
        <Row>
        <ToastContainer position="bottom-end" className="p-3">
            <Toast onClose={() => setMintingToast(false)} show={mintingToast} delay={5000} autohide={true}>
                <Toast.Header>
                <strong className="me-auto">Notification</strong>
                <small className="text-muted">just now</small>
                </Toast.Header>
                <Toast.Body>Mint started!</Toast.Body>
            </Toast>
            <Toast bg="success" onClose={() => setMintDoneToast(false)} show={mintDoneToast} delay={5000} autohide={true}>
                <Toast.Header>
                <strong className="me-auto">Notification</strong>
                <small className="text-muted">just now</small>
                </Toast.Header>
                <Toast.Body>Mint Done!</Toast.Body>
            </Toast>
            <Toast bg="danger" onClose={() => setShowMintFailedModal(false)} show={showMintFailed} delay={5000} autohide={true}>
                <Toast.Header>
                <strong className="me-auto">Notification</strong>
                <small className="text-muted">just now</small>
                </Toast.Header>
                <Toast.Body>Mint failed! Please try again.</Toast.Body>
            </Toast>
        </ToastContainer>
        </Row>
    </Container>
    </>
    )
}