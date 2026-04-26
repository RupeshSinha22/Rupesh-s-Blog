import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults([]);
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/posts?search=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
        setActiveIndex(0);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[activeIndex]) {
      navigate(`/blog/${results[activeIndex].slug}`);
      onClose();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="search-overlay" onClick={(e) => e.target === e.currentTarget && onClose()} id="search-modal">
      <div className="search-modal">
        <div className="search-modal__input-wrapper">
          <span className="search-modal__icon">🔍</span>
          <input
            ref={inputRef}
            className="search-modal__input"
            type="text"
            placeholder="Search articles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            id="search-input"
          />
          <kbd style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', padding: '2px 8px', background: 'var(--bg-tertiary)', borderRadius: '4px', color: 'var(--text-tertiary)', cursor: 'pointer' }} onClick={onClose}>ESC</kbd>
        </div>

        <div className="search-modal__results">
          {loading && (
            <div className="search-modal__empty">Searching...</div>
          )}
          {!loading && query && results.length === 0 && (
            <div className="search-modal__empty">
              <p>No results found for "{query}"</p>
            </div>
          )}
          {!loading && results.map((post, i) => (
            <div
              key={post.id}
              className={`search-result ${i === activeIndex ? 'active' : ''}`}
              onClick={() => {
                navigate(`/blog/${post.slug}`);
                onClose();
              }}
              onMouseEnter={() => setActiveIndex(i)}
            >
              <span className="search-result__title">{post.title}</span>
              <span className="search-result__excerpt">{post.excerpt.slice(0, 80)}...</span>
            </div>
          ))}
          {!query && (
            <div className="search-modal__empty">
              <p>Start typing to search articles</p>
            </div>
          )}
        </div>

        <div className="search-modal__footer">
          <span><kbd>↑↓</kbd> Navigate</span>
          <span><kbd>↵</kbd> Open</span>
          <span><kbd>esc</kbd> Close</span>
        </div>
      </div>
    </div>
  );
}
