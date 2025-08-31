#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

class ClaudeMonitorV2 {
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
    this.fileWatchers = new Map();
    this.projectDir = process.cwd();
  }

  // Monitora alterações de arquivos em tempo real
  watchProjectFiles() {
    const commonDirs = ['src', 'app', 'components', 'lib', 'pages', 'utils'];
    const extensions = ['.js', '.ts', '.jsx', '.tsx', '.json', '.md'];
    
    commonDirs.forEach(dir => {
      const dirPath = path.join(this.projectDir, dir);
      if (fs.existsSync(dirPath)) {
        try {
          const watcher = fs.watch(dirPath, { recursive: true }, (eventType, filename) => {
            if (filename && extensions.some(ext => filename.endsWith(ext))) {
              this.handleFileChange(eventType, filename, dirPath);
            }
          });
          this.fileWatchers.set(dir, watcher);
        } catch (err) {
          // Ignora erros de permissão
        }
      }
    });
  }

  // Manipula mudanças de arquivos
  handleFileChange(eventType, filename, dirPath) {
    const fullPath = path.join(dirPath, filename);
    const relativePath = path.relative(this.projectDir, fullPath);
    
    this.lastActivity = Date.now();
    this.detectedActivity = true;
    
    let taskName;
    let weight;
    
    switch (eventType) {
      case 'rename':
        if (fs.existsSync(fullPath)) {
          taskName = `📁 Criando ${relativePath}`;
          weight = 8;
        } else {
          taskName = `🗑️ Removendo ${relativePath}`;
          weight = 5;
        }
        break;
      case 'change':
        taskName = `✏️ Editando ${relativePath}`;
        weight = 6;
        break;
      default:
        taskName = `📝 Modificando ${relativePath}`;
        weight = 4;
    }
    
    this.addTask(taskName, weight, 'file_operation', { file: relativePath, eventType });
    this.detectedFiles.add(relativePath);
    
    // Redesenha imediatamente quando há mudança de arquivo
    this.drawAdvancedTable();
  }

  // Adiciona tarefa ao histórico
  addTask(name, weight, operation, metadata = {}) {
    // Evita duplicar tarefas muito similares
    if (this.currentTask === name) return;
    
    // Completa tarefa anterior
    if (this.tasks.length > 0 && this.tasks[this.tasks.length - 1].status === 'in_progress') {
      const lastTask = this.tasks[this.tasks.length - 1];
      lastTask.status = 'completed';
      lastTask.duration = Date.now() - lastTask.timestamp;
    }
    
    this.currentTask = name;
    this.progress = Math.min(this.progress + weight, 95);
    
    this.tasks.push({
      name: name,
      status: 'in_progress',
      timestamp: Date.now(),
      operation: operation,
      duration: null,
      metadata: metadata
    });
  }

  // Monitora atividade de rede (para APIs e downloads)
  monitorNetworkActivity() {
    // Placeholder - em ambiente real poderia monitorar conexões
    // Por agora, simula atividade de rede baseada em padrões comuns
  }

  // Detecta padrões de atividade do sistema
  detectSystemActivity() {
    const interval = setInterval(() => {
      if (!this.isRunning) {
        clearInterval(interval);
        return;
      }
      
      // Verifica se há atividade de CPU/memória (simulado)
      const cpuActivity = Math.random() > 0.7; // 30% chance
      if (cpuActivity && Date.now() - this.lastActivity > 5000) {
        this.addTask('🔄 Processamento em andamento', 3, 'system_activity');
        this.lastActivity = Date.now();
      }
    }, 2000);
  }

  // Monitora logs específicos com padrões melhorados
  parseClaudeOutput(logLine) {
    const cleanLine = logLine.replace(/\x1B\[[0-9;]*[JKmsu]/g, '').trim();
    if (!cleanLine) return null;

    // Padrões específicos do Claude Code
    const claudePatterns = [
      {
        pattern: /Reading file:|Reading\s+(.+)/i,
        extract: (match) => ({
          name: `📖 Lendo ${match[1] || 'arquivo'}`,
          weight: 8,
          operation: 'read',
          file: match[1]
        })
      },
      {
        pattern: /Writing to file:|Writing\s+(.+)/i,
        extract: (match) => ({
          name: `✏️ Escrevendo ${match[1] || 'arquivo'}`,
          weight: 12,
          operation: 'write',
          file: match[1]
        })
      },
      {
        pattern: /Analyzing|Searching|Looking for/i,
        extract: () => ({
          name: '🔍 Analisando código',
          weight: 10,
          operation: 'analyze'
        })
      },
      {
        pattern: /Creating|Generating/i,
        extract: () => ({
          name: '⚡ Gerando conteúdo',
          weight: 15,
          operation: 'create'
        })
      },
      {
        pattern: /Error:|Failed:|Exception:/i,
        extract: (match) => ({
          name: `❌ Erro detectado`,
          weight: 5,
          operation: 'error',
          error: cleanLine
        })
      },
      {
        pattern: /Tool call:|Using tool:|Invoking/i,
        extract: (match) => ({
          name: '🛠️ Executando ferramenta',
          weight: 7,
          operation: 'tool_call'
        })
      },
      {
        pattern: /Done|Complete|Finished|Success/i,
        extract: () => ({
          name: '✅ Operação concluída',
          weight: 8,
          operation: 'complete'
        })
      }
    ];

    for (const { pattern, extract } of claudePatterns) {
      const match = cleanLine.match(pattern);
      if (match) {
        return extract(match);
      }
    }

    // Se há qualquer saída, considera como atividade genérica
    if (cleanLine.length > 5) {
      return {
        name: '💭 Claude processando...',
        weight: 2,
        operation: 'processing'
      };
    }

    return null;
  }

  // Progresso inteligente baseado em múltiplas fontes
  startIntelligentProgress() {
    let lastProgressUpdate = Date.now();
    
    this.progressInterval = setInterval(() => {
      if (!this.isRunning) {
        clearInterval(this.progressInterval);
        return;
      }

      const now = Date.now();
      const elapsed = now - this.startTime;
      const timeSinceLastActivity = now - this.lastActivity;
      
      // Se há atividade recente, progresso mais rápido
      if (timeSinceLastActivity < 3000) {
        if (now - lastProgressUpdate > 500) {
          this.progress = Math.min(this.progress + 1, 95);
          lastProgressUpdate = now;
        }
      } else {
        // Sem atividade recente, progresso mais lento baseado em tempo
        const timeProgress = Math.min((elapsed / 60000) * 90, 85); // 60s para 85%
        if (timeProgress > this.progress) {
          this.progress = timeProgress;
        }
      }
      
      // Se passou muito tempo sem atividade, adiciona tarefa genérica
      if (timeSinceLastActivity > 10000 && this.tasks.length === 0) {
        this.addTask(`🔄 Executando ${this.commandType || 'comando'}`, 5, 'waiting');
      }
      
    }, 1000);
  }

  // Desenha interface melhorada
  drawAdvancedTable() {
    // Limpa tela de forma mais robusta
    process.stdout.write('\x1B[2J\x1B[H');
    
    const border = '─'.repeat(55);
    console.log(`\x1b[1m\x1b[36m┌─${border}┐\x1b[0m`);
    console.log(`\x1b[1m\x1b[36m│ Claude Code Monitor - Versão Inteligente${' '.repeat(14)}│\x1b[0m`);
    console.log(`\x1b[1m\x1b[36m├─${border}┤\x1b[0m`);
    
    // Informações principais
    console.log(`\x1b[1m│\x1b[0m Progresso: ${this.drawProgressBar(this.progress)}`);
    console.log(`\x1b[1m│\x1b[0m Tempo: ${this.formatElapsedTime()}`);
    console.log(`\x1b[1m│\x1b[0m Status: ${this.isRunning ? '\x1b[32m●\x1b[0m Executando' : '\x1b[31m●\x1b[0m Parado'}`);
    console.log(`\x1b[1m│\x1b[0m Comando: ${this.commandType || 'desconhecido'}`);
    
    if (this.currentTask) {
      const taskDisplay = this.currentTask.length > 45 ? this.currentTask.substring(0, 42) + '...' : this.currentTask;
      console.log(`\x1b[1m│\x1b[0m Atividade: ${taskDisplay}`);
    }
    
    // Estatísticas
    if (this.tasks.length > 0) {
      const completed = this.tasks.filter(t => t.status === 'completed').length;
      const errors = this.tasks.filter(t => t.operation === 'error').length;
      const fileOps = this.tasks.filter(t => t.operation === 'file_operation').length;
      
      console.log(`\x1b[1m│\x1b[0m Stats: \x1b[32m${completed} ✅\x1b[0m \x1b[31m${errors} ❌\x1b[0m \x1b[34m${fileOps} 📁\x1b[0m`);
    }
    
    console.log(`\x1b[1m├─${border}┤\x1b[0m`);
    console.log('\x1b[1m│ Atividades Recentes\x1b[0m');
    console.log(`\x1b[1m├─${border}┤\x1b[0m`);

    if (this.tasks.length === 0) {
      console.log('\x1b[1m│\x1b[0m \x1b[2m🔍 Monitorando atividades...\x1b[0m');
    } else {
      const recentTasks = this.tasks.slice(-7);
      recentTasks.forEach(task => {
        const statusIcon = {
          'in_progress': '\x1b[33m⏳\x1b[0m',
          'completed': '\x1b[32m✅\x1b[0m',
          'error': '\x1b[31m❌\x1b[0m'
        }[task.status] || '\x1b[37m●\x1b[0m';
        
        const time = new Date(task.timestamp).toLocaleTimeString();
        const duration = this.formatDuration(task.duration);
        const durationText = duration ? ` \x1b[2m[${duration}]\x1b[0m` : '';
        
        const taskName = task.name.length > 42 ? task.name.substring(0, 39) + '...' : task.name;
        
        console.log(`\x1b[1m│\x1b[0m ${statusIcon} ${taskName} \x1b[2m${time}${durationText}\x1b[0m`);
      });
    }
    
    // Arquivos detectados
    if (this.detectedFiles.size > 0) {
      console.log(`\x1b[1m├─${border}┤\x1b[0m`);
      console.log('\x1b[1m│ Arquivos Monitorados\x1b[0m');
      console.log(`\x1b[1m├─${border}┤\x1b[0m`);
      
      const files = Array.from(this.detectedFiles).slice(-4);
      files.forEach(file => {
        const shortFile = file.length > 45 ? '...' + file.substring(file.length - 42) : file;
        console.log(`\x1b[1m│\x1b[0m 📄 ${shortFile}`);
      });
    }
    
    console.log(`\x1b[1m└─${border}┘\x1b[0m`);
    console.log('\x1b[2m⌨️  Ctrl+C para sair | 💡 Monitoramento inteligente ativo\x1b[0m');
  }

  // Desenha barra de progresso
  drawProgressBar(percentage) {
    const width = 38;
    const filled = Math.round((percentage / 100) * width);
    const empty = width - filled;
    
    const bar = '█'.repeat(filled) + '░'.repeat(empty);
    const color = percentage >= 100 ? '\x1b[32m' : percentage >= 75 ? '\x1b[33m' : '\x1b[36m';
    const reset = '\x1b[0m';
    
    return `${color}${bar}${reset} ${percentage.toFixed(1)}%`;
  }

  // Formata tempo
  formatElapsedTime() {
    const elapsed = Date.now() - this.startTime;
    const seconds = Math.floor(elapsed / 1000) % 60;
    const minutes = Math.floor(elapsed / 60000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  // Formata duração
  formatDuration(ms) {
    if (!ms) return '';
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m${remainingSeconds}s`;
  }

  // Monitor principal
  async monitor(command, args = []) {
    this.isRunning = true;
    this.startTime = Date.now();
    this.lastActivity = Date.now();
    
    const fullCommand = `${command} ${args.join(' ')}`;
    this.commandType = this.detectCommandType(fullCommand);
    
    console.log(`🚀 Monitor Inteligente iniciado`);
    console.log(`📋 Comando: ${fullCommand}`);
    console.log(`🎯 Tipo: ${this.commandType}`);
    
    // Inicia monitoramento de arquivos
    this.watchProjectFiles();
    
    // Inicia progresso inteligente
    this.startIntelligentProgress();
    
    // Detecta atividade do sistema
    this.detectSystemActivity();
    
    const process = spawn(command, args, {
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true
    });

    let logBuffer = '';
    
    process.stdout.on('data', (data) => {
      const output = data.toString();
      logBuffer += output;
      
      const lines = logBuffer.split('\n');
      logBuffer = lines.pop() || '';
      
      lines.forEach(line => {
        const taskInfo = this.parseClaudeOutput(line);
        if (taskInfo) {
          this.addTask(taskInfo.name, taskInfo.weight, taskInfo.operation, taskInfo);
          // Redesenha imediatamente quando há nova atividade
          this.drawAdvancedTable();
        }
      });
    });

    process.stderr.on('data', (data) => {
      const output = data.toString();
      const taskInfo = this.parseClaudeOutput(output);
      if (taskInfo) {
        this.addTask(taskInfo.name, taskInfo.weight, taskInfo.operation, taskInfo);
        // Redesenha imediatamente quando há nova atividade
        this.drawAdvancedTable();
      }
    });

    process.on('close', (code) => {
      this.isRunning = false;
      this.progress = 100;
      
      // Limpa watchers
      this.fileWatchers.forEach(watcher => watcher.close());
      
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
      }
      
      this.drawAdvancedTable();
      
      const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      const totalTasks = this.tasks.length;
      const completedTasks = this.tasks.filter(t => t.status === 'completed').length;
      const fileOperations = this.detectedFiles.size;
      
      console.log(`\n🏁 \x1b[1m${code === 0 ? '\x1b[32mSucesso' : '\x1b[31mErro'} - ${elapsed}s\x1b[0m`);
      console.log(`📊 ${totalTasks} atividades | ${completedTasks} concluídas | ${fileOperations} arquivos`);
    });

    // Atualização da interface com throttling
    let lastDraw = 0;
    const displayInterval = setInterval(() => {
      if (!this.isRunning) {
        clearInterval(displayInterval);
        return;
      }
      
      const now = Date.now();
      // Só redesenha se passou pelo menos 1.5 segundos
      if (now - lastDraw > 1500) {
        this.drawAdvancedTable();
        lastDraw = now;
      }
    }, 1500);

    this.drawAdvancedTable();
    return process;
  }

  detectCommandType(command) {
    if (command.includes('claude')) return 'claude';
    if (command.includes('npm run build')) return 'build';
    if (command.includes('npm run dev')) return 'dev';
    if (command.includes('npm run lint')) return 'lint';
    return 'generic';
  }
}

// CLI
async function main() {
  const monitor = new ClaudeMonitorV2();
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('🚀 Claude Monitor Inteligente v2.0');
    console.log('');
    console.log('Uso:');
    console.log('  node claude-monitor-v2.js claude <comando>');
    console.log('  node claude-monitor-v2.js npm run build');
    console.log('  node claude-monitor-v2.js <qualquer-comando>');
    process.exit(1);
  }

  process.on('SIGINT', () => {
    console.log('\n\n\x1b[33m👋 Monitor finalizado pelo usuário\x1b[0m');
    process.exit(0);
  });

  const command = args.join(' ');
  await monitor.monitor(command);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = ClaudeMonitorV2;