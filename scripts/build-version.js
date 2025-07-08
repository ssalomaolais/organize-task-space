import fs from 'fs';
import path from 'path';

const BUILD_COUNTER_FILE = './.build-counter.json';

// Função para obter a data atual no formato YYYY-MM-DD
function getCurrentDate() {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

// Função para gerar número de build baseado em timestamp (fallback para CI/CD)
function generateTimestampBuildNumber() {
  const now = new Date();
  const timestamp = now.getTime();
  // Usa os últimos 3 dígitos do timestamp como build number
  return (timestamp % 1000 + 1).toString();
}

// Função para carregar o contador de builds
function loadBuildCounter() {
  try {
    if (fs.existsSync(BUILD_COUNTER_FILE)) {
      const data = fs.readFileSync(BUILD_COUNTER_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.warn('Erro ao carregar contador de builds:', error.message);
  }
  return {};
}

// Função para salvar o contador de builds
function saveBuildCounter(counter) {
  try {
    // Em ambiente CI/CD, pode não ser possível escrever o arquivo
    // Nesse caso, apenas loga o contador
    if (process.env.CI) {
      console.error('CI environment detected, skipping build counter file write');
      console.error('Current build counter:', JSON.stringify(counter, null, 2));
      return;
    }
    
    fs.writeFileSync(BUILD_COUNTER_FILE, JSON.stringify(counter, null, 2));
  } catch (error) {
    console.error('Erro ao salvar contador de builds:', error.message);
  }
}

// Função para obter o próximo número de build para o dia atual
function getNextBuildNumber() {
  const currentDate = getCurrentDate();
  const counter = loadBuildCounter();
  
  if (!counter[currentDate]) {
    counter[currentDate] = 0;
  }
  
  counter[currentDate]++;
  saveBuildCounter(counter);
  
  return counter[currentDate].toString();
}

// Função principal
function main() {
  let buildNumber;
  
  // Em ambiente CI/CD, usa timestamp como fallback se não conseguir escrever o arquivo
  if (process.env.CI) {
    try {
      buildNumber = getNextBuildNumber();
    } catch (error) {
      console.error('Using timestamp-based build number for CI/CD');
      buildNumber = generateTimestampBuildNumber();
    }
  } else {
    buildNumber = getNextBuildNumber();
  }
  
  // Define a variável de ambiente para o processo atual
  process.env.BUILD_NUMBER = buildNumber;
  
  // Se executado diretamente, retorna o número
  if (import.meta.url === `file://${process.argv[1]}`) {
    console.log(buildNumber);
    return buildNumber;
  }
}

// Executa se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { getNextBuildNumber, getCurrentDate, generateTimestampBuildNumber }; 