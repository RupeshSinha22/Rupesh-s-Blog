import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function Header({ onSearchOpen }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/blog', label: 'Blog' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header__inner">
        <Link to="/" className="header__logo" id="site-logo">
          Rupesh's <span>Blog</span>
        </Link>

        <nav className={`header__nav ${menuOpen ? 'open' : ''}`} id="main-nav">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`header__link ${location.pathname === link.to ? 'active' : ''}`}
              id={`nav-${link.label.toLowerCase()}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header__actions">
          <button className="header__search-btn" onClick={onSearchOpen} id="search-trigger">
            <span>🔍</span>
            <span>Search</span>
            <kbd>⌘K</kbd>
          </button>

          <button className="theme-toggle" onClick={toggleTheme} id="theme-toggle" aria-label="Toggle theme">
            <div className="theme-toggle__indicator">
              {theme === 'dark' ? '🌙' : '☀️'}
            </div>
          </button>

          <button
            className="header__menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            id="menu-toggle"
            aria-label="Toggle menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </header>
  );
}
