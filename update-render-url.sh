#!/bin/bash

# Script para atualizar URL do Render
# Uso: ./update-render-url.sh https://sua-url.onrender.com

if [ -z "$1" ]; then
    echo "❌ Erro: URL não fornecida"
    echo ""
    echo "Uso: ./update-render-url.sh https://sua-url.onrender.com"
    echo ""
    echo "Exemplo:"
    echo "  ./update-render-url.sh https://sunnyata-invests-api.onrender.com"
    exit 1
fi

RENDER_URL="$1"

# Remove trailing slash se houver
RENDER_URL="${RENDER_URL%/}"

echo "🔧 Atualizando URL da API..."
echo "Nova URL: $RENDER_URL/api"
echo ""

# Atualiza o arquivo js/api.js
sed -i "s|const PRODUCTION_API_URL = '.*';|const PRODUCTION_API_URL = '$RENDER_URL/api';|g" js/api.js

if [ $? -eq 0 ]; then
    echo "✅ URL atualizada com sucesso!"
    echo ""
    echo "📝 Próximos passos:"
    echo "1. git add js/api.js"
    echo "2. git commit -m 'Atualizar URL da API do Render'"
    echo "3. git push"
    echo ""
    echo "Depois ative o GitHub Pages e está pronto! 🚀"
else
    echo "❌ Erro ao atualizar o arquivo"
    exit 1
fi
