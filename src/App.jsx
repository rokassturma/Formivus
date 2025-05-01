import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { useEffect, useState } from "react";


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (username) {
      setIsLoggedIn(true);
    }
  }, []);


  return (
    <>
      <Router>
        <Header isLoggedIn={isLoggedIn} /> {/* jei turi Header */}
        <Routes>
          <Route path="/" element={<Home isLoggedIn={isLoggedIn} username={localStorage.getItem('username')} />} />

          <Route
            path="/login"
            element={
              !isLoggedIn ? <Login setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/" />
            }
          />

          <Route
            path="/register"
            element={
              !isLoggedIn ? <Register /> : <Navigate to="/" />
            }
          />
        </Routes>
      </Router>
      <Footer />
    </>
  );
}

export default App
