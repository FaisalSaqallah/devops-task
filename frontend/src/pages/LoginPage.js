import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css'; 

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', {
        email,
        password,
      });
      localStorage.setItem('token', res.data.token);
      setMessage('Login success!');
      navigate('/projects');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Something went wrong');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/api/auth/google';
  };

  return (
    <div className="container">
      <div style={{ textAlign: 'center' }}>
        <img src="/logo.png" alt="Logo" style={{ width: 60, marginBottom: 10 }} />
        <h2>Login</h2>
      </div>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>

      <button className="google-btn" onClick={handleGoogleLogin}>
        Login with Google
      </button>

      <p>
        Don't have an account? <a href="/register">Register here</a>
      </p>

      {message && <p>{message}</p>}
    </div>
  );
}

export default LoginPage;