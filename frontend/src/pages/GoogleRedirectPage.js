import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function GoogleRedirectPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get('token');

    console.log("Received token:", token); // للتأكد

    if (token) {
      localStorage.setItem('token', token);
      // توجيه بعد تأخير بسيط حتى يعطي وقت للرندر
      setTimeout(() => {
        navigate('/projects');
      }, 500);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div style={{ padding: 30 }}>
      <h2>Logging you in...</h2>
    </div>
  );
}

export default GoogleRedirectPage;