import { MovieCard } from "../movie-card/movie-card";

import { MovieView } from "../movie-view/movie-view";

import { useState, useEffect } from "react";

export const MainView = () => {
  const urlAPI = "https://movies-flix123-4387886b5662.herokuapp.com";
  const [movies, setMovies] = useState([]);
  const [selectMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    fetch(urlAPI + "/movies")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      setMovies(moviesFromApi);
      });
  }, []);

  if (selectedMovie) {
    return (
      <MovieView movie={selectedMovie} onBackClick={() => setSelectedMovie(null)} />
    );
  }

  if (movies.length === 0) {
    return <div>The list is empty!</div>;
  }

  return (
    <div>
      {movies.map((movie) => (
        <MovieCard
          movie={movie}
          onMovieClick={(newSelectedMovie) => {
            setSelectedMovie(newSelectedMovie);
          }}
        />
      ))}
    </div>
  );
};