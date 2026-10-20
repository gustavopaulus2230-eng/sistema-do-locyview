# Regras do painel LocyView

Este repositório contém exclusivamente o sistema independente de cadastro LocyView, em React dentro de `front/`. O primeiro projeto `locytech-bio`, sua página de links, hospedagem e GitHub são separados. Nunca modificar aquela pasta ou publicar este sistema no destino do primeiro projeto sem solicitação específica.

O escopo atual é somente front-end, já confirmado pelo usuário. Não adicionar servidor, API, banco de dados, login, autenticação ou sincronização. Antes de uma nova mudança de escopo, confirmar front ou back; não repetir a pergunta para ajustes dentro deste front já autorizado.

Leia código real e `front/docs/arquitetura.md` antes de alterar. Verifique duplicidades e reutilize `PageFields`, `ProductEditor`, `Icon` e os utilitários existentes. Use React, texto direto em português, ícones SVG e estados acessíveis; não use emojis.

`/` abre o painel; `/admin` é alias de interface, não proteção de acesso. `/preview#p=` é um modelo autocontido de página do cliente, somente leitura. O link externo para o primeiro site não é integração.

Marcas ficam abaixo de Páginas dos clientes no menu. Uma marca centraliza nome, logo e três cores; páginas vinculadas por `brandId` recebem esses campos somente quando ainda herdados. Nome, logo e cores da página são livres: cada campo alterado entra em `identityOverrides` e não é sobrescrito pela marca. Usar identidade da marca limpa exceções; trocar a marca também reaplica a identidade. Preservar textos, identificador, assinatura, links, produtos, visual e nome administrativo da página. Não implementar exclusão de marcas ou páginas fora do escopo.

O estado `locyview-admin:v2` guarda marcas e páginas em uma única gravação local. O limite é de 50 marcas e 50 páginas. A leitura de `locyview-admin:v1` é fallback somente na ausência da chave nova e conserva páginas sem vínculo automático e suas identidades; não apagar o legado. Estado vazio persistido deve continuar vazio. Dados inválidos ou armazenamento bloqueado devem impedir substituição; falhas de gravação não podem produzir sucesso parcial.

O visual fica em `page.design`, validado por `pageDesign.js`. Manter 24 modelos reais (seis composições × quatro estilos), controles finos e ordem dos quatro canais, sem alterar cores, logo ou conteúdo ao escolher modelo. Dados antigos sem `design` recebem padrões e sem `identityOverrides` recebem lista vazia, mantendo versão 2. Reutilizar `PageSurface` para que a prévia e o link gerado mostrem o mesmo resultado. Seletor de cor e HEX válidos precisam aplicar corretamente, com erro explícito para entrada inválida.

Não misturar nome administrativo, datas, vínculo interno, `identityOverrides` ou orçamento nos snapshots; incluir o visual normalizado. `#p=` contém uma versão pública, não um endereço curto, publicação sincronizada ou link revogável. Alterações de marcas e páginas afetam somente cadastros locais, nunca snapshots antigos ou o primeiro site. Não guardar informações sigilosas nem pedir senhas ou tokens.

O modelo mantém quatro atalhos e catálogo aberto por clique. Preços ilustrativos, inclusive R$ 0,00, não anunciam serviço gratuito. Não exibir controles antigos de edição no modelo de prévia, inventar clientes, métricas ou envio de orçamento.

Atualize documentos de domínio na mesma tarefa, depois estas regras e READMEs por último. Todos os documentos Markdown próprios terminam com `## Código relacionado` e links reais. Não manter temporários, logs ou código de teste descartável.

A porta local é 4174. Vite gera `build/` na raiz; dependências, build e arquivos de trava são automáticos e não devem ser editados à mão. Preserve o project_id próprio deste painel em `.openai/hosting.json` e seu acesso existente. Valide a construção antes de publicar. Não há destino GitHub novo configurado; não reutilize o repositório do primeiro projeto.

## Código relacionado

- [Entrada do painel e prévia](front/src/index.jsx)
- [Painel de páginas e marcas](front/src/admin/AdminApp.jsx)
- [Interface de marcas](front/src/admin/BrandViews.jsx)
- [Designer de páginas](front/src/admin/PageDesignFields.jsx)
- [Modelos e validação de visual](front/src/utils/pageDesign.js)
- [Renderizador compartilhado](front/src/components/PageSurface.jsx)
- [Estado administrativo](front/src/utils/adminState.js)
- [Campos reutilizados](front/src/components/PageFields.jsx)
- [Esquema público](front/src/utils/pageState.js)
- [Comandos](package.json)
- [Publicação independente](.openai/hosting.json)
