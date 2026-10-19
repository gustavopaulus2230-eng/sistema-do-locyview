# Arquitetura do painel LocyView

## Objetivo

Implementar o sistema independente de cadastro de marcas e páginas dos clientes. A entrega é somente front-end React; não contém API, servidor, autenticação ou banco de dados. O primeiro projeto `locytech-bio` permanece separado em código, hospedagem e armazenamento.

## Visão geral

`src/index.jsx` seleciona `AdminApp` no endereço principal `/` e nos aliases `/admin` e `/admin/`. O caminho `/preview` seleciona `App`, modelo autocontido para testar uma página configurada. Não há importação de código de outro projeto.

O menu administrativo contém Páginas dos clientes e Marcas. O primeiro organiza cadastros em Identidade, Aparência, Links e Produtos. O segundo centraliza nome, logo e três cores. O vínculo por `brandId` aplica a identidade central às páginas, preservando conteúdo específico.

“Ver projeto de links” abre externamente `https://locytech-link-bio.locytech.chatgpt.site/`. Esse link não implementa integração, importação ou sincronização. A identidade Sites deste painel é própria, em `https://locyview-painel.locytech.chatgpt.site`; não reutilizar o projeto de publicação ou o destino GitHub do primeiro site.

## Arquivos fonte de verdade

- `src/admin/AdminApp.jsx`: páginas, marcas, formulários, prévia e avisos.
- `src/admin/BrandViews.jsx`: listagem pesquisável, formulário e prévia de identidade das marcas.
- `src/utils/adminState.js`: esquema administrativo, vínculos, validação e persistência.
- `src/components/PageFields.jsx`: marca, textos, logo, cores e canais.
- `src/components/Editor.jsx`: formulário de produto reutilizado.
- `src/App.jsx`: modelo de prévia, navegação, detalhes e orçamento.
- `src/pages/Hub.jsx` e `src/pages/Products.jsx`: canais e catálogo do modelo.
- `src/utils/pageState.js`: esquema público, sanitização e snapshots.
- `src/components/BrandAtmosphere.jsx`, `Icon.jsx` e `Modal.jsx`: identidade, SVGs e diálogos.
- `src/styles/admin.css` e `src/styles/global.css`: painel e modelo responsivos.
- `src/index.jsx`: seleção por caminho, sem identificação do dispositivo.

## Modelo de dados / fluxo

O conjunto administrativo versão 2 contém `{ version: 2, records, brands }` em `locyview-admin:v2`, persistido no navegador da origem deste painel. Páginas possuem id, nome administrativo, configuração pública, data e vínculo opcional de marca. Marcas possuem id, nome, logo, três cores e data. O limite é de 50 páginas e 50 marcas.

Salvar uma marca propaga exclusivamente nome, logo, cor principal, destaque e fundo às páginas locais vinculadas. Textos, identificador, assinatura, canais e produtos permanecem específicos. Marcas e páginas são gravadas em uma única operação para preservar consistência. As alterações em memória só são apresentadas como salvas após sucesso.

A leitura legada de `locyview-admin:v1` ocorre somente quando a chave versão 2 não existe e mantém páginas sem vínculo automático, preservando suas identidades. O armazenamento legado não é apagado, inclusive após salvar a versão nova. Se não existe estado salvo, surge somente marca LocyTech e página modelo vinculada; conjuntos vazios persistidos continuam vazios. Dados inválidos, leitura bloqueada ou falha de quota são informados e não justificam sobrescrever conteúdo anterior.

O esquema público versão 3 contém marca, textos, identificador, logo, três cores, assinatura, produtos e três links. O painel normaliza com `migrateDefaults: false`; snapshots incluem `preserveConfiguredValues: true`. Assim, valores personalizados não sofrem migrações antigas do modelo LocyTech.

`clientPreviewUrl` usa a origem atual e gera `/preview#p=` com dados sanitizados. Nome administrativo, datas, vínculo interno e dados de orçamento não entram no snapshot. Uma marca vinculada é resolvida antes da geração. A prévia é somente leitura, sem controles antigos de edição, sem consultar cadastros posteriores e sem carregar dados administrativos em um link inválido.

Snapshots são versões, não páginas publicadas centralmente. Não criam rotas por identificador, não acompanham edições futuras e não permitem revogação. Uma futura integração exige escopo próprio; não solicitar credenciais nesta versão.

O modelo de links mantém quatro opções: Instagram, WhatsApp, LinkedIn e Nossos produtos. Produtos abrem por clique. Preços do modelo são ilustrativos, inclusive R$ 0,00, sem oferta de serviço gratuito. O orçamento apenas prepara mensagem; não envia ou contrata.

## Interface e hospedagem

O painel e o modelo se adaptam por largura CSS, sem `userAgent`, iframe ou link especial para celular. Componentes respeitam contraste, teclado, foco e movimento reduzido.

Assets são locais; `/assets/locytech-hd.png` funciona em todas as rotas. Vite gera `build/` na raiz, conforme `.openai/hosting.json`, que mantém a identidade independente deste painel. A porta local é 4174, distinta da 4173 do primeiro projeto. Dependências, build e arquivos de trava são gerados automaticamente e não devem ser editados à mão.

Não há destino GitHub novo configurado nesta entrega. O repositório LocyView fornecido anteriormente pertence ao primeiro projeto; não usá-lo para publicar este painel sem autorização específica.

## Regras críticas

- Trabalhar somente em `locyview-painel`; não modificar ou reintegrar `locytech-bio`.
- Manter `/` administrativo e `/preview` apenas demonstrativo.
- Não simular autenticação, API, servidor, métricas ou publicação de clientes.
- Persistir marcas e páginas juntas e propagar só os cinco campos de identidade.
- Preservar migração sem vínculo automático e estados vazios.
- Não compartilhar dados administrativos, orçamento ou segredos.
- Manter armazenamento local explícito e avisos de falha honestos.
- Não usar emojis; reutilizar componentes e SVGs.
- Não apagar marcas ou páginas fora do escopo.

## O que revisar antes de alterar

- Ler componentes reais e documentação do domínio.
- Testar páginas, marcas, vínculos, propagação e preservação do conteúdo específico.
- Conferir limites, validação, versão 1, listas vazias e falhas de armazenamento.
- Abrir as rotas diretamente e recarregar; testar snapshot sem campos administrativos.
- Conferir celular, computador, teclado e diálogos.
- Executar `npm run build` e verificar identidade própria de publicação.
- Atualizar domínios antes de AGENTS e READMEs.

## Código relacionado

- [Entrada React](../src/index.jsx)
- [Painel de páginas e marcas](../src/admin/AdminApp.jsx)
- [Interface de marcas](../src/admin/BrandViews.jsx)
- [Estado administrativo](../src/utils/adminState.js)
- [Campos de configuração](../src/components/PageFields.jsx)
- [Modelo de prévia](../src/App.jsx)
- [Snapshot público](../src/utils/pageState.js)
- [Estilos do painel](../src/styles/admin.css)
- [Estilos do modelo](../src/styles/global.css)
- [Comandos](../../package.json)
- [Publicação independente](../../.openai/hosting.json)
