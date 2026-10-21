# Visual e modelos da página

## Objetivo

Personalizar a apresentação de cada página de cliente com mais de 20 opções reais e ajustes finos, sem trocar sua marca, cores ou conteúdo.

## Visão geral

Na etapa Aparência, depois da paleta, `PageDesignFields` destaca o modelo base com a logo e as cores atuais e organiza a personalização em três abas: Modelos, Ajustes e Organização. Modelos começa selecionada; o filtro Todas exibe as 24 opções, e os seis filtros de composição exibem quatro modelos cada. As miniaturas usam CSS e as cores atuais da página.

Ajustes agrupa composição e cartões, tipografia, apresentação da logo, formas e espaçamento, além da visibilidade dos detalhes. Organização concentra a ordem dos quatro canais. As abas têm navegação por teclado com setas, Home e End, mantendo os controles fora da aba ativa ocultos.

Cada modelo combina uma composição e um estilo. Não são 24 nomes para o mesmo layout. As composições são Pilha, Lateral, Grade, Mosaico, Destaque e Compacto; os estilos são essencial, editorial, impacto e cristal.

| Composição | Essencial | Editorial | Impacto | Cristal |
| --- | --- | --- | --- | --- |
| Pilha | Pilha essencial | Pilha editorial | Pilha impacto | Pilha cristal |
| Lateral | Lateral essencial | Lateral editorial | Lateral impacto | Lateral cristal |
| Grade | Grade essencial | Grade editorial | Grade impacto | Grade cristal |
| Mosaico | Mosaico essencial | Mosaico editorial | Mosaico impacto | Mosaico cristal |
| Destaque | Destaque essencial | Destaque editorial | Destaque impacto | Destaque cristal |
| Compacto | Compacto essencial | Compacto editorial | Compacto impacto | Compacto cristal |

Essencial usa cartões suaves e fundo liso; Editorial usa contornos, grade e serifa; Impacto usa preenchimento, degradê e tipografia moderna; Cristal usa transparência, estrelas e cantos arredondados. Cada composição também define proporções e espaçamento próprios.

## Arquivos fonte de verdade

- `src/admin/PageDesignFields.jsx`: galeria, filtros e ajustes.
- `src/utils/pageDesign.js`: padrões, 24 modelos e sanitização.
- `src/components/PageSurface.jsx`: renderizador do visual.
- `src/admin/LivePreview.jsx`: prévia interativa do rascunho.
- `src/pages/Hub.jsx`: canais na ordem configurada.
- `src/components/BrandAtmosphere.jsx`: logo e fundo configuráveis.
- `src/styles/designer.css`: controles e miniaturas do painel.
- `src/styles/pageDesign.css`: composições do resultado.

## Modelo de dados / fluxo

O visual é guardado em `page.design`, com:

- `templateId`: modelo base selecionado; a interface identifica como Base, pois ajustes manuais podem alterar o resultado.
- `layout`: stack, split, grid, bento, spotlight ou compact.
- `cardStyle`: soft, outline, solid ou glass.
- `backgroundStyle`: solid, gradient, grid ou stars.
- `fontFamily`: sans, modern ou serif.
- `textScale`: 90 a 125%, em passos de 5.
- `radius`: 0 a 32 pixels; `gap`: 8 a 28 pixels.
- `logoSize`: 64 a 200 pixels; `logoShape`: rounded, circle ou square.
- `align`: left ou center.
- `showIcons`, `showDescriptions` e `showArrows`: booleanos.
- `channelOrder`: permutação exata de instagram, whatsapp, linkedin e products.

`normalizeDesign` valida opções e limites, sem aceitar campos arbitrários. Dados antigos sem `design` recebem o padrão compatível Pilha essencial. O armazenamento administrativo continua versão 2; não exige apagar cadastros ou alterar chaves.

`applyTemplate` aplica os valores de visual do modelo e suas visibilidades, preservando a ordem dos quatro canais já escolhida. Não muda logo, nome, cores, textos, links, identificador, catálogo ou vínculo de marca. Os controles finos atualizam apenas `design`. A prévia usa `PageSurface`, o mesmo renderizador da demonstração completa.

As mudanças aparecem imediatamente, mas só persistem após Salvar página. O snapshot público inclui o visual normalizado e exclui `brandId`, `identityOverrides` e dados internos. Links antigos continuam versões fixas.

A prévia ao lado permite alternar Página e Produtos, abrir detalhes e ampliar a visualização para larguras de celular e computador. Ela usa o rascunho atual, inclusive antes de preencher campos obrigatórios ou salvar. Navegar na prévia não altera o cadastro; contatos externos são apenas inspecionados por aviso. Gerar link é uma ação separada, não um requisito para conferir o resultado.

## Marca e cores

Nome, logo e três cores podem ser editados livremente na própria página, inclusive quando existe uma marca vinculada. Cada campo alterado é registrado em `identityOverrides` e deixa de receber mudanças da marca central. Campos ainda herdados continuam acompanhando a marca.

Usar identidade da marca limpa as exceções e reaplica os cinco campos de identidade, sem resetar o visual ou conteúdo da página. Escolher outra marca também reaplica a identidade. Alterar modelo visual nunca restaura ou muda a paleta.

Seletor de cor e HEX de seis dígitos atualizam a prévia imediatamente. HEX de três dígitos é expandido ao sair ou pressionar Enter. Entrada inválida mostra erro e mantém a última cor válida; não é silenciosamente aplicada. Fundos claros e escuros recebem contraste calculado no renderizador.

## Regras críticas

- Manter as 24 combinações distintas e acessíveis, com seleção por botão e estado pressionado.
- Não aplicar paletas de cores junto aos modelos.
- Não modificar a marca central ao personalizar uma página.
- Preservar quatro canais, sem repetição ou perda ao reordenar.
- Manter limites e padrões para dados antigos.
- Não confundir prévia imediata com salvamento, publicação ou sincronização.
- Preservar isolamento do primeiro projeto e escopo somente front-end.

## O que revisar antes de alterar

- Conferir 24 modelos e quatro resultados por filtro.
- Aplicar todos os modelos sem perder cores, logo ou conteúdo.
- Ajustar cada seletor, slider, checkbox e ordem; conferir resultado e persistência.
- Testar as três abas por teclado, o destaque do modelo base, textos longos e telas pequenas.
- Conferir Página, catálogo, detalhes e ampliação com o rascunho não salvo; aplicar outro modelo sem perder a ordem dos canais.
- Conferir identidade vinculada, exceções por campo e restauração da marca.
- Testar cores claras/escuras, HEX curto, completo e inválido.
- Abrir snapshot e comparar visual com a prévia do cadastro.
- Carregar cadastros antigos sem `design` ou `identityOverrides`.

## Código relacionado

- [Biblioteca e controles](../../src/admin/PageDesignFields.jsx)
- [Presets e validação](../../src/utils/pageDesign.js)
- [Renderização do visual](../../src/components/PageSurface.jsx)
- [Prévia interativa](../../src/admin/LivePreview.jsx)
- [Ordem e cartões dos canais](../../src/pages/Hub.jsx)
- [Logo e fundo](../../src/components/BrandAtmosphere.jsx)
- [Persistência e exceções de identidade](../../src/utils/adminState.js)
- [Snapshot público](../../src/utils/pageState.js)
- [Estilos do designer](../../src/styles/designer.css)
- [Estilos dos modelos](../../src/styles/pageDesign.css)
