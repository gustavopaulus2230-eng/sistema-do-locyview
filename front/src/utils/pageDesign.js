const CHANNELS = ['instagram', 'whatsapp', 'linkedin', 'products'];
const LAYOUTS = ['stack', 'split', 'grid', 'bento', 'spotlight', 'compact'];
const CARD_STYLES = ['soft', 'outline', 'solid', 'glass'];
const BACKGROUNDS = ['solid', 'gradient', 'grid', 'stars'];
const FONTS = ['sans', 'modern', 'serif'];

export const DESIGN_DEFAULTS = Object.freeze({
  templateId: 'pilha-essencial',
  layout: 'stack',
  cardStyle: 'soft',
  backgroundStyle: 'solid',
  fontFamily: 'sans',
  textScale: 100,
  radius: 16,
  gap: 12,
  logoSize: 104,
  logoShape: 'rounded',
  align: 'center',
  showIcons: true,
  showDescriptions: true,
  showArrows: true,
  channelOrder: Object.freeze([...CHANNELS])
});

const layoutPresets = [
  { id: 'pilha', name: 'Pilha', description: 'Canais em uma coluna, com leitura contínua.', design: { layout: 'stack' } },
  { id: 'lateral', name: 'Lateral', description: 'Identidade ao lado dos canais nas telas maiores.', design: { layout: 'split', align: 'left', logoSize: 156, gap: 16, radius: 18, textScale: 105 } },
  { id: 'grade', name: 'Grade', description: 'Atalhos distribuídos em cartões de uma grade.', design: { layout: 'grid', logoSize: 112, gap: 14, radius: 18 } },
  { id: 'mosaico', name: 'Mosaico', description: 'Composição de cartões com destaque para o catálogo.', design: { layout: 'bento', align: 'left', logoSize: 120, radius: 22 } },
  { id: 'destaque', name: 'Destaque', description: 'Logo e apresentação maiores antes dos canais.', design: { layout: 'spotlight', logoSize: 176, gap: 18, radius: 24, textScale: 110 } },
  { id: 'compacto', name: 'Compacto', description: 'Identidade reduzida e atalhos próximos, sem descrições.', design: { layout: 'compact', align: 'left', logoSize: 72, gap: 8, radius: 10, textScale: 95, showDescriptions: false } }
];

const stylePresets = [
  { id: 'essencial', name: 'essencial', description: 'Cartões suaves sobre fundo liso.', design: () => ({ cardStyle: 'soft', backgroundStyle: 'solid', fontFamily: 'sans' }) },
  { id: 'editorial', name: 'editorial', description: 'Contornos, fundo quadriculado e tipografia com serifa.', design: base => ({ cardStyle: 'outline', backgroundStyle: 'grid', fontFamily: 'serif', align: 'left', radius: 8, gap: Math.min(28, base.gap + 4), logoSize: Math.max(64, base.logoSize - 8), logoShape: 'square' }) },
  { id: 'impacto', name: 'impacto', description: 'Cartões preenchidos, gradiente e maior respiro.', design: base => ({ cardStyle: 'solid', backgroundStyle: 'gradient', fontFamily: 'modern', align: 'center', radius: Math.min(32, base.radius + 6), gap: Math.min(28, base.gap + 6), textScale: Math.min(125, base.textScale + 5), logoShape: 'circle' }) },
  { id: 'cristal', name: 'cristal', description: 'Cartões translúcidos, estrelas e cantos arredondados.', design: base => ({ cardStyle: 'glass', backgroundStyle: 'stars', fontFamily: 'modern', align: 'center', radius: Math.min(32, base.radius + 4), gap: Math.min(28, base.gap + 2), logoSize: Math.min(200, base.logoSize + 8) }) }
];

export const PAGE_TEMPLATES = layoutPresets.flatMap(layout => stylePresets.map(style => {
  const base = { ...DESIGN_DEFAULTS, ...layout.design };
  const id = `${layout.id}-${style.id}`;
  return {
    id,
    name: `${layout.name} ${style.name}`,
    description: `${layout.description} ${style.description}`,
    category: layout.name,
    design: { ...base, ...style.design(base), templateId: id, channelOrder: [...CHANNELS] }
  };
}));

export function getTemplate(templateId) {
  return PAGE_TEMPLATES.find(template => template.id === templateId) || PAGE_TEMPLATES[0];
}

const choice = (value, options, fallback) => options.includes(value) ? value : fallback;
const numeric = (value, min, max, fallback, step = 1) => typeof value === 'number' && Number.isFinite(value)
  ? Math.min(max, Math.max(min, min + Math.round((value - min) / step) * step))
  : fallback;
const boolean = (value, fallback) => typeof value === 'boolean' ? value : fallback;

export function normalizeDesign(source) {
  source = source && typeof source === 'object' && !Array.isArray(source) ? source : {};
  const template = getTemplate(source.templateId);
  const base = template?.design || DESIGN_DEFAULTS;
  const order = source.channelOrder;
  const validOrder = Array.isArray(order) && order.length === CHANNELS.length && new Set(order).size === CHANNELS.length && Array.from(order).every(channel => CHANNELS.includes(channel));
  return {
    templateId: template?.id || DESIGN_DEFAULTS.templateId,
    layout: choice(source.layout, LAYOUTS, base.layout),
    cardStyle: choice(source.cardStyle, CARD_STYLES, base.cardStyle),
    backgroundStyle: choice(source.backgroundStyle, BACKGROUNDS, base.backgroundStyle),
    fontFamily: choice(source.fontFamily, FONTS, base.fontFamily),
    textScale: numeric(source.textScale, 90, 125, base.textScale, 5),
    radius: numeric(source.radius, 0, 32, base.radius),
    gap: numeric(source.gap, 8, 28, base.gap),
    logoSize: numeric(source.logoSize, 64, 200, base.logoSize),
    logoShape: choice(source.logoShape, ['rounded', 'circle', 'square'], base.logoShape),
    align: choice(source.align, ['left', 'center'], base.align),
    showIcons: boolean(source.showIcons, base.showIcons),
    showDescriptions: boolean(source.showDescriptions, base.showDescriptions),
    showArrows: boolean(source.showArrows, base.showArrows),
    channelOrder: [...(validOrder ? order : base.channelOrder)]
  };
}

export function applyTemplate(currentDesign, templateId) {
  const template = getTemplate(templateId);
  const current = normalizeDesign(currentDesign);
  return normalizeDesign({ ...current, ...template.design, channelOrder: current.channelOrder });
}
