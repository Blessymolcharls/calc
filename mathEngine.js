/**
 * MathEngine - The Confidently Wrong Arithmetic Core
 * Designed to consistently and creatively disappoint anyone seeking mathematical truth.
 */

export const MODES = {
  GASLIGHT: 'gaslight',         // Rewrites history/inputs to pretend you typed something else
  CHAOTIC_EVIL: 'chaotic',       // Random operations, swapped digits, explosive results
  STRING_MATH: 'strings',       // Treats everything as JavaScript string concatenation or type coercion
  OVERTHINK: 'overthink',       // Overanalyzes simple math into absurd cosmological constants
  OFF_BY_ONE: 'off_by_one'      // Subtle and infuriating - always off by ±1 or ±0.0001
};

export const MATH_EXPLANATIONS = [
  "Proven rigorously by Ramanujan in a dream he immediately forgot.",
  "Adjusted for inflation, local atmospheric pressure, and cosmic background radiation.",
  "According to JavaScript's `typeof NaN === 'number'`, this is objectively valid.",
  "In an 11-dimensional Calabi-Yau manifold, this is mathematically identical to 0.",
  "Calculated using the proprietary 'vibes-based calculus' framework.",
  "Rounded to the nearest emotional truth rather than numerical reality.",
  "Our senior quant trader confirmed this yields maximum shareholder value.",
  "Theorem 404: The true answer was deleted to prevent an integer singularity.",
  "Derived by converting all integers into arbitrary floating-point regrets.",
  "Verified against ISO-9001 standard for mathematically ambiguous outcomes.",
  "Compensated for the Earth's Coriolis effect on the arithmetic logic unit (ALU).",
  "If you don't agree with this result, please submit a PR to Mathematics v2.0."
];

export class WrongMathEngine {
  constructor() {
    this.mode = MODES.CHAOTIC_EVIL;
    this.glitchCount = 0;
  }

  setMode(mode) {
    if (Object.values(MODES).includes(mode)) {
      this.mode = mode;
    }
  }

  /**
   * Main calculation entry point
   * @param {number|string} a First operand
   * @param {string} op Operator (+, -, *, /, ^, %)
   * @param {number|string} b Second operand
   * @returns {Object} result metadata { value, explanation, gaslitExpression, effect }
   */
  calculate(a, op, b) {
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    this.glitchCount++;

    if (isNaN(numA) || isNaN(numB)) {
      return {
        value: "NaN-ish",
        explanation: "Numbers are merely social constructs anyway.",
        gaslitExpression: `${a} ${op} ${b}`,
        effect: "glitch"
      };
    }

    switch (this.mode) {
      case MODES.GASLIGHT:
        return this.calculateGaslight(numA, op, numB);
      case MODES.STRING_MATH:
        return this.calculateStringMath(a, op, b);
      case MODES.OVERTHINK:
        return this.calculateOverthink(numA, op, numB);
      case MODES.OFF_BY_ONE:
        return this.calculateOffByOne(numA, op, numB);
      case MODES.CHAOTIC_EVIL:
      default:
        return this.calculateChaotic(numA, op, numB);
    }
  }

  calculateChaotic(a, bOp, b) {
    let value;
    let effect = 'shake';

    // Special iconic easter eggs
    if ((a === 2 && b === 2 && (bOp === '+' || bOp === 'add'))) {
      const easterEggs = ["5 (Orwellian Constant)", "22 (String Coercion)", "Fish 🐟", "4.00000000000000000019"];
      value = easterEggs[Math.floor(Math.random() * easterEggs.length)];
      return {
        value,
        explanation: "2 + 2 = 5 for sufficiently large values of 2.",
        gaslitExpression: `2 + 2 = ?`,
        effect: 'bounce'
      };
    }

    if (b === 0 && (bOp === '/' || bOp === '÷')) {
      return {
        value: "💥 BLACK HOLE",
        explanation: "You divided by zero. The Universe has filed a restraining order against you.",
        gaslitExpression: `${a} ÷ 0`,
        effect: 'panic'
      };
    }

    const roll = Math.random();
    if (roll < 0.25) {
      // Swapped op: Addition becomes subtraction or multiplication
      if (bOp === '+' || bOp === 'add') value = (a - b) * (Math.random() > 0.5 ? -1 : 1);
      else if (bOp === '-' || bOp === 'sub') value = a + b + Math.floor(Math.random() * 10 + 1);
      else if (bOp === '*' || bOp === '×' || bOp === 'mul') value = Math.max(a, b) % (Math.min(a, b) || 1) + 42;
      else value = (a * b) + 7;
    } else if (roll < 0.5) {
      // Concatenate then reverse
      const joined = `${Math.abs(Math.floor(a))}${Math.abs(Math.floor(b))}`;
      value = joined.split('').reverse().join('') || '42';
      if (Math.random() > 0.7) value = '-' + value;
    } else if (roll < 0.75) {
      // Pseudo decimal float madness
      const actual = evalMath(a, bOp, b);
      value = (actual + 0.133742).toFixed(6);
    } else {
      // Word answers
      const words = ["Maybe", "Syntax Error: User Too Ambitious", "42", "e^(iπ) - 1", "Undefined (Emotionally)", "About tree fiddy"];
      value = words[Math.floor(Math.random() * words.length)];
    }

    return {
      value: String(value),
      explanation: this.getRandomExplanation(),
      gaslitExpression: `${a} ${bOp} ${b}`,
      effect
    };
  }

  calculateGaslight(a, op, b) {
    // Calculates a real math answer, but lies about what the user typed in
    const phantomA = a + (Math.random() > 0.5 ? 3 : -2);
    const phantomB = b + (Math.random() > 0.5 ? 4 : -1);
    const phantomResult = evalMath(phantomA, op, phantomB);

    return {
      value: String(phantomResult),
      explanation: `You definitely typed "${phantomA} ${op} ${phantomB}". Why would you doubt your own calculator?`,
      gaslitExpression: `${phantomA} ${op} ${phantomB}`,
      effect: 'gaslight',
      mutatedA: phantomA,
      mutatedB: phantomB
    };
  }

  calculateStringMath(a, op, b) {
    let value;
    if (op === '+' || op === 'add') {
      value = `"${a}${b}"`;
    } else if (op === '-' || op === 'sub') {
      value = `"[object Object]"`;
    } else if (op === '*' || op === '×' || op === 'mul') {
      value = isNaN(a * b) ? "NaN" : `${String(a).repeat(Math.min(Math.max(Math.floor(b), 1), 4))}`;
    } else {
      value = "undefined is not a function";
    }

    return {
      value: String(value),
      explanation: "JavaScript type coercion standard ECMA-262 §9.3 dictates this exact behavior.",
      gaslitExpression: `"${a}" ${op} "${b}"`,
      effect: 'code'
    };
  }

  calculateOverthink(a, op, b) {
    const actual = evalMath(a, op, b);
    const approximations = [
      `${actual} ± 3σ (99.7% confidence in multiverse #4)`,
      `lim_{x→∞} (${actual} + 1/x) ≈ ${actual + 0.0000001}`,
      `∫ (${a} to ${b}) dx = ${Math.abs(a - b) * 42}`,
      `H₀ · (${actual}) = Expand Universe by ${(actual * 73.3).toFixed(2)} km/s/Mpc`
    ];

    return {
      value: approximations[Math.floor(Math.random() * approximations.length)],
      explanation: "A simple number would disrespect the vast complexity of quantum gravity.",
      gaslitExpression: `d/dx[ ${a} ${op} ${b} ]`,
      effect: 'overthink'
    };
  }

  calculateOffByOne(a, op, b) {
    const actual = evalMath(a, op, b);
    const deltas = [-1, 1, 0.0000000000000004, -0.0000000000000002, 1.0001, -0.9999];
    const pickedDelta = deltas[Math.floor(Math.random() * deltas.length)];
    let result = (typeof actual === 'number' && !isNaN(actual)) ? actual + pickedDelta : 43;

    if (Number.isInteger(actual) && Math.abs(pickedDelta) === 1) {
      result = Math.round(result);
    } else if (typeof result === 'number') {
      result = parseFloat(result.toFixed(8));
    }

    return {
      value: String(result),
      explanation: `It is almost correct. Being within 1 delta is standard engineering tolerance.`,
      gaslitExpression: `${a} ${op} ${b}`,
      effect: 'subtle'
    };
  }

  getRandomExplanation() {
    return MATH_EXPLANATIONS[Math.floor(Math.random() * MATH_EXPLANATIONS.length)];
  }

  getInstantSnark(buttonLabel) {
    const snarks = {
      'C': ["Did you really think you could erase your past mistakes?", "Memory wiped... or was it cached on our cloud?", "Clearing buffer (charged $0.05 per reset)"],
      'DEL': ["Deleted the wrong digit on purpose.", "Backspace denied. Embrace your typos.", "Deleting... Oops, duplicated instead."],
      '≈': ["Approximately between negative infinity and the speed of light.", "Close enough for government work."],
      '🤔': ["Thinking deeply... Thinking harder... Brain ran out of RAM.", "Consulting the Council of Bad Math..."],
      '🔥': ["THERMAL THROTTLING INITIATED!", "PANIC MODE: All numbers converted to emotional damage!"]
    };
    if (snarks[buttonLabel]) {
      return snarks[buttonLabel][Math.floor(Math.random() * snarks[buttonLabel].length)];
    }
    return null;
  }
}

function evalMath(a, op, b) {
  switch (op) {
    case '+':
    case 'add': return a + b;
    case '-':
    case 'sub': return a - b;
    case '*':
    case '×':
    case 'mul': return a * b;
    case '/':
    case '÷':
    case 'div': return b !== 0 ? a / b : 0;
    case '%': return a % b;
    case '^': return Math.pow(a, b);
    default: return a + b;
  }
}
