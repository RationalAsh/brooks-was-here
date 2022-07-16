import * as React from 'react';
import { Button, Container, Modal, Navbar } from 'react-bootstrap';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useState } from 'react';

interface INavigationBarProps {
}

const NavigationBar: React.FunctionComponent<INavigationBarProps> = (props) => {
  const [showAboutModal, setShowAboutModal] = useState(false);

  return (
    <>
    <Navbar bg="dark" expand="lg" variant="dark">
        <Container>
            <Navbar.Brand href="#home">Useless NFT Generator</Navbar.Brand>
            <Button variant="dark" onClick={() => {setShowAboutModal(true)}}>About</Button>
            <WalletMultiButton />
        </Container>
    </Navbar>
    <Modal show={showAboutModal} fullscreen={true} onHide={() => setShowAboutModal(false)}>
        <Modal.Header closeButton>
            <Modal.Title>About</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <h4> What does this app do? </h4>
            This is a React app that mints mostly useless NFTs on the Solana network. 
            I built this app to learn how to work with React and the Solana blockchain.
            <h4> How do I use the app?</h4> 
            Connect your phantom wallet and enter a name for your new NFT and click mint. 
            The app will mint a new NFT with the name that you gave it. Currently, the name is the only thing you can 
            customize about the NFT. Check back later for more features.
        </Modal.Body>
    </Modal>
    </>
  );
};

export default NavigationBar;
