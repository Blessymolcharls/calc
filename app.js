/**
 * App.js - Application controller for WrongCalc Pro (Liquid Glass Edition)
 */

import { WrongMathEngine, MODES } from './mathEngine.js';
import { sounds } from './audio.js';

class WrongCalculatorApp {
  constructor() {
    this.engine = new WrongMathEngine();
    this.currentInput = '0';
    this.previousInput = '';
    this.operator = null;
    this.isResultCalculated = false;
    this.blunderCount = 0;
    this.historyLogs = [];
    this.isThinking = false;

    // DOM Elements
    this.mainDisplay = document.getElementById('mainDisplay');
    this.historyDisplay = document.getElementById('historyDisplay');
    this.mathsplainText = document.getElementById('mathsplainText');
    this.mathsplainIcon = document.getElementById('mathsplainIcon');
    this.calcCard = document.getElementById('calcCard');
    this.historyList = document.getElementById('historyList');
    this.blunderCountEl = document.getElementById('calculationCount');
    this.soundToggleBtn = document.getElementById('soundToggle');
    this.keypad = document.getElementById('keypad');
    this.modeTabs = document.querySelectorAll('.mode-tab');
    this.confidenceStatus = document.getElementById('confidenceStatus');

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupKeyboardSupport();
    this.updateDisplay();
  }

  setupEventListeners() {
    // Mode switcher
    this.modeTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        this.modeTabs.forEach(t => t.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const mode = e.currentTarget.dataset.mode;
        this.engine.setMode(mode);
        sounds.playOperatorClick();
        this.setMathsplain(`Switched mode to [${e.currentTarget.innerText}]. Accuracy guarantee: strictly 0%.`, '✨');
      });
    });

    // Sound toggle
    this.soundToggleBtn.addEventListener('click', () => {
      const isMuted = sounds.toggleMute();
      this.soundToggleBtn.classList.toggle('active', !isMuted);
      if (!isMuted) sounds.playKeyClick(1.2);
    });

    // Help button
    const helpBtn = document.getElementById('helpBtn');
    if (helpBtn) {
      helpBtn.addEventListener('click', () => {
        sounds.playKeyClick(0.9);
        this.setMathsplain("Help: Built to deliver mathematically unprecedented blunders. Enjoy!", "📖");
      });
    }

    // Keypad clicks
    this.keypad.addEventListener('click', (e) => {
      const btn = e.target.closest('.calc-btn');
      if (!btn || this.isThinking) return;

      const action = btn.dataset.action;
      this.handleButtonAction(action, btn);
    });
  }

  setupKeyboardSupport() {
    window.addEventListener('keydown', (e) => {
      if (this.isThinking) return;

      if (/^[0-9]$/.test(e.key)) {
        this.inputNumber(e.key);
        sounds.playKeyClick(1 + (parseInt(e.key) * 0.05));
      } else if (e.key === '.') {
        this.inputDecimal();
        sounds.playKeyClick(1.4);
      } else if (['+', '-', '*', '/'].includes(e.key)) {
        const opMap = { '+': '+', '-': '−', '*': '×', '/': '÷' };
        this.chooseOperator(opMap[e.key]);
        sounds.playOperatorClick();
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        this.triggerCalculation();
      } else if (e.key === 'Backspace') {
        this.deleteLastDigit();
      } else if (e.key === 'Escape') {
        this.clearAll();
      }
    });
  }

  handleButtonAction(action, btn) {
    switch (action) {
      case 'num':
        this.inputNumber(btn.dataset.num);
        sounds.playKeyClick(1 + (parseInt(btn.dataset.num) || 0) * 0.04);
        break;
      case 'op':
        this.chooseOperator(btn.dataset.op);
        sounds.playOperatorClick();
        break;
      case 'equals':
        this.triggerCalculation();
        break;
      case 'clear':
        this.clearAll();
        sounds.playKeyClick(0.6);
        break;
      case 'delete':
        this.deleteLastDigit();
        sounds.playKeyClick(0.8);
        break;
      case 'approx':
        this.approximateCurrent();
        break;
      case 'overthink':
        this.startOverthinking();
        break;
      case 'panic':
        this.triggerPanic();
        break;
      case 'scramble':
        this.scrambleKeypad();
        break;
    }
  }

  inputNumber(num) {
    if (this.isResultCalculated) {
      this.currentInput = num;
      this.isResultCalculated = false;
    } else {
      if (this.currentInput === '0' && num !== '.') {
        this.currentInput = num;
      } else {
        // 5% chance of digit transposition error for senior comedic effect
        if (Math.random() < 0.05 && this.currentInput.length > 1) {
          this.currentInput = this.currentInput.slice(0, -1) + num + this.currentInput.slice(-1);
          this.setMathsplain("Quantum tunnel effect detected: your digit displaced its predecessor.", "🌀");
        } else {
          this.currentInput += num;
        }
      }
    }
    this.updateDisplay();
  }

  inputDecimal() {
    if (this.isResultCalculated) {
      this.currentInput = '0.';
      this.isResultCalculated = false;
    } else if (!this.currentInput.includes('.')) {
      this.currentInput += '.';
    }
    this.updateDisplay();
  }

  chooseOperator(op) {
    if (this.currentInput === '' && this.previousInput !== '') {
      this.operator = op;
      this.updateDisplay();
      return;
    }

    if (this.previousInput !== '' && this.operator) {
      this.triggerCalculation();
    }

    this.operator = op;
    this.previousInput = this.currentInput;
    this.currentInput = '';
    this.isResultCalculated = false;
    this.updateDisplay();
  }

  triggerCalculation() {
    if (!this.operator || this.previousInput === '') return;

    const operandA = this.previousInput;
    const operandB = this.currentInput || '0';
    const activeOp = this.operator;

    // Trigger Apple Intelligence shimmer effect
    this.calcCard.classList.add('calculating-shimmer');
    setTimeout(() => this.calcCard.classList.remove('calculating-shimmer'), 1200);

    // Run computation through the WrongMathEngine
    const result = this.engine.calculate(operandA, activeOp, operandB);

    this.currentInput = result.value;
    this.previousInput = '';
    this.operator = null;
    this.isResultCalculated = true;
    this.blunderCount++;

    // Trigger visual and auditory feedback
    this.applyVisualEffect(result.effect);
    this.setMathsplain(result.explanation, '💡');

    // If Gaslight mode, rewrite the history text
    const displayExpression = result.gaslitExpression || `${operandA} ${activeOp} ${operandB}`;
    this.historyDisplay.innerText = `${displayExpression} =`;

    // Add to ledger
    this.addHistoryLog(displayExpression, result.value);
    this.updateDisplay();
  }

  approximateCurrent() {
    sounds.playOperatorClick();
    const val = parseFloat(this.currentInput) || 42;
    const fuzz = (Math.random() * 1000000 - 500000).toFixed(0);
    this.currentInput = `≈ ${fuzz}`;
    this.isResultCalculated = true;
    this.setMathsplain("Close enough within ±1,000,000 cosmic deviation units.", "🤏");
    this.updateDisplay();
  }

  startOverthinking() {
    this.isThinking = true;
    sounds.playFanfare();
    this.calcCard.classList.add('anim-overthink', 'calculating-shimmer');

    const steps = [
      "Consulting 4-dimensional string theory...",
      "Simulating heat death of the universe...",
      "Resolving P vs NP (concluded: irrelevant)...",
      "Factoring your bad financial choices...",
      "Harmonizing with ancient Babylonian fractions..."
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      this.setMathsplain(steps[stepIndex % steps.length], "⏳");
      this.mainDisplay.innerText = (Math.random() * 999999).toFixed(0);
      stepIndex++;
    }, 450);

    setTimeout(() => {
      clearInterval(interval);
      this.calcCard.classList.remove('anim-overthink', 'calculating-shimmer');
      this.isThinking = false;
      const overthinkAnswers = ["42.0000000000001", "42 (Obviously)", "NaN ± 7", "41.9999999999999"];
      this.currentInput = overthinkAnswers[Math.floor(Math.random() * overthinkAnswers.length)];
      this.isResultCalculated = true;
      this.setMathsplain("After exhaustive quantum simulation: The fundamental answer is 42.", "✨");
      this.updateDisplay();
      sounds.playGlitch();
    }, 2400);
  }

  triggerPanic() {
    sounds.playPanicSiren();
    this.calcCard.classList.add('anim-panic');
    this.setMathsplain("CRITICAL CALCULATION PANIC: Numbers are escaping memory registers!", "🚨");
    
    setTimeout(() => {
      this.calcCard.classList.remove('anim-panic');
      this.currentInput = "ERR: 0xDEADBEEF";
      this.updateDisplay();
    }, 650);
  }

  scrambleKeypad() {
    sounds.playGlitch();
    const buttons = Array.from(this.keypad.querySelectorAll('.calc-btn:not(.btn-equals):not([data-action="scramble"])'));
    
    // Fisher-Yates shuffle
    for (let i = buttons.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const parent = buttons[i].parentNode;
      parent.insertBefore(buttons[j], buttons[i]);
    }

    this.setMathsplain("Keypad reorganized for maximum cognitive dissonance.", "🎲");
  }

  deleteLastDigit() {
    const snark = this.engine.getInstantSnark('DEL');
    if (snark && Math.random() > 0.6) {
      this.setMathsplain(snark, '🗑️');
    }

    if (this.currentInput.length > 1) {
      this.currentInput = this.currentInput.slice(0, -1);
    } else {
      this.currentInput = '0';
    }
    this.updateDisplay();
  }

  clearAll() {
    const snark = this.engine.getInstantSnark('C');
    if (snark) this.setMathsplain(snark, '🧹');

    this.currentInput = '0';
    this.previousInput = '';
    this.operator = null;
    this.isResultCalculated = false;
    this.historyDisplay.innerText = ' ';
    this.updateDisplay();
  }

  applyVisualEffect(effect) {
    if (effect === 'shake' || effect === 'bounce') {
      this.calcCard.classList.add('anim-shake');
      sounds.playWrongBuzzer();
      setTimeout(() => this.calcCard.classList.remove('anim-shake'), 400);
    } else if (effect === 'gaslight') {
      this.calcCard.classList.add('anim-gaslight');
      sounds.playFanfare();
      setTimeout(() => this.calcCard.classList.remove('anim-gaslight'), 500);
    } else if (effect === 'panic') {
      this.triggerPanic();
    } else {
      sounds.playWrongBuzzer();
    }
  }

  setMathsplain(text, icon = '🧠') {
    this.mathsplainIcon.innerText = icon;
    this.mathsplainText.innerText = text;
  }

  addHistoryLog(expr, result) {
    const item = document.createElement('div');
    item.className = 'history-item';
    item.innerHTML = `
      <span class="hist-expr">${expr}</span>
      <span class="hist-res">= ${result}</span>
    `;
    this.historyList.prepend(item);

    // Keep history trimmed to 20 items
    while (this.historyList.children.length > 20) {
      this.historyList.removeChild(this.historyList.lastChild);
    }

    this.blunderCountEl.innerText = `${this.blunderCount} blunder(s) recorded`;
  }

  updateDisplay() {
    if (this.isThinking) return;

    let displayStr = this.currentInput || '0';
    if (displayStr.length > 16) {
      displayStr = displayStr.slice(0, 15) + '…';
    }
    this.mainDisplay.innerText = displayStr;

    if (!this.isResultCalculated) {
      if (this.previousInput && this.operator) {
        this.historyDisplay.innerText = `${this.previousInput} ${this.operator}`;
      } else {
        this.historyDisplay.innerHTML = '&nbsp;';
      }
    }
  }
}

// Initialize on DOM load
window.addEventListener('DOMContentLoaded', () => {
  new WrongCalculatorApp();
});
