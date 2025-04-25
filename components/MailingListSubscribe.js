"use client";
import { useState } from 'react';

export default function MailingListSubscribe() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailChange = (e) => {
    // Only allow basic email characters to prevent injection attacks
    // Simple sanitization by removing potentially harmful characters
    const sanitizedValue = e.target.value
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/[^\w\s@.-]/g, ''); // Only allow email-valid chars
    setEmail(sanitizedValue);
  };

  const validateEmail = (email) => {
    // More comprehensive email validation regex
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Enhanced validation
    if (!email) {
      setStatus('Please enter your email address');
      return;
    }
    
    if (!validateEmail(email)) {
      setStatus('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    setStatus('');
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email.trim() // Use simple sanitized email
        }),
        credentials: 'same-origin', // Important for security
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to subscribe');
      }
      
      const data = await response.json();
      
      setEmail('');
      setStatus('Thanks for subscribing!');
    } catch (error) {
      setStatus(error.message || 'An error occurred. Please try again later.');
      console.error('Subscription error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mailing-list-subscribe">
      <h4>Subscribe to our mailing list</h4>
      <form onSubmit={handleSubmit} className="subscribe-form">
        <div className="subscribe-input-group">
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Your email"
            required
            disabled={isSubmitting}
            className="subscribe-input"
            aria-label="Email address"
            autoComplete="email"
          />
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="subscribe-button"
            aria-label="Subscribe"
          >
            {isSubmitting ? 'Subscribing...' : 'Subscribe'}
          </button>
        </div>
        {status && (
          <div 
            className={`subscribe-status ${status.includes('Thanks') ? 'status-success' : 'status-error'}`}
            role="alert"
          >
            {status}
          </div>
        )}
      </form>

      <style jsx>{`
        .mailing-list-subscribe {
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          backdrop-filter: blur(10px);
          margin-bottom: 1rem;
        }
        
        .subscribe-form {
          margin-top: 1rem;
        }
        
        .subscribe-input-group {
          display: flex;
          border-radius: 30px;
          overflow: hidden;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          background: #fff;
        }
        
        .subscribe-input-group:focus-within {
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }
        
        .subscribe-input {
          flex: 1;
          border: none;
          padding: 0.75rem 1.25rem;
          font-size: 1rem;
          background: transparent;
          border-radius: 30px 0 0 30px;
          outline: none;
        }
        
        .subscribe-button {
          background: black;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.3s ease;
          border-radius: 0 30px 30px 0;
          white-space: nowrap;
        }
        
        .subscribe-button:hover:not(:disabled) {
          background: #f0b429;
        }
        
        .subscribe-button:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }
        
        .subscribe-status {
          margin-top: 0.75rem;
          padding: 0.5rem;
          border-radius: 8px;
          font-size: 0.9rem;
          text-align: center;
          animation: fadeIn 0.3s ease;
        }
        
        .status-success {
          background-color: rgba(40, 167, 69, 0.1);
          color: #f0b429;
        }
        
        .status-error {
          background-color: rgba(220, 53, 69, 0.1);
          color: #dc3545;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @media (max-width: 576px) {
          .subscribe-input-group {
            flex-direction: column;
            border-radius: 12px;
          }
          
          .subscribe-input {
            border-radius: 12px 12px 0 0;
            text-align: center;
          }
          
          .subscribe-button {
            border-radius: 0 0 12px 12px;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
