'use client';
import { useState } from 'react';
import { socialLinks } from '../../data/mockData';
import Link from 'next/link';
import { FaInstagram, FaTwitter, FaFacebook, FaTiktok, FaPaperPlane, FaEnvelope, FaFileAlt } from 'react-icons/fa';

const socialMeta = [
  { key: 'instagram', icon: FaInstagram, label: 'Instagram', hoverColor: '#E1306C' },
  { key: 'twitter', icon: FaTwitter, label: 'Twitter', hoverColor: '#1DA1F2' },
  { key: 'facebook', icon: FaFacebook, label: 'Facebook', hoverColor: '#1877F2' },
  { key: 'tiktok', icon: FaTiktok, label: 'TikTok', hoverColor: '#69C9D0' },
];

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

  const sanitizeInput = (input) => {
    if (typeof input !== 'string') return '';
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .trim();
  };

  const validateForm = () => {
    const errors = {};
    if (formState.name.length < 2 || formState.name.length > 50) {
      errors.name = 'Name must be between 2 and 50 characters';
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formState.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (formState.subject.length < 3 || formState.subject.length > 100) {
      errors.subject = 'Subject must be between 3 and 100 characters';
    }
    if (formState.message.length < 10 || formState.message.length > 1000) {
      errors.message = 'Message must be between 10 and 1000 characters';
    }
    return errors;
  };

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
    setSubmitError(null);
    if (validationErrors[e.target.name]) {
      setValidationErrors({ ...validationErrors, [e.target.name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    setEmailStatus(null);
    setMailingListStatus(null);

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setIsSubmitting(false);
      return;
    }

    const sanitizedData = {
      name: sanitizeInput(formState.name),
      email: sanitizeInput(formState.email),
      subject: sanitizeInput(formState.subject),
      message: sanitizeInput(formState.message)
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sanitizedData),
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || `Submission failed: ${response.statusText}`);
      }
      setSubmitSuccess(true);
      setEmailStatus(responseData.emailStatus || 'Unknown');
      setMailingListStatus(responseData.mailingListStatus);
      setFormState({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSubmitError(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Hero */}
      <section className="contact-hero">
        <div className="container">
          <span className="hero-label">Get In Touch</span>
          <h1>Contact <span className="text-gradient-gold">Us</span></h1>
          <p className="hero-sub">Booking, press inquiries, and collaborations</p>
        </div>
      </section>

      <section className="contact-content section">
        <div className="container">
          <div className="contact-grid">
            {/* Form Column */}
            <div className="form-col">
              {submitSuccess ? (
                <div className="success-card">
                  <div className="success-icon">&#10003;</div>
                  <h2>Thank You!</h2>
                  <p>Your message has been received. We&apos;ll get back to you soon.</p>
                  {emailStatus && <p className="status-note">Email status: {emailStatus}</p>}
                  {mailingListStatus && <p className="status-note">{mailingListStatus}</p>}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form" noValidate>
                  {submitError && <div className="form-error-banner">{submitError}</div>}

                  <div className="field">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" value={formState.name} onChange={handleChange} maxLength={50} required placeholder="Your name" />
                    {validationErrors.name && <span className="field-error">{validationErrors.name}</span>}
                  </div>

                  <div className="field">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" value={formState.email} onChange={handleChange} required placeholder="you@example.com" />
                    {validationErrors.email && <span className="field-error">{validationErrors.email}</span>}
                  </div>

                  <div className="field">
                    <label htmlFor="subject">Subject</label>
                    <input type="text" id="subject" name="subject" value={formState.subject} onChange={handleChange} maxLength={100} required placeholder="What is this regarding?" />
                    {validationErrors.subject && <span className="field-error">{validationErrors.subject}</span>}
                  </div>

                  <div className="field">
                    <label htmlFor="message">Message</label>
                    <textarea id="message" name="message" value={formState.message} onChange={handleChange} maxLength={1000} required rows={5} placeholder="Tell us more..."></textarea>
                    {validationErrors.message && <span className="field-error">{validationErrors.message}</span>}
                  </div>

                  <button type="submit" className="submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <span>Sending&hellip;</span>
                    ) : (
                      <>
                        <FaPaperPlane />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Sidebar */}
            <div className="sidebar-col">
              <div className="sidebar-card">
                <h3>Connect</h3>
                <div className="social-links">
                  {socialMeta.map(({ key, icon: Icon, label }) => (
                    <a key={key} href={socialLinks[key]} target="_blank" rel="noopener noreferrer" className="social-link">
                      <Icon />
                      <span>{label}</span>
                    </a>
                  ))}
                </div>
              </div>

              <div className="sidebar-card">
                <div className="sidebar-icon"><FaEnvelope /></div>
                <h4>Direct Email</h4>
                <a href="mailto:melissa@bngmusicentertainment.com" className="email-link">
                  melissa@bngmusicentertainment.com
                </a>
              </div>

              <div className="sidebar-card">
                <div className="sidebar-icon"><FaFileAlt /></div>
                <h4>Media &amp; Press</h4>
                <p className="sidebar-text">Looking for press materials?</p>
                <Link href="/epk" className="epk-link">View EPK &rarr;</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .contact-page { background: #0a0a0a; min-height: 100vh; }

        .contact-hero {
          padding: 8rem 0 3rem;
          text-align: center;
          background: linear-gradient(180deg, #111 0%, #0a0a0a 100%);
          position: relative;
        }
        .contact-hero::after {
          content: '';
          position: absolute;
          bottom: 0; left: 20%; right: 20%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(240,180,41,0.3), transparent);
        }
        .hero-label {
          display: inline-block;
          font-size: 0.7rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.2em;
          color: var(--color-primary, #f0b429);
          margin-bottom: 0.75rem;
        }
        .contact-hero h1 {
          font-size: clamp(2.5rem, 6vw, 4rem);
          font-weight: 900; color: #fff; margin: 0 0 0.5rem;
        }
        .hero-sub { font-size: 1rem; color: rgba(255,255,255,0.45); margin: 0; }

        .contact-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 2.5rem;
          max-width: 900px;
          margin: 0 auto;
        }

        /* Form */
        .contact-form { display: flex; flex-direction: column; gap: 1.25rem; }
        .field { display: flex; flex-direction: column; gap: 0.35rem; }
        .field label {
          font-size: 0.75rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.06em;
          color: rgba(255,255,255,0.5);
        }
        .field input, .field textarea {
          background: #141414;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          padding: 0.75rem 1rem;
          color: #fff;
          font-size: 0.9rem;
          transition: border-color 0.2s;
          outline: none;
          font-family: inherit;
        }
        .field input::placeholder, .field textarea::placeholder {
          color: rgba(255,255,255,0.2);
        }
        .field input:focus, .field textarea:focus {
          border-color: var(--color-primary, #f0b429);
        }
        .field textarea { resize: vertical; min-height: 120px; }
        .field-error {
          font-size: 0.75rem;
          color: #ef4444;
        }

        .form-error-banner {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.3);
          border-radius: 8px;
          padding: 0.75rem 1rem;
          color: #ef4444;
          font-size: 0.85rem;
        }

        .submit-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
          background: var(--color-primary, #f0b429);
          color: #000; font-weight: 700; font-size: 0.85rem;
          border: none; border-radius: 8px;
          padding: 0.85rem 2rem;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.2s;
          text-transform: uppercase; letter-spacing: 0.05em;
        }
        .submit-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Success */
        .success-card {
          text-align: center;
          background: #141414;
          border-radius: 12px;
          padding: 3rem 2rem;
          border: 1px solid rgba(240,180,41,0.15);
        }
        .success-icon {
          width: 56px; height: 56px;
          border-radius: 50%;
          background: var(--color-primary, #f0b429);
          color: #000;
          font-size: 1.5rem; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1.25rem;
        }
        .success-card h2 { font-size: 1.5rem; font-weight: 800; color: #fff; margin: 0 0 0.5rem; }
        .success-card p { color: rgba(255,255,255,0.6); font-size: 0.9rem; }
        .status-note { font-size: 0.8rem; color: rgba(255,255,255,0.35); margin-top: 0.25rem; }

        /* Sidebar */
        .sidebar-card {
          background: #141414;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.04);
          padding: 1.5rem;
          margin-bottom: 1.25rem;
        }
        .sidebar-card h3 {
          font-size: 0.7rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.12em;
          color: rgba(255,255,255,0.4);
          margin: 0 0 1rem;
        }
        .sidebar-card h4 {
          font-size: 0.95rem; font-weight: 700; color: #fff;
          margin: 0 0 0.5rem;
        }
        .sidebar-icon {
          color: var(--color-primary, #f0b429);
          font-size: 1.1rem;
          margin-bottom: 0.75rem;
        }
        .sidebar-text {
          font-size: 0.85rem; color: rgba(255,255,255,0.45);
          margin: 0 0 0.5rem;
        }

        .social-links { display: flex; flex-direction: column; gap: 0.5rem; }
        .social-link {
          display: flex; align-items: center; gap: 0.6rem;
          padding: 0.5rem 0;
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          font-size: 0.9rem; font-weight: 600;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: color 0.2s;
        }
        .social-link:last-child { border-bottom: none; }
        .social-link:hover { color: var(--color-primary, #f0b429); }

        .email-link {
          color: var(--color-primary, #f0b429);
          text-decoration: none;
          font-size: 0.85rem; font-weight: 600;
          word-break: break-all;
        }
        .email-link:hover { text-decoration: underline; }

        .epk-link {
          font-size: 0.85rem; font-weight: 700;
          color: var(--color-primary, #f0b429);
          text-decoration: none;
        }
        .epk-link:hover { opacity: 0.8; }

        @media (max-width: 768px) {
          .contact-hero { padding: 6.5rem 0 2rem; }
          .contact-grid {
            grid-template-columns: 1fr;
            max-width: 520px;
          }
        }
        @media (max-width: 480px) {
          .contact-hero h1 { font-size: 2rem; }
          .contact-grid { max-width: 100%; }
        }
      `}</style>
    </div>
  );
}
