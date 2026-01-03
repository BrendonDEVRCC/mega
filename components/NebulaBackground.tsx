import React from 'react';

const NebulaBackground = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    let time = 0;
    let animationId: number;

    const handleResize = () => {
      if(canvas.parentElement) {
          width = canvas.parentElement.offsetWidth;
          height = canvas.parentElement.offsetHeight;
          const dpr = 1; // Strict 1.0 DPR for performance
          canvas.width = width * dpr;
          canvas.height = height * dpr;
          ctx.scale(dpr, dpr);
      }
    };
    
    handleResize();

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(handleResize, 500);
    };
    window.addEventListener('resize', onResize);

    const animate = () => {
      time += 0.001; 
      
      ctx.fillStyle = '#050200';
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = 'lighter';
      
      for (let i = 1; i <= 2; i++) {
        ctx.beginPath();
        const scale = i * 60;
        
        // Increased step to 100 for fewer draw calls
        const step = 100;
        for (let x = 0; x <= width + step; x += step) {
           const y = height / 2 + 
                     Math.sin(x / 400 + time * i) * scale;
           
           if (x === 0) ctx.moveTo(x, y);
           else ctx.lineTo(x, y);
        }

        ctx.strokeStyle = i === 1 ? `rgba(212, 175, 55, 0.08)` : `rgba(184, 134, 11, 0.05)`;
        ctx.lineWidth = 80;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      ctx.globalCompositeOperation = 'source-over';
      animationId = requestAnimationFrame(animate);
    };

    // Intersection Observer
    const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
            animate();
        } else {
            cancelAnimationFrame(animationId);
        }
    });

    if (canvas) observer.observe(canvas);

    return () => {
        window.removeEventListener('resize', onResize);
        cancelAnimationFrame(animationId);
        observer.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
};

export default NebulaBackground;