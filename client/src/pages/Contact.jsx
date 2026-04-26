import { useState } from 'react';
import ScrollReveal from '../components/ScrollReveal';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [openFaq, setOpenFaq] = useState(null);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.message.trim()) errs.message = 'Message is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const faqs = [
    { q: 'Do you accept guest posts?', a: 'Currently, I write all content myself, but I\'m open to collaborations. Reach out with your idea and let\'s discuss!' },
    { q: 'Can I use your code snippets?', a: 'Absolutely! All code snippets in my articles are free to use in your projects. Attribution is appreciated but not required.' },
    { q: 'How often do you publish?', a: 'I aim for 2-3 in-depth articles per month. Quality over quantity — each article goes through multiple rounds of editing.' },
    { q: 'Do you offer consulting?', a: 'I occasionally take on consulting projects for system design and architecture reviews. Drop me a message with details.' },
  ];

  return (
    <div className="contact-page container page-enter" id="contact-page">
      <ScrollReveal>
        <div className="section-header" style={{ textAlign: 'left', marginBottom: 'var(--space-md)' }}>
          <div className="section-header__label">Get in Touch</div>
          <h1 className="section-header__title">Contact Me</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: 'var(--space-xl)' }}>
          Have a question, suggestion, or just want to say hello? I'd love to hear from you.
        </p>
      </ScrollReveal>

      <div className="contact-grid">
        {/* Form */}
        <ScrollReveal>
          {status === 'success' ? (
            <div className="form-success">
              <p style={{ fontSize: '1.5rem', marginBottom: 'var(--space-md)' }}>✅</p>
              <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>Message sent successfully!</p>
              <p style={{ marginTop: 'var(--space-sm)' }}>I'll get back to you as soon as possible.</p>
              <button className="btn btn--ghost" style={{ marginTop: 'var(--space-lg)' }} onClick={() => setStatus('idle')}>
                Send Another
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit} id="contact-form">
              <div className="form-group">
                <label htmlFor="contact-name">Name *</label>
                <input
                  id="contact-name"
                  type="text"
                  className={errors.name ? 'error' : ''}
                  value={form.name}
                  onChange={e => handleChange('name', e.target.value)}
                  placeholder="Your name"
                />
                {errors.name && <div className="form-error">{errors.name}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="contact-email">Email *</label>
                <input
                  id="contact-email"
                  type="email"
                  className={errors.email ? 'error' : ''}
                  value={form.email}
                  onChange={e => handleChange('email', e.target.value)}
                  placeholder="your@email.com"
                />
                {errors.email && <div className="form-error">{errors.email}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="contact-subject">Subject</label>
                <input
                  id="contact-subject"
                  type="text"
                  value={form.subject}
                  onChange={e => handleChange('subject', e.target.value)}
                  placeholder="What's this about?"
                />
              </div>
              <div className="form-group">
                <label htmlFor="contact-message">Message *</label>
                <textarea
                  id="contact-message"
                  className={errors.message ? 'error' : ''}
                  value={form.message}
                  onChange={e => handleChange('message', e.target.value)}
                  placeholder="Your message..."
                />
                {errors.message && <div className="form-error">{errors.message}</div>}
              </div>
              <button type="submit" className="btn btn--primary" disabled={status === 'sending'} style={{ width: '100%', justifyContent: 'center' }}>
                {status === 'sending' ? 'Sending...' : 'Send Message →'}
              </button>
              {status === 'error' && (
                <div className="form-error" style={{ textAlign: 'center', marginTop: 'var(--space-md)' }}>
                  Something went wrong. Please try again.
                </div>
              )}
            </form>
          )}
        </ScrollReveal>

        {/* Contact Info */}
        <div className="contact-info">
          <ScrollReveal>
            <div className="contact-info-card">
              <div className="contact-info-card__icon">📧</div>
              <div className="contact-info-card__title">Email</div>
              <div className="contact-info-card__value">rupuom7@gmail.com</div>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <div className="contact-info-card">
              <div className="contact-info-card__icon">📍</div>
              <div className="contact-info-card__title">Location</div>
              <div className="contact-info-card__value">India</div>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <div className="contact-info-card">
              <div className="contact-info-card__icon">🔗</div>
              <div className="contact-info-card__title">Social</div>
              <div className="contact-info-card__value">
                <a href="https://github.com/RupeshSinha22" target="_blank" rel="noopener noreferrer" style={{ marginRight: '12px' }}>GitHub</a>
                <a href="https://www.linkedin.com/in/rupesh-kumar-533a2723a/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <div className="contact-info-card">
              <div className="contact-info-card__icon">⏰</div>
              <div className="contact-info-card__title">Response Time</div>
              <div className="contact-info-card__value">Usually within 24-48 hours</div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* FAQ */}
      <section className="faq" id="faq-section">
        <ScrollReveal>
          <div className="section-header">
            <div className="section-header__label">FAQ</div>
            <h2 className="section-header__title">Frequently Asked Questions</h2>
          </div>
        </ScrollReveal>
        {faqs.map((faq, i) => (
          <ScrollReveal key={i}>
            <div className="faq-item">
              <button className="faq-item__question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                {faq.q}
                <span className={`faq-item__arrow ${openFaq === i ? 'open' : ''}`}>▼</span>
              </button>
              {openFaq === i && (
                <div className="faq-item__answer">{faq.a}</div>
              )}
            </div>
          </ScrollReveal>
        ))}
      </section>
    </div>
  );
}
