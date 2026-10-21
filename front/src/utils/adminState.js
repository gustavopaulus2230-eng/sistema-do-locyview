import { cleanSlug, clone, defaults, normalize, safeLogo, safeUrl, shareUrl, socialDefaults, uid } from './pageState';
import { normalizeDesign } from './pageDesign';

export const ADMIN_STORAGE_KEY = 'locyview-admin:v2';
export const LEGACY_ADMIN_STORAGE_KEY = 'locyview-admin:v1';
export const CLIENT_RECOVERY_STORAGE_KEY = 'locyview-admin:recovery:v1';
const MAX_CLIENTS = 50;
const MAX_BRANDS = 50;
const brandFields = ['name', 'logo', 'primaryColor', 'accentColor', 'backgroundColor'];
const colorFields = ['primaryColor', 'accentColor', 'backgroundColor'];
const invalidStorageMessage = 'Os cadastros salvos neste navegador são inválidos. Nenhum dado foi substituído.';
const staleStorageMessage = 'Os cadastros foram alterados em outra aba. Recarregue os dados antes de continuar. Nenhum cadastro foi substituído.';
const limitMessage = 'O limite de 50 páginas deste navegador foi atingido. Edite um cadastro existente.';
const brandLimitMessage = 'O limite de 50 marcas deste navegador foi atingido. Edite uma marca existente.';
const isObject = value => Boolean(value) && typeof value === 'object' && !Array.isArray(value);
const trimmed = value => typeof value === 'string' ? value.trim() : '';
const validColor = value => typeof value === 'string' && /^#[\da-f]{6}$/i.test(value);
const validDate = value => value === null || (typeof value === 'string' && Number.isFinite(Date.parse(value)));
const brandNameKey = value => trimmed(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR').replace(/\s+/g, ' ');
const validOverrides = value => value === undefined || (Array.isArray(value) && value.length <= brandFields.length && new Set(value).size === value.length && Array.from(value).every(field => brandFields.includes(field)));
const normalizeOverrides = value => Array.isArray(value) ? brandFields.filter(field => value.includes(field)) : [];

function cleanBrand(brand) {
  return {
    id: trimmed(brand?.id).slice(0, 100) || uid(),
    name: trimmed(brand?.name).slice(0, 60),
    logo: safeLogo(brand?.logo) || '',
    primaryColor: trimmed(brand?.primaryColor),
    accentColor: trimmed(brand?.accentColor),
    backgroundColor: trimmed(brand?.backgroundColor),
    updatedAt: brand?.updatedAt ?? null
  };
}

export function createBrandRecord() {
  return {
    id: uid(), name: '', logo: '', primaryColor: defaults.primaryColor,
    accentColor: defaults.accentColor, backgroundColor: defaults.backgroundColor, updatedAt: null
  };
}

export function prepareBrandRecord(brand) {
  return { ...cleanBrand(brand), updatedAt: new Date().toISOString() };
}

export function validateBrandRecord(brand, brands = []) {
  const issue = message => ({ field: 'brand-brand-name', message });
  if (!trimmed(brand?.name)) return issue('Informe o nome da marca.');
  if (trimmed(brand.name).length > 60) return issue('Use até 60 caracteres no nome da marca.');
  if (brands.some(item => item.id !== brand.id && brandNameKey(item.name) === brandNameKey(brand.name))) return issue('Já existe uma marca com este nome.');
  if (colorFields.some(field => !validColor(brand?.[field]))) return issue('Escolha cores válidas no formato #RRGGBB.');
  if (brand.logo && !safeLogo(brand.logo)) return issue('Escolha uma logo PNG, JPG ou WebP válida.');
  if (brands.length > MAX_BRANDS || (brands.length === MAX_BRANDS && !brands.some(item => item.id === brand.id))) return issue(brandLimitMessage);
  return null;
}

function blankPage() {
  return {
    ...clone(defaults),
    name: '',
    description: '',
    slug: '',
    logo: '',
    products: [],
    links: defaults.links.map(link => ({ ...link, url: '' }))
  };
}

export function createClientRecord() {
  return { id: uid(), clientName: '', brandId: '', identityOverrides: [], page: blankPage(), updatedAt: null };
}

export function applyBrandToRecord(record, brands = []) {
  const brandId = trimmed(record?.brandId);
  const brand = brands.find(item => item.id === brandId);
  const page = { ...record?.page };
  const identityOverrides = normalizeOverrides(record?.identityOverrides);
  if (brand) for (const field of brandFields) if (!identityOverrides.includes(field)) page[field] = brand[field];
  return { ...record, brandId, identityOverrides, page };
}

function cleanPage(source) {
  const page = normalize(source, { migrateDefaults: false });
  return {
    ...page,
    name: page.name.trim(),
    eyebrow: page.eyebrow.trim(),
    description: page.description.trim(),
    slug: cleanSlug(page.slug),
    products: page.products.map(product => ({
      ...product,
      title: product.title.trim(),
      description: product.description.trim(),
      note: product.note.trim(),
      price: product.price.trim(),
      features: product.features.map(feature => feature.trim()).filter(Boolean)
    })),
    links: page.links.map(link => ({ ...link, url: safeUrl(link.url) || link.url.trim() }))
  };
}

export function prepareClientRecord(record, brands = []) {
  const configured = applyBrandToRecord(record, brands);
  return {
    id: trimmed(configured.id).slice(0, 100) || uid(),
    clientName: trimmed(configured.clientName).slice(0, 120),
    brandId: configured.brandId,
    identityOverrides: configured.identityOverrides,
    page: cleanPage(configured.page),
    updatedAt: new Date().toISOString()
  };
}

export function validateClientRecord(record, records = [], brands = []) {
  const identityError = (field, message) => ({ field, message, tab: 'identity' });
  if (!validOverrides(record?.identityOverrides)) return identityError('admin-brand-select', 'Revise os campos personalizados da identidade desta página.');
  const brandId = trimmed(record?.brandId);
  if (brandId && !brands.some(brand => brand.id === brandId)) return identityError('admin-brand-select', 'Escolha uma marca cadastrada ou deixe a página sem vínculo.');
  record = applyBrandToRecord(record, brands);
  if (!trimmed(record?.clientName)) return identityError('admin-client-name', 'Informe o nome do cliente.');
  if (!trimmed(record?.page?.name)) return identityError('admin-brand-name', 'Informe o nome da marca.');
  if (record.page.logo && !safeLogo(record.page.logo)) return identityError('admin-brand-logo', 'Escolha uma logo PNG, JPG ou WebP válida.');
  for (const [field, id] of [['primaryColor', 'primary-color'], ['accentColor', 'accent-color'], ['backgroundColor', 'background-color']]) {
    if (!validColor(record.page[field])) return { field: `admin-${id}`, message: 'Escolha cores válidas no formato #RRGGBB.', tab: 'appearance' };
  }
  const slug = cleanSlug(trimmed(record?.page?.slug));
  if (!slug) return identityError('admin-page-slug', 'Informe um identificador com letras ou números.');
  if (records.some(item => item.id !== record.id && cleanSlug(trimmed(item.page?.slug)) === slug)) {
    return identityError('admin-page-slug', 'Este identificador já está sendo usado por outro cliente.');
  }
  if (records.length > MAX_CLIENTS || (records.length === MAX_CLIENTS && !records.some(item => item.id === record.id))) {
    return identityError('admin-client-name', limitMessage);
  }
  for (const social of socialDefaults) {
    const url = record?.page?.links?.find(link => link?.platform === social.platform)?.url;
    if (trimmed(url) && !safeUrl(url)) {
      return { field: `admin-contact-${social.platform}-url`, message: `Informe um link válido para ${social.title}, começando com https://, http://, mailto: ou tel:.`, tab: 'links' };
    }
  }
  return null;
}

function isStoredRecord(record) {
  if (!isObject(record) || !trimmed(record.id) || typeof record.clientName !== 'string' || !isObject(record.page)) return false;
  if (record.brandId !== undefined && typeof record.brandId !== 'string') return false;
  if (!validOverrides(record.identityOverrides)) return false;
  if (!validDate(record.updatedAt)) return false;
  const page = record.page;
  if (page.version !== 3 || typeof page.showBrand !== 'boolean') return false;
  if (!['name', 'eyebrow', 'description', 'slug', 'logo', 'primaryColor', 'accentColor', 'backgroundColor'].every(field => typeof page[field] === 'string')) return false;
  if (!Array.isArray(page.products) || page.products.length > 30 || !Array.isArray(page.links) || page.links.length !== socialDefaults.length) return false;
  if (!page.products.every(product => isObject(product) && ['id', 'icon', 'category', 'title', 'description', 'note', 'price'].every(field => typeof product[field] === 'string') && typeof product.enabled === 'boolean' && Array.isArray(product.features) && product.features.every(feature => typeof feature === 'string'))) return false;
  return socialDefaults.every(social => page.links.filter(link => isObject(link) && link.platform === social.platform && typeof link.url === 'string').length === 1);
}

function isStoredBrand(brand) {
  return isObject(brand) && typeof brand.id === 'string' && Boolean(trimmed(brand.id)) &&
    brandFields.every(field => typeof brand[field] === 'string') && validDate(brand.updatedAt);
}

function brandsAreValid(brands) {
  if (!Array.isArray(brands) || brands.length > MAX_BRANDS || !brands.every(isStoredBrand)) return false;
  if (new Set(brands.map(brand => brand.id)).size !== brands.length) return false;
  return brands.every(brand => validateBrandRecord(brand, brands) === null);
}

function recordsAreValid(records, brands = []) {
  if (!Array.isArray(records) || records.length > MAX_CLIENTS || !records.every(isStoredRecord)) return false;
  if (new Set(records.map(record => record.id)).size !== records.length) return false;
  return records.every(record => validateClientRecord(record, records, brands) === null);
}

function canonicalRecord(record, brands) {
  const configured = applyBrandToRecord(record, brands);
  return { id: configured.id, clientName: configured.clientName, brandId: configured.brandId, identityOverrides: configured.identityOverrides, page: { ...clone(configured.page), design: normalizeDesign(configured.page.design) }, updatedAt: configured.updatedAt };
}

const storageTokenFor = (key, value) => JSON.stringify([key, value]);

function parseStoredRecords(parsed, legacy = false) {
  if (!isObject(parsed) || parsed.version !== (legacy ? 1 : 2)) return null;
  const brands = legacy ? [] : parsed.brands;
  const records = legacy && Array.isArray(parsed.records) ? parsed.records.map(record => isObject(record) ? { ...record, brandId: '' } : record) : parsed.records;
  if (!brandsAreValid(brands) || !recordsAreValid(records, brands)) return null;
  return { records: records.map(record => canonicalRecord(record, brands)), brands: brands.map(brand => ({ ...brand })) };
}

function storageWriteError(error) {
  const quotaExceeded = error?.name === 'QuotaExceededError' || error?.name === 'NS_ERROR_DOM_QUOTA_REACHED';
  return quotaExceeded ? 'O armazenamento deste navegador está cheio. Reduza as logos antes de tentar novamente.' : 'Não foi possível salvar neste navegador. Verifique se o armazenamento local está permitido e tente novamente.';
}

function currentStorageIssue(current, expectedToken) {
  if (current.error) return { ok: false, error: current.error };
  if (expectedToken !== undefined && expectedToken !== current.storageToken) return { ok: false, error: staleStorageMessage, conflict: true };
  return null;
}

export function loadClientRecords() {
  let saved;
  let key = ADMIN_STORAGE_KEY;
  let legacy = false;
  try {
    saved = globalThis.localStorage.getItem(ADMIN_STORAGE_KEY);
    if (saved === null) { key = LEGACY_ADMIN_STORAGE_KEY; saved = globalThis.localStorage.getItem(key); legacy = true; }
  } catch { return { records: [], brands: [], storageToken: null, error: 'O armazenamento deste navegador está bloqueado. Não foi possível carregar os cadastros locais.' }; }
  const storageToken = storageTokenFor(saved === null ? null : key, saved);
  if (saved === null) return { records: [], brands: [], storageToken, error: '' };
  try {
    const parsed = parseStoredRecords(JSON.parse(saved), legacy);
    return parsed ? { ...parsed, storageToken, error: '' } : { records: [], brands: [], storageToken, error: invalidStorageMessage };
  } catch { return { records: [], brands: [], storageToken, error: invalidStorageMessage }; }
}

export function persistClientRecords(records, brands = [], expectedToken) {
  if (Array.isArray(records) && records.length > MAX_CLIENTS) return { ok: false, error: limitMessage };
  if (Array.isArray(brands) && brands.length > MAX_BRANDS) return { ok: false, error: brandLimitMessage };
  if (!brandsAreValid(brands) || !recordsAreValid(records, brands)) return { ok: false, error: 'Revise os dados dos clientes e marcas antes de salvar. Nenhum cadastro foi substituído.' };
  const current = loadClientRecords();
  const issue = currentStorageIssue(current, expectedToken);
  if (issue) return issue;
  try {
    const sanitizedBrands = brands.map(cleanBrand);
    const sanitizedRecords = records.map(record => canonicalRecord(record, sanitizedBrands));
    if (!brandsAreValid(sanitizedBrands) || !recordsAreValid(sanitizedRecords, sanitizedBrands)) return { ok: false, error: 'Revise os dados dos clientes e marcas antes de salvar. Nenhum cadastro foi substituído.' };
    const serialized = JSON.stringify({ version: 2, records: sanitizedRecords, brands: sanitizedBrands });
    globalThis.localStorage.setItem(ADMIN_STORAGE_KEY, serialized);
    return { ok: true, error: '', storageToken: storageTokenFor(ADMIN_STORAGE_KEY, serialized) };
  } catch (error) {
    return { ok: false, error: storageWriteError(error) };
  }
}

function readClientRecovery() {
  const absent = { available: false, recordCount: 0, brandCount: 0, savedAt: null, error: '' };
  let raw;
  try { raw = globalThis.localStorage.getItem(CLIENT_RECOVERY_STORAGE_KEY); }
  catch { return { ...absent, error: 'Não foi possível consultar a cópia de segurança neste navegador.' }; }
  if (raw === null) return absent;
  try {
    const parsed = JSON.parse(raw);
    const state = parseStoredRecords(isObject(parsed) ? { ...parsed, version: 2 } : null);
    if (!isObject(parsed) || parsed.version !== 1 || typeof parsed.savedAt !== 'string' || !validDate(parsed.savedAt) || !state) throw new Error('Cópia inválida');
    return { available: true, recordCount: state.records.length, brandCount: state.brands.length, savedAt: parsed.savedAt, error: '', ...state };
  } catch { return { ...absent, error: 'A cópia de segurança deste navegador é inválida. Nenhum cadastro foi substituído.' }; }
}

export function loadClientRecovery() {
  const { available, recordCount, brandCount, savedAt, error } = readClientRecovery();
  return { available, recordCount, brandCount, savedAt, error };
}

export function resetClientRecords(expectedToken) {
  const current = loadClientRecords();
  const issue = currentStorageIssue(current, expectedToken);
  if (issue) return issue;
  if (current.records.length || current.brands.length) {
    try {
      const backup = { version: 1, savedAt: new Date().toISOString(), records: current.records, brands: current.brands };
      globalThis.localStorage.setItem(CLIENT_RECOVERY_STORAGE_KEY, JSON.stringify(backup));
    } catch (error) {
      return { ok: false, error: `Não foi possível guardar a cópia de segurança. Nenhum cadastro foi apagado. ${storageWriteError(error)}` };
    }
  }
  const saved = persistClientRecords([], [], current.storageToken);
  return saved.ok ? { ...saved, records: [], brands: [] } : saved;
}

export function restoreClientRecords(expectedToken) {
  const current = loadClientRecords();
  const issue = currentStorageIssue(current, expectedToken);
  if (issue) return issue;
  if (current.records.length || current.brands.length) return { ok: false, error: 'Restaure a cópia somente com a lista de páginas e marcas vazia. Os cadastros atuais foram preservados.' };
  const recovery = readClientRecovery();
  if (recovery.error) return { ok: false, error: recovery.error };
  if (!recovery.available) return { ok: false, error: 'Não existe uma cópia de segurança disponível neste navegador.' };
  const saved = persistClientRecords(recovery.records, recovery.brands, current.storageToken);
  return saved.ok ? { ...saved, records: recovery.records, brands: recovery.brands } : saved;
}

export function clientPreviewUrl(page, href = window.location.href) {
  const url = new URL(href);
  url.pathname = '/preview';
  url.search = '';
  url.hash = '';
  return shareUrl(cleanPage(page), url.href);
}
