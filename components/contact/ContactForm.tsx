"use client";
import { useState } from "react";
import { contactFormData } from "@/data/contactData";

export default function ContactForm() {
  const [formType, setFormType] = useState('general');

  return (
    <section className="form-section">
      <div className="form-head reveal">
        <h2 className="form-h2">{contactFormData.titleStart} <em>{contactFormData.titleHighlight}</em></h2>
        <p className="form-sub">{contactFormData.subtitle}</p>
      </div>

      <div className="form-wrap reveal">
        <div className="form-tabs">
          {contactFormData.tabs.map((tab) => (
            <button 
              key={tab.id}
              className={`ftab ${formType === tab.id ? 'active' : ''}`}
              onClick={() => setFormType(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form className="contact-form">
          <div className="form-grid">
            {contactFormData.fields.map((field) => (
              <div key={field.id} className={`fg ${field.fullWidth ? 'full' : ''}`}>
                <label>{field.label}</label>
                {field.type === "textarea" ? (
                  <textarea placeholder={field.placeholder} required={field.required}></textarea>
                ) : (
                  <input type={field.type} placeholder={field.placeholder} required={field.required} />
                )}
              </div>
            ))}
          </div>
          <button type="submit" className="ct-submit">
            Send Message
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{marginLeft: '8px'}}><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <p className="form-note">By submitting this form, you agree to our Privacy Policy regarding data collection.</p>
        </form>
      </div>
    </section>
  );
}
