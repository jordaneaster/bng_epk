'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '../../../lib/auth';
import styles from './login.module.css';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [debug, setDebug] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Check if js-cookie is installed
  useEffect(() => {
    try {
      // Try to import js-cookie to verify it's installed
      import('js-cookie').catch(() => {
        setDebug(prev => prev + '\n• Error: js-cookie package not installed.');
      });
    } catch (err) {
      setDebug(prev => prev + '\n• Error checking dependencies: ' + err.message);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setDebug('• Login attempt started...');

    try {
      setDebug(prev => prev + '\n• Calling signIn function...');
      const success = await signIn(username, password);
      
      if (success) {
        setDebug(prev => prev + '\n• Login successful, redirecting...');
        
        // Add a small delay before redirect to ensure cookie is set
        setTimeout(() => {
          router.push('/admin/analytics');
        }, 500);
      } else {
        setError('Invalid username or password');
        setDebug(prev => prev + '\n• Login failed: Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setDebug(prev => prev + '\n• Login error: ' + err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginForm}>
        <h1 className={styles.title}>Admin Login</h1>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          
          <button 
            type="submit" 
            className={styles.button}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        {debug && (
          <div className={styles.debug}>
            <details>
              <summary>Debug Info</summary>
              <pre>{debug}</pre>
              <p><strong>Default credentials:</strong> admin / securepassword123</p>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}
