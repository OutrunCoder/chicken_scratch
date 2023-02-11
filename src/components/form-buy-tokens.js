import { Button, Col, Form, Row } from "react-bootstrap";


const BuyTokens = ({ provider, price, crowdContract, setIsLoading }) => {
  return (
    <Form style={{ maxWidth: '800px', margin: '50px auto' }}>
      <Form.Group as={Row}>
          <Form.Control type="number" placeholder="Enter amount" className="my-4"/>
          <Button variant="primary" type="submit" style={{ width: '100%' }}>
            Buy Tokens
          </Button>
      </Form.Group>
    </Form>
  );
};

export default BuyTokens;