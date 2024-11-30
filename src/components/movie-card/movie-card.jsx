// Import the PropTypes library
import React from "react";
import PropTypes from "prop-types";
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

// The MovieCard function component
export const MovieCard = ({ movie, user, updateFavorites}) => {
  // Check if the movies is in the user's favorites list
  const isFavorite = user?.FavoriteMovies.includes(movie._id);

  // Handle toggle of the favorite movies
  const handleFavoriteToggle = () => {
    //Toggle favorite status
    const updatedFavorites = isFavorite
      ? user.FavoriteMovies.filter((id) => id !== movie._id) // Remove from favorites
      : [...user.FavoriteMovies, movie._id]; // Add to favorites

    // Call the function passed via props to update the backend and user state
    updateFavorites(updatedFavorites);
  };

  return (
    <Card>
      <Card.Img variant="top" src={movie.image} />
      <Card.Body>
        <Card.Title>{movie.title}</Card.Title>
        <Card.Text>{movie.director}</Card.Text>
        <Card.Text>{movie.genre}</Card.Text>
        <Card.Text>{movie.description}</Card.Text>
          <Link to={`/movies/${encodeURIComponent(movie._id)}`}>
            <Button variant="link">
              Open
            </Button>
          </Link>
          {/* Favorite Button */}
          <Button 
          variant={isFavorite ? "danger" : "primary"}
          onClick={handleFavoriteToggle}
        >
          {isFavorite ? "Unfavorite" : "Favorite"}
        </Button>
      </Card.Body>
    </Card>
  );
};

// Defined props constraints for the MovieCard
MovieCard.propTypes = {
  movie: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
    director: PropTypes.string,
    genre: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.string
  }).isRequired,
  user: PropTypes.shape({
    FavoriteMovies: PropTypes.arrayOf(PropTypes.string) // Array of movie ids
  }).isRequired,
  updateFavorites: PropTypes.func.isRequired // Function to update favorites
};