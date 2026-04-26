import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = '/api';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', content: '', category: 'Frontend',
    tags: '', coverColor: '#7c3aed', readingTime: 5, featured: false,
  });
  const [status, setStatus] = useState('idle');
  const navigate = useNavigate();

  const categories = ['Frontend', 'Backend', 'DevOps', 'DSA', 'System Design', 'Cloud', 'Networking', 'Best Practices'];

  // Check if user has a valid token on mount
  useEffect(() => {
    const token = sessionStorage.getItem('admin_token');
    if (!token) {
      setAuthChecking(false);
      return;
    }

    fetch(`${API_BASE}/auth/verify`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        if (data.valid) {
          setIsAuthenticated(true);
        } else {
          sessionStorage.removeItem('admin_token');
        }
        setAuthChecking(false);
      })
      .catch(() => {
        sessionStorage.removeItem('admin_token');
        setAuthChecking(false);
      });
  }, []);

  useEffect(() => {
    if (isAuthenticated) loadPosts();
  }, [isAuthenticated]);

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`,
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAuthError(data.error || 'Login failed');
        setAuthLoading(false);
        return;
      }

      sessionStorage.setItem('admin_token', data.token);
      setIsAuthenticated(true);
      setPassword('');
    } catch {
      setAuthError('Network error. Please try again.');
    }
    setAuthLoading(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setPosts([]);
  };

  const loadPosts = async () => {
    const res = await fetch(`${API_BASE}/posts`);
    setPosts(await res.json());
  };

  const generateSlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleChange = (field, value) => {
    const updates = { [field]: value };
    if (field === 'title' && !editing) updates.slug = generateSlug(value);
    setForm(prev => ({ ...prev, ...updates }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('saving');
    const payload = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean), readingTime: Number(form.readingTime) };

    try {
      const url = editing ? `${API_BASE}/posts/${editing}` : `${API_BASE}/posts`;
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: getAuthHeaders(), body: JSON.stringify(payload) });

      if (res.status === 401) {
        setIsAuthenticated(false);
        sessionStorage.removeItem('admin_token');
        return;
      }

      if (!res.ok) { const err = await res.json(); throw new Error(err.error); }
      setStatus('saved');
      setEditing(null);
      setForm({ title: '', slug: '', excerpt: '', content: '', category: 'Frontend', tags: '', coverColor: '#7c3aed', readingTime: 5, featured: false });
      loadPosts();
      setTimeout(() => setStatus('idle'), 2000);
    } catch (err) {
      setStatus('error');
      alert(err.message);
    }
  };

  const handleEdit = (post) => {
    setEditing(post.slug);
    setForm({ title: post.title, slug: post.slug, excerpt: post.excerpt, content: '', category: post.category, tags: post.tags.join(', '), coverColor: post.coverColor, readingTime: post.readingTime, featured: post.featured });
    window.scrollTo(0, 0);
  };

  const handleDelete = async (slug) => {
    if (!confirm('Delete this post?')) return;
    const res = await fetch(`${API_BASE}/posts/${slug}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (res.status === 401) {
      setIsAuthenticated(false);
      sessionStorage.removeItem('admin_token');
      return;
    }
    loadPosts();
  };

  // Loading state
  if (authChecking) {
    return (
      <div className="blog-page container page-enter" id="admin-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div className="loader"><div className="loader__spinner" /></div>
      </div>
    );
  }

  // Login gate
  if (!isAuthenticated) {
    return (
      <div className="blog-page container page-enter" id="admin-login-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div className="admin-login-card">
          <div className="admin-login-card__header">
            <div className="admin-login-card__icon">🔐</div>
            <h1 className="admin-login-card__title">
              <span className="gradient-text-animated">Admin</span> Access
            </h1>
            <p className="admin-login-card__desc">Enter your password to manage blog posts.</p>
          </div>

          <form onSubmit={handleLogin} className="admin-login-card__form">
            <div className="form-group">
              <label htmlFor="admin-password">Password</label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter admin password"
                autoFocus
                required
              />
            </div>

            {authError && (
              <div className="admin-login-card__error">
                <span>⚠️</span> {authError}
              </div>
            )}

            <button type="submit" className="btn btn--primary" disabled={authLoading} style={{ width: '100%', justifyContent: 'center' }}>
              {authLoading ? 'Authenticating...' : 'Login →'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Admin panel (authenticated)
  return (
    <div className="blog-page container page-enter" id="admin-page">
      <div className="blog-page__header" style={{ marginBottom: 'var(--space-xl)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
        <div>
          <h1 className="blog-page__title">
            <span className="gradient-text-animated">Admin</span> Panel
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Create, edit, and manage your blog posts.</p>
        </div>
        <button className="btn btn--ghost" onClick={handleLogout} id="admin-logout-btn" style={{ marginTop: 'var(--space-sm)' }}>
          🚪 Logout
        </button>
      </div>

      {/* Post Form */}
      <form className="contact-form" onSubmit={handleSubmit} style={{ marginBottom: 'var(--space-2xl)' }}>
        <h3 style={{ marginBottom: 'var(--space-lg)' }}>{editing ? '✏️ Edit Post' : '✨ New Post'}</h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
          <div className="form-group">
            <label>Title *</label>
            <input value={form.title} onChange={e => handleChange('title', e.target.value)} placeholder="Post title" required />
          </div>
          <div className="form-group">
            <label>Slug *</label>
            <input value={form.slug} onChange={e => handleChange('slug', e.target.value)} placeholder="url-friendly-slug" required />
          </div>
        </div>

        <div className="form-group">
          <label>Excerpt</label>
          <input value={form.excerpt} onChange={e => handleChange('excerpt', e.target.value)} placeholder="Brief description" />
        </div>

        <div className="form-group">
          <label>Content (HTML) *</label>
          <textarea value={form.content} onChange={e => handleChange('content', e.target.value)} placeholder="<h2>Your content here</h2><p>Write in HTML...</p>" style={{ minHeight: '250px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }} required={!editing} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 'var(--space-md)' }}>
          <div className="form-group">
            <label>Category</label>
            <select value={form.category} onChange={e => handleChange('category', e.target.value)} style={{ width: '100%', padding: 'var(--space-md)', background: 'var(--bg-secondary)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Tags (comma separated)</label>
            <input value={form.tags} onChange={e => handleChange('tags', e.target.value)} placeholder="react, hooks, frontend" />
          </div>
          <div className="form-group">
            <label>Reading Time (min)</label>
            <input type="number" value={form.readingTime} onChange={e => handleChange('readingTime', e.target.value)} min="1" />
          </div>
          <div className="form-group">
            <label>Cover Color</label>
            <input type="color" value={form.coverColor} onChange={e => handleChange('coverColor', e.target.value)} style={{ height: '42px', padding: '4px' }} />
          </div>
        </div>

        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <label style={{ marginBottom: 0 }}>
            <input type="checkbox" checked={form.featured} onChange={e => handleChange('featured', e.target.checked)} style={{ marginRight: '8px' }} />
            Featured Post
          </label>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
          <button type="submit" className="btn btn--primary" disabled={status === 'saving'}>
            {status === 'saving' ? 'Saving...' : status === 'saved' ? '✅ Saved!' : editing ? 'Update Post' : 'Publish Post'}
          </button>
          {editing && (
            <button type="button" className="btn btn--ghost" onClick={() => { setEditing(null); setForm({ title: '', slug: '', excerpt: '', content: '', category: 'Frontend', tags: '', coverColor: '#7c3aed', readingTime: 5, featured: false }); }}>
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Posts List */}
      <h3 style={{ marginBottom: 'var(--space-lg)' }}>📝 All Posts ({posts.length})</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {posts.map(post => (
          <div key={post.slug} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-md) var(--space-lg)', background: 'var(--bg-card)', border: '1px solid rgba(124,58,237,0.1)', borderRadius: 'var(--radius-md)' }}>
            <div>
              <strong style={{ cursor: 'pointer' }} onClick={() => navigate(`/blog/${post.slug}`)}>{post.title}</strong>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                {post.category} • {post.readingTime}min • {post.tags.join(', ')} {post.featured && '⭐'}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
              <button className="share-btn" onClick={() => handleEdit(post)}>✏️ Edit</button>
              <button className="share-btn" onClick={() => handleDelete(post.slug)} style={{ color: '#ef4444' }}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
