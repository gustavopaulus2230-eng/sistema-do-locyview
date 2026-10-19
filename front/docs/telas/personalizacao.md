# Personalização das páginas dos clientes

## Objetivo

Configurar marcas, textos, links e produtos pelo painel LocyView independente. A demonstração resultante é um modelo deste sistema, não uma alteração do primeiro site LocyTech.

## Visão geral

`AdminApp` organiza o cadastro de página em Identidade, Aparência, Links e Produtos. `PageFields` concentra campos de marca, textos, cores e canais. `ProductEditor` cria e edita produtos sem duplicar o formulário.

Marcas são cadastradas no item Marcas do menu. Ao vincular uma página, nome, logo e três cores são geridos pela marca central. Textos, identificador, assinatura, links e produtos continuam pertencendo à página. Veja o domínio [Marcas](marcas.md) antes de alterar esse vínculo.

O modelo completo abre em `/preview#p=`, sem dados administrativos e sem controles de edição de `App`. O antigo `Editor` permanece como apoio do modelo, não como fluxo principal deste sistema.

## Arquivos fonte de verdade

- `src/admin/AdminApp.jsx`.
- `src/components/PageFields.jsx`.
- `src/components/Editor.jsx`.
- `src/utils/adminState.js`.
- `src/utils/pageState.js`.

## Modelo de dados / fluxo

Editar atualiza a prévia e marca alterações pendentes; Salvar página ou Salvar marca grava manualmente no armazenamento administrativo versão 2 deste domínio. Marcas e páginas são salvas juntas. Falhas são informadas, preservam a edição e não enviam nada à API ou ao primeiro projeto.

A logo aceita PNG, JPEG e WebP de até 1,5 MB. `optimizeLogo` limita uploads a 400 pixels no maior lado e converte para WebP. A referência padrão é servida em sua resolução original. As cores alteram fundo, destaques e botões sem recolorir a logo; `contrastText` define texto contrastante. Cada catálogo aceita até 30 produtos e oito itens em `features` por produto.

`publicSnapshot` inclui somente configuração pública, produtos habilitados e URLs validadas. UTF-8 é preservado. `decodeSnapshot` valida antes de normalizar. Links inválidos não carregam cadastros administrativos ou rascunhos locais.

O painel usa `migrateDefaults: false`; novos snapshots incluem `preserveConfiguredValues: true`. Preços, textos, cores e links de clientes não são substituídos por migrações de padrões LocyTech. Os contatos predefinidos pertencem apenas ao modelo inicial; páginas novas começam com destinos vazios.

## Regras críticas

- Identificador local não cria rota curta ou domínio.
- Não apresentar a demonstração como publicação ou integração com o primeiro site.
- Marcas propagam apenas nome, logo e três cores.
- Não inserir dados administrativos, vínculo de marca, orçamento ou segredos no snapshot.
- Preservar valores personalizados, validação de logo, URL e cores.
- Edição e salvamento pertencem ao painel; a prévia é somente leitura.

## O que revisar antes de alterar

- Testar quatro etapas, validação, salvamento e recarregamento.
- Conferir marca vinculada, atualização central e preservação de conteúdo específico.
- Verificar troca e remoção de logo, cores e destinos inválidos.
- Conferir ordem, visibilidade e remoção de produtos.
- Abrir snapshot em `/preview` sem edição.
- Testar acentos, valores personalizados e falhas de armazenamento/cópia.

## Código relacionado

- [Cadastro de páginas e marcas](../../src/admin/AdminApp.jsx)
- [Campos de identidade, aparência e canais](../../src/components/PageFields.jsx)
- [Formulário de produto](../../src/components/Editor.jsx)
- [Persistência, vínculos e prévia](../../src/utils/adminState.js)
- [Validação, imagem e snapshot](../../src/utils/pageState.js)
- [Modelo de demonstração](../../src/App.jsx)
