#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

class ClaudeMonitor {
  constructor() {
    this.tasks = [];
    this.currentTask = null;
    this.progress = 0;
    this.startTime = Date.now();
    this.isRunning = false;
    this.lastActivity = Date.now();
    this.progressInterval = null;
    this.logBuffer = '';
    this.detectedActivity = false;
    this.commandType = null;
    this.detectedFiles = new Set();
    this.activeOperations = new Map();
  }

  // Detecta tipo do comando principal
  detectCommandType(command) {
    if (command.includes('npm run build') || command.includes('yarn build')) return 'build';
    if (command.includes('npm run dev') || command.includes('yarn dev')) return 'dev';
    if (command.includes('npm run lint') || command.includes('yarn lint')) return 'lint';
    if (command.includes('npm run test') || command.includes('yarn test')) return 'test';
    if (command.includes('claude')) return 'claude';
    if (command.includes('git')) return 'git';
    return 'generic';
  }

  // Extrai informações específicas dos logs reais
  extractRealTaskInfo(logLine) {
    // Remove códigos ANSI para análise mais limpa
    const cleanLine = logLine.replace(/\x1B\[[0-9;]*[JKmsu]/g, '');
    
    // ESLint específico - extrai arquivos sendo verificados
    const eslintMatch = cleanLine.match(/(?:Linting|Checking)\s+(.+\.(?:js|ts|jsx|tsx|vue))/i);
    if (eslintMatch) {
      const file = eslintMatch[1];
      this.detectedFiles.add(file);
      return { 
        name: `🔍 Verificando ${file}`, 
        weight: 3,
        file: file,
        operation: 'lint'
      };
    }

    // Next.js build específico
    const nextBuildMatch = cleanLine.match(/(Creating an optimized production build|Compiling|Compiled)/i);
    if (nextBuildMatch) {
      return { 
        name: `🔨 ${nextBuildMatch[1]}...`, 
        weight: 15,
        operation: 'build'
      };
    }

    // TypeScript check específico
    const tscMatch = cleanLine.match(/Found (\d+) error/i);
    if (tscMatch) {
      return { 
        name: `📝 TypeScript: ${tscMatch[1]} erros encontrados`, 
        weight: 5,
        operation: 'typecheck'
      };
    }

    // Webpack/Bundle específico
    const webpackMatch = cleanLine.match(/(webpack|bundling|chunk)/i);
    if (webpackMatch) {
      return { 
        name: `📦 Empacotando recursos`, 
        weight: 20,
        operation: 'bundle'
      };
    }

    // Instalação de pacotes NPM
    const npmInstallMatch = cleanLine.match(/(?:added|removed|changed|audited)\s+(\d+)\s+package/i);
    if (npmInstallMatch) {
      return { 
        name: `📦 ${npmInstallMatch[1]} pacotes processados`, 
        weight: 10,
        operation: 'install'
      };
    }

    // Git operations
    const gitMatch = cleanLine.match(/(Committing|Pushing|Pulling|Merging)/i);
    if (gitMatch) {
      return { 
        name: `🔄 Git: ${gitMatch[1]}`, 
        weight: 8,
        operation: 'git'
      };
    }

    // Claude Code específico (se conseguir capturar)
    const claudeMatch = cleanLine.match(/(?:Reading|Writing|Analyzing|Creating)\s+(.+)/i);
    if (claudeMatch && cleanLine.toLowerCase().includes('claude')) {
      return { 
        name: `🤖 Claude: ${claudeMatch[0]}`, 
        weight: 12,
        operation: 'claude'
      };
    }

    // Padrões genéricos mais específicos
    if (/starting|initializing/i.test(cleanLine)) {
      return { 
        name: `⚡ Inicializando processo`, 
        weight: 5,
        operation: 'init'
      };
    }

    if (/completed|finished|done/i.test(cleanLine)) {
      return { 
        name: `✅ Operação concluída`, 
        weight: 8,
        operation: 'complete'
      };
    }

    return null;
  }

  // Detecta tarefas com informações reais dos logs
  detectTaskFromLog(logLine) {
    // Primeiro tenta extrair info real específica
    const realTask = this.extractRealTaskInfo(logLine);
    if (realTask) return realTask;

    // Fallback para padrões genéricos baseados no tipo de comando
    const fallbackPatterns = {
      build: [
        { pattern: /building|compiling|bundling/i, name: '🔨 Compilando projeto', weight: 25 },
        { pattern: /optimizing|minifying/i, name: '⚡ Otimizando build', weight: 15 },
        { pattern: /analyzing|checking/i, name: '📊 Analisando dependências', weight: 10 }
      ],
      lint: [
        { pattern: /linting|checking|parsing/i, name: '🔍 Verificando código', weight: 8 },
        { pattern: /rules|warnings|errors/i, name: '⚠️ Aplicando regras', weight: 5 }
      ],
      test: [
        { pattern: /running|executing|testing/i, name: '🧪 Executando testes', weight: 15 },
        { pattern: /coverage|assertion/i, name: '📊 Calculando cobertura', weight: 8 }
      ],
      dev: [
        { pattern: /starting|serving|watching/i, name: '🚀 Iniciando servidor', weight: 10 },
        { pattern: /hot|reload|refresh/i, name: '🔄 Hot reload ativo', weight: 5 }
      ],
      claude: [
        { pattern: /reading|analyzing|searching/i, name: '🤖 Claude analisando', weight: 15 },
        { pattern: /writing|creating|generating/i, name: '✏️ Claude gerando código', weight: 20 },
        { pattern: /editing|modifying|updating/i, name: '✏️ Claude editando', weight: 15 }
      ]
    };

    const patterns = fallbackPatterns[this.commandType] || fallbackPatterns.generic || [];
    
    for (const { pattern, name, weight } of patterns) {
      if (pattern.test(logLine)) {
        return { name, weight, operation: this.commandType };
      }
    }
    
    return null;
  }

  // Atualiza o progresso baseado no conteúdo dos logs
  updateProgress(logLine) {
    this.lastActivity = Date.now();
    this.detectedActivity = true;
    
    // Log para debug
    if (process.env.DEBUG) {
      console.log('LOG:', logLine.trim());
    }
    
    const task = this.detectTaskFromLog(logLine);
    
    if (task) {
      // Se é uma nova tarefa diferente da atual
      if (task.name !== this.currentTask) {
        // Completa a tarefa anterior se existir
        if (this.tasks.length > 0 && this.tasks[this.tasks.length - 1].status === 'in_progress') {
          this.tasks[this.tasks.length - 1].status = 'completed';
          this.tasks[this.tasks.length - 1].duration = Date.now() - this.tasks[this.tasks.length - 1].timestamp;
        }
        
        this.currentTask = task.name;
        this.progress = Math.min(this.progress + task.weight, 95);
        
        // Adiciona nova tarefa ao histórico
        this.tasks.push({
          name: task.name,
          status: 'in_progress',
          timestamp: Date.now(),
          operation: task.operation,
          file: task.file,
          duration: null
        });
      } else {
        // Mesma tarefa, apenas incrementa progresso minimamente
        this.progress = Math.min(this.progress + 0.5, 95);
      }
    } else if (logLine.trim().length > 0) {
      // Qualquer atividade, mas sem padrão específico
      this.progress = Math.min(this.progress + 0.2, 95);
      
      if (!this.currentTask) {
        const genericTaskName = this.commandType ? 
          `⚙️ Executando ${this.commandType}` : 
          '⚙️ Processando comando';
          
        this.currentTask = genericTaskName;
        this.tasks.push({
          name: genericTaskName,
          status: 'in_progress',
          timestamp: Date.now(),
          operation: this.commandType || 'generic',
          duration: null
        });
      }
    }

    // Detecta conclusão
    if (/completed|finished|done|success|✅/i.test(logLine)) {
      this.progress = Math.min(this.progress + 8, 100);
      if (this.tasks.length > 0) {
        const lastTask = this.tasks[this.tasks.length - 1];
        lastTask.status = 'completed';
        lastTask.duration = Date.now() - lastTask.timestamp;
      }
    }

    // Detecta erros específicos
    if (/error|failed|exception|\berror\b|\bfailed\b/i.test(logLine)) {
      if (this.tasks.length > 0) {
        const lastTask = this.tasks[this.tasks.length - 1];
        lastTask.status = 'error';
        lastTask.duration = Date.now() - lastTask.timestamp;
        lastTask.errorDetails = logLine.trim().substring(0, 100); // Primeiros 100 chars do erro
      }
    }
    
    // Detecta warnings
    if (/warning|warn/i.test(logLine) && !/error/i.test(logLine)) {
      if (this.tasks.length > 0) {
        const lastTask = this.tasks[this.tasks.length - 1];
        lastTask.hasWarnings = true;
      }
    }
  }

  // Progresso baseado em tempo como fallback
  startTimeBasedProgress() {
    this.progressInterval = setInterval(() => {
      if (!this.isRunning) {
        clearInterval(this.progressInterval);
        return;
      }

      const elapsed = Date.now() - this.startTime;
      const timeSinceActivity = Date.now() - this.lastActivity;
      
      // Se não há atividade detectada, usa progresso baseado em tempo
      if (!this.detectedActivity || timeSinceActivity > 3000) {
        // Progresso mais lento baseado em tempo (simulando atividade)
        const timeProgress = Math.min((elapsed / 30000) * 100, 90); // 30s para 90%
        
        if (timeProgress > this.progress) {
          this.progress = Math.min(timeProgress, 90);
          
          if (!this.currentTask) {
            this.currentTask = '🔄 Executando comando';
            this.tasks.push({
              name: '🔄 Executando comando',
              status: 'in_progress',
              timestamp: Date.now()
            });
          }
        }
      }
    }, 500);
  }

  // Desenha a barra de progresso
  drawProgressBar(percentage) {
    const width = 40;
    const filled = Math.round((percentage / 100) * width);
    const empty = width - filled;
    
    const bar = '█'.repeat(filled) + '░'.repeat(empty);
    const color = percentage >= 100 ? '\x1b[32m' : percentage >= 75 ? '\x1b[33m' : '\x1b[36m';
    const reset = '\x1b[0m';
    
    return `${color}${bar}${reset} ${percentage.toFixed(1)}%`;
  }

  // Formata o tempo decorrido
  formatElapsedTime() {
    const elapsed = Date.now() - this.startTime;
    const seconds = Math.floor(elapsed / 1000) % 60;
    const minutes = Math.floor(elapsed / 60000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  // Formata duração em formato legível
  formatDuration(ms) {
    if (!ms) return '';
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m${remainingSeconds}s`;
  }

  // Desenha a tabela de status com histórico melhorado
  drawTable() {
    console.clear();
    
    console.log('\x1b[1m\x1b[36m┌─ Claude Code Monitor ─────────────────────────────────┐\x1b[0m');
    console.log(`\x1b[1m│\x1b[0m Progresso: ${this.drawProgressBar(this.progress)}`);
    console.log(`\x1b[1m│\x1b[0m Tempo: ${this.formatElapsedTime()}`);
    console.log(`\x1b[1m│\x1b[0m Status: ${this.isRunning ? '\x1b[32m●\x1b[0m Executando' : '\x1b[31m●\x1b[0m Parado'}`);
    
    if (this.currentTask) {
      console.log(`\x1b[1m│\x1b[0m Tarefa atual: ${this.currentTask}`);
    }
    
    // Estatísticas rápidas
    if (this.tasks.length > 0) {
      const completed = this.tasks.filter(t => t.status === 'completed').length;
      const errors = this.tasks.filter(t => t.status === 'error').length;
      const warnings = this.tasks.filter(t => t.hasWarnings).length;
      
      console.log(`\x1b[1m│\x1b[0m Estatísticas: \x1b[32m${completed} ✅\x1b[0m \x1b[31m${errors} ❌\x1b[0m ${warnings > 0 ? `\x1b[33m${warnings} ⚠️\x1b[0m` : ''}`);
    }
    
    console.log('\x1b[1m├───────────────────────────────────────────────────────┤\x1b[0m');
    console.log('\x1b[1m│ Histórico de Tarefas\x1b[0m');
    console.log('\x1b[1m├───────────────────────────────────────────────────────┤\x1b[0m');

    if (this.tasks.length === 0) {
      console.log('\x1b[1m│\x1b[0m \x1b[2mAguardando tarefas...\x1b[0m');
    } else {
      const recentTasks = this.tasks.slice(-6); // Mostra mais tarefas
      recentTasks.forEach((task, index) => {
        const statusIcon = {
          'in_progress': '\x1b[33m⏳\x1b[0m',
          'completed': '\x1b[32m✅\x1b[0m',
          'error': '\x1b[31m❌\x1b[0m'
        }[task.status] || '\x1b[37m●\x1b[0m';
        
        const time = new Date(task.timestamp).toLocaleTimeString();
        const duration = this.formatDuration(task.duration);
        const durationText = duration ? ` \x1b[2m[${duration}]\x1b[0m` : '';
        
        // Mostra warnings se houver
        const warningIcon = task.hasWarnings ? ' \x1b[33m⚠️\x1b[0m' : '';
        
        // Trunca nomes muito longos
        const taskName = task.name.length > 40 ? task.name.substring(0, 37) + '...' : task.name;
        
        console.log(`\x1b[1m│\x1b[0m ${statusIcon} ${taskName}${warningIcon} \x1b[2m(${time})${durationText}\x1b[0m`);
        
        // Mostra detalhes de erro se houver
        if (task.status === 'error' && task.errorDetails) {
          const errorText = task.errorDetails.length > 45 ? task.errorDetails.substring(0, 42) + '...' : task.errorDetails;
          console.log(`\x1b[1m│\x1b[0m   \x1b[31m↳\x1b[0m \x1b[2m${errorText}\x1b[0m`);
        }
      });
    }
    
    // Mostra arquivos detectados se houver
    if (this.detectedFiles.size > 0 && this.detectedFiles.size <= 3) {
      console.log('\x1b[1m├───────────────────────────────────────────────────────┤\x1b[0m');
      console.log('\x1b[1m│ Arquivos Processados\x1b[0m');
      console.log('\x1b[1m├───────────────────────────────────────────────────────┤\x1b[0m');
      Array.from(this.detectedFiles).slice(-3).forEach(file => {
        const shortFile = file.length > 45 ? '...' + file.substring(file.length - 42) : file;
        console.log(`\x1b[1m│\x1b[0m 📄 ${shortFile}`);
      });
    }
    
    console.log('\x1b[1m└───────────────────────────────────────────────────────┘\x1b[0m');
    console.log('\x1b[2mPressione Ctrl+C para sair\x1b[0m');
  }

  // Monitora os logs do Claude
  async monitorClaude(command, args = []) {
    this.isRunning = true;
    this.startTime = Date.now();
    this.lastActivity = Date.now();
    
    // Detecta o tipo de comando para melhor parsing
    const fullCommand = `${command} ${args.join(' ')}`;
    this.commandType = this.detectCommandType(fullCommand);
    
    // Inicia progresso baseado em tempo como fallback
    this.startTimeBasedProgress();
    
    console.log(`🚀 Monitorando comando: ${fullCommand}`);
    console.log(`📋 Tipo detectado: ${this.commandType}`);
    
    const process = spawn(command, args, {
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true
    });

    // Monitora stdout
    process.stdout.on('data', (data) => {
      const output = data.toString();
      this.logBuffer += output;
      
      // Processa linha por linha
      const lines = this.logBuffer.split('\n');
      this.logBuffer = lines.pop() || ''; // Guarda a linha incompleta
      
      lines.forEach(line => {
        if (line.trim()) {
          this.updateProgress(line);
        }
      });
      
      this.drawTable();
    });

    // Monitora stderr
    process.stderr.on('data', (data) => {
      const output = data.toString();
      this.logBuffer += output;
      
      // Processa linha por linha
      const lines = this.logBuffer.split('\n');
      this.logBuffer = lines.pop() || '';
      
      lines.forEach(line => {
        if (line.trim()) {
          this.updateProgress(line);
        }
      });
      
      this.drawTable();
    });

    // Quando o processo termina
    process.on('close', (code) => {
      this.isRunning = false;
      this.progress = 100;
      
      if (this.progressInterval) {
        clearInterval(this.progressInterval);
      }
      
      // Finaliza última tarefa
      if (this.tasks.length > 0) {
        const lastTask = this.tasks[this.tasks.length - 1];
        if (lastTask.status === 'in_progress') {
          lastTask.status = code === 0 ? 'completed' : 'error';
          lastTask.duration = Date.now() - lastTask.timestamp;
        }
      } else {
        // Se não detectou nenhuma tarefa, adiciona uma genérica
        this.tasks.push({
          name: code === 0 ? '✅ Comando executado' : '❌ Comando falhou',
          status: code === 0 ? 'completed' : 'error',
          timestamp: Date.now(),
          duration: Date.now() - this.startTime,
          operation: this.commandType
        });
      }
      
      this.drawTable();
      
      const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      const totalTasks = this.tasks.length;
      const completedTasks = this.tasks.filter(t => t.status === 'completed').length;
      const errorTasks = this.tasks.filter(t => t.status === 'error').length;
      
      console.log(`\n\x1b[1m${code === 0 ? '\x1b[32m✅' : '\x1b[31m❌'} Processo finalizado em ${elapsed}s com código ${code}\x1b[0m`);
      console.log(`📊 Resumo: ${totalTasks} tarefas (${completedTasks} ✅, ${errorTasks} ❌)`);
    });

    // Detecta quando o processo não está gerando logs
    process.on('spawn', () => {
      console.log('✅ Processo iniciado');
      this.updateProgress('Processo iniciado');
      this.drawTable();
    });

    // Atualiza a tela periodicamente
    const updateInterval = setInterval(() => {
      if (!this.isRunning) {
        clearInterval(updateInterval);
        return;
      }
      this.drawTable();
    }, 1000);

    // Primeira renderização
    this.drawTable();

    return process;
  }

  // Simula progresso para demonstração
  async simulate() {
    const simulatedTasks = [
      'Analisando código',
      'Gerando código',
      'Compilando projeto',
      'Executando testes',
      'Formatando código'
    ];

    this.isRunning = true;
    this.startTime = Date.now();

    for (let i = 0; i < simulatedTasks.length; i++) {
      this.currentTask = simulatedTasks[i];
      this.tasks.push({
        name: simulatedTasks[i],
        status: 'in_progress',
        timestamp: Date.now()
      });

      // Simula progresso gradual
      const targetProgress = ((i + 1) / simulatedTasks.length) * 100;
      const currentProgress = this.progress;
      
      for (let p = currentProgress; p < targetProgress; p += 5) {
        this.progress = p;
        this.drawTable();
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      this.tasks[this.tasks.length - 1].status = 'completed';
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    this.progress = 100;
    this.isRunning = false;
    this.drawTable();
    console.log('\n\x1b[32m✅ Simulação concluída!\x1b[0m');
  }
}

// Interface de linha de comando
async function main() {
  const monitor = new ClaudeMonitor();
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Uso:');
    console.log('  node claude-monitor.js simulate        # Executa simulação');
    console.log('  node claude-monitor.js claude <args>   # Monitora comando claude');
    console.log('  node claude-monitor.js npm run build   # Monitora qualquer comando');
    process.exit(1);
  }

  // Captura Ctrl+C para limpeza
  process.on('SIGINT', () => {
    console.log('\n\n\x1b[33m⚠️  Monitor interrompido pelo usuário\x1b[0m');
    process.exit(0);
  });

  if (args[0] === 'simulate') {
    await monitor.simulate();
  } else {
    const command = args.join(' ');
    await monitor.monitorClaude(command);
  }
}

// Executa apenas se for chamado diretamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = ClaudeMonitor;