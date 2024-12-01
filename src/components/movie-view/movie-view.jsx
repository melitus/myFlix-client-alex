import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router";
import "./movie-view.scss";

export const MovieView = () => {
  const { movieId } = useParams();
  const [currentMovie, setCurrentMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const urlAPI = "https://movies-flix123-4387886b5662.herokuapp.com"; // API URL

  useEffect(() => {
    // Fetch movie data from the API when the component mounts or movieId changes
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${urlAPI}/movies/${movieId}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch movie data");
        }
        
        const movie = await response.json();
        setCurrentMovie(movie);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovie();
  }, [movieId]); // Re-run the effect if the movieId changes

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!currentMovie) {
    return <div>Movie not found!</div>;
  }

  return (
    <div>
      <div>
        <span>Title: </span>
        <span>{currentMovie.title}</span>
      </div>
      <div>
        <span>Description: </span>
        <span>{currentMovie.description}</span>
      </div>
      <div>
        <span>Genre: </span>
        <span>{currentMovie.genre.name}</span>
        <p>{currentMovie.genre.description}</p>
      </div>
      <div>
        <span>Directed by: </span>
        <span>{currentMovie.director.name}</span>
        <p>{currentMovie.director.bio}</p>
      </div>
      <Link to={`/`}>
        <button className="back-button">Back</button>
      </Link>
    </div>
  );
};
