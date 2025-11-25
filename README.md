# Sprint Time Tracker

Sistema de rastreamento de horas trabalhadas em sprints com Firebase

## 🚀 Instalação

```bash
npm install
```

## 🔐 Configuração de Segurança

### 1. Credenciais do Firebase

O arquivo de credenciais JSON do Firebase **NÃO** deve ser commitado. Ele já está protegido pelo `.gitignore`.

**Localização atual**: `my-payment-app-3b0ed-firebase-adminsdk-fbsvc-d19e68f4ce.json` (raiz do projeto)

### 2. Variáveis de Ambiente (Opcional)

Copie o arquivo de exemplo:
```bash
cp .env.example .env
```

Edite `.env` com sua URL do Firebase:
```
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com
```

> **Nota**: O `.env` já está no `.gitignore` e não será commitado.

## 🏃 Executar

```bash
npm start
```

## 📦 Build

```bash
npm run package
```

## 🔒 Arquivos Sensíveis Protegidos

O `.gitignore` está configurado para **NÃO** commitar:
- `*.json` (exceto package.json, package-lock.json, tsconfig.json)
- `.env` e `.env.local`
- Credenciais do Firebase

## ✨ Funcionalidades

- ✅ Criar e gerenciar múltiplas sprints
- ✅ Registrar horas trabalhadas com descrição e link
- ✅ Exportar relatório em CSV
- ✅ Modo escuro/claro
- ✅ Persistência no Firebase Firestore
- ✅ Interface moderna e responsiva

## 📝 Como Usar

1. **Criar Sprint**: Clique no botão `+` na sidebar
2. **Adicionar Horas**: Preencha o formulário com horas, descrição e link opcional
3. **Exportar CSV**: Clique em "Gerar CSV" para baixar relatório
4. **Alternar Tema**: Use o botão sol/lua no header

## ⚠️ Antes do Primeiro Commit

Certifique-se de que os arquivos sensíveis não estão sendo rastreados:

```bash
git status
```

Se aparecer o arquivo JSON de credenciais, remova-o:
```bash
git rm --cached my-payment-app-3b0ed-firebase-adminsdk-fbsvc-d19e68f4ce.json
```

## 🔧 Tecnologias

- Electron
- React
- TypeScript
- Firebase Admin SDK
- CSS Modules
