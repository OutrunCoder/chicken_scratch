import { useState } from "react";
import { Button, Form, Row } from "react-bootstrap";

const BuyTokens = ({ provider, price, crowdContract, setIsLoading }) => {
  const [purchaseQty, setPurchaseQty] = useState('0');


  const buyHandler = async(e) => {
    e.preventDefault();
    console.log(`>> BUYING ${purchaseQty} TOKENS...`);
  };

  return (
    <Form onSubmit={buyHandler} style={{ maxWidth: '800px', margin: '50px auto' }}>
      <Form.Group as={Row}>
          <Form.Control
            type="number"
            placeholder="Enter amount"
            className="my-4"
            onChange={(e) => setPurchaseQty(e.target.value)}/>
          <Button variant="primary" type="submit" style={{ width: '100%' }}>
            Buy Tokens
          </Button>
      </Form.Group>
    </Form>
  );
};

export default BuyTokens;