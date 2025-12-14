export function getCalcContent() {
  return `<div class="calc-grid">
            <div class="calc-display" id="calc-disp" data-val="0">0</div>
            <div class="calc-btn" onclick="calcInput(event, 'C')">C</div>
            <div class="calc-btn" onclick="calcInput(event, '/')">/</div>
            <div class="calc-btn" onclick="calcInput(event, '*')">*</div>
            <div class="calc-btn" onclick="calcInput(event, '-')">-</div>
            <div class="calc-btn" onclick="calcInput(event, '7')">7</div>
            <div class="calc-btn" onclick="calcInput(event, '8')">8</div>
            <div class="calc-btn" onclick="calcInput(event, '9')">9</div>
            <div class="calc-btn op" onclick="calcInput(event, '+')">+</div>
            <div class="calc-btn" onclick="calcInput(event, '4')">4</div>
            <div class="calc-btn" onclick="calcInput(event, '5')">5</div>
            <div class="calc-btn" onclick="calcInput(event, '6')">6</div>
            <div class="calc-btn op" style="grid-row:span 2" onclick="calcInput(event, '=')">=</div>
            <div class="calc-btn" onclick="calcInput(event, '1')">1</div>
            <div class="calc-btn" onclick="calcInput(event, '2')">2</div>
            <div class="calc-btn" onclick="calcInput(event, '3')">3</div>
            <div class="calc-btn" style="grid-column: span 2" onclick="calcInput(event, '0')">0</div>
            <div class="calc-btn" onclick="calcInput(event, '.')">.</div>
          </div>`;
}
