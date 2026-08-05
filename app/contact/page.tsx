"use client";

import React, { useEffect, useState } from "react";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { useSession } from "next-auth/react";
import { submitHelpRequest } from "@/app/actions/help";
import toast from "react-hot-toast";

export default function Contact() {
  const { data: session } = useSession();
  const [buttonState, setButtonState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', subject: 'Publishing a Paper / Thesis', message: '' });

  useEffect(() => {
    if (session?.user?.name) {
      const parts = session.user.name.split(' ')
      setFormData(prev => ({
        ...prev,
        firstName: parts[0] || '',
        lastName: parts.slice(1).join(' ') || '',
        email: session.user?.email || ''
      }))
    } else if (session?.user?.email) {
      setFormData(prev => ({ ...prev, email: session.user.email || '' }))
    }
  }, [session])

  useEffect(() => {
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-up');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.info-card, .form-col, .map-wrap').forEach(el => io.observe(el));

    return () => io.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setButtonState('sending');
    try {
      await submitHelpRequest({
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      })
      setButtonState('sent');
      setTimeout(() => {
        setButtonState('idle');
        setFormData(prev => ({ ...prev, message: '' })) // keep name/email if logged in
      }, 3000);
    } catch (e: any) {
      toast.error(e.message || 'Failed to send message')
      setButtonState('idle');
    }
  };

  return (
    <>
      <main className="min-h-screen bg-white">
        {/* ════════════════════════════════
            HERO HEADER
        ════════════════════════════════ */}
        <section className="contact-hero">
          <p className="eyebrow fade-up"><span className="eyebrow-line"></span>We'd Love To Hear From You</p>
          <h1 className="contact-h1 fade-up">Get In <em>Touch</em></h1>
          <p className="contact-hero-sub fade-up">
            Questions about publishing, partnerships, or your scholar profile?
            Our team typically responds within one business day.
          </p>
        </section>

        {/* ════════════════════════════════
            MAIN: INFO + FORM
        ════════════════════════════════ */}
        <section className="contact-main">

          {/* Info Column */}
          <div className="info-col">
            <p className="section-label">Contact Information</p>
            <h2 className="info-heading">Reach Us <em>Directly</em></h2>

            <a href="mailto:hello@globalscholarpublishing.com" className="info-card">
              <span className="info-photo">
                <img src="https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=200&h=200&fit=crop&auto=format&q=85" alt="Email us" loading="lazy" />
              </span>
              <div>
                <p className="info-label">Email Us</p>
                <p className="info-value">hello@globalscholarpublishing.com</p>
                <p className="info-value-sub">For general enquiries and submissions</p>
              </div>
            </a>

            <a href="tel:+442012345678" className="info-card">
              <span className="info-photo">
                <img src="https://images.unsplash.com/photo-1556656793-08538906a9f8?w=200&h=200&fit=crop&auto=format&q=85" alt="Call us" loading="lazy" />
              </span>
              <div>
                <p className="info-label">Call Us</p>
                <p className="info-value">+44 20 1234 5678</p>
                <p className="info-value-sub">Mon–Fri, 9:00 AM – 5:30 PM GMT</p>
              </div>
            </a>

            <a href="#map-location" className="info-card">
              <span className="info-photo">
                <img src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=200&h=200&fit=crop&auto=format&q=85" alt="Our office" loading="lazy" />
              </span>
              <div>
                <p className="info-label">Visit Us</p>
                <p className="info-value">124 City Road</p>
                <p className="info-value-sub">London, EC1V 2NX, United Kingdom</p>
              </div>
            </a>

            <div className="info-card" style={{ cursor: 'default' }}>
              <span className="info-photo">
                <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=200&h=200&fit=crop&auto=format&q=85" alt="Office hours" loading="lazy" />
              </span>
              <div>
                <p className="info-label">Office Hours</p>
                <p className="info-value">Monday – Friday</p>
                <p className="info-value-sub">9:00 AM – 5:30 PM GMT</p>
              </div>
            </div>

            <div className="social-row">
              <a href="#" className="social-btn">LinkedIn</a>
              <a href="#" className="social-btn">Twitter / X</a>
              <a href="#" className="social-btn">Instagram</a>
            </div>
          </div>

          {/* Form Column */}
          <div className="form-col">
            <h2 className="form-heading">Send Us a <em>Message</em></h2>
            <p className="form-sub">Fill out the form below and our editorial team will get back to you shortly.</p>

            <form id="contactForm" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input type="text" id="firstName" placeholder="John" required 
                    value={formData.firstName}
                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                    readOnly={!!session?.user?.name}
                    className={session?.user?.name ? "bg-gray-100 cursor-not-allowed" : ""}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input type="text" id="lastName" placeholder="Doe" required 
                    value={formData.lastName}
                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                    readOnly={!!session?.user?.name}
                    className={session?.user?.name ? "bg-gray-100 cursor-not-allowed" : ""}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input type="email" id="email" placeholder="john@example.com" required 
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    readOnly={!!session?.user?.email}
                    className={session?.user?.email ? "bg-gray-100 cursor-not-allowed" : ""}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input type="tel" id="phone" placeholder="+91 00000 00000" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full">
                  <label htmlFor="subject">I'm Reaching Out About</label>
                  <select id="subject" value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })}>
                    <option>Publishing a Paper / Thesis</option>
                    <option>Scholar Profile & Verification</option>
                    <option>Partnerships & Institutions</option>
                    <option>Media & Press</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full">
                  <label htmlFor="message">Your Message</label>
                  <textarea id="message" placeholder="Tell us a bit about what you need..." required
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                  ></textarea>
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={buttonState !== 'idle'}>
                {buttonState === 'idle' && 'Send Message'}
                {buttonState === 'sending' && 'Sending...'}
                {buttonState === 'sent' && 'Message Sent ✓'}
              </button>
              <p className="form-note">By submitting, you agree to our Privacy Policy. We'll never share your information.</p>
            </form>
          </div>

        </section>

        {/* ════════════════════════════════
            MAP SECTION
        ════════════════════════════════ */}
        <section className="map-section" id="map-location">
          <div className="map-wrap">
            <iframe
              src="https://www.google.com/maps?q=124+City+Road+London+UK&output=embed"
              allowFullScreen={false} loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              title="GSP Office Location">
            </iframe>
            <div className="map-card">
              <p className="map-card-label">Global Scholar Publications</p>
              <p className="map-card-text">124 City Road<br/>London, EC1V 2NX, United Kingdom</p>
              <a href="https://www.google.com/maps?q=124+City+Road+London+UK" target="_blank" className="map-card-link">
                Get Directions
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
