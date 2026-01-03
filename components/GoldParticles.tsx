import React, { useEffect, useRef } from 'react';

const GoldParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null); // Wrap in a div to observe visibility
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    
    // Low DPR for this effect is acceptable and much faster
    const dpr = Math.min(window.devicePixelRatio || 1, 1.2);
    
    const handleResize = () => {
      if (canvas.parentElement) {
        width = canvas.parentElement.offsetWidth;
        height = canvas.parentElement.offsetHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);

    const particles: Particle[] = [];
    // Significantly reduced particle count
    const PARTICLE_COUNT = width < 768 ? 20 : 50;

    class Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      color: string;
      alpha: number;
      baseAlpha: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2.0 + 0.5;
        this.speedY = Math.random() * 0.5 + 0.1; 
        
        const colors = ['#FFD700', '#DAA520', '#FFFACD', '#FCE6C9'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.baseAlpha = Math.random() * 0.5 + 0.1;
        this.alpha = this.baseAlpha;
      }

      update() {
        this.y -= this.speedY;

        // Interaction Check - Simplified
        const dx = this.x - mouseRef.current.x;
        const dy = this.y - mouseRef.current.y;
        
        // Bounding box check before sqrt
        if (Math.abs(dx) < 150 && Math.abs(dy) < 150) {
            const distanceSq = dx * dx + dy * dy;
            const maxDistSq = 22500; // 150*150
            
            if (distanceSq < maxDistSq) {
                const distance = Math.sqrt(distanceSq);
                const force = (150 - distance) / 150;
                
                this.x += (dx / distance) * force * 2;
                this.y += (dy / distance) * force * 2;
                this.alpha = Math.min(1, this.baseAlpha + 0.4);
            } else {
                this.alpha = this.baseAlpha;
            }
        } else {
            this.alpha = this.baseAlpha;
        }

        if (this.y < -10) {
            this.y = height + 10;
            this.x = Math.random() * width;
        }
        if (this.x > width) this.x = 0;
        if (this.x < 0) this.x = width;
      }

      draw() {
        if (!ctx) return;
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Remove simulated glow draw call for performance
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    let animationId: number;
    let isAnimating = false;

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      
      particles.forEach(p => {
          p.update();
          p.draw();
      });

      animationId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isAnimating) return; // Don't calculate if not visible
        const rect = canvas.getBoundingClientRect();
        mouseRef.current = { 
            x: e.clientX - rect.left, 
            y: e.clientY - rect.top 
        };
    };
    
    document.addEventListener('mousemove', handleMouseMove);

    // Performance: Intersection Observer to stop animation when not visible
    const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
            if (!isAnimating) {
                isAnimating = true;
                animate();
            }
        } else {
            isAnimating = false;
            cancelAnimationFrame(animationId);
        }
    });
    
    // We observe the canvas wrapper
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
        window.removeEventListener('resize', handleResize);
        document.removeEventListener('mousemove', handleMouseMove);
        cancelAnimationFrame(animationId);
        observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        <canvas 
          ref={canvasRef} 
          className="w-full h-full mix-blend-screen"
        />
    </div>
  );
};

export default GoldParticles;