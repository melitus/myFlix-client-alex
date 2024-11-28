import {Navbar, Container, Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

export const NavigationBar = ({ user, onLoggedOut }) => {
  const navigate = useNavigate();

  const handleProfileClick = (event) => {
    event.preventDefault(); //Prevent default link behavior
    navigate(`/users/${encodeURIComponent(user._id)}`); //Navigate to profile route
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
        MyFlixDB
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {user && user._id && (
              <>
                <Nav.Link 
                  as={Link}
                  to={`/users/${encodeURIComponent(user._id)}`}
                >
                  Profile 
                </Nav.Link>
                <Nav.Link as={Link} to="/" onClick={onLoggedOut}>
                  Log Out
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};