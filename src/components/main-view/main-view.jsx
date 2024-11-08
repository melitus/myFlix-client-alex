import { useState } from "react";

import { MovieCard } from "../movie-card/movie-card";

import { MovieView } from "../movie-view/movie-view";

export const MainView = () => {
  const [movies, setMovies] = useState([
    {
      id: 1, 
      title: "Jurassic Park",
      image: "https://m.media-amazon.com/images/I/61GHS6ht4uL._SL1500_.jpg",
      genre: "Action",
      director: "Steven Speilberg"
    },
    {
      id: 2, 
      title: "Raiders of the Lost Ark",
      image: "https://m.media-amazon.com/images/I/91sD6F9q-DL._SL1500_.jpg",
      genre: "Action",
      director: "Steven Speilberg"
    },
    {
      id: 3, 
      title: "Ocean's Eleven",
      image: "https://m.media-amazon.com/images/I/51NQ40oxXWL._SX342_.jpg",
      genre: "Crime",
      director: "Steven Soderbergh"
    }
  ]);

  const [selectMovie, setSelectedMovie] = useState(null);

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
          key={movie.id}
          movie={movie}
          onMovieClick={(newSelectedMovie) => {
            setSelectedMovie(newSelectedMovie);
          }}
        />
      ))}
    </div>
  );
};