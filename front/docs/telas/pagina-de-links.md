# Modelo de prévia da página de links

## Objetivo

Testar a configuração de um cliente dentro do sistema LocyView, sem modificar ou integrar automaticamente o primeiro site LocyTech.

## Visão geral

O painel é a página principal `/`. O modelo abre em `/preview` com componentes copiados e mantidos neste próprio projeto. Não importa arquivos de `locytech-bio` nem lê seu armazenamento.

`Hub` exibe marca e quatro opções: Instagram, WhatsApp, LinkedIn e Nossos produtos. A ordem é configurada em `design.channelOrder`; a ordem inicial é essa, mas pode ser alterada no painel. As três primeiras abrem destinos configurados em outra aba; um canal vazio exibe aviso. A quarta abre `Products`, sem alterar o snapshot da URL. `BrandFooter` respeita `showBrand`.

`PageSurface` aplica o mesmo visual ao modelo completo e à prévia do editor: seis composições, quatro estilos de cartão e fundo, tipografia, medidas e visibilidade dos detalhes. O layout Lateral fica lado a lado quando há espaço; os demais respeitam sua composição e todos se adaptam a telas pequenas. Adaptação por largura CSS, sem `userAgent` ou iframe. Os controles antigos de personalização e compartilhamento não são exibidos na prévia.

No painel, `LivePreview` combina esses componentes com `Products` e `ProductDetails` para testar o rascunho sem salvar ou gerar snapshot. A prévia lateral e o diálogo ampliado permitem navegar entre Página, catálogo e detalhes. Canais externos são interceptados e mostram um aviso; no snapshot aberto em `/preview`, os destinos validados continuam links reais. Somente leitura significa que a visualização não modifica os cadastros, não que seus botões estejam desativados.

## Arquivos fonte de verdade

- `src/index.jsx`: painel ou modelo de prévia.
- `src/App.jsx`: navegação e leitura do snapshot.
- `src/pages/Hub.jsx`: canais e rodapé.
- `src/admin/LivePreview.jsx`: visualização administrativa interativa.
- `src/components/ProductDetails.jsx`: conteúdo de detalhes reutilizado.
- `src/utils/adminState.js`: URL de demonstração.
- `src/utils/pageState.js`: dados públicos e validação.
- `src/components/PageSurface.jsx`: tema e atributos do visual.
- `src/utils/pageDesign.js`: 24 presets e normalização.
- `src/styles/pageDesign.css`: composições e tema configurável.
- `src/styles/global.css`: estilos base do modelo.

## Modelo de dados / fluxo

`state.links` mantém Instagram, WhatsApp e LinkedIn; Nossos produtos conta apenas itens habilitados. Cores, textos e visual vêm da configuração, e URLs passam por `safeUrl`. O campo `design` controla ordem, layout, estilo dos cartões e fundo, fonte, escala, cantos, espaços, logo, alinhamento, ícones, descrições e setas. Aplicar um dos 24 modelos não troca conteúdo, cores ou a prioridade dos canais.

`clientPreviewUrl` gera `/preview#p=` na origem do painel com dados públicos sanitizados. Nome administrativo, datas, vínculo interno de marca e `identityOverrides` não entram no link. O visual normalizado faz parte do snapshot. O identificador não cria caminho por cliente ou publicação. O link guarda uma versão, não acompanha edições posteriores e não tem revogação.

A identidade de uma marca vinculada é resolvida antes de criar o snapshot, respeitando nome, logo e cores personalizados na página. A demonstração passa a conter nome, logo e cores daquele momento, sem consultar cadastros futuros. Atualizar uma marca no painel não altera snapshots anteriores.

O modelo LocyTech usa Instagram `https://www.instagram.com/locytech/`, WhatsApp `https://wa.me/5551920057268` e LinkedIn genérico. São referências locais, não leitura do primeiro site. Novos cadastros começam com destinos vazios e são normalizados sem migração de padrões antigos.

“Ver projeto de links” no menu abre o primeiro projeto externamente. Não há importação, publicação ou sincronização entre os dois sistemas.

## Regras críticas

- Manter `/` como painel e `/preview` como modelo.
- Preservar quatro opções e abrir produtos somente após o clique.
- Não inventar perfis ou números do cliente.
- Não carregar registros administrativos em uma prévia inválida.
- Usar `noopener noreferrer` nos links externos.
- Não mostrar edição no modelo nem prometer atualização centralizada.
- Diferenciar a prévia ao vivo do rascunho e o snapshot fixo; bloquear contatos externos somente na superfície administrativa.

## O que revisar antes de alterar

- Conferir quatro opções, ordem e destinos.
- Testar textos longos, ausência de logo, assinatura e catálogo vazio.
- Conferir os 24 modelos na mesma configuração e todas as ordens/visibilidades dos canais.
- Testar fundos e cores claros e escuros com contraste legível.
- Gerar `/preview#p=` e testar catálogo e retorno sem controles de edição.
- Testar o mesmo catálogo no painel antes de salvar, ampliar a visualização e conferir detalhes sem navegação externa.
- Testar 320 e 390 pixels, tablet e computador sem rolagem horizontal.
- Confirmar que o snapshot não muda ao editar marca ou página posteriormente.
- Confirmar que a prévia não altera o primeiro projeto.

## Código relacionado

- [Entrada do painel e prévia](../../src/index.jsx)
- [Modelo completo](../../src/App.jsx)
- [Prévia interativa do painel](../../src/admin/LivePreview.jsx)
- [Detalhes compartilhados](../../src/components/ProductDetails.jsx)
- [Estilos da prévia administrativa](../../src/styles/livePreview.css)
- [Canais e rodapé](../../src/pages/Hub.jsx)
- [Identidade visual](../../src/components/BrandAtmosphere.jsx)
- [Renderizador de visual](../../src/components/PageSurface.jsx)
- [Modelos e normalização](../../src/utils/pageDesign.js)
- [Estilos configuráveis](../../src/styles/pageDesign.css)
- [Validação e snapshot](../../src/utils/pageState.js)
- [Link da demonstração](../../src/utils/adminState.js)
- [Estilos do modelo](../../src/styles/global.css)
