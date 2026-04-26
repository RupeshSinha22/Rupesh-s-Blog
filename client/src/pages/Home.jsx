import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ParticleBackground from '../components/ParticleBackground';
import BlogCard from '../components/BlogCard';
import ScrollReveal from '../components/ScrollReveal';

const TYPEWRITER_TEXTS = [
  'Web Development',
  'System Design',
  'DevOps & Cloud',
  'Clean Architecture',
];

function useTypewriter(texts, speed = 80, pause = 2000) {
  const [display, setDisplay] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[textIndex];
    let timer;

    if (!deleting && charIndex < current.length) {
      timer = setTimeout(() => setCharIndex(c => c + 1), speed);
    } else if (!deleting && charIndex === current.length) {
      timer = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIndex > 0) {
      timer = setTimeout(() => setCharIndex(c => c - 1), speed / 2);
    } else if (deleting && charIndex === 0) {
      setDeleting(false);
      setTextIndex((textIndex + 1) % texts.length);
    }

    setDisplay(current.slice(0, charIndex));
    return () => clearTimeout(timer);
  }, [charIndex, deleting, textIndex, texts, speed, pause]);

  return display;
}

function useCountUp(target, duration = 2000, trigger = false) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const step = target / (duration / 16);
    const interval = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(interval);
  }, [target, duration, trigger]);

  return [count, ref];
}

export default function Home() {
  const typedText = useTypewriter(TYPEWRITER_TEXTS);
  const [featured, setFeatured] = useState([]);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  const [postCount] = useCountUp(6, 1500, statsVisible);
  const [topicCount] = useCountUp(5, 1500, statsVisible);
  const [minuteCount] = useCountUp(52, 1500, statsVisible);

  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState(null); // 'idle', 'loading', 'success', 'error'
  const [subscribeMessage, setSubscribeMessage] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!subscribeEmail) return;

    setSubscribeStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: subscribeEmail })
      });
      
      const data = await res.json();
      if (res.ok) {
        setSubscribeStatus('success');
        setSubscribeMessage('Thanks for subscribing!');
        setSubscribeEmail('');
      } else {
        setSubscribeStatus('error');
        setSubscribeMessage(data.error || 'Failed to subscribe.');
      }
    } catch (err) {
      setSubscribeStatus('error');
      setSubscribeMessage('Something went wrong. Please try again.');
    }
    
    setTimeout(() => {
      setSubscribeStatus('idle');
      setSubscribeMessage('');
    }, 5000);
  };

  useEffect(() => {
    fetch('/api/posts/featured')
      .then(r => r.json())
      .then(setFeatured)
      .catch(console.error);
  }, []);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Apply scroll reveal to all cards after render
  useEffect(() => {
    const cards = document.querySelectorAll('.blog-card.reveal');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    cards.forEach(c => observer.observe(c));
    return () => observer.disconnect();
  }, [featured]);

  const topics = [
    { icon: '⚛️', title: 'React & Frontend', desc: 'Modern UI frameworks, component patterns, and performance optimization.' },
    { icon: '🔧', title: 'Node.js & Backend', desc: 'API design, middleware patterns, database integration, and scaling.' },
    { icon: '🐳', title: 'DevOps & Docker', desc: 'Containerization, CI/CD pipelines, and cloud infrastructure.' },
    { icon: '🏗️', title: 'System Design', desc: 'Distributed systems, architecture decisions, and scalability patterns.' },
  ];

  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="hero" id="hero">
        <div className="aurora-mesh">
          <div className="aurora-mesh__blob aurora-mesh__blob--1" />
          <div className="aurora-mesh__blob aurora-mesh__blob--2" />
          <div className="aurora-mesh__blob aurora-mesh__blob--3" />
        </div>
        <ParticleBackground />
        <div className="hero__content">
          <div className="hero__badge">✨ Developer Blog & Articles</div>
          <h1 className="hero__title">
            Deep Dives into{' '}
            <span className="gradient-text-animated">{typedText}</span>
            <span className="typewriter-cursor" />
          </h1>
          <p className="hero__subtitle">
            Practical articles, system design breakdowns, and engineering insights
            crafted for developers who ship real products.
          </p>
          <div className="hero__actions">
            <Link to="/blog" className="btn btn--primary" id="hero-cta">
              Read Articles →
            </Link>
            <Link to="/about" className="btn btn--ghost" id="hero-about">
              About Me
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container" ref={statsRef}>
        <div className="stats" id="stats-section">
          <div className="stat">
            <div className="stat__number">{postCount}+</div>
            <div className="stat__label">In-depth Articles</div>
          </div>
          <div className="stat">
            <div className="stat__number">{topicCount}</div>
            <div className="stat__label">Topic Areas</div>
          </div>
          <div className="stat">
            <div className="stat__number">{minuteCount}</div>
            <div className="stat__label">Minutes of Reading</div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="container">
        <ScrollReveal>
          <div className="section-header">
            <div className="section-header__label">Featured</div>
            <h2 className="section-header__title">Latest Articles</h2>
          </div>
        </ScrollReveal>
        <div className="featured-grid" id="featured-posts">
          {featured.map((post, i) => (
            <BlogCard key={post.id} post={post} index={i} />
          ))}
        </div>
      </section>

      {/* Topics */}
      <section className="container topics" id="topics-section">
        <ScrollReveal>
          <div className="section-header">
            <div className="section-header__label">Explore</div>
            <h2 className="section-header__title">What I Write About</h2>
          </div>
        </ScrollReveal>
        <div className="topics__grid">
          {topics.map((t, i) => (
            <ScrollReveal key={i}>
              <div className="topic-card">
                <div className="topic-card__icon">{t.icon}</div>
                <h3 className="topic-card__title">{t.title}</h3>
                <p className="topic-card__desc">{t.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="container newsletter" id="newsletter">
        <ScrollReveal>
          <div className="newsletter__card">
            <div className="aurora-mesh" style={{ opacity: 0.3 }}>
              <div className="aurora-mesh__blob aurora-mesh__blob--1" />
              <div className="aurora-mesh__blob aurora-mesh__blob--2" />
            </div>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <h2 className="newsletter__title">Stay in the Loop</h2>
              <p className="newsletter__desc">
                Get notified about new articles on web dev, system design, and engineering best practices.
              </p>
              <form className="newsletter__form" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  className="newsletter__input"
                  placeholder="your@email.com"
                  id="newsletter-email"
                  value={subscribeEmail}
                  onChange={(e) => setSubscribeEmail(e.target.value)}
                  disabled={subscribeStatus === 'loading'}
                  required
                />
                <button 
                  type="submit" 
                  className="btn btn--primary" 
                  disabled={subscribeStatus === 'loading'}
                >
                  {subscribeStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
              {subscribeMessage && (
                <div style={{
                  marginTop: '1rem',
                  fontSize: '0.9rem',
                  color: subscribeStatus === 'success' ? 'var(--aurora-emerald)' : '#ef4444'
                }}>
                  {subscribeMessage}
                </div>
              )}
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
