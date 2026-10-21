# Personalização das páginas dos clientes

## Objetivo

Configurar marcas, textos, links e produtos pelo painel LocyView independente. A demonstração resultante é um modelo deste sistema, não uma alteração do primeiro site LocyTech.

## Visão geral

`AdminApp` organiza o cadastro de página em Identidade, Aparência, Links e Produtos, com barra de ações para visualizar e salvar. `PageFields` concentra campos de marca, textos, cores e canais. `ProductEditor` cria e edita produtos e mostra seus detalhes em tempo real sem duplicar a apresentação.

Marcas são cadastradas no item Marcas do menu. Ao vincular uma página, nome, logo e três cores começam com a identidade central e continuam editáveis livremente. Cada campo alterado é protegido por `identityOverrides`; campos ainda herdados acompanham a marca. Textos, identificador, assinatura, links, produtos e visual continuam pertencendo à página. Veja o domínio [Marcas](marcas.md) antes de alterar esse vínculo.

Ver prévia abre diretamente um diálogo interativo com opções Celular e Computador, sem exigir identidade completa ou salvamento. A prévia lateral acompanha o mesmo rascunho e permite navegar entre Página, Produtos e detalhes, sem abrir contatos externos. Gerar link é separado: o modelo autocontido abre em `/preview#p=`, sem dados administrativos e sem controles de edição de `App`. O antigo `Editor` permanece como apoio do modelo, não como fluxo principal deste sistema.

## Arquivos fonte de verdade

- `src/admin/AdminApp.jsx`.
- `src/components/PageFields.jsx`.
- `src/components/Editor.jsx`.
- `src/admin/LivePreview.jsx`.
- `src/components/ProductDetails.jsx`.
- `src/utils/adminState.js`.
- `src/utils/pageState.js`.

## Modelo de dados / fluxo

Na etapa Aparência, [Visual e modelos](visual-da-pagina.md) oferece destaque do modelo base e as abas Modelos, Ajustes e Organização. São 24 modelos, seis composições e controles finos. Aplicar um modelo altera só `design`, preservando marca, cores, conteúdo e a prioridade dos canais. A prévia e o link gerado usam `PageSurface`, `Hub`, `Products` e `ProductDetails` compartilhados.

Editar atualiza a prévia e marca alterações pendentes; Salvar página ou Salvar marca grava manualmente no armazenamento administrativo versão 2 deste domínio. Marcas e páginas são salvas juntas. Falhas são informadas, preservam a edição e não enviam nada à API ou ao primeiro projeto.

O editor de produto mantém seu rascunho até Salvar produto. Com `previewPage`, os detalhes refletem o que está sendo digitado, inclusive em um item novo ainda sem título. Essa aplicação ainda não grava a página: Salvar página continua sendo a ação de persistência. Ver catálogo e Ver produto permitem conferir os itens já aplicados ao rascunho.

A logo aceita PNG, JPEG e WebP de até 1,5 MB. `optimizeLogo` limita uploads a 400 pixels no maior lado e converte para WebP. A referência padrão é servida em sua resolução original. As cores alteram fundo, destaques e botões sem recolorir a logo. HEX de três ou seis dígitos são aceitos; seletor e HEX de seis dígitos atualizam a prévia imediatamente, enquanto HEX curto confirma ao sair ou pressionar Enter. Entrada inválida informa erro, sem aplicar o valor incorreto. `PageSurface` calcula contraste para fundos e cartões claros ou escuros. Cada catálogo aceita até 30 produtos e oito itens em `features` por produto.

`publicSnapshot` inclui somente configuração pública, produtos habilitados e URLs validadas. UTF-8 é preservado. `decodeSnapshot` valida antes de normalizar. Links inválidos não carregam cadastros administrativos ou rascunhos locais.

O painel usa `migrateDefaults: false`; novos snapshots incluem `preserveConfiguredValues: true`. Preços, textos, cores e links de clientes não são substituídos por migrações de padrões LocyTech. Os contatos predefinidos pertencem apenas ao modelo inicial; páginas novas começam com destinos vazios.

## Regras críticas

- Identificador local não cria rota curta ou domínio.
- Não apresentar a demonstração como publicação ou integração com o primeiro site.
- Marcas propagam apenas nome, logo e três cores ainda herdados; manter livre edição da página e restauração explícita da identidade.
- Não inserir dados administrativos, vínculo de marca, `identityOverrides`, orçamento ou segredos no snapshot; incluir somente o visual normalizado.
- Preservar valores personalizados, validação de logo, URL e cores.
- Edição e salvamento pertencem aos formulários; a prévia pode navegar e filtrar, mas nunca modifica, salva ou publica cadastros.

## O que revisar antes de alterar

- Testar quatro etapas, validação, salvamento e recarregamento.
- Conferir marca vinculada, personalizações por campo, atualização central seletiva e botão Usar identidade da marca.
- Testar os 24 modelos, todos os controles, cores claras e escuras e ordem dos canais.
- Verificar troca e remoção de logo, cores e destinos inválidos.
- Conferir ordem, visibilidade e remoção de produtos.
- Visualizar o rascunho sem completar identidade ou salvar; navegar no catálogo e nos detalhes sem contatos externos.
- Conferir produto durante a digitação, prévia ampliada e retorno ao formulário sem perder alterações.
- Abrir snapshot em `/preview` sem edição.
- Testar acentos, valores personalizados e falhas de armazenamento/cópia.

## Código relacionado

- [Cadastro de páginas e marcas](../../src/admin/AdminApp.jsx)
- [Campos de identidade, aparência e canais](../../src/components/PageFields.jsx)
- [Biblioteca e ajustes de visual](../../src/admin/PageDesignFields.jsx)
- [Presets e normalização](../../src/utils/pageDesign.js)
- [Renderização compartilhada](../../src/components/PageSurface.jsx)
- [Formulário de produto](../../src/components/Editor.jsx)
- [Prévia interativa do rascunho](../../src/admin/LivePreview.jsx)
- [Detalhes compartilhados do produto](../../src/components/ProductDetails.jsx)
- [Persistência, vínculos e prévia](../../src/utils/adminState.js)
- [Validação, imagem e snapshot](../../src/utils/pageState.js)
- [Modelo de demonstração](../../src/App.jsx)
