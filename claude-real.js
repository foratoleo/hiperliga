#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

class ClaudeRealMonitor {
  constructor() {
    this.tasks = [];
    this.currentTask = null;
    this.progress = 0;
    this.startTime = Date.now();
    this.isRunning = false;
    this.detectedFiles = new Set();
    this.operations = [];
  }

  // Monitor que usa diretamente o Claude como você usaria
  async monitorClaude(...args) {
    console.log('🎯 \x1b[1mClaude Real Monitor - Interceptação Direta\x1b[0m');
    console.log(`📋 Executando: claude ${args.join(' ')}`);
    console.log('╭─────────────────────────────────────────╮');
    console.log('│ \x1b[33m⚡ MONITORANDO TUDO QUE O CLAUDE FAZ\x1b[0m │');
    console.log('╰─────────────────────────────────────────╯');
    console.log('');

    this.isRunning = true;
    this.startTime = Date.now();
    this.addTask('🚀 Iniciando Claude CLI', 'System', 5);

    // Inicia display overlay
    this.startOverlayDisplay();

    // Executa Claude real interceptando TUDO
    const claude = spawn('claude', args, {
      stdio: ['inherit', 'pipe', 'pipe'],
      env: {
        ...process.env,
        // Força mais verbosidade
        CLAUDE_DEBUG: '1',
        CLAUDE_VERBOSE: '1'
      }
    });

    let outputBuffer = '';
    let errorBuffer = '';

    // Intercepta e analisa STDOUT
    claude.stdout.on('data', (data) => {
      const chunk = data.toString();
      outputBuffer += chunk;
      
      // Mostra output normal (transparente)
      process.stdout.write(chunk);
      
      // Analisa para detectar atividades
      this.parseClaudeActivities(chunk, 'stdout');
    });

    // Intercepta e analisa STDERR  
    claude.stderr.on('data', (data) => {
      const chunk = data.toString();
      errorBuffer += chunk;
      
      // Mostra errors normal (transparente)
      process.stderr.write(chunk);
      
      // Analisa para detectar atividades
      this.parseClaudeActivities(chunk, 'stderr');
    });

    // Quando termina
    claude.on('close', (code) => {
      this.isRunning = false;
      this.progress = 100;
      this.finalizeLastTask(code === 0 ? 'completed' : 'error');
      
      // Espera um pouco e mostra relatório
      setTimeout(() => {
        this.showDetailedReport(code, outputBuffer, errorBuffer);
      }, 500);
    });

    // Se houver erro ao executar
    claude.on('error', (error) => {
      this.addTask(`❌ Erro: ${error.message}`, 'Error', 0);
      console.error(`\n❌ Erro ao executar Claude: ${error.message}`);
      
      if (error.code === 'ENOENT') {
        console.error('💡 Certifique-se de que o Claude CLI está instalado e no PATH');
      }
    });

    return claude;
  }

  // Parse avançado das atividades do Claude
  parseClaudeActivities(output, source) {
    const lines = output.split('\n');
    
    lines.forEach(line => {
      const clean = line.replace(/\x1B\[[0-9;]*[JKmsu]/g, '').trim();
      if (!clean || clean.length < 5) return;

      // Detecta ferramentas específicas do Claude Code
      this.detectClaudeTools(clean);
      
      // Detecta operações em arquivos
      this.detectFileOperations(clean);
      
      // Detecta pensamento/reasoning do Claude
      this.detectClaudeThinking(clean);
      
      // Detecta erros e sucessos
      this.detectOutcomes(clean);
    });
  }

  // Detecta ferramentas sendo usadas pelo Claude
  detectClaudeTools(line) {
    const patterns = [
      // Ferramentas do Claude Code
      { pattern: /Using.*Read.*tool|Reading.*file/i, name: '📖 Lendo arquivo', category: 'Read', weight: 8 },
      { pattern: /Using.*Write.*tool|Writing.*file|Creating.*file/i, name: '✏️ Escrevendo arquivo', category: 'Write', weight: 12 },
      { pattern: /Using.*Edit.*tool|Editing.*file|Modifying/i, name: '📝 Editando arquivo', category: 'Edit', weight: 10 },
      { pattern: /Using.*Bash.*tool|Running.*command|Executing/i, name: '💻 Executando comando', category: 'Bash', weight: 15 },
      { pattern: /Using.*Grep.*tool|Searching.*for|Looking.*for/i, name: '🔍 Buscando padrões', category: 'Grep', weight: 8 },
      { pattern: /Using.*Glob.*tool|Finding.*files|Listing.*files/i, name: '📂 Encontrando arquivos', category: 'Glob', weight: 6 },
      
      // Operações específicas
      { pattern: /npm.*install|yarn.*install|Installing.*packages/i, name: '📦 Instalando pacotes', category: 'Package', weight: 15 },
      { pattern: /npm.*build|yarn.*build|Building.*project/i, name: '🔨 Compilando projeto', category: 'Build', weight: 20 },
      { pattern: /npm.*test|yarn.*test|Running.*tests/i, name: '🧪 Executando testes', category: 'Test', weight: 12 },
      { pattern: /Linting|ESLint|Checking.*code/i, name: '🔍 Verificando código', category: 'Lint', weight: 8 },
      
      // Tool calls explícitos
      { pattern: /Tool.*call|Invoking.*tool|Function.*call/i, name: '🛠️ Chamando ferramenta', category: 'Tool', weight: 5 }
    ];

    for (const { pattern, name, category, weight } of patterns) {
      if (pattern.test(line)) {
        this.addTask(name, category, weight);
        
        // Extrai nome do arquivo se possível
        const fileMatch = line.match(/(?:file|path).*?([^\s]+\.(js|ts|jsx|tsx|json|md|css|scss|py|go|java|php))/i);
        if (fileMatch) {
          this.detectedFiles.add(fileMatch[1]);
        }
        break;
      }
    }
  }

  // Detecta operações em arquivos
  detectFileOperations(line) {
    const filePatterns = [
      { pattern: /Created|Creating\s+([^\s]+)/i, name: '📁 Criando', weight: 10 },
      { pattern: /Updated|Updating\s+([^\s]+)/i, name: '🔄 Atualizando', weight: 8 },
      { pattern: /Deleted|Deleting\s+([^\s]+)/i, name: '🗑️ Removendo', weight: 6 },
      { pattern: /Analyzed|Analyzing\s+([^\s]+)/i, name: '🔍 Analisando', weight: 8 },
      { pattern: /Fixed|Fixing\s+([^\s]+)/i, name: '🔧 Corrigindo', weight: 12 }
    ];

    for (const { pattern, name, weight } of filePatterns) {
      const match = line.match(pattern);
      if (match) {
        const file = match[1];
        this.addTask(`${name} ${file}`, 'FileOp', weight);
        this.detectedFiles.add(file);
        break;
      }
    }
  }

  // Detecta "pensamento" do Claude
  detectClaudeThinking(line) {
    const thinkingPatterns = [
      { pattern: /I'll|I need to|Let me|I should/i, name: '🤔 Claude planejando...', weight: 5 },
      { pattern: /Analyzing|Reviewing|Examining|Understanding/i, name: '🧠 Claude analisando...', weight: 6 },
      { pattern: /Implementing|Creating|Building|Developing/i, name: '⚡ Claude implementando...', weight: 10 },
      { pattern: /Testing|Checking|Validating|Verifying/i, name: '🔍 Claude verificando...', weight: 7 },
      { pattern: /Optimizing|Improving|Refactoring|Enhancing/i, name: '⚡ Claude otimizando...', weight: 8 }
    ];

    for (const { pattern, name, weight } of thinkingPatterns) {
      if (pattern.test(line)) {
        this.addTask(name, 'Thinking', weight);
        break;
      }
    }
  }

  // Detecta resultados
  detectOutcomes(line) {
    if (/completed|finished|done|success|successfully/i.test(line)) {
      this.addTask('✅ Operação concluída', 'Success', 8);
    } else if (/error|failed|exception|could not|cannot/i.test(line)) {
      this.addTask('❌ Erro detectado', 'Error', 3);
    }
  }

  // Adiciona tarefa
  addTask(name, category, weight) {
    if (this.currentTask === name) return;

    // Finaliza tarefa anterior
    this.finalizeLastTask('completed');

    this.currentTask = name;
    this.progress = Math.min(this.progress + weight, 95);

    const task = {
      name,
      category,
      status: 'in_progress',
      timestamp: Date.now(),
      duration: null
    };

    this.tasks.push(task);
    this.operations.push({
      action: name,
      time: new Date().toLocaleTimeString(),
      category
    });

    // Limita arrays para não consumir muita memória
    if (this.tasks.length > 100) {
      this.tasks = this.tasks.slice(-100);
    }
    if (this.operations.length > 50) {
      this.operations = this.operations.slice(-50);
    }
  }

  // Finaliza última tarefa
  finalizeLastTask(status) {
    if (this.tasks.length > 0) {
      const last = this.tasks[this.tasks.length - 1];
      if (last.status === 'in_progress') {
        last.status = status;
        last.duration = Date.now() - last.timestamp;
      }
    }
  }

  // Display overlay em tempo real
  startOverlayDisplay() {
    // Primeira renderização
    setTimeout(() => this.drawOverlay(), 1000);
    
    // Atualizações periódicas
    const interval = setInterval(() => {
      if (!this.isRunning) {
        clearInterval(interval);
        return;
      }
      this.drawOverlay();
    }, 2500);
  }

  // Desenha overlay compacto
  drawOverlay() {
    if (!this.isRunning && this.tasks.length === 0) return;

    // Salva cursor e vai para posição fixa
    process.stdout.write('\x1b[s\x1b[1;1H');
    
    // Linha principal com progresso
    const elapsed = this.formatTime();
    const progress = this.drawCompactProgress();
    const current = this.currentTask || 'Processando...';
    
    // Limpa linha e escreve
    process.stdout.write('\x1b[K');
    process.stdout.write(`\x1b[1m\x1b[46m\x1b[37m 🎯 Claude Monitor \x1b[0m ${progress} \x1b[2m${elapsed}\x1b[0m \x1b[36m${current}\x1b[0m\n`);
    
    // Linha de estatísticas
    if (this.tasks.length > 0) {
      const categories = [...new Set(this.tasks.map(t => t.category))].slice(0, 4).join(' ');
      const files = this.detectedFiles.size;
      
      process.stdout.write('\x1b[K');
      process.stdout.write(`\x1b[2m📊 ${categories} | 📁 ${files} arquivos | 📋 ${this.tasks.length} ações\x1b[0m\n`);
    } else {
      process.stdout.write('\x1b[K\n');
    }
    
    // Linha vazia para separação
    process.stdout.write('\x1b[K\n');
    
    // Restaura cursor
    process.stdout.write('\x1b[u');
  }

  // Progresso compacto
  drawCompactProgress() {
    const width = 15;
    const filled = Math.round((this.progress / 100) * width);
    const bar = '█'.repeat(filled) + '▒'.repeat(width - filled);
    return `\x1b[32m${bar}\x1b[0m ${this.progress.toFixed(0)}%`;
  }

  // Formata tempo
  formatTime() {
    const elapsed = Date.now() - this.startTime;
    const mins = Math.floor(elapsed / 60000);
    const secs = Math.floor((elapsed % 60000) / 1000);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  // Relatório detalhado final
  showDetailedReport(code, stdout, stderr) {
    console.log('\n\n');
    console.log('╭─────────────────────────────────────────────────────────╮');
    console.log('│ \x1b[1m🎯 CLAUDE REAL MONITOR - RELATÓRIO COMPLETO\x1b[0m           │');
    console.log('╰─────────────────────────────────────────────────────────╯');
    
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    const status = code === 0 ? '\x1b[32m✅ SUCESSO\x1b[0m' : '\x1b[31m❌ ERRO\x1b[0m';
    
    console.log(`\n📊 \x1b[1mRESUMO EXECUTIVO:\x1b[0m`);
    console.log(`   Status: ${status} (código ${code})`);
    console.log(`   Tempo: ${elapsed}s`);
    console.log(`   Ações detectadas: ${this.tasks.length}`);
    console.log(`   Arquivos manipulados: ${this.detectedFiles.size}`);
    
    // Categorias de atividades
    if (this.tasks.length > 0) {
      const categories = {};
      this.tasks.forEach(task => {
        categories[task.category] = (categories[task.category] || 0) + 1;
      });
      
      console.log(`\n🛠️  \x1b[1mFERRAMENTAS UTILIZADAS:\x1b[0m`);
      Object.entries(categories).forEach(([category, count]) => {
        console.log(`   ${category}: ${count} vez(es)`);
      });
    }

    // Arquivos afetados
    if (this.detectedFiles.size > 0) {
      console.log(`\n📂 \x1b[1mARQUIVOS MANIPULADOS:\x1b[0m`);
      Array.from(this.detectedFiles).slice(0, 15).forEach(file => {
        console.log(`   📄 ${file}`);
      });
      if (this.detectedFiles.size > 15) {
        console.log(`   ... e mais ${this.detectedFiles.size - 15} arquivos`);
      }
    }

    // Timeline das últimas operações
    if (this.operations.length > 0) {
      console.log(`\n⏰ \x1b[1mTIMELINE DAS OPERAÇÕES:\x1b[0m`);
      this.operations.slice(-10).forEach(op => {
        console.log(`   ${op.time} - ${op.action} \x1b[2m(${op.category})\x1b[0m`);
      });
    }

    console.log('\n' + '═'.repeat(60));
    console.log('\x1b[2m💡 Este monitor interceptou e analisou TUDO que o Claude fez!\x1b[0m');
  }
}

// CLI
async function main() {
  const monitor = new ClaudeRealMonitor();
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('🎯 \x1b[1mClaude Real Monitor\x1b[0m');
    console.log('');
    console.log('\x1b[33mEste monitor intercepta e mostra EXATAMENTE o que o Claude faz!\x1b[0m');
    console.log('');
    console.log('Uso:');
    console.log('  node claude-real.js <comandos-do-claude>');
    console.log('');
    console.log('Exemplos:');
    console.log('  node claude-real.js /implement login feature');
    console.log('  node claude-real.js /analyze security vulnerabilities');  
    console.log('  node claude-real.js /improve performance');
    console.log('  node claude-real.js /fix authentication bug');
    console.log('');
    console.log('💡 \x1b[32mFunciona como o Claude normal + monitoramento completo!\x1b[0m');
    process.exit(1);
  }

  // Intercepta Ctrl+C para mostrar relatório
  process.on('SIGINT', () => {
    monitor.isRunning = false;
    console.log('\n\n⚠️  Monitor interrompido pelo usuário');
    monitor.showDetailedReport(130, '', ''); // 130 = interrupted
    process.exit(0);
  });

  try {
    await monitor.monitorClaude(...args);
  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = ClaudeRealMonitor;