import * as React from 'react';
import { Button, Card, Col } from 'react-bootstrap';
import { Nft } from '@metaplex-foundation/js';

export interface INFTCardProps {
    nft: any
}

export default function NFTCard (props: INFTCardProps) {
    return (
      <Col xs='12' md='6' lg='4' className='py-3'>
        <Card className="shadow">
            <Card.Img variant="top" src={props.nft.external_url ? props.nft.external_url : ""}/>
            <Card.Body>
                <Card.Title>{props.nft.name ? props.nft.name : "No Name"}</Card.Title>
                <Card.Text>
                {props.nft.description ? props.nft.description : "No descrption"}
                </Card.Text>
                <Button href={props.nft.external_url ? props.nft.external_url : ""}
                        target="_blank" 
                        variant="primary">
                    Go to source
                </Button>
            </Card.Body>
        </Card>
      </Col>
    );
}


// import { Nft } from '@metaplex-foundation/js';
// import * as React from 'react';
// import { Card } from 'react-bootstrap';

// export interface INFTCardProps {
//     nft : Nft
// }

// export default class NFTCard extends React.Component<INFTCardProps> {
//     public render() {
//         return (
//           <Card className="shadow">
//               <Card.Img variant="top" src={props.external_url ? props.external_url : ""}/>
//               <Card.Body>
//                   <Card.Title>{props.name ? props.name : "No Name"}</Card.Title>
//                   <Card.Text>
//                   {props.description ? props.description : "No descrption"}
//                   </Card.Text>
//                   <Button href={props.external_url ? props.external_url : ""}
//                           target="_blank" 
//                           variant="primary">
//                       Go to source
//                   </Button>
//               </Card.Body>
//           </Card>
//     );
//     }
// }
