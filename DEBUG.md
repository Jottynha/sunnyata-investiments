# 🔍 DEBUG - Erro de Conexão

## 📋 Checklist Rápido

### 1️⃣ Copie a URL do Render

No dashboard do Render, você verá algo assim:
```
✅ Live
🌐 https://sunnyata-invests-api.onrender.com
```

**Cole aqui a URL completa:**
```
URL: https://_________________________________
```

---

### 2️⃣ Teste a API Diretamente

Abra esta URL no navegador (substitua pela sua URL):
```
https://SUA-URL-AQUI.onrender.com/api/stocks
```

**O que você vê?**

#### ✅ Se aparecer isso = FUNCIONANDO:
```json
{
  "success": true,
  "stocks": []
}
```
ou
```json
{
  "success": true,
  "stocks": [...]
}
```

#### ❌ Se aparecer erro = PROBLEMA NO SERVIDOR:
```
Cannot GET /api/stocks
```
ou
```
Application Error
```

---

### 3️⃣ Verifique os Logs do Render

No dashboard do Render:
1. Clique no seu serviço `sunnyata-invests-api`
2. Vá em **"Logs"** (menu lateral)
3. Procure por:

#### ✅ SUCESSO - Deve aparecer:
```
🏛️ Sunnyata Invests Server rodando na porta 3000
📊 Acesse: http://localhost:3000
```

#### ❌ ERRO - Se aparecer algo como:
```
Error: Cannot find module 'express'
```
ou
```
SyntaxError: ...
```
ou
```
Application failed to respond
```

**Me mande o erro completo!**

---

### 4️⃣ Verifique as Configurações

No Render, vá em **"Settings"** e confira:

```
Root Directory: sunnyata-investiments  ✅
Build Command:  npm install            ✅
Start Command:  npm start              ✅
```

Se algum estiver diferente, **corrija e faça "Manual Deploy"**!

---

## 🔧 Soluções Rápidas

### Problema 1: "Application failed to respond"

**Solução:**
1. Render → Settings → Environment
2. Adicione variável:
   - Key: `PORT`
   - Value: `10000`
3. Clique em "Save Changes"
4. Faça "Manual Deploy"

### Problema 2: "Cannot GET /api/..."

**Causa:** Root Directory errado

**Solução:**
1. Settings → Root Directory
2. Altere para: `sunnyata-investiments`
3. Save → Manual Deploy

### Problema 3: Servidor demora muito (30-60s)

**Causa:** Plano grátis "hiberna" após 15min

**Solução:** Normal! Aguarde alguns segundos na primeira requisição.

---

## 📱 Teste Completo da API

Depois que o servidor estiver **Live**, teste estas URLs:

### 1. Health Check
```
https://SUA-URL.onrender.com/api/stocks
```
Deve retornar JSON

### 2. Criar Usuário (no navegador)
```
Abra seu site (localhost ou GitHub Pages)
Tente fazer login
Abra DevTools (F12) → Console
Procure por erros
```

### 3. Ver Network
```
F12 → Network → XHR
Tente fazer login novamente
Veja se aparece requisições para /api/auth/login
```

**Status Code:**
- ✅ 200 = Funcionou
- ❌ 404 = URL errada
- ❌ 500 = Erro no servidor
- ❌ CORS = Problema de CORS

---

## 🆘 Me Envie:

Para eu te ajudar, preciso de:

1. **URL do Render:**
   ```
   https://___________________
   ```

2. **Últimas linhas dos logs:**
   ```
   (copie aqui)
   ```

3. **Erro no console do navegador (F12):**
   ```
   (print ou copie)
   ```

4. **Status code da requisição:**
   - Network → XHR → Click na requisição → Status

---

## 🚀 Próximo Passo

**ME MANDE A URL DO RENDER** e eu atualizo o código automaticamente!

Exemplo:
```
https://sunnyata-invests-api.onrender.com
```
