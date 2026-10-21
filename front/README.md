# Front-end do painel LocyView

Sistema independente em React para cadastrar marcas e páginas dos clientes. O primeiro projeto `locytech-bio` não faz parte desta aplicação. A cópia do modelo de página é mantida localmente para prévia, sem importar código ou atualizar o primeiro site.

A entrega contém somente front-end: não há servidor, API, login, autenticação, banco de dados ou sincronização entre aparelhos.

## Executar

Com Node.js compatível com Vite (18, 20 ou 22 e superiores), em `front/`, execute `npm ci` na preparação inicial e `npm run dev` para abrir `http://127.0.0.1:4174/`. Pela raiz, a instalação equivalente é `npm --prefix front ci`.

`npm run build` gera `../build/`, na raiz do projeto. `npm run preview` serve a construção na porta 4174. Não edite build, dependências ou arquivos de trava manualmente.

Na raiz do projeto, `npm test` executa `front/tests/regression.mjs`, uma suíte local que não acessa o armazenamento do navegador do usuário ou serviços externos.

## Rotas e funcionalidades

- `/`, `/admin` e `/admin/`: painel de páginas e marcas.
- `/preview#p=`: demonstração independente de uma configuração de cliente.
- Páginas: pesquisa, filtros, quatro etapas de cadastro e barra de ações para visualizar e salvar.
- Marcas: cadastro de nome, logo e três cores, com vínculo às páginas.
- Nome, logo e cores continuam editáveis nas páginas vinculadas; alterações de marca atualizam somente os campos ainda herdados.
- Usar identidade da marca restaura a herança, sem mudar textos, links, produtos ou visual.
- Aparência com modelo base em destaque e três abas: Modelos, Ajustes e Organização; são 24 modelos, filtros, ajustes finos e ordem dos quatro canais.
- Modelos preservam marca, paleta e conteúdo; fundos claros ou escuros mantêm contraste calculado.
- Textos, identificador, assinatura, links e catálogo continuam específicos da página.
- Catálogo: até 30 produtos por página, com edição, ordenação, visibilidade e remoção confirmada.
- Ajustar preço por produto, com quatro modos, validação em reais, zero e condições personalizadas; os mesmos campos estão na edição completa.
- Prévia interativa de página, catálogo e detalhes, lateral ou ampliada nas larguras Celular e Computador, antes de salvar ou completar os campos obrigatórios.
- Ver catálogo/Ver produto abrem o resultado diretamente; o formulário de produto também acompanha a digitação com seus detalhes reais.
- Interface responsiva por largura disponível, com teclado e controles acessíveis.
- Painel inicialmente vazio, limpeza explícita com confirmação e recuperação local, além de bloqueio de gravações de abas desatualizadas.

## Dados e limitações

O conjunto `locyview-admin:v2` guarda marcas e páginas atomicamente no navegador da origem atual. Limites: 50 marcas e 50 páginas. Sem estado salvo, o painel começa sem marcas ou páginas; o modelo público LocyTech não é cadastrado automaticamente. Novos cadastros não inventam conteúdo ou clientes. Não há exclusão individual de marcas ou páginas.

A leitura legada versão 1 preserva identidades de páginas sem vinculá-las automaticamente a marcas. Dados versão 2 sem `identityOverrides` recebem lista vazia, e páginas sem `design` recebem o visual padrão, sem apagar cadastros ou mudar chaves. Uma lista vazia salva permanece vazia. Dados inválidos e armazenamento bloqueado impedem substituição; quota ou falha ao gravar mantém a edição aberta.

Como funciona → Limpar cadastros de teste solicita confirmação para remover todas as marcas, páginas e seus produtos deste navegador. Antes de gravar a versão 2 vazia, guarda uma cópia em `locyview-admin:recovery:v1`. Falha na proteção ou gravação impede anunciar sucesso. Restaurar cadastros anteriores só é permitido no painel vazio; não substitui novos cadastros. Nova limpeza de dados não vazios substitui a cópia anterior, mas um estado já vazio mantém a recuperação disponível. O legado permanece guardado sem reaparecer pelo fallback. Publicar ou atualizar o aplicativo nunca executa a limpeza automaticamente.

Salvar, limpar e restaurar usam o `storageToken` da leitura para detectar mudanças feitas em outra aba. Uma gravação desatualizada é bloqueada. O aviso oferece Atualizar cadastros e pede confirmação para descartar alterações pendentes, sem sincronização silenciosa. Dados do navegador e recuperação não são enviados ao GitHub, servidor, primeiro projeto ou outros aparelhos; snapshots antigos não são apagados pela limpeza.

A prévia administrativa acompanha o rascunho atual, permite navegar e filtrar e não grava dados. Contatos externos são apenas inspecionados por aviso; não há envio ou orçamento nessa superfície. No editor de produto, Salvar produto aplica o item ao rascunho da página, mas a gravação local ainda depende de Salvar página.

Ajustar preço reutiliza o editor de produto focado nos controles de Preço fixo, A partir de, Sob consulta e Texto personalizado, com resumo e prévia completa. Aplicar preço atualiza somente o rascunho. Entrada inválida impede a aplicação e conserva o último valor válido nos detalhes. `product.price` permanece texto de até 40 caracteres, preservando condições anteriores sem migração de esquema ou armazenamento.

Gerar link é uma ação separada. O snapshot contém dados públicos sanitizados e visual normalizado, não nome administrativo, datas, vínculo interno ou `identityOverrides`. O link guarda uma versão, não cria rota curta, não acompanha edições futuras e não tem revogação. A atualização de uma marca não altera snapshots antigos. Não incluir dados sigilosos.

Aplicar modelo preserva conteúdo, paleta e a prioridade dos canais. A prévia ao vivo e o snapshot compartilham renderização de página, catálogo e detalhes; somente o snapshot mantém os contatos validados como links externos reais.

A demonstração usa quatro atalhos e catálogo aberto por clique. Os preços do modelo LocyTech são ilustrativos, em R$ 0,00, sem oferecer serviço gratuito. O orçamento apenas prepara texto, sem envio automático.

A hospedagem deste sistema é `https://locyview-painel.locytech.chatgpt.site`. “Ver projeto de links” abre o primeiro site externamente, sem integração. O destino GitHub autorizado do painel é [sistema-do-locyview](https://github.com/gustavopaulus2230-eng/sistema-do-locyview); o repositório anteriormente fornecido pertence ao primeiro projeto e permanece separado.

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
- [Prévia interativa](src/admin/LivePreview.jsx)
- [Detalhes compartilhados do produto](src/components/ProductDetails.jsx)
- [Campos compartilhados de preço](src/components/ProductPriceFields.jsx)
- [Validação e formatação de preço](src/utils/productPricing.js)
- [Estilos da prévia e do editor de produto](src/styles/livePreview.css)
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
- [Regressões automatizadas](tests/regression.mjs)
