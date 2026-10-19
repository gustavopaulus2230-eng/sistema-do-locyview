export const STORAGE_KEY = 'locytech-hub:v3';
export const LEGACY_STORAGE_KEY = 'locytech-catalog:v2';
export const DEFAULT_LOGO = '/assets/locytech-hd.png';
export const MAX_LOGO_BYTES = 1.5 * 1024 * 1024;
export const PRODUCT_ICONS = ['window', 'globe', 'store', 'briefcase', 'links'];

export const socialDefaults = [
  { platform: 'instagram', title: 'Instagram', description: 'Publicações e novidades', url: 'https://www.instagram.com/locytech/' },
  { platform: 'whatsapp', title: 'WhatsApp', description: 'Fale com a nossa equipe', url: 'https://wa.me/5551920057268' },
  { platform: 'linkedin', title: 'LinkedIn', description: 'Projetos e conteúdo profissional', url: 'https://www.linkedin.com/' }
];

export const defaults = {
  version: 3,
  name: 'LocyTech',
  eyebrow: 'CANAIS E PRODUTOS',
  description: 'Acesse nossos canais ou conheça nossos sites e landing pages.',
  slug: 'locytech',
  logo: DEFAULT_LOGO,
  primaryColor: '#4d8dff',
  accentColor: '#f4cf46',
  backgroundColor: '#080f20',
  showBrand: true,
  products: [
    { id: 'landing-page', icon: 'window', category: 'landing', title: 'Landing page', description: 'Página para apresentar uma oferta, captar contatos e divulgar campanhas.', note: 'Campanhas e lançamentos', price: 'R$ 0,00', features: ['Layout para a sua campanha', 'Apresentação da oferta e chamadas para ação', 'Versão para celular e computador', 'Links para os seus canais de contato'], enabled: true },
    { id: 'site-institucional', icon: 'globe', category: 'sites', title: 'Site institucional', description: 'Site para apresentar a empresa, seus serviços e canais de atendimento.', note: 'Presença digital da empresa', price: 'R$ 0,00', features: ['Apresentação da empresa e dos serviços', 'Identidade visual da sua marca', 'Navegação para celular e computador', 'Canais de contato em destaque'], enabled: true },
    { id: 'loja-virtual', icon: 'store', category: 'sites', title: 'Loja virtual', description: 'Catálogo online com categorias, produtos e fluxo de compra.', note: 'Catálogo e vendas online', price: 'R$ 0,00', features: ['Catálogo organizado por categorias', 'Páginas de apresentação dos produtos', 'Fluxo de compra definido para o negócio', 'Integrações definidas no orçamento'], enabled: true },
    { id: 'site-profissionais', icon: 'briefcase', category: 'sites', title: 'Site para profissionais', description: 'Portfólio para apresentar seu trabalho, serviços e formas de contato.', note: 'Portfólio e serviços', price: 'R$ 0,00', features: ['Apresentação profissional', 'Portfólio e descrição dos serviços', 'Versão para celular e computador', 'Links para os seus canais'], enabled: true },
    { id: 'pagina-links', icon: 'links', category: 'landing', title: 'Página de links', description: 'Seus canais e produtos reunidos em uma página para a bio do Instagram.', note: 'Links para a bio do Instagram', price: 'R$ 0,00', features: ['Logo, cores e textos da marca', 'Atalhos para site e redes sociais', 'Links organizados por prioridade', 'Versão para celular e computador'], enabled: true }
  ],
  links: socialDefaults.map(link => ({ id: link.platform, platform: link.platform, title: link.title, url: link.url, enabled: true }))
};

export const clone = value => JSON.parse(JSON.stringify(value));
export const uid = () => globalThis.crypto?.randomUUID?.() || `item-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
const text = (value, fallback = '', max = 300) => typeof value === 'string' ? value.slice(0, max) : fallback;
const color = (value, fallback) => /^#[\da-f]{6}$/i.test(value || '') ? value : fallback;
export const categoryName = category => category === 'sites' ? 'Sites' : 'Landing pages';
export const cleanSlug = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 50).replace(/-$/, '');

export function contrastText(hex) {
  const channels = hex.slice(1).match(/.{2}/g).map(channel => parseInt(channel, 16) / 255);
  const linear = channels.map(channel => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
  const luminance = linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
  return luminance > 0.179 ? '#000000' : '#ffffff';
}

export function safeLogo(value) {
  if ([DEFAULT_LOGO, './assets/locytech-hd.png', './assets/locytech.png', '/assets/locytech.png'].includes(value)) return DEFAULT_LOGO;
  return /^data:image\/(?:png|jpeg|webp);base64,[a-z\d+/=]+$/i.test(value || '') && value.length < 3 * 1024 * 1024 ? value : '';
}

export function safeUrl(raw) {
  const value = String(raw || '').trim();
  if (!value || /[\u0000-\u0020\u007f]/.test(value)) return '';
  if (/^https?:\/\//i.test(value)) {
    try { const url = new URL(value); return url.hostname && ['http:', 'https:'].includes(url.protocol) ? url.href : ''; }
    catch { return ''; }
  }
  if (/^mailto:[^\s@]+@[^\s@]+\.[^\s@]+(?:\?[^\s]*)?$/i.test(value)) return value;
  if (/^tel:\+?[\d().-]{3,30}$/i.test(value)) return value;
  return '';
}

const previousProductCopy = {
  'landing page': {
    description: 'Uma página pensada para transformar visitas em oportunidades.',
    note: 'Campanhas e lançamentos',
    features: ['Layout pensado para o seu objetivo', 'Apresentação da oferta e chamadas para ação', 'Experiência adaptada ao celular', 'Conexão com seus canais de contato']
  },
  'site institucional': {
    description: 'A sua empresa na internet, com credibilidade e personalidade.',
    note: 'Presença digital profissional',
    features: ['Apresentação da empresa e dos serviços', 'Identidade visual da sua marca', 'Navegação adaptada a diferentes telas', 'Canais de contato em destaque']
  },
  'loja virtual': {
    description: 'Sua vitrine online, pronta para receber novos clientes.',
    note: 'Catálogo e vendas online',
    features: ['Catálogo organizado por categorias', 'Apresentação dos produtos', 'Experiência de compra planejada para o negócio', 'Integrações definidas no orçamento']
  },
  'site para profissionais': {
    description: 'Mostre seu trabalho e conecte-se com quem precisa de você.',
    note: 'Portfólio e serviços',
    features: ['Apresentação do seu trabalho', 'Portfólio e descrição dos serviços', 'Página adaptada ao celular', 'Atalhos para os seus canais']
  },
  'página de links': {
    description: 'Todos os seus canais em uma página simples e personalizada.',
    note: 'Feita para a bio do Instagram',
    features: ['Logo, cores e textos da marca', 'Atalhos para site e redes sociais', 'Links organizados por prioridade', 'Experiência simples no celular']
  }
};

const previousProductPrices = new Map([
  ['landing page', 'R$ 790,00'],
  ['site institucional', 'R$ 1.490,00'],
  ['loja virtual', 'R$ 2.490,00'],
  ['site para profissionais', 'R$ 1.090,00'],
  ['página de links', 'R$ 290,00']
]);
const previousSocialUrls = {
  instagram: 'https://www.instagram.com/',
  whatsapp: 'https://www.whatsapp.com/'
};

export function normalize(source, { migrateDefaults = true } = {}) {
  source = source && typeof source === 'object' ? source : {};
  const oldPalettes = [
    ['#2471e8', '#f4cf54', '#f2f7fd'],
    ['#1453d6', '#ffcf24', '#e9f0fd'],
    ['#265dc6', '#f1d36a', '#f6f8fc']
  ];
  const previousDefaultPalette = migrateDefaults && oldPalettes.some(([primary, accent, background]) =>
    String(source.primaryColor || '').toLowerCase() === primary && String(source.accentColor || '').toLowerCase() === accent && String(source.backgroundColor || '').toLowerCase() === background);
  const palette = previousDefaultPalette ? defaults : source;
  const legacy = migrateDefaults && source.version !== 3;
  const oldDescriptions = [
    'Sua marca merece um lugar de destaque na internet.\nEscolha a solução para o seu próximo passo.',
    'Conecte-se com a gente e encontre a solução certa para o seu negócio.'
  ];
  const oldEyebrows = ['SITES QUE CONECTAM', 'TECNOLOGIA QUE APROXIMA'];
  const usedIds = new Set();
  return {
    version: 3,
    name: text(source.name, defaults.name, 60),
    eyebrow: migrateDefaults && oldEyebrows.includes(source.eyebrow) ? defaults.eyebrow : text(source.eyebrow, defaults.eyebrow, 70),
    description: migrateDefaults && oldDescriptions.includes(source.description) ? defaults.description : text(source.description, defaults.description, 240),
    slug: text(source.slug, defaults.slug, 50),
    logo: source.logo === '' ? '' : safeLogo(source.logo) || DEFAULT_LOGO,
    primaryColor: color(palette.primaryColor, defaults.primaryColor),
    accentColor: color(palette.accentColor, defaults.accentColor),
    backgroundColor: color(palette.backgroundColor, defaults.backgroundColor),
    showBrand: source.showBrand !== false,
    products: (Array.isArray(source.products) ? source.products : defaults.products).slice(0, 30).map(raw => {
      const product = raw && typeof raw === 'object' ? raw : {};
      const candidate = text(product.id, '', 100);
      const id = candidate && !usedIds.has(candidate) ? candidate : uid();
      usedIds.add(id);
      const productKey = String(product.title || '').trim().toLocaleLowerCase('pt-BR');
      const previousProduct = defaults.products.find(item => item.title.toLocaleLowerCase('pt-BR') === productKey);
      const previousCopy = migrateDefaults && Object.hasOwn(previousProductCopy, productKey) ? previousProductCopy[productKey] : null;
      return {
        id,
        icon: PRODUCT_ICONS.includes(product.icon) ? product.icon : 'window',
        category: product.category === 'sites' ? 'sites' : 'landing',
        title: text(product.title, 'Novo produto', 70),
        description: previousCopy && product.description === previousCopy.description ? previousProduct.description : text(product.description, '', 240),
        note: previousCopy && product.note === previousCopy.note ? previousProduct.note : text(product.note, '', 80),
        price: migrateDefaults && previousProduct && ((legacy && /^sob consulta$/i.test(String(product.price || '').trim())) || String(product.price || '').trim() === previousProductPrices.get(productKey)) ? previousProduct.price : text(product.price, 'Sob consulta', 40) || 'Sob consulta',
        features: (Array.isArray(product.features) ? product.features : []).filter(item => typeof item === 'string').slice(0, 8).map(item => {
          const previousIndex = previousCopy?.features.indexOf(item) ?? -1;
          return previousIndex >= 0 ? previousProduct.features[previousIndex] : item.slice(0, 130);
        }),
        enabled: product.enabled !== false
      };
    }),
    links: socialDefaults.map(defaultLink => {
      const existing = Array.isArray(source.links) ? source.links.find(link => link?.platform === defaultLink.platform) : null;
      const existingUrl = existing ? text(existing.url, '', 2048) : defaultLink.url;
      const previousUrl = migrateDefaults ? previousSocialUrls[defaultLink.platform] : null;
      const url = previousUrl && existingUrl.trim().replace(/\/$/, '').toLowerCase() === previousUrl.replace(/\/$/, '').toLowerCase() ? defaultLink.url : existingUrl;
      return { id: defaultLink.platform, platform: defaultLink.platform, title: defaultLink.title, url: legacy && !url.trim() ? defaultLink.url : url, enabled: true };
    })
  };
}

export function encodeSnapshot(snapshot) {
  const bytes = new TextEncoder().encode(JSON.stringify(snapshot));
  let binary = '';
  for (let index = 0; index < bytes.length; index += 16384) binary += String.fromCharCode(...bytes.subarray(index, index + 16384));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function publicSnapshot(state) {
  return {
    version: 3,
    preserveConfiguredValues: true,
    name: state.name,
    eyebrow: state.eyebrow,
    description: state.description,
    logo: state.logo,
    primaryColor: state.primaryColor,
    accentColor: state.accentColor,
    backgroundColor: state.backgroundColor,
    showBrand: state.showBrand,
    products: state.products.filter(product => product.enabled).map(({ icon, category, title, description, note, price, features }) => ({ icon, category, title, description, note, price, features })),
    links: socialDefaults.map(social => ({ platform: social.platform, title: social.title, url: safeUrl(state.links.find(link => link.platform === social.platform)?.url) }))
  };
}

export function shareUrl(state, href = window.location.href) {
  const url = new URL(href);
  url.hash = `p=${encodeSnapshot(publicSnapshot(state))}`;
  return url.href;
}

export function decodeSnapshot(encoded) {
  if (encoded.length > 4 * 1024 * 1024 || !/^[\w-]+$/.test(encoded)) throw new Error('Link inválido');
  const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(base64 + '='.repeat((4 - base64.length % 4) % 4));
  const bytes = Uint8Array.from(binary, character => character.charCodeAt(0));
  const result = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
  if (!result || typeof result !== 'object' || !Array.isArray(result.products) || !Array.isArray(result.links)) throw new Error('Página inválida');
  return normalize(result, { migrateDefaults: result.preserveConfiguredValues !== true });
}

export function loadPageState({ publicOnly = false } = {}) {
  if (window.location.hash.startsWith('#p=')) {
    try { return { state: decodeSnapshot(window.location.hash.slice(3)), publicMode: true, savedAt: null, error: '' }; }
    catch { return { state: clone(defaults), publicMode: true, savedAt: null, error: 'Não foi possível carregar esta versão. Confira se o link foi copiado por completo. Abaixo está a página de demonstração.' }; }
  }
  if (publicOnly) return { state: clone(defaults), publicMode: true, savedAt: null, error: '' };
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY) || 'null');
    if (saved?.state) return { state: normalize(saved.state), publicMode: false, savedAt: typeof saved.savedAt === 'string' ? saved.savedAt : null, error: '' };
  } catch { /* O editor continua disponível se o armazenamento estiver bloqueado. */ }
  return { state: clone(defaults), publicMode: false, savedAt: null, error: '' };
}

export function quoteDestinations(state, message) {
  let whatsapp = '';
  const link = state.links.find(item => item.enabled && item.platform === 'whatsapp');
  const destination = safeUrl(link?.url);
  if (/^https:\/\//i.test(destination)) {
    const url = new URL(destination);
    const isShort = url.hostname === 'wa.me' && /^\/\d{8,15}\/?$/.test(url.pathname);
    const isApi = url.hostname === 'api.whatsapp.com' && url.pathname.replace(/\/$/, '') === '/send' && /^\d{8,15}$/.test(url.searchParams.get('phone') || '');
    if (isShort || isApi) { url.searchParams.set('text', message); whatsapp = url.href; }
  }
  let email = '';
  const emailLink = state.links.find(item => item.enabled && /^mailto:/i.test(safeUrl(item.url)));
  if (emailLink) {
    const url = new URL(safeUrl(emailLink.url));
    url.searchParams.set('subject', `Solicitação de orçamento — ${state.name}`);
    url.searchParams.set('body', message);
    email = url.href;
  }
  return { whatsapp, email };
}

export async function copyText(value, selectableElement) {
  try { await navigator.clipboard.writeText(value); return true; }
  catch {
    if (selectableElement) { selectableElement.focus(); selectableElement.select(); }
    return false;
  }
}

export function optimizeLogo(dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      try {
        if (!image.naturalWidth || !image.naturalHeight) throw new Error('Imagem inválida');
        const scale = Math.min(1, 400 / image.naturalWidth, 400 / image.naturalHeight);
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Imagem indisponível');
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        const optimized = safeLogo(canvas.toDataURL('image/webp', 0.85));
        if (!optimized) throw new Error('Formato inválido');
        resolve(optimized);
      } catch (error) { reject(error); }
    };
    image.onerror = () => reject(new Error('Não foi possível abrir a imagem'));
    image.src = dataUrl;
  });
}
