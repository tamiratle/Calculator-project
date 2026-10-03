        <button type="button" class="zero" data-action="digit" data-value="0">0</button>
        <button type="button" data-action="decimal">.</button>
        <button type="button" class="equals" data-action="equals">=</button>
      </div>
    </section>

    <footer class="navigation">
      <div class="nav-pill"></div>
    </footer>
  </main>

  <script>
    const display = document.getElementById("display");
    const buttons = document.querySelectorAll(".keys button");

    let currentValue = "0";
    let previousValue = null;
    let currentOperator = null;
    let waitingForNextNumber = false;

    function updateDisplay() {
      display.textContent = currentValue;
    }

    function formatNumber(number) {
      if (!Number.isFinite(number)) {
        return "Error";
      }

      // Avoid long floating-point results such as 0.30000000000000004.
      return String(Number(number.toPrecision(12)));
    }

    function clearCalculator() {
      currentValue = "0";
      previousValue = null;
      currentOperator = null;
      waitingForNextNumber = false;

      document.querySelectorAll(".operator").forEach(button => {
        button.classList.remove("selected");
      });

      updateDisplay();
    }

    function enterDigit(digit) {
      if (currentValue === "Error" || waitingForNextNumber) {
        currentValue = digit;
        waitingForNextNumber = false;
      } else if (currentValue === "0") {
        currentValue = digit;
      } else if (currentValue.replace("-", "").length < 14) {
        currentValue += digit;
      }

      updateDisplay();
    }

    function enterDecimal() {
      if (currentValue === "Error" || waitingForNextNumber) {
        currentValue = "0.";
        waitingForNextNumber = false;
      } else if (!currentValue.includes(".")) {
        currentValue += ".";
      }

      updateDisplay();
    }

    function calculate(firstNumber, secondNumber, operator) {
      switch (operator) {
        case "+":
          return firstNumber + secondNumber;
        case "−":
          return firstNumber - secondNumber;
        case "×":
          return firstNumber * secondNumber;
        case "÷":
          return secondNumber === 0 ? null : firstNumber / secondNumber;
        default:
          return secondNumber;
      }
    }

    function chooseOperator(operator, clickedButton) {
      const inputValue = Number(currentValue);

      if (currentValue === "Error") {
        return;
      }

      if (currentOperator && !waitingForNextNumber) {
        const result = calculate(previousValue, inputValue, currentOperator);

        if (result === null) {
          currentValue = "Error";
          previousValue = null;
          currentOperator = null;
          updateDisplay();
          return;
        }

        currentValue = formatNumber(result);
        previousValue = Number(currentValue);
        updateDisplay();
      } else {
        previousValue = inputValue;
      }

      currentOperator = operator;
      waitingForNextNumber = true;

      document.querySelectorAll(".operator").forEach(button => {
        button.classList.remove("selected");
      });

      clickedButton.classList.add("selected");
    }

    function showResult() {
      if (currentOperator === null || previousValue === null || currentValue === "Error") {
        return;
      }

      const result = calculate(
        previousValue,
        Number(currentValue),
        currentOperator
      );

      if (result === null) {
        currentValue = "Error";
      } else {
        currentValue = formatNumber(result);
      }

      previousValue = null;
      currentOperator = null;
      waitingForNextNumber = true;

      document.querySelectorAll(".operator").forEach(button => {
        button.classList.remove("selected");
      });

      updateDisplay();
    }

    buttons.forEach(button => {
      button.addEventListener("click", () => {
        const action = button.dataset.action;
        const value = button.dataset.value;

        if (action === "digit") {
          enterDigit(value);
