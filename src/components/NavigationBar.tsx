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
        <Modal.Body>Information about this project.</Modal.Body>
    </Modal>
    </>
  );
};

export default NavigationBar;
