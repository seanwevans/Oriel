export function getCalcContent() {
  return `<div class="calc-grid">
            <div class="calc-display" id="calc-disp" data-val="0">0</div>
            <div class="calc-btn" data-app-action="calcInput" data-calc-value="C">C</div>
            <div class="calc-btn" data-app-action="calcInput" data-calc-value="/">/</div>
            <div class="calc-btn" data-app-action="calcInput" data-calc-value="*">*</div>
            <div class="calc-btn" data-app-action="calcInput" data-calc-value="-">-</div>
            <div class="calc-btn" data-app-action="calcInput" data-calc-value="7">7</div>
            <div class="calc-btn" data-app-action="calcInput" data-calc-value="8">8</div>
            <div class="calc-btn" data-app-action="calcInput" data-calc-value="9">9</div>
            <div class="calc-btn op" data-app-action="calcInput" data-calc-value="+">+</div>
            <div class="calc-btn" data-app-action="calcInput" data-calc-value="4">4</div>
            <div class="calc-btn" data-app-action="calcInput" data-calc-value="5">5</div>
            <div class="calc-btn" data-app-action="calcInput" data-calc-value="6">6</div>
            <div class="calc-btn op" style="grid-row:span 2" data-app-action="calcInput" data-calc-value="=">=</div>
            <div class="calc-btn" data-app-action="calcInput" data-calc-value="1">1</div>
            <div class="calc-btn" data-app-action="calcInput" data-calc-value="2">2</div>
            <div class="calc-btn" data-app-action="calcInput" data-calc-value="3">3</div>
            <div class="calc-btn" style="grid-column: span 2" data-app-action="calcInput" data-calc-value="0">0</div>
            <div class="calc-btn" data-app-action="calcInput" data-calc-value=".">.</div>
          </div>`;
}
