# Componentes de interface

## Objetivo

Padronizar formulários e diálogos do painel LocyView independente e do seu modelo de prévia. Componentes e assets são mantidos nesta pasta, sem importar código de `locytech-bio`.

## Visão geral

`AdminApp` coordena os campos de `PageFields`, o formulário `ProductEditor`, ícones SVG de `Icon` e diálogo nativo de `Modal`. `BrandViews` concentra listagem, formulário e prévia das marcas. Os mesmos campos de logo e cores atendem páginas sem vínculo e marcas centrais, sem duplicar upload ou validação. Parâmetros de `BrandFields` ocultam campos exclusivos de página no formulário da marca; `ColorsFields` oculta a assinatura nesse contexto. Páginas vinculadas mantêm edição livre de nome, logo e cores; não usar os parâmetros de bloqueio para impedir essa personalização.

`PageDesignFields` destaca o modelo base e organiza a galeria e os controles nas abas Modelos, Ajustes e Organização. São 24 modelos com filtros por seis composições, ajustes agrupados e ordem dos quatro canais. Miniaturas são construídas em CSS com diferenças reais de composição e estilo, não capturas estáticas. A aba Modelos abre inicialmente; setas, Home e End navegam entre as três abas. A galeria adapta a quantidade de colunas à largura do container.

`PageSurface` é compartilhado pelo modelo e pela prévia dentro do painel, para evitar diferenças entre os ajustes e o resultado. Aplica variáveis e atributos de tema. `BrandAtmosphere` usa nome, logo e opções de fundo e tamanho. A referência LocyTech é substituível pela marca do cliente. A logo não tem efeito pontilhado; apenas as estrelas têm movimento, respeitando movimento reduzido. Sem imagem válida aparece monograma.

`LivePreview` reaproveita `Hub`, `Products`, `PageSurface` e `ProductDetails` em uma superfície navegável do rascunho. A versão lateral pode ser ampliada no diálogo nativo do painel; a versão ampliada oferece larguras de celular e computador. Os canais externos são botões que mostram um aviso, enquanto Nossos produtos, filtros e detalhes funcionam dentro da prévia. Navegação não modifica o cadastro nem realiza envio.

## Arquivos fonte de verdade

- `src/admin/AdminApp.jsx`.
- `src/admin/BrandViews.jsx`.
- `src/admin/PageDesignFields.jsx`.
- `src/components/PageSurface.jsx`.
- `src/admin/LivePreview.jsx`.
- `src/components/ProductDetails.jsx`.
- `src/utils/pageDesign.js`.
- `src/components/PageFields.jsx`.
- `src/components/Editor.jsx`.
- `src/components/BrandAtmosphere.jsx`.
- `src/components/Icon.jsx`.
- `src/components/Modal.jsx`.
- `src/styles/admin.css`, `src/styles/designer.css`, `src/styles/livePreview.css`, `src/styles/pageDesign.css` e `src/styles/global.css`.
- `public/assets/locytech-hd.png` e `public/assets/locytech.png`.

## Modelo de dados / fluxo

`PageFields` associa rótulos e campos por prefixos de identificador. A otimização de logo é compartilhada; remoção invalida operações pendentes e desmontagem cancela leituras, evitando aplicar imagem ao cadastro errado. Cores usam seletor ou HEX de três ou seis dígitos, com ou sem #. O seletor e HEX de seis dígitos aplicam imediatamente; HEX curto é aplicado ao sair ou confirmar com Enter. Entrada inválida informa erro e não substitui a última cor válida.

`BrandAtmosphere` recebe logo, nome e fundo. `safeLogo` valida imagem. A logo padrão tratada possui fundo preto integrado no tema escuro por `mix-blend-mode: screen`; logos personalizadas preservam seu arquivo e transparência. `ResizeObserver` ajusta o canvas e limita escala de pixels. Animação, observador e eventos são limpos ao desmontar.

A logo padrão é acessada por `/assets/locytech-hd.png` para funcionar nas rotas do painel e da prévia. O original é preservado em `public/assets/locytech.png`. Ambos são arquivos locais deste projeto, não dependências da hospedagem do primeiro site.

### Tratamento original da logo

O asset foi restaurado pela ferramenta integrada de imagem, preservando pavão/circuito, sete penas, cores azul-ciano e amarelo e o texto LocyTech. A versão selecionada mantém fundo preto opaco para evitar falhas nas letras observadas nas tentativas transparentes. O arquivo original continua disponível para comparação. Esta documentação registra a origem do asset copiado, não uma nova edição de imagem.

`contrastText` escolhe preto ou branco conforme a luminância. `PageSurface` também verifica contraste de destaques textuais, preservando leitura sobre fundos claros ou escuros. O painel mantém superfícies escuras e usa as cores do cliente somente na identidade ou prévia.

`LivePreview` mantém o catálogo montado e oculto quando a tela ativa muda, preservando seu filtro. Resolve o detalhe pelo identificador no `page.products` atual, sem armazenar uma cópia antiga do produto. Remoção ou ocultação posterior encerra os detalhes com aviso; a inspeção administrativa explícita de um item já oculto informa esse estado. Identificadores de títulos usam `useId`, permitindo prévias lateral, ampliada e de produto sem colisões. A ampliação repassa o produto selecionado somente quando os detalhes estão ativos.

`ProductDetails` é apresentacional e recebe `onQuote` somente no modelo público. `ProductEditor` usa o mesmo conteúdo para exibir seu rascunho com `previewPage`, sem abrir outro diálogo ou formulário aninhado. Em telas estreitas, Dados do produto e Ver produto alternam as áreas; com largura suficiente, ambas aparecem lado a lado. O item novo mantém identificador estável, e título ausente é permitido na prévia, não no salvamento.

`Modal` usa `dialog`, trava a rolagem de fundo e permite Escape e clique fora. Seu nome acessível vem do título associado. Captura o elemento disparador antes dos efeitos dos filhos e, ao desmontar, restaura o foco sem rolar a página se o disparador ainda existir. A restauração aguarda a limpeza e não rouba o foco de outro diálogo aberto nem de um destino definido durante o fechamento. `Icon` é decorativo; ações possuem rótulos textuais.

## Regras críticas

- Reutilizar formulários, SVGs e diálogos existentes.
- Não importar código ou assets de outra pasta de projeto.
- Manter contraste, texto legível e alvos de toque de ao menos 44 pixels.
- Respeitar movimento reduzido e comportamento nativo do diálogo.
- Limpar leituras, eventos, observadores e bloqueios ao desmontar.
- Personalizar a página sem alterar a marca central: registrar somente os campos alterados em `identityOverrides`.
- Aplicar modelos e ajustes somente em `design`, sem substituir cores ou conteúdo.
- Manter a prévia e o modelo completo usando `PageSurface`.
- Reutilizar catálogo e detalhes; permitir navegação administrativa sem links externos, orçamento ou mutação dos dados.

## O que revisar antes de alterar

- Testar formulários de marca e página, vínculos e estados sem logo.
- Conferir teclado, foco, Escape, rolagem e clique fora.
- Conferir troca de logo com leitura pendente e movimento reduzido.
- Conferir cores válidas/invalidas, três e seis dígitos, galeria de 24 modelos e controles por teclado.
- Conferir navegação de prévia, filtros, foco dos títulos, ampliação, produto oculto/removido e detalhes durante a digitação.
- Testar celular e computador sem overflow horizontal.

## Código relacionado

- [Painel de páginas e marcas](../../src/admin/AdminApp.jsx)
- [Interface de marcas](../../src/admin/BrandViews.jsx)
- [Biblioteca e controles de visual](../../src/admin/PageDesignFields.jsx)
- [Renderizador compartilhado](../../src/components/PageSurface.jsx)
- [Prévia interativa administrativa](../../src/admin/LivePreview.jsx)
- [Detalhes compartilhados do produto](../../src/components/ProductDetails.jsx)
- [Estilos da prévia administrativa](../../src/styles/livePreview.css)
- [Presets e normalização](../../src/utils/pageDesign.js)
- [Estilos do designer](../../src/styles/designer.css)
- [Estilos dos modelos](../../src/styles/pageDesign.css)
- [Campos reutilizados](../../src/components/PageFields.jsx)
- [Formulário de produto](../../src/components/Editor.jsx)
- [Identidade da prévia](../../src/components/BrandAtmosphere.jsx)
- [Ícones](../../src/components/Icon.jsx)
- [Diálogo](../../src/components/Modal.jsx)
- [Estilos do painel](../../src/styles/admin.css)
- [Estilos da prévia](../../src/styles/global.css)
- [Logo original](../../public/assets/locytech.png)
- [Logo tratada](../../public/assets/locytech-hd.png)
