import React, { useEffect, useState } from "react";
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

  const favoriteMovies = movies.filter((m) => user?.FavoriteMovies.includes(m._id));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

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

  if (loading) {
    return <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>;
  }

  if (error) {
    return <Alert variant="danger">Error: {error}</Alert>;
  }

  return (
    <div className="profile-view">
      <h1>User Profile</h1>
      {isEditing ? (
        <Form onSubmit={handleFormSubmit}>
          {/* Form Fields */}
          {/* See previous code for form details */}
          <Button variant="primary" type="submit">Save Changes</Button>{' '}
          <Button variant="secondary" onClick={handleEditToggle}>Cancel</Button>
        </Form>
      ) : (
        <div className="profile-details">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Birthday:</strong> {user.dateOfBirth}</p>
          <Button variant="primary" onClick={handleEditToggle}>Edit Profile</Button>
        </div>
      )}

      <h2>Favorite Movies</h2>
      {favoriteMovies.length > 0 ? (
        <Row>
          {favoriteMovies.map((movie) => (
            <Col key={movie._id} sm={6} md={4} lg={3}>
              <MovieCard movie={movie} />
            </Col>
          ))}
        </Row>
      ) : (
        <p>No favorite movies added yet.</p>
      )}

      <Modal show={showDeregisterModal} onHide={() => setShowDeregisterModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deregistration</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to deregister your account? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeregisterModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDeregister}>Deregister</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProfileView;
