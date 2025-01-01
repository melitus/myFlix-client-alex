import React, { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { NavigationBar } from "../navigation-bar/navigation-bar";
import { ProfileView } from "../profile-view/profile-view"
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
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchVal, setSearchVal] = useState("");

  const onLoggedOut = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
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

  // Filters movies as the user types
  useEffect(() => {
    if (searchVal === "") {
      setFilteredMovies(movies); // show all movies if input is empty
    } else {
      const filtered = movies.filter((movie) =>
        movie.Genre.Name.toLowerCase().includes(searchVal.toLowerCase())
      );
      setFilteredMovies(filtered);
    }
  }, [searchVal, movies]); // Trigger whenever searchVal or movies change

  // Unauthenticated users get login/signup routes
  if (!user) {
    return (
      <BrowserRouter>
        <NavigationBar 
          user={user} 
          onLoggedOut={() => {
            setUser(null);
            setToken(null);
            localStorage.removeItem("user");
            localStorage.removeItem("token");
        }} 
        />
        <Row className="justify-content-md-center">
          <Routes>
            <Route
              path="/signup"
              element={
                <>
                  {user ? (
                    <Navigate to="/" />
                  ) : (
                    <Col md={5}>
                      <SignupView />
                    </Col>
              )}
            </>
              }
            />
            <Route
              path="/login"
              element={
                <>
                  {user ? (
                    <Navigate to="/" />
                  ) : (
                    <Col md={5}>
                  <LoginView 
                  onLoggedIn={(user, token) => {
                    console.log(token);
                    setUser(user);
                    setToken(token);
                  }} />
                </Col>
                  )}
                </>
                  
              }
            />
            {/* Redirect any other path to login */}
            <Route 
              path="*" 
              element={
              <Navigate to="/login" />} /> 
          </Routes>
        </Row>
      </BrowserRouter>
    );
  }

  // Authenticated users can access movie and other routes
  return (
    <BrowserRouter>
      <NavigationBar
        user={user}
        onLoggedOut={() => {
          setUser(null);
          setToken(null);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }}
      />
    <Row className="justify-content-md-center">
      {/* Conditionally render search bar only on the home page */}
      {location.pathname === "/" ? (
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <input
            type="text"
            placeholder="Search by Genre"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
          />
        </div>
      ) : null}
      <Routes>
        <Route
          path="/movies/:movieId"
          element={
            <Col md={8}>
              <MovieView movies={movies} />
            </Col>
          }
        />
        <Route
          path="/"
          element={
            <>
              {filteredMovies.length === 0 ? (
                <Col>The list is empty!</Col>
              ) : (
                filteredMovies.map((movie) => (
                  <Col className="mb-4" key={movie._id} md={3}>
                    <MovieCard
                      movie={movie}
                      user={user}
                      updateFavorites={(updatedFavorites) => {
                        setUser({ ...user, FavoriteMovies: updatedFavorites });
                      }}
                      loggedInUsername={user.Username}
                    />
                  </Col>
                ))
              )}
            </>
          }
        />
        <Route path="/profile" element={<ProfileView movies={movies} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Row>

    </BrowserRouter>
  );
};