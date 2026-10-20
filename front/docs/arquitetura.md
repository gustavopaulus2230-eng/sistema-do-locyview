# Arquitetura do painel LocyView

## Objetivo

Implementar o sistema independente de cadastro de marcas e páginas dos clientes. A entrega é somente front-end React; não contém API, servidor, autenticação ou banco de dados. O primeiro projeto `locytech-bio` permanece separado em código, hospedagem e armazenamento.

## Visão geral

`src/index.jsx` seleciona `AdminApp` no endereço principal `/` e nos aliases `/admin` e `/admin/`. O caminho `/preview` seleciona `App`, modelo autocontido para testar uma página configurada. Não há importação de código de outro projeto.

O menu administrativo contém Páginas dos clientes e Marcas. O primeiro organiza cadastros em Identidade, Aparência, Links e Produtos. O segundo centraliza nome, logo e três cores. O vínculo por `brandId` fornece a identidade inicial da página. Nome, logo e três cores continuam editáveis; `identityOverrides` protege campos personalizados de mudanças futuras da marca. A etapa Aparência inclui 24 modelos e controles de visual, todos com prévia imediata.

“Ver projeto de links” abre externamente `https://locytech-link-bio.locytech.chatgpt.site/`. Esse link não implementa integração, importação ou sincronização. A identidade Sites deste painel é própria, em `https://locyview-painel.locytech.chatgpt.site`; não reutilizar o projeto de publicação ou o destino GitHub do primeiro site.

## Arquivos fonte de verdade

- `src/admin/AdminApp.jsx`: páginas, marcas, formulários, prévia e avisos.
- `src/admin/BrandViews.jsx`: listagem pesquisável, formulário e prévia de identidade das marcas.
- `src/admin/PageDesignFields.jsx`: galeria com 24 modelos, filtros e ajustes visuais.
- `src/utils/adminState.js`: esquema administrativo, vínculos, validação e persistência.
- `src/components/PageFields.jsx`: marca, textos, logo, cores e canais.
- `src/components/Editor.jsx`: formulário de produto reutilizado.
- `src/App.jsx`: modelo de prévia, navegação, detalhes e orçamento.
- `src/pages/Hub.jsx` e `src/pages/Products.jsx`: canais e catálogo do modelo.
- `src/utils/pageState.js`: esquema público, sanitização e snapshots.
- `src/utils/pageDesign.js`: 24 presets, padrões e validação de visual.
- `src/components/PageSurface.jsx`: mesmo renderizador para prévia do editor e demonstração completa.
- `src/components/BrandAtmosphere.jsx`, `Icon.jsx` e `Modal.jsx`: identidade, SVGs e diálogos.
- `src/styles/admin.css`, `src/styles/designer.css`, `src/styles/pageDesign.css` e `src/styles/global.css`: painel, biblioteca e composições responsivas.
- `src/index.jsx`: seleção por caminho, sem identificação do dispositivo.

## Modelo de dados / fluxo

O conjunto administrativo versão 2 contém `{ version: 2, records, brands }` em `locyview-admin:v2`, persistido no navegador da origem deste painel. Páginas possuem id, nome administrativo, configuração pública, data, vínculo opcional de marca e lista `identityOverrides`. Marcas possuem id, nome, logo, três cores e data. O limite é de 50 páginas e 50 marcas.

Salvar uma marca propaga exclusivamente nome, logo, cor principal, destaque e fundo ainda herdados pelas páginas locais vinculadas. Campos alterados na própria página entram em `identityOverrides`, que aceita apenas essas cinco chaves e impede sua substituição. Usar identidade da marca limpa exceções e reaplica a identidade; trocar de marca também limpa exceções. Textos, identificador, assinatura, canais, produtos e visual permanecem específicos. Marcas e páginas são gravadas em uma única operação para preservar consistência. As alterações em memória só são apresentadas como salvas após sucesso.

A leitura legada de `locyview-admin:v1` ocorre somente quando a chave versão 2 não existe e mantém páginas sem vínculo automático, preservando suas identidades. O armazenamento legado não é apagado, inclusive após salvar a versão nova. Se não existe estado salvo, surge somente marca LocyTech e página modelo vinculada; conjuntos vazios persistidos continuam vazios. Dados inválidos, leitura bloqueada ou falha de quota são informados e não justificam sobrescrever conteúdo anterior.

O esquema público versão 3 contém marca, textos, identificador, logo, três cores, assinatura, produtos, três links e `design`. O painel normaliza com `migrateDefaults: false`; snapshots incluem `preserveConfiguredValues: true`. Assim, valores personalizados não sofrem migrações antigas do modelo LocyTech.

`design` guarda composição, cartões, fundo, fonte, escala, cantos, espaçamento, medidas e formato da logo, alinhamento, visibilidades e ordem dos quatro canais. São 24 modelos: seis composições (Pilha, Lateral, Grade, Mosaico, Destaque, Compacto) por quatro estilos (essencial, editorial, impacto, cristal). Escolher modelo só substitui `design`, nunca cores ou conteúdo. `normalizeDesign` limita opções e medidas; dados antigos sem esse campo recebem padrões. A versão administrativa continua 2, e registros sem `identityOverrides` recebem lista vazia.

`clientPreviewUrl` usa a origem atual e gera `/preview#p=` com dados sanitizados. Nome administrativo, datas, vínculo interno, `identityOverrides` e dados de orçamento não entram no snapshot; o visual normalizado é incluído. Uma marca vinculada é resolvida antes da geração. A prévia é somente leitura, sem controles antigos de edição, sem consultar cadastros posteriores e sem carregar dados administrativos em um link inválido.

Snapshots são versões, não páginas publicadas centralmente. Não criam rotas por identificador, não acompanham edições futuras e não permitem revogação. Uma futura integração exige escopo próprio; não solicitar credenciais nesta versão.

O modelo de links mantém quatro opções: Instagram, WhatsApp, LinkedIn e Nossos produtos, em ordem ajustável por `channelOrder`. Produtos abrem por clique. Preços do modelo são ilustrativos, inclusive R$ 0,00, sem oferta de serviço gratuito. O orçamento apenas prepara mensagem; não envia ou contrata.

## Interface e hospedagem

O painel e o modelo se adaptam por largura CSS, sem `userAgent`, iframe ou link especial para celular. `PageSurface` aplica tema, contraste, tipografia e atributos de composição tanto na prévia embutida quanto no modelo completo. Componentes respeitam teclado, foco e movimento reduzido.

Os seletores de cor aplicam imediatamente, assim como HEX de seis dígitos. HEX curto é expandido ao sair ou confirmar com Enter; entrada inválida informa erro e conserva a última cor válida. Nome, logo e cores não são bloqueados quando a página está vinculada à marca.

Assets são locais; `/assets/locytech-hd.png` funciona em todas as rotas. Vite gera `build/` na raiz, conforme `.openai/hosting.json`, que mantém a identidade independente deste painel. A porta local é 4174, distinta da 4173 do primeiro projeto. Dependências, build e arquivos de trava são gerados automaticamente e não devem ser editados à mão.

Não há destino GitHub novo configurado nesta entrega. O repositório LocyView fornecido anteriormente pertence ao primeiro projeto; não usá-lo para publicar este painel sem autorização específica.

## Regras críticas

- Trabalhar somente em `locyview-painel`; não modificar ou reintegrar `locytech-bio`.
- Manter `/` administrativo e `/preview` apenas demonstrativo.
- Não simular autenticação, API, servidor, métricas ou publicação de clientes.
- Persistir marcas e páginas juntas e propagar somente identidade herdada, respeitando exceções de cada campo.
- Manter 24 modelos distintos, sem sobrescrever cores ou conteúdo; renderizar ajustes de forma equivalente na prévia e no snapshot.
- Preservar migração sem vínculo automático e estados vazios.
- Não compartilhar dados administrativos, orçamento ou segredos.
- Manter armazenamento local explícito e avisos de falha honestos.
- Não usar emojis; reutilizar componentes e SVGs.
- Não apagar marcas ou páginas fora do escopo.

## O que revisar antes de alterar

- Ler componentes reais e documentação do domínio.
- Testar páginas, marcas, vínculos, propagação seletiva, exceções e restauração da identidade.
- Conferir 24 modelos, ajustes, ordem dos canais, cores claras/escuras, HEX inválido e equivalência da prévia.
- Conferir limites, validação, versão 1, listas vazias e falhas de armazenamento.
- Abrir as rotas diretamente e recarregar; testar snapshot sem campos administrativos.
- Conferir celular, computador, teclado e diálogos.
- Executar `npm run build` e verificar identidade própria de publicação.
- Atualizar domínios antes de AGENTS e READMEs.

## Código relacionado

- [Entrada React](../src/index.jsx)
- [Painel de páginas e marcas](../src/admin/AdminApp.jsx)
- [Interface de marcas](../src/admin/BrandViews.jsx)
- [Designer de páginas](../src/admin/PageDesignFields.jsx)
- [Presets e validação de visual](../src/utils/pageDesign.js)
- [Renderizador compartilhado](../src/components/PageSurface.jsx)
- [Estilos da biblioteca](../src/styles/designer.css)
- [Estilos das composições](../src/styles/pageDesign.css)
- [Estado administrativo](../src/utils/adminState.js)
- [Campos de configuração](../src/components/PageFields.jsx)
- [Modelo de prévia](../src/App.jsx)
- [Snapshot público](../src/utils/pageState.js)
- [Estilos do painel](../src/styles/admin.css)
- [Estilos do modelo](../src/styles/global.css)
- [Comandos](../../package.json)
- [Publicação independente](../../.openai/hosting.json)
