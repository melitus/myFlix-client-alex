import React, { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { NavigationBar } from "../navigation-bar/navigation-bar";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";

export const MainView = () => {
  const urlAPI = "https://movies-flix123-4387886b5662.herokuapp.com";
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");

  const [user, setUser] = useState(storedUser || null);
  const [token, setToken] = useState(storedToken || null);
  const [movies, setMovies] = useState([]);


  const onLoggedOut = () => {
    setUser(null);
    setToken(null);
  };

  useEffect(() => {
    console.log("TOKEN:" + token);
    if (!token) return;

    fetch(urlAPI + "/movies", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setMovies(data);
      });
  }, [token]);

  // Unauthenticated users get login/signup routes
  if (!user) {
    return (
      <BrowserRouter>
        <NavigationBar user={user} onLoggedOut={onLoggedOut} />
        <Row className="justify-content-md-center">
          <Routes>
            <Route
              path="/signup"
              element={
                <Col md={5}>
                  <SignupView />
                </Col>
              }
            />
            <Route
              path="/login"
              element={
                <Col md={5}>
                  <LoginView 
                  onLoggedIn={(user, token) => {
                    console.log(token);
                    localStorage.setItem("user", JSON.stringify(user));
                    localStorage.setItem("token", token);
                    setUser(user);
                    setToken(token);
                  }} />
                </Col>
              }
            />
            {/* Redirect any other path to login */}
            <Route path="*" element={<Navigate to="/login" />} /> 
          </Routes>
        </Row>
      </BrowserRouter>
    );
  }

  // Authenticated users can access movie and other routes
  return (
    <BrowserRouter>
      <NavigationBar user={user} onLoggedOut={onLoggedOut} />
      <Row className="justify-content-md-center">
        <Routes>
          {/* Movie details page */}
          <Route
            path="/movies/:movieId"
            element={
              <Col md={8}>
                <MovieView movies={movies} />
              </Col>
            }
          />
          {/* Home page with movie list */}
          <Route
            path="/"
            element={
              <>
                {movies.length === 0 ? (
                  <Col>The list is empty!</Col>
                ) : (
                  <>
                    {movies.map((movie) => (
                      <Col className="mb-4" key={movie._id} md={3}>
                        <MovieCard movie={movie} />
                      </Col>
                    ))}
                  </>
                )}
              </>
            }
          />
          {/* Redirect any undefined route to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Row>
    </BrowserRouter>
  );
};
