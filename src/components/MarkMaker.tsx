import React from 'react'
import { Col, Container, Form, Row } from 'react-bootstrap'
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, SystemProgram, Transaction } from '@solana/web3.js';
import { FC, useCallback } from 'react';

type Props = {}


export default function MarkMaker({}: Props) {
    // Get the wallet adapter state hooks.
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    return (
    <Container fluid="sm" className="px-2 py-2">
        <Row>
            <Col>
            <Form>
                <Form.Control className="shadow" size="lg" type="text" placeholder="So was Red">

                </Form.Control>
            </Form>
            </Col>
        </Row>
    </Container>
    )
}