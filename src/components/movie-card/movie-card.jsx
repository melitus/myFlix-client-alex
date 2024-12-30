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
    
    fetch(urlAPI + `/users/${loggedInUsername}/movies/${movieID}`, {
        method: "POST",
        body: JSON.stringify(),
        headers: {
          "Content-Type": "application/json",
        },
      })
    }

    // console.log("User:", user);
    // console.log("User's FavoriteMovies:", user?.FavoriteMovies);
    
    // //Toggle favorite status
    // const updatedFavorites = isFavorite
    //   ? user.FavoriteMovies.filter((id) => id !== movie._id) // Remove from favorites
    //   : [...user.FavoriteMovies, movie._id]; // Add to favorites

    // // Call the function passed via props to update the backend and user state
    // updateFavorites(updatedFavorites);
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
};

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