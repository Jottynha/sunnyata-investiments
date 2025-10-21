# 🚀 Guia Visual - Deploy no Render

## 📍 Onde Você Está Agora

✅ Conta vinculada no Render
⏳ Próximo passo: Criar Web Service

---

## 🎯 PASSO 2: Criar Web Service

### 1. No Dashboard do Render

Acesse: https://dashboard.render.com/

```
┌──────────────────────────────────────────────┐
│  Render Dashboard                     New + │
│                                              │
│  📊 Services                                 │
│  📈 Metrics                                  │
│  ⚙️  Settings                                │
└──────────────────────────────────────────────┘
```

Clique em **"New +"** → **"Web Service"**

---

### 2. Conectar Repositório

```
┌──────────────────────────────────────────────┐
│  Connect a repository                        │
│                                              │
│  🔗 GitHub                                   │
│     Connect account                          │
│                                              │
│  Ou se já conectou:                          │
│                                              │
│  📁 sunnyata_invests                        │
│     └─ Connect                               │
└──────────────────────────────────────────────┘
```

---

### 3. Configurar o Serviço

**⚠️ ATENÇÃO: COPIE EXATAMENTE ASSIM:**

```
┌────────────────────────────────────────────────────┐
│ Name                                               │
│ ┌────────────────────────────────────────────────┐│
│ │ sunnyata-invests-api                          ││
│ └────────────────────────────────────────────────┘│
├────────────────────────────────────────────────────┤
│ Region                                             │
│ ┌────────────────────────────────────────────────┐│
│ │ Frankfurt (EU Central) ▼                       ││
│ └────────────────────────────────────────────────┘│
├────────────────────────────────────────────────────┤
│ Branch                                             │
│ ┌────────────────────────────────────────────────┐│
│ │ main                                           ││
│ └────────────────────────────────────────────────┘│
├────────────────────────────────────────────────────┤
│ Root Directory                                     │
│ ┌────────────────────────────────────────────────┐│
│ │ sunnyata-investiments                          ││ ⚠️
│ └────────────────────────────────────────────────┘│
├────────────────────────────────────────────────────┤
│ Environment                                        │
│ ┌────────────────────────────────────────────────┐│
│ │ Node ▼                                         ││
│ └────────────────────────────────────────────────┘│
├────────────────────────────────────────────────────┤
│ Build Command                                      │
│ ┌────────────────────────────────────────────────┐│
│ │ npm install                                    ││
│ └────────────────────────────────────────────────┘│
├────────────────────────────────────────────────────┤
│ Start Command                                      │
│ ┌────────────────────────────────────────────────┐│
│ │ npm start                                      ││
│ └────────────────────────────────────────────────┘│
├────────────────────────────────────────────────────┤
│ Instance Type                                      │
│ ┌────────────────────────────────────────────────┐│
│ │ ● Free                 $0/month                ││
│ └────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────┘

          [Create Web Service]
```

**⚠️ IMPORTANTE:**
- **Root Directory:** `sunnyata-investiments` (não deixe em branco!)
- **Build Command:** `npm install` (exatamente assim)
- **Start Command:** `npm start` (exatamente assim)

---

### 4. Clique em "Create Web Service"

Aguarde o deploy...

```
┌──────────────────────────────────────────────┐
│  sunnyata-invests-api                        │
│  ⚙️  Deploying...                            │
│                                              │
│  Logs:                                       │
│  ════════════════════════════════            │
│  Mar 10 10:15:32 Building...                │
│  Mar 10 10:15:45 ==> Downloading...         │
│  Mar 10 10:16:02 npm install                │
│  Mar 10 10:16:45 added 100 packages         │
│  Mar 10 10:16:50 Starting server...         │
│  Mar 10 10:16:52 Server running on 3000     │
│  Mar 10 10:16:53 ✅ Live                    │
└──────────────────────────────────────────────┘
```

---

### 5. Copiar a URL

Quando aparecer **✅ Live**, copie a URL:

```
┌──────────────────────────────────────────────┐
│  sunnyata-invests-api                        │
│  ✅ Live                                     │
│                                              │
│  🌐 https://sunnyata-invests-api.onrender.com
│                                              │
│  📋 [Copy URL]                               │
└──────────────────────────────────────────────┘
```

**Copie esta URL!** Você vai precisar dela.

---

## 🎯 PRÓXIMO PASSO

### Cole a URL aqui e eu atualizo o código para você:

**Sua URL do Render:**
```
https://_______________________________________________
```

Exemplo:
```
https://sunnyata-invests-api.onrender.com
```

---

## ❓ Problemas Comuns

### "Failed to build"
✅ Verifique se Root Directory = `sunnyata-investiments`
✅ Verifique se Build Command = `npm install`

### "Application failed to respond"
✅ Verifique se Start Command = `npm start`
✅ Aguarde 1-2 minutos (pode demorar na primeira vez)

### "Cannot find module"
✅ Root Directory precisa estar correto
✅ Tente fazer novo deploy (botão "Manual Deploy")

---

## 📞 Precisa de Ajuda?

Me envie:
1. A URL que o Render gerou
2. Print dos logs (se houver erro)
3. Print das configurações

---

**Assim que tiver a URL, me mande que eu atualizo o código! 🚀**
