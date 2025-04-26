'use client';
import { useState } from 'react';
import { socialLinks } from '../../data/mockData';
import Link from 'next/link';

export default function Contact() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [emailStatus, setEmailStatus] = useState(null);
  const [mailingListStatus, setMailingListStatus] = useState(null);

  // Sanitize input to prevent XSS
  const sanitizeInput = (input) => {
    if (typeof input !== 'string') return '';
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .trim();
  };

  // Validate form inputs
  const validateForm = () => {
    const errors = {};
    
    // Name validation
    if (formState.name.length < 2 || formState.name.length > 50) {
      errors.name = 'Name must be between 2 and 50 characters';
    }
    
    // Email validation with regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formState.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Subject validation
    if (formState.subject.length < 3 || formState.subject.length > 100) {
      errors.subject = 'Subject must be between 3 and 100 characters';
    }
    
    // Message validation
    if (formState.message.length < 10 || formState.message.length > 1000) {
      errors.message = 'Message must be between 10 and 1000 characters';
    }
    
    return errors;
  };

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
    setSubmitError(null);
    
    // Clear validation error when user types
    if (validationErrors[e.target.name]) {
      setValidationErrors({
        ...validationErrors,
        [e.target.name]: null
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    setEmailStatus(null);
    setMailingListStatus(null);

    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setIsSubmitting(false);
      return;
    }
    
    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(formState.name),
      email: sanitizeInput(formState.email),
      subject: sanitizeInput(formState.subject),
      message: sanitizeInput(formState.message)
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        let errorMsg = `Submission failed: ${response.statusText}`;
        errorMsg = responseData.message || errorMsg;
        throw new Error(errorMsg);
      }

      setSubmitSuccess(true);
      setEmailStatus(responseData.emailStatus || 'Unknown');
      setMailingListStatus(responseData.mailingListStatus);
      setFormState({
        name: '',
        email: '',
        subject: '',
        message: ''
      });

    } catch (error) {
      setSubmitError(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <div className="container">
        <div className="fade-in">
          <h1 className="text-center mb-4">Contact</h1>

          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            {submitSuccess ? (
              <div className="text-center p-4" style={{ backgroundColor: 'var(--color-card-bg)', borderRadius: 'var(--border-radius)' }}>
                <h2 className="mb-2">Thank You!</h2>
                <p>Your message has been received. We&apos;ll get back to you soon.</p>
                {emailStatus && (
                  <p className="mt-2" style={{ fontSize: '0.9em', opacity: 0.8 }}>
                    Email notification status: {emailStatus}
                  </p>
                )}
                {mailingListStatus && (
                  <p className="mt-1" style={{ fontSize: '0.9em', opacity: 0.8 }}>
                    {mailingListStatus}
                  </p>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                {submitError && (
                  <div className="mb-3 p-2" style={{ color: 'var(--color-error)', border: '1px solid var(--color-error)', borderRadius: 'var(--border-radius)', backgroundColor: 'var(--color-error-bg)' }}>
                    {submitError}
                  </div>
                )}

                <div className="mb-3">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    maxLength={50}
                    required
                  />
                  {validationErrors.name && (
                    <div className="form-error">{validationErrors.name}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    required
                  />
                  {validationErrors.email && (
                    <div className="form-error">{validationErrors.email}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formState.subject}
                    onChange={handleChange}
                    maxLength={100}
                    required
                  />
                  {validationErrors.subject && (
                    <div className="form-error">{validationErrors.subject}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    maxLength={1000}
                    required
                  ></textarea>
                  {validationErrors.message && (
                    <div className="form-error">{validationErrors.message}</div>
                  )}
                </div>

                <button type="submit" className="btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}

            <div className="mt-4 p-3" style={{ backgroundColor: 'var(--color-card-bg)', borderRadius: 'var(--border-radius)' }}>
              <h3 className="mb-2">Connect on Social Media</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <Link href={socialLinks.instagram}>Instagram</Link>
                <Link href={socialLinks.twitter}>Twitter</Link>
                <Link href={socialLinks.facebook}>Facebook</Link>
                <Link href={socialLinks.tiktok}>TikTok</Link>
              </div>
            </div>

            <div className="mt-4 p-3 text-center" style={{ backgroundColor: 'var(--color-card-bg)', borderRadius: 'var(--border-radius)' }}>
              <h3 className="mb-2">Media & Press</h3>
              <p>Looking for press materials? Check out our Electronic Press Kit.</p>
              <Link href="/epk" className="btn mt-2">View EPK</Link>
            </div>
          </div>
        </div>
      </div>
  );
}
