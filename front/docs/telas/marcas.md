# Marcas

## Objetivo

Centralizar nome, logo e cores de uma marca para reutilizá-los nas páginas locais dos clientes, dentro do painel LocyView independente.

## Visão geral

Marcas fica logo abaixo de Páginas dos clientes no menu. A tela permite cadastrar e editar a identidade da marca e consultar seu uso nas páginas locais. Não há exclusão nesta entrega.

O formulário concentra nome, logo e três cores: principal, destaque e fundo. Textos, identificador de página, links, assinatura e produtos não pertencem ao cadastro central da marca.

A marca inicial LocyTech e sua página modelo aparecem somente quando não existe estado salvo. Não são registros importados do primeiro site nem métricas de clientes reais.

## Arquivos fonte de verdade

- `src/admin/AdminApp.jsx`: navegação, salvamento e vínculo no cadastro da página.
- `src/admin/BrandViews.jsx`: listagem pesquisável, formulário e prévia de identidade.
- `src/utils/adminState.js`: normalização, validação e propagação.
- `src/components/PageFields.jsx`: campos e tratamento de logo e cores.
- `src/styles/admin.css`: interface responsiva.

## Modelo de dados / fluxo

Marcas e páginas são guardadas em `locyview-admin:v2` com `{ version: 2, records, brands }`. Cada marca possui identificador interno e sua identidade; uma página a referencia por `brandId`. Toda página permite editar identidade própria, mesmo vinculada. Desvincular mantém os valores atuais, sem recuperar automaticamente uma versão anterior.

Ao salvar uma marca, somente nome, logo e três cores herdados são aplicados às páginas locais vinculadas. Campos personalizados na própria página constam em `identityOverrides` e não são sobrescritos. A lista aceita somente `name`, `logo`, `primaryColor`, `accentColor` e `backgroundColor`. Nome administrativo do cliente, textos, identificador, assinatura, links, produtos e `design` permanecem inalterados. Marca e páginas são persistidas em uma única gravação; erro não deve atualizar parcialmente a interface ou substituir dados anteriores.

Há limite de 50 marcas e 50 páginas por navegador. O nome da marca é obrigatório, limitado a 60 caracteres e único desconsiderando acentos, maiúsculas e espaços repetidos; cores precisam ser HEX válidas. Upload aceita PNG, JPEG e WebP de até 1,5 MB e usa o otimizador existente. Alterações não salvas são sinalizadas e navegação pede confirmação.

“Usar identidade da marca” esvazia as exceções e reaplica os cinco campos da marca, sem mudar conteúdo ou visual. Escolher outra marca também limpa as exceções e aplica a nova identidade. Registros versão 2 antigos sem `identityOverrides` usam lista vazia, preservando a herança anterior.

Dados legados versão 1 são mantidos como páginas sem vínculo automático. Não associar uma marca por semelhança de nome nem substituir identidade personalizada. O conjunto antigo só passa ao novo armazenamento quando o usuário salva com sucesso. Estado vazio salvo continua vazio.

Uma prévia gerada contém uma cópia da identidade resolvida naquele momento. Editar a marca não atualiza links de demonstração antigos, o primeiro site ou outros aparelhos. Nenhum cadastro é enviado a servidor.

## Regras críticas

- Propagar exclusivamente nome, logo e três cores não personalizados na página; respeitar `identityOverrides`.
- Preservar conteúdo específico, identificadores internos e vínculos válidos.
- Gravar marcas e páginas juntas, sem sucesso parcial.
- Não apagar ou sobrescrever armazenamento inválido ou bloqueado.
- Não inventar importação, autenticação, publicação ou sincronização.
- Não incluir `brandId`, `identityOverrides` nem outros dados administrativos nos snapshots.

## O que revisar antes de alterar

- Cadastrar marca, trocar logo e cores e salvar/recarregar.
- Vincular uma página e conferir sua identidade na prévia.
- Vincular mais de uma página, personalizar parte de uma identidade, editar marca e conferir propagação somente dos campos herdados.
- Usar identidade da marca e trocar o vínculo; conferir restauração dos cinco campos sem mudar conteúdo.
- Preservar textos, links, produtos, identificadores e visual `design` das páginas.
- Testar versão 1, estado vazio, limite e falhas de armazenamento.
- Testar teclado, celular e computador sem rolagem horizontal.

## Código relacionado

- [Painel e cadastro de marcas](../../src/admin/AdminApp.jsx)
- [Listagem, formulário e prévia de marcas](../../src/admin/BrandViews.jsx)
- [Estado administrativo e vínculo](../../src/utils/adminState.js)
- [Campos de logo e cores](../../src/components/PageFields.jsx)
- [Validação e otimização da logo](../../src/utils/pageState.js)
- [Estilos do painel](../../src/styles/admin.css)
