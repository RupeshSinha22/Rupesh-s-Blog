import ScrollReveal from '../components/ScrollReveal';

export default function About() {
  const skills = [
    { icon: '⚛️', name: 'React' },
    { icon: '🟢', name: 'Node.js' },
    { icon: '🔷', name: 'TypeScript' },
    { icon: '🐳', name: 'Docker' },
    { icon: '☁️', name: 'AWS' },
    { icon: '🗃️', name: 'PostgreSQL' },
    { icon: '🔥', name: 'Firebase' },
    { icon: '🎨', name: 'CSS / UI' },
  ];

  const timeline = [
    { year: '2024 — Present', title: 'Full Stack Developer', desc: 'Building scalable web applications with React, Node.js, and cloud services. Focused on performance and developer experience.' },
    { year: '2023', title: 'Started Writing', desc: 'Began sharing technical knowledge through blog posts covering system design, web development, and best practices.' },
    { year: '2022', title: 'Learned Web Development', desc: 'Deep-dived into full-stack development — from HTML/CSS fundamentals to React, databases, and deployment.' },
  ];

  return (
    <div className="about-page container page-enter" id="about-page">
      {/* Hero */}
      <section className="about-hero">
        <ScrollReveal>
          <h1 className="about-hero__name">
            Hey, I'm <span className="gradient-text-animated">Rupesh Kumar</span>
          </h1>
          <p className="about-hero__role">Full Stack Developer • Technical Writer • Builder</p>
          <p className="about-hero__bio">
            I'm passionate about building elegant software and sharing what I learn along the way.
            This blog is where I break down complex engineering topics into clear, practical articles
            that help developers level up their craft.
          </p>
        </ScrollReveal>
      </section>

      {/* Skills */}
      <section style={{ padding: 'var(--space-3xl) 0' }}>
        <ScrollReveal>
          <div className="section-header">
            <div className="section-header__label">Tech Stack</div>
            <h2 className="section-header__title">Tools I Work With</h2>
          </div>
        </ScrollReveal>
        <div className="skills-grid">
          {skills.map((skill, i) => (
            <ScrollReveal key={i}>
              <div className="skill-card">
                <div className="skill-card__icon">{skill.icon}</div>
                <div className="skill-card__name">{skill.name}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section style={{ padding: 'var(--space-3xl) 0' }}>
        <ScrollReveal>
          <div className="section-header">
            <div className="section-header__label">Journey</div>
            <h2 className="section-header__title">My Path</h2>
          </div>
        </ScrollReveal>
        <div className="timeline">
          {timeline.map((item, i) => (
            <ScrollReveal key={i}>
              <div className="timeline__item">
                <div className="timeline__dot" />
                <div className="timeline__year">{item.year}</div>
                <h3 className="timeline__title">{item.title}</h3>
                <p className="timeline__desc">{item.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Philosophy */}
      <section style={{ padding: 'var(--space-3xl) 0', textAlign: 'center' }}>
        <ScrollReveal>
          <div className="section-header">
            <div className="section-header__label">Philosophy</div>
            <h2 className="section-header__title">Why I Write</h2>
          </div>
          <p style={{ maxWidth: '700px', margin: '0 auto', color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.8 }}>
            I believe the best way to truly understand something is to explain it clearly.
            Every article I write is a chance to solidify my own knowledge while helping others
            avoid the pitfalls I've encountered. My goal is to create the kind of content I wish
            existed when I was learning — practical, no-fluff, and straight to the point.
          </p>
        </ScrollReveal>
      </section>
    </div>
  );
}
