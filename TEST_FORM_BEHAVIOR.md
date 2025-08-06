# Teste do Comportamento do Formulário

## 🎯 Objetivo

Verificar se o formulário de tarefas só fecha quando a operação é bem-sucedida, mantendo os dados digitados em caso de erro.

## 📋 Cenários de Teste

### 1. Teste de Criação com Sucesso

**Passos:**
1. Clique em "Nova Tarefa"
2. Preencha todos os campos obrigatórios
3. Adicione alguns responsáveis
4. Clique em "Criar Tarefa"

**Resultado Esperado:**
- ✅ Formulário fecha automaticamente
- ✅ Toast de sucesso aparece
- ✅ Tarefa aparece na lista

### 2. Teste de Criação com Erro

**Passos:**
1. Clique em "Nova Tarefa"
2. Preencha todos os campos obrigatórios
3. Adicione alguns responsáveis
4. **Simule um erro** (ex: desconecte a internet ou use dados inválidos)
5. Clique em "Criar Tarefa"

**Resultado Esperado:**
- ❌ Formulário **NÃO fecha**
- ❌ Toast de erro aparece
- ✅ Todos os dados digitados permanecem no formulário
- ✅ Usuário pode corrigir o erro e tentar novamente

### 3. Teste de Edição com Sucesso

**Passos:**
1. Clique em uma tarefa existente para editar
2. Modifique alguns campos
3. Adicione/remova responsáveis
4. Clique em "Atualizar Tarefa"

**Resultado Esperado:**
- ✅ Formulário fecha automaticamente
- ✅ Toast de sucesso aparece
- ✅ Alterações aparecem na lista

### 4. Teste de Edição com Erro

**Passos:**
1. Clique em uma tarefa existente para editar
2. Modifique alguns campos
3. Adicione/remova responsáveis
4. **Simule um erro** (ex: desconecte a internet)
5. Clique em "Atualizar Tarefa"

**Resultado Esperado:**
- ❌ Formulário **NÃO fecha**
- ❌ Toast de erro aparece
- ✅ Todos os dados modificados permanecem no formulário
- ✅ Usuário pode corrigir o erro e tentar novamente

### 5. Teste de Cancelamento

**Passos:**
1. Abra o formulário (criação ou edição)
2. Preencha alguns campos
3. Clique em "Cancelar"

**Resultado Esperado:**
- ✅ Formulário fecha
- ✅ Dados são perdidos (comportamento esperado)

## 🧪 Como Simular Erros

### Método 1: Desconectar Internet
1. Abra o DevTools (F12)
2. Vá para a aba "Network"
3. Marque "Offline"
4. Tente salvar a tarefa

### Método 2: Dados Inválidos
1. Tente salvar com campos obrigatórios vazios
2. Use datas inválidas
3. Use caracteres especiais problemáticos

### Método 3: Erro de Banco
1. Execute o script SQL para remover colunas temporariamente
2. Tente salvar uma tarefa
3. Restaure as colunas

## 🔍 Pontos de Verificação

### ✅ Comportamentos Corretos:
- [ ] Formulário só fecha em caso de sucesso
- [ ] Dados permanecem em caso de erro
- [ ] Toast de erro aparece
- [ ] Usuário pode tentar novamente
- [ ] Cancelamento funciona normalmente

### ❌ Comportamentos Incorretos:
- [ ] Formulário fecha mesmo com erro
- [ ] Dados são perdidos em caso de erro
- [ ] Não há feedback de erro
- [ ] Usuário não pode tentar novamente

## 📊 Logs para Verificar

### Console do Navegador:
```javascript
// Deve aparecer em caso de erro:
console.error('Error creating task:', error);
console.error('Error updating task:', error);

// Deve aparecer em caso de sucesso:
console.log('Task created/updated successfully');
```

### Network Tab:
- Verificar se as requisições falharam
- Verificar códigos de status HTTP
- Verificar payloads enviados

## 🐛 Problemas Comuns

### 1. Formulário fecha mesmo com erro
**Causa:** Lógica de fechamento não está verificando o resultado
**Solução:** Verificar se `result.success` é true antes de fechar

### 2. Dados são perdidos
**Causa:** Estado do formulário é resetado
**Solução:** Manter o estado até confirmação de sucesso

### 3. Toast não aparece
**Causa:** Função toast não está sendo chamada
**Solução:** Verificar se o toast está sendo importado e chamado

### 4. Erro não é capturado
**Causa:** Try/catch não está funcionando
**Solução:** Verificar se o erro está sendo propagado corretamente

## 🎯 Resultado Final

Após todos os testes, o comportamento deve ser:

1. **Sucesso:** Formulário fecha + Toast de sucesso
2. **Erro:** Formulário permanece aberto + Toast de erro + Dados preservados
3. **Cancelamento:** Formulário fecha + Dados perdidos

**🎉 Se todos os cenários funcionarem corretamente, a implementação está perfeita!** 