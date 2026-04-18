# Arquitetura

## Visao geral

O projeto foi organizado em monorepo para compartilhar modelo de dominio e facilitar evolucao.

- Backend Node.js + Express: API REST, JWT, regras de negocio, sincronizacao offline e integracao externa.
- Web React + Vite: dashboard administrativo, produtos, historico e gerenciamento operacional.
- Mobile Expo Router: scanner com camera, feedback ao escanear, carrinho, historico e cache offline.

## Escalabilidade

- Multiempresa por `companyId` em todas as entidades principais.
- Servicos separados por contexto: autenticacao, catalogo, vendas, historico e notificacoes.
- Persistencia encapsulada em `DataStore`, facilitando troca de JSON local para MySQL/PostgreSQL.
- Endpoints versionados em `/api`.
- Estrutura pronta para extrair filas, cache Redis e worker de notificacoes.

## Seguranca

- Senhas com `bcryptjs`.
- JWT assinado com expiracao.
- Middlewares de validacao e autorizacao por papel.
- `helmet`, `cors` e validacao server-side.
- Filtro por empresa para isolamento logico dos dados.

## Offline

- Mobile armazena leituras e carrinho localmente com `AsyncStorage`.
- Quando a conexao retorna, o app envia eventos pendentes para `/sync/offline`.
- O backend recebe lotes de scans e compras para consolidacao.

## Integracoes futuras

- Gateway PIX/cartao.
- Sugestao de produtos por historico de compras.
- Webhooks e API publica para ERPs externos.
