// FW
import { useState } from "react";
// libs
import { ethers } from "ethers";
import { Button, Form, Row, Spinner } from "react-bootstrap";

const BuyTokens = ({ provider, price, crowdContract, setIsLoading }) => {
  const [purchaseQty, setPurchaseQty] = useState('0');
  const [isWaiting, setIsWaiting] = useState(false);

  const buyHandler = async(e) => {
    e.preventDefault();
    console.log(`>> BUYING ${purchaseQty} TOKENS...`);

    setIsWaiting(true);

    const signer = await provider.getSigner();
    const ethValue = ethers.utils.parseUnits((purchaseQty * price).toString(), 'ether');
    const formattedPurhcaseQty = ethers.utils.parseUnits(purchaseQty.toString(), 'ether');
    const transaction = await crowdContract.connect(signer).buyTokens(formattedPurhcaseQty, { value: ethValue });
    await transaction.wait();

    setIsLoading(true);
  };

  return (
    <Form onSubmit={buyHandler} style={{ maxWidth: '800px', margin: '50px auto' }}>
      <Form.Group as={Row}>
          <Form.Control
            type="number"
            placeholder="Enter amount"
            className="my-4"
            onChange={(e) => setPurchaseQty(e.target.value)}/>
          {isWaiting ? (
            <Spinner animation="border" />
          ) : (
          <Button variant="primary" type="submit" style={{ width: '100%' }}>
            Buy Tokens
          </Button>
          )}
      </Form.Group>
    </Form>
  );
};

export default BuyTokens;