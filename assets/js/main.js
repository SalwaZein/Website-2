const parallaxElements = document.querySelectorAll('[data-parallax]');
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

parallaxElements.forEach(element => observer.observe(element));

const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
reduceMotionQuery.addEventListener('change', () => window.location.reload());
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
const particleCount = 80;
let mouse = { x: innerWidth / 2, y: innerHeight / 2 };

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

if (!reduceMotionQuery.matches) {
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
}

function createParticle(x, y) {
  return {
    x,
    y,
    size: Math.random() * 3 + 1,
    speedX: (Math.random() - 0.5) * 0.6,
    speedY: (Math.random() - 0.5) * 0.6,
    alpha: 1,
    hue: Math.random() > 0.5 ? 172 : 43,
  };
}

if (!reduceMotionQuery.matches) {
  for (let i = 0; i < particleCount; i++) {
    particles.push(createParticle(Math.random() * canvas.width, Math.random() * canvas.height));
  }

  window.addEventListener('mousemove', event => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    for (let i = 0; i < 6; i++) {
      particles.push(createParticle(mouse.x, mouse.y));
    }
  });

  window.addEventListener('touchmove', event => {
    const touch = event.touches[0];
    if (!touch) return;
    mouse.x = touch.clientX;
    mouse.y = touch.clientY;
    for (let i = 0; i < 4; i++) {
      particles.push(createParticle(mouse.x, mouse.y));
    }
  });

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((particle, index) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      particle.alpha -= 0.005;

      if (particle.alpha <= 0) {
        particles.splice(index, 1);
        return;
      }

      ctx.beginPath();
      ctx.fillStyle = `hsla(${particle.hue}, 70%, 65%, ${particle.alpha})`;
      ctx.shadowBlur = 12;
      ctx.shadowColor = `hsla(${particle.hue}, 70%, 65%, ${particle.alpha})`;
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });

    if (particles.length < particleCount) {
      particles.push(createParticle(Math.random() * canvas.width, Math.random() * canvas.height));
    }

    requestAnimationFrame(drawParticles);
  }

  drawParticles();
} else {
  canvas.remove();
}

const parallaxTargets = document.querySelectorAll('.geometry, .mindset-split, .process-step, .quote-wrap, .final-cta');

function updateParallax() {
  if (reduceMotionQuery.matches) return;

  parallaxTargets.forEach(target => {
    const rect = target.getBoundingClientRect();
    const offset = rect.top + rect.height / 2;
    const speed = target.classList.contains('geometry') ? 0.08 : 0.05;
    const translateY = (offset - window.innerHeight / 2) * speed;
    target.style.transform = `translateY(${translateY}px)`;
  });

  requestAnimationFrame(updateParallax);
}

updateParallax();

const navLinks = document.querySelectorAll('nav a, .footer a');
navLinks.forEach(link => {
  if (!link.hash || link.hash.length <= 1) return;
  link.addEventListener('click', event => {
    const target = document.querySelector(link.hash);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
