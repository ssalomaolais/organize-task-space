# Atualização do Sistema de Responsáveis

## Resumo das Mudanças

O sistema de responsáveis foi completamente reformulado para oferecer uma experiência mais organizada e flexível. Em vez de campos individuais de texto, agora utilizamos um array JSON de objetos responsáveis.

## Mudanças Implementadas

### 1. Estrutura de Dados

**Antes:**
```typescript
// Campos individuais de texto
instructors?: string;
responsible_dnw?: string;
responsible_rh?: string;
manager_responsible?: string;
```

**Depois:**
```typescript
// Array de objetos responsáveis
responsibles?: Responsible[];

interface Responsible {
  id: string;
  name: string;
  type: string;
  email?: string;
}
```

### 2. Tipos de Responsáveis Disponíveis

- **Instrutor**: Para instrutores de treinamentos
- **Responsável DNW**: Para responsáveis da área DNW
- **Responsável RH**: Para responsáveis de recursos humanos
- **Gestor**: Para gestores de projeto
- **Coordenador**: Para coordenadores
- **Facilitador**: Para facilitadores de eventos
- **Outro**: Para outros tipos de responsabilidade

### 3. Componente ResponsibleList

Criado um novo componente `ResponsibleList` que oferece:

- **Adição de responsáveis**: Formulário inline para adicionar novos responsáveis
- **Edição**: Possibilidade de editar responsáveis existentes
- **Remoção**: Botão para remover responsáveis
- **Visualização em tabela**: Lista organizada com nome, tipo e email
- **Validação**: Campos obrigatórios (nome e tipo)

### 4. Interface do Usuário

#### TaskForm
- Substituída a aba "Responsáveis" com 4 campos individuais
- Agora usa o componente `ResponsibleList` para gerenciar responsáveis
- Interface mais limpa e organizada

#### TaskCard
- Exibe os responsáveis quando disponíveis
- Mostra os 2 primeiros responsáveis com tipo
- Indica quando há mais responsáveis (+X mais responsáveis)

### 5. Banco de Dados

#### Migração Criada
```sql
-- Add responsibles JSON field to tasks table
ALTER TABLE public.tasks 
ADD COLUMN responsibles JSONB DEFAULT '[]'::jsonb;

-- Create index for better performance on responsibles field
CREATE INDEX idx_tasks_responsibles ON public.tasks USING GIN (responsibles);
```

#### Vantagens do JSONB
- **Flexibilidade**: Estrutura de dados flexível
- **Performance**: Índice GIN para consultas eficientes
- **Validação**: Possibilidade de adicionar constraints JSON
- **Consultas**: Suporte a consultas JSON nativas do PostgreSQL

## Como Usar

### 1. Adicionar Responsáveis
1. Abra o formulário de tarefa
2. Clique em "Mais..." para expandir campos avançados
3. Vá para a aba "Responsáveis"
4. Clique em "Adicionar Responsável"
5. Preencha nome, tipo e email (opcional)
6. Clique em "Adicionar"

### 2. Editar Responsáveis
1. Na lista de responsáveis, clique no ícone de editar
2. Modifique os campos desejados
3. Clique em "Atualizar"

### 3. Remover Responsáveis
1. Na lista de responsáveis, clique no ícone de lixeira
2. O responsável será removido imediatamente

## Benefícios

1. **Organização**: Estrutura clara e organizada dos responsáveis
2. **Flexibilidade**: Fácil adição de novos tipos de responsabilidade
3. **Visualização**: Melhor apresentação dos responsáveis
4. **Manutenibilidade**: Código mais limpo e fácil de manter
5. **Escalabilidade**: Fácil expansão para novos campos de responsável

## Compatibilidade

- **Retrocompatibilidade**: O campo `responsible` original ainda existe
- **Migração**: Tarefas existentes continuam funcionando
- **Gradual**: Nova funcionalidade pode ser usada gradualmente

## Próximos Passos

1. **Migração de dados**: Converter responsáveis existentes para o novo formato
2. **Relatórios**: Criar relatórios baseados nos tipos de responsável
3. **Notificações**: Sistema de notificações por email para responsáveis
4. **Permissões**: Controle de acesso baseado em tipos de responsável 