#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

class ClaudeMonitorV3 {
  constructor() {
    this.tasks = [];
    this.currentTask = null;
    this.progress = 0;
    this.startTime = Date.now();
    this.isRunning = false;
    this.lastActivity = Date.now();
    this.lastDraw = 0;
    this.detectedFiles = new Set();
    this.commandType = null;
    this.updateQueued = false;
  }

  // Desenha interface limpa e estável
  drawTable() {
    // Só redesenha se passou tempo suficiente ou há mudança significativa
    const now = Date.now();
    if (now - this.lastDraw < 1000 && !this.updateQueued) {
      return;
    }
    
    this.lastDraw = now;
    this.updateQueued = false;
    
    // Limpa tela de forma robusta
    process.stdout.write('\x1B[2J\x1B[H');
    
    // Cabeçalho
    console.log('\x1b[1m\x1b[36m┌────────────────────────────────────────────────┐\x1b[0m');
    console.log('\x1b[1m\x1b[36m│ Claude Code Monitor v3.0                      │\x1b[0m');
    console.log('\x1b[1m\x1b[36m├────────────────────────────────────────────────┤\x1b[0m');
    
    // Informações principais
    console.log(`\x1b[1m│\x1b[0m Progresso: ${this.drawProgressBar()}`);
    console.log(`\x1b[1m│\x1b[0m Tempo: ${this.formatTime()}`);
    console.log(`\x1b[1m│\x1b[0m Status: ${this.isRunning ? '\x1b[32m●\x1b[0m Running' : '\x1b[31m●\x1b[0m Stopped'}`);
    console.log(`\x1b[1m│\x1b[0m Comando: ${this.commandType || 'unknown'}`);
    
    if (this.currentTask) {
      const task = this.currentTask.length > 38 ? this.currentTask.substring(0, 35) + '...' : this.currentTask;
      console.log(`\x1b[1m│\x1b[0m Atividade: ${task}`);
    }
    
    // Estatísticas
    if (this.tasks.length > 0) {
      const completed = this.tasks.filter(t => t.status === 'completed').length;
      const errors = this.tasks.filter(t => t.status === 'error').length;
      const files = this.detectedFiles.size;
      
      console.log(`\x1b[1m│\x1b[0m Stats: \x1b[32m${completed} ✅\x1b[0m \x1b[31m${errors} ❌\x1b[0m \x1b[34m${files} 📁\x1b[0m`);
    }
    
    console.log('\x1b[1m├────────────────────────────────────────────────┤\x1b[0m');
    console.log('\x1b[1m│ Histórico (últimas 5 atividades)              │\x1b[0m');
    console.log('\x1b[1m├────────────────────────────────────────────────┤\x1b[0m');

    if (this.tasks.length === 0) {
      console.log('\x1b[1m│\x1b[0m \x1b[2m🔍 Aguardando atividades...\x1b[0m');
    } else {
      const recent = this.tasks.slice(-5);
      recent.forEach(task => {
        const icon = {
          'in_progress': '\x1b[33m⏳\x1b[0m',
          'completed': '\x1b[32m✅\x1b[0m',
          'error': '\x1b[31m❌\x1b[0m'
        }[task.status] || '●';
        
        const time = new Date(task.timestamp).toLocaleTimeString();
        const name = task.name.length > 35 ? task.name.substring(0, 32) + '...' : task.name;
        const duration = task.duration ? `[${this.formatDuration(task.duration)}]` : '';
        
        console.log(`\x1b[1m│\x1b[0m ${icon} ${name} \x1b[2m${time} ${duration}\x1b[0m`);
      });
    }
    
    // Arquivos se houver
    if (this.detectedFiles.size > 0 && this.detectedFiles.size <= 4) {
      console.log('\x1b[1m├────────────────────────────────────────────────┤\x1b[0m');
      console.log('\x1b[1m│ Arquivos Alterados                            │\x1b[0m');
      console.log('\x1b[1m├────────────────────────────────────────────────┤\x1b[0m');
      Array.from(this.detectedFiles).slice(-4).forEach(file => {
        const short = file.length > 40 ? '...' + file.substring(file.length - 37) : file;
        console.log(`\x1b[1m│\x1b[0m 📄 ${short}`);
      });
    }
    
    console.log('\x1b[1m└────────────────────────────────────────────────┘\x1b[0m');
    console.log('\x1b[2mCtrl+C para sair\x1b[0m');
  }

  // Barra de progresso
  drawProgressBar() {
    const width = 30;
    const filled = Math.round((this.progress / 100) * width);
    const bar = '█'.repeat(filled) + '░'.repeat(width - filled);
    const color = this.progress >= 100 ? '\x1b[32m' : this.progress >= 75 ? '\x1b[33m' : '\x1b[36m';
    return `${color}${bar}\x1b[0m ${this.progress.toFixed(1)}%`;
  }

  // Formata tempo
  formatTime() {
    const elapsed = Date.now() - this.startTime;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  // Formata duração
  formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    return seconds < 60 ? `${seconds}s` : `${Math.floor(seconds / 60)}m${seconds % 60}s`;
  }

  // Adiciona tarefa ao histórico
  addTask(name, weight = 5, status = 'in_progress') {
    // Evita tarefas duplicadas muito próximas
    if (this.currentTask === name) return;
    
    // Finaliza tarefa anterior
    if (this.tasks.length > 0) {
      const last = this.tasks[this.tasks.length - 1];
      if (last.status === 'in_progress') {
        last.status = 'completed';
        last.duration = Date.now() - last.timestamp;
      }
    }
    
    this.currentTask = name;
    this.progress = Math.min(this.progress + weight, 95);
    this.lastActivity = Date.now();
    
    this.tasks.push({
      name,
      status,
      timestamp: Date.now(),
      duration: null
    });
    
    this.scheduleUpdate();
  }

  // Agenda atualização (throttled)
  scheduleUpdate() {
    if (this.updateQueued) return;
    this.updateQueued = true;
    
    setTimeout(() => {
      this.drawTable();
    }, 100);
  }

  // Detecta tipo de comando
  detectCommandType(command) {
    if (command.includes('claude')) return 'claude';
    if (command.includes('build')) return 'build';
    if (command.includes('dev')) return 'dev';
    if (command.includes('lint')) return 'lint';
    if (command.includes('test')) return 'test';
    return 'generic';
  }

  // Parser de logs melhorado
  parseOutput(line) {
    const clean = line.replace(/\x1B\[[0-9;]*[JKmsu]/g, '').trim();
    if (!clean || clean.length < 3) return null;

    // Padrões Claude Code
    if (/reading|analyzing|searching/i.test(clean)) {
      return { name: '🔍 Analisando código', weight: 10 };
    }
    if (/writing|creating|generating/i.test(clean)) {
      return { name: '✏️ Gerando código', weight: 15 };
    }
    if (/editing|modifying|updating/i.test(clean)) {
      return { name: '📝 Editando arquivo', weight: 12 };
    }
    if (/error|failed|exception/i.test(clean)) {
      return { name: '❌ Erro detectado', weight: 3, status: 'error' };
    }
    if (/completed|finished|done|success/i.test(clean)) {
      return { name: '✅ Operação concluída', weight: 8 };
    }

    // Padrões de build/npm
    if (/compiling|building/i.test(clean)) {
      return { name: '🔨 Compilando', weight: 20 };
    }
    if (/linting|checking/i.test(clean)) {
      return { name: '🔍 Verificando código', weight: 8 };
    }
    if (/installing|downloading/i.test(clean)) {
      return { name: '📦 Instalando', weight: 12 };
    }

    // Atividade genérica para outputs significativos
    if (clean.length > 10) {
      return { name: '⚙️ Processando...', weight: 2 };
    }

    return null;
  }

  // Progresso automático baseado em tempo
  startProgressTimer() {
    const timer = setInterval(() => {
      if (!this.isRunning) {
        clearInterval(timer);
        return;
      }

      const elapsed = Date.now() - this.startTime;
      const timeSinceActivity = Date.now() - this.lastActivity;
      
      // Progresso automático se não há atividade
      if (timeSinceActivity > 5000) {
        const autoProgress = Math.min((elapsed / 60000) * 80, 80); // 60s = 80%
        if (autoProgress > this.progress) {
          this.progress = autoProgress;
          this.scheduleUpdate();
        }
      }
      
      // Adiciona tarefa genérica se muito tempo sem atividade
      if (timeSinceActivity > 15000 && this.tasks.length === 0) {
        this.addTask(`🔄 Executando ${this.commandType}`);
      }
      
    }, 2000);
  }

  // Monitora arquivos do projeto
  watchFiles() {
    const dirs = ['src', 'app', 'components', 'lib', 'pages'];
    const extensions = ['.js', '.ts', '.jsx', '.tsx', '.json'];
    
    dirs.forEach(dir => {
      const dirPath = path.join(process.cwd(), dir);
      if (fs.existsSync(dirPath)) {
        try {
          fs.watch(dirPath, { recursive: true }, (event, filename) => {
            if (filename && extensions.some(ext => filename.endsWith(ext))) {
              const action = event === 'rename' ? 'Modificando' : 'Editando';
              this.addTask(`📁 ${action} ${filename}`, 6);
              this.detectedFiles.add(filename);
            }
          });
        } catch (err) {
          // Ignora erros de permissão
        }
      }
    });
  }

  // Monitor principal
  async monitor(command, args = []) {
    const fullCommand = `${command} ${args.join(' ')}`;
    this.commandType = this.detectCommandType(fullCommand);
    this.isRunning = true;
    
    console.log(`🚀 Iniciando monitor para: ${fullCommand}`);
    
    // Inicia sistemas de monitoramento
    this.watchFiles();
    this.startProgressTimer();
    
    // Spawn do processo
    const proc = spawn(command, args, {
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true
    });

    let buffer = '';
    
    // Monitora stdout
    proc.stdout.on('data', (data) => {
      buffer += data.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      
      lines.forEach(line => {
        const parsed = this.parseOutput(line);
        if (parsed) {
          this.addTask(parsed.name, parsed.weight, parsed.status);
        }
      });
    });

    // Monitora stderr
    proc.stderr.on('data', (data) => {
      const parsed = this.parseOutput(data.toString());
      if (parsed) {
        this.addTask(parsed.name, parsed.weight, parsed.status || 'error');
      }
    });

    // Quando termina
    proc.on('close', (code) => {
      this.isRunning = false;
      this.progress = 100;
      
      // Finaliza última tarefa
      if (this.tasks.length > 0) {
        const last = this.tasks[this.tasks.length - 1];
        if (last.status === 'in_progress') {
          last.status = code === 0 ? 'completed' : 'error';
          last.duration = Date.now() - last.timestamp;
        }
      }
      
      this.drawTable();
      
      const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      console.log(`\n🏁 ${code === 0 ? '\x1b[32m✅ Sucesso' : '\x1b[31m❌ Erro'} (${elapsed}s)\x1b[0m`);
      console.log(`📊 ${this.tasks.length} atividades | ${this.detectedFiles.size} arquivos`);
    });

    // Primeira renderização
    this.drawTable();
    
    // Timer de atualização periódica (bem espaçado)
    const displayTimer = setInterval(() => {
      if (!this.isRunning) {
        clearInterval(displayTimer);
        return;
      }
      this.drawTable();
    }, 3000); // A cada 3 segundos

    return proc;
  }
}

// CLI
async function main() {
  const monitor = new ClaudeMonitorV3();
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('🚀 Claude Monitor v3.0 - Estável');
    console.log('Uso: node claude-monitor-v3.js <comando>');
    console.log('');
    console.log('Exemplos:');
    console.log('  node claude-monitor-v3.js claude /analyze');
    console.log('  node claude-monitor-v3.js npm run build');
    console.log('  node claude-monitor-v3.js npm run dev');
    process.exit(1);
  }

  process.on('SIGINT', () => {
    console.log('\n\n👋 Monitor finalizado');
    process.exit(0);
  });

  const command = args.join(' ');
  await monitor.monitor(command);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = ClaudeMonitorV3;