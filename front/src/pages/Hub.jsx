import React, { useId } from 'react';
import BrandAtmosphere from '../components/BrandAtmosphere';
import Icon from '../components/Icon';
import { safeUrl, socialDefaults } from '../utils/pageState';
import { normalizeDesign } from '../utils/pageDesign';

export function BrandFooter() {
  return <footer className="site-footer"><Icon name="brand" size={18} /><span>LocyTech</span><span className="footer-divider" aria-hidden="true">/</span><span>Links e produtos digitais</span></footer>;
}

function CardCopy({ title, description, count }) {
  return <span className="hub-card-copy"><strong className="hub-card-title">{title}</strong><span className="hub-card-description">{description}</span>{count !== undefined && <span className="hub-card-count">{count} {count === 1 ? 'produto' : 'produtos'}</span>}</span>;
}

export default function Hub({ state, onProducts, onUnavailable, ownerTools, previewOnly = false, headingId }) {
  const generatedId = useId();
  const identityId = headingId || `${generatedId}-identity`;
  const design = normalizeDesign(state.design);
  const count = state.products.filter(product => product.enabled).length;
  return <div className="hub-layout">
    <BrandAtmosphere logo={state.logo} name={state.name} backgroundColor={state.backgroundColor} design={design} />
    <section className="hub-navigation-wrap" aria-labelledby={identityId}>
      <header className="hub-identity">
        {state.eyebrow && <p className="identity-eyebrow hub-panel-eyebrow">{state.eyebrow}</p>}
        <h1 id={identityId} tabIndex={-1} className="identity-name hub-panel-title">{state.name || 'Sua marca'}</h1>
        {state.description && <p className="identity-description hub-panel-description">{state.description}</p>}
      </header>
      <nav className="hub-navigation" aria-label="Nossos canais">
        {design.channelOrder.map(platform => {
          if (platform === 'products') return <button key={platform} type="button" className="hub-card hub-card-products" disabled={previewOnly} onClick={previewOnly ? undefined : onProducts}>
            <span className="hub-card-icon"><Icon name="store" size={28} /></span><CardCopy title="Nossos produtos" description="Landing pages, sites e lojas virtuais" count={count} /><Icon name="arrow" className="hub-card-arrow" size={21} />
          </button>;
          const social = socialDefaults.find(item => item.platform === platform);
          const destination = safeUrl(state.links.find(link => link.platform === social.platform)?.url);
          const content = <><span className="hub-card-icon"><Icon name={social.platform} size={28} /></span><CardCopy title={social.title} description={social.description} /><Icon name="arrow" className="hub-card-arrow" size={21} /></>;
          if (previewOnly) return <button key={social.platform} type="button" className={`hub-card hub-card-${social.platform}`} disabled>{content}</button>;
          return <a key={social.platform} className={`hub-card hub-card-${social.platform}`} href={destination || '#'} target={destination ? '_blank' : undefined} rel={destination ? 'noopener noreferrer' : undefined} onClick={!destination ? event => { event.preventDefault(); onUnavailable(social.title); } : undefined}>
            {content}
          </a>;
        })}
      </nav>
      {state.showBrand && <BrandFooter />}
      {ownerTools}
    </section>
  </div>;
}
