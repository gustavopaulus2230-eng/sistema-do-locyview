import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { createServer } from '../node_modules/vite/dist/node/index.js';

// This runner never reads a browser profile or real customer storage.
const originalStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
let storage;
let passed = 0;
const failures = [];
const frontRoot = fileURLToPath(new URL('../', import.meta.url));

function mockStorage(entries = []) {
  const values = new Map(entries);
  storage = {
    values,
    blocked: false,
    failWrite: null,
    writes: [],
    getItem(key) {
      if (this.blocked) throw new DOMException('Blocked by test', 'SecurityError');
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      if (this.blocked) throw new DOMException('Blocked by test', 'SecurityError');
      if (this.failWrite?.(key)) throw new DOMException('Full by test', 'QuotaExceededError');
      this.writes.push(key);
      values.set(key, String(value));
    },
    removeItem(key) { values.delete(key); }
  };
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: storage });
  return storage;
}

async function test(name, run) {
  mockStorage();
  try {
    await run();
    passed += 1;
    process.stdout.write(`✓ ${name}\n`);
  } catch (error) {
    failures.push({ name, error });
    process.stderr.write(`✗ ${name}: ${error.message}\n`);
  }
}

const server = await createServer({
  root: frontRoot,
  configFile: false,
  appType: 'custom',
  logLevel: 'error',
  server: { middlewareMode: true, hmr: false, watch: null }
});

try {
  const admin = await server.ssrLoadModule('/src/utils/adminState.js');
  const page = await server.ssrLoadModule('/src/utils/pageState.js');
  const design = await server.ssrLoadModule('/src/utils/pageDesign.js');
  const pricing = await server.ssrLoadModule('/src/utils/productPricing.js');
  const { ADMIN_STORAGE_KEY, LEGACY_ADMIN_STORAGE_KEY, CLIENT_RECOVERY_STORAGE_KEY } = admin;
  const copy = value => JSON.parse(JSON.stringify(value));
  const fixtureBrand = () => ({ ...admin.createBrandRecord(), id: 'test-brand', name: 'Marca de regressão', updatedAt: null });
  const fixtureRecord = () => ({
    id: 'test-page', clientName: 'Identificação administrativa de teste', brandId: '', identityOverrides: [],
    page: { ...copy(page.defaults), name: 'Página de regressão', slug: 'pagina-regressao' }, updatedAt: null
  });
  const rawState = (records = [fixtureRecord()], brands = []) => JSON.stringify({ version: 2, records, brands });
  const saveFixture = () => {
    const result = admin.persistClientRecords([fixtureRecord()], [], admin.loadClientRecords().storageToken);
    assert.equal(result.ok, true, result.error);
    return result;
  };

  await test('Primeiro acesso começa sem cadastros e não grava modelos', () => {
    const loaded = admin.loadClientRecords();
    assert.deepEqual(loaded.records, []);
    assert.deepEqual(loaded.brands, []);
    assert.equal(loaded.error, '');
    assert.equal(typeof loaded.storageToken, 'string');
    assert.equal(storage.writes.length, 0);
  });

  await test('Novo cadastro não inclui produtos ou contatos de demonstração', () => {
    const created = admin.createClientRecord();
    assert.equal(created.clientName, '');
    assert.equal(created.page.name, '');
    assert.equal(created.page.logo, '');
    assert.deepEqual(created.page.products, []);
    assert.ok(created.page.links.every(link => link.url === ''));
    assert.deepEqual(created.identityOverrides, []);
  });

  await test('Salvar e recarregar conserva a página e retorna o novo token', () => {
    const result = saveFixture();
    const loaded = admin.loadClientRecords();
    assert.equal(loaded.error, '');
    assert.equal(loaded.records.length, 1);
    assert.equal(loaded.records[0].page.products.length, 5);
    assert.equal(loaded.records[0].page.products[0].price, 'R$ 0,00');
    assert.equal(result.storageToken, loaded.storageToken);
  });

  await test('Nomes de marca duplicados ignoram caixa, espaços e acentos', () => {
    const brand = { ...fixtureBrand(), name: '  Árvore   Digital ' };
    const duplicate = { ...brand, id: 'other-brand', name: 'arvore digital' };
    assert.equal(admin.validateBrandRecord(brand, []), null);
    assert.ok(admin.validateBrandRecord(duplicate, [brand]));
    assert.ok(admin.validateBrandRecord({ ...brand, primaryColor: 'red' }, []));
  });

  await test('Vínculo da marca herda os cinco campos de identidade', () => {
    const brand = fixtureBrand();
    const result = admin.applyBrandToRecord({ ...fixtureRecord(), brandId: brand.id }, [brand]);
    for (const field of ['name', 'logo', 'primaryColor', 'accentColor', 'backgroundColor']) assert.equal(result.page[field], brand[field]);
    assert.equal(result.clientName, fixtureRecord().clientName);
    assert.deepEqual(result.page.products, fixtureRecord().page.products);
  });

  await test('Exceções de identidade preservam somente os campos personalizados', () => {
    const brand = { ...fixtureBrand(), name: 'Nome central novo', primaryColor: '#123456', accentColor: '#654321' };
    const source = { ...fixtureRecord(), brandId: brand.id, identityOverrides: ['name', 'primaryColor'] };
    const inherited = admin.applyBrandToRecord(source, [brand]);
    assert.equal(inherited.page.name, source.page.name);
    assert.equal(inherited.page.primaryColor, source.page.primaryColor);
    assert.equal(inherited.page.accentColor, brand.accentColor);
    assert.deepEqual(inherited.page.design, source.page.design);
    const restored = admin.applyBrandToRecord({ ...inherited, identityOverrides: [] }, [brand]);
    assert.equal(restored.page.name, brand.name);
    assert.equal(restored.page.primaryColor, brand.primaryColor);
  });

  await test('Validação rejeita vínculo inexistente, identificador duplicado e link inseguro', () => {
    const record = fixtureRecord();
    assert.equal(admin.validateClientRecord(record, [], []), null);
    assert.equal(admin.validateClientRecord({ ...record, brandId: 'missing' }, [], []).field, 'admin-brand-select');
    assert.equal(admin.validateClientRecord({ ...record, id: 'another' }, [record], []).field, 'admin-page-slug');
    record.page.links[0].url = 'javascript:alert(1)';
    assert.equal(admin.validateClientRecord(record, [], []).tab, 'links');
  });

  await test('Biblioteca mantém 24 modelos únicos em seis composições', () => {
    assert.equal(design.PAGE_TEMPLATES.length, 24);
    assert.equal(new Set(design.PAGE_TEMPLATES.map(item => item.id)).size, 24);
    assert.equal(new Set(design.PAGE_TEMPLATES.map(item => item.design.layout)).size, 6);
    assert.equal(new Set(design.PAGE_TEMPLATES.map(item => `${item.design.layout}/${item.design.cardStyle}`)).size, 24);
  });

  await test('Aplicar qualquer modelo conserva a ordem dos quatro canais', () => {
    const order = ['products', 'linkedin', 'whatsapp', 'instagram'];
    const current = { ...design.DESIGN_DEFAULTS, channelOrder: order };
    for (const template of design.PAGE_TEMPLATES) {
      const result = design.applyTemplate(current, template.id);
      assert.equal(result.templateId, template.id);
      assert.deepEqual(result.channelOrder, order);
    }
    assert.deepEqual(current.channelOrder, order);
  });

  await test('Visual normaliza limites numéricos e ordem inválida', () => {
    const result = design.normalizeDesign({ textScale: 1000, radius: -1, gap: 1, logoSize: Infinity, channelOrder: ['instagram', 'instagram'] });
    assert.equal(result.textScale, 125);
    assert.equal(result.radius, 0);
    assert.equal(result.gap, 8);
    assert.equal(result.logoSize, design.DESIGN_DEFAULTS.logoSize);
    assert.deepEqual(result.channelOrder, [...design.DESIGN_DEFAULTS.channelOrder]);
  });

  await test('Snapshot exclui dados internos e produtos ocultos', () => {
    const record = fixtureRecord();
    record.page.products[0].enabled = false;
    const snapshot = page.publicSnapshot(record.page);
    const serialized = JSON.stringify(snapshot);
    assert.equal(snapshot.products.length, 4);
    for (const key of ['clientName', 'brandId', 'identityOverrides', 'updatedAt', 'quote', 'slug']) assert.equal(Object.hasOwn(snapshot, key), false);
    assert.equal(serialized.includes(record.clientName), false);
    assert.ok(snapshot.products.every(product => !Object.hasOwn(product, 'id')));
  });

  await test('Snapshot preserva Unicode, preço personalizado e visual', () => {
    const source = fixtureRecord().page;
    source.name = 'Conexões & ação';
    source.products[0].price = 'R$ 59/mês';
    source.design = design.applyTemplate({ ...source.design, channelOrder: ['products', 'instagram', 'whatsapp', 'linkedin'] }, 'mosaico-cristal');
    const decoded = page.decodeSnapshot(page.encodeSnapshot(page.publicSnapshot(source)));
    assert.equal(decoded.name, source.name);
    assert.equal(decoded.products[0].price, source.products[0].price);
    assert.deepEqual(decoded.design, source.design);
  });

  await test('Link do cliente usa /preview na mesma origem, sem consulta administrativa', () => {
    const url = new URL(admin.clientPreviewUrl(fixtureRecord().page, 'https://example.test/admin?v=old#previous'));
    assert.equal(url.origin, 'https://example.test');
    assert.equal(url.pathname, '/preview');
    assert.equal(url.search, '');
    assert.ok(url.hash.startsWith('#p='));
    assert.equal(page.decodeSnapshot(url.hash.slice(3)).name, fixtureRecord().page.name);
  });

  await test('URLs e logos recusam esquemas executáveis e SVG', () => {
    for (const value of ['javascript:alert(1)', 'data:text/html,<script>', '//evil.test', 'https://a.test/ with-space']) assert.equal(page.safeUrl(value), '');
    for (const value of ['https://example.test', 'http://localhost:4174/', 'mailto:a@example.test', 'tel:+5551920057268']) assert.ok(page.safeUrl(value));
    assert.equal(page.safeLogo('data:image/svg+xml;base64,PHN2Zz4='), '');
    assert.equal(page.safeLogo('https://example.test/logo.png'), '');
    assert.equal(page.safeLogo('data:image/png;base64,AA=='), 'data:image/png;base64,AA==');
  });

  await test('Preços aceitam zero, agrupamento, centavos e limite máximo', () => {
    for (const [amount, price] of [['0', 'R$ 0,00'], ['1.500,00', 'R$ 1.500,00'], ['12.3', 'R$ 12,30'], ['999.999.999,99', 'R$ 999.999.999,99']]) {
      assert.equal(pricing.priceResult({ mode: 'fixed', amount }).price, price);
    }
    assert.equal(pricing.priceResult({ mode: 'from', amount: '99,90' }).price, 'A partir de R$ 99,90');
  });

  await test('Preços rejeitam negativos, valores incompletos e decimais inválidos', () => {
    for (const amount of ['', '-1', 'NaN', 'Infinity', '1,000', '1.00,00', '1e3', '1000000000', 'R$ 10,00']) assert.equal(pricing.priceResult({ mode: 'fixed', amount }).valid, false, amount);
    assert.equal(pricing.priceResult({ mode: 'custom', text: '' }).valid, false);
    assert.equal(pricing.priceResult({ mode: 'custom', text: 'x'.repeat(41) }).valid, false);
  });

  await test('Quatro modos de preço conservam condições textuais existentes', () => {
    for (const price of ['R$ 0,00', 'R$ 1.500,00', 'A partir de R$ 9,99', 'Sob consulta', 'R$ 59/mês']) assert.equal(pricing.priceResult(pricing.priceDraftFromString(price)).price, price);
    assert.equal(pricing.priceResult({ mode: 'custom', text: '  Planos personalizados  ' }).price, 'Planos personalizados');
  });

  await test('Estado vazio persistido continua vazio e não recria exemplos', () => {
    storage.values.set(ADMIN_STORAGE_KEY, rawState([], []));
    assert.deepEqual(admin.loadClientRecords().records, []);
    assert.deepEqual(admin.loadClientRecords().brands, []);
    assert.equal(admin.persistClientRecords([], []).ok, true);
    assert.deepEqual(admin.loadClientRecords().records, []);
  });

  await test('JSON inválido não é substituído por salvamento ou limpeza', () => {
    const raw = '{invalid';
    storage.values.set(ADMIN_STORAGE_KEY, raw);
    assert.ok(admin.loadClientRecords().error);
    assert.equal(admin.persistClientRecords([], []).ok, false);
    assert.equal(admin.resetClientRecords(admin.loadClientRecords().storageToken).ok, false);
    assert.equal(storage.values.get(ADMIN_STORAGE_KEY), raw);
    assert.equal(storage.writes.length, 0);
  });

  await test('Coleção inválida não retorna cadastros parcialmente válidos', () => {
    const raw = rawState([fixtureRecord(), { id: 'broken' }]);
    storage.values.set(ADMIN_STORAGE_KEY, raw);
    const loaded = admin.loadClientRecords();
    assert.ok(loaded.error);
    assert.deepEqual(loaded.records, []);
    assert.equal(admin.persistClientRecords([], []).ok, false);
    assert.equal(storage.values.get(ADMIN_STORAGE_KEY), raw);
  });

  await test('Leitura bloqueada informa falha sem sobrescrever armazenamento', () => {
    storage.blocked = true;
    assert.ok(admin.loadClientRecords().error);
    assert.equal(admin.persistClientRecords([], []).ok, false);
    assert.equal(storage.writes.length, 0);
  });

  await test('Falha de quota no salvamento conserva o último conjunto', () => {
    saveFixture();
    const before = storage.values.get(ADMIN_STORAGE_KEY);
    storage.failWrite = key => key === ADMIN_STORAGE_KEY;
    const result = admin.persistClientRecords([], [], admin.loadClientRecords().storageToken);
    assert.equal(result.ok, false);
    assert.ok(result.error);
    assert.equal(storage.values.get(ADMIN_STORAGE_KEY), before);
  });

  await test('Migração v1 mantém identidades, sem vínculo automático ou exclusão do legado', () => {
    const record = fixtureRecord();
    delete record.brandId;
    delete record.identityOverrides;
    delete record.page.design;
    const raw = JSON.stringify({ version: 1, records: [record] });
    storage.values.set(LEGACY_ADMIN_STORAGE_KEY, raw);
    const loaded = admin.loadClientRecords();
    assert.equal(loaded.error, '');
    assert.equal(loaded.records[0].brandId, '');
    assert.deepEqual(loaded.records[0].identityOverrides, []);
    assert.equal(loaded.records[0].page.name, record.page.name);
    assert.deepEqual(loaded.records[0].page.design, design.normalizeDesign());
    assert.equal(admin.persistClientRecords(loaded.records, loaded.brands, loaded.storageToken).ok, true);
    assert.equal(storage.values.get(LEGACY_ADMIN_STORAGE_KEY), raw);
  });

  await test('v2 vazio tem prioridade sobre cadastros do legado v1', () => {
    storage.values.set(LEGACY_ADMIN_STORAGE_KEY, JSON.stringify({ version: 1, records: [fixtureRecord()] }));
    storage.values.set(ADMIN_STORAGE_KEY, rawState([], []));
    assert.deepEqual(admin.loadClientRecords().records, []);
  });

  await test('Token antigo impede sobrescrever alterações de outra aba', () => {
    saveFixture();
    const oldToken = admin.loadClientRecords().storageToken;
    const changed = fixtureRecord();
    changed.clientName = 'Mudança de outra aba';
    storage.values.set(ADMIN_STORAGE_KEY, rawState([changed]));
    const before = storage.values.get(ADMIN_STORAGE_KEY);
    const result = admin.persistClientRecords([], [], oldToken);
    assert.equal(result.ok, false);
    assert.equal(result.conflict, true);
    assert.equal(storage.values.get(ADMIN_STORAGE_KEY), before);
  });

  await test('Limpeza cria recuperação, zera marcas/páginas e mantém legado', () => {
    const brand = fixtureBrand();
    const record = { ...fixtureRecord(), brandId: brand.id };
    assert.equal(admin.persistClientRecords([record], [brand]).ok, true);
    storage.values.set(LEGACY_ADMIN_STORAGE_KEY, 'legado preservado');
    const result = admin.resetClientRecords(admin.loadClientRecords().storageToken);
    assert.equal(result.ok, true, result.error);
    assert.deepEqual(result.records, []);
    assert.deepEqual(result.brands, []);
    assert.equal(result.storageToken, admin.loadClientRecords().storageToken);
    assert.deepEqual(admin.loadClientRecords().records, []);
    assert.deepEqual(admin.loadClientRecords().brands, []);
    assert.equal(storage.values.get(LEGACY_ADMIN_STORAGE_KEY), 'legado preservado');
    const recovery = admin.loadClientRecovery();
    assert.equal(recovery.available, true);
    assert.equal(recovery.recordCount, 1);
    assert.equal(recovery.brandCount, 1);
    assert.ok(Number.isFinite(Date.parse(recovery.savedAt)));
    assert.equal(Object.hasOwn(recovery, 'records'), false);
    assert.equal(Object.hasOwn(recovery, 'brands'), false);
  });

  await test('Recuperação restaura dados somente quando cadastro atual está vazio', () => {
    saveFixture();
    assert.equal(admin.resetClientRecords(admin.loadClientRecords().storageToken).ok, true);
    const result = admin.restoreClientRecords(admin.loadClientRecords().storageToken);
    assert.equal(result.ok, true, result.error);
    assert.equal(result.records.length, 1);
    assert.equal(result.storageToken, admin.loadClientRecords().storageToken);
    assert.equal(admin.loadClientRecords().records[0].clientName, fixtureRecord().clientName);
    const before = storage.values.get(ADMIN_STORAGE_KEY);
    assert.equal(admin.restoreClientRecords(result.storageToken).ok, false);
    assert.equal(storage.values.get(ADMIN_STORAGE_KEY), before);
  });

  await test('Limpeza repetida do conjunto vazio conserva a recuperação anterior', () => {
    saveFixture();
    assert.equal(admin.resetClientRecords(admin.loadClientRecords().storageToken).ok, true);
    const backup = storage.values.get(CLIENT_RECOVERY_STORAGE_KEY);
    assert.equal(admin.resetClientRecords(admin.loadClientRecords().storageToken).ok, true);
    assert.equal(storage.values.get(CLIENT_RECOVERY_STORAGE_KEY), backup);
    assert.equal(admin.loadClientRecovery().recordCount, 1);
  });

  await test('Token antigo bloqueia limpeza e restauração sem gravações', () => {
    saveFixture();
    const oldToken = admin.loadClientRecords().storageToken;
    assert.equal(admin.resetClientRecords(oldToken).ok, true);
    const writes = storage.writes.length;
    assert.equal(admin.resetClientRecords(oldToken).conflict, true);
    assert.equal(admin.restoreClientRecords(oldToken).conflict, true);
    assert.equal(storage.writes.length, writes);
  });

  await test('Falha ao gravar recuperação impede apagar cadastros', () => {
    saveFixture();
    const before = storage.values.get(ADMIN_STORAGE_KEY);
    storage.failWrite = key => key === CLIENT_RECOVERY_STORAGE_KEY;
    assert.equal(admin.resetClientRecords(admin.loadClientRecords().storageToken).ok, false);
    assert.equal(storage.values.get(ADMIN_STORAGE_KEY), before);
    assert.equal(storage.values.has(CLIENT_RECOVERY_STORAGE_KEY), false);
  });

  await test('Falha na limpeza conserva cadastros e cópia de recuperação', () => {
    saveFixture();
    const before = storage.values.get(ADMIN_STORAGE_KEY);
    storage.failWrite = key => key === ADMIN_STORAGE_KEY;
    assert.equal(admin.resetClientRecords(admin.loadClientRecords().storageToken).ok, false);
    assert.equal(storage.values.get(ADMIN_STORAGE_KEY), before);
    assert.equal(admin.loadClientRecovery().recordCount, 1);
  });

  await test('Recuperação ausente ou corrompida não substitui o conjunto vazio', () => {
    storage.values.set(ADMIN_STORAGE_KEY, rawState([], []));
    assert.equal(admin.loadClientRecovery().available, false);
    assert.equal(admin.restoreClientRecords(admin.loadClientRecords().storageToken).ok, false);
    const before = storage.values.get(ADMIN_STORAGE_KEY);
    storage.values.set(CLIENT_RECOVERY_STORAGE_KEY, '{broken');
    assert.equal(admin.loadClientRecovery().available, false);
    assert.equal(admin.restoreClientRecords(admin.loadClientRecords().storageToken).ok, false);
    assert.equal(storage.values.get(ADMIN_STORAGE_KEY), before);
  });
} finally {
  await server.close();
  if (originalStorage) Object.defineProperty(globalThis, 'localStorage', originalStorage);
  else delete globalThis.localStorage;
}

process.stdout.write(`\n${passed} testes aprovados; ${failures.length} falhas.\n`);
if (failures.length) process.exitCode = 1;
