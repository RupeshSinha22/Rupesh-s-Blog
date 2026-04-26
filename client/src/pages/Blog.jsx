import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import BlogCard from '../components/BlogCard';
import TagFilter from '../components/TagFilter';
import ScrollReveal from '../components/ScrollReveal';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('latest');
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTag = searchParams.get('tag') || '';

  useEffect(() => {
    fetch('/api/posts/tags')
      .then(r => r.json())
      .then(setTags)
      .catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (activeTag) params.set('tag', activeTag);
    if (sort) params.set('sort', sort);

    fetch(`/api/posts?${params.toString()}`)
      .then(r => r.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [activeTag, sort]);

  // Scroll reveal for dynamically loaded cards
  useEffect(() => {
    if (loading) return;
    const cards = document.querySelectorAll('.blog-card.reveal:not(.visible)');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
      }),
      { threshold: 0.1 }
    );
    cards.forEach(c => observer.observe(c));
    return () => observer.disconnect();
  }, [posts, loading]);

  const handleTagChange = (tag) => {
    if (tag) {
      setSearchParams({ tag });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="blog-page container page-enter" id="blog-page">
      <div className="blog-page__header">
        <ScrollReveal>
          <h1 className="blog-page__title">
            All <span className="gradient-text-animated">Articles</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
            Deep dives into web development, system design, and engineering best practices.
          </p>
        </ScrollReveal>
      </div>

      <div className="blog-page__controls">
        <TagFilter tags={tags} activeTag={activeTag} onTagChange={handleTagChange} />
        <select
          className="blog-page__sort"
          value={sort}
          onChange={e => setSort(e.target.value)}
          id="sort-select"
        >
          <option value="latest">Latest First</option>
          <option value="oldest">Oldest First</option>
          <option value="title">By Title</option>
        </select>
      </div>

      {loading ? (
        <div className="loader"><div className="loader__spinner" /></div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-4xl)', color: 'var(--text-tertiary)' }}>
          <p style={{ fontSize: '1.2rem' }}>No articles found</p>
          <p style={{ marginTop: 'var(--space-sm)' }}>Try a different tag or clear the filter.</p>
        </div>
      ) : (
        <div className="blog-grid" id="blog-grid">
          {posts.map((post, i) => (
            <BlogCard key={post.id} post={post} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
