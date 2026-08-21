#!/bin/sh
# Script para carregar variáveis do .env.production

if [ -f .env.production ]; then
  # Processar arquivo .env removendo comentários e linhas vazias
  # e exportar variáveis, lidando com aspas
  while IFS= read -r line || [ -n "$line" ]; do
    # Ignorar comentários e linhas vazias
    case "$line" in
      \#*|'') continue ;;
    esac
    
    # Remover espaços em branco no início e fim
    line=$(echo "$line" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
    
    # Pular se linha estiver vazia após remoção
    [ -z "$line" ] && continue
    
    # Remover 'export' se existir no início
    line=$(echo "$line" | sed 's/^export //')
    
    # Extrair nome e valor da variável
    var_name=$(echo "$line" | cut -d'=' -f1 | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
    var_value=$(echo "$line" | cut -d'=' -f2- | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
    
    # Remover aspas do valor se existirem (simples e duplas)
    var_value=$(echo "$var_value" | sed 's/^"\(.*\)"$/\1/' | sed "s/^'\(.*\)'$/\1/")
    
    # Exportar variável
    eval "export ${var_name}=\"${var_value}\""
  done < .env.production
fi

