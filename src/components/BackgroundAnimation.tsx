import React, { useEffect, useRef } from 'react';

interface LogoParticle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
}

const BackgroundAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoRef = useRef<HTMLImageElement | null>(null);
  const particlesRef = useRef<LogoParticle[]>([]);
  const animationFrameRef = useRef<number>(0);
  const scrollSpeedRef = useRef<number>(0);
  const lastScrollTopRef = useRef<number>(0);

  useEffect(() => {
    // Load the logo image
    const logo = new Image();
    logo.src = 'https://waiting-wrist-6f6.notion.site/image/attachment%3Ab8293c93-0552-46e5-872a-de8c45ff1b00%3ALogomark_-_main_blue.png?table=block&id=19123043-5592-8045-958a-c49a71765622&spaceId=59ea08d2-bc07-4c80-b51a-dbd605835b75&width=440&userId=&cache=v2';
    logoRef.current = logo;

    // Initialize canvas and particles once the logo is loaded
    logo.onload = () => {
      initCanvas();
      createParticles();
      animate();
    };

    // Track scroll speed
    const handleScroll = () => {
      const currentScrollTop = window.scrollY;
      scrollSpeedRef.current = Math.abs(currentScrollTop - lastScrollTopRef.current) * 0.015; // Increased scroll sensitivity
      lastScrollTopRef.current = currentScrollTop;
      
      // Decay scroll speed gradually
      setTimeout(() => {
        scrollSpeedRef.current *= 0.9;
      }, 100);
    };

    window.addEventListener('scroll', handleScroll);

    // Handle window resize
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  };

  const createParticles = () => {
    const particles: LogoParticle[] = [];
    const particleCount = 15; // Adjust for more or fewer particles

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: 45 + Math.random() * 45, // Slightly larger size between 45 and 90
        speedX: (Math.random() - 0.5) * 0.35, // Increased horizontal movement speed
        speedY: (Math.random() - 0.5) * 0.35, // Increased vertical movement speed
        opacity: 0.25 + Math.random() * 0.35, // Increased opacity between 0.25 and 0.6
        rotation: Math.random() * 360, // Random initial rotation
        rotationSpeed: (Math.random() - 0.5) * 0.15 // Increased rotation speed
      });
    }

    particlesRef.current = particles;
  };

  const animate = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const logo = logoRef.current;

    if (canvas && ctx && logo) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current.forEach(particle => {
        // Apply scroll speed to particle movement
        const scrollFactor = 1 + scrollSpeedRef.current;
        
        // Update position with increased base speed
        particle.x += particle.speedX * scrollFactor;
        particle.y += particle.speedY * scrollFactor;
        
        // Update rotation
        particle.rotation += particle.rotationSpeed * scrollFactor;

        // Wrap around edges
        if (particle.x < -particle.size) particle.x = canvas.width + particle.size;
        if (particle.x > canvas.width + particle.size) particle.x = -particle.size;
        if (particle.y < -particle.size) particle.y = canvas.height + particle.size;
        if (particle.y > canvas.height + particle.size) particle.y = -particle.size;

        // Draw the logo with rotation
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate((particle.rotation * Math.PI) / 180);
        ctx.globalAlpha = particle.opacity;
        ctx.drawImage(
          logo,
          -particle.size / 2,
          -particle.size / 2,
          particle.size,
          particle.size
        );
        ctx.restore();
      });
    }

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.85 }} // Further increased overall opacity
    />
  );
};

export default BackgroundAnimation;
