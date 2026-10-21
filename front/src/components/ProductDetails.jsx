import React, { useId } from 'react';
import Icon from './Icon';
import { categoryName, PRODUCT_ICONS } from '../utils/pageState';

export function ProductDetails({ product, headingId, onQuote, preview = false }) {
  const generatedId = useId();
  const titleId = headingId || `${generatedId}-product-title`;
  const features = Array.isArray(product.features) ? product.features : [];
  const icon = PRODUCT_ICONS.includes(product.icon) ? product.icon : 'window';

  return <article className="product-details" aria-labelledby={titleId}>
    {preview && product.enabled === false && <p className="product-hidden-badge"><Icon name="info" size={16} />Produto oculto no catálogo</p>}
    <span className={`detail-icon art-${icon}`}><Icon name={icon} size={32} /></span>
    <p className="detail-category">{categoryName(product.category)}</p>
    <h2 id={titleId} className="detail-title" tabIndex={-1}>{product.title || 'Nome do produto'}</h2>
    {product.description && <p className="detail-description">{product.description}</p>}
    {product.note && <p className="detail-note">{product.note}</p>}
    {features.length > 0 && <ul className="detail-features">{features.map((feature, index) => <li key={index}>{feature}</li>)}</ul>}
    <p className="detail-price">{product.price || 'Sob consulta'}</p>
    <p className="detail-price-note">Preço ilustrativo para esta demonstração. O valor final depende do escopo do projeto.</p>
    {onQuote && <button type="button" className="button button-primary button-full" onClick={() => onQuote(product.id)}>Solicitar orçamento<Icon name="arrow" /></button>}
  </article>;
}

export default ProductDetails;
