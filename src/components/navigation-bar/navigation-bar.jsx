import React from "react";
import PropTypes from "prop-types";
import { Navbar, Container, Nav, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router";

export const NavigationBar = ({ user, onLoggedOut }) => {

  const genreSearch = () => {
    console.log("test");
  }

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          MyFlixDB
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {!user && (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/signup">
                  Signup
                </Nav.Link>
              </>
            )}
            {user && user._id && (
              <>
                <Nav.Link as={Link} to={`/users/${encodeURIComponent(user._id)}`}>Movies</Nav.Link>
                {/* Profile link using <Link> directly */}
                <Nav.Link as={Link} to="/profile">Profile</Nav.Link>

                {/* Log Out link */}
                <Nav.Link as={Link} to="/" onClick={onLoggedOut}>Log Out</Nav.Link>
              </>
            )}
          </Nav>
            <Form inline>
              <Row>
                <Col xs="auto">
                  <Form.Control
                    type="text"
                    placeholder="Search"
                    className=" mr-sm-2"
                  />
                </Col>
                <Col xs="auto">
                  <Button type="submit" onClick={genreSearch}>Submit</Button>
                </Col>
              </Row>
            </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

// Prop validation
NavigationBar.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired, // Validate the _id property of user
  }).isRequired,
  onLoggedOut: PropTypes.func.isRequired, // Validate that onLoggedOut is a function
};

export default NavigationBar;