import { useNavigate } from 'react-router-dom';

export default function BlogCard({ post, index = 0 }) {
  const navigate = useNavigate();

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const coverStyle = {
    background: `linear-gradient(135deg, ${post.coverColor}33, ${post.coverColor}11)`,
  };

  const iconMap = {
    Backend: '⚙️',
    Frontend: '🎨',
    DevOps: '🚀',
    'System Design': '🏗️',
    'Best Practices': '✨',
    DSA: '🧮',
    Cloud: '☁️',
    Networking: '🌐',
  };

  return (
    <article
      className={`blog-card reveal stagger-${Math.min(index + 1, 6)}`}
      onClick={() => navigate(`/blog/${post.slug}`)}
      id={`blog-card-${post.slug}`}
    >
      <div className="blog-card__cover" style={coverStyle}>
        <div className="blog-card__cover-gradient">
          <span style={{ zIndex: 1, position: 'relative' }}>
            {iconMap[post.category] || '📝'}
          </span>
        </div>
        <span className="blog-card__category">{post.category}</span>
      </div>
      <div className="blog-card__body">
        <h3 className="blog-card__title">{post.title}</h3>
        <p className="blog-card__excerpt">{post.excerpt}</p>
        <div className="blog-card__meta">
          <div className="blog-card__meta-left">
            <span>📅 {formatDate(post.date || post.createdAt)}</span>
          </div>
          <span>⏱ {post.readingTime} min read</span>
        </div>
      </div>
      <div className="blog-card__tags">
        {post.tags.slice(0, 3).map(tag => (
          <span key={tag} className="tag">#{tag}</span>
        ))}
      </div>
    </article>
  );
}
