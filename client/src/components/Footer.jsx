import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer" id="site-footer">
      <div className="footer__grid">
        <div className="footer__brand">
          <h3>Rupesh's Blog</h3>
          <p>Exploring the frontiers of web development, system design, and software engineering — one article at a time.</p>
        </div>
        <div className="footer__col">
          <h4>Pages</h4>
          <Link to="/">Home</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div className="footer__col">
          <h4>Topics</h4>
          <Link to="/blog?tag=react">React</Link>
          <Link to="/blog?tag=nodejs">Node.js</Link>
          <Link to="/blog?tag=system-design">System Design</Link>
          <Link to="/blog?tag=docker">Docker</Link>
        </div>
        <div className="footer__col">
          <h4>Connect</h4>
          <a href="https://github.com/RupeshSinha22" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
          <a href="https://www.linkedin.com/in/rupesh-kumar-533a2723a/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
          <a href="mailto:rupuom7@gmail.com">Email</a>
        </div>
      </div>
      <div className="footer__bottom">
        <span>© {new Date().getFullYear()} Rupesh's Blog — Built with React & Express</span>
        <div className="footer__socials">
          <a href="https://github.com/RupeshSinha22" target="_blank" rel="noopener noreferrer" className="footer__social-link" aria-label="GitHub">⌨</a>
          <a href="https://www.linkedin.com/in/rupesh-kumar-533a2723a/" target="_blank" rel="noopener noreferrer" className="footer__social-link" aria-label="LinkedIn">in</a>
        </div>
      </div>
    </footer>
  );
}
