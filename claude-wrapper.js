#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

class ClaudeWrapper {
  constructor() {
    this.tasks = [];
    this.currentTask = null;
    this.progress = 0;
    this.startTime = Date.now();
    this.isRunning = false;
    this.detectedFiles = new Set();
    this.toolCalls = new Map();
    this.logBuffer = '';
  }

  // Wrapper transparente que intercepta TUDO do Claude
  async wrapClaude(claudeArgs) {
    console.log('🎯 Claude Monitor - Interceptando Claude CLI');
    console.log(`📋 Comando: claude ${claudeArgs.join(' ')}`);
    console.log('');

    this.isRunning = true;
    this.startTime = Date.now();

    // Spawn do Claude real mas interceptando TUDO
    const claude = spawn('claude', claudeArgs, {
      stdio: ['inherit', 'pipe', 'pipe'],  // Herdamos stdin, mas interceptamos out/err
      env: {
        ...process.env,
        // Força o Claude a ser mais verboso
        DEBUG: '1',
        VERBOSE: '1',
        CLAUDE_LOG_LEVEL: 'debug'
      }
    });

    // Intercepta STDOUT (saída principal)
    claude.stdout.on('data', (data) => {
      const output = data.toString();
      
      // Mostra no terminal do usuário (transparente)
      process.stdout.write(output);
      
      // Analisa para nosso monitor
      this.analyzeClaudeOutput(output);
      this.updateDisplay();
    });

    // Intercepta STDERR (logs e debug)
    claude.stderr.on('data', (data) => {
      const output = data.toString();
      
      // Mostra no terminal do usuário (transparente)
      process.stderr.write(output);
      
      // Analisa para nosso monitor  
      this.analyzeClaudeOutput(output);
      this.updateDisplay();
    });

    // Quando Claude termina
    claude.on('close', (code) => {
      this.isRunning = false;
      this.progress = 100;
      this.showFinalReport(code);
    });

    // Inicia display
    this.startDisplay();

    return claude;
  }

  // Analisa output do Claude em tempo real
  analyzeClaudeOutput(output) {
    const lines = output.split('\n');
    
    lines.forEach(line => {
      const cleanLine = line.replace(/\x1B\[[0-9;]*[JKmsu]/g, '').trim();
      if (!cleanLine || cleanLine.length < 3) return;

      // Detecta ferramentas sendo usadas
      this.detectToolUsage(cleanLine);
      
      // Detecta arquivos sendo manipulados
      this.detectFileOperations(cleanLine);
      
      // Detecta operações gerais
      this.detectGeneralOperations(cleanLine);
    });
  }

  // Detecta uso de ferramentas específicas
  detectToolUsage(line) {
    const toolPatterns = [
      { pattern: /Reading file|Read\s+(.+\.(js|ts|jsx|tsx|json|md))/i, tool: 'Read', action: 'lendo', emoji: '📖' },
      { pattern: /Writing file|Write\s+(.+\.(js|ts|jsx|tsx|json|md))/i, tool: 'Write', action: 'escrevendo', emoji: '✏️' },
      { pattern: /Editing file|Edit\s+(.+\.(js|ts|jsx|tsx|json|md))/i, tool: 'Edit', action: 'editando', emoji: '📝' },
      { pattern: /Running bash|Bash\s+command|Executing/i, tool: 'Bash', action: 'executando', emoji: '💻' },
      { pattern: /Searching|Grep|Looking for/i, tool: 'Grep', action: 'buscando', emoji: '🔍' },
      { pattern: /Glob pattern|Finding files/i, tool: 'Glob', action: 'encontrando', emoji: '📂' },
      { pattern: /Installing|npm install|yarn install/i, tool: 'Package', action: 'instalando', emoji: '📦' },
      { pattern: /Building|Compiling|npm run build/i, tool: 'Build', action: 'compilando', emoji: '🔨' },
      { pattern: /Testing|npm test|yarn test/i, tool: 'Test', action: 'testando', emoji: '🧪' },
      { pattern: /Linting|ESLint|npm run lint/i, tool: 'Lint', action: 'verificando', emoji: '🔍' }
    ];

    for (const { pattern, tool, action, emoji } of toolPatterns) {
      const match = line.match(pattern);
      if (match) {
        const file = match[1] || '';
        const taskName = file ? 
          `${emoji} ${action.charAt(0).toUpperCase() + action.slice(1)} ${file}` : 
          `${emoji} ${action.charAt(0).toUpperCase() + action.slice(1)}`;
        
        this.addTask(taskName, tool, 10);
        
        if (file) {
          this.detectedFiles.add(file);
        }
        
        this.toolCalls.set(tool, (this.toolCalls.get(tool) || 0) + 1);
        break;
      }
    }
  }

  // Detecta operações em arquivos
  detectFileOperations(line) {
    const filePatterns = [
      { pattern: /Created|Creating\s+(.+)/i, action: 'Criando', emoji: '📁' },
      { pattern: /Modified|Modifying\s+(.+)/i, action: 'Modificando', emoji: '📝' },
      { pattern: /Deleted|Deleting\s+(.+)/i, action: 'Removendo', emoji: '🗑️' },
      { pattern: /Updated|Updating\s+(.+)/i, action: 'Atualizando', emoji: '🔄' },
      { pattern: /Analyzed|Analyzing\s+(.+)/i, action: 'Analisando', emoji: '🔍' }
    ];

    for (const { pattern, action, emoji } of filePatterns) {
      const match = line.match(pattern);
      if (match) {
        const target = match[1];
        this.addTask(`${emoji} ${action} ${target}`, 'FileOp', 8);
        this.detectedFiles.add(target);
        break;
      }
    }
  }

  // Detecta operações gerais
  detectGeneralOperations(line) {
    const operations = [
      { pattern: /thinking|analyzing|processing/i, name: '🤔 Claude pensando...', weight: 5 },
      { pattern: /generating|creating|writing/i, name: '⚡ Gerando código...', weight: 12 },
      { pattern: /reviewing|checking|validating/i, name: '🔍 Revisando código...', weight: 8 },
      { pattern: /error|failed|exception/i, name: '❌ Erro detectado', weight: 3 },
      { pattern: /completed|finished|done|success/i, name: '✅ Operação concluída', weight: 10 },
      { pattern: /starting|initializing|beginning/i, name: '🚀 Iniciando operação...', weight: 6 }
    ];

    for (const { pattern, name, weight } of operations) {
      if (pattern.test(line)) {
        this.addTask(name, 'General', weight);
        break;
      }
    }
  }

  // Adiciona tarefa
  addTask(name, category, weight) {
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

    this.tasks.push({
      name,
      category,
      status: 'in_progress',
      timestamp: Date.now(),
      duration: null
    });
  }

  // Display em tempo real (overlay)
  startDisplay() {
    // Display inicial
    this.drawOverlay();
    
    // Atualiza periodicamente
    setInterval(() => {
      if (this.isRunning) {
        this.drawOverlay();
      }
    }, 2000);
  }

  // Força atualização
  updateDisplay() {
    if (this.isRunning) {
      // Pequeno delay para não interferir com output do Claude
      setTimeout(() => this.drawOverlay(), 100);
    }
  }

  // Desenha overlay na parte superior
  drawOverlay() {
    // Salva posição do cursor
    process.stdout.write('\x1b[s');
    
    // Vai para o topo e limpa algumas linhas
    process.stdout.write('\x1b[1;1H');
    process.stdout.write('\x1b[K'); // Limpa linha atual
    
    // Header compacto
    const elapsed = this.formatElapsedTime();
    const progressBar = this.drawProgressBar();
    
    process.stdout.write(`\x1b[1m\x1b[36m🎯 Claude Monitor: ${progressBar} | ${elapsed} | ${this.currentTask || 'Aguardando...'}\x1b[0m\n`);
    
    // Estatísticas rápidas se houver
    if (this.tasks.length > 0) {
      const tools = Array.from(this.toolCalls.keys()).slice(0, 3).join(', ');
      const files = this.detectedFiles.size;
      process.stdout.write(`\x1b[2m📊 Ferramentas: ${tools} | 📁 Arquivos: ${files} | 📋 Tarefas: ${this.tasks.length}\x1b[0m\n`);
    }
    
    process.stdout.write('\x1b[K\n'); // Linha em branco
    
    // Restaura posição do cursor
    process.stdout.write('\x1b[u');
  }

  // Barra de progresso compacta
  drawProgressBar() {
    const width = 20;
    const filled = Math.round((this.progress / 100) * width);
    const bar = '█'.repeat(filled) + '░'.repeat(width - filled);
    const color = this.progress >= 95 ? '\x1b[32m' : this.progress >= 70 ? '\x1b[33m' : '\x1b[36m';
    return `${color}${bar}\x1b[0m ${this.progress.toFixed(0)}%`;
  }

  // Formata tempo
  formatElapsedTime() {
    const elapsed = Date.now() - this.startTime;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  // Relatório final
  showFinalReport(code) {
    console.log('\n');
    console.log('═'.repeat(60));
    console.log('🎯 \x1b[1mClaude Monitor - Relatório Final\x1b[0m');
    console.log('═'.repeat(60));
    
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    console.log(`⏱️  Tempo Total: ${elapsed}s`);
    console.log(`📊 Status: ${code === 0 ? '\x1b[32m✅ Sucesso\x1b[0m' : '\x1b[31m❌ Erro\x1b[0m'}`);
    console.log(`📋 Total de Tarefas: ${this.tasks.length}`);
    console.log(`📁 Arquivos Manipulados: ${this.detectedFiles.size}`);
    
    // Ferramentas usadas
    if (this.toolCalls.size > 0) {
      console.log('\n🛠️  \x1b[1mFerramentas Utilizadas:\x1b[0m');
      Array.from(this.toolCalls.entries()).forEach(([tool, count]) => {
        console.log(`   ${tool}: ${count} vez(es)`);
      });
    }

    // Arquivos manipulados
    if (this.detectedFiles.size > 0) {
      console.log('\n📂 \x1b[1mArquivos Manipulados:\x1b[0m');
      Array.from(this.detectedFiles).slice(0, 10).forEach(file => {
        console.log(`   📄 ${file}`);
      });
      
      if (this.detectedFiles.size > 10) {
        console.log(`   ... e mais ${this.detectedFiles.size - 10} arquivos`);
      }
    }

    // Últimas atividades
    if (this.tasks.length > 0) {
      console.log('\n📋 \x1b[1mÚltimas Atividades:\x1b[0m');
      this.tasks.slice(-5).forEach(task => {
        const time = new Date(task.timestamp).toLocaleTimeString();
        const duration = task.duration ? `[${Math.floor(task.duration / 1000)}s]` : '[em andamento]';
        console.log(`   • ${task.name} \x1b[2m${time} ${duration}\x1b[0m`);
      });
    }

    console.log('═'.repeat(60));
  }
}

// CLI principal
async function main() {
  const wrapper = new ClaudeWrapper();
  
  // Pega argumentos que seriam passados para o Claude
  const claudeArgs = process.argv.slice(2);
  
  if (claudeArgs.length === 0) {
    console.log('🎯 Claude Wrapper - Monitor Transparente');
    console.log('');
    console.log('Uso:');
    console.log('  node claude-wrapper.js <comandos-do-claude>');
    console.log('');
    console.log('Exemplos:');
    console.log('  node claude-wrapper.js /implement login form');
    console.log('  node claude-wrapper.js /analyze security');
    console.log('  node claude-wrapper.js /improve performance');
    console.log('  node claude-wrapper.js /fix bug in auth');
    console.log('');
    console.log('💡 Funciona exatamente como o Claude, mas monitora tudo!');
    process.exit(1);
  }

  try {
    await wrapper.wrapClaude(claudeArgs);
  } catch (error) {
    console.error('❌ Erro ao executar Claude:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = ClaudeWrapper;