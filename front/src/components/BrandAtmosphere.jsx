import React, { useEffect, useRef, useState } from 'react';
import { contrastText, DEFAULT_LOGO, safeLogo } from '../utils/pageState';

export default function BrandAtmosphere({ logo = DEFAULT_LOGO, name = 'LocyTech', backgroundColor = '#080f20' }) {
  const canvasRef = useRef(null);
  const [available, setAvailable] = useState(Boolean(logo));
  const imageSource = safeLogo(logo);
  const defaultArtwork = imageSource === DEFAULT_LOGO;
  const lightBackdrop = contrastText(backgroundColor) === '#000000';

  useEffect(() => { setAvailable(Boolean(imageSource)); }, [imageSource]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!context) return undefined;
    let disposed = false;
    let frame;
    let width = 0;
    let height = 0;
    let lastFrame = 0;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const starColor = contrastText(backgroundColor) === '#ffffff' ? '#d8e5ff' : '#314867';
    const stars = Array.from({ length: 190 }, (_, index) => ({
      x: (index * 0.61803398875) % 1,
      y: (index * 0.41421356237 + 0.13) % 1,
      radius: index % 9 === 0 ? 1.1 : index % 3 === 0 ? 0.7 : 0.4,
      alpha: 0.25 + (index % 7) / 11
    }));

    function draw(timestamp = 0) {
      if (disposed) return;
      if (timestamp - lastFrame < 50 && !motion.matches) { frame = requestAnimationFrame(draw); return; }
      lastFrame = timestamp;
      context.clearRect(0, 0, width, height);
      context.fillStyle = starColor;
      for (const star of stars) {
        context.globalAlpha = star.alpha * (motion.matches ? 0.8 : 0.77 + Math.sin(timestamp * 0.00035 + star.x * 21) * 0.18);
        context.beginPath();
        context.arc(star.x * width, star.y * height, star.radius, 0, Math.PI * 2);
        context.fill();
      }
      context.globalAlpha = 1;
      if (!motion.matches) frame = requestAnimationFrame(draw);
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      context.setTransform(scale, 0, 0, scale, 0, 0);
      if (motion.matches) draw();
    }

    const observer = new ResizeObserver(resize);
    const motionChange = () => { cancelAnimationFrame(frame); draw(); };
    observer.observe(canvas);
    motion.addEventListener('change', motionChange);
    resize();
    draw();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      motion.removeEventListener('change', motionChange);
    };
  }, [backgroundColor]);

  return <section className="hub-brand" aria-label={`Identidade ${name}`}>
    <div className="brand-topline"><span className="brand-topline-dot" /><span>LOCYTECH</span></div>
    <canvas ref={canvasRef} className="brand-canvas" aria-hidden="true" />
    {available && imageSource ? <div className={`brand-artwork${defaultArtwork ? ' brand-artwork-default' : ''}${lightBackdrop ? ' is-light-backdrop' : ''}`}><img className="brand-logo" src={imageSource} alt={`Logo ${name || 'LocyTech'}`} decoding="async" onLoad={() => setAvailable(true)} onError={() => setAvailable(false)} /></div> : <div className="brand-fallback"><span className="brand-monogram">{(name || 'LT').slice(0, 2).toUpperCase()}</span><strong>{name || 'LocyTech'}</strong></div>}
    <div className="brand-caption"><p>Sites, landing pages e conexões.</p><span>Da primeira visita ao próximo projeto.</span></div>
  </section>;
}
