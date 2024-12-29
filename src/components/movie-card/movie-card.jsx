// Import the PropTypes library
import React from "react";
import PropTypes from "prop-types";
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router";
import { useNavigate } from "react-router";


// The MovieCard function component
export const MovieCard = ({ movie, user, updateFavorites}) => {
  // Check if the movies is in the user's favorites list
  const isFavorite = user?.FavoriteMovies.includes(movie._id);
  
  // Used for routing to movies view for button
  const navigate = useNavigate();

  console.log("User prop:", user);

  function handleClick() {
    navigate(`/movies/${encodeURIComponent(movie._id)}`);
  }

  // Handle toggle of the favorite movies
  const handleFavoriteToggle = () => {
    const movieID = movie._id;
    const method = isFavorite ? "DELETE" : "POST";
    
    fetch(urlAPI + `/users/${loggedInUsername}/movies/${movieID}`, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Token for authentication 
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }
          return response.json();
        })
        .then((updatedUser) => {
          console.log("Updated user:", updatedUser);

          // Update the frontend state wih the updated favorites
          updateFavorites(updatedUser.FavoriteMovies);''
        })
        .catch((err) => {
          console.error("Failed to update favorites:", err);
        });
    };
  };

  return (
    <Card>
      <Card.Img variant="top" src={movie.ImagePath} />
      <Card.Body>
        <Card.Title>{movie.Title}</Card.Title>
        <Card.Text>{movie.Director.Name}</Card.Text>
        <Card.Text>{movie.Genre.Name}</Card.Text>
        {/*<Card.Text>{movie.Description}</Card.Text>*/}
          {/* <Link to={`/movies/${encodeURIComponent(movie._id)}`}> */}
            <Button 
              variant="link" 
              onClick={() => {
                handleClick();
              }}
              >
              Open
            </Button>
          {/*</Link>*/}
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

// Defined props constraints for the MovieCard
MovieCard.propTypes = {
  movie: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    Title: PropTypes.string,
    Director: PropTypes.string,
    Genre: PropTypes.string,
    Description: PropTypes.string,
    ImagePath: PropTypes.string
  }).isRequired,
  user: PropTypes.shape({
    FavoriteMovies: PropTypes.arrayOf(PropTypes.string) // Array of movie ids
  }).isRequired,
  updateFavorites: PropTypes.func.isRequired // Function to update favorites
};