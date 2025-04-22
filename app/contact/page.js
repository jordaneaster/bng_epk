'use client';
import { useState } from 'react';
import Layout from '../../components/Layout';
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

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
    setSubmitError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });

      if (!response.ok) {
        let errorMsg = `Submission failed: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch (jsonError) {}
        throw new Error(errorMsg);
      }

      console.log('Form submitted successfully to API');
      setSubmitSuccess(true);
      setFormState({
        name: '',
        email: '',
        subject: '',
        message: ''
      });

    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container">
        <div className="fade-in">
          <h1 className="text-center mb-4">Contact</h1>

          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            {submitSuccess ? (
              <div className="text-center p-4" style={{ backgroundColor: 'var(--color-card-bg)', borderRadius: 'var(--border-radius)' }}>
                <h2 className="mb-2">Thank You!</h2>
                <p>Your message has been received. We&apos;ll get back to you soon.</p>
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
                    required
                  />
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
                </div>

                <div className="mb-3">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formState.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    required
                  ></textarea>
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
          </div>
        </div>
      </div>
    </Layout>
  );
}
