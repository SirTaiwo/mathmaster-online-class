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

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    graphPoints = [];

    document.getElementById(
        "graphPointResult"
    ).innerHTML = "Point:";

    document.getElementById(
        "gradientResult"
    ).innerHTML = "Gradient:";

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


    drawGraph();

    drawGraphPoints();


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


    drawGraph();

    drawGraphPoints();


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
