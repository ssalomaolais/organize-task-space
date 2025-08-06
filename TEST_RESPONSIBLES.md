<<<<<<< HEAD
# Teste da Funcionalidade de Responsáveis

## Como Testar

### 1. Criar uma Nova Tarefa com Responsáveis

1. **Acesse a aplicação** e faça login
2. **Clique em "Nova Tarefa"**
3. **Preencha os campos básicos**:
   - Título: "Teste de Responsáveis"
   - Sub Título: "Teste da nova funcionalidade"
   - Resumo: "Testando o sistema de responsáveis"
   - Responsável: "João Silva"
   - Comunidade: "Java"
   - Data e Hora de Início: Hoje às 10:00
   - Data e Hora Fim: Hoje às 12:00
   - Horas Estimadas: 2
   - Número de Pessoas: 5
   - Status: "Pendente"
   - Tipo de Evento: "Outros"

4. **Clique em "Mais..."** para expandir campos avançados
5. **Vá para a aba "Responsáveis"**
6. **Adicione responsáveis**:
   - Clique em "Adicionar Responsável"
   - Nome: "Maria Santos"
   - Tipo: "Instrutor"
   - Email: "maria@exemplo.com"
   - Clique em "Adicionar"

   - Clique em "Adicionar Responsável" novamente
   - Nome: "Pedro Costa"
   - Tipo: "Responsável DNW"
   - Email: "pedro@exemplo.com"
   - Clique em "Adicionar"

   - Clique em "Adicionar Responsável" novamente
   - Nome: "Ana Oliveira"
   - Tipo: "Gestor"
   - Email: "ana@exemplo.com"
   - Clique em "Adicionar"

7. **Clique em "Criar Tarefa"**

### 2. Verificar se os Responsáveis Foram Salvos

1. **Verifique se a tarefa foi criada** na lista
2. **Clique na tarefa** para editar
3. **Vá para a aba "Responsáveis"**
4. **Verifique se os 3 responsáveis estão listados**:
   - Maria Santos (Instrutor)
   - Pedro Costa (DNW)
   - Ana Oliveira (Gestor)

### 3. Testar Edição de Responsáveis

1. **Na lista de responsáveis**, clique no ícone de editar ao lado de "Maria Santos"
2. **Altere o nome** para "Maria Silva"
3. **Clique em "Atualizar"**
4. **Verifique se a alteração foi salva**

### 4. Testar Remoção de Responsáveis

1. **Clique no ícone de lixeira** ao lado de "Pedro Costa"
2. **Verifique se o responsável foi removido** da lista

### 5. Verificar Exibição no TaskCard

1. **Volte para a lista de tarefas**
2. **Verifique se os responsáveis aparecem** no card da tarefa:
   - Deve mostrar "Responsáveis:" seguido dos nomes
   - Deve mostrar os tipos entre parênteses
   - Se houver mais de 2 responsáveis, deve mostrar "+X mais responsáveis"

### 6. Testar Persistência no Banco

1. **Recarregue a página** (F5)
2. **Verifique se os responsáveis ainda estão lá** após o recarregamento

## Resultados Esperados

### ✅ Funcionalidades que Devem Funcionar:

1. **Adição de responsáveis**: Deve permitir adicionar múltiplos responsáveis
2. **Edição de responsáveis**: Deve permitir editar nome, tipo e email
3. **Remoção de responsáveis**: Deve permitir remover responsáveis
4. **Validação**: Campos nome e tipo são obrigatórios
5. **Persistência**: Dados devem ser salvos no banco de dados
6. **Exibição**: Responsáveis devem aparecer no TaskCard
7. **Tipos**: Deve mostrar labels amigáveis (Instrutor, DNW, RH, etc.)

### ❌ Problemas que Devem Ser Reportados:

1. **Erro ao salvar**: Se aparecer erro ao criar/editar tarefa
2. **Responsáveis não aparecem**: Se os responsáveis não são exibidos
3. **Dados não persistem**: Se os responsáveis somem após recarregar
4. **Interface quebrada**: Se a interface não carrega corretamente
5. **Erros de console**: Se aparecem erros no console do navegador

## Dados de Teste

### Responsáveis de Exemplo:

```json
[
  {
    "id": "1",
    "name": "Maria Santos",
    "type": "instructor",
    "email": "maria@exemplo.com"
  },
  {
    "id": "2", 
    "name": "Pedro Costa",
    "type": "responsible_dnw",
    "email": "pedro@exemplo.com"
  },
  {
    "id": "3",
    "name": "Ana Oliveira", 
    "type": "manager",
    "email": "ana@exemplo.com"
  }
]
```

### Tipos Disponíveis:

- `instructor` → "Instrutor"
- `responsible_dnw` → "DNW"
- `responsible_rh` → "RH"
- `manager` → "Gestor"
- `coordinator` → "Coordenador"
- `facilitator` → "Facilitador"
- `other` → "Outro"

## Comandos Úteis para Debug

### Verificar Console do Navegador:
```javascript
// Verificar se os dados estão sendo enviados corretamente
console.log('Task data:', taskData);

// Verificar se os responsáveis estão sendo carregados
console.log('Task responsibles:', task.responsibles);
```

### Verificar Banco de Dados:
```sql
-- Verificar se o campo responsibles foi criado
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'tasks' AND column_name = 'responsibles';

-- Verificar dados salvos
SELECT id, title, responsibles 
FROM tasks 
WHERE responsibles IS NOT NULL;
=======
# Teste da Funcionalidade de Responsáveis

## Como Testar

### 1. Criar uma Nova Tarefa com Responsáveis

1. **Acesse a aplicação** e faça login
2. **Clique em "Nova Tarefa"**
3. **Preencha os campos básicos**:
   - Título: "Teste de Responsáveis"
   - Sub Título: "Teste da nova funcionalidade"
   - Resumo: "Testando o sistema de responsáveis"
   - Responsável: "João Silva"
   - Comunidade: "Java"
   - Data e Hora de Início: Hoje às 10:00
   - Data e Hora Fim: Hoje às 12:00
   - Horas Estimadas: 2
   - Número de Pessoas: 5
   - Status: "Pendente"
   - Tipo de Evento: "Outros"

4. **Clique em "Mais..."** para expandir campos avançados
5. **Vá para a aba "Responsáveis"**
6. **Adicione responsáveis**:
   - Clique em "Adicionar Responsável"
   - Nome: "Maria Santos"
   - Tipo: "Instrutor"
   - Email: "maria@exemplo.com"
   - Clique em "Adicionar"

   - Clique em "Adicionar Responsável" novamente
   - Nome: "Pedro Costa"
   - Tipo: "Responsável DNW"
   - Email: "pedro@exemplo.com"
   - Clique em "Adicionar"

   - Clique em "Adicionar Responsável" novamente
   - Nome: "Ana Oliveira"
   - Tipo: "Gestor"
   - Email: "ana@exemplo.com"
   - Clique em "Adicionar"

7. **Clique em "Criar Tarefa"**

### 2. Verificar se os Responsáveis Foram Salvos

1. **Verifique se a tarefa foi criada** na lista
2. **Clique na tarefa** para editar
3. **Vá para a aba "Responsáveis"**
4. **Verifique se os 3 responsáveis estão listados**:
   - Maria Santos (Instrutor)
   - Pedro Costa (DNW)
   - Ana Oliveira (Gestor)

### 3. Testar Edição de Responsáveis

1. **Na lista de responsáveis**, clique no ícone de editar ao lado de "Maria Santos"
2. **Altere o nome** para "Maria Silva"
3. **Clique em "Atualizar"**
4. **Verifique se a alteração foi salva**

### 4. Testar Remoção de Responsáveis

1. **Clique no ícone de lixeira** ao lado de "Pedro Costa"
2. **Verifique se o responsável foi removido** da lista

### 5. Verificar Exibição no TaskCard

1. **Volte para a lista de tarefas**
2. **Verifique se os responsáveis aparecem** no card da tarefa:
   - Deve mostrar "Responsáveis:" seguido dos nomes
   - Deve mostrar os tipos entre parênteses
   - Se houver mais de 2 responsáveis, deve mostrar "+X mais responsáveis"

### 6. Testar Persistência no Banco

1. **Recarregue a página** (F5)
2. **Verifique se os responsáveis ainda estão lá** após o recarregamento

## Resultados Esperados

### ✅ Funcionalidades que Devem Funcionar:

1. **Adição de responsáveis**: Deve permitir adicionar múltiplos responsáveis
2. **Edição de responsáveis**: Deve permitir editar nome, tipo e email
3. **Remoção de responsáveis**: Deve permitir remover responsáveis
4. **Validação**: Campos nome e tipo são obrigatórios
5. **Persistência**: Dados devem ser salvos no banco de dados
6. **Exibição**: Responsáveis devem aparecer no TaskCard
7. **Tipos**: Deve mostrar labels amigáveis (Instrutor, DNW, RH, etc.)

### ❌ Problemas que Devem Ser Reportados:

1. **Erro ao salvar**: Se aparecer erro ao criar/editar tarefa
2. **Responsáveis não aparecem**: Se os responsáveis não são exibidos
3. **Dados não persistem**: Se os responsáveis somem após recarregar
4. **Interface quebrada**: Se a interface não carrega corretamente
5. **Erros de console**: Se aparecem erros no console do navegador

## Dados de Teste

### Responsáveis de Exemplo:

```json
[
  {
    "id": "1",
    "name": "Maria Santos",
    "type": "instructor",
    "email": "maria@exemplo.com"
  },
  {
    "id": "2", 
    "name": "Pedro Costa",
    "type": "responsible_dnw",
    "email": "pedro@exemplo.com"
  },
  {
    "id": "3",
    "name": "Ana Oliveira", 
    "type": "manager",
    "email": "ana@exemplo.com"
  }
]
```

### Tipos Disponíveis:

- `instructor` → "Instrutor"
- `responsible_dnw` → "DNW"
- `responsible_rh` → "RH"
- `manager` → "Gestor"
- `coordinator` → "Coordenador"
- `facilitator` → "Facilitador"
- `other` → "Outro"

## Comandos Úteis para Debug

### Verificar Console do Navegador:
```javascript
// Verificar se os dados estão sendo enviados corretamente
console.log('Task data:', taskData);

// Verificar se os responsáveis estão sendo carregados
console.log('Task responsibles:', task.responsibles);
```

### Verificar Banco de Dados:
```sql
-- Verificar se o campo responsibles foi criado
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'tasks' AND column_name = 'responsibles';

-- Verificar dados salvos
SELECT id, title, responsibles 
FROM tasks 
WHERE responsibles IS NOT NULL;
>>>>>>> e14612f5b969de99aed8a28bb3b611ad29577b10
``` 