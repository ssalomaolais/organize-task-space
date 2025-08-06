# Como Executar a Migração no Supabase

## 🚨 Problema Identificado

O erro `Could not find the 'seniority' column of 'tasks'` indica que algumas colunas estão faltando no banco de dados. Vamos resolver isso!

## 📋 Passo a Passo para Executar a Migração

### 1. Acesse o Supabase Dashboard

1. Vá para [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Faça login na sua conta
3. Selecione seu projeto

### 2. Abra o SQL Editor

1. No menu lateral esquerdo, clique em **"SQL Editor"**
2. Clique em **"New query"** para criar uma nova consulta

### 3. Execute o Script

1. **Copie e cole** o conteúdo do arquivo `ADD_MISSING_COLUMNS.sql` no editor
2. Clique em **"Run"** para executar o script

### 4. Verifique o Resultado

O script irá:
- ✅ Adicionar as colunas que estão faltando
- ✅ Criar índices para performance
- ✅ Mostrar a estrutura atualizada da tabela

## 🔍 Verificação Manual

Após executar o script, você pode verificar se tudo funcionou:

### Verificar Colunas Específicas:
```sql
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'tasks' 
    AND column_name IN ('responsibles', 'student_count', 'vacancy_count', 'syllabus', 'seniority')
ORDER BY column_name;
```

### Verificar Estrutura Completa:
```sql
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'tasks' 
ORDER BY ordinal_position;
```

## 📊 Colunas que Serão Adicionadas

| Coluna | Tipo | Padrão | Descrição |
|--------|------|--------|-----------|
| `responsibles` | JSONB | `[]` | Array de responsáveis |
| `student_count` | INTEGER | `0` | Quantidade de alunos |
| `vacancy_count` | INTEGER | `0` | Quantidade de vagas |
| `syllabus` | TEXT | `NULL` | Ementa do curso |
| `seniority` | TEXT | `NULL` | Nível de senioridade |

## ✅ Resultado Esperado

Após executar o script, você deve ver:

1. **Mensagem de sucesso** no SQL Editor
2. **Tabela de resultados** mostrando as colunas criadas
3. **Aplicação funcionando** sem erros

## 🧪 Teste Após a Migração

1. **Recarregue a aplicação** (F5)
2. **Tente criar uma nova tarefa** com responsáveis
3. **Verifique se não há mais erros** no console

## 🆘 Se Ainda Houver Problemas

### Erro: "Column already exists"
- Isso é normal, o script usa `IF NOT EXISTS`
- Pode ignorar esse erro

### Erro: "Permission denied"
- Verifique se você tem permissões de administrador no projeto
- Entre em contato com o administrador do projeto

### Erro: "Connection failed"
- Verifique sua conexão com a internet
- Tente novamente em alguns minutos

## 📞 Suporte

Se você encontrar algum problema:

1. **Copie o erro completo** do console
2. **Tire um screenshot** da tela de erro
3. **Verifique** se todas as colunas foram criadas corretamente

---

**🎯 Após executar este script, a aplicação deve funcionar perfeitamente com o sistema de responsáveis!** 