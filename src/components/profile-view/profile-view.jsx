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

  const loggedInUsername = localStorage.getItem("username");

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const users = await response.json();
        const loggedInUser = users.find(user => user.username === loggedInUsername);

        if (!loggedInUser) {
          throw new Error("Logged-in user not found in the users list.");
        }

        setUser(loggedInUser);
        setFormData(loggedInUser);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
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
      const response = await fetch(`/users/${user.id}`, {
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
      const response = await fetch(`/users/${user.id}`, {
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
  const updateFavorites = (movieId) => {
    console.log("Updating favorites for movie:", movieId);
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
              value={formData.name || ""}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username || ""}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formDateOfBirth">
            <Form.Label>Birthday</Form.Label>
            <Form.Control
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth || ""}
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
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Birthday:</strong> {user.dateOfBirth}
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
              <MovieCard
                movie={movie}
                user={user}
                updateFavorites={updateFavorites}
              />
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
