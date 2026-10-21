import React, { useId, useState } from 'react';
import Icon from '../components/Icon';
import { contrastText, safeLogo } from '../utils/pageState';
import { DESIGN_DEFAULTS, PAGE_TEMPLATES, applyTemplate, normalizeDesign } from '../utils/pageDesign';
import '../styles/designer.css';

const categories = ['Pilha', 'Lateral', 'Grade', 'Mosaico', 'Destaque', 'Compacto'];
const sections = [
  { id: 'templates', label: 'Modelos', icon: 'window' },
  { id: 'settings', label: 'Ajustes', icon: 'palette' },
  { id: 'order', label: 'Organização', icon: 'links' }
];
const channels = {
  instagram: { label: 'Instagram', icon: 'instagram' },
  whatsapp: { label: 'WhatsApp', icon: 'whatsapp' },
  linkedin: { label: 'LinkedIn', icon: 'linkedin' },
  products: { label: 'Nossos produtos', icon: 'store' }
};
const layoutOptions = [['stack', 'Pilha — links em sequência'], ['split', 'Lateral — identidade ao lado'], ['grid', 'Grade — cartões em colunas'], ['bento', 'Mosaico — blocos de tamanhos diferentes'], ['spotlight', 'Destaque — identidade em evidência'], ['compact', 'Compacto — lista direta']];
const templateSummaries = { soft: 'Cartões suaves · Fundo liso', outline: 'Contornos · Estilo editorial', solid: 'Cartões preenchidos · Degradê', glass: 'Transparência · Estrelas' };

function TemplateThumbnail({ template, page, useLogo = false }) {
  const design = normalizeDesign(template.design);
  const logo = useLogo ? safeLogo(page.logo) : '';
  const style = {
    '--thumb-primary': page.primaryColor || '#4d8dff',
    '--thumb-accent': page.accentColor || '#f4cf46',
    '--thumb-background': page.backgroundColor || '#0b1425',
    '--thumb-ink': contrastText(page.backgroundColor || '#0b1425'),
    '--thumb-on-primary': contrastText(page.primaryColor || '#4d8dff'),
    '--thumb-radius': `${Math.max(1, Math.round(design.radius / 4))}px`
  };
  return <span className="lv-design-thumb" data-layout={design.layout} data-cards={design.cardStyle} data-background={design.backgroundStyle} data-font={design.fontFamily} data-align={design.align} style={style} aria-hidden="true">
    <span className="lv-thumb-identity"><span className={`lv-thumb-logo lv-thumb-logo-${design.logoShape}`}>{logo ? <img src={logo} alt="" /> : <Icon name="brand" size={15} />}</span><span className="lv-thumb-title"><span /><span /></span><span className="lv-thumb-description"><span /><span /></span></span>
    <span className="lv-thumb-channels">{design.channelOrder.map((key, index) => <span className={`lv-thumb-channel${key === 'products' ? ' lv-thumb-product' : ''}`} key={key}>{design.showIcons && <span className="lv-thumb-channel-icon"><Icon name={channels[key].icon} size={10} /></span>}<span className="lv-thumb-channel-copy"><span />{design.showDescriptions && <span />}</span>{design.showArrows && <span className="lv-thumb-arrow"><Icon name="arrow" size={8} /></span>}<i className="lv-thumb-position">{index + 1}</i></span>)}</span>
  </span>;
}

function SelectField({ id, label, value, options, onChange }) {
  return <div className="lv-design-control"><label htmlFor={id}>{label}</label><select id={id} value={value} onChange={event => onChange(event.target.value)}>{options.map(([key, title]) => <option value={key} key={key}>{title}</option>)}</select></div>;
}

function RangeField({ id, label, value, min, max, step = 1, unit = 'px', onChange }) {
  return <div className="lv-design-control lv-design-range"><div><label htmlFor={id}>{label}</label><output htmlFor={id}>{value}{unit}</output></div><input id={id} type="range" min={min} max={max} step={step} value={value} onChange={event => onChange(Number(event.target.value))} aria-valuetext={`${value}${unit === '%' ? ' por cento' : ' pixels'}`} /><span className="lv-design-range-limits" aria-hidden="true"><span>{min}{unit}</span><span>{max}{unit}</span></span></div>;
}

function SettingCard({ icon, title, description, children }) {
  return <section className="lv-design-setting-card"><header><span><Icon name={icon} size={19} /></span><div><h4>{title}</h4><p>{description}</p></div></header>{children}</section>;
}

export default function PageDesignFields({ page, onChange }) {
  const id = useId();
  const [section, setSection] = useState('templates');
  const [category, setCategory] = useState('Todas');
  const design = normalizeDesign(page.design || DESIGN_DEFAULTS);
  const selected = PAGE_TEMPLATES.find(template => template.id === design.templateId);
  const visibleTemplates = category === 'Todas' ? PAGE_TEMPLATES : PAGE_TEMPLATES.filter(template => template.category === category);
  const update = patch => onChange({ design: normalizeDesign({ ...design, ...patch }) });

  function moveChannel(index, delta) {
    const nextIndex = index + delta;
    if (nextIndex < 0 || nextIndex >= design.channelOrder.length) return;
    const channelOrder = [...design.channelOrder];
    [channelOrder[index], channelOrder[nextIndex]] = [channelOrder[nextIndex], channelOrder[index]];
    update({ channelOrder });
  }

  function navigateSection(event, index) {
    const direction = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    let nextIndex;
    if (direction) nextIndex = (index + direction + sections.length) % sections.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = sections.length - 1;
    else return;
    event.preventDefault();
    setSection(sections[nextIndex].id);
    document.getElementById(`${id}-tab-${sections[nextIndex].id}`)?.focus();
  }

  return <section className="lv-design-fields" aria-labelledby={`${id}-heading`}>
    <div className="lv-design-heading"><span className="lv-design-section-icon"><Icon name="window" size={21} /></span><div><h3 id={`${id}-heading`}>Design da sua página</h3><p>Encontre um estilo. Ajuste os detalhes. Deixe a sua marca aparecer.</p></div></div>

    <div className="lv-design-selected-hero">
      <div className="lv-design-hero-thumbnail"><TemplateThumbnail template={{ design }} page={page} useLogo /></div>
      <div className="lv-design-hero-copy"><span className="lv-design-kicker">SEU MODELO BASE</span><h4>{selected?.name || 'Visual personalizado'}</h4><p>Uma identidade sua, em cada detalhe da página.</p><div className="lv-design-hero-tags"><span><Icon name="window" size={14} />{PAGE_TEMPLATES.length} modelos</span><span><Icon name="check" size={14} />Suas cores preservadas</span></div></div>
    </div>

    <div className="lv-design-navigation" role="tablist" aria-label="Personalizar o visual da página">{sections.map((item, index) => <button key={item.id} type="button" role="tab" id={`${id}-tab-${item.id}`} aria-controls={`${id}-panel-${item.id}`} aria-selected={section === item.id} tabIndex={section === item.id ? 0 : -1} className={section === item.id ? 'is-active' : ''} onClick={() => setSection(item.id)} onKeyDown={event => navigateSection(event, index)}><Icon name={item.icon} size={18} /><span>{item.label}</span></button>)}</div>

    <div id={`${id}-panel-templates`} role="tabpanel" aria-labelledby={`${id}-tab-templates`} hidden={section !== 'templates'} className="lv-design-tab-panel lv-template-library">
      <div className="lv-design-panel-topline"><div><h4>Qual estilo combina com você?</h4><p>Escolha a composição e veja o resultado na prévia.</p></div><span>{visibleTemplates.length} modelos</span></div>
      <div className="lv-template-filters" role="group" aria-label="Filtrar modelos por composição">{['Todas', ...categories].map(item => <button type="button" key={item} className={category === item ? 'is-active' : ''} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div>
      <div className="lv-design-gallery" role="group" aria-label={`${visibleTemplates.length} modelos de página`}>{visibleTemplates.map(template => {
        const active = design.templateId === template.id;
        return <button className={`lv-template-card${active ? ' is-selected' : ''}`} type="button" key={template.id} aria-pressed={active} aria-label={`Usar modelo ${template.name}: ${template.description}`} onClick={() => onChange({ design: applyTemplate(design, template.id) })}>
          <TemplateThumbnail template={template} page={page} />
          <span className="lv-template-card-copy"><span><strong>{template.name}</strong><small>{templateSummaries[template.design.cardStyle] || template.description}</small></span><span className="lv-template-selection" aria-hidden="true">{active ? <Icon name="check" size={14} /> : <Icon name="plus" size={14} />}</span></span>
        </button>;
      })}</div>
      <p className="lv-design-gallery-note"><Icon name="palette" size={17} />Todos os modelos mantêm sua logo, cores, textos e produtos.</p>
    </div>

    <div id={`${id}-panel-settings`} role="tabpanel" aria-labelledby={`${id}-tab-settings`} hidden={section !== 'settings'} className="lv-design-tab-panel lv-design-settings">
      <div className="lv-design-panel-topline"><div><h4>Pequenos ajustes. Seu estilo.</h4><p>As alterações aparecem na prévia enquanto você edita.</p></div></div>
      <SettingCard icon="window" title="Composição e cartões" description="A estrutura que recebe seus visitantes."><div className="lv-design-controls-grid">
        <SelectField id={`${id}-layout`} label="Composição" value={design.layout} options={layoutOptions} onChange={value => update({ layout: value })} />
        <SelectField id={`${id}-cards`} label="Estilo dos cartões" value={design.cardStyle} options={[['soft', 'Suave'], ['outline', 'Somente contorno'], ['solid', 'Preenchido'], ['glass', 'Vidro']]} onChange={value => update({ cardStyle: value })} />
        <SelectField id={`${id}-background`} label="Estilo de fundo" value={design.backgroundStyle} options={[['solid', 'Cor sólida'], ['gradient', 'Degradê'], ['grid', 'Grade discreta'], ['stars', 'Estrelas']]} onChange={value => update({ backgroundStyle: value })} />
        <SelectField id={`${id}-align`} label="Alinhamento" value={design.align} options={[['center', 'Centralizado'], ['left', 'À esquerda']]} onChange={value => update({ align: value })} />
      </div></SettingCard>
      <SettingCard icon="edit" title="Tipografia" description="Dê a voz certa aos seus textos."><div className="lv-design-controls-grid">
        <SelectField id={`${id}-font`} label="Fonte dos textos" value={design.fontFamily} options={[['sans', 'Essencial — sem serifa'], ['modern', 'Moderna — geométrica'], ['serif', 'Editorial — com serifa']]} onChange={value => update({ fontFamily: value })} />
        <RangeField id={`${id}-text`} label="Tamanho dos textos" value={design.textScale} min={90} max={125} step={5} unit="%" onChange={value => update({ textScale: value })} />
      </div></SettingCard>
      <SettingCard icon="brand" title="Apresentação da logo" description="Um espaço para a identidade da sua marca."><div className="lv-design-controls-grid">
        <SelectField id={`${id}-logo-shape`} label="Formato da logo" value={design.logoShape} options={[['rounded', 'Cantos arredondados'], ['circle', 'Circular'], ['square', 'Quadrado']]} onChange={value => update({ logoShape: value })} />
        <RangeField id={`${id}-logo-size`} label="Tamanho da logo" value={design.logoSize} min={64} max={200} step={4} onChange={value => update({ logoSize: value })} />
      </div></SettingCard>
      <SettingCard icon="dashboard" title="Formas e respiro" description="A distância e os contornos entre cada conexão."><div className="lv-design-controls-grid">
        <RangeField id={`${id}-radius`} label="Cantos dos cartões" value={design.radius} min={0} max={32} onChange={value => update({ radius: value })} />
        <RangeField id={`${id}-gap`} label="Espaço entre os canais" value={design.gap} min={8} max={28} onChange={value => update({ gap: value })} />
      </div></SettingCard>
      <fieldset className="lv-design-toggles"><legend>Detalhes que fazem diferença</legend>{[['showIcons', 'Ícones dos canais', 'Reconheça cada plataforma de primeira.'], ['showDescriptions', 'Descrições dos canais', 'Uma frase de apoio em cada opção.'], ['showArrows', 'Setas nos cartões', 'Um convite visual para abrir o link.']].map(([key, label, description]) => <label key={key} className="lv-design-toggle"><input type="checkbox" checked={design[key]} onChange={event => update({ [key]: event.target.checked })} /><span><strong>{label}</strong><small>{description}</small></span></label>)}</fieldset>
    </div>

    <div id={`${id}-panel-order`} role="tabpanel" aria-labelledby={`${id}-tab-order`} hidden={section !== 'order'} className="lv-design-tab-panel lv-design-order">
      <div className="lv-design-panel-topline"><div><h4>A próxima conexão começa aqui.</h4><p>Organize os canais na ordem em que seus visitantes vão encontrá-los.</p></div></div>
      <ol aria-label="Ordem de exibição dos canais">{design.channelOrder.map((key, index) => <li key={key}><span className="lv-design-order-position" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><span className="lv-design-order-icon"><Icon name={channels[key].icon} size={20} /></span><strong>{channels[key].label}<small>{index === 0 ? 'Primeira conexão' : key === 'products' ? 'Abre o catálogo' : 'Canal de contato'}</small></strong><span className="lv-design-order-actions"><button type="button" aria-label={`Mover ${channels[key].label} para cima`} disabled={index === 0} onClick={() => moveChannel(index, -1)}><Icon name="up" size={18} /></button><button type="button" aria-label={`Mover ${channels[key].label} para baixo`} disabled={index === design.channelOrder.length - 1} onClick={() => moveChannel(index, 1)}><Icon name="down" size={18} /></button></span></li>)}</ol>
      <p className="lv-design-gallery-note"><Icon name="info" size={17} />Use as setas para mudar a posição. Nenhum link ou produto é alterado.</p>
    </div>
    <p className="lv-design-save-note"><Icon name="save" size={18} />Gostou do resultado? Salve a página para guardar suas escolhas neste navegador.</p>
  </section>;
}
