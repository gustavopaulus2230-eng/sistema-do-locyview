# Componentes de interface

## Objetivo

Padronizar formulários e diálogos do painel LocyView independente e do seu modelo de prévia. Componentes e assets são mantidos nesta pasta, sem importar código de `locytech-bio`.

## Visão geral

`AdminApp` coordena os campos de `PageFields`, o formulário `ProductEditor`, ícones SVG de `Icon` e diálogo nativo de `Modal`. `BrandViews` concentra listagem, formulário e prévia das marcas. Os mesmos campos de logo e cores atendem páginas sem vínculo e marcas centrais, sem duplicar upload ou validação. Parâmetros de `BrandFields` ocultam campos exclusivos de página no formulário da marca; `ColorsFields` oculta a assinatura nesse contexto e bloqueia cores em páginas vinculadas.

No modelo `/preview`, `BrandAtmosphere` mostra a logo sobre estrelas e grade discreta. A referência LocyTech é substituível pela marca do cliente. A logo não tem efeito pontilhado; apenas as estrelas têm movimento, respeitando movimento reduzido. Sem imagem válida aparece monograma.

## Arquivos fonte de verdade

- `src/admin/AdminApp.jsx`.
- `src/admin/BrandViews.jsx`.
- `src/components/PageFields.jsx`.
- `src/components/Editor.jsx`.
- `src/components/BrandAtmosphere.jsx`.
- `src/components/Icon.jsx`.
- `src/components/Modal.jsx`.
- `src/styles/admin.css` e `src/styles/global.css`.
- `public/assets/locytech-hd.png` e `public/assets/locytech.png`.

## Modelo de dados / fluxo

`PageFields` associa rótulos e campos por prefixos de identificador. A otimização de logo é compartilhada; remoção invalida operações pendentes e desmontagem cancela leituras, evitando aplicar imagem ao cadastro errado. Cores usam seletor ou HEX; entrada incompleta retorna à última cor válida ao perder foco.

`BrandAtmosphere` recebe logo, nome e fundo. `safeLogo` valida imagem. A logo padrão tratada possui fundo preto integrado no tema escuro por `mix-blend-mode: screen`; logos personalizadas preservam seu arquivo e transparência. `ResizeObserver` ajusta o canvas e limita escala de pixels. Animação, observador e eventos são limpos ao desmontar.

A logo padrão é acessada por `/assets/locytech-hd.png` para funcionar nas rotas do painel e da prévia. O original é preservado em `public/assets/locytech.png`. Ambos são arquivos locais deste projeto, não dependências da hospedagem do primeiro site.

### Tratamento original da logo

O asset foi restaurado pela ferramenta integrada de imagem, preservando pavão/circuito, sete penas, cores azul-ciano e amarelo e o texto LocyTech. A versão selecionada mantém fundo preto opaco para evitar falhas nas letras observadas nas tentativas transparentes. O arquivo original continua disponível para comparação. Esta documentação registra a origem do asset copiado, não uma nova edição de imagem.

`contrastText` escolhe preto ou branco conforme a luminância. O painel mantém superfícies escuras e usa as cores do cliente somente no contexto apropriado de sua identidade ou prévia.

`Modal` usa `dialog`, trava a rolagem de fundo e permite Escape e clique fora. Seu nome acessível vem do título associado. `Icon` é decorativo; ações possuem rótulos textuais.

## Regras críticas

- Reutilizar formulários, SVGs e diálogos existentes.
- Não importar código ou assets de outra pasta de projeto.
- Manter contraste, texto legível e alvos de toque de ao menos 44 pixels.
- Respeitar movimento reduzido e comportamento nativo do diálogo.
- Limpar leituras, eventos, observadores e bloqueios ao desmontar.
- Não permitir que o formulário específico da página sobrescreva silenciosamente a marca central.

## O que revisar antes de alterar

- Testar formulários de marca e página, vínculos e estados sem logo.
- Conferir teclado, foco, Escape, rolagem e clique fora.
- Conferir troca de logo com leitura pendente e movimento reduzido.
- Testar celular e computador sem overflow horizontal.

## Código relacionado

- [Painel de páginas e marcas](../../src/admin/AdminApp.jsx)
- [Interface de marcas](../../src/admin/BrandViews.jsx)
- [Campos reutilizados](../../src/components/PageFields.jsx)
- [Formulário de produto](../../src/components/Editor.jsx)
- [Identidade da prévia](../../src/components/BrandAtmosphere.jsx)
- [Ícones](../../src/components/Icon.jsx)
- [Diálogo](../../src/components/Modal.jsx)
- [Estilos do painel](../../src/styles/admin.css)
- [Estilos da prévia](../../src/styles/global.css)
- [Logo original](../../public/assets/locytech.png)
- [Logo tratada](../../public/assets/locytech-hd.png)
