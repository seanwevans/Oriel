import { BaseApp } from "./base/BaseApp.js";
export function getCalcContent() {
  return `<div class="calc-grid">
            <div class="calc-display" id="calc-disp" data-val="0">0</div>
            <div class="calc-btn" data-value="C">C</div>
            <div class="calc-btn" data-value="/">/</div>
            <div class="calc-btn" data-value="*">*</div>
            <div class="calc-btn" data-value="-">-</div>
            <div class="calc-btn" data-value="7">7</div>
            <div class="calc-btn" data-value="8">8</div>
            <div class="calc-btn" data-value="9">9</div>
            <div class="calc-btn op" data-value="+">+</div>
            <div class="calc-btn" data-value="4">4</div>
            <div class="calc-btn" data-value="5">5</div>
            <div class="calc-btn" data-value="6">6</div>
            <div class="calc-btn op" style="grid-row:span 2" data-value="=">=</div>
            <div class="calc-btn" data-value="1">1</div>
            <div class="calc-btn" data-value="2">2</div>
            <div class="calc-btn" data-value="3">3</div>
            <div class="calc-btn" style="grid-column: span 2" data-value="0">0</div>
            <div class="calc-btn" data-value=".">.</div>
          </div>`;
}

export function initCalc(w) {
  w.addEventListener("click", (event) => {
    const button = event.target.closest(".calc-btn[data-value]");
    if (!button || !w.contains(button)) return;
    calcInput(w, button.dataset.value);
  });
}

function calcInput(win, v) {
  const d = win.querySelector("#calc-disp"),
    val = d.dataset.val;
  if (v === "C") d.dataset.val = "0";
  else if (v === "=") {
    try {
      const sanitized = val.replace(/\s+/g, "");
      const mathPattern = /^-?(\d+(?:\.\d+)?)([+\-*/]-?\d+(?:\.\d+)?)*$/;
      if (!mathPattern.test(sanitized)) {
        throw new Error("Invalid expression");
      }

      // Evaluate the sanitized expression using Function for isolation.
      // This avoids the broad security risks of eval while still supporting
      // basic arithmetic used by the calculator UI.
      // eslint-disable-next-line no-new-func
      const result = new Function(`"use strict"; return (${sanitized});`)();

      if (!Number.isFinite(result)) throw new Error("Invalid result");

      d.dataset.val = result.toString();
    } catch {
      d.dataset.val = "Err";
    }
  } else d.dataset.val = val === "0" && !"+-*/".includes(v) ? v : val + v;
  d.innerText = d.dataset.val;
}

export class CalcApp extends BaseApp {
  getWindowContent() {
    return getCalcContent(this.initData, this.services);
  }

  mount() {
    return initCalc(this.windowEl, this.initData, this.services.windowManager, this.services, this);
  }
}
