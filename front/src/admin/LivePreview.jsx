import React, { useEffect, useId, useRef, useState } from 'react';
import Icon from '../components/Icon';
import PageSurface from '../components/PageSurface';
import ProductDetails from '../components/ProductDetails';
import Hub from '../pages/Hub';
import Products from '../pages/Products';
import '../styles/livePreview.css';

export default function LivePreview({ page, onExpand, initialView = 'hub', initialProductId = null, expanded = false, onShare }) {
  const [view, setView] = useState(initialProductId ? 'detail' : initialView === 'products' ? 'products' : 'hub');
  const [selectedId, setSelectedId] = useState(initialProductId);
  const [device, setDevice] = useState('mobile');
  const [notice, setNotice] = useState('');
  const allowedHiddenId = useRef(page.products.find(product => product.id === initialProductId && product.enabled === false)?.id || null);
  const viewportRef = useRef(null);
  const firstView = useRef(true);
  const generatedId = useId();
  const headingIds = { hub: `${generatedId}-page`, products: `${generatedId}-catalog`, detail: `${generatedId}-detail` };
  const product = page.products.find(item => item.id === selectedId);
  const activeCount = page.products.filter(item => item.enabled).length;
  const Wrapper = expanded ? 'div' : 'aside';

  useEffect(() => {
    if (view !== 'detail') return;
    if (product?.enabled) allowedHiddenId.current = null;
    if (!product || (!product.enabled && allowedHiddenId.current !== selectedId)) {
      setView('products');
      setSelectedId(null);
      setNotice(product ? 'Este produto foi ocultado e não aparece mais no catálogo.' : 'Este produto foi removido. A prévia do catálogo foi atualizada.');
    }
  }, [page.products, selectedId, view, product]);

  useEffect(() => {
    if (firstView.current) { firstView.current = false; return; }
    const viewport = viewportRef.current;
    viewport?.scrollTo({ top: 0, behavior: 'instant' });
    viewport?.querySelector(`#${CSS.escape(headingIds[view])}`)?.focus({ preventScroll: true });
  }, [view]);

  function switchView(next) { setView(next); setNotice(''); }
  function openProduct(id) { allowedHiddenId.current = null; setSelectedId(id); switchView('detail'); }
  function inspectChannel(title, destination) {
    setNotice(destination ? `${title} configurado: ${destination}. Nenhum link externo é aberto nesta prévia.` : `${title} ainda não tem um destino configurado. Adicione o endereço na etapa Links.`);
  }

  return <Wrapper className={`lv-preview-pane lv-interactive-preview${expanded ? ' is-expanded' : ''}`} aria-label="Prévia interativa da página">
    <div className="lv-live-heading"><div><span className="lv-live-eyebrow"><span />Ao vivo</span><h2>Veja sua página ganhar forma.</h2></div>{onExpand && !expanded && <button type="button" className="lv-live-expand" onClick={() => onExpand(view, view === 'detail' ? selectedId : null)} aria-label="Ampliar prévia" title="Ampliar prévia"><Icon name="external" size={19} /></button>}</div>
    <div className="lv-live-toolbar"><div className="lv-live-tabs" role="group" aria-label="Conteúdo da prévia"><button type="button" aria-pressed={view === 'hub'} className={view === 'hub' ? 'is-active' : ''} onClick={() => switchView('hub')}><Icon name="links" size={16} />Página</button><button type="button" aria-pressed={view !== 'hub'} className={view !== 'hub' ? 'is-active' : ''} onClick={() => switchView('products')}><Icon name="store" size={16} />Produtos<span>{activeCount}</span></button></div>{expanded && <div className="lv-preview-devices" role="group" aria-label="Largura da prévia"><button type="button" aria-pressed={device === 'mobile'} onClick={() => setDevice('mobile')}><Icon name="phone" size={16} />Celular</button><button type="button" aria-pressed={device === 'desktop'} onClick={() => setDevice('desktop')}><Icon name="window" size={16} />Computador</button></div>}</div>
    {notice && <p className="lv-live-notice" role="status"><Icon name="info" size={16} /><span>{notice}</span></p>}
    <div className="lv-preview-stage" ref={viewportRef} data-device={expanded ? device : 'mobile'}>
      <div className="lv-preview-canvas"><PageSurface page={page} className="is-embedded">
        <div hidden={view !== 'hub'}><Hub state={page} interactivePreview headingId={headingIds.hub} onProducts={() => switchView('products')} onUnavailable={inspectChannel} /></div>
        <div hidden={view !== 'products'} className="lv-preview-catalog"><Products state={page} headingId={headingIds.products} onBack={() => switchView('hub')} onDetail={openProduct} /></div>
        {view === 'detail' && product && <div className="lv-preview-product-detail"><button type="button" className="back-button" onClick={() => switchView('products')}><Icon name="back" size={18} />Voltar ao catálogo</button><ProductDetails product={product} headingId={headingIds.detail} preview /></div>}
      </PageSurface></div>
    </div>
    <div className="lv-live-footer"><p><Icon name="info" size={15} />Clique nos canais e produtos para testar. A prévia acompanha o que você está editando, antes de salvar.</p>{onShare && <button type="button" className="lv-btn lv-btn-secondary lv-btn-small" onClick={onShare}><Icon name="share" size={17} />Gerar link</button>}</div>
  </Wrapper>;
}
