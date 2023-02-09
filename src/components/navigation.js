import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
// import Nav from 'react-bootstrap/Nav';
// import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from '../logo.png';

function Navigation() {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <img alt="logo" src={logo} width="40" height="40" className="d-inline-block align-top mx-3"/> 
        <Navbar.Brand href="#">SCRATCH ICO Crowdsale</Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export default Navigation;


// <Navbar.Toggle aria-controls="basic-navbar-nav" />
// <Navbar.Collapse id="basic-navbar-nav">
//   <Nav className="me-auto">
//     <Nav.Link href="#home">Home</Nav.Link>
//     <Nav.Link href="#link">Link</Nav.Link>
//     <NavDropdown title="Dropdown" id="basic-nav-dropdown">
//       <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
//       <NavDropdown.Item href="#action/3.2">
//         Another action
//       </NavDropdown.Item>
//       <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
//       <NavDropdown.Divider />
//       <NavDropdown.Item href="#action/3.4">
//         Separated link
//       </NavDropdown.Item>
//     </NavDropdown>
//   </Nav>
// </Navbar.Collapse>