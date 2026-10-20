import React, { useState } from 'react';
import Icon from '../components/Icon';
import { BrandFields, ColorsFields } from '../components/PageFields';
import { contrastText, safeLogo } from '../utils/pageState';

const palette = [
  ['primaryColor', 'Principal'],
  ['accentColor', 'Destaque'],
  ['backgroundColor', 'Fundo']
];

function BrandLogo({ brand, className = 'lv-brand-avatar' }) {
  const logo = safeLogo(brand.logo);
  return <div className={className}>{logo ? <img src={logo} alt="" /> : <span>{brand.name?.trim().slice(0, 2).toLocaleUpperCase('pt-BR') || <Icon name="brand" size={30} />}</span>}</div>;
}

function PaletteSwatches({ brand }) {
  return <div className="lv-brand-swatches" aria-label={`Cores da marca ${brand.name || ''}`}>{palette.map(([key, label]) => <span className="lv-brand-swatch" key={key}><span style={{ backgroundColor: brand[key] }} aria-hidden="true" /><span><small>{label}</small><strong>{brand[key]}</strong></span></span>)}</div>;
}

export function BrandsList({ brands, records, onCreate, onEdit, onCreatePage }) {
  const [search, setSearch] = useState('');
  const visibleBrands = brands.filter(brand => brand.name.toLocaleLowerCase('pt-BR').includes(search.trim().toLocaleLowerCase('pt-BR')));

  return <section className="lv-brands-section" aria-labelledby="lv-brands-heading">
    <div className="lv-section-heading"><div><h2 id="lv-brands-heading">Marcas cadastradas</h2><p>Uma identidade visual para reutilizar nas páginas dos clientes.</p></div></div>
    <div className="lv-toolbar"><label className="lv-search"><Icon name="search" size={19} /><input aria-label="Buscar marca" placeholder="Buscar marca…" value={search} onChange={event => setSearch(event.target.value)} /></label><span className="lv-brand-total">{brands.length} {brands.length === 1 ? 'marca neste navegador' : 'marcas neste navegador'}</span></div>
    <div className="lv-brands-grid">{visibleBrands.map(brand => {
      const linkedCount = records.filter(record => record.brandId === brand.id).length;
      return <article className="lv-brand-card" key={brand.id}>
        <div className="lv-brand-card-heading"><BrandLogo brand={brand} /><div><h3>{brand.name}</h3><p>{linkedCount} {linkedCount === 1 ? 'página vinculada' : 'páginas vinculadas'}</p></div></div>
        <PaletteSwatches brand={brand} />
        <div className="lv-brand-card-actions"><button className="lv-btn lv-btn-ghost lv-btn-small" type="button" onClick={() => onEdit(brand)} aria-label={`Editar marca ${brand.name}`}><Icon name="edit" size={17} />Editar marca</button><button className="lv-btn lv-btn-secondary lv-btn-small" type="button" disabled={records.length >= 50} onClick={() => onCreatePage(brand)} aria-label={`Criar página com a marca ${brand.name}`}><Icon name="plus" size={17} />Criar página</button></div>
      </article>;
    })}</div>
    {!visibleBrands.length && <div className="lv-empty"><Icon name={brands.length ? 'search' : 'palette'} size={32} /><h3>{brands.length ? 'Nenhuma marca encontrada.' : 'Comece pela identidade da marca.'}</h3><p>{brands.length ? 'Tente outro nome para encontrar a marca.' : 'Cadastre nome, logo e cores antes de criar as páginas dos clientes.'}</p><button className="lv-btn lv-btn-secondary" type="button" onClick={() => brands.length ? setSearch('') : onCreate()}>{brands.length ? 'Limpar busca' : 'Cadastrar primeira marca'}</button></div>}
    <div className="lv-list-footnote"><Icon name="info" size={16} />As marcas e os vínculos com as páginas ficam somente neste navegador.</div>
  </section>;
}

export function BrandForm({ brand, onChange, onSave, validation, dirty, toast, linkedCount = 0 }) {
  const previewStyle = { backgroundColor: brand.backgroundColor, color: contrastText(brand.backgroundColor) };
  return <div className="lv-editor-grid lv-brand-editor">
    <form className="lv-editor-panel lv-brand-form" noValidate onSubmit={onSave}>
      <div className="lv-panel-body"><span className="lv-panel-step"><Icon name="palette" size={18} />IDENTIDADE DA MARCA</span><h2>Uma marca, várias páginas.</h2><p className="lv-panel-description">Defina o nome, a logo e a paleta que vão identificar as páginas vinculadas.</p>
        {validation && <p className="lv-error" role="alert">{validation.message}</p>}
        <BrandFields key={brand.id} state={brand} onChange={onChange} toast={toast} prefix="brand-" showPageFields={false} />
        <div className="lv-form-divider" /><h3 className="lv-brand-palette-heading">Paleta de cores</h3><p className="lv-panel-description">Escolha cores com contraste para manter a leitura confortável.</p><ColorsFields state={brand} onChange={onChange} prefix="brand-" showFooter={false} />
        <div className="lv-summary"><Icon name="info" size={22} /><div><strong>{linkedCount ? `Esta marca identifica ${linkedCount} ${linkedCount === 1 ? 'página local' : 'páginas locais'}.` : 'Identidade pronta para as próximas páginas.'}</strong><p>Ao salvar a marca, a identidade é atualizada nas páginas vinculadas, exceto nos campos personalizados diretamente em cada página. Links de demonstração já gerados continuam com a versão anterior; gere um novo link depois da alteração.</p></div></div>
      </div>
      <footer className="lv-form-footer"><span className={dirty ? 'lv-dirty' : ''}><Icon name={dirty ? 'info' : 'check'} size={16} />{dirty ? 'Alterações não salvas' : brand.updatedAt ? 'Salva neste navegador' : 'Nova marca local'}</span><button type="submit" className="lv-btn lv-btn-primary"><Icon name="save" size={18} />Salvar marca</button></footer>
    </form>
    <aside className="lv-preview-pane lv-brand-preview" aria-label="Prévia da identidade da marca"><div className="lv-preview-header"><span><Icon name="brand" size={18} />Prévia da marca</span><small>Identidade</small></div><div className="lv-brand-preview-surface" style={previewStyle}><BrandLogo brand={brand} className="lv-brand-preview-logo" /><small>IDENTIDADE VISUAL</small><h3>{brand.name || 'Nome da marca'}</h3><p>Nome, logo e cores que acompanham as páginas do cliente.</p><span className="lv-brand-preview-button" style={{ backgroundColor: brand.primaryColor, color: contrastText(brand.primaryColor) }}>Cor principal<Icon name="arrow" size={17} /></span><span className="lv-brand-preview-accent" style={{ color: brand.accentColor }}><Icon name="check" size={18} />Cor de destaque</span></div><PaletteSwatches brand={brand} /><p className="lv-preview-note">Prévia visual da identidade. Textos, links e produtos são configurados em cada página.</p></aside>
  </div>;
}
