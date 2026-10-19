import React, { useEffect, useRef, useState } from 'react';
import Hub from './pages/Hub';
import Products from './pages/Products';
import Editor, { ProductEditor } from './components/Editor';
import Modal from './components/Modal';
import Icon from './components/Icon';
import { categoryName, contrastText, copyText, loadPageState, quoteDestinations, safeUrl, shareUrl, STORAGE_KEY } from './utils/pageState';

function CloseButton({ label, onClick, className = 'icon-button' }) {
  return <button type="button" className={className} aria-label={label} onClick={onClick}><Icon name="close" /></button>;
}

function ProductDetail({ product, onClose, onQuote }) {
  return <Modal id="product-dialog" className="modal product-modal" labelledBy="detail-product-title" onClose={onClose}>
    <CloseButton label="Fechar detalhes do produto" className="modal-close icon-button" onClick={onClose} />
    <div id="product-detail-content"><span className={`detail-icon art-${product.icon}`}><Icon name={product.icon} size={32} /></span><p className="detail-category">{categoryName(product.category)}</p><h2 id="detail-product-title" className="detail-title">{product.title}</h2><p className="detail-description">{product.description}</p>{product.note && <p className="detail-note">{product.note}</p>}{product.features.length > 0 && <ul className="detail-features">{product.features.map((feature, index) => <li key={index}>{feature}</li>)}</ul>}<p className="detail-price">{product.price}</p><p className="detail-price-note">Preço ilustrativo para esta demonstração. O valor final depende do escopo do projeto.</p></div>
    <button type="button" id="product-interest" className="button button-primary button-full" onClick={() => onQuote(product.id)}>Solicitar orçamento<Icon name="arrow" /></button>
  </Modal>;
}

function QuoteDialog({ state, productId, onClose, toast }) {
  const [fields, setFields] = useState({ product: productId || '', name: '', email: '', message: '' });
  const [preparedQuote, setPreparedQuote] = useState('');
  const resultRef = useRef(null);
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const destinations = preparedQuote ? quoteDestinations(state, preparedQuote) : {};
  const update = event => setFields(previous => ({ ...previous, [event.target.name]: event.target.value }));

  function submit(event) {
    event.preventDefault();
    const name = fields.name.trim();
    const email = fields.email.trim();
    if (!name) { nameRef.current?.focus(); toast('Informe seu nome.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { emailRef.current?.focus(); toast('Informe um e-mail válido para contato.'); return; }
    const product = state.products.find(item => item.enabled && item.id === fields.product);
    const message = fields.message.trim();
    setPreparedQuote(`Olá, equipe ${state.name || 'LocyTech'}! Gostaria de solicitar um orçamento.\n\nSolução: ${product?.title || 'Quero orientação para o meu projeto'}\nNome: ${name}\nE-mail: ${email}${message ? `\n\nSobre o meu projeto:\n${message}` : ''}`);
  }

  async function copy() {
    const copied = await copyText(preparedQuote, resultRef.current);
    toast(copied ? 'Solicitação copiada.' : 'Selecione o texto e use a opção de copiar do seu aparelho.');
  }

  return <Modal id="quote-dialog" className="modal quote-modal" labelledBy="quote-title" onClose={onClose}>
    <div className="modal-topline"><span className="modal-eyebrow">ORÇAMENTO</span><CloseButton label="Fechar orçamento" onClick={onClose} /></div><h2 id="quote-title">{preparedQuote ? 'Solicitação pronta para copiar.' : 'Conte sobre o projeto.'}</h2><p className="modal-description">{preparedQuote ? 'Revise o texto antes de entrar em contato.' : 'Preencha os dados para preparar sua mensagem. Nenhum envio é automático.'}</p>
    {!preparedQuote ? <form id="quote-form" onSubmit={submit}>
      <div className="field"><label htmlFor="quote-product">Qual produto você procura?</label><select id="quote-product" name="product" value={fields.product} onChange={update}><option value="">Quero uma orientação</option>{state.products.filter(product => product.enabled).map(product => <option key={product.id} value={product.id}>{product.title}</option>)}</select></div>
      <div className="field"><label htmlFor="quote-name">Seu nome <span>*</span></label><input autoFocus ref={nameRef} id="quote-name" name="name" value={fields.name} onChange={update} required maxLength={80} autoComplete="name" placeholder="Nome completo" /></div>
      <div className="field"><label htmlFor="quote-email">Seu e-mail <span>*</span></label><input ref={emailRef} id="quote-email" name="email" value={fields.email} onChange={update} type="email" required maxLength={120} autoComplete="email" placeholder="voce@empresa.com.br" /></div>
      <div className="field"><label htmlFor="quote-message">Descrição do projeto</label><textarea id="quote-message" name="message" value={fields.message} onChange={update} rows={3} maxLength={1500} placeholder="O que você precisa incluir no projeto?" /></div>
      <button id="quote-submit" type="submit" className="button button-primary button-full">Preparar solicitação<Icon name="arrow" /></button>
    </form> : <>
      <textarea id="quote-result" ref={resultRef} className="quote-result" value={preparedQuote} readOnly rows={10} aria-label="Solicitação de orçamento pronta" />
      <p id="quote-result-note" className="result-note">Nenhuma mensagem foi enviada. Seus dados não são salvos nesta página.</p>
      <div id="quote-result-actions"><div className="quote-send-actions"><button autoFocus id="copy-quote" type="button" className="button button-primary" onClick={copy}><Icon name="copy" />Copiar solicitação</button>{destinations.whatsapp && <a id="quote-whatsapp" className="button button-secondary" href={destinations.whatsapp} target="_blank" rel="noopener noreferrer">Abrir no WhatsApp<Icon name="external" size={17} /></a>}{destinations.email && <a id="quote-email-link" className="button button-secondary" href={destinations.email}>Abrir no e-mail<Icon name="external" size={17} /></a>}</div><button id="quote-reset" type="button" className="text-button quote-reset" onClick={() => setPreparedQuote('')}>Voltar e editar</button></div>
    </>}
  </Modal>;
}

function ShareDialog({ url, onClose, toast }) {
  const inputRef = useRef(null);
  async function copy() {
    const copied = await copyText(url, inputRef.current);
    toast(copied ? 'Link da página copiado.' : 'Selecione o link e use a opção de copiar do seu aparelho.');
  }
  return <Modal id="share-dialog" className="modal share-modal" labelledBy="share-heading" onClose={onClose}>
    <div className="modal-topline"><span className="modal-eyebrow">COMPARTILHAR PÁGINA</span><CloseButton label="Fechar compartilhamento" onClick={onClose} /></div><span className="share-success"><Icon name="check" /></span><h2 id="share-heading">Link de demonstração</h2><p className="modal-description">Compartilhe esta versão da página, sem os controles de edição.</p>
    <label htmlFor="share-url" className="field-label">Link da página</label><div className="share-input"><input id="share-url" ref={inputRef} value={url} readOnly /><button type="button" id="copy-share" className="icon-button" aria-label="Copiar link" onClick={copy}><Icon name="copy" /></button></div><p id="share-note" className="editor-hint">O link guarda uma versão da página. Alterações futuras geram um novo link. Um endereço curto e a atualização centralizada dependem da integração com a LocyTech.</p><a id="open-share" className="button button-primary button-full" href={url} target="_blank" rel="noopener noreferrer">Ver página do cliente<Icon name="external" /></a>
  </Modal>;
}

export default function App() {
  const [initial] = useState(() => loadPageState({ publicOnly: true }));
  const [state, setState] = useState(initial.state);
  const [currentView, setCurrentView] = useState('hub');
  const [modal, setModal] = useState(null);
  const [editorTab, setEditorTab] = useState('brand');
  const [dirty, setDirty] = useState(false);
  const [savedAt, setSavedAt] = useState(initial.savedAt);
  const [statusOverride, setStatusOverride] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const toastTimer = useRef(null);
  const firstView = useRef(true);
  const theme = { '--brand-primary': state.primaryColor, '--brand-accent': state.accentColor, '--page-background': state.backgroundColor, '--on-primary': contrastText(state.primaryColor), '--brand-ink': contrastText(state.backgroundColor) };

  function toast(message) {
    window.clearTimeout(toastTimer.current);
    setToastMessage(message);
    toastTimer.current = window.setTimeout(() => setToastMessage(''), 4500);
  }

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  useEffect(() => {
    document.documentElement.style.setProperty('--brand-primary', state.primaryColor);
    document.documentElement.style.setProperty('--brand-accent', state.accentColor);
    document.documentElement.style.setProperty('--page-background', state.backgroundColor);
    document.body.style.backgroundColor = state.backgroundColor;
    document.body.classList.toggle('shared-page', initial.publicMode);
    document.title = currentView === 'products' ? `Nossos produtos · ${state.name || 'LocyTech'}` : `${state.name || 'LocyTech'} · Canais e produtos`;
  }, [state.primaryColor, state.accentColor, state.backgroundColor, state.name, currentView, initial.publicMode]);

  useEffect(() => {
    if (firstView.current) { firstView.current = false; return; }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    document.getElementById(currentView === 'products' ? 'products-heading' : 'identity-heading')?.focus({ preventScroll: true });
  }, [currentView]);

  function changeState(patch) {
    setState(previous => typeof patch === 'function' ? patch(previous) : { ...previous, ...patch });
    setDirty(true);
    setStatusOverride('');
  }

  function switchView(view) { setModal(null); setCurrentView(view); }
  function openEditor(tab = editorTab) { if (initial.publicMode) return; setEditorTab(tab); setModal({ type: 'editor' }); }

  function saveDraft() {
    try {
      const timestamp = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ state, savedAt: timestamp }));
      setSavedAt(timestamp);
      setDirty(false);
      setStatusOverride('');
      toast('Rascunho salvo neste navegador.');
    } catch {
      setStatusOverride('Não foi possível salvar neste navegador');
      toast('Não foi possível salvar. Gere e copie o link para guardar esta versão.');
    }
  }

  function openShare() {
    if (initial.publicMode) return;
    if (!state.name.trim()) { openEditor('brand'); toast('Preencha o nome da marca.'); return; }
    const invalid = state.links.find(link => link.url.trim() && !safeUrl(link.url));
    if (invalid) { openEditor('links'); toast(`Confira o link de ${invalid.title} antes de compartilhar.`); return; }
    setModal({ type: 'share', url: shareUrl(state) });
  }

  function editProduct(id) {
    if (!id && state.products.length >= 30) { toast('O catálogo pode ter até 30 produtos.'); return; }
    setModal({ type: 'edit-product', id });
  }

  function productAction(action, id) {
    changeState(previous => {
      const index = previous.products.findIndex(product => product.id === id);
      if (index < 0) return previous;
      if (action === 'delete') return { ...previous, products: previous.products.filter(product => product.id !== id) };
      if (action === 'toggle') return { ...previous, products: previous.products.map(product => product.id === id ? { ...product, enabled: !product.enabled } : product) };
      const next = action === 'up' ? index - 1 : action === 'down' ? index + 1 : -1;
      if (next < 0 || next >= previous.products.length) return previous;
      const products = [...previous.products];
      [products[index], products[next]] = [products[next], products[index]];
      return { ...previous, products };
    });
    if (action === 'delete') toast('Produto removido do catálogo.');
  }

  function saveProduct(product) {
    const existing = state.products.some(item => item.id === product.id);
    changeState(previous => ({ ...previous, products: existing ? previous.products.map(item => item.id === product.id ? product : item) : [...previous.products, product] }));
    openEditor('products');
    toast(existing ? 'Produto atualizado.' : 'Produto adicionado.');
  }

  const detailProduct = modal?.type === 'detail' ? state.products.find(product => product.id === modal.id && product.enabled) : null;
  const status = statusOverride || (dirty ? 'Alterações não salvas' : savedAt ? 'Salvo neste navegador' : 'Personalize sua página');
  const ownerTools = import.meta.env.DEV && !initial.publicMode && <div id="owner-tools" className="owner-tools"><button type="button" id="editor-launch" className="owner-button" onClick={() => openEditor()}><Icon name="edit" />Personalizar página</button><button type="button" id="share-launch" className="owner-share" aria-label="Compartilhar página" title="Compartilhar página" onClick={openShare}><Icon name="share" /></button></div>;

  return <div className="app-shell" style={theme}>
    <main id="site-shell" className={`site-shell${currentView === 'products' ? ' showing-products' : ''}`}>
      {initial.error && <p role="alert" className="catalog-empty public-load-error">{initial.error}</p>}
      <div id="page-content" className="page-content" key={currentView}>{currentView === 'hub' ? <Hub state={state} ownerTools={ownerTools} onProducts={() => switchView('products')} onUnavailable={title => setModal({ type: 'contact', title })} /> : <Products state={state} ownerTools={ownerTools} onBack={() => switchView('hub')} onDetail={id => setModal({ type: 'detail', id })} />}</div>
    </main>
    {modal?.type === 'editor' && <Editor state={state} activeTab={editorTab} onTab={setEditorTab} onChange={changeState} onClose={() => setModal(null)} onSave={saveDraft} onShare={openShare} onEditProduct={editProduct} onProductAction={productAction} status={status} toast={toast} />}
    {modal?.type === 'edit-product' && <ProductEditor product={state.products.find(product => product.id === modal.id)} onClose={() => openEditor('products')} onSave={saveProduct} />}
    {detailProduct && <ProductDetail product={detailProduct} onClose={() => setModal(null)} onQuote={id => setModal({ type: 'quote', id })} />}
    {modal?.type === 'quote' && <QuoteDialog state={state} productId={modal.id} onClose={() => setModal(null)} toast={toast} />}
    {modal?.type === 'share' && <ShareDialog url={modal.url} onClose={() => setModal(null)} toast={toast} />}
    {modal?.type === 'contact' && <Modal id="contact-dialog" className="modal contact-modal" labelledBy="contact-unavailable-heading" onClose={() => setModal(null)}><div className="modal-topline"><span className="modal-eyebrow">CONTATO</span><CloseButton label="Fechar informações de contato" onClick={() => setModal(null)} /></div><h2 id="contact-unavailable-heading">{modal.title} não configurado.</h2><p className="modal-description">Este canal ainda não tem um link disponível. Você pode consultar os produtos no catálogo.</p><button type="button" className="button button-primary button-full" onClick={() => switchView('products')}>Ver nossos produtos<Icon name="arrow" /></button></Modal>}
    <div id="toast" className={`toast${toastMessage ? ' is-visible' : ''}`} role="status" aria-live="polite" hidden={!toastMessage}>{toastMessage}</div>
  </div>;
}
