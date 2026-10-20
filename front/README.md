# Front-end do painel LocyView

Sistema independente em React para cadastrar marcas e páginas dos clientes. O primeiro projeto `locytech-bio` não faz parte desta aplicação. A cópia do modelo de página é mantida localmente para prévia, sem importar código ou atualizar o primeiro site.

A entrega contém somente front-end: não há servidor, API, login, autenticação, banco de dados ou sincronização entre aparelhos.

## Executar

Em `front/`, execute `npm install` na preparação inicial e `npm run dev` para abrir `http://127.0.0.1:4174/`.

`npm run build` gera `../build/`, na raiz do projeto. `npm run preview` serve a construção na porta 4174. Não edite build, dependências ou arquivos de trava manualmente.

## Rotas e funcionalidades

- `/`, `/admin` e `/admin/`: painel de páginas e marcas.
- `/preview#p=`: demonstração independente de uma configuração de cliente.
- Páginas: pesquisa, filtros, quatro etapas de cadastro e prévia.
- Marcas: cadastro de nome, logo e três cores, com vínculo às páginas.
- Nome, logo e cores continuam editáveis nas páginas vinculadas; alterações de marca atualizam somente os campos ainda herdados.
- Usar identidade da marca restaura a herança, sem mudar textos, links, produtos ou visual.
- Aparência com 24 modelos reais, filtros, ajustes finos e ordem dos quatro canais, com prévia imediata.
- Modelos preservam marca, paleta e conteúdo; fundos claros ou escuros mantêm contraste calculado.
- Textos, identificador, assinatura, links e catálogo continuam específicos da página.
- Catálogo: até 30 produtos por página, com edição, ordenação, visibilidade e remoção confirmada.
- Interface responsiva por largura disponível, com teclado e controles acessíveis.

## Dados e limitações

O conjunto `locyview-admin:v2` guarda marcas e páginas atomicamente no navegador da origem atual. Limites: 50 marcas e 50 páginas. O primeiro acesso contém somente marca LocyTech e sua página modelo. Novos cadastros não inventam conteúdo ou clientes. Não há exclusão de marcas ou páginas nesta entrega.

A leitura legada versão 1 preserva identidades de páginas sem vinculá-las automaticamente a marcas. Dados versão 2 sem `identityOverrides` recebem lista vazia, e páginas sem `design` recebem o visual padrão, sem apagar cadastros ou mudar chaves. Uma lista vazia salva permanece vazia. Dados inválidos e armazenamento bloqueado impedem substituição; quota ou falha ao gravar mantém a edição aberta.

A prévia contém dados públicos sanitizados e visual normalizado, não nome administrativo, datas, vínculo interno ou `identityOverrides`. O link guarda uma versão, não cria rota curta, não acompanha edições futuras e não tem revogação. A atualização de uma marca não altera snapshots antigos. Não incluir dados sigilosos.

A demonstração usa quatro atalhos e catálogo aberto por clique. Os preços do modelo LocyTech são ilustrativos, em R$ 0,00, sem oferecer serviço gratuito. O orçamento apenas prepara texto, sem envio automático.

A hospedagem deste sistema é `https://locyview-painel.locytech.chatgpt.site`. “Ver projeto de links” abre o primeiro site externamente, sem integração. Não há novo destino GitHub configurado; o repositório anteriormente fornecido pertence ao primeiro projeto.

## Documentação

- [Arquitetura](docs/arquitetura.md)
- [Painel e páginas](docs/telas/painel-locyview.md)
- [Marcas](docs/telas/marcas.md)
- [Personalização](docs/telas/personalizacao.md)
- [Visual e 24 modelos](docs/telas/visual-da-pagina.md)
- [Modelo de página](docs/telas/pagina-de-links.md)
- [Catálogo](docs/telas/catalogo.md)
- [Componentes](docs/componentes/interface.md)

## Código relacionado

- [Entrada](src/index.jsx)
- [Painel de páginas e marcas](src/admin/AdminApp.jsx)
- [Interface de marcas](src/admin/BrandViews.jsx)
- [Designer de páginas](src/admin/PageDesignFields.jsx)
- [Modelos e normalização](src/utils/pageDesign.js)
- [Renderizador compartilhado](src/components/PageSurface.jsx)
- [Estilos da biblioteca](src/styles/designer.css)
- [Estilos dos modelos](src/styles/pageDesign.css)
- [Estado administrativo](src/utils/adminState.js)
- [Campos reutilizados](src/components/PageFields.jsx)
- [Modelo de prévia](src/App.jsx)
- [Snapshot público](src/utils/pageState.js)
- [Estilos do painel](src/styles/admin.css)
- [Estilos do modelo](src/styles/global.css)
- [Dependências e comandos](package.json)
