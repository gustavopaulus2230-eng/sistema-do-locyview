# Catálogo e orçamento da prévia

## Objetivo

Configurar produtos dos clientes e testar sua apresentação no modelo deste painel independente. O catálogo do primeiro projeto LocyTech não é alterado ou sincronizado.

## Visão geral

A etapa Produtos permite criar, editar, ordenar, ocultar e remover itens. Ver catálogo e Ver produto abrem diretamente a prévia administrativa, sem gerar link ou exigir cadastro completo. A prévia lateral também navega de Nossos produtos para o catálogo e os detalhes. Filtros Todos, Landing pages e Sites mostram produtos habilitados.

`ProductDetails` apresenta descrição, itens e preço tanto no painel quanto em `/preview#p=`. No snapshot, cada cartão abre os detalhes em um diálogo e Solicitar orçamento abre `QuoteDialog`. A prévia administrativa usa detalhes dentro da própria superfície, sem outro diálogo nem ação de orçamento.

O orçamento apenas prepara uma mensagem para copiar. WhatsApp aparece somente com destino válido configurado; e-mail depende de `mailto:`. Nenhuma mensagem é enviada automaticamente.

## Arquivos fonte de verdade

- `src/admin/AdminApp.jsx`: edição e operações do catálogo.
- `src/components/Editor.jsx`: formulário de produto.
- `src/pages/Products.jsx`: apresentação e filtros.
- `src/admin/LivePreview.jsx`: catálogo e detalhes administrativos.
- `src/components/ProductDetails.jsx`: conteúdo compartilhado dos detalhes.
- `src/App.jsx`: detalhes e orçamento.
- `src/utils/pageState.js`: validação e destinos.

## Modelo de dados / fluxo

Produto contém `id`, `icon`, `category`, `title`, `description`, `note`, `price`, `features` e `enabled`. O limite é de 30 produtos e oito itens em `features` por produto. Alterações só persistem quando a página é salva; excluir um produto pede confirmação. Não há exclusão de marcas ou páginas nesta entrega.

`ProductEditor` aceita `previewPage` e mostra o produto em edição com o tema da página. A apresentação acompanha título, descrição, categoria, ícone, valor, complemento e itens, mesmo antes de salvar e antes de haver título. O identificador do novo item fica estável durante a edição. Salvar produto valida o título e aplica o item ao rascunho; somente Salvar página grava o catálogo no navegador.

Cancelar ou fechar o formulário de produto descarta a edição ainda não aplicada. A prévia em si não adiciona o produto ao catálogo nem grava dados.

Na prévia administrativa, o catálogo permanece montado ao navegar para detalhes, preservando o filtro escolhido. Alterar um item atualiza sua apresentação pelo identificador. Ocultar ou remover um produto que estava em detalhes retorna ao catálogo com aviso. Ver produto pode inspecionar explicitamente um item já oculto, com a indicação Produto oculto no catálogo; isso não o inclui no catálogo público.

O modelo LocyTech possui Landing page, Site institucional, Loja virtual, Site para profissionais e Página de links, todos com R$ 0,00. Novas páginas começam sem produtos. O zero não anuncia serviço gratuito: preços são ilustrativos e dependem do escopo. Cadastros são normalizados sem migrações dos preços antigos.

Produtos pertencem à página, não à marca central. Alterar nome, logo ou cores de uma marca não modifica catálogo, links, textos, identificador ou visual da página. A biblioteca de modelos altera só `design`, preservando o catálogo. Nossos produtos pode mudar de posição entre os quatro atalhos conforme a ordem configurada, mas continua abrindo o catálogo somente por clique.

Os dados do orçamento ficam temporariamente no diálogo, não no cadastro ou snapshot. O modelo de prévia não representa contratação, pagamento ou envio.

## Regras críticas

- Identificar preços como ilustrativos, inclusive R$ 0,00.
- Não exibir itens desativados no catálogo público nem oferecer seu orçamento. A inspeção administrativa explícita de um item oculto precisa indicar esse estado.
- Não enviar contatos ou orçamento pela prévia administrativa; ela só navega e inspeciona o rascunho.
- Não anunciar envio, contratação, integração ou publicação inexistentes.
- `quoteDestinations` aceita telefone válido de WhatsApp em `wa.me` ou `api.whatsapp.com/send`.
- Não salvar dados do solicitante no cadastro ou snapshot.
- Não propagar catálogo entre páginas por uma alteração de marca ou escolha de modelo visual.

## O que revisar antes de alterar

- Criar e editar produto; ordenar, ocultar, remover e salvar página.
- Conferir filtros, contagens e catálogo vazio.
- Validar descrições, itens e preços nos detalhes.
- Conferir o produto durante a digitação, alternar Dados do produto/Ver produto no celular e validar título ao salvar.
- Conferir filtro preservado ao voltar dos detalhes, item oculto com aviso e item removido sem detalhe antigo.
- Testar campos do orçamento e aviso de que nada foi enviado.
- Testar celular, rolagem e fechamento por teclado.

## Código relacionado

- [Catálogo administrativo](../../src/admin/AdminApp.jsx)
- [Formulário de produto](../../src/components/Editor.jsx)
- [Cartões e filtros](../../src/pages/Products.jsx)
- [Prévia administrativa de catálogo e detalhes](../../src/admin/LivePreview.jsx)
- [Conteúdo compartilhado dos detalhes](../../src/components/ProductDetails.jsx)
- [Estilos da prévia e do editor de produto](../../src/styles/livePreview.css)
- [Detalhes e orçamento](../../src/App.jsx)
- [Produtos e destinos](../../src/utils/pageState.js)
- [Diálogo nativo](../../src/components/Modal.jsx)
