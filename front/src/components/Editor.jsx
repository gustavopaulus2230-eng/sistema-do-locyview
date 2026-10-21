import React, { useId, useRef, useState } from 'react';
import Icon from './Icon';
import Modal from './Modal';
import { BrandFields, ColorsFields, LinkFields } from './PageFields';
import { categoryName, PRODUCT_ICONS, uid } from '../utils/pageState';
import PageSurface from './PageSurface';
import ProductDetails from './ProductDetails';
import '../styles/livePreview.css';

const editorTabs = [['brand', 'Identidade'], ['products', 'Produtos'], ['links', 'Links e contatos']];

function ActionButton({ label, icon, disabled, onClick }) {
  return <button type="button" className="icon-button" title={label} aria-label={label} disabled={disabled} onClick={onClick}><Icon name={icon} size={17} /></button>;
}

export default function Editor({ state, activeTab, onTab, onChange, onClose, onSave, onShare, onEditProduct, onProductAction, status, toast }) {
  const tabsRef = useRef({});

  function handleTabKey(event, current) {
    const index = editorTabs.findIndex(([key]) => key === current);
    const next = event.key === 'ArrowRight' ? (index + 1) % 3 : event.key === 'ArrowLeft' ? (index + 2) % 3 : event.key === 'Home' ? 0 : event.key === 'End' ? 2 : -1;
    if (next < 0) return;
    event.preventDefault();
    const tab = editorTabs[next][0];
    onTab(tab);
    tabsRef.current[tab]?.focus();
  }

  return <Modal id="editor-dialog" className="editor-drawer" labelledBy="editor-heading" onClose={onClose}>
    <header className="drawer-header"><div><span className="drawer-eyebrow">LOCYTECH</span><h2 id="editor-heading">Personalizar página<span>.</span></h2><p>Edite a marca, os produtos e os links.</p></div><button type="button" id="editor-close" className="icon-button" aria-label="Fechar personalização" onClick={onClose}><Icon name="close" /></button></header>
    <div className="drawer-tabs" role="tablist" aria-label="Personalização">{editorTabs.map(([key, label]) => <button type="button" key={key} ref={element => { tabsRef.current[key] = element; }} role="tab" id={`editor-tab-${key}`} data-editor-tab={key} className={activeTab === key ? 'active is-active' : ''} aria-selected={activeTab === key} aria-controls={`editor-panel-${key}`} tabIndex={activeTab === key ? 0 : -1} onClick={() => onTab(key)} onKeyDown={event => handleTabKey(event, key)}>{label}</button>)}</div>
    <div className="drawer-body">
      <section id="editor-panel-brand" role="tabpanel" aria-labelledby="editor-tab-brand" hidden={activeTab !== 'brand'}>
        <div className="editor-section-heading"><h3>Identidade da marca</h3><p>As alterações aparecem na prévia da página.</p></div>
        <BrandFields state={state} onChange={onChange} toast={toast} />
        <div className="editor-divider" /><div className="editor-section-heading"><h3>Cores da página</h3><p>Escolha as cores principal, de destaque e de fundo.</p></div>
        <ColorsFields state={state} onChange={onChange} />
      </section>
      <section id="editor-panel-products" role="tabpanel" aria-labelledby="editor-tab-products" hidden={activeTab !== 'products'}>
        <div className="editor-section-heading"><h3>Produtos do catálogo</h3><p>Cadastre landing pages, sites e produtos digitais.</p></div>
        <div id="product-list" className="editor-product-list">{state.products.map((product, index) => <article key={product.id} className={`editor-product${product.enabled ? '' : ' is-disabled'}`} data-product-id={product.id}>
          <div className="editor-product-head"><div className="editor-product-name"><Icon name={product.icon} className="editor-product-icon" size={20} /><strong>{product.title}</strong><small>{categoryName(product.category)}</small></div><div className="editor-product-actions"><ActionButton label={`Editar ${product.title}`} icon="edit" onClick={() => onEditProduct(product.id)} /><ActionButton label={`Mover ${product.title} para cima`} icon="up" disabled={index === 0} onClick={() => onProductAction('up', product.id)} /><ActionButton label={`Mover ${product.title} para baixo`} icon="down" disabled={index === state.products.length - 1} onClick={() => onProductAction('down', product.id)} /><ActionButton label={`Excluir ${product.title}`} icon="trash" onClick={() => onProductAction('delete', product.id)} /><label className="switch"><input type="checkbox" aria-label={`Mostrar ${product.title}`} checked={product.enabled} onChange={() => onProductAction('toggle', product.id)} /><span className="switch-track" /></label></div></div><p className="editor-product-description">{product.description}</p><span className="editor-product-price">{product.price}</span>
        </article>)}{!state.products.length && <p className="editor-empty">Nenhum produto cadastrado.</p>}</div>
        <button type="button" id="add-product" className="add-button" onClick={() => onEditProduct(null)} disabled={state.products.length >= 30}><Icon name="plus" />Adicionar produto</button><p className="editor-hint">Use as setas para ordenar. Desative um produto para ocultá-lo. Limite de 30 produtos.</p>
      </section>
      <section id="editor-panel-links" role="tabpanel" aria-labelledby="editor-tab-links" hidden={activeTab !== 'links'}>
        <div className="editor-section-heading"><h3>Links dos canais</h3><p>Configure Instagram, WhatsApp e LinkedIn. Nossos produtos abre o catálogo.</p></div>
        <LinkFields state={state} onChange={onChange} showDefaultNote />
      </section>
      <div className="drawer-demo-note"><Icon name="info" /><p>Demonstração apenas de front-end. O rascunho é salvo neste navegador. O cadastro centralizado depende da integração com a LocyTech.</p></div>
    </div>
    <footer className="drawer-footer"><span id="editor-status" role="status">{status}</span><div><button type="button" id="save-page" className="button button-secondary" onClick={onSave}>Salvar rascunho</button><button type="button" id="publish-page" className="button button-primary" onClick={onShare}>Gerar link<Icon name="arrow" /></button></div></footer>
  </Modal>;
}

export function ProductEditor({ product, onClose, onSave, previewPage }) {
  const [draft, setDraft] = useState(() => product ? { ...product, features: product.features.join('\n') } : { title: '', description: '', category: 'landing', note: '', price: 'Sob consulta', icon: 'window', features: '' });
  const [showReview, setShowReview] = useState(false);
  const [titleError, setTitleError] = useState('');
  const productId = useRef(product?.id || uid());
  const titleRef = useRef(null);
  const reviewId = `${useId()}-product-review`;
  const update = event => { setDraft(previous => ({ ...previous, [event.target.name]: event.target.value })); if (event.target.name === 'title') setTitleError(''); };
  function prepareDraft() {
    return { id: productId.current, title: draft.title.trim().slice(0, 70), description: draft.description.trim().slice(0, 240), category: draft.category === 'sites' ? 'sites' : 'landing', note: draft.note.trim().slice(0, 80), price: (draft.price.trim() || 'Sob consulta').slice(0, 40), icon: PRODUCT_ICONS.includes(draft.icon) ? draft.icon : 'window', features: draft.features.split(/\r?\n/).map(item => item.trim()).filter(Boolean).slice(0, 8).map(item => item.slice(0, 130)), enabled: product?.enabled !== false };
  }
  function submit(event) {
    event.preventDefault();
    if (!draft.title.trim()) { setTitleError('Informe o nome do produto para salvar.'); setShowReview(false); window.requestAnimationFrame(() => titleRef.current?.focus()); return; }
    onSave(prepareDraft());
  }
  return <Modal id="product-edit-dialog" className={`modal lv-product-editor${previewPage ? ' has-live-preview' : ''}`} labelledBy="product-edit-heading" onClose={onClose}><form id="product-edit-form" onSubmit={submit} noValidate>
    <div className="modal-topline"><span className="modal-eyebrow">CATÁLOGO DIGITAL</span><button type="button" className="icon-button" aria-label="Cancelar edição de produto" onClick={onClose}><Icon name="close" /></button></div><h2 id="product-edit-heading">{product ? 'Editar produto' : 'Adicionar produto'}</h2><p className="modal-description">Defina os dados que aparecem no catálogo.</p>
    {previewPage && <div className="lv-product-review-tabs" role="group" aria-label="Edição e prévia do produto"><button type="button" aria-pressed={!showReview} onClick={() => setShowReview(false)}><Icon name="edit" size={17} />Dados do produto</button><button type="button" aria-pressed={showReview} aria-controls={reviewId} onClick={() => setShowReview(true)}><Icon name="store" size={17} />Ver produto</button></div>}
    <div className="lv-product-edit-layout" data-review={showReview}>
    <div className="lv-product-edit-fields">
    {titleError && <p className="lv-product-title-error" role="alert">{titleError}</p>}
    <div className="field"><label htmlFor="product-title">Nome do produto <span>*</span></label><input ref={titleRef} autoFocus id="product-title" name="title" value={draft.title} onChange={update} required aria-invalid={Boolean(titleError)} maxLength={70} placeholder="Ex.: Landing page" /></div>
    <div className="field"><label htmlFor="product-description">Descrição</label><textarea id="product-description" name="description" value={draft.description} onChange={update} rows={3} maxLength={240} placeholder="Descreva o produto" /></div>
    <div className="form-grid"><div className="field"><label htmlFor="product-category">Categoria</label><select id="product-category" name="category" value={draft.category} onChange={update}><option value="landing">Landing pages</option><option value="sites">Sites</option></select></div><div className="field"><label htmlFor="product-icon">Ícone</label><select id="product-icon" name="icon" value={draft.icon} onChange={update}><option value="window">Landing page</option><option value="globe">Site</option><option value="store">Loja virtual</option><option value="briefcase">Portfólio</option><option value="links">Página de links</option></select></div></div>
    <div className="form-grid"><div className="field"><label htmlFor="product-price">Valor ou condição</label><input id="product-price" name="price" value={draft.price} onChange={update} maxLength={40} placeholder="Ex.: R$ 0,00" /></div><div className="field"><label htmlFor="product-note">Texto complementar</label><input id="product-note" name="note" value={draft.note} onChange={update} maxLength={80} placeholder="Ex.: Campanhas e lançamentos" /></div></div>
    <div className="field"><label htmlFor="product-features">O que está incluído</label><textarea id="product-features" name="features" value={draft.features} onChange={update} rows={4} maxLength={1050} placeholder="Um item por linha" /><small>Até 8 itens. Eles aparecem nos detalhes do produto.</small></div>
    </div>
    {previewPage && <aside id={reviewId} className="lv-product-draft-preview" aria-label="Prévia do produto em edição"><div className="lv-product-draft-header"><span className="lv-live-eyebrow"><span />Ao vivo</span><h3>É assim que o produto aparece.</h3><p>Os detalhes acompanham o que você digita. Salve para aplicar à página.</p></div><PageSurface page={previewPage} className="is-embedded"><ProductDetails product={prepareDraft()} preview /></PageSurface></aside>}
    </div>
    <div className="modal-actions"><button id="product-save" className="button button-primary" type="submit">Salvar produto<Icon name="check" /></button></div>
  </form></Modal>;
}
