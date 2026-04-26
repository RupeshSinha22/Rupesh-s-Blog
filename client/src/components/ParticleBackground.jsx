import { useEffect, useRef } from 'react';

export default function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];

    const resize = () => {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };

    const createParticle = () => ({
      x: Math.random() * canvas.width,
      y: canvas.height + 10,
      size: Math.random() * 2.5 + 0.5,
      speedY: Math.random() * 0.8 + 0.2,
      speedX: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.2,
      hue: Math.random() > 0.5 ? 260 : 180,
    });

    const init = () => {
      resize();
      particles = Array.from({ length: 60 }, createParticle);
      particles.forEach(p => { p.y = Math.random() * canvas.height; });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.y -= p.speedY;
        p.x += p.speedX;

        if (p.y < -10) {
          particles[i] = createParticle();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, ${p.opacity})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    init();
    animate();
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="particles-canvas" />;
}
