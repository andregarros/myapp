# Smart Market Suite

Sistema completo para leitura de codigo de barras com API, painel web e aplicativo mobile.

## Estrutura

- `backend`: API REST com autenticacao JWT, produtos, dashboard, carrinho, historico, notificacoes e sincronizacao offline.
- `web`: painel administrativo responsivo em React + Vite.
- `mobile`: aplicativo Expo/React Native com scanner, carrinho, historico e suporte offline.
- `backend/sql/schema.sql`: estrutura inicial do banco MySQL.
- `docs/architecture.md`: visao arquitetural e decisoes de escalabilidade.

## Como executar

1. Instale as dependencias na raiz:

```bash
npm install
```

2. Suba o backend:

```bash
npm run dev:backend
```

3. Em outro terminal, suba o painel web:

```bash
npm run dev:web
```

4. Em outro terminal, suba o app mobile:

```bash
npm run dev:mobile
```

5. Para testar o mobile em aparelho fisico, troque `http://localhost:4000/api` pelo IP local da maquina em `mobile/src/api/client.js`.

## Credenciais iniciais

- Admin: `admin@smartmarket.com` / `Admin@123`
- Funcionario: `staff@smartmarket.com` / `Staff@123`
- Cliente: `customer@smartmarket.com` / `Client@123`

## Fluxo de camera no app

Ao abrir a tela principal de scanner:

```txt
se permissao ja foi concedida:
  abre a camera automaticamente
senao:
  solicita permissao
  se usuario aceitar:
    abre a camera
```

## Observacoes

- A API usa um repositorio em JSON para demo local e um schema MySQL pronto para migracao.
- A integracao externa de codigo de barras usa Open Food Facts como fallback quando o produto nao existir localmente.
- O design foi pensado para multiempresa por `companyId`.

## Deploy do web no Vercel

- O repositorio agora pode ser publicado na raiz tambem, com frontend e API juntos no Vercel.
- Use `Build Command` = `npm run build`.
- Use `Output Directory` = `dist`.
- Crie a variavel `JWT_SECRET` no Vercel.
- Opcionalmente defina `ALLOWED_ORIGINS` e `WEB_URL` se quiser restringir CORS manualmente.
- O frontend usa `/api` por padrao e o arquivo `vercel.json` faz o rewrite das rotas SPA para `index.html`.
- Em ambiente Vercel o backend usa armazenamento em memoria para demo. Os dados podem reiniciar entre execucoes, entao para persistencia real o ideal e conectar um banco.

## Deploy no Render

- Este repositorio agora inclui [`render.yaml`](C:/Users/Administrator/Desktop/myapp/render.yaml) para publicar pela raiz como um unico servico Node.
- O Render deve executar:
  `Build Command`: `npm install && npm run build`
  `Start Command`: `npm run start`
- O frontend Vite e gerado em `dist/` e o backend Express passa a servir esses arquivos em producao.
- O endpoint de health check e `/health`.
- Defina `JWT_SECRET` no Render. Se usar o blueprint, ele e gerado automaticamente.
- Nao publique o diretório `mobile` ou `my-app` como Web Service no Render, porque ambos usam Expo e possuem `main: expo-router/entry`.
- Para corrigir o erro `Cannot find module '/opt/render/project/src/expo-router/entry'`, recrie o servico usando a raiz do repositorio com o `render.yaml`, ou ajuste manualmente o Root Directory para `.` e os comandos acima.
# myappmercado
