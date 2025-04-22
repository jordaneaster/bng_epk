'use client';
import { useState } from 'react';

export default function PasswordProtection({ children, correctPassword = 'press123' }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
    }
  };
  
  if (isAuthenticated) {
    return <>{children}</>;
  }
  
  return (
    <div className="container">
      <div style={{ 
        maxWidth: '500px', 
        margin: '100px auto', 
        padding: '40px', 
        backgroundColor: 'var(--color-card-bg)',
        borderRadius: 'var(--border-radius)',
        boxShadow: 'var(--shadow-md)'
      }}>
        <h2 className="text-center mb-4">Press Access</h2>
        <p className="text-center mb-4">This section is password protected for media professionals.</p>
        
        <form onSubmit={handleSubmit} className="contact-form">
          {error && <p style={{ color: 'red', marginBottom: '20px' }}>{error}</p>}
          
          <div className="mb-3">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn" style={{ width: '100%' }}>
            Access Press Kit
          </button>
        </form>
      </div>
    </div>
  );
}
