# Modelo de prévia da página de links

## Objetivo

Testar a configuração de um cliente dentro do sistema LocyView, sem modificar ou integrar automaticamente o primeiro site LocyTech.

## Visão geral

O painel é a página principal `/`. O modelo abre em `/preview` com componentes copiados e mantidos neste próprio projeto. Não importa arquivos de `locytech-bio` nem lê seu armazenamento.

`Hub` exibe marca e quatro opções: Instagram, WhatsApp, LinkedIn e Nossos produtos. As três primeiras abrem destinos configurados em outra aba; um canal vazio exibe aviso. A quarta abre `Products`, sem alterar o snapshot da URL. `BrandFooter` respeita `showBrand`.

A prévia é responsiva: identidade compacta e opções em uma coluna em telas pequenas; composição lado a lado a partir de 901 pixels. Adaptação por largura CSS, sem `userAgent` ou iframe. Os controles antigos de personalização e compartilhamento não são exibidos na prévia.

## Arquivos fonte de verdade

- `src/index.jsx`: painel ou modelo de prévia.
- `src/App.jsx`: navegação e leitura do snapshot.
- `src/pages/Hub.jsx`: canais e rodapé.
- `src/utils/adminState.js`: URL de demonstração.
- `src/utils/pageState.js`: dados públicos e validação.
- `src/styles/global.css`: responsividade do modelo.

## Modelo de dados / fluxo

`state.links` mantém Instagram, WhatsApp e LinkedIn; Nossos produtos conta apenas itens habilitados. Cores e textos vêm da configuração, e URLs passam por `safeUrl`.

`clientPreviewUrl` gera `/preview#p=` na origem do painel com dados públicos sanitizados. Nome administrativo, datas e vínculo interno de marca não entram no link. O identificador não cria caminho por cliente ou publicação. O link guarda uma versão, não acompanha edições posteriores e não tem revogação.

A identidade de uma marca vinculada é resolvida antes de criar o snapshot. A demonstração passa a conter nome, logo e cores daquele momento, sem consultar cadastros futuros. Atualizar uma marca no painel não altera snapshots anteriores.

O modelo LocyTech usa Instagram `https://www.instagram.com/locytech/`, WhatsApp `https://wa.me/5551920057268` e LinkedIn genérico. São referências locais, não leitura do primeiro site. Novos cadastros começam com destinos vazios e são normalizados sem migração de padrões antigos.

“Ver projeto de links” no menu abre o primeiro projeto externamente. Não há importação, publicação ou sincronização entre os dois sistemas.

## Regras críticas

- Manter `/` como painel e `/preview` como modelo.
- Preservar quatro opções e abrir produtos somente após o clique.
- Não inventar perfis ou números do cliente.
- Não carregar registros administrativos em uma prévia inválida.
- Usar `noopener noreferrer` nos links externos.
- Não mostrar edição no modelo nem prometer atualização centralizada.

## O que revisar antes de alterar

- Conferir quatro opções, ordem e destinos.
- Testar textos longos, ausência de logo, assinatura e catálogo vazio.
- Gerar `/preview#p=` e testar catálogo e retorno sem controles de edição.
- Testar 320 e 390 pixels, tablet e computador sem rolagem horizontal.
- Confirmar que o snapshot não muda ao editar marca ou página posteriormente.
- Confirmar que a prévia não altera o primeiro projeto.

## Código relacionado

- [Entrada do painel e prévia](../../src/index.jsx)
- [Modelo completo](../../src/App.jsx)
- [Canais e rodapé](../../src/pages/Hub.jsx)
- [Identidade visual](../../src/components/BrandAtmosphere.jsx)
- [Validação e snapshot](../../src/utils/pageState.js)
- [Link da demonstração](../../src/utils/adminState.js)
- [Estilos do modelo](../../src/styles/global.css)
