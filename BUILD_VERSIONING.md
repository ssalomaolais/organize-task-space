<<<<<<< HEAD
# Sistema de Versionamento Automático

Este projeto implementa um sistema de versionamento automático baseado na data de compilação.

## Como Funciona

A versão é gerada automaticamente seguindo o padrão: `AA.MM.DD.BB`

- **AA**: Últimos 2 dígitos do ano (ex: 2025 → 25)
- **MM**: Mês com zero à esquerda (ex: julho → 07)
- **DD**: Dia com zero à esquerda (ex: 7 → 07)
- **BB**: Número da compilação do dia (incrementa automaticamente)

### Exemplo
- Data de compilação: 7 de julho de 2025
- Primeira compilação do dia: `25.07.07.1`
- Segunda compilação do dia: `25.07.07.2`
- Terceira compilação do dia: `25.07.07.3`

## Arquivos do Sistema

- `scripts/build-version.js`: Script principal que gerencia o contador de builds
- `scripts/build-version.d.ts`: Declarações TypeScript
- `.build-counter.json`: Arquivo que armazena o contador de builds (não versionado)
- `vite.config.ts`: Configuração do Vite que define as variáveis de ambiente
- `src/front-end/components/shared/Footer.tsx`: Componente que exibe a versão
- `.github/workflows/node.js.yml`: Workflow CI/CD atualizado

## Comandos Disponíveis

```bash
# Build de produção com versionamento automático
npm run build

# Build de desenvolvimento com versionamento automático
npm run build:dev

# Apenas gerar número da versão
npm run build:version
```

## Como Usar

1. **Desenvolvimento**: A versão será baseada na data atual e sempre será "1"
2. **Build Local**: Execute `npm run build` para gerar uma versão baseada na data de compilação
3. **Múltiplas compilações**: O número da compilação incrementa automaticamente para cada build do mesmo dia
4. **CI/CD**: O sistema funciona automaticamente no GitHub Actions

## Variáveis de Ambiente

O sistema define as seguintes variáveis de ambiente durante o build:

- `VITE_BUILD_DATE`: Data e hora da compilação (ISO string)
- `VITE_BUILD_NUMBER`: Número da compilação do dia

## Contador de Builds

O arquivo `.build-counter.json` mantém um registro das compilações por dia:

```json
{
  "2025-07-07": 3,
  "2025-07-08": 1
}
```

Este arquivo é ignorado pelo Git para não interferir no controle de versão.

## Integração com CI/CD

### GitHub Actions

O workflow `.github/workflows/node.js.yml` foi atualizado para:

1. **Gerar Build Number**: Executa o script de versionamento antes do build
2. **Passar Variáveis**: Define `BUILD_NUMBER` como variável de ambiente
3. **Fallback**: Em caso de erro, usa timestamp como número de build

### Comportamento em CI/CD

- **Ambiente Local**: Usa o arquivo `.build-counter.json` para persistir o contador
- **Ambiente CI/CD**: Tenta usar o contador, mas tem fallback para timestamp
- **Logs**: Exibe informações sobre o número de build gerado

### Exemplo de Workflow

```yaml
- name: Generate Build Version
  id: build-version
  run: |
    BUILD_NUMBER=$(node scripts/build-version.js)
    echo "build_number=$BUILD_NUMBER" >> $GITHUB_OUTPUT

- name: Build App
  env:
    BUILD_NUMBER: ${{ steps.build-version.outputs.build_number }}
  run: npm run build
```

## Fallback para CI/CD

Em ambientes CI/CD onde não é possível escrever o arquivo `.build-counter.json`, o sistema usa um fallback baseado em timestamp:

- Gera um número único baseado nos últimos 3 dígitos do timestamp atual
- Garante que cada build tenha um número diferente
=======
# Sistema de Versionamento Automático

Este projeto implementa um sistema de versionamento automático baseado na data de compilação.

## Como Funciona

A versão é gerada automaticamente seguindo o padrão: `AA.MM.DD.BB`

- **AA**: Últimos 2 dígitos do ano (ex: 2025 → 25)
- **MM**: Mês com zero à esquerda (ex: julho → 07)
- **DD**: Dia com zero à esquerda (ex: 7 → 07)
- **BB**: Número da compilação do dia (incrementa automaticamente)

### Exemplo
- Data de compilação: 7 de julho de 2025
- Primeira compilação do dia: `25.07.07.1`
- Segunda compilação do dia: `25.07.07.2`
- Terceira compilação do dia: `25.07.07.3`

## Arquivos do Sistema

- `scripts/build-version.js`: Script principal que gerencia o contador de builds
- `scripts/build-version.d.ts`: Declarações TypeScript
- `.build-counter.json`: Arquivo que armazena o contador de builds (não versionado)
- `vite.config.ts`: Configuração do Vite que define as variáveis de ambiente
- `src/front-end/components/shared/Footer.tsx`: Componente que exibe a versão
- `.github/workflows/node.js.yml`: Workflow CI/CD atualizado

## Comandos Disponíveis

```bash
# Build de produção com versionamento automático
npm run build

# Build de desenvolvimento com versionamento automático
npm run build:dev

# Apenas gerar número da versão
npm run build:version
```

## Como Usar

1. **Desenvolvimento**: A versão será baseada na data atual e sempre será "1"
2. **Build Local**: Execute `npm run build` para gerar uma versão baseada na data de compilação
3. **Múltiplas compilações**: O número da compilação incrementa automaticamente para cada build do mesmo dia
4. **CI/CD**: O sistema funciona automaticamente no GitHub Actions

## Variáveis de Ambiente

O sistema define as seguintes variáveis de ambiente durante o build:

- `VITE_BUILD_DATE`: Data e hora da compilação (ISO string)
- `VITE_BUILD_NUMBER`: Número da compilação do dia

## Contador de Builds

O arquivo `.build-counter.json` mantém um registro das compilações por dia:

```json
{
  "2025-07-07": 3,
  "2025-07-08": 1
}
```

Este arquivo é ignorado pelo Git para não interferir no controle de versão.

## Integração com CI/CD

### GitHub Actions

O workflow `.github/workflows/node.js.yml` foi atualizado para:

1. **Gerar Build Number**: Executa o script de versionamento antes do build
2. **Passar Variáveis**: Define `BUILD_NUMBER` como variável de ambiente
3. **Fallback**: Em caso de erro, usa timestamp como número de build

### Comportamento em CI/CD

- **Ambiente Local**: Usa o arquivo `.build-counter.json` para persistir o contador
- **Ambiente CI/CD**: Tenta usar o contador, mas tem fallback para timestamp
- **Logs**: Exibe informações sobre o número de build gerado

### Exemplo de Workflow

```yaml
- name: Generate Build Version
  id: build-version
  run: |
    BUILD_NUMBER=$(node scripts/build-version.js)
    echo "build_number=$BUILD_NUMBER" >> $GITHUB_OUTPUT

- name: Build App
  env:
    BUILD_NUMBER: ${{ steps.build-version.outputs.build_number }}
  run: npm run build
```

## Fallback para CI/CD

Em ambientes CI/CD onde não é possível escrever o arquivo `.build-counter.json`, o sistema usa um fallback baseado em timestamp:

- Gera um número único baseado nos últimos 3 dígitos do timestamp atual
- Garante que cada build tenha um número diferente
>>>>>>> e14612f5b969de99aed8a28bb3b611ad29577b10
- Mantém a compatibilidade com o formato de versão 