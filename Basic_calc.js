        // Calculator state
        let currentInput = '0';
        let previousInput = '';
        let operation = null;
        let memory = 0;
        let shouldResetScreen = false;

        // DOM elements
        const resultDisplay = document.getElementById('result');
        const expressionDisplay = document.getElementById('expression');
        const memoryIndicator = document.getElementById('memory-indicator');

        // Update display
        function updateDisplay() {
            resultDisplay.textContent = currentInput;
            expressionDisplay.textContent = previousInput + (operation ? ' ' + operation : '');
            
            // Show memory indicator only if memory has value
            memoryIndicator.textContent = memory !== 0 ? `M: ${memory}` : '';
        }

        // Append value to current input
        function appendValue(value) {
            // Reset if previous operation just completed
            if (shouldResetScreen) {
                currentInput = '';
                shouldResetScreen = false;
            }
            
            // Handle decimal point
            if (value === '.' && currentInput.includes('.')) return;
            
            // Handle leading zero
            if (currentInput === '0' && value !== '.') {
                currentInput = value;
            } else {
                currentInput += value;
            }
            
            updateDisplay();
        }

        // Clear display and reset state
        function clearDisplay() {
            currentInput = '0';
            previousInput = '';
            operation = null;
            shouldResetScreen = false;
            updateDisplay();
        }

        // Backspace function
        function backspace() {
            currentInput = currentInput.toString().slice(0, -1);
            if (currentInput === '' || currentInput === '-') currentInput = '0';
            updateDisplay();
        }

        // Set operation
        function setOperation(op) {
            if (currentInput === '') return;
            
            if (previousInput !== '') {
                calculateResult();
            }
            
            operation = op;
            previousInput = currentInput;
            shouldResetScreen = true;
            updateDisplay();
        }

        // Calculate result
        function calculateResult() {
            if (operation === null || previousInput === '') return;
            
            let computation;
            const prev = parseFloat(previousInput);
            const current = parseFloat(currentInput);
            
            if (isNaN(prev) || isNaN(current)) return;
            
            try {
                switch (operation) {
                    case '+':
                        computation = prev + current;
                        break;
                    case '-':
                        computation = prev - current;
                        break;
                    case '*':
                        computation = prev * current;
                        break;
                    case '/':
                        if (current === 0) {
                            throw new Error("Division by zero");
                        }
                        computation = prev / current;
                        break;
                    case '%':
                        computation = prev % current;
                        break;
                    default:
                        return;
                }
                
                // Format number to avoid long decimals
                currentInput = parseFloat(computation.toFixed(10)).toString();
                operation = null;
                previousInput = '';
                shouldResetScreen = true;
                updateDisplay();
                
            } catch (error) {
                handleError(error.message);
            }
        }

        // Calculate square root
        function calculateSquareRoot() {
            try {
                const value = parseFloat(currentInput);
                if (value < 0) throw new Error("Invalid input");
                currentInput = Math.sqrt(value).toString();
                updateDisplay();
            } catch (error) {
                handleError("Invalid input");
            }
        }

        // Handle memory operations
        function handleMemory(action) {
            const current = parseFloat(currentInput) || 0;
            
            switch (action) {
                case 'mc': // Memory clear
                    memory = 0;
                    break;
                case 'mr': // Memory recall
                    currentInput = memory.toString();
                    break;
                case 'm+': // Memory add
                    memory += current;
                    break;
                case 'm-': // Memory subtract
                    memory -= current;
                    break;
            }
            
            updateDisplay();
        }

        // Handle errors
        function handleError(message) {
            resultDisplay.textContent = message;
            resultDisplay.classList.add('error');
            setTimeout(() => {
                clearDisplay();
                resultDisplay.classList.remove('error');
            }, 2000);
        }

        // Keyboard support
        document.addEventListener('keydown', (event) => {
            if (/[0-9]/.test(event.key)) {
                appendValue(event.key);
            } else if (event.key === '.') {
                appendValue('.');
            } else if (event.key === '+' || event.key === '-') {
                setOperation(event.key);
            } else if (event.key === '*') {
                setOperation('*');
            } else if (event.key === '/') {
                setOperation('/');
            } else if (event.key === '%') {
                setOperation('%');
            } else if (event.key === 'Enter' || event.key === '=') {
                calculateResult();
            } else if (event.key === 'Escape') {
                clearDisplay();
            } else if (event.key === 'Backspace') {
                backspace();
            } else if (event.key === 'm' || event.key === 'M') {
                // Handle memory shortcuts
                if (event.ctrlKey) {
                    if (event.shiftKey) {
                        handleMemory('mc');
                    } else {
                        handleMemory('mr');
                    }
                }
            }
        });

        // Initialize display
        updateDisplay();