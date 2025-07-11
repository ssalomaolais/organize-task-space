const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');

const app = express();
const port = 3001; // Porta para o backend

// Configure AWS SDK
// IMPORTANTE: Para produção, use roles IAM ou variáveis de ambiente, NÃO credenciais hardcoded.
AWS.config.update({
  region: process.env.AWS_REGION || 'us-east-1', // Substitua pela sua região AWS
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

app.use(cors()); // Habilita CORS para permitir requisições do frontend
app.use(express.json()); // Habilita o parsing de JSON no corpo das requisições

// Rota básica para testar se o backend está funcionando
app.get('/', (req, res) => {
  res.send('TaskFlow Backend está rodando!');
});

// Exemplo: Rota para obter todas as tarefas do DynamoDB
// Você precisará criar uma tabela 'tasks' no DynamoDB com 'id' como Partition Key.
app.get('/tasks', async (req, res) => {
  const params = {
    TableName: 'tasks' // Substitua pelo nome da sua tabela DynamoDB para tarefas
  };

  try {
    const data = await dynamodb.scan(params).promise();
    res.json(data.Items);
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
    res.status(500).json({ error: 'Não foi possível buscar as tarefas' });
  }
});

// Placeholder para outras operações CRUD (criar, atualizar, deletar) para tarefas, perfis, etc.
// Você precisará implementar essas rotas com base no design das suas tabelas DynamoDB.

app.listen(port, () => {
  console.log(`TaskFlow Backend ouvindo em http://localhost:${port}`);
});