// src/components/BlogHero.tsx
import React, { useEffect, useRef } from "react";
import { ArrowDown } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../translations/translations";

const BlogHero: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language].blog;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      opacity: number;
      pulse: number;
      pulseSpeed: number;

      constructor(canvasWidth: number, canvasHeight: number) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.pulse = 0;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;

        const colors = [
          "rgba(94, 234, 212,", // teal-300
          "rgba(239, 68, 68,", // red-500
          "rgba(99, 102, 241,", // indigo-500
          "rgba(168, 85, 247,", // purple-500
          "rgba(236, 72, 153,", // pink-500
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update(canvasWidth: number, canvasHeight: number) {
        this.x += this.speedX;
        this.y += this.speedY;
        this.pulse += this.pulseSpeed;

        if (this.x < 0 || this.x > canvasWidth) this.speedX *= -1;
        if (this.y < 0 || this.y > canvasHeight) this.speedY *= -1;
      }

      draw(ctx: CanvasRenderingContext2D) {
        const pulseFactor = Math.sin(this.pulse) * 0.3 + 0.7;
        const currentOpacity = this.opacity * pulseFactor;
        const currentSize = this.size * (1 + Math.sin(this.pulse) * 0.2);

        // Glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color + "1)";

        ctx.beginPath();
        ctx.arc(this.x, this.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = this.color + currentOpacity + ")";
        ctx.fill();

        ctx.shadowBlur = 0;
      }
    }

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const initParticles = () => {
      particles = [];
      const particleCount = Math.floor(
        (canvas.offsetWidth * canvas.offsetHeight) / 8000
      );
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(canvas.offsetWidth, canvas.offsetHeight));
      }
    };

    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            const opacity = (1 - distance / 100) * 0.15;
            ctx.strokeStyle = `rgba(94, 234, 212, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      drawConnections();

      particles.forEach((particle) => {
        particle.update(canvas.offsetWidth, canvas.offsetHeight);
        particle.draw(ctx);
      });

      animationId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    initParticles();
    animate();

    window.addEventListener("resize", () => {
      resizeCanvas();
      initParticles();
    });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  const scrollToPosts = () => {
    document
      .getElementById("blog-posts")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-[40vh] min-h-[320px] max-h-[450px] overflow-hidden bg-gradient-to-br from-indigo-950 via-[#140F2D] to-indigo-900">
      {/* Animated Background Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/4 h-[500px] w-[500px] animate-blob rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="animation-delay-2000 absolute -bottom-1/2 -right-1/4 h-[400px] w-[400px] animate-blob rounded-full bg-teal-500/20 blur-3xl" />
        <div className="animation-delay-4000 absolute left-1/3 top-1/3 h-[300px] w-[300px] animate-blob rounded-full bg-red-500/10 blur-3xl" />
      </div>

      {/* Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{ opacity: 0.8 }}
      />

      {/* Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(94, 234, 212, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(94, 234, 212, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-4 sm:px-6 lg:px-8 mt-12">
        {/* Glowing Badge */}
        <div className="mb-4 animate-pulse-slow">
          <span className="inline-flex items-center rounded-full border border-teal-400/30 bg-teal-500/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-teal-300 backdrop-blur-sm sm:text-sm">
            <span className="mr-2 h-2 w-2 animate-pulse rounded-full bg-teal-400" />
            {t.badge || "Tech Insights & Updates"}
          </span>
        </div>

        {/* Main Title with Neon Effect */}
        <h1 className="relative text-center">
          <span className="blog-title-glow block bg-gradient-to-r from-white via-teal-200 to-white bg-clip-text font-jakarta text-4xl font-light tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl py-4">
            {t.header1}
          </span>
          <span className="mt-1 block bg-gradient-to-r from-teal-300 via-indigo-400 to-red-400 bg-clip-text font-jakarta text-4xl font-light tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl">
            {t.header2}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 max-w-xl text-center font-jakarta text-sm font-light text-white/60 sm:text-base">
          {t.subtitle ||
            "Exploring the frontiers of web development, design, and digital innovation"}
        </p>

        {/* Scroll Indicator */}
        <button
          onClick={scrollToPosts}
          className="group mt-6 flex flex-col items-center gap-1 text-white/50 transition-colors hover:text-teal-300"
          aria-label="Scroll to posts"
        >
          <span className="text-xs uppercase tracking-widest">
            {t.explore || "Explore"}
          </span>
          <ArrowDown className="h-5 w-5 animate-bounce" />
        </button>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#140F2D] to-transparent" />

      {/* Decorative Lines */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-1 pb-2">
        <div className="h-[2px] w-16 animate-pulse-slow rounded-full bg-gradient-to-r from-transparent via-teal-400 to-transparent" />
        <div className="animation-delay-1000 h-[2px] w-8 animate-pulse-slow rounded-full bg-gradient-to-r from-transparent via-red-400 to-transparent" />
        <div className="animation-delay-2000 h-[2px] w-16 animate-pulse-slow rounded-full bg-gradient-to-r from-transparent via-indigo-400 to-transparent" />
      </div>
    </section>
  );
};

export default BlogHero;
