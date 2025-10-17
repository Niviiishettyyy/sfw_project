import { useEffect, useState } from 'react';
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Dashboard from './pages/Dashboard.jsx';
import Reports from './pages/Reports.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import { AuthContext } from './context/AuthContext.jsx';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

const App = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      api
        .get('/auth/profile', { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setUser(res.data.user))
        .catch(() => {
          setToken('');
          localStorage.removeItem('token');
        });
    }
  }, [token]);

  const login = (authToken, authUser) => {
    setToken(authToken);
    setUser(authUser);
    localStorage.setItem('token', authToken);
    navigate('/');
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    navigate('/login');
  };

  const contextValue = { token, user, login, logout, api };

  return (
    <AuthContext.Provider value={contextValue}>
      <nav>
        <h1>Bug Bounty Tracker</h1>
        <ul>
          {user ? (
            <>
              <li>
                <Link to="/">Dashboard</Link>
              </li>
              <li>
                <Link to="/reports">Reports</Link>
              </li>
              <li>
                <Link to="/leaderboard">Leaderboard</Link>
              </li>
              <li>
                <button onClick={logout}>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/reports" element={user ? <Reports /> : <Navigate to="/login" />} />
          <Route path="/leaderboard" element={user ? <Leaderboard /> : <Navigate to="/login" />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
        </Routes>
      </main>
    </AuthContext.Provider>
  );
};

export default App;
