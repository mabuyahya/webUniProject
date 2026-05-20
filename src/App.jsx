import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MainPage from './MainPage';
import Login from './Login';
import Register from './Register';
import About from './About';
import './App.css';
import { apiRequest } from './api';

function App() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [sessionError, setSessionError] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      setSessionError('');
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/auth/me`,
          { credentials: 'include' }
        );

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch {
        setSessionError('Unable to reach the server.');
      } finally {
        setLoadingUser(false);
      }
    };

    loadUser();
  }, []);

  const handleLogout = async () => {
    setSessionError('');
    try {
      await apiRequest('/api/auth/logout', { method: 'POST' });
      setUser(null);
    } catch (error) {
      setSessionError(error.message);
    }
  };

  return (
    <Router>
      <header className="header">
        <h1>Book Library</h1>
        <nav>
          <Link to="/">Home</Link>
          {!user && <Link to="/login">Login</Link>}
          {!user && <Link to="/register">Register</Link>}
          <Link to="/about">About</Link>
          {user && <span className="nav-user">Hi, {user.name}</span>}
          {user && (
            <button type="button" className="link-button" onClick={handleLogout}>
              Logout
            </button>
          )}
        </nav>
      </header>
      <Routes>
        <Route
          path="/"
          element={
            <MainPage
              user={user}
              loadingUser={loadingUser}
              sessionError={sessionError}
            />
          }
        />
        <Route path="/login" element={<Login onLogin={setUser} />} />
        <Route path="/register" element={<Register onRegister={setUser} />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
