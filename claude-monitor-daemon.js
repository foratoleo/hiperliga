#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn, exec } = require('child_process');

class ClaudeMonitorDaemon {
  constructor() {
    this.tasks = [];
    this.currentTask = null;
    this.progress = 0;
    this.startTime = Date.now();
    this.isRunning = true;
    this.lastActivity = Date.now();
    this.detectedFiles = new Set();
    this.claudeProcesses = new Set();
    this.fileWatchers = [];
    this.projectDir = process.cwd();
    this.lastDraw = 0;
  }

  // Inicia o daemon monitor
  async startDaemon() {
    console.log('🚀 Claude Monitor Daemon iniciado');
    console.log('📁 Monitorando projeto:', this.projectDir);
    console.log('👁️  Detectando atividades do Claude...');
    console.log('');

    // Inicia todos os sistemas de monitoramento
    this.watchProjectFiles();
    this.monitorClaudeProcesses();
    this.startProgressTracking();
    this.startDisplay();

    // Adiciona tarefa inicial
    this.addTask('🎯 Monitor Daemon ativo', 5);

    // Mantém o processo rodando
    process.on('SIGINT', () => {
      this.shutdown();
    });

    // Loop principal
    setInterval(() => {
      this.updateStatus();
    }, 2000);
  }

  // Monitora arquivos do projeto em tempo real
  watchProjectFiles() {
    const dirsToWatch = [
      'src', 'app', 'components', 'lib', 'pages', 'utils', 
      'hooks', 'context', 'services', 'styles', 'public'
    ];
    const extensions = ['.js', '.ts', '.jsx', '.tsx', '.json', '.md', '.css', '.scss'];
    
    dirsToWatch.forEach(dir => {
      const fullPath = path.join(this.projectDir, dir);
      if (fs.existsSync(fullPath)) {
        try {
          const watcher = fs.watch(fullPath, { recursive: true }, (eventType, filename) => {
            if (filename && extensions.some(ext => filename.endsWith(ext))) {
              this.handleFileActivity(eventType, filename, dir);
            }
          });
          this.fileWatchers.push({ dir, watcher });
        } catch (err) {
          // Ignora erros de permissão
        }
      }
    });

    // Monitora arquivos na raiz também
    try {
      const rootWatcher = fs.watch(this.projectDir, (eventType, filename) => {
        if (filename && ['.env', 'package.json', 'tsconfig.json', 'next.config.js'].includes(filename)) {
          this.handleFileActivity(eventType, filename, '.');
        }
      });
      this.fileWatchers.push({ dir: 'root', watcher: rootWatcher });
    } catch (err) {
      // Ignora erros
    }

    console.log(`📂 Monitorando ${this.fileWatchers.length} diretórios`);
  }

  // Detecta atividade de arquivo
  handleFileActivity(eventType, filename, dir) {
    const fullPath = dir === '.' ? filename : path.join(dir, filename);
    this.lastActivity = Date.now();
    this.detectedFiles.add(fullPath);

    let action, emoji, weight;
    
    switch (eventType) {
      case 'rename':
        const exists = fs.existsSync(path.join(this.projectDir, fullPath));
        action = exists ? 'Criando' : 'Removendo';
        emoji = exists ? '📁' : '🗑️';
        weight = exists ? 8 : 5;
        break;
      case 'change':
        action = 'Editando';
        emoji = '✏️';
        weight = 6;
        break;
      default:
        action = 'Modificando';
        emoji = '📝';
        weight = 4;
    }

    this.addTask(`${emoji} ${action} ${fullPath}`, weight);
  }

  // Monitora processos do Claude
  monitorClaudeProcesses() {
    setInterval(() => {
      exec('ps aux | grep -i claude | grep -v grep', (error, stdout) => {
        if (!error && stdout.trim()) {
          const processes = stdout.trim().split('\n');
          const newProcessCount = processes.length;
          
          if (newProcessCount !== this.claudeProcesses.size) {
            this.claudeProcesses.clear();
            processes.forEach((proc, i) => {
              this.claudeProcesses.add(`claude-${i}`);
            });
            
            this.addTask(`🤖 ${newProcessCount} processo(s) Claude detectados`, 10);
          }
        }
      });
    }, 5000);
  }

  // Adiciona tarefa ao histórico
  addTask(name, weight = 5, status = 'in_progress') {
    // Evita spam de tarefas similares
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

    // Limita histórico a 50 tarefas
    if (this.tasks.length > 50) {
      this.tasks = this.tasks.slice(-50);
    }
  }

  // Atualiza status geral
  updateStatus() {
    const timeSinceActivity = Date.now() - this.lastActivity;
    
    // Se muito tempo sem atividade, adiciona tarefa de monitoramento
    if (timeSinceActivity > 30000 && this.tasks.length > 0) {
      const lastTask = this.tasks[this.tasks.length - 1];
      if (!lastTask.name.includes('Aguardando')) {
        this.addTask('👁️ Aguardando atividades...', 1);
      }
    }

    // Progresso automático baseado em tempo
    const elapsed = Date.now() - this.startTime;
    const timeProgress = Math.min((elapsed / 300000) * 100, 100); // 5 minutos para 100%
    if (timeProgress > this.progress) {
      this.progress = timeProgress;
    }
  }

  // Sistema de display
  startDisplay() {
    setInterval(() => {
      this.drawDaemonStatus();
    }, 3000);
  }

  // Tracking de progresso contínuo
  startProgressTracking() {
    setInterval(() => {
      // Progresso baseado em atividade
      if (this.tasks.length > 0) {
        const recentActivity = this.tasks.filter(t => 
          Date.now() - t.timestamp < 60000 // Últimos 60 segundos
        ).length;
        
        if (recentActivity > 0) {
          this.progress = Math.min(this.progress + recentActivity * 2, 95);
        }
      }
    }, 10000);
  }

  // Desenha status do daemon
  drawDaemonStatus() {
    const now = Date.now();
    if (now - this.lastDraw < 2500) return; // Throttle
    this.lastDraw = now;

    // Limpa tela
    process.stdout.write('\x1B[2J\x1B[H');
    
    console.log('🔥 \x1b[1m\x1b[36mClaude Monitor Daemon - Ativo\x1b[0m 🔥');
    console.log('═'.repeat(60));
    console.log('');
    
    // Status principal
    console.log(`📊 Progresso Geral: ${this.drawProgressBar()}`);
    console.log(`⏱️  Tempo Ativo: ${this.formatElapsedTime()}`);
    console.log(`🎯 Atividade Atual: ${this.currentTask || 'Aguardando...'}`);
    console.log(`🤖 Processos Claude: ${this.claudeProcesses.size}`);
    console.log(`📁 Arquivos Monitorados: ${this.detectedFiles.size}`);
    console.log('');

    // Estatísticas
    if (this.tasks.length > 0) {
      const completed = this.tasks.filter(t => t.status === 'completed').length;
      const errors = this.tasks.filter(t => t.status === 'error').length;
      const recent = this.tasks.filter(t => Date.now() - t.timestamp < 300000).length; // 5 min
      
      console.log('📈 \x1b[1mEstatísticas:\x1b[0m');
      console.log(`   ✅ Completadas: ${completed}`);
      console.log(`   ❌ Erros: ${errors}`);
      console.log(`   🔄 Atividades Recentes (5min): ${recent}`);
      console.log('');
    }

    // Histórico recente
    console.log('📋 \x1b[1mÚltimas 8 Atividades:\x1b[0m');
    console.log('─'.repeat(60));
    
    if (this.tasks.length === 0) {
      console.log('   👁️ Aguardando atividades...');
    } else {
      const recent = this.tasks.slice(-8);
      recent.forEach(task => {
        const icon = {
          'in_progress': '⏳',
          'completed': '✅',
          'error': '❌'
        }[task.status] || '●';
        
        const time = new Date(task.timestamp).toLocaleTimeString();
        const name = task.name.length > 45 ? task.name.substring(0, 42) + '...' : task.name;
        const duration = task.duration ? `[${this.formatDuration(task.duration)}]` : '';
        
        console.log(`   ${icon} ${name} \x1b[2m${time} ${duration}\x1b[0m`);
      });
    }

    // Arquivos alterados recentemente
    if (this.detectedFiles.size > 0) {
      console.log('');
      console.log('📂 \x1b[1mArquivos Alterados:\x1b[0m');
      console.log('─'.repeat(60));
      
      const files = Array.from(this.detectedFiles).slice(-5);
      files.forEach(file => {
        console.log(`   📄 ${file}`);
      });
    }

    console.log('');
    console.log('\x1b[2m💡 Pressione Ctrl+C para parar o daemon\x1b[0m');
    console.log('\x1b[2m🔄 Atualização automática a cada 3 segundos\x1b[0m');
  }

  // Barra de progresso
  drawProgressBar() {
    const width = 30;
    const filled = Math.round((this.progress / 100) * width);
    const bar = '█'.repeat(filled) + '░'.repeat(width - filled);
    const color = this.progress >= 95 ? '\x1b[32m' : this.progress >= 70 ? '\x1b[33m' : '\x1b[36m';
    return `${color}${bar}\x1b[0m ${this.progress.toFixed(1)}%`;
  }

  // Formata tempo
  formatElapsedTime() {
    const elapsed = Date.now() - this.startTime;
    const hours = Math.floor(elapsed / 3600000);
    const minutes = Math.floor((elapsed % 3600000) / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    
    if (hours > 0) {
      return `${hours}h${minutes.toString().padStart(2, '0')}m${seconds.toString().padStart(2, '0')}s`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  // Formata duração
  formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    return seconds < 60 ? `${seconds}s` : `${Math.floor(seconds / 60)}m${seconds % 60}s`;
  }

  // Shutdown gracioso
  shutdown() {
    console.log('\n\n🛑 Parando Claude Monitor Daemon...');
    
    // Para todos os watchers
    this.fileWatchers.forEach(({ dir, watcher }) => {
      try {
        watcher.close();
      } catch (err) {
        // Ignora erros
      }
    });

    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    const totalTasks = this.tasks.length;
    const filesMonitored = this.detectedFiles.size;
    
    console.log(`📊 Estatísticas Finais:`);
    console.log(`   ⏱️ Tempo ativo: ${this.formatElapsedTime()}`);
    console.log(`   📋 Total de atividades: ${totalTasks}`);
    console.log(`   📁 Arquivos monitorados: ${filesMonitored}`);
    console.log(`   🤖 Processos Claude detectados: ${this.claudeProcesses.size}`);
    console.log('');
    console.log('👋 Daemon finalizado com sucesso!');
    
    process.exit(0);
  }
}

// Função para iniciar como daemon de sistema
function startAsDaemon() {
  // Fork do processo para rodar em background
  const { spawn } = require('child_process');
  
  if (process.argv.includes('--daemon')) {
    // Já é um daemon, inicia normalmente
    const daemon = new ClaudeMonitorDaemon();
    daemon.startDaemon();
  } else if (process.argv.includes('--bg')) {
    // Inicia como daemon em background
    const child = spawn('node', [__filename, '--daemon'], {
      detached: true,
      stdio: 'ignore'
    });
    child.unref();
    
    console.log('🚀 Claude Monitor Daemon iniciado em background');
    console.log(`📋 PID: ${child.pid}`);
    console.log('💡 Para ver o status: node claude-monitor-daemon.js --status');
    console.log('🛑 Para parar: node claude-monitor-daemon.js --stop');
    
    // Salva PID para controle
    fs.writeFileSync('.claude-daemon.pid', child.pid.toString());
    process.exit(0);
  } else {
    // Modo interativo normal
    const daemon = new ClaudeMonitorDaemon();
    daemon.startDaemon();
  }
}

// CLI
function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log('🔥 Claude Monitor Daemon');
    console.log('');
    console.log('Uso:');
    console.log('  node claude-monitor-daemon.js           # Modo interativo');
    console.log('  node claude-monitor-daemon.js --bg      # Daemon em background');
    console.log('  node claude-monitor-daemon.js --stop    # Para daemon');
    console.log('  node claude-monitor-daemon.js --status  # Status do daemon');
    console.log('');
    console.log('Funcionalidades:');
    console.log('  • Monitora arquivos em tempo real');
    console.log('  • Detecta processos Claude ativos');
    console.log('  • Interface de progresso contínuo');
    console.log('  • Histórico de atividades');
    console.log('  • Estatísticas detalhadas');
    return;
  }
  
  if (args.includes('--stop')) {
    if (fs.existsSync('.claude-daemon.pid')) {
      const pid = parseInt(fs.readFileSync('.claude-daemon.pid', 'utf8'));
      try {
        process.kill(pid);
        fs.unlinkSync('.claude-daemon.pid');
        console.log('✅ Daemon parado com sucesso');
      } catch (err) {
        console.log('❌ Erro ao parar daemon:', err.message);
      }
    } else {
      console.log('⚠️ Daemon não está rodando');
    }
    return;
  }
  
  if (args.includes('--status')) {
    if (fs.existsSync('.claude-daemon.pid')) {
      const pid = parseInt(fs.readFileSync('.claude-daemon.pid', 'utf8'));
      try {
        process.kill(pid, 0); // Testa se processo existe
        console.log('✅ Daemon está rodando (PID:', pid, ')');
      } catch (err) {
        console.log('❌ Daemon não está rodando');
        fs.unlinkSync('.claude-daemon.pid');
      }
    } else {
      console.log('⚠️ Daemon não está rodando');
    }
    return;
  }
  
  startAsDaemon();
}

if (require.main === module) {
  main();
}

module.exports = ClaudeMonitorDaemon;