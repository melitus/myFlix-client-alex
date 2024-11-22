// Import the PropTypes library
import PropTypes from "prop-types";
import { Button, Card } from "react-boostrap";

// The MovieCard function component
export const MovieCard = ({ movie, onMovieClick}) => {
  console.log(movie);
  return (
    <Card>
      <Card.Img variant="top" src={useBootstrapBreakpoints.image} />
      <Card.Body>
        <Card.Title>{movie.title}</Card.Title>
        <Card.Text>{movie.director}</Card.Text>
        <Card.Text>{movie.genre}</Card.Text>
        <Card.Text>{movie.description}</Card.Text>
        <Button onClick={() => onBookClick(movie)} variant="link">
          Open
        </Button>
      </Card.Body>
    </Card>
  );
};

// Defined props constraints for the MovieCard
MovieCard.propTypes = {
  movie: PropTypes.shape({
    title: PropTypes.string
  }).isRequired,
  onMovieClick: PropTypes.func.isRequired
};