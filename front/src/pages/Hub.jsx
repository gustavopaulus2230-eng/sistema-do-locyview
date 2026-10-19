import React from 'react';
import BrandAtmosphere from '../components/BrandAtmosphere';
import Icon from '../components/Icon';
import { safeUrl, socialDefaults } from '../utils/pageState';

export function BrandFooter() {
  return <footer id="site-footer" className="site-footer"><Icon name="brand" size={18} /><span>LocyTech</span><span className="footer-divider" aria-hidden="true">/</span><span>Links e produtos digitais</span></footer>;
}

function CardCopy({ title, description, count }) {
  return <span className="hub-card-copy"><strong className="hub-card-title">{title}</strong><span className="hub-card-description">{description}</span>{count !== undefined && <span className="hub-card-count">{count} {count === 1 ? 'produto' : 'produtos'}</span>}</span>;
}

export default function Hub({ state, onProducts, onUnavailable, ownerTools }) {
  const count = state.products.filter(product => product.enabled).length;
  return <div className="hub-layout">
    <BrandAtmosphere logo={state.logo} name={state.name} primaryColor={state.primaryColor} accentColor={state.accentColor} backgroundColor={state.backgroundColor} />
    <section className="hub-navigation-wrap" aria-labelledby="identity-heading">
      <header className="hub-identity">
        {state.eyebrow && <p className="identity-eyebrow hub-panel-eyebrow">{state.eyebrow}</p>}
        <h1 id="identity-heading" tabIndex={-1} className="identity-name hub-panel-title">{state.name || 'Sua marca'}</h1>
        {state.description && <p className="identity-description hub-panel-description">{state.description}</p>}
      </header>
      <nav className="hub-navigation" aria-label="Nossos canais">
        {socialDefaults.map(social => {
          const destination = safeUrl(state.links.find(link => link.platform === social.platform)?.url);
          return <a key={social.platform} className={`hub-card hub-card-${social.platform}`} href={destination || '#'} target={destination ? '_blank' : undefined} rel={destination ? 'noopener noreferrer' : undefined} onClick={!destination ? event => { event.preventDefault(); onUnavailable(social.title); } : undefined}>
            <span className="hub-card-icon"><Icon name={social.platform} size={28} /></span><CardCopy title={social.title} description={social.description} /><Icon name="arrow" className="hub-card-arrow" size={21} />
          </a>;
        })}
        <button type="button" className="hub-card hub-card-products" onClick={onProducts}>
          <span className="hub-card-icon"><Icon name="store" size={28} /></span><CardCopy title="Nossos produtos" description="Landing pages, sites e lojas virtuais" count={count} /><Icon name="arrow" className="hub-card-arrow" size={21} />
        </button>
      </nav>
      {state.showBrand && <BrandFooter />}
      {ownerTools}
    </section>
  </div>;
}
