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
            <Navbar.Brand href="#home">Useless NFT Minter</Navbar.Brand>
            <Button variant="dark" onClick={() => {setShowAboutModal(true)}}>About</Button>
            <WalletMultiButton />
        </Container>
    </Navbar>
    <Modal show={showAboutModal} fullscreen={true} onHide={() => setShowAboutModal(false)}>
        <Modal.Header closeButton>
            <Modal.Title>About</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p className='text-justify'>This is a React app that mints mostly useless NFTs on the Solana network. 
            I built this app to learn how to work with React and the Solana blockchain.
            Find out more <a href='https://ashwinnarayan.com/' target='_blank'>about me on my website</a>.</p>

            <h4> Minting Instructions </h4> 
            <p className='text-justify'>Connect your phantom wallet and enter a name for your new NFT and click mint. The solana network sometimes 
            has issues with throughput and minting might fail. If that happens, try minting again. Sometimes, the transaction
            request times out but the minting might succeed later. If you get a message about transaction timeouts, please wait 
            for a few minutes and reload the page or check your wallet to see if the NFT was minted.</p>

            <h4>Can I customize the image / description / symbol / other metadata? </h4>
            <p className='text-justify'>The app will mint a new NFT with the name you entered in the input form. The name is the only thing you can 
            customize about the NFT right now. Check back later for more features!</p>
        </Modal.Body>
    </Modal>
    </>
  );
};

export default NavigationBar;
