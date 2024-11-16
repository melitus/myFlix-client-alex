import PropTypes from "prop-types";

export const MovieView = ({ movie, onBackClick }) => {
  return (
    <div>
      <div>
        <span>Title: </span>
        <span>{movie.title}</span>
      </div>
      <div>
        <span>Description: </span>
        <span>{movie.description}</span>
      </div>
      <div>
        <span>Genre: </span>
        <span>{movie.genre.name}</span>
        <p>{movie.genre.description}</p>
      </div>
      <div>
        <span>Directed by: </span>
        <span>{movie.director.name}</span>
        <p>{movie.director.bio}</p>
      </div>
      <button onClick={onBackClick}>Back</button>
    </div>
  );
};

MovieView.propTypes = {
  movie: PropTypes.shape({
    title: PropTypes.string,
  }).isRequired,
  onBackClick: PropTypes.func.isRequired
  };