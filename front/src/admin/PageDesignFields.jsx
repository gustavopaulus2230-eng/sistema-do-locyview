import React, { useId, useState } from 'react';
import Icon from '../components/Icon';
import { contrastText } from '../utils/pageState';
import { DESIGN_DEFAULTS, PAGE_TEMPLATES, applyTemplate, normalizeDesign } from '../utils/pageDesign';
import '../styles/designer.css';

const categories = ['Pilha', 'Lateral', 'Grade', 'Mosaico', 'Destaque', 'Compacto'];
const channels = {
  instagram: { label: 'Instagram', icon: 'instagram' },
  whatsapp: { label: 'WhatsApp', icon: 'whatsapp' },
  linkedin: { label: 'LinkedIn', icon: 'linkedin' },
  products: { label: 'Nossos produtos', icon: 'store' }
};
const layoutOptions = [['stack', 'Pilha — links em sequência'], ['split', 'Lateral — identidade ao lado'], ['grid', 'Grade — cartões em colunas'], ['bento', 'Mosaico — blocos de tamanhos diferentes'], ['spotlight', 'Destaque — identidade em evidência'], ['compact', 'Compacto — lista direta']];
const templateSummaries = { soft: 'Cartões suaves · Fundo liso', outline: 'Contornos · Estilo editorial', solid: 'Cartões preenchidos · Degradê', glass: 'Transparência · Estrelas' };

function TemplateThumbnail({ template, page }) {
  const design = normalizeDesign(template.design);
  const style = {
    '--thumb-primary': page.primaryColor || '#4d8dff',
    '--thumb-accent': page.accentColor || '#f4cf46',
    '--thumb-background': page.backgroundColor || '#0b1425',
    '--thumb-ink': contrastText(page.backgroundColor || '#0b1425'),
    '--thumb-on-primary': contrastText(page.primaryColor || '#4d8dff'),
    '--thumb-radius': `${Math.max(1, Math.round(design.radius / 4))}px`
  };
  return <span className="lv-design-thumb" data-layout={design.layout} data-cards={design.cardStyle} data-background={design.backgroundStyle} data-font={design.fontFamily} data-align={design.align} style={style} aria-hidden="true">
    <span className="lv-thumb-identity"><span className={`lv-thumb-logo lv-thumb-logo-${design.logoShape}`}><Icon name="brand" size={15} /></span><span className="lv-thumb-title"><span /><span /></span><span className="lv-thumb-description"><span /><span /></span></span>
    <span className="lv-thumb-channels">{design.channelOrder.map((key, index) => <span className={`lv-thumb-channel${key === 'products' ? ' lv-thumb-product' : ''}`} key={key}>{design.showIcons && <span className="lv-thumb-channel-icon"><Icon name={channels[key].icon} size={10} /></span>}<span className="lv-thumb-channel-copy"><span />{design.showDescriptions && <span />}</span>{design.showArrows && <span className="lv-thumb-arrow"><Icon name="arrow" size={8} /></span>}<i className="lv-thumb-position">{index + 1}</i></span>)}</span>
  </span>;
}

function SelectField({ id, label, value, options, onChange }) {
  return <div className="lv-design-control"><label htmlFor={id}>{label}</label><select id={id} value={value} onChange={event => onChange(event.target.value)}>{options.map(([key, title]) => <option value={key} key={key}>{title}</option>)}</select></div>;
}

function RangeField({ id, label, value, min, max, step = 1, unit = 'px', onChange }) {
  return <div className="lv-design-control lv-design-range"><div><label htmlFor={id}>{label}</label><output htmlFor={id}>{value}{unit}</output></div><input id={id} type="range" min={min} max={max} step={step} value={value} onChange={event => onChange(Number(event.target.value))} aria-valuetext={`${value}${unit === '%' ? ' por cento' : ' pixels'}`} /><span className="lv-design-range-limits" aria-hidden="true"><span>{min}{unit}</span><span>{max}{unit}</span></span></div>;
}

export default function PageDesignFields({ page, onChange }) {
  const id = useId();
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

  return <section className="lv-design-fields" aria-labelledby={`${id}-heading`}>
    <div className="lv-design-heading"><span className="lv-design-section-icon"><Icon name="window" size={21} /></span><div><h3 id={`${id}-heading`}>Um visual para cada página.</h3><p>Escolha um ponto de partida e ajuste cada detalhe. Logo e cores da marca são mantidas.</p></div></div>
    <details className="lv-template-library" open>
      <summary><span><strong>Biblioteca de modelos</strong><small>{PAGE_TEMPLATES.length} opções · 6 composições</small></span><span className="lv-design-current">{selected ? `Base: ${selected.name}` : 'Visual personalizado'}<Icon name="down" size={17} /></span></summary>
      <div className="lv-template-library-body">
        <div className="lv-template-filters" role="group" aria-label="Filtrar modelos por composição">{['Todas', ...categories].map(item => <button type="button" key={item} className={category === item ? 'is-active' : ''} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}{item === 'Todas' && <span>{PAGE_TEMPLATES.length}</span>}</button>)}</div>
        <p className="lv-design-help">Os modelos mudam a composição, os cartões e o fundo. Nenhum modelo substitui seus textos, links, produtos ou cores.</p>
        <div className="lv-design-gallery" role="group" aria-label={`${visibleTemplates.length} modelos de página`}>{visibleTemplates.map(template => {
          const active = design.templateId === template.id;
          return <button className={`lv-template-card${active ? ' is-selected' : ''}`} type="button" key={template.id} aria-pressed={active} aria-label={`Usar modelo ${template.name}: ${template.description}`} onClick={() => onChange({ design: applyTemplate(design, template.id) })}>
            <TemplateThumbnail template={template} page={page} />
            <span className="lv-template-card-copy"><span><strong>{template.name}</strong><small>{templateSummaries[template.design.cardStyle] || template.description}</small></span><span className="lv-template-selection" aria-hidden="true">{active ? <Icon name="check" size={14} /> : <Icon name="plus" size={14} />}</span></span>
          </button>;
        })}</div>
        <p className="lv-design-gallery-note"><Icon name="info" size={17} />A miniatura mostra a composição. Confira seus textos e canais na prévia ao lado.</p>
      </div>
    </details>

    <div className="lv-design-settings">
      <div className="lv-design-subheading"><h4>Deixe do seu jeito</h4><p>Todos os ajustes aparecem na prévia imediatamente.</p></div>
      <div className="lv-design-controls-grid">
        <SelectField id={`${id}-layout`} label="Composição" value={design.layout} options={layoutOptions} onChange={value => update({ layout: value })} />
        <SelectField id={`${id}-cards`} label="Estilo dos cartões" value={design.cardStyle} options={[['soft', 'Suave'], ['outline', 'Somente contorno'], ['solid', 'Preenchido'], ['glass', 'Vidro']]} onChange={value => update({ cardStyle: value })} />
        <SelectField id={`${id}-background`} label="Estilo de fundo" value={design.backgroundStyle} options={[['solid', 'Cor sólida'], ['gradient', 'Degradê'], ['grid', 'Grade discreta'], ['stars', 'Estrelas']]} onChange={value => update({ backgroundStyle: value })} />
        <SelectField id={`${id}-font`} label="Tipografia" value={design.fontFamily} options={[['sans', 'Essencial — sem serifa'], ['modern', 'Moderna — geométrica'], ['serif', 'Editorial — com serifa']]} onChange={value => update({ fontFamily: value })} />
        <SelectField id={`${id}-align`} label="Alinhamento da identidade" value={design.align} options={[['center', 'Centralizado'], ['left', 'À esquerda']]} onChange={value => update({ align: value })} />
        <SelectField id={`${id}-logo-shape`} label="Formato da logo" value={design.logoShape} options={[['rounded', 'Cantos arredondados'], ['circle', 'Circular'], ['square', 'Quadrado']]} onChange={value => update({ logoShape: value })} />
        <RangeField id={`${id}-text`} label="Tamanho dos textos" value={design.textScale} min={90} max={125} step={5} unit="%" onChange={value => update({ textScale: value })} />
        <RangeField id={`${id}-radius`} label="Cantos dos cartões" value={design.radius} min={0} max={32} onChange={value => update({ radius: value })} />
        <RangeField id={`${id}-gap`} label="Espaço entre os canais" value={design.gap} min={8} max={28} onChange={value => update({ gap: value })} />
        <RangeField id={`${id}-logo-size`} label="Tamanho da logo" value={design.logoSize} min={64} max={200} step={4} onChange={value => update({ logoSize: value })} />
      </div>
      <fieldset className="lv-design-toggles"><legend>O que aparece nos canais</legend>{[['showIcons', 'Ícones dos canais', 'Ajuda a reconhecer cada plataforma.'], ['showDescriptions', 'Descrições dos canais', 'Mostra o texto de apoio de cada opção.'], ['showArrows', 'Setas nos cartões', 'Indica visualmente a ação de abrir.']].map(([key, label, description]) => <label key={key} className="lv-design-toggle"><input type="checkbox" checked={design[key]} onChange={event => update({ [key]: event.target.checked })} /><span><strong>{label}</strong><small>{description}</small></span></label>)}</fieldset>
    </div>

    <div className="lv-design-order"><div className="lv-design-subheading"><h4>Ordem dos canais</h4><p>Defina o que o visitante encontra primeiro.</p></div><ol aria-label="Ordem de exibição dos canais">{design.channelOrder.map((key, index) => <li key={key}><span className="lv-design-order-position" aria-hidden="true">{index + 1}</span><Icon name={channels[key].icon} size={20} /><strong>{channels[key].label}</strong><span className="lv-design-order-actions"><button type="button" aria-label={`Mover ${channels[key].label} para cima`} disabled={index === 0} onClick={() => moveChannel(index, -1)}><Icon name="up" size={18} /></button><button type="button" aria-label={`Mover ${channels[key].label} para baixo`} disabled={index === design.channelOrder.length - 1} onClick={() => moveChannel(index, 1)}><Icon name="down" size={18} /></button></span></li>)}</ol></div>
    <p className="lv-design-save-note"><Icon name="save" size={18} />A prévia muda na hora. Use Salvar página para guardar o visual neste navegador.</p>
  </section>;
}
