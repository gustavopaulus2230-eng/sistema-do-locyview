# LocyView — Painel de criação

Sistema independente para cadastrar marcas e configurar páginas dos clientes com logo, cores, nome, textos, links e produtos. Esta entrega é somente front-end; os dados ficam no navegador atual, sem servidor, API, autenticação ou sincronização.

## Dois projetos separados

O primeiro projeto é a página de links LocyTech, mantida em `locytech-bio`, com seu próprio site e repositório GitHub. Este segundo projeto está em `locyview-painel` e é exclusivamente o painel administrativo independente.

O painel possui sua própria identidade de hospedagem: [LocyView — Painel](https://locyview-painel.locytech.chatgpt.site/). O item “Ver projeto de links” abre o primeiro site por um link externo comum; não existe integração automática entre os projetos.

Não há novo destino GitHub configurado para este painel. O repositório fornecido anteriormente não deve ser reutilizado para substituir o primeiro projeto.

## Funcionalidades

- Páginas dos clientes: pesquisa, filtros e cadastro em quatro etapas.
- Marcas: nome, logo e três cores em um cadastro central.
- Vínculo de páginas à marca, com atualização local de nome, logo e cores.
- Textos, identificador, assinatura, links e produtos próprios de cada página.
- Catálogo com edição, ordenação, visibilidade e remoção de itens.
- Prévia responsiva e link de demonstração com uma versão da página.
- Salvamento manual no navegador, com validação e avisos de falha.

O endereço principal `/` abre o painel; `/admin` é alias. `/preview#p=` abre somente o modelo de demonstração, mantido neste projeto. Não é uma rota do primeiro site nem publicação centralizada de cliente.

## Executar

Instale as dependências em `front/` com `npm install`. Na raiz deste projeto:

- `npm run dev`: prévia de desenvolvimento em `http://127.0.0.1:4174/`.
- `npm run build`: gera `build/` na raiz.
- `npm run preview`: serve a construção na porta 4174.

## Armazenamento e limites

A versão administrativa `locyview-admin:v2` guarda marcas e páginas juntas, atomicamente. Há limite de 50 marcas e 50 páginas neste navegador. O primeiro acesso possui somente marca LocyTech e página modelo vinculada, sem inventar clientes, vendas ou acessos.

Registros legados versão 1 continuam com suas identidades e sem vínculo automático. Dados vazios salvos continuam vazios. Conteúdo inválido ou armazenamento bloqueado não é substituído; erro ao salvar não apresenta sucesso parcial.

Editar uma marca atualiza somente nome, logo e cores das páginas locais vinculadas. Não altera o primeiro site, outros aparelhos ou links de prévia antigos. Textos, identificadores, links, produtos e dados administrativos de cada página são preservados.

O link de demonstração contém dados públicos da versão gerada. Não inclui nome administrativo, datas, vínculo interno ou orçamento. Não atualiza sozinho, não cria endereço curto e não permite revogação. Não use o painel para informações sigilosas.

A rota administrativa não é uma proteção por login. Não há exclusão de marcas ou páginas nesta entrega, envio de mensagens, cadastro centralizado ou integração com servidor.

## Documentação

- [Orientações do front](front/README.md)
- [Arquitetura](front/docs/arquitetura.md)
- [Painel e páginas](front/docs/telas/painel-locyview.md)
- [Marcas](front/docs/telas/marcas.md)
- [Personalização](front/docs/telas/personalizacao.md)
- [Modelo de página](front/docs/telas/pagina-de-links.md)
- [Catálogo](front/docs/telas/catalogo.md)
- [Componentes](front/docs/componentes/interface.md)

## Código relacionado

- [Entrada do painel e prévia](front/src/index.jsx)
- [Painel de páginas e marcas](front/src/admin/AdminApp.jsx)
- [Interface de marcas](front/src/admin/BrandViews.jsx)
- [Estado administrativo](front/src/utils/adminState.js)
- [Campos de configuração](front/src/components/PageFields.jsx)
- [Modelo de prévia](front/src/App.jsx)
- [Comandos](package.json)
- [Publicação independente](.openai/hosting.json)
