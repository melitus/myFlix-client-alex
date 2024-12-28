import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Form, Button, Spinner, Alert, Row, Col, Modal } from "react-bootstrap";
import { MovieCard } from "../movie-card/movie-card";

export const ProfileView = ({ movies }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [showDeregisterModal, setShowDeregisterModal] = useState(false);

  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const loggedInUsername = loggedInUser.Username;

  const urlAPI = "https://movies-flix123-4387886b5662.herokuapp.com"; // API URL

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      console.log(loggedInUsername);
      try {
        const response = await fetch(`${urlAPI}/users/${loggedInUsername}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log(JSON.stringify(response.body));
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
    
        const userData = await response.json(); // Parse JSON response
        setUser(userData); // Set user data
        setFormData(userData); // Populate form data for editing
      } catch (err) {
        setError(err.message);
        console.log(err);
      } finally {
        setLoading(false); // Set loading to false after fetch
      }
    };

    if (loggedInUsername) {
      fetchUserData();
    } else {
      setError("No logged-in username found.");
      setLoading(false);
    }
  }, [loggedInUsername]);

  // Filter user's favorite movies
  const favoriteMovies = movies.filter((m) => user?.FavoriteMovies.includes(m._id));

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Toggle edit mode
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  // Submit updated profile
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/users/${loggedInUsername}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // Deregister user
  const handleDeregister = async () => {
    try {
      const response = await fetch(`/users/${loggedInUsername}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      localStorage.clear();
      alert("Account successfully deregistered.");
      window.location.href = "/";
    } catch (err) {
      setError(err.message);
    } finally {
      setShowDeregisterModal(false);
    }
  };

  // Placeholder for updating favorites
  const updateFavorites = async (newFavorites) => {
    try {
      const response = await fetch(`${urlAPI}/users/${loggedInUsername}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ FavoriteMovies: newFavorites }),
      });

      if (!response.ok) {
        throw new error(`Error: ${response.status} ${response.statusText}`);
      }

      const updatedUser = await response.json(); // Get the updated user data
      setUser(updatedUser); // Update the user state to reflect the changes
    } catch (err) {
      console.error("Error updating favorites:", err.message);
      setError(err.message);
    }
  };

  // Render loading spinner
  if (loading) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }

  // Render error message
  if (error) {
    return <Alert variant="danger">Error: {error}</Alert>;
  }

  return (
    <div className="profile-view">
      <h1>User Profile</h1>
      {isEditing ? (
        <Form onSubmit={handleFormSubmit}>
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.Name || ""}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.Email || ""}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.Username || ""}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formDateOfBirth">
            <Form.Label>Birthday</Form.Label>
            <Form.Control
              type="date"
              name="dateOfBirth"
              value={formData.Birthday || ""}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Save Changes
          </Button>{" "}
          <Button variant="secondary" onClick={handleEditToggle}>
            Cancel
          </Button>
        </Form>
      ) : (
        <div className="profile-details">
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.Email}
          </p>
          <p>
            <strong>Username:</strong> {user.Username}
          </p>
          <p>
            <strong>Birthday:</strong> {user.Birthday}
          </p>
          <Button variant="primary" onClick={handleEditToggle}>
            Edit Profile
          </Button>
        </div>
      )}

      <h2>Favorite Movies</h2>
      {favoriteMovies.length > 0 ? (
        <Row>
          {favoriteMovies.map((movie) => (
            <Col key={movie._id} sm={6} md={4} lg={3}>
              {user && ( // Ensures user exists before rendering MovieCard
                <MovieCard
                movie={movie}
                user={user}
                updateFavorites={updateFavorites}
              />
              )}
            </Col>
          ))}
        </Row>
      ) : (
        <p>No favorite movies added yet.</p>
      )}

      <Modal
        show={showDeregisterModal}
        onHide={() => setShowDeregisterModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deregistration</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to deregister your account? This action cannot
          be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeregisterModal(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeregister}>
            Deregister
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

// Prop validation
ProfileView.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ProfileView;
