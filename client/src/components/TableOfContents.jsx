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

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 }
    );

    headings.forEach(h => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

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
            document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          {h.text}
        </a>
      ))}
    </nav>
  );
}
