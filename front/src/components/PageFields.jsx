import React, { useEffect, useRef, useState } from 'react';
import Icon from './Icon';
import { cleanSlug, MAX_LOGO_BYTES, optimizeLogo, safeLogo } from '../utils/pageState';

export function BrandFields({ state, onChange, toast, prefix = '', showPageFields = true, hideLogo = false, hideName = false }) {
  const logoVersion = useRef(0);
  const logoInput = useRef(null);
  const activeReader = useRef(null);
  const [uploading, setUploading] = useState(false);
  const id = name => `${prefix}${name}`;
  const logo = safeLogo(state.logo);

  useEffect(() => () => {
    logoVersion.current += 1;
    if (activeReader.current?.readyState === FileReader.LOADING) activeReader.current.abort();
  }, []);

  function uploadLogo(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const version = ++logoVersion.current;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) { event.target.value = ''; toast('Escolha uma imagem PNG, JPG ou WebP.'); return; }
    if (file.size > MAX_LOGO_BYTES) { event.target.value = ''; toast('Escolha uma imagem de até 1,5 MB.'); return; }
    setUploading(true);
    const reader = new FileReader();
    activeReader.current = reader;
    reader.onload = async () => {
      if (version !== logoVersion.current) return;
      try {
        const source = safeLogo(reader.result);
        if (!source) throw new Error('Arquivo inválido');
        const optimized = await optimizeLogo(source);
        if (version !== logoVersion.current) return;
        onChange({ logo: optimized });
        toast('Logo atualizada.');
      } catch {
        if (version !== logoVersion.current) return;
        if (logoInput.current) logoInput.current.value = '';
        toast('Não foi possível abrir essa imagem. Tente outro arquivo.');
      } finally { if (version === logoVersion.current) setUploading(false); }
    };
    reader.onerror = () => { if (version === logoVersion.current) { setUploading(false); toast('Não foi possível ler a imagem.'); } };
    reader.readAsDataURL(file);
  }

  function removeLogo() {
    logoVersion.current += 1;
    if (activeReader.current?.readyState === FileReader.LOADING) activeReader.current.abort();
    setUploading(false);
    if (logoInput.current) logoInput.current.value = '';
    onChange({ logo: '' });
  }

  return <>
    {!hideLogo && <><span className="field-label">Logo da marca</span><div className="logo-upload">{logo ? <img id={id('logo-preview')} src={logo} alt="Logo atual" /> : <span className="logo-placeholder"><Icon name="brand" size={32} /></span>}<div><label className={`button button-secondary button-small${uploading ? ' is-loading' : ''}`} htmlFor={id('brand-logo')}><Icon name="upload" />{uploading ? 'Processando imagem…' : 'Alterar logo'}</label><button type="button" id={id('remove-logo')} className="text-button" disabled={!logo && !uploading} onClick={removeLogo}>Remover</button><p>PNG, JPG ou WebP · até 1,5 MB</p></div><input ref={logoInput} id={id('brand-logo')} className="visually-hidden" type="file" accept="image/png,image/jpeg,image/webp" aria-label="Enviar logo" onChange={uploadLogo} disabled={uploading} /></div></>}
    {!hideName && <div className="field"><label htmlFor={id('brand-name')}>Nome da marca <span>*</span></label><input id={id('brand-name')} value={state.name} maxLength={60} required placeholder="Nome da marca" onChange={event => onChange({ name: event.target.value })} /></div>}
    {showPageFields && <>
    <div className="field"><label htmlFor={id('brand-eyebrow')}>Texto acima do nome</label><input id={id('brand-eyebrow')} value={state.eyebrow} maxLength={70} placeholder="Ex.: Canais e produtos" onChange={event => onChange({ eyebrow: event.target.value })} /></div>
    <div className="field"><label htmlFor={id('brand-description')}>Apresentação</label><textarea id={id('brand-description')} rows={3} value={state.description} maxLength={240} placeholder="Descreva sua marca" onChange={event => onChange({ description: event.target.value })} /></div>
    <div className="field"><label htmlFor={id('page-slug')}>Identificador da página</label><div className="input-prefix"><span>/</span><input id={id('page-slug')} value={state.slug} maxLength={50} placeholder="sua-marca" onChange={event => onChange({ slug: event.target.value })} onBlur={event => { const slug = cleanSlug(event.target.value); if (slug !== state.slug) onChange({ slug }); }} /></div><small>Identificador visual nesta demonstração. O link gerado usa uma versão da página, sem servidor.</small></div>
    </>}
  </>;
}

function ColorField({ value, onChange, id, label, hint, readOnly = false }) {
  const [hex, setHex] = useState(value);
  useEffect(() => { setHex(value); }, [value]);

  function updateSwatch(event) {
    const next = event.target.value;
    setHex(next);
    onChange(next);
  }

  function updateHex(event) {
    const next = event.target.value;
    setHex(next);
    if (/^#[\da-f]{6}$/i.test(next)) onChange(next);
  }

  return <div className="color-option">
    <input id={id} type="color" value={value} onInput={updateSwatch} onChange={updateSwatch} disabled={readOnly} />
    <label htmlFor={id}><strong>{label}</strong></label>
    <small>{hint}</small>
    <input id={`${id}-hex`} className="color-hex" type="text" value={hex} onChange={updateHex} onBlur={() => { if (!/^#[\da-f]{6}$/i.test(hex)) setHex(value); }} readOnly={readOnly} aria-label={`Cor ${label} em hexadecimal${readOnly ? ' (definida pela marca)' : ''}`} title={readOnly ? 'Definida pela marca selecionada' : 'Use #RRGGBB'} placeholder="#RRGGBB" maxLength={7} spellCheck={false} autoComplete="off" />
  </div>;
}

export function ColorsFields({ state, onChange, prefix = '', showFooter = true, lockColors = false }) {
  return <>
    <div className={`color-grid${lockColors ? ' is-locked' : ''}`}>{[['primaryColor', 'primary-color', 'Principal', 'Botões e detalhes'], ['accentColor', 'accent-color', 'Destaque', 'Produtos e marca'], ['backgroundColor', 'background-color', 'Fundo', 'Fundo da página']].map(([key, id, label, hint]) => <ColorField key={key} id={`${prefix}${id}`} value={state[key]} label={label} hint={hint} readOnly={lockColors} onChange={value => onChange({ [key]: value })} />)}</div>
    {showFooter && <label className="checkbox-field"><input id={`${prefix}brand-footer-checkbox`} type="checkbox" checked={state.showBrand} onChange={event => onChange({ showBrand: event.target.checked })} /><span>Mostrar assinatura LocyTech no rodapé</span></label>}
  </>;
}

export function LinkFields({ state, onChange, prefix = '', showDefaultNote = false }) {
  return <>
    {showDefaultNote && <div className="editor-note"><Icon name="info" /><span>Instagram e WhatsApp já estão configurados. O link do LinkedIn ainda é um exemplo; substitua pelo perfil da empresa.</span></div>}
    <div id={`${prefix}contact-links-list`} className="editor-contact-list">{state.links.map(link => <article key={link.id} className="editor-contact" data-contact-id={link.id}><div className="editor-contact-head"><div className="editor-contact-title"><Icon name={link.platform} size={20} /><strong>{link.title}</strong></div></div><div className="editor-contact-fields"><div className="field"><label htmlFor={`${prefix}contact-${link.id}-url`}>Link de destino</label><input id={`${prefix}contact-${link.id}-url`} type="text" inputMode="url" value={link.url} maxLength={2048} placeholder="https://..." onChange={event => onChange({ links: state.links.map(item => item.id === link.id ? { ...item, url: event.target.value } : item) })} /></div></div></article>)}</div>
  </>;
}
