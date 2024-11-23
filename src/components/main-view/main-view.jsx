import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { useState, useEffect } from "react";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import Row from "react-boostrap/Row";
import Col from 'react-bootstrap/Col';

export const MainView = () => {
  const urlAPI = "https://movies-flix123-4387886b5662.herokuapp.com";
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");
  const [user, setUser] = useState(storedUser ? storedUser : null);
  const [token, setToken] = useState(storedToken ? storedToken : null);
  const [movies, setMovies] = useState([]);
  const [selectMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    if (!token) return;

    fetch(urlAPI + "/movies", {
      headers: { Authorization: `Bearer ${token}`},
    })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      setMovies(moviesFromApi);
      });
  }, [token]);

  if (!user) {
    return (
      <Row className="justify-content-md-center">
        {!user ? (
          <>
            <LoginView
              onLoggedIn={(user, token) => {
                setUser(user);
                setToken(token);
              }}
            />
            or
            <SignupView />
          </>
    ) : selectedMovie ? (
      <Col md={8}>
        <MovieView 
        movie={selectedMovie} 
        onBackClick={() => setSelectedMovie(null)} 
        />
      </Col>
    ) : movies.length === 0 ? (
      <div>The list is empty!</div>
    ) : (
      <>
        {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onMovieClick={(newSelectedMovie) => {
            setSelectedMovie(newSelectedMovie);
          }}
      />
    ))}
    <button 
      onClick={() => {
        setUser(null);
        setUser(null);
        localStorage.clear();
      }}
    >Logout</button>
      </>
    )}
  </Row>
);
  };