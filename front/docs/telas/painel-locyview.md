# Painel LocyView

## Objetivo

Organizar marcas e páginas de clientes em um sistema independente do primeiro projeto LocyTech. Esta entrega é somente front-end: os cadastros ficam no navegador deste painel, sem servidor, autenticação ou integração automática com o site de links.

## Visão geral

O endereço principal `/` abre `AdminApp`; `/admin` e `/admin/` também abrem o painel. `/preview` é reservado ao modelo de demonstração da página de um cliente. O modelo pertence a este projeto, não ao primeiro site.

O menu contém Páginas dos clientes e, logo abaixo, Marcas. A listagem de páginas permite pesquisar por cliente, marca ou identificador e filtrar Todas, Configuradas e Pendentes. “Configurada” indica validação local e ao menos um link válido, não publicação. Os indicadores contam apenas os cadastros locais, sem inventar acessos ou vendas.

O formulário possui Identidade, Aparência, Links e Produtos. É possível vincular uma marca central e editar livremente nome, logo e três cores na própria página. Campos personalizados ficam protegidos de alterações posteriores da marca; os demais continuam herdados. Textos, identificador, links, assinatura, produtos e visual são específicos da página. A etapa Aparência inclui uma biblioteca de 24 modelos e ajustes finos, com prévia imediata. Visualizar página prepara um link de demonstração com uma versão dos dados.

Na primeira abertura existe somente a marca LocyTech e uma página modelo vinculada. Não representam cliente contratado ou leitura do primeiro site. Novas páginas começam sem conteúdo de cliente. Não há exclusão de marcas ou cadastros de páginas nesta entrega. “Ver projeto de links” é somente um link externo para o primeiro projeto.

## Arquivos fonte de verdade

- `src/admin/AdminApp.jsx`: páginas, marcas, formulários e prévia.
- `src/utils/adminState.js`: validação, vínculos, persistência e link de demonstração.
- `src/components/PageFields.jsx`: identidade, cores e canais.
- `src/components/Editor.jsx`: formulário de produto reutilizado.
- `src/styles/admin.css`: interface responsiva.
- `src/index.jsx`: painel principal e modelo de prévia.

## Modelo de dados / fluxo

O conjunto administrativo versão 2 usa a chave `locyview-admin:v2` e contém `{ version: 2, records, brands }`. Cada página tem identificador interno, nome administrativo, configuração pública, data de alteração, vínculo opcional por `brandId` e lista interna `identityOverrides`. A marca central contém nome, logo e três cores; não contém textos, destinos sociais ou catálogo da página.

Salvar página ou marca é manual. A atualização de marca aplica somente nome, logo e cores herdados às páginas locais vinculadas. Cada campo alterado na própria página entra em `identityOverrides` e não é sobrescrito pela marca. “Usar identidade da marca” remove essas exceções e reaplica os cinco campos, sem mexer nos textos, links, produtos ou visual. Escolher outra marca também reinicia as exceções. Marcas e páginas são persistidas juntas em uma única gravação para não deixar vínculos parcialmente atualizados. Falhas de armazenamento mantêm a edição e impedem apresentar falso sucesso.

O limite é de 50 páginas e 50 marcas neste navegador. Identidade, identificadores de páginas e URLs preenchidas são validados; canais vazios são permitidos. Um identificador de página não pode repetir outro cadastro local. Os avisos indicam campo e etapa. O painel sanitiza sem migração de padrões antigos, preservando valores personalizados.

A leitura legada de `locyview-admin:v1` ocorre somente se a chave versão 2 não existir. Ela preserva os cadastros como páginas sem vínculo central, sem associar uma marca automaticamente ou trocar sua identidade. A migração é local e não modifica a chave antiga, nem mesmo ao salvar a versão 2. Uma lista vazia persistida permanece vazia. Conteúdo inválido ou bloqueio ao ler o armazenamento interrompe as gravações da sessão, evitando substituir dados existentes.

A logo aceita PNG, JPEG ou WebP de até 1,5 MB e passa por `optimizeLogo`. As cores podem ser editadas por seletor ou HEX (#RGB ou #RRGGBB); seletor e HEX de seis dígitos aplicam imediatamente. HEX curto é expandido ao sair ou confirmar com Enter. Entrada inválida mostra erro e mantém a última cor válida. O catálogo permite até 30 produtos e oito itens de descrição em cada produto, além de edição, ordenação, ocultação e remoção confirmada. Operações do catálogo só persistem ao salvar a página.

A configuração pública possui `design`, normalizado por `pageDesign.js`. Os 24 modelos combinam seis composições e quatro estilos reais; aplicá-los substitui somente o visual, preservando logo, nome, cores e conteúdo. Composição, cartões, fundo, fonte, escala de texto, cantos, espaçamento, logo, alinhamento, ícones, descrições, setas e ordem dos quatro canais são ajustáveis. Registros antigos sem `design` recebem padrões compatíveis. Veja [Visual e modelos](visual-da-pagina.md).

Alterações pendentes são sinalizadas. Sair do formulário pede confirmação; fechar ou recarregar a aba recebe o aviso nativo. Dados pertencem à origem deste painel: não são importados ou sincronizados com o primeiro site ou entre aparelhos.

`clientPreviewUrl` gera `/preview#p=` na origem atual com dados públicos sanitizados, sem nome administrativo, datas, vínculo interno da marca ou `identityOverrides`. O visual `design` faz parte da versão pública. O link contém a versão gerada naquele instante; não acompanha mudanças posteriores, não permite revogação e não constitui publicação centralizada. Não inclua dados sigilosos.

## Regras críticas

- Preservar a separação de código, hospedagem e dados de `locytech-bio`.
- Não anunciar login, API, servidor, sincronização ou publicação de páginas inexistentes.
- Atualizar somente os campos de identidade herdados; respeitar `identityOverrides` e preservar conteúdo e visual da página.
- Persistir marcas e páginas atomicamente e preservar conteúdo diante de erro.
- Não transformar `/admin` em promessa de proteção de acesso.
- Não enviar cadastros ao primeiro site nem solicitar senhas ou tokens.
- Não incluir dados administrativos ou de orçamento nos snapshots.
- Manter formulários acessíveis e responsivos.

## O que revisar antes de alterar

- Abrir `/`, `/admin` e `/admin/` diretamente e recarregar.
- Testar cadastro e edição de marcas, vínculo e propagação somente dos campos herdados; preservar exceções e testar restauração da identidade.
- Aplicar os 24 modelos, ajustar controles e ordem; conferir prévia imediata, salvamento e snapshot.
- Criar e editar páginas, pesquisar, filtrar e validar campos obrigatórios e identificadores.
- Verificar logo, cores, destinos vazios e operações do catálogo.
- Conferir migração da versão 1 sem vínculo automático e listas vazias persistidas.
- Testar armazenamento inválido, bloqueado ou cheio, sem gravação parcial.
- Abrir `/preview#p=` e conferir ausência de campos administrativos e edição.
- Confirmar que alterações locais não mudam snapshots antigos nem o primeiro projeto.
- Testar celular, computador, teclado e diálogos sem rolagem horizontal.

## Código relacionado

- [Painel de páginas e marcas](../../src/admin/AdminApp.jsx)
- [Estado administrativo e vínculos](../../src/utils/adminState.js)
- [Campos de configuração](../../src/components/PageFields.jsx)
- [Biblioteca e controles visuais](../../src/admin/PageDesignFields.jsx)
- [Modelos e normalização do visual](../../src/utils/pageDesign.js)
- [Formulário de produto](../../src/components/Editor.jsx)
- [Esquema e snapshot](../../src/utils/pageState.js)
- [Estilos do painel](../../src/styles/admin.css)
- [Seleção da aplicação](../../src/index.jsx)
