let calculatorExpression = "";
let calculatorHistory = [];


const calculatorDisplay =
    document.getElementById("calculatorDisplay");



function updateCalculatorDisplay() {

    calculatorDisplay.value =
        calculatorExpression || "0";

}



function calculatorInput(value) {

    calculatorExpression += value;

    updateCalculatorDisplay();

}



function calculatorClear() {

    calculatorExpression = "";

    updateCalculatorDisplay();

}



function calculatorBackspace() {

    calculatorExpression =
        calculatorExpression.slice(0, -1);

    updateCalculatorDisplay();

}



function calculatorPercentage() {

    if (!calculatorExpression) {
        return;
    }

    try {

        const value =
            evaluateCalculatorExpression(
                calculatorExpression
            );

        calculatorExpression =
            formatCalculatorResult(value / 100);

        updateCalculatorDisplay();

    } catch {

        calculatorDisplay.value =
            "Error";

        calculatorExpression = "";

    }

}



function calculatorCalculate() {

    if (!calculatorExpression) {
        return;
    }

    try {

        const expression =
            calculatorExpression;

        const result =
            evaluateCalculatorExpression(
                expression
            );


        calculatorHistory.unshift({

            expression: expression,

            result: result

        });


        if (calculatorHistory.length > 10) {

            calculatorHistory =
                calculatorHistory.slice(0, 10);

        }


        calculatorExpression =
            formatCalculatorResult(result);

        updateCalculatorDisplay();

        renderCalculatorHistory();

    } catch {

        calculatorDisplay.value =
            "Error";

        calculatorExpression = "";

    }

}



/*
 * Safe arithmetic expression parser.
 *
 * Supports:
 *   numbers
 *   decimals
 *   + - * /
 *   parentheses
 *   unary + and -
 */
function evaluateCalculatorExpression(expression) {

    const tokens =
        tokenizeCalculatorExpression(
            expression
        );


    let position = 0;


    function currentToken() {

        return tokens[position];

    }


    function consume(expected) {

        if (currentToken() === expected) {

            position++;

            return true;

        }

        return false;

    }


    function parseExpression() {

        let value =
            parseTerm();


        while (
            currentToken() === "+" ||
            currentToken() === "-"
        ) {

            const operator =
                currentToken();

            position++;


            const right =
                parseTerm();


            if (operator === "+") {

                value += right;

            } else {

                value -= right;

            }

        }


        return value;

    }


    function parseTerm() {

        let value =
            parseFactor();


        while (
            currentToken() === "*" ||
            currentToken() === "/"
        ) {

            const operator =
                currentToken();

            position++;


            const right =
                parseFactor();


            if (operator === "*") {

                value *= right;

            } else {

                if (right === 0) {

                    throw new Error(
                        "Division by zero"
                    );

                }

                value /= right;

            }

        }


        return value;

    }


    function parseFactor() {

        if (consume("+")) {

            return parseFactor();

        }


        if (consume("-")) {

            return -parseFactor();

        }


        if (consume("(")) {

            const value =
                parseExpression();


            if (!consume(")")) {

                throw new Error(
                    "Missing closing parenthesis"
                );

            }


            return value;

        }


        const token =
            currentToken();


        if (
            token === undefined ||
            !/^\d*\.?\d+$/.test(token)
        ) {

            throw new Error(
                "Invalid number"
            );

        }


        position++;


        return Number(token);

    }


    const result =
        parseExpression();


    if (position !== tokens.length) {

        throw new Error(
            "Invalid expression"
        );

    }


    if (
        typeof result !== "number" ||
        !Number.isFinite(result)
    ) {

        throw new Error(
            "Invalid result"
        );

    }


    return result;

}



function tokenizeCalculatorExpression(expression) {

    const tokens = [];

    let index = 0;


    while (index < expression.length) {

        const character =
            expression[index];


        if (/\s/.test(character)) {

            index++;

            continue;

        }


        if (
            "+-*/()".includes(character)
        ) {

            tokens.push(character);

            index++;

            continue;

        }


        if (
            /\d/.test(character) ||
            character === "."
        ) {

            let number = "";

            let decimalCount = 0;


            while (
                index < expression.length
            ) {

                const current =
                    expression[index];


                if (/\d/.test(current)) {

                    number += current;

                    index++;

                    continue;

                }


                if (current === ".") {

                    decimalCount++;

                    if (decimalCount > 1) {

                        throw new Error(
                            "Invalid decimal"
                        );

                    }

                    number += current;

                    index++;

                    continue;

                }


                break;

            }


            if (
                number === "." ||
                number === ""
            ) {

                throw new Error(
                    "Invalid number"
                );

            }


            tokens.push(number);

            continue;

        }


        throw new Error(
            "Invalid character"
        );

    }


    if (!tokens.length) {

        throw new Error(
            "Empty expression"
        );

    }


    return tokens;

}



function formatCalculatorResult(value) {

    if (
        Number.isInteger(value)
    ) {

        return String(value);

    }


    return String(
        Number(
            value.toFixed(12)
        )
    );

}



function renderCalculatorHistory() {

    const historyContainer =
        document.getElementById(
            "calculatorHistory"
        );


    if (!calculatorHistory.length) {

        historyContainer.innerHTML =
            "<p>No calculations yet.</p>";

        return;

    }


    historyContainer.innerHTML =
        calculatorHistory
            .map(item => `
                <p>
                    ${escapeCalculatorHtml(item.expression)}
                    =
                    <strong>
                        ${escapeCalculatorHtml(
                            formatCalculatorResult(item.result)
                        )}
                    </strong>
                </p>
            `)
            .join("");

}



function clearCalculatorHistory() {

    calculatorHistory = [];

    renderCalculatorHistory();

}



function escapeCalculatorHtml(value) {

    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}



document.addEventListener(
    "keydown",
    function(event) {

        const allowedKeys =
            "0123456789+-*/().";


        if (
            allowedKeys.includes(event.key)
        ) {

            calculatorInput(event.key);

            event.preventDefault();

            return;

        }


        if (event.key === "Enter") {

            calculatorCalculate();

            event.preventDefault();

            return;

        }


        if (event.key === "Escape") {

            calculatorClear();

            event.preventDefault();

            return;

        }


        if (event.key === "Backspace") {

            calculatorBackspace();

            event.preventDefault();

        }

    }
);


updateCalculatorDisplay();
