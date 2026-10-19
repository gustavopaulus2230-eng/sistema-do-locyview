# Catálogo e orçamento da prévia

## Objetivo

Configurar produtos dos clientes e testar sua apresentação no modelo deste painel independente. O catálogo do primeiro projeto LocyTech não é alterado ou sincronizado.

## Visão geral

A etapa Produtos permite criar, editar, ordenar, ocultar e remover itens. Em `/preview#p=`, `Products` abre após o clique em Nossos produtos. Filtros Todos, Landing pages e Sites mostram produtos habilitados. Cada cartão abre `ProductDetail` com descrição, itens e preço; Solicitar orçamento abre `QuoteDialog`.

O orçamento apenas prepara uma mensagem para copiar. WhatsApp aparece somente com destino válido configurado; e-mail depende de `mailto:`. Nenhuma mensagem é enviada automaticamente.

## Arquivos fonte de verdade

- `src/admin/AdminApp.jsx`: edição e operações do catálogo.
- `src/components/Editor.jsx`: formulário de produto.
- `src/pages/Products.jsx`: apresentação e filtros.
- `src/App.jsx`: detalhes e orçamento.
- `src/utils/pageState.js`: validação e destinos.

## Modelo de dados / fluxo

Produto contém `id`, `icon`, `category`, `title`, `description`, `note`, `price`, `features` e `enabled`. O limite é de 30 produtos e oito itens em `features` por produto. Alterações só persistem quando a página é salva; excluir um produto pede confirmação. Não há exclusão de marcas ou páginas nesta entrega.

O modelo LocyTech possui Landing page, Site institucional, Loja virtual, Site para profissionais e Página de links, todos com R$ 0,00. Novas páginas começam sem produtos. O zero não anuncia serviço gratuito: preços são ilustrativos e dependem do escopo. Cadastros são normalizados sem migrações dos preços antigos.

Produtos pertencem à página, não à marca central. Alterar nome, logo ou cores de uma marca não modifica catálogo, links, textos ou identificador da página.

Os dados do orçamento ficam temporariamente no diálogo, não no cadastro ou snapshot. O modelo de prévia não representa contratação, pagamento ou envio.

## Regras críticas

- Identificar preços como ilustrativos, inclusive R$ 0,00.
- Não exibir itens desativados nem oferecer seu orçamento.
- Não anunciar envio, contratação, integração ou publicação inexistentes.
- `quoteDestinations` aceita telefone válido de WhatsApp em `wa.me` ou `api.whatsapp.com/send`.
- Não salvar dados do solicitante no cadastro ou snapshot.
- Não propagar catálogo entre páginas por uma alteração de marca.

## O que revisar antes de alterar

- Criar e editar produto; ordenar, ocultar, remover e salvar página.
- Conferir filtros, contagens e catálogo vazio.
- Validar descrições, itens e preços nos detalhes.
- Testar campos do orçamento e aviso de que nada foi enviado.
- Testar celular, rolagem e fechamento por teclado.

## Código relacionado

- [Catálogo administrativo](../../src/admin/AdminApp.jsx)
- [Formulário de produto](../../src/components/Editor.jsx)
- [Cartões e filtros](../../src/pages/Products.jsx)
- [Detalhes e orçamento](../../src/App.jsx)
- [Produtos e destinos](../../src/utils/pageState.js)
- [Diálogo nativo](../../src/components/Modal.jsx)
