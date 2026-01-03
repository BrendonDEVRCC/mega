import React from 'react';

const GridBackground = ({ theme = 'dark' }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const mouseRef = React.useRef({ x: -1000, y: -1000 }); // Start off-screen

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true }); // Alpha true for transparency
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationId: number;
    // Force 1.0 DPR for performance on this effect as it's just lines
    const dpr = 1; 

    const handleResize = () => {
      if (containerRef.current) {
          width = containerRef.current.offsetWidth;
          height = containerRef.current.offsetHeight;
          canvas.width = width * dpr;
          canvas.height = height * dpr;
          ctx.scale(dpr, dpr);
          canvas.style.width = `${width}px`;
          canvas.style.height = `${height}px`;
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    const gridSize = 40;
    const isDark = theme === 'dark';

    const animate = () => {
      // Clear only the area around the mouse from previous frame could be an optimization,
      // but clearing full canvas is fast enough if we don't draw much.
      ctx.clearRect(0, 0, width, height);

      // OPTIMIZATION: Only loop through grid points NEAR the mouse.
      // We calculate a bounding box around the mouse.
      const range = 160; // Slightly larger than effect radius
      
      // Snap start/end to grid
      const startX = Math.max(0, Math.floor((mouseRef.current.x - range) / gridSize) * gridSize);
      const endX = Math.min(width, Math.ceil((mouseRef.current.x + range) / gridSize) * gridSize);
      
      const canvasRect = canvas.getBoundingClientRect();
      // Mouse Y is relative to viewport, adjust to canvas
      const relativeMouseY = mouseRef.current.y - canvasRect.top;
      
      const startY = Math.max(0, Math.floor((relativeMouseY - range) / gridSize) * gridSize);
      const endY = Math.min(height, Math.ceil((relativeMouseY + range) / gridSize) * gridSize);

      ctx.lineWidth = 1;

      for (let x = startX; x <= endX; x += gridSize) {
        for (let y = startY; y <= endY; y += gridSize) {
           const dx = x - mouseRef.current.x;
           const dy = y - relativeMouseY;
           // Simple distance check without sqrt first
           if (Math.abs(dx) > 150 || Math.abs(dy) > 150) continue;

           const distSq = dx*dx + dy*dy;
           if (distSq > 22500) continue; // 150^2

           const dist = Math.sqrt(distSq);
           const alpha = 0.5 * (1 - dist / 150);

           if (alpha <= 0.01) continue;

           // Color logic
           if (isDark) {
               ctx.strokeStyle = `rgba(212, 175, 55, ${alpha})`;
           } else {
               ctx.strokeStyle = `rgba(50, 50, 50, ${alpha * 1.5})`;
           }
           
           // Draw horizontal segment part
           ctx.beginPath();
           ctx.moveTo(x - 10, y);
           ctx.lineTo(x + 10, y);
           ctx.stroke();

           // Draw vertical segment part
           ctx.beginPath();
           ctx.moveTo(x, y - 10);
           ctx.lineTo(x, y + 10);
           ctx.stroke();

           // Cross at intersection
           if (dist < 100) {
               ctx.fillStyle = isDark ? `rgba(255, 255, 255, ${alpha * 2})` : `rgba(212, 175, 55, ${alpha * 2})`;
               ctx.fillRect(x - 1, y - 1, 2, 2);
           }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
        mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    
    // Only listen when hovering the container or window if simpler
    window.addEventListener('mousemove', handleMouseMove);
    
    // Check intersection to pause animation when not visible
    const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
            animate();
        } else {
            cancelAnimationFrame(animationId);
        }
    });
    
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        cancelAnimationFrame(animationId);
        observer.disconnect();
    };
  }, [theme]);

  // CSS Grid for the static part (Performant)
  const gridColor = theme === 'dark' ? 'rgba(212, 175, 55, 0.05)' : 'rgba(0, 0, 0, 0.05)';

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
        {/* Static CSS Grid */}
        <div 
            className="absolute inset-0 w-full h-full"
            style={{
                backgroundImage: `linear-gradient(to right, ${gridColor} 1px, transparent 1px), linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
            }}
        />
        {/* Dynamic Canvas Layer */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};

export default GridBackground;