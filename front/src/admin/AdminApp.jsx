import React, { useEffect, useRef, useState } from 'react';
import Icon from '../components/Icon';
import Modal from '../components/Modal';
import { ProductEditor } from '../components/Editor';
import { BrandFields, ColorsFields, LinkFields } from '../components/PageFields';
import { BrandForm, BrandsList } from './BrandViews';
import PageDesignFields from './PageDesignFields';
import PageSurface from '../components/PageSurface';
import Hub from '../pages/Hub';
import { categoryName, clone, copyText, safeLogo, safeUrl } from '../utils/pageState';
import { getTemplate } from '../utils/pageDesign';
import { applyBrandToRecord, clientPreviewUrl, createBrandRecord, createClientRecord, loadClientRecords, persistClientRecords, prepareBrandRecord, prepareClientRecord, validateBrandRecord, validateClientRecord } from '../utils/adminState';
import '../styles/admin.css';

const steps = [
  { id: 'identity', label: 'Identidade', icon: 'users', title: 'Uma página com a cara do cliente.', description: 'Cadastre a marca e os textos que vão receber os visitantes.' },
  { id: 'appearance', label: 'Aparência', icon: 'palette', title: 'As cores da marca, em cada detalhe.', description: 'Personalize a identidade visual. A prévia acompanha suas escolhas.' },
  { id: 'links', label: 'Links', icon: 'links', title: 'Conecte os canais do cliente.', description: 'Configure os destinos de Instagram, WhatsApp e LinkedIn.' },
  { id: 'products', label: 'Produtos', icon: 'store', title: 'Organize o catálogo.', description: 'Adicione produtos e serviços que aparecem em Nossos produtos.' }
];

const isConfigured = (record, records, brands) => !validateClientRecord(record, records, brands) && record.page.links.some(link => Boolean(safeUrl(link.url)));

function updatedLabel(value) {
  if (!value) return 'Modelo inicial';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Salvo neste navegador' : `Editado em ${new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(date)}`;
}

function PagePreview({ page }) {
  return <aside className="lv-preview-pane" aria-label="Prévia visual da página">
    <div className="lv-preview-header"><span><Icon name="phone" size={18} />Prévia em tempo real</span><small>Celular</small></div>
    <p className="lv-preview-template">{getTemplate(page.design?.templateId).name}</p>
    <div className="lv-preview-device">
      <div className="lv-live-preview"><PageSurface page={page} className="is-embedded"><Hub state={page} previewOnly /></PageSurface></div>
    </div>
    <p className="lv-preview-note">O mesmo visual da página completa, sem links ativos nesta prévia. Use “Visualizar página” para testar no celular ou computador.</p>
  </aside>;
}

function CatalogFields({ page, onEdit, onAction }) {
  return <div className="lv-products">
    <div className="lv-section-heading"><span>{page.products.length} de 30 produtos</span><button className="lv-btn lv-btn-secondary lv-btn-small" type="button" onClick={() => onEdit(null)} disabled={page.products.length >= 30}><Icon name="plus" size={17} />Adicionar produto</button></div>
    {page.products.map((product, index) => <article className="lv-product-row" key={product.id}>
      <div className="lv-product-info"><span className="lv-product-icon"><Icon name={product.icon} /></span><div><h3>{product.title}</h3><p>{categoryName(product.category)} <span aria-hidden="true">/</span> {product.price}</p><small>{product.enabled ? 'Visível no catálogo' : 'Oculto no catálogo'}</small></div></div>
      <div className="lv-product-actions"><button className="icon-button" type="button" aria-label={`Editar ${product.title}`} onClick={() => onEdit(product.id)}><Icon name="edit" size={17} /></button><button className="icon-button" type="button" aria-label={`Mover ${product.title} para cima`} disabled={index === 0} onClick={() => onAction('up', product.id)}><Icon name="up" size={17} /></button><button className="icon-button" type="button" aria-label={`Mover ${product.title} para baixo`} disabled={index === page.products.length - 1} onClick={() => onAction('down', product.id)}><Icon name="down" size={17} /></button><button className="icon-button" type="button" aria-label={`Remover ${product.title}`} onClick={() => onAction('delete', product.id)}><Icon name="trash" size={17} /></button><label className="lv-switch"><input type="checkbox" checked={product.enabled} aria-label={`Mostrar ${product.title}`} onChange={() => onAction('toggle', product.id)} /><span /></label></div>
    </article>)}
    {!page.products.length && <div className="lv-empty"><Icon name="store" size={32} /><h3>O catálogo começa aqui.</h3><p>Adicione o primeiro produto. Ele aparecerá na quarta opção da página do cliente.</p></div>}
    <p className="lv-panel-description">Use as setas para ordenar os produtos e o interruptor para ocultar um item sem removê-lo. As alterações só ficam salvas ao salvar a página.</p>
  </div>;
}

export default function AdminApp() {
  const [loaded] = useState(loadClientRecords);
  const [records, setRecords] = useState(loaded.records);
  const [brands, setBrands] = useState(loaded.brands);
  const [brandDraft, setBrandDraft] = useState(null);
  const [view, setView] = useState('clients');
  const [draft, setDraft] = useState(null);
  const [step, setStep] = useState('identity');
  const [dirty, setDirty] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [validation, setValidation] = useState(null);
  const [modal, setModal] = useState(null);
  const [message, setMessage] = useState('');
  const [storageError, setStorageError] = useState(loaded.error);
  const timer = useRef(null);
  const shareRef = useRef(null);
  const headingRef = useRef(null);
  const initialView = useRef(true);
  const activeStep = steps.find(item => item.id === step);
  const brandView = view === 'brands' || view === 'brand-editor';
  const viewLabel = { clients: 'Páginas dos clientes', editor: 'Cadastro de página', brands: 'Marcas', 'brand-editor': 'Cadastro de marca' }[view];
  const linkedBrand = brands.find(brand => brand.id === draft?.brandId);

  useEffect(() => {
    document.title = `${viewLabel} · LocyView`;
    if (initialView.current) initialView.current = false;
    else headingRef.current?.focus({ preventScroll: true });
  }, [view]);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  useEffect(() => {
    const guard = event => { if (dirty) { event.preventDefault(); event.returnValue = ''; } };
    window.addEventListener('beforeunload', guard);
    return () => window.removeEventListener('beforeunload', guard);
  }, [dirty]);
  useEffect(() => {
    if (validation) document.getElementById(validation.field)?.focus();
  }, [validation]);

  function toast(text) {
    window.clearTimeout(timer.current);
    setMessage(text);
    timer.current = window.setTimeout(() => setMessage(''), 4500);
  }

  function navigate(action) {
    if (dirty) { setModal({ type: 'discard', action }); return; }
    action();
  }

  function openRecord(record, brand = null) {
    if (!record && records.length >= 50) { toast('O limite desta demonstração é de 50 clientes.'); return; }
    navigate(() => {
      const next = record ? clone(record) : createClientRecord();
      setDraft(applyBrandToRecord(brand ? { ...next, brandId: brand.id } : next, brands));
      setDirty(false);
      setValidation(null);
      setStep('identity');
      setView('editor');
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
  }

  function showList(nextView) {
    navigate(() => {
      setView(nextView);
      setDraft(null);
      setBrandDraft(null);
      setDirty(false);
      setValidation(null);
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
  }

  function openBrand(brand) {
    if (!brand && brands.length >= 50) { toast('O limite deste navegador é de 50 marcas.'); return; }
    navigate(() => {
      setBrandDraft(brand ? clone(brand) : createBrandRecord());
      setView('brand-editor');
      setDirty(false);
      setValidation(null);
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
  }

  function changeBrand(patch) {
    setBrandDraft(previous => ({ ...previous, ...patch }));
    setDirty(true);
    setValidation(null);
  }

  function chooseBrand(brandId) {
    setDraft(previous => applyBrandToRecord({ ...previous, brandId, identityOverrides: [] }, brands));
    setDirty(true);
    setValidation(null);
  }

  function saveBrand(event) {
    event.preventDefault();
    const invalidColor = event.currentTarget.querySelector('.color-hex:invalid');
    if (invalidColor) { invalidColor.reportValidity(); invalidColor.focus(); return; }
    if (loaded.error) { setStorageError(loaded.error); return; }
    const issue = validateBrandRecord(brandDraft, brands);
    if (issue) { setValidation(issue); return; }
    const brand = prepareBrandRecord(brandDraft);
    const nextBrands = brands.some(item => item.id === brand.id) ? brands.map(item => item.id === brand.id ? brand : item) : [...brands, brand];
    const nextRecords = records.map(record => record.brandId === brand.id ? { ...applyBrandToRecord(record, nextBrands), updatedAt: brand.updatedAt } : record);
    const result = persistClientRecords(nextRecords, nextBrands);
    if (!result.ok) { setStorageError(result.error); toast(result.error); return; }
    setBrands(nextBrands);
    setRecords(nextRecords);
    setBrandDraft(brand);
    setDirty(false);
    setStorageError('');
    setValidation(null);
    toast('Marca salva. Páginas vinculadas atualizadas, preservando os campos personalizados.');
  }

  function changePage(patch) {
    setDraft(previous => ({ ...previous, identityOverrides: previous.brandId ? [...new Set([...(previous.identityOverrides || []), ...Object.keys(patch).filter(key => ['name', 'logo', 'primaryColor', 'accentColor', 'backgroundColor'].includes(key))])] : [], page: { ...previous.page, ...patch } }));
    setDirty(true);
    setValidation(null);
  }

  function restoreBrandIdentity() {
    setDraft(previous => applyBrandToRecord({ ...previous, identityOverrides: [] }, brands));
    setDirty(true);
    setValidation(null);
    toast('Identidade da marca reaplicada nesta página. Salve para guardar.');
  }

  function check(record) {
    const issue = validateClientRecord(record, records, brands);
    if (issue) { setStep(issue.tab); setValidation(issue); return false; }
    return true;
  }

  function save(event) {
    event?.preventDefault();
    const invalidColor = event?.currentTarget?.querySelector?.('.color-hex:invalid');
    if (invalidColor) { invalidColor.reportValidity(); invalidColor.focus(); return; }
    if (loaded.error) { setStorageError(`${loaded.error} Use a prévia sem salvar ou verifique o armazenamento antes de continuar.`); return; }
    if (!check(draft)) return;
    const record = prepareClientRecord(draft, brands);
    const exists = records.some(item => item.id === record.id);
    const next = exists ? records.map(item => item.id === record.id ? record : item) : [...records, record];
    const result = persistClientRecords(next, brands);
    if (!result.ok) { setStorageError(result.error); toast(result.error); return; }
    setRecords(next);
    setDraft(record);
    setDirty(false);
    setStorageError('');
    toast('Página salva neste navegador.');
  }

  function openShare(record, validate = false) {
    if (validate && !check(record)) return;
    try { setModal({ type: 'share', url: clientPreviewUrl(record.page), name: record.page.name }); }
    catch { toast('Não foi possível preparar a prévia. Confira os dados da página.'); }
  }

  async function copyLink() {
    const copied = await copyText(modal.url, shareRef.current);
    toast(copied ? 'Link de demonstração copiado.' : 'Selecione o link e copie pelo seu aparelho.');
  }

  function productAction(action, id) {
    if (action === 'delete') { setModal({ type: 'remove-product', id, name: draft.page.products.find(item => item.id === id)?.title }); return; }
    const products = [...draft.page.products];
    const index = products.findIndex(product => product.id === id);
    if (index < 0) return;
    if (action === 'toggle') products[index] = { ...products[index], enabled: !products[index].enabled };
    else {
      const next = action === 'up' ? index - 1 : index + 1;
      if (next < 0 || next >= products.length) return;
      [products[index], products[next]] = [products[next], products[index]];
    }
    changePage({ products });
  }

  function saveProduct(product) {
    const exists = draft.page.products.some(item => item.id === product.id);
    changePage({ products: exists ? draft.page.products.map(item => item.id === product.id ? product : item) : [...draft.page.products, product] });
    setModal(null);
    toast('Produto atualizado na prévia. Salve a página para guardar.');
  }

  const readyCount = records.filter(record => isConfigured(record, records, brands)).length;
  const visibleRecords = records.filter(record => {
    const matchesSearch = `${record.clientName} ${record.page.name} ${record.page.slug}`.toLocaleLowerCase('pt-BR').includes(search.trim().toLocaleLowerCase('pt-BR'));
    const ready = isConfigured(record, records, brands);
    return matchesSearch && (filter === 'all' || (filter === 'ready' ? ready : !ready));
  });

  return <div className="lv-admin">
    <aside className="lv-sidebar">
      <a className="lv-brand" href="/" onClick={event => { event.preventDefault(); showList('clients'); }}><span className="lv-brand-icon"><Icon name="brand" size={27} /></span><span>Locy<span className="lv-brand-accent">View</span><small>PAINEL DE CRIAÇÃO</small></span></a>
      <span className="lv-nav-label">WORKSPACE</span>
      <nav className="lv-nav" aria-label="Menu LocyView"><button className={!brandView ? 'is-active' : ''} aria-current={!brandView ? 'page' : undefined} type="button" onClick={() => showList('clients')}><Icon name="dashboard" />Páginas dos clientes<span>{records.length}</span></button><button className={brandView ? 'is-active' : ''} aria-current={brandView ? 'page' : undefined} type="button" onClick={() => showList('brands')}><Icon name="brand" />Marcas<span>{brands.length}</span></button><button type="button" onClick={() => setModal({ type: 'help' })}><Icon name="info" />Como funciona</button><a href="https://locytech-link-bio.locytech.chatgpt.site/" target="_blank" rel="noopener noreferrer"><Icon name="external" />Ver projeto de links</a></nav>
      <div className="lv-sidebar-note"><Icon name="links" size={25} /><strong>Uma marca.<br />Todas as conexões.</strong><p>Crie a identidade digital de cada cliente em um só lugar.</p><span>Front-end demonstrativo</span></div>
      <div className="lv-sidebar-footer"><span className="lv-local-chip">LV</span><span>LocyTech<small>Ambiente de demonstração</small></span></div>
    </aside>

    <main className="lv-main">
      <header className="lv-topbar"><div className="lv-breadcrumb">Workspace<Icon name="chevron" size={14} /><span>{viewLabel}</span></div><span className="lv-environment"><span />Dados locais</span></header>
      <div className="lv-page-content">
        <div className="lv-heading"><div><span className="lv-eyebrow">{brandView ? 'IDENTIDADE DAS MARCAS' : view === 'editor' ? 'CRIAÇÃO DE PÁGINA' : 'SEU PAINEL LOCYVIEW'}</span><h1 ref={headingRef} tabIndex={-1}>{view === 'brand-editor' ? brandDraft.name || 'Nova marca' : view === 'brands' ? 'Uma identidade. Muitas conexões.' : view === 'editor' ? draft.clientName || 'Nova página de cliente' : 'Cada cliente, uma página.'}</h1><p>{brandView ? 'Cadastre logo e cores uma vez. Use a mesma marca nas páginas dos clientes.' : view === 'editor' ? 'Personalize, confira a prévia e salve quando estiver pronto.' : 'Organize marcas, canais e produtos. Do cadastro à próxima conexão.'}</p></div><div className="lv-heading-actions">{view === 'clients' ? <button type="button" className="lv-btn lv-btn-primary" onClick={() => openRecord(null)} disabled={records.length >= 50}><Icon name="plus" size={20} />Criar página</button> : view === 'brands' ? <button type="button" className="lv-btn lv-btn-primary" onClick={() => openBrand(null)} disabled={brands.length >= 50}><Icon name="plus" size={20} />Cadastrar marca</button> : <><button type="button" className="lv-btn lv-btn-ghost" onClick={() => showList(brandView ? 'brands' : 'clients')}><Icon name="back" size={18} />Voltar</button>{view === 'editor' && <button type="button" className="lv-btn lv-btn-secondary" onClick={() => openShare(draft, true)}><Icon name="external" size={18} />Visualizar página</button>}</>}</div></div>
        <div className="lv-notice"><Icon name="info" size={19} /><p><strong>Você está em uma demonstração de front-end.</strong> Os cadastros ficam somente neste navegador. Nenhum dado é enviado ao servidor.</p><span>Sem conexão com API</span></div>
        {storageError && <p className="lv-error" role="alert">{storageError}</p>}

        {view === 'clients' ? <>
          <div className="lv-stats">{[[records.length, 'Páginas cadastradas', 'users', 'Neste navegador'], [readyCount, 'Configuradas', 'check', 'Prontas para visualizar'], [records.reduce((total, record) => total + record.page.products.length, 0), 'Produtos cadastrados', 'store', 'Nos catálogos dos clientes']].map(([value, label, icon, note]) => <article className="lv-stat" key={label}><div><small>{label}</small><strong>{value.toString().padStart(2, '0')}</strong><p>{note}</p></div><span className="lv-stat-icon"><Icon name={icon} size={22} /></span></article>)}</div>
          <section className="lv-clients-section" aria-labelledby="lv-clients-heading"><div className="lv-section-heading"><div><h2 id="lv-clients-heading">Páginas dos clientes</h2><p>Escolha uma página para continuar de onde parou.</p></div><span>{records.length} {records.length === 1 ? 'cadastro local' : 'cadastros locais'}</span></div>
            <div className="lv-toolbar"><label className="lv-search"><Icon name="search" size={19} /><input aria-label="Buscar cliente ou página" placeholder="Buscar cliente ou página…" value={search} onChange={event => setSearch(event.target.value)} /></label><div className="lv-filter" role="group" aria-label="Filtrar cadastros">{[['all', 'Todas'], ['ready', 'Configuradas'], ['draft', 'Pendentes']].map(([value, label]) => <button key={value} type="button" className={filter === value ? 'is-active' : ''} aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}</button>)}</div></div>
            <div className="lv-client-list">{visibleRecords.map(record => {
              const ready = isConfigured(record, records, brands);
              return <article key={record.id} className="lv-client-card"><div className="lv-client-avatar">{safeLogo(record.page.logo) ? <img src={safeLogo(record.page.logo)} alt="" /> : record.page.name.slice(0, 2).toUpperCase() || 'LV'}</div><div className="lv-client-info"><h3>{record.page.name || 'Página sem nome'}</h3><p>{record.clientName} <span aria-hidden="true">/</span> {record.page.slug}</p><small>{updatedLabel(record.updatedAt)}</small></div><span className={`lv-client-status ${ready ? 'lv-status-ready' : 'lv-status-draft'}`}><span />{ready ? 'Configurada' : 'Pendente'}</span><div className="lv-client-actions"><button type="button" className="lv-btn lv-btn-ghost lv-btn-small" onClick={() => openShare(record)} aria-label={`Visualizar ${record.page.name}`}><Icon name="external" size={17} />Visualizar</button><button type="button" className="lv-btn lv-btn-secondary lv-btn-small" onClick={() => openRecord(record)} aria-label={`Editar ${record.page.name}`}><Icon name="edit" size={17} />Editar página</button></div></article>;
            })}{!visibleRecords.length && <div className="lv-empty"><Icon name="search" size={30} /><h3>{records.length ? 'Nenhuma página encontrada.' : 'Vamos criar a primeira página?'}</h3><p>{records.length ? 'Tente outro nome ou altere o filtro.' : 'Comece com a identidade do cliente e adicione seus canais.'}</p><button type="button" className="lv-btn lv-btn-secondary" onClick={() => records.length ? (setSearch(''), setFilter('all')) : openRecord(null)}>{records.length ? 'Limpar filtros' : 'Criar página'}</button></div>}</div>
            <div className="lv-list-footnote"><Icon name="info" size={15} />A página LocyTech é um modelo inicial. Os indicadores refletem somente os cadastros locais.</div>
          </section>
        </> : view === 'brands' ? <BrandsList brands={brands} records={records} onCreate={() => openBrand(null)} onEdit={openBrand} onCreatePage={brand => openRecord(null, brand)} /> : view === 'brand-editor' ? <BrandForm key={brandDraft.id} brand={brandDraft} onChange={changeBrand} onSave={saveBrand} validation={validation} dirty={dirty} toast={toast} linkedCount={records.filter(record => record.brandId === brandDraft.id).length} /> : <div className="lv-editor-grid">
          <form className="lv-editor-panel" noValidate onSubmit={save}>
            <div className="lv-editor-tabs" role="group" aria-label="Etapas do cadastro">{steps.map((item, index) => <button key={item.id} type="button" className={step === item.id ? 'is-active' : ''} aria-pressed={step === item.id} aria-controls={`lv-panel-${item.id}`} onClick={() => { setStep(item.id); setValidation(null); }}><span>{index + 1}</span>{item.label}</button>)}</div>
            <div className="lv-panel-body" id={`lv-panel-${step}`}><span className="lv-panel-step"><Icon name={activeStep.icon} size={18} />ETAPA {steps.findIndex(item => item.id === step) + 1} DE 4</span><h2>{activeStep.title}</h2><p className="lv-panel-description">{activeStep.description}</p>{validation && <p className="lv-error" role="alert">{validation.message}</p>}
              {step === 'identity' && <><div className="field"><label htmlFor="admin-client-name">Nome do cliente <span>*</span></label><input id="admin-client-name" maxLength={80} value={draft.clientName} placeholder="Empresa ou nome do cliente" onChange={event => { setDraft(previous => ({ ...previous, clientName: event.target.value })); setDirty(true); setValidation(null); }} /><small>Identificação interna. Não aparece no link de demonstração.</small></div>
                <div className="field"><label htmlFor="admin-brand-select">Marca vinculada</label><select id="admin-brand-select" value={draft.brandId || ''} onChange={event => chooseBrand(event.target.value)}><option value="">Sem marca vinculada — personalizar nesta página</option>{brands.map(brand => <option key={brand.id} value={brand.id}>{brand.name}</option>)}</select><small>A marca fornece a identidade inicial. Você pode personalizar nome, logo e cores abaixo sem alterar outras páginas. Escolher outra marca reaplica sua identidade.</small></div>
                {linkedBrand ? <div className="lv-linked-brand"><div className="lv-client-avatar">{safeLogo(linkedBrand.logo) ? <img src={safeLogo(linkedBrand.logo)} alt="" /> : <Icon name="brand" />}</div><div><strong>Marca: {linkedBrand.name}</strong><p>{draft.identityOverrides?.length ? `${draft.identityOverrides.length} campos de identidade personalizados nesta página.` : 'Usando a identidade da marca. Edição livre abaixo.'}</p><div className="lv-brand-identity-actions"><button type="button" className="text-button" onClick={() => openBrand(linkedBrand)}>Editar marca central<Icon name="arrow" size={15} /></button>{Boolean(draft.identityOverrides?.length) && <button type="button" className="text-button" onClick={restoreBrandIdentity}>Usar identidade da marca</button>}</div></div></div> : <p className="lv-brand-tip">Você também pode cadastrar uma identidade na aba <button type="button" className="text-button" onClick={() => showList('brands')}>Marcas</button> e vinculá-la aqui depois.</p>}
                <div className="lv-form-divider" /><BrandFields key={`${draft.id}-${draft.brandId || 'custom'}`} state={draft.page} onChange={changePage} toast={toast} prefix="admin-" /></>}
              {step === 'appearance' && <>{linkedBrand && <div className="lv-linked-palette-note"><Icon name="palette" size={19} /><p><strong>Cores livres nesta página.</strong> Suas alterações não mudam a marca central nem as outras páginas.</p>{Boolean(draft.identityOverrides?.length) && <button type="button" className="lv-btn lv-btn-secondary lv-btn-small" onClick={restoreBrandIdentity}>Usar identidade da marca</button>}</div>}<ColorsFields state={draft.page} onChange={changePage} prefix="admin-" /><PageDesignFields page={draft.page} onChange={changePage} /></>}
              {step === 'links' && <><LinkFields state={draft.page} onChange={changePage} prefix="admin-" /><div className="lv-summary"><Icon name="links" size={22} /><div><strong>Quatro opções, uma só página.</strong><p>Instagram, WhatsApp e LinkedIn abrem os endereços configurados. Nossos produtos abre o catálogo. Deixe um canal vazio se ainda não tiver o link.</p></div></div></>}
              {step === 'products' && <CatalogFields page={draft.page} onEdit={id => setModal({ type: 'product', id })} onAction={productAction} />}
            </div>
            <footer className="lv-form-footer"><span className={dirty ? 'lv-dirty' : ''}><Icon name={dirty ? 'info' : 'check'} size={16} />{dirty ? 'Alterações não salvas' : draft.updatedAt ? 'Salvo neste navegador' : 'Novo cadastro local'}</span><div>{step !== 'products' && <button type="button" className="lv-btn lv-btn-ghost" onClick={() => setStep(steps[steps.findIndex(item => item.id === step) + 1].id)}>Próxima etapa<Icon name="arrow" size={17} /></button>}<button type="submit" className="lv-btn lv-btn-primary"><Icon name="save" size={18} />Salvar página</button></div></footer>
          </form>
          <PagePreview page={draft.page} />
        </div>}
        <footer className="lv-workspace-footer"><span>LocyView <span aria-hidden="true">/</span> por LocyTech</span><span>Feito para conectar marcas.</span></footer>
      </div>
    </main>

    {modal?.type === 'product' && <ProductEditor product={draft.page.products.find(item => item.id === modal.id)} onClose={() => setModal(null)} onSave={saveProduct} />}
    {modal && ['share', 'help', 'discard', 'remove-product'].includes(modal.type) && <Modal id="lv-dialog" className="modal lv-dialog" labelledBy="lv-dialog-title" onClose={() => setModal(null)}><div className="modal-topline"><span className="modal-eyebrow">LOCYVIEW</span><button type="button" className="icon-button" aria-label="Fechar janela" onClick={() => setModal(null)}><Icon name="close" /></button></div>
      {modal.type === 'share' && <><h2 id="lv-dialog-title">Página de demonstração</h2><p className="modal-description">Este link abre uma cópia de “{modal.name}”, sem os dados internos do cadastro.</p><label className="field-label" htmlFor="lv-share-url">Link de demonstração</label><textarea className="lv-share-link" id="lv-share-url" ref={shareRef} value={modal.url} readOnly rows={4} /><p className="lv-panel-description">Não é uma publicação em servidor. O link contém esta versão da página e não acompanha alterações futuras. Gere um novo link depois de editar.</p><div className="modal-actions"><button type="button" className="lv-btn lv-btn-secondary" onClick={copyLink}><Icon name="copy" size={18} />Copiar link</button><a className="lv-btn lv-btn-primary" href={modal.url} target="_blank" rel="noopener noreferrer">Abrir demonstração<Icon name="external" size={18} /></a></div></>}
      {modal.type === 'help' && <><h2 id="lv-dialog-title">Da marca à página.</h2><p className="modal-description">1. Na aba Marcas, cadastre nome, logo e cores.<br />2. Crie a página do cliente e escolha uma marca.<br />3. Personalize a identidade, escolha um dos 24 modelos e organize seus canais.<br />4. Adicione produtos, confira a prévia e salve neste navegador.</p><p className="modal-description">Você pode trocar nome, logo e cores só desta página. Esses campos personalizados são preservados quando a marca muda. Use “Usar identidade da marca” para voltar aos padrões. Links de demonstração já gerados continuam sendo cópias daquela versão.</p><div className="lv-summary"><Icon name="info" /><p>Esta versão contém somente o front-end. Não há login, servidor, sincronização entre aparelhos ou cadastro centralizado. Não use o painel para guardar dados sigilosos. A conexão com a API será uma etapa futura.</p></div></>}
      {modal.type === 'discard' && <><h2 id="lv-dialog-title">Sair sem salvar?</h2><p className="modal-description">As alterações desta edição serão descartadas. O último cadastro salvo continuará no navegador.</p><div className="modal-actions"><button type="button" className="lv-btn lv-btn-secondary" onClick={() => setModal(null)}>Continuar editando</button><button type="button" className="lv-btn lv-btn-primary" onClick={() => { const action = modal.action; setModal(null); setDirty(false); action(); }}>Descartar alterações</button></div></>}
      {modal.type === 'remove-product' && <><h2 id="lv-dialog-title">Remover este produto?</h2><p className="modal-description">“{modal.name}” sairá do catálogo desta edição. A mudança só será guardada quando você salvar a página.</p><div className="modal-actions"><button type="button" className="lv-btn lv-btn-secondary" onClick={() => setModal(null)}>Cancelar</button><button type="button" className="lv-btn lv-btn-primary" onClick={() => { changePage({ products: draft.page.products.filter(item => item.id !== modal.id) }); setModal(null); }}>Remover produto</button></div></>}
    </Modal>}
    {message && <div className="lv-toast" role="status" aria-live="polite"><Icon name="info" size={18} />{message}</div>}
  </div>;
}
