import { useState, useEffect } from 'react';

export default function TableOfContents({ content }) {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    // Parse headings from HTML content
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const h2s = doc.querySelectorAll('h2[id]');
    const items = Array.from(h2s).map(h => ({
      id: h.id,
      text: h.textContent,
    }));
    setHeadings(items);
  }, [content]);

  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      const headingElements = headings.map(h => document.getElementById(h.id)).filter(Boolean);
      const offset = 120; // Accounts for navbar and scroll-margin
      let currentActiveId = '';

      for (const el of headingElements) {
        const rect = el.getBoundingClientRect();
        // If the heading is above the offset line (plus a small buffer), it is our active candidate
        if (rect.top <= offset + 10) {
          currentActiveId = el.id;
        } else {
          // Headings are in order, so we can stop checking once we find one below the offset line
          break;
        }
      }

      if (currentActiveId !== activeId) {
        setActiveId(currentActiveId);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Trigger immediately to set initial state
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings, activeId]);

  if (headings.length === 0) return null;

  return (
    <nav className="toc" id="table-of-contents">
      <div className="toc__title">On this page</div>
      {headings.map(h => (
        <a
          key={h.id}
          href={`#${h.id}`}
          className={`toc__link ${activeId === h.id ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            const element = document.getElementById(h.id);
            if (element) {
              const y = element.getBoundingClientRect().top + window.scrollY - 100;
              window.scrollTo({ top: y, behavior: 'smooth' });
            }
          }}
        >
          {h.text}
        </a>
      ))}
    </nav>
  );
}
