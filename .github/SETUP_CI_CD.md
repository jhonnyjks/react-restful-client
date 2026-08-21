# Setup CI/CD - Client

## ⚡ Configuração Rápida

### 1. Gerar Chave SSH no Servidor

```bash
# No servidor de produção
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy

# Adicionar chave pública ao authorized_keys
cat ~/.ssh/github_actions_deploy.pub >> ~/.ssh/authorized_keys

# Ajustar permissões
chmod 600 ~/.ssh/authorized_keys
chmod 600 ~/.ssh/github_actions_deploy

# Exibir chave privada (copiar para GitHub Secrets)
cat ~/.ssh/github_actions_deploy
```

### 2. Configurar Secrets no GitHub

No repositório do Client, vá em: **Settings → Secrets and variables → Actions → New repository secret**

Adicione os seguintes secrets:

| Secret | Valor | Exemplo |
|-------|-------|---------|
| `DEPLOY_HOST` | IP ou hostname do servidor | `192.168.1.100` ou `servidor.diatech.com.br` |
| `DEPLOY_USER` | Usuário SSH | `root` ou `deploy` |
| `DEPLOY_SSH_KEY` | Chave privada SSH (conteúdo completo) | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `DEPLOY_PORT` | Porta SSH (opcional) | `22` |

**Opcional:**
- `VITE_APP_NAME`: Nome da aplicação para o build (padrão: `Alia`)

### 3. Preparar Servidor

```bash
# Criar diretório para imagens temporárias
mkdir -p /tmp/docker-images
chmod 755 /tmp/docker-images

# Verificar permissões Docker
docker ps  # Deve funcionar sem sudo
# Se não funcionar:
sudo usermod -aG docker $USER
# Depois fazer logout e login
```

### 4. Testar Deploy

1. Faça um commit na branch `master`:
   ```bash
   git checkout master
   git commit --allow-empty -m "test: trigger CI/CD"
   git push
   ```

2. Vá em **Actions** no GitHub e acompanhe o workflow

3. Verifique no servidor:
   ```bash
   docker service ls | grep alia-client
   docker images | grep alia-client
   ```

## ✅ Pronto!

Agora, sempre que houver push/merge na `master`, o deploy será automático!

## 🔍 Verificar Status

```bash
# No servidor
docker service ls | grep alia-client
docker service logs alia-client_client --tail 20
```

## 🐛 Problemas Comuns

### "Permission denied (publickey)"
- Verifique se a chave privada foi copiada corretamente no secret `DEPLOY_SSH_KEY`
- Verifique se a chave pública está em `~/.ssh/authorized_keys`

### "Cannot connect to Docker daemon"
- Adicione o usuário ao grupo docker: `sudo usermod -aG docker $USER`
- Faça logout e login novamente

### "Service not found"
- Certifique-se de que a stack `alia-client` está criada no Portainer
- Crie a stack usando o `docker-compose.yml` antes de usar o CI/CD

