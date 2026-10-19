import React, { useState } from 'react';
import Icon from '../components/Icon';
import { BrandFooter } from './Hub';
import { categoryName } from '../utils/pageState';

function ProductCard({ product, onDetail }) {
  return <button type="button" className="product-card" aria-label={`Ver detalhes de ${product.title}`} onClick={() => onDetail(product.id)}>
    <span className={`product-art art-${product.icon}`} aria-hidden="true"><span className="product-art-browser"><span className="product-art-dots"><i /><i /><i /></span><Icon name={product.icon} className="product-art-icon" size={40} /><span className="product-art-line" /><span className="product-art-line short" /></span></span>
    <span className="product-copy"><span className="product-category-label">{categoryName(product.category)}</span><h2 className="product-title">{product.title}</h2><span className="product-price">{product.price}</span><span className="product-description">{product.description}</span><span className="product-card-cta">Ver detalhes<Icon name="arrow" size={17} /></span></span>
  </button>;
}

export default function Products({ state, onBack, onDetail, ownerTools }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const active = state.products.filter(product => product.enabled);
  const visible = active.filter(product => activeFilter === 'all' || product.category === activeFilter);
  return <div className="products-layout">
    <button type="button" className="back-button" onClick={onBack}><Icon name="back" size={19} /><span>Voltar aos links</span></button>
    <header className="products-header"><p className="section-eyebrow">CATÁLOGO LOCYTECH</p><h1 id="products-heading" tabIndex={-1}>Nossos produtos</h1><p className="products-description">Sites e landing pages para a sua empresa.</p><p className="price-disclaimer">Preços ilustrativos para esta demonstração.</p></header>
    <div className="catalog-filters" role="group" aria-label="Filtrar produtos">
      {[['all', 'Todos'], ['landing', 'Landing pages'], ['sites', 'Sites']].map(([value, label]) => <button type="button" key={value} className={`catalog-filter${activeFilter === value ? ' active' : ''}`} aria-pressed={activeFilter === value} onClick={() => setActiveFilter(value)}>{label}<span className="filter-count">{active.filter(product => value === 'all' || product.category === value).length}</span></button>)}
    </div>
    <div id="product-grid" className="product-grid">{visible.map(product => <ProductCard key={product.id} product={product} onDetail={onDetail} />)}{!visible.length && <p className="catalog-empty">Nenhum produto disponível nesta categoria.</p>}</div>
    {state.showBrand && <BrandFooter />}
    {ownerTools}
  </div>;
}
