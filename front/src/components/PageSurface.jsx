import React from 'react';
import { contrastText } from '../utils/pageState';
import { normalizeDesign } from '../utils/pageDesign';
import '../styles/pageDesign.css';

const fonts = { sans: "'DM Sans', sans-serif", modern: "'Manrope', sans-serif", serif: "Georgia, 'Times New Roman', serif" };

function readableColor(color, background, ink) {
  const luminance = hex => {
    const values = hex.slice(1).match(/.{2}/g).map(value => parseInt(value, 16) / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
    return values[0] * .2126 + values[1] * .7152 + values[2] * .0722;
  };
  const first = luminance(color);
  const second = luminance(background);
  return (Math.max(first, second) + .05) / (Math.min(first, second) + .05) >= 4.5 ? color : ink;
}

export function PageSurface({ page, children, className = '' }) {
  const design = normalizeDesign(page.design);
  const primary = /^#[\da-f]{6}$/i.test(page.primaryColor || '') ? page.primaryColor : '#4d8dff';
  const accent = /^#[\da-f]{6}$/i.test(page.accentColor || '') ? page.accentColor : '#f4cf46';
  const background = /^#[\da-f]{6}$/i.test(page.backgroundColor || '') ? page.backgroundColor : '#080f20';
  const ink = contrastText(background);
  const style = {
    '--brand-primary': primary,
    '--brand-accent': accent,
    '--page-background': background,
    '--brand-ink': ink,
    '--on-primary': contrastText(primary),
    '--on-accent': contrastText(accent),
    '--primary-readable': readableColor(primary, background, ink),
    '--accent-readable': readableColor(accent, background, ink),
    '--page-font': fonts[design.fontFamily],
    '--page-scale': design.textScale / 100,
    '--page-radius': `${design.radius}px`,
    '--page-gap': `${design.gap}px`,
    '--page-logo-size': `${design.logoSize}px`
  };
  return <div className={`client-page ${className}`.trim()} style={style} data-layout={design.layout} data-card-style={design.cardStyle} data-background-style={design.backgroundStyle} data-font={design.fontFamily} data-logo-shape={design.logoShape} data-align={design.align} data-icons={design.showIcons} data-descriptions={design.showDescriptions} data-arrows={design.showArrows}>{children}</div>;
}

export default PageSurface;
