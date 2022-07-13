import * as React from 'react';
import { Container, Navbar } from 'react-bootstrap';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';

interface INavigationBarProps {
}

const NavigationBar: React.FunctionComponent<INavigationBarProps> = (props) => {
  return (
    <Navbar bg="dark" expand="lg" variant="dark">
        <Container>
            <Navbar.Brand href="#home">Brooks Was Here</Navbar.Brand>
            <WalletMultiButton />
        </Container>
    </Navbar>
  );
};

export default NavigationBar;
