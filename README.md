# 🏛️ Sunnyata Invests

Sistema de Bolsa de Valores para RPG com atualização automática, sistema de login por IP e portfólio sincronizado entre todos os jogadores.

## 📋 Características

- ✨ Interface moderna e responsiva
- 📊 Atualização automática de preços a cada 10 minutos
- 👤 Sistema de login único por IP
- 💰 Depósito e gerenciamento de libras
- 📈 Compra e venda de ações em tempo real
- 💼 Portfólio personalizado com lucros/prejuízos
- 🔄 Sincronização de dados entre todos os usuários
- 📜 Histórico de transações
- 🎨 Design dark mode com gradientes
- 🏆 Sistema de ranking (em desenvolvimento)

## 🌍 Nações

O sistema inclui empresas das seguintes nações:
- Império Forger
- Ostrakis
- Casa Ars
- Casa Eris
- Filhos da Terra
- Casa Monaco
- Eroques
- Luarias
- Astellanos
- Slovanos
- Tuscos
- Casa Venian

## 🏢 Setores Econômicos

- ⛏️ Mineração
- 🏪 Comércio
- 🌾 Agricultura
- ⚙️ Manufatura
- ✨ Magia
- 🚢 Transporte
- 🏗️ Construção
- 🧪 Alquimia

## 📁 Estrutura do Projeto

```
sunnyata_invests/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── server.js           # Servidor Node.js com API
├── package.json        # Configuração do projeto
├── js/
│   ├── main.js         # Controlador principal
│   ├── config.js       # Configurações do sistema
│   ├── stockGenerator.js  # Geração e atualização de ações
│   ├── storage.js      # Gerenciamento de localStorage
│   ├── ui.js           # Renderização da interface
│   ├── filters.js      # Sistema de filtros
│   ├── api.js          # Comunicação com o servidor
│   └── portfolio.js    # Gerenciamento de portfólio
├── data/               # Dados do servidor (criado automaticamente)
│   ├── users.json      # Dados dos usuários
│   └── stocks.json     # Dados das ações
└── README.md
```

## 🚀 Como Usar

### Pré-requisitos

- Node.js instalado (versão 14 ou superior)
- npm (geralmente vem com o Node.js)

### Instalação

1. Clone ou baixe o repositório
2. Instale as dependências:

```bash
npm install
```

### Executar Localmente

```bash
npm start
```

O servidor estará rodando em `http://localhost:3000`

### Desenvolvimento com auto-reload

```bash
npm run dev
```

## 🎮 Como Funciona

### 1. Login Automático por IP

- Cada jogador é identificado automaticamente pelo seu IP
- Na primeira vez, pode escolher um nome ou deixar gerar automaticamente
- Cada IP tem uma conta única e persistente
- Saldo inicial: 10.000 libras ⚜️

### 2. Mercado de Ações

- 3-5 empresas por nação
- Preços variam automaticamente a cada 10 minutos
- Variação de -8% a +8% por atualização
- Dados sincronizados entre todos os usuários

### 3. Sistema de Investimentos

#### Depositar Libras
- Clique em "💰 Depositar"
- Digite o valor desejado
- O saldo é atualizado instantaneamente

#### Comprar Ações
- Clique em "💰 Comprar" no card da empresa
- Digite a quantidade desejada
- Confirme a compra (deduz do seu saldo)

#### Vender Ações
- Acesse seu portfólio
- Clique em "Vender" na ação desejada
- Digite a quantidade
- Confirme a venda (adiciona ao seu saldo)

### 4. Portfólio

Veja em tempo real:
- **Saldo em Libras**: Dinheiro disponível
- **Valor em Ações**: Valor atual de todas as suas ações
- **Patrimônio Total**: Saldo + Valor em Ações
- **Lucro/Prejuízo**: Ganho ou perda total das suas ações

Cada ação no portfólio mostra:
- Quantidade possuída
- Preço médio de compra
- Preço atual
- Valor investido
- Valor atual
- Lucro/Prejuízo (absoluto e percentual)

### 5. Histórico de Transações

- Últimas 10 transações exibidas
- Tipos: Compra, Venda, Depósito
- Data e hora de cada transação
- Até 50 transações armazenadas por usuário

## ⚙️ Configurações

Você pode ajustar as configurações em `js/config.js`:

```javascript
UPDATE_INTERVAL: 10 * 60 * 1000, // 10 minutos
MARKET_VOLATILITY: {
    MIN: -8,  // -8%
    MAX: 8    // +8%
}
```

## 🌐 Deploy em Produção

### ⚠️ IMPORTANTE: GitHub Pages Sozinho NÃO Funciona!

O GitHub Pages serve apenas arquivos estáticos. Para ter **sincronização entre todos os jogadores**, você precisa de um servidor Node.js rodando.

### ✅ Solução: Deploy Híbrido

1. **Backend (Servidor)** → Render.com, Railway.app ou Fly.io (GRÁTIS)
2. **Frontend (Interface)** → GitHub Pages (GRÁTIS)

### 📖 Guia Completo de Deploy

Consulte o arquivo **[DEPLOY.md](DEPLOY.md)** para instruções passo a passo detalhadas.

### Resumo Rápido:

1. **Deploy do Backend no Render.com:**
   - Criar conta e conectar repositório
   - Configurar Web Service com Node.js
   - Copiar a URL gerada

2. **Atualizar URL da API:**
   - Editar `js/api.js`
   - Substituir `PRODUCTION_API_URL` pela URL do Render
   - Commit e push

3. **Ativar GitHub Pages:**
   - Settings → Pages → Ativar
   - Pronto! URL: `https://seu-usuario.github.io/sunnyata_invests`

### 🔄 Sincronização

**SIM!** Com o backend no Render, todos os jogadores terão:
- ✅ Dados sincronizados em tempo real
- ✅ Mesmos preços de ações
- ✅ Contas individuais por IP
- ✅ Atualizações automáticas a cada 10min

### ⚠️ Limitação do Plano Grátis

O Render.com gratuito tem uma limitação:
- Servidor "dorme" após 15min sem uso
- Primeira requisição pode demorar ~30s para "acordar"
- Depois funciona normalmente

**Solução:** Use UptimeRobot para fazer ping a cada 10 minutos.

---

## 📊 API Endpoints

### Autenticação
- `POST /api/auth/login` - Login/Registro por IP
- `GET /api/user` - Obter dados do usuário

### Portfólio
- `POST /api/portfolio/buy` - Comprar ações
- `POST /api/portfolio/sell` - Vender ações
- `POST /api/portfolio/deposit` - Depositar libras

### Ações
- `GET /api/stocks` - Obter todas as ações
- `POST /api/stocks/update` - Atualizar preços

### Ranking
- `GET /api/ranking` - Obter ranking de investidores

## 🎨 Personalização

### Cores
As cores podem ser ajustadas nas variáveis CSS em `styles.css`:
```css
--bg-primary: #0f172a;
--accent: #3b82f6;
--positive: #10b981;
--negative: #ef4444;
```

### Moeda
Para alterar o símbolo da moeda ⚜️, edite em `js/ui.js` e `js/portfolio.js`.

### Saldo Inicial
Em `server.js`, altere:
```javascript
balance: 10000, // Valor inicial
```

## 📱 Responsividade

O sistema é totalmente responsivo e se adapta a:
- Desktop: Grid com múltiplas colunas
- Tablet: Grid adaptativo
- Mobile: Coluna única

## 💡 Dicas de Uso

1. **Sincronização**: Todos os usuários veem os mesmos preços
2. **IP Único**: Cada IP tem apenas uma conta
3. **Persistência**: Dados salvos no servidor
4. **Tempo Real**: Preços atualizam automaticamente
5. **Estratégia**: Compre na baixa, venda na alta!

## 🔒 Segurança

- Sistema baseado em IP (sem senhas)
- Validação de saldo antes de compras
- Validação de quantidade antes de vendas
- Dados armazenados em JSON no servidor

## 🐛 Troubleshooting

### Erro de conexão com o servidor
- Verifique se o servidor está rodando
- Confira a URL da API em `js/api.js`
- Veja o console do navegador para erros

### Dados não sincronizam
- Certifique-se de que apenas um servidor está rodando
- Verifique se a pasta `data/` tem permissões de escrita

### Preços não atualizam
- Aguarde os 10 minutos completos
- Recarregue a página
- Verifique o console para erros

## 📄 Licença

Projeto livre para uso em campanhas de RPG!

## 🤝 Contribuindo

Sugestões e melhorias são bem-vindas!

---

Desenvolvido para o mundo de Sunnyata ⚔️✨

**Que seus investimentos sejam prósperos!** 💰📈

