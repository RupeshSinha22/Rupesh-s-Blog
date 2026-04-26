import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReadingProgress from '../components/ReadingProgress';
import TableOfContents from '../components/TableOfContents';
import BlogCard from '../components/BlogCard';

export default function Post() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);
    fetch(`/api/posts/${slug}`)
      .then(r => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then(data => {
        setPost(data);
        setLoading(false);
        document.title = `${data.title} | Rupesh's Blog`;
      })
      .catch(() => setLoading(false));
  }, [slug]);

  // Scroll reveal for related cards
  useEffect(() => {
    if (loading || !post) return;
    const cards = document.querySelectorAll('.blog-card.reveal:not(.visible)');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
      }),
      { threshold: 0.1 }
    );
    cards.forEach(c => observer.observe(c));
    return () => observer.disconnect();
  }, [post, loading]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  if (loading) {
    return (
      <div className="post-page">
        <div className="loader"><div className="loader__spinner" /></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="post-page container" style={{ textAlign: 'center', paddingTop: '200px' }}>
        <h2>Article not found</h2>
        <p style={{ color: 'var(--text-secondary)', margin: 'var(--space-md) 0' }}>
          The article you're looking for doesn't exist.
        </p>
        <Link to="/blog" className="btn btn--primary">Browse Articles</Link>
      </div>
    );
  }

  return (
    <div className="post-page page-enter" id="post-page">
      <ReadingProgress />

      {/* Post Hero */}
      <div className="container">
        <div className="post-hero">
          <span className="post-hero__category">{post.category}</span>
          <h1 className="post-hero__title">{post.title}</h1>
          <div className="post-hero__meta">
            <span className="post-hero__meta-item">👤 {post.author.name}</span>
            <span className="post-hero__meta-item">📅 {formatDate(post.date)}</span>
            <span className="post-hero__meta-item">⏱ {post.readingTime} min read</span>
          </div>
        </div>
      </div>

      {/* Content + TOC */}
      <div className="post-content-layout">
        <article className="post-content" id="post-content">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />

          {/* Tags */}
          <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', marginTop: 'var(--space-2xl)' }}>
            {post.tags.map(tag => (
              <Link key={tag} to={`/blog?tag=${tag}`} className="tag" style={{ textDecoration: 'none' }}>
                #{tag}
              </Link>
            ))}
          </div>

          {/* Share */}
          <div className="share-buttons">
            <button className="share-btn" onClick={handleCopyLink} id="copy-link-btn">
              {copied ? '✅ Copied!' : '🔗 Copy Link'}
            </button>
            <a
              className="share-btn"
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              in Share
            </a>
          </div>

          {/* Author Card */}
          <div className="author-card" id="author-card">
            <div className="author-card__avatar">
              {post.author.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="author-card__name">{post.author.name}</div>
              <div className="author-card__role">{post.author.role}</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 'var(--space-sm)' }}>
                Writing about web development, system design, and the craft of building great software.
              </p>
            </div>
          </div>
        </article>

        {/* Sidebar TOC */}
        <aside>
          <TableOfContents content={post.content} />
        </aside>
      </div>

      {/* Related Posts */}
      {post.related && post.related.length > 0 && (
        <div className="container related-posts" id="related-posts">
          <h2 style={{ marginBottom: 'var(--space-xl)' }}>Related Articles</h2>
          <div className="related-posts__grid">
            {post.related.map((rp, i) => (
              <BlogCard key={rp.id} post={rp} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
