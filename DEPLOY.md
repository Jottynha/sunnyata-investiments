# 🚀 Guia de Deploy - Sunnyata Invests

## 📋 Pré-requisitos

- Conta no GitHub
- Conta no Render.com (ou Railway.app)
- Código commitado no repositório

## 🔧 Passo a Passo

### 1️⃣ Deploy do Backend (Render.com)

1. **Criar conta**
   - Acesse [render.com](https://render.com)
   - Faça login com GitHub

2. **Criar Web Service**
   - Clique em "New +"
   - Selecione "Web Service"
   - Conecte seu repositório `sunnyata_invests`

3. **Configurar o Service**
   ```
   Name: sunnyata-invests-api
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **Deploy**
   - Clique em "Create Web Service"
   - Aguarde o deploy (2-3 minutos)
   - Copie a URL gerada (ex: `https://sunnyata-invests-api.onrender.com`)

5. **⚠️ IMPORTANTE: Configurar CORS**
   - O servidor já está configurado com CORS
   - Nenhuma ação adicional necessária

### 2️⃣ Atualizar URL da API no Frontend

1. **Editar `js/api.js`**
   
   Abra o arquivo `js/api.js` e encontre esta linha:
   ```javascript
   const PRODUCTION_API_URL = 'https://SEU-APP.onrender.com/api';
   ```
   
   Substitua por sua URL do Render:
   ```javascript
   const PRODUCTION_API_URL = 'https://sunnyata-invests-api.onrender.com/api';
   ```

2. **Commit e Push**
   ```bash
   git add js/api.js
   git commit -m "Atualizar URL da API para produção"
   git push
   ```

### 3️⃣ Deploy do Frontend (GitHub Pages)

1. **Ativar GitHub Pages**
   - Vá em Settings → Pages
   - Source: `main` branch
   - Folder: `/ (root)`
   - Save

2. **Aguarde o deploy**
   - GitHub vai construir e publicar automaticamente
   - URL: `https://SEU-USUARIO.github.io/sunnyata_invests`

3. **Testar**
   - Acesse a URL do GitHub Pages
   - Verifique se o login funciona
   - Teste compra/venda de ações

## ✅ Verificação

Após o deploy, teste:

- [ ] Login automático funciona
- [ ] Consegue depositar libras
- [ ] Consegue comprar ações
- [ ] Consegue vender ações
- [ ] Preços atualizam a cada 10 minutos
- [ ] Dados são sincronizados entre abas/usuários

## 🔄 Sincronização entre Usuários

**Sim!** Com o backend no Render, todos os jogadores verão:
- ✅ Os mesmos preços de ações
- ✅ Suas próprias contas (por IP)
- ✅ Atualizações em tempo real
- ✅ Dados persistidos no servidor

## 📊 Arquitetura Final

```
┌─────────────────────┐
│  GitHub Pages       │
│  (Frontend HTML/JS) │
│  seu-usuario.github.io
└──────────┬──────────┘
           │
           │ HTTP Requests
           │
           ▼
┌─────────────────────┐
│  Render.com         │
│  (Backend Node.js)  │
│  *.onrender.com     │
│                     │
│  ┌───────────────┐  │
│  │ users.json    │  │
│  │ stocks.json   │  │
│  └───────────────┘  │
└─────────────────────┘
```

## 🆓 Plano Gratuito do Render

**Limitações:**
- ⚠️ O servidor "dorme" após 15 minutos sem uso
- ⏱️ Primeira requisição pode demorar 30-60 segundos
- 🔄 Depois fica rápido normalmente

**Solução:** Use um serviço de ping (ex: UptimeRobot) para manter o servidor ativo.

## 🐛 Troubleshooting

### "Erro de conexão com o servidor"
- Verifique se o backend está rodando no Render
- Confirme que a URL da API está correta em `js/api.js`
- Veja os logs no Render Dashboard

### "CORS Error"
- O servidor já está configurado com CORS
- Se persistir, adicione sua URL do GitHub Pages explicitamente

### "Dados não sincronizam"
- Verifique se está usando a URL de produção, não localhost
- Limpe o cache do navegador
- Teste em modo anônimo

## 🔐 Segurança

**Nota:** Este sistema usa IP para identificação. Para produção real:
- Considere adicionar autenticação (login/senha)
- Adicione validações extras no backend
- Use HTTPS em produção (Render já fornece)

## 📞 Suporte

Problemas? Verifique:
1. Console do navegador (F12)
2. Logs do Render Dashboard
3. Network tab para ver requisições falhando

---

**Boa sorte com o deploy!** 🎉
