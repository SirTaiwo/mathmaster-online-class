console.log("Graphing Tools JS Version 2026-08-27");

const canvas =
    document.getElementById("graphCanvas");

const ctx =
    canvas.getContext("2d");


// ======================
// GRAPH SETTINGS
// ======================

const originX =
    canvas.width / 2;

const originY =
    canvas.height / 2;

const scale = 40;


// ======================
// GRAPH DATA
// ======================

let graphPoints = [];


// ======================
// CLEAR GRAPH
// ======================

function clearGraph(){

    graphPoints = [];

    plottedFunctions = [];

    drawGraph();

    document.getElementById(
        "graphPointResult"
    ).innerHTML = "Point:";

    document.getElementById(
        "gradientResult"
    ).innerHTML = "Gradient:";

    document.getElementById(
        "functionResult"
    ).innerHTML = "Function:";

    updateFunctionList();

}


// ======================
// DRAW COORDINATE PLANE
// ======================

function drawGraph(){

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // ----------------------
    // Grid
    // ----------------------

    ctx.beginPath();

    for(
        let x = originX;
        x <= canvas.width;
        x += scale
    ){

        ctx.moveTo(x, 0);

        ctx.lineTo(
            x,
            canvas.height
        );

    }


    for(
        let x = originX - scale;
        x >= 0;
        x -= scale
    ){

        ctx.moveTo(x, 0);

        ctx.lineTo(
            x,
            canvas.height
        );

    }


    for(
        let y = originY;
        y <= canvas.height;
        y += scale
    ){

        ctx.moveTo(0, y);

        ctx.lineTo(
            canvas.width,
            y
        );

    }


    for(
        let y = originY - scale;
        y >= 0;
        y -= scale
    ){

        ctx.moveTo(0, y);

        ctx.lineTo(
            canvas.width,
            y
        );

    }

    ctx.stroke();


    // ----------------------
    // X Axis
    // ----------------------

    ctx.beginPath();

    ctx.moveTo(
        0,
        originY
    );

    ctx.lineTo(
        canvas.width,
        originY
    );

    ctx.stroke();


    // ----------------------
    // Y Axis
    // ----------------------

    ctx.beginPath();

    ctx.moveTo(
        originX,
        0
    );

    ctx.lineTo(
        originX,
        canvas.height
    );

    ctx.stroke();


    // ----------------------
    // Axis Labels
    // ----------------------

    ctx.font =
        "12px Arial";


    // X coordinates

    for(
        let value = -6;
        value <= 6;
        value++
    ){

        if(value === 0){
            continue;
        }

        const canvasX =
            originX +
            value * scale;

        ctx.fillText(
            value,
            canvasX - 4,
            originY + 15
        );

    }


    // Y coordinates

    for(
        let value = -5;
        value <= 5;
        value++
    ){

        if(value === 0){
            continue;
        }

        const canvasY =
            originY -
            value * scale;

        ctx.fillText(
            value,
            originX + 6,
            canvasY + 4
        );

    }


    // Origin

    ctx.fillText(
        "0",
        originX + 5,
        originY + 15
    );

}


// ======================
// DRAW ALL POINTS
// ======================

function drawGraphPoints(){

    graphPoints.forEach(point => {

        const canvasX =
            originX +
            point.x * scale;

        const canvasY =
            originY -
            point.y * scale;


        ctx.beginPath();

        ctx.arc(
            canvasX,
            canvasY,
            6,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.font =
            "14px Arial";


        ctx.fillText(

            point.label +
            " (" +
            point.x +
            "," +
            point.y +
            ")",

            canvasX + 8,
            canvasY - 8

        );

    });

}


// ======================
// PLOT GRAPH POINT
// ======================

function plotGraphPoint(){

    const x =
        Number(
            document.getElementById(
                "graphPointX"
            ).value
        );


    const y =
        Number(
            document.getElementById(
                "graphPointY"
            ).value
        );


    const label =
        document.getElementById(
            "graphPointLabel"
        ).value.trim();


    if(!Number.isFinite(x) ||
       !Number.isFinite(y)){

        document.getElementById(
            "graphPointResult"
        ).innerHTML =
            "Please enter valid coordinates.";

        return;

    }


    if(!label){

        document.getElementById(
            "graphPointResult"
        ).innerHTML =
            "Please enter a point label.";

        return;

    }


   graphPoints.push({

    x,
    y,
    label

});


    document.getElementById(
        "graphPointResult"
    ).innerHTML =

        "Point plotted: " +
        label +
        " (" +
        x +
        ", " +
        y +
        ")";

    redrawGraphWithFunctions();

}

// ======================
// FUNCTION PLOTTER
// ======================

let plottedFunctions = [];


// ----------------------
// TOKENIZER
// ----------------------

function tokenizeFunction(expression){

    const tokens = [];

    let i = 0;

    while(i < expression.length){

        const char = expression[i];

        // Ignore whitespace
        if(/\s/.test(char)){
            i++;
            continue;
        }

        // Numbers
        if(/[0-9.]/.test(char)){

            let number = "";

            while(
                i < expression.length &&
                /[0-9.]/.test(expression[i])
            ){

                number += expression[i];
                i++;

            }

            if(
                number === "." ||
                (number.match(/\./g) || []).length > 1
            ){

                throw new Error("Invalid number.");

            }

            tokens.push({
                type: "number",
                value: Number(number)
            });

            continue;

        }


        // Identifiers
        if(/[a-zA-Z]/.test(char)){

            let identifier = "";

            while(
                i < expression.length &&
                /[a-zA-Z]/.test(expression[i])
            ){

                identifier += expression[i];
                i++;

            }

            const name =
                identifier.toLowerCase();

            if(name === "x"){

                tokens.push({
                    type: "variable",
                    value: "x"
                });

            }
            else if(name === "pi"){

                tokens.push({
                    type: "constant",
                    value: Math.PI
                });

            }
            else if([
                "sin",
                "cos",
                "tan",
                "sqrt",
                "abs",
                "log",
                "exp"
            ].includes(name)){

                tokens.push({
                    type: "function",
                    value: name
                });

            }
            else{

                throw new Error(
                    "Unknown function or variable: " +
                    identifier
                );

            }

            continue;

        }


        // Operators
        if("+-*/^".includes(char)){

            tokens.push({
                type: "operator",
                value: char
            });

            i++;
            continue;

        }


        // Parentheses
        if(char === "("){

            tokens.push({
                type: "leftParen",
                value: char
            });

            i++;
            continue;

        }


        if(char === ")"){

            tokens.push({
                type: "rightParen",
                value: char
            });

            i++;
            continue;

        }


        throw new Error(
            "Invalid character: " + char
        );

    }

    return addImplicitMultiplication(tokens);

}


// ----------------------
// IMPLICIT MULTIPLICATION
// ----------------------

function addImplicitMultiplication(tokens){

    const result = [];

    function canEndValue(token){

        return token &&
            (
                token.type === "number" ||
                token.type === "variable" ||
                token.type === "constant" ||
                token.type === "rightParen"
            );

    }


    function canStartValue(token){

        return token &&
            (
                token.type === "number" ||
                token.type === "variable" ||
                token.type === "constant" ||
                token.type === "function" ||
                token.type === "leftParen"
            );

    }


    for(let i = 0; i < tokens.length; i++){

        const current = tokens[i];
        const previous = tokens[i - 1];

        if(
            canEndValue(previous) &&
            canStartValue(current)
        ){

            result.push({
                type: "operator",
                value: "*"
            });

        }

        result.push(current);

    }

    return result;

}


// ----------------------
// PARSER
// ----------------------

function parseFunction(expression){

    const tokens =
        tokenizeFunction(expression);

    if(tokens.length === 0){

        throw new Error(
            "Please enter a function."
        );

    }


    const output = [];

    const operators = [];


    const precedence = {

        "+": 1,
        "-": 1,
        "*": 2,
        "/": 2,
        "^": 3

    };


    const rightAssociative = {
        "^": true
    };


    for(let i = 0; i < tokens.length; i++){

        const token = tokens[i];


        if(
            token.type === "number" ||
            token.type === "variable" ||
            token.type === "constant"
        ){

            output.push(token);
            continue;

        }


        if(token.type === "function"){

            operators.push(token);
            continue;

        }


        if(token.type === "operator"){

            // Unary plus/minus
            if(
                (i === 0 ||
                tokens[i - 1].type === "operator" ||
                tokens[i - 1].type === "leftParen") &&
                (token.value === "+" ||
                token.value === "-")
            ){

                output.push({
                    type: "number",
                    value: 0
                });

            }


            while(operators.length){

                const top =
                    operators[operators.length - 1];

                if(top.type === "function"){

                    output.push(
                        operators.pop()
                    );

                    continue;

                }


                if(
                    top.type !== "operator"
                ){

                    break;

                }


                const topPrecedence =
                    precedence[top.value];

                const currentPrecedence =
                    precedence[token.value];


                if(
                    topPrecedence >
                    currentPrecedence ||
                    (
                        topPrecedence ===
                        currentPrecedence &&
                        !rightAssociative[token.value]
                    )
                ){

                    output.push(
                        operators.pop()
                    );

                }
                else{

                    break;

                }

            }


            operators.push(token);
            continue;

        }


        if(token.type === "leftParen"){

            operators.push(token);
            continue;

        }


        if(token.type === "rightParen"){

            let foundLeftParen = false;

            while(operators.length){

                const top =
                    operators.pop();

                if(top.type === "leftParen"){

                    foundLeftParen = true;
                    break;

                }

                output.push(top);

            }


            if(!foundLeftParen){

                throw new Error(
                    "Mismatched parentheses."
                );

            }


            if(
                operators.length &&
                operators[
                    operators.length - 1
                ].type === "function"
            ){

                output.push(
                    operators.pop()
                );

            }

        }

    }


    while(operators.length){

        const top =
            operators.pop();

        if(
            top.type === "leftParen" ||
            top.type === "rightParen"
        ){

            throw new Error(
                "Mismatched parentheses."
            );

        }

        output.push(top);

    }


    return output;

}


// ----------------------
// EXPRESSION EVALUATOR
// ----------------------

function evaluateFunction(rpn, xValue){

    const stack = [];


    for(const token of rpn){

        if(token.type === "number"){

            stack.push(token.value);
            continue;

        }


        if(token.type === "constant"){

            stack.push(token.value);
            continue;

        }


        if(token.type === "variable"){

            stack.push(xValue);
            continue;

        }


        if(token.type === "operator"){

            if(stack.length < 2){

                throw new Error(
                    "Invalid expression."
                );

            }


            const b = stack.pop();
            const a = stack.pop();

            let result;


            switch(token.value){

                case "+":
                    result = a + b;
                    break;

                case "-":
                    result = a - b;
                    break;

                case "*":
                    result = a * b;
                    break;

                case "/":
                    result = a / b;
                    break;

                case "^":
                    result = Math.pow(a, b);
                    break;

                default:
                    throw new Error(
                        "Unsupported operator."
                    );

            }

            stack.push(result);
            continue;

        }


        if(token.type === "function"){

            if(stack.length < 1){

                throw new Error(
                    "Invalid function expression."
                );

            }


            const value =
                stack.pop();

            const angleMode =
                document.getElementById(
                    "angleMode"
                ).value;


            let argument = value;


            if(
                angleMode === "degrees" &&
                (
                    token.value === "sin" ||
                    token.value === "cos" ||
                    token.value === "tan"
                )
            ){

                argument =
                    value *
                    Math.PI /
                    180;

            }


            let result;


            switch(token.value){

                case "sin":
                    result = Math.sin(argument);
                    break;

                case "cos":
                    result = Math.cos(argument);
                    break;

                case "tan":
                    result = Math.tan(argument);
                    break;

                case "sqrt":
                    result = Math.sqrt(value);
                    break;

                case "abs":
                    result = Math.abs(value);
                    break;

                case "log":
                    result = Math.log10(value);
                    break;

                case "exp":
                    result = Math.exp(value);
                    break;

                default:
                    throw new Error(
                        "Unsupported function."
                    );

            }


            stack.push(result);

        }

    }


    if(stack.length !== 1){

        throw new Error(
            "Invalid expression."
        );

    }


    return stack[0];

}


// ----------------------
// DRAW FUNCTION
// ----------------------

function drawFunction(rpn){

    const minX =
        -originX / scale;

    const maxX =
        (canvas.width - originX) / scale;


    const step =
        1 / scale;


    ctx.beginPath();


    let previousCanvasX = null;
    let previousCanvasY = null;


    for(
        let x = minX;
        x <= maxX;
        x += step
    ){

        let y;


        try{

            y =
                evaluateFunction(
                    rpn,
                    x
                );

        }
        catch(error){

            previousCanvasX = null;
            previousCanvasY = null;
            continue;

        }


        if(
            !Number.isFinite(y) ||
            Math.abs(y) > 100000
        ){

            previousCanvasX = null;
            previousCanvasY = null;
            continue;

        }


        const canvasX =
            originX +
            x * scale;

        const canvasY =
            originY -
            y * scale;


        // Break the graph when there is
        // an extreme jump between samples.
        if(
            previousCanvasY !== null &&
            Math.abs(
                canvasY -
                previousCanvasY
            ) > canvas.height * 1.5
        ){

            ctx.moveTo(
                canvasX,
                canvasY
            );

        }
        else if(
            previousCanvasX === null
        ){

            ctx.moveTo(
                canvasX,
                canvasY
            );

        }
        else{

            ctx.lineTo(
                canvasX,
                canvasY
            );

        }


        previousCanvasX = canvasX;
        previousCanvasY = canvasY;

    }


    ctx.stroke();

}


// ----------------------
// REDRAW FUNCTIONS
// ----------------------

function drawAllFunctions(){

    plottedFunctions.forEach(
        functionItem => {

            drawFunction(
                functionItem.rpn
            );

        }
    );

}


// ----------------------
// PLOT FUNCTION
// ----------------------

function plotFunction(){

    const input =
        document.getElementById(
            "functionInput"
        );


    let expression =
        input.value.trim();


    const result =
        document.getElementById(
            "functionResult"
        );


    if(!expression){

        result.innerHTML =
            "Please enter a function.";

        return;

    }


    // Allow the teacher to enter:
    // y = x^2
    // or simply:
    // x^2

    expression =
        expression
            .replace(/^y\s*=\s*/i, "")
            .trim();


    try{

        const rpn =
            parseFunction(
                expression
            );


        // Test the expression before
        // accepting it.
        const testValue =
            evaluateFunction(
                rpn,
                0
            );


        if(!Number.isFinite(testValue)){

            throw new Error(
                "The function is undefined at x = 0."
            );

        }


        plottedFunctions.push({

            expression,
            rpn

        });


        redrawGraphWithFunctions();


        result.innerHTML =
            "Function plotted: y = " +
            expression;


        input.value = "";

        updateFunctionList();

    }
    catch(error){

        result.innerHTML =
            "Unable to plot function: " +
            error.message;

    }

}


// ----------------------
// REDRAW GRAPH + FUNCTIONS
// ----------------------

function redrawGraphWithFunctions(){

    drawGraph();

    drawGraphPoints();

    drawAllFunctions();

}

// ----------------------
// FUNCTION LIST
// ----------------------

function updateFunctionList(){

    const list =
        document.getElementById(
            "functionList"
        );


    if(!plottedFunctions.length){

        list.innerHTML = "";

        return;

    }


    list.innerHTML =
        "<strong>Plotted Functions:</strong><br>" +
        plottedFunctions
            .map(
                functionItem =>
                    "y = " +
                    functionItem.expression
            )
            .join("<br>");

}


// ----------------------
// CLEAR FUNCTIONS
// ----------------------

function clearFunctions(){

    plottedFunctions = [];

    redrawGraphWithFunctions();


    document.getElementById(
        "functionResult"
    ).innerHTML =
        "Function:";


    updateFunctionList();

}


// ======================
// GRADIENT TOOL
// ======================

function calculateGradient(){

    if(graphPoints.length < 2){

        document.getElementById(
            "gradientResult"
        ).innerHTML =
            "Plot at least two points first.";

        return;

    }


    const pointA =
        graphPoints[
            graphPoints.length - 2
        ];


    const pointB =
        graphPoints[
            graphPoints.length - 1
        ];


    const rise =
        pointB.y -
        pointA.y;


    const run =
        pointB.x -
        pointA.x;


    if(run === 0){

        document.getElementById(
            "gradientResult"
        ).innerHTML =
            "Gradient: Undefined (vertical line).";

        return;

    }


    const gradient =
        rise / run;


    redrawGraphWithFunctions();


    // ----------------------
    // Draw line through points
    // ----------------------

    const x1 =
        originX +
        pointA.x * scale;

    const y1 =
        originY -
        pointA.y * scale;


    const x2 =
        originX +
        pointB.x * scale;

    const y2 =
        originY -
        pointB.y * scale;


    ctx.beginPath();

    ctx.moveTo(
        x1,
        y1
    );

    ctx.lineTo(
        x2,
        y2
    );

    ctx.stroke();


    document.getElementById(
        "gradientResult"
    ).innerHTML =

        "Gradient = " +
        rise +
        " / " +
        run +
        " = " +
        gradient.toFixed(2);

}


// ======================
// INITIAL GRAPH
// ======================

drawGraph();
