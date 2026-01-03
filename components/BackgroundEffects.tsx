import React from 'react';

const BackgroundEffects = ({ theme = 'dark' }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    
    // Optimization: Limit DPR to 1 on mobile, max 1.5 on desktop
    const isMobile = width < 768;
    const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);

    // Reduced particle count for performance
    const PARTICLE_COUNT = isMobile ? 15 : 40; 
    const CONNECT_DISTANCE = isMobile ? 60 : 110;
    const CONNECT_DIST_SQ = CONNECT_DISTANCE * CONNECT_DISTANCE;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const isDark = theme === 'dark';
    const baseColors = isDark 
        ? ['#FFD700', '#D4AF37', '#B8860B']
        : ['#94a3b8', '#64748b'];

    // Pre-calculate stroke color base string to avoid operation in loop
    const strokeBase = isDark ? 'rgba(212, 175, 55, ' : 'rgba(148, 163, 184, ';

    const particles: Particle[] = [];

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.3; // Slower, smoother
        this.vy = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 2 + 0.5;
        this.color = baseColors[Math.floor(Math.random() * baseColors.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        // Rect is faster than Arc
        ctx.fillRect(this.x, this.y, this.size, this.size);
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    let animationFrameId: number;
    let isVisible = true;

    // Pause on tab switch
    const handleVisibilityChange = () => {
        isVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const animate = () => {
      if (!isVisible) {
          animationFrameId = requestAnimationFrame(animate);
          return;
      }

      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < particles.length; i++) {
        const pA = particles[i];
        pA.update();
        pA.draw();

        // Optimized Connection Loop
        for (let j = i + 1; j < particles.length; j++) {
          const pB = particles[j];
          const dx = pA.x - pB.x;
          
          // Quick check X axis
          if (dx > CONNECT_DISTANCE || dx < -CONNECT_DISTANCE) continue;

          const dy = pA.y - pB.y;
          // Quick check Y axis
          if (dy > CONNECT_DISTANCE || dy < -CONNECT_DISTANCE) continue;

          const distanceSq = dx * dx + dy * dy;
          
          if (distanceSq < CONNECT_DIST_SQ) {
            // Avoid sqrt if possible, approximate alpha
            const alpha = 1 - (distanceSq / CONNECT_DIST_SQ);
            
            if (alpha > 0.1) {
                ctx.strokeStyle = strokeBase + (alpha * 0.2) + ')';
                ctx.beginPath();
                ctx.moveTo(pA.x, pA.y);
                ctx.lineTo(pB.x, pB.y);
                ctx.stroke();
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
          width = window.innerWidth;
          height = window.innerHeight;
          canvas.width = width * dpr;
          canvas.height = height * dpr;
          ctx.scale(dpr, dpr);
          
          // Reset particles on resize to avoid stuck ones
          const newCount = width < 768 ? 15 : 40;
          particles.length = 0;
          for (let i = 0; i < newCount; i++) particles.push(new Particle());
      }, 200);
    };

    window.addEventListener('resize', handleResize);
    animate();

    return () => {
        window.removeEventListener('resize', handleResize);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        cancelAnimationFrame(animationFrameId);
        clearTimeout(resizeTimeout);
    };
  }, [theme]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }} 
    />
  );
};

export default BackgroundEffects;