import React, { useEffect, useRef, useState } from 'react';
import { contrastText, DEFAULT_LOGO, safeLogo } from '../utils/pageState';
import { normalizeDesign } from '../utils/pageDesign';

export default function BrandAtmosphere({ logo = DEFAULT_LOGO, name = 'Sua marca', backgroundColor = '#080f20', design: sourceDesign }) {
  const canvasRef = useRef(null);
  const [available, setAvailable] = useState(Boolean(logo));
  const imageSource = safeLogo(logo);
  const design = normalizeDesign(sourceDesign);

  useEffect(() => { setAvailable(Boolean(imageSource)); }, [imageSource]);

  useEffect(() => {
    if (design.backgroundStyle !== 'stars') return undefined;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!context) return undefined;
    let disposed = false;
    let frame;
    let width = 0;
    let height = 0;
    let lastFrame = 0;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const starColor = contrastText(backgroundColor);
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
  }, [backgroundColor, design.backgroundStyle]);

  return <section className="hub-brand" aria-label={`Identidade ${name}`}>
    {design.backgroundStyle === 'stars' && <canvas ref={canvasRef} className="brand-canvas" aria-hidden="true" />}
    {available && imageSource ? <div className="brand-artwork"><img className="brand-logo" src={imageSource} alt={`Logo ${name || 'da marca'}`} decoding="async" onLoad={() => setAvailable(true)} onError={() => setAvailable(false)} /></div> : <div className="brand-fallback"><span className="brand-monogram">{(name || 'SM').slice(0, 2).toUpperCase()}</span></div>}
  </section>;
}
