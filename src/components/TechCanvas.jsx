import { useEffect, useRef } from "react";

export default function TechCanvas({ theme = "purple" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    // Color configurations
    const colors = {
      purple: {
        grid: "rgba(147, 51, 234, 0.04)",
        dots: "rgba(168, 85, 247, 0.15)",
        line: "rgba(192, 132, 252, 0.08)",
        glow: "rgba(147, 51, 234, 0.2)",
      },
      blue: {
        grid: "rgba(0, 191, 255, 0.03)",
        dots: "rgba(0, 191, 255, 0.12)",
        line: "rgba(0, 191, 255, 0.06)",
        glow: "rgba(0, 191, 255, 0.15)",
      },
      red: {
        grid: "rgba(255, 59, 59, 0.03)",
        dots: "rgba(255, 59, 59, 0.12)",
        line: "rgba(255, 59, 59, 0.06)",
        glow: "rgba(255, 59, 59, 0.15)",
      }
    };

    const currentColors = colors[theme] || colors.purple;

    // Create particles (data packets)
    const particles = [];
    const particleCount = 45;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.2,
      });
    }

    // Scanning laser
    let scanLineY = 0;
    const scanSpeed = 1.2;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw cyber grid
      const gridSize = 45;
      ctx.strokeStyle = currentColors.grid;
      ctx.lineWidth = 1;

      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw particles & connect lines
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce borders
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.fillStyle = currentColors.dots;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Connect close particles
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.15;
            ctx.strokeStyle = currentColors.line.replace(/[\d.]+\)$/, `${alpha})`);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      // Draw high-tech horizontal scanning laser
      scanLineY += scanSpeed;
      if (scanLineY > canvas.height) {
        scanLineY = 0;
      }

      const grad = ctx.createLinearGradient(0, scanLineY - 6, 0, scanLineY + 6);
      grad.addColorStop(0, "rgba(255, 255, 255, 0)");
      grad.addColorStop(0.5, currentColors.glow);
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.fillStyle = grad;
      ctx.fillRect(0, scanLineY - 8, canvas.width, 16);

      ctx.strokeStyle = currentColors.glow.replace("0.2", "0.6").replace("0.15", "0.6");
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, scanLineY);
      ctx.lineTo(canvas.width, scanLineY);
      ctx.stroke();

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
