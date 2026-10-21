# LocyView — Painel de criação

Sistema independente para cadastrar marcas e configurar páginas dos clientes com logo, cores, nome, textos, links e produtos. Esta entrega é somente front-end; os dados ficam no navegador atual, sem servidor, API, autenticação ou sincronização.

## Dois projetos separados

O primeiro projeto é a página de links LocyTech, mantida em `locytech-bio`, com seu próprio site e repositório GitHub. Este segundo projeto está em `locyview-painel` e é exclusivamente o painel administrativo independente.

O painel possui sua própria identidade de hospedagem: [LocyView — Painel](https://locyview-painel.locytech.chatgpt.site/). O item “Ver projeto de links” abre o primeiro site por um link externo comum; não existe integração automática entre os projetos.

O repositório destinado a este painel é [sistema-do-locyview](https://github.com/gustavopaulus2230-eng/sistema-do-locyview). O repositório do primeiro projeto permanece separado. Cadastros e cópias de recuperação armazenados no navegador não fazem parte do código enviado ao GitHub.

## Funcionalidades

- Páginas dos clientes: pesquisa, filtros e cadastro em quatro etapas.
- Marcas: nome, logo e três cores em um cadastro central.
- Vínculo de páginas à marca, com edição livre e atualização local somente dos campos ainda herdados.
- Restauração explícita da identidade da marca sem mudar conteúdo ou visual.
- Modelo base em destaque e abas Modelos, Ajustes e Organização, com 24 modelos distintos, seis composições e controles finos.
- Cores livres, seletor e HEX funcionais, com prévia imediata e contraste calculado.
- Textos, identificador, assinatura, links e produtos próprios de cada página.
- Catálogo com edição, ordenação, visibilidade e remoção de itens.
- Ajustar preço direto em cada produto, com Preço fixo, A partir de, Sob consulta ou Texto personalizado, validação em reais e prévia ao vivo.
- Prévia interativa de página, catálogo e detalhes, antes de salvar ou completar a identidade, com ampliação para celular e computador.
- Ver catálogo e Ver produto diretos, além de detalhes do produto acompanhando a digitação no formulário.
- Barra de ações para visualizar/salvar e geração separada de link de demonstração com uma versão fixa da página.
- Salvamento manual no navegador, com validação e avisos de falha.
- Primeiro acesso sem cadastros de demonstração, limpeza explícita com confirmação e cópia local de recuperação.
- Proteção contra gravação de abas desatualizadas após alterações de dados em outra aba.

O endereço principal `/` abre o painel; `/admin` é alias. `/preview#p=` abre somente o modelo de demonstração, mantido neste projeto. Não é uma rota do primeiro site nem publicação centralizada de cliente.

## Executar

Com Node.js compatível com Vite (18, 20 ou 22 e superiores), instale as dependências pela raiz com `npm --prefix front ci`. Na raiz deste projeto:

- `npm run dev`: prévia de desenvolvimento em `http://127.0.0.1:4174/`.
- `npm run build`: gera `build/` na raiz.
- `npm run preview`: serve a construção na porta 4174.
- `npm test`: executa as regressões locais, sem acessar cadastros do navegador ou servidor.

## Armazenamento e limites

A versão administrativa `locyview-admin:v2` guarda marcas e páginas juntas, atomicamente. Há limite de 50 marcas e 50 páginas neste navegador. Sem estado salvo, o painel começa vazio. O modelo público de demonstração LocyTech não cria cadastros administrativos nem inventa clientes, vendas ou acessos.

Registros legados versão 1 continuam com suas identidades e sem vínculo automático. Dados vazios salvos continuam vazios. Conteúdo inválido ou armazenamento bloqueado não é substituído; erro ao salvar não apresenta sucesso parcial.

Para zerar os cadastros locais, abra Como funciona → Limpar cadastros de teste e confirme. A limpeza remove todas as páginas, seus produtos e marcas deste navegador, mantendo o sistema e seus modelos. Uma cópia local protegida antes da limpeza permite Restaurar cadastros anteriores enquanto o painel estiver vazio. Cadastrar novos dados bloqueia a restauração para não sobrescrevê-los; uma nova limpeza com dados substitui a cópia anterior. A versão 2 vazia impede retorno automático de registros legados. Publicar ou atualizar o sistema não apaga dados existentes automaticamente.

Se outra aba alterar os cadastros, o painel avisa e bloqueia uma gravação desatualizada. Use Atualizar cadastros para carregar os dados atuais; edições pendentes exigem confirmação antes do descarte. Não há sincronização automática.

Editar uma marca atualiza somente nome, logo e cores ainda herdados pelas páginas locais vinculadas. Campos personalizados são protegidos por `identityOverrides`. Não altera o primeiro site, outros aparelhos ou links de prévia antigos. Textos, identificadores, links, produtos, visual e dados administrativos de cada página são preservados. Aplicar modelo altera somente os ajustes de `design`, sem resetar nome, logo, paleta ou a prioridade dos canais. Dados antigos recebem padrões compatíveis, sem apagar cadastros.

A prévia administrativa usa o rascunho ao vivo, permite navegar entre página, catálogo e detalhes e não altera cadastros. Contatos externos mostram um aviso sem abrir outra plataforma. Editar um produto mostra sua apresentação antes de aplicar os dados; Salvar produto atualiza o rascunho, e Salvar página continua sendo a gravação local.

Ajustar preço abre o mesmo formulário focado somente no valor. Aplicar preço altera o rascunho; Salvar página guarda o ajuste neste navegador. Zero é aceito, entradas inválidas são rejeitadas e condições personalizadas são preservadas. Os preços continuam em texto, sem migração dos cadastros existentes.

O link de demonstração contém dados públicos da versão gerada. Inclui o visual escolhido, mas não nome administrativo, datas, vínculo interno, `identityOverrides` ou orçamento. Não atualiza sozinho, não cria endereço curto e não permite revogação. Não use o painel para informações sigilosas.

A rota administrativa não é uma proteção por login. Não há exclusão individual de marcas ou páginas, envio de mensagens, cadastro centralizado ou integração com servidor. A limpeza completa é uma ação local explícita; ela não apaga snapshots antigos, dados de outros aparelhos ou o primeiro projeto. A cópia de recuperação também fica somente neste navegador.

## Documentação

- [Orientações do front](front/README.md)
- [Arquitetura](front/docs/arquitetura.md)
- [Painel e páginas](front/docs/telas/painel-locyview.md)
- [Marcas](front/docs/telas/marcas.md)
- [Personalização](front/docs/telas/personalizacao.md)
- [Visual e 24 modelos](front/docs/telas/visual-da-pagina.md)
- [Modelo de página](front/docs/telas/pagina-de-links.md)
- [Catálogo](front/docs/telas/catalogo.md)
- [Componentes](front/docs/componentes/interface.md)

## Código relacionado

- [Entrada do painel e prévia](front/src/index.jsx)
- [Painel de páginas e marcas](front/src/admin/AdminApp.jsx)
- [Interface de marcas](front/src/admin/BrandViews.jsx)
- [Designer de páginas](front/src/admin/PageDesignFields.jsx)
- [Prévia interativa](front/src/admin/LivePreview.jsx)
- [Detalhes compartilhados do produto](front/src/components/ProductDetails.jsx)
- [Campos compartilhados de preço](front/src/components/ProductPriceFields.jsx)
- [Validação e formatação de preço](front/src/utils/productPricing.js)
- [Estilos da prévia e do editor de produto](front/src/styles/livePreview.css)
- [Modelos e validação](front/src/utils/pageDesign.js)
- [Renderizador compartilhado](front/src/components/PageSurface.jsx)
- [Estado administrativo](front/src/utils/adminState.js)
- [Campos de configuração](front/src/components/PageFields.jsx)
- [Modelo de prévia](front/src/App.jsx)
- [Comandos](package.json)
- [Regressões automatizadas](front/tests/regression.mjs)
- [Publicação independente](.openai/hosting.json)
