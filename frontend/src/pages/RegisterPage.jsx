import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'USER',
  });

  const navigate = useNavigate();
  const logoUrl = process.env.PUBLIC_URL + '/logo.png';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:3000/api/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      alert('Registration successful!');
      navigate('/projects'); // عدّل لاحقًا حسب المسار
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="container">
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <img src={logoUrl} alt="Logo" style={{ width: '150px' }} />
      </div>
      <h2 className="heading">Register</h2>
      <div className="form-wrapper">
        <form onSubmit={handleSubmit}>
          <input
            className="input"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
          <input
            className="input"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            className="input"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <select
            className="input"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
          <button className="button" type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;