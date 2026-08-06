console.log("Geometry Tools JS Version 2026-08-03");
const canvas =
document.getElementById(
"geometryCanvas"
);

const ctx =
canvas.getContext("2d");

let plottedPoints = [];

// =======================
// TRANSLATION VARIABLES
// =======================

let translatedPoints = [];

// =======================
// RULER VARIABLES
// =======================

let rulerPointA = {
    x:100,
    y:200
};


let rulerPointB = {
    x:400,
    y:200
};



let draggingPoint = null;

// =======================
// RULER ROTATION
// =======================

let rulerRotationHandle = {
    x:250,
    y:150
};


let rotatingRuler = false;

// =======================
// ACTIVE TOOL
// =======================

let activeTool = null;



// =======================
// PROTRACTOR VARIABLES
// =======================

let vertex = {
    x:250,
    y:200
};


let armA = {
    x:120,
    y:300
};


let armB = {
    x:400,
    y:100
};


let draggingAnglePoint = null;



// =======================
// TRIANGLE VARIABLES
// =======================

let trianglePointA = {
    x:250,
    y:80
};


let trianglePointB = {
    x:100,
    y:300
};


let trianglePointC = {
    x:400,
    y:300
};

// =======================
// MIDPOINT TOOL
// =======================

let midpointFirst = null;
let midpointSecond = null;
let midpointPoint = null;

// ======================
// COMPASS TOOL
// ======================

let compassCenter = {
    x: 500,
    y: 320
};

let compassRadiusPoint = {
    x: 620,
    y: 320
};

let draggingCompassPoint = null;

function drawCircle(){

    clearCanvas();


    const radius =
    Number(
        document.getElementById(
            "radius"
        ).value
    );


    ctx.beginPath();

    ctx.arc(
        250,
        200,
        radius,
        0,
        Math.PI * 2
    );

    ctx.stroke();

}

// ======================
// COMPASS DRAWING
// ======================

function drawCompass(){

    clearCanvas();


    const radius =
    Math.hypot(
        compassRadiusPoint.x - compassCenter.x,
        compassRadiusPoint.y - compassCenter.y
    );


    ctx.beginPath();

    ctx.arc(
        compassCenter.x,
        compassCenter.y,
        radius,
        0,
        Math.PI * 2
    );

    ctx.stroke();


    ctx.beginPath();

    ctx.arc(
        compassCenter.x,
        compassCenter.y,
        8,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.beginPath();

    ctx.moveTo(
        compassCenter.x,
        compassCenter.y
    );

    ctx.lineTo(
        compassRadiusPoint.x,
        compassRadiusPoint.y
    );

    ctx.stroke();


    ctx.beginPath();

    ctx.arc(
        compassRadiusPoint.x,
        compassRadiusPoint.y,
        8,
        0,
        Math.PI * 2
    );

    ctx.fill();


    document.getElementById(
        "compassResult"
    ).innerHTML =
    "Radius: "
    +
    radius.toFixed(1)
    +
    " pixels";

}

// ======================
// MIDPOINT TOOL
// ======================

function startMidpointTool(){

    midpointFirst = null;
    midpointSecond = null;
    midpointPoint = null;

   

}

function calculateMidpoint(){

    midpointPoint = {

        x: (midpointFirst.x + midpointSecond.x) / 2,

        y: (midpointFirst.y + midpointSecond.y) / 2

    };

    drawMidpoint();

}

function drawMidpoint(){

    clearCanvas();

    // first point
    ctx.beginPath();
    ctx.arc(midpointFirst.x, midpointFirst.y, 6, 0, Math.PI * 2);
    ctx.fill();

    // second point
    ctx.beginPath();
    ctx.arc(midpointSecond.x, midpointSecond.y, 6, 0, Math.PI * 2);
    ctx.fill();

    // joining line
    ctx.beginPath();
    ctx.moveTo(midpointFirst.x, midpointFirst.y);
    ctx.lineTo(midpointSecond.x, midpointSecond.y);
    ctx.stroke();

    // midpoint
    ctx.beginPath();
    ctx.arc(midpointPoint.x, midpointPoint.y, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = "18px Arial";
    ctx.fillText("M", midpointPoint.x + 12, midpointPoint.y - 12);

    ctx.fillText(
    "A",
    midpointFirst.x + 10,
    midpointFirst.y - 10
);


ctx.fillText(
    "B",
    midpointSecond.x + 10,
    midpointSecond.y - 10
);

const AM =
Math.hypot(
    midpointPoint.x - midpointFirst.x,
    midpointPoint.y - midpointFirst.y
);


const MB =
Math.hypot(
    midpointSecond.x - midpointPoint.x,
    midpointSecond.y - midpointPoint.y
);


document.getElementById(
    "midpointResult"
).innerHTML =

`
Midpoint: (${midpointPoint.x.toFixed(1)}, ${midpointPoint.y.toFixed(1)})
<br>
AM = ${AM.toFixed(1)} px
<br>
MB = ${MB.toFixed(1)} px
`;

    document.getElementById("midpointResult").innerHTML =
        "Midpoint: (" +
        midpointPoint.x.toFixed(1) +
        ", " +
        midpointPoint.y.toFixed(1) +
        ")";
}

// ======================
// LINE SEGMENT TOOL
// ======================

function drawSegment(){

    clearCanvas();


    ctx.beginPath();

    ctx.moveTo(
        segmentPointA.x,
        segmentPointA.y
    );


    ctx.lineTo(
        segmentPointB.x,
        segmentPointB.y
    );


    ctx.stroke();



    // Draw endpoints

    ctx.beginPath();

    ctx.arc(
        segmentPointA.x,
        segmentPointA.y,
        7,
        0,
        Math.PI * 2
    );

    ctx.fill();



    ctx.beginPath();

    ctx.arc(
        segmentPointB.x,
        segmentPointB.y,
        7,
        0,
        Math.PI * 2
    );

    ctx.fill();



    // Labels

    ctx.font = "18px Arial";


    ctx.fillText(
        "A",
        segmentPointA.x + 10,
        segmentPointA.y - 10
    );


    ctx.fillText(
        "B",
        segmentPointB.x + 10,
        segmentPointB.y - 10
    );



    const length =
    Math.hypot(
        segmentPointB.x - segmentPointA.x,
        segmentPointB.y - segmentPointA.y
    );



    document.getElementById(
        "segmentResult"
    ).innerHTML =
    "Length: "
    +
    length.toFixed(1)
    +
    " pixels";

}

// =======================
// PARALLEL LINE TOOL
// =======================

let parallelStart = null;

let parallelEnd = null;

let parallelThroughPoint = null;

// ======================
// DRAW PARALLEL LINE
// ======================

function drawParallelLine(){


    clearCanvas();


    // Draw reference line

    ctx.beginPath();

    ctx.moveTo(
        parallelStart.x,
        parallelStart.y
    );


    ctx.lineTo(
        parallelEnd.x,
        parallelEnd.y
    );

    ctx.stroke();



    // Calculate direction

    const dx =
    parallelEnd.x -
    parallelStart.x;


    const dy =
    parallelEnd.y -
    parallelStart.y;



    // Draw parallel line
    // centred on chosen point

    const length =
    Math.hypot(dx,dy);



    const unitX =
    dx / length;


    const unitY =
    dy / length;



    const halfLength = 100;



    const x1 =
    parallelThroughPoint.x -
    unitX * halfLength;


    const y1 =
    parallelThroughPoint.y -
    unitY * halfLength;



    const x2 =
    parallelThroughPoint.x +
    unitX * halfLength;


    const y2 =
    parallelThroughPoint.y +
    unitY * halfLength;



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



    // Draw selected point

    ctx.beginPath();

    ctx.arc(
        parallelThroughPoint.x,
        parallelThroughPoint.y,
        7,
        0,
        Math.PI * 2
    );

    ctx.fill();



    document.getElementById(
        "parallelResult"
    ).innerHTML =
    "Parallel line constructed.";

}


function clearCanvas(){
// ======================
// PARALLEL LINE TOOL
// ======================

function startParallelTool(){

    parallelStart = null;

    parallelEnd = null;

    parallelThroughPoint = null;


    document.getElementById(
        "parallelResult"
    ).innerHTML =
    "Select reference line points.";

}
    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

}


function clearWorkspace(){

    clearCanvas();


    document.getElementById(
        "distanceResult"
    ).innerHTML =
    "Distance:";


    document.getElementById(
        "angleResult"
    ).innerHTML =
    "Angle:";


    document.getElementById(
        "triangleResult"
    ).innerHTML =
    "Triangle Information:";


}

function drawGrid(){

    clearCanvas();


    const gridSize = 40;


    const originX =
    canvas.width / 2;


    const originY =
    canvas.height / 2;



    ctx.beginPath();


    // Vertical grid lines

    for(
        let x = 0;
        x <= canvas.width;
        x += gridSize
    ){

        ctx.moveTo(
            x,
            0
        );

        ctx.lineTo(
            x,
            canvas.height
        );

    }



    // Horizontal grid lines

    for(
        let y = 0;
        y <= canvas.height;
        y += gridSize
    ){

        ctx.moveTo(
            0,
            y
        );

        ctx.lineTo(
            canvas.width,
            y
        );

    }


    ctx.stroke();



    // X-axis

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



    // Y-axis

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



    // Origin label

    ctx.font =
    "14px Arial";


    ctx.fillText(
        "0",
        originX + 5,
        originY - 5
    );

}

function plotPoint(){

    const x =
    Number(
        document.getElementById(
            "pointX"
        ).value
    );


    const y =
    Number(
        document.getElementById(
            "pointY"
        ).value
    );


    const label =
    document.getElementById(
        "pointLabel"
    ).value;



    plottedPoints.push({

        x,
        y,
        label

    });



    drawGrid();


    plottedPoints.forEach(point => {


        const canvasX =
        canvas.width / 2
        +
        point.x * 40;


        const canvasY =
        canvas.height / 2
        -
        point.y * 40;



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

            point.label
            +
            " ("
            +
            point.x
            +
            ","
            +
            point.y
            +
            ")",

            canvasX + 8,
            canvasY - 8

        );


    });



    document.getElementById(
        "pointResult"
    ).innerHTML =

    "Point plotted: "
    +
    label
    +
    "("
    +
    x
    +
    ","
    +
    y
    +
    ")";


}

// =======================
// TRANSLATION TOOL
// =======================

function translatePoint(){

    if(plottedPoints.length === 0){

        document.getElementById(
            "translationResult"
        ).innerHTML =
        "Please plot a point first.";

        return;

    }

    const dx =
    Number(
        document.getElementById(
            "translateX"
        ).value
    );

    const dy =
    Number(
        document.getElementById(
            "translateY"
        ).value
    );

    const original =
    plottedPoints[
        plottedPoints.length - 1
    ];

    const translated = {

        x: original.x + dx,

        y: original.y + dy,

        label: original.label + "'"

    };

    translatedPoints.push(
        translated
    );

    drawGrid();

    // Draw original points
    plottedPoints.forEach(point => {

        const canvasX =
        canvas.width / 2 + point.x * 40;

        const canvasY =
        canvas.height / 2 - point.y * 40;

        ctx.beginPath();
        ctx.arc(canvasX, canvasY, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillText(
            point.label,
            canvasX + 8,
            canvasY - 8
        );

    });

    // Draw translated points
    translatedPoints.forEach(point => {

        const canvasX =
        canvas.width / 2 + point.x * 40;

        const canvasY =
        canvas.height / 2 - point.y * 40;

        ctx.beginPath();
        ctx.arc(canvasX, canvasY, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillText(
            point.label,
            canvasX + 8,
            canvasY - 8
        );

    });

    document.getElementById(
        "translationResult"
    ).innerHTML =

    original.label +
    "(" +
    original.x +
    "," +
    original.y +
    ") → " +

    translated.label +
    "(" +
    translated.x +
    "," +
    translated.y +
    ")";

}

function rotatePoint(){

    if(plottedPoints.length === 0){

        document.getElementById(
            "rotationResult"
        ).innerHTML =
        "Please plot a point first.";

        return;

    }

    const point =
    plottedPoints[
        plottedPoints.length - 1
    ];

    const angle =
    parseFloat(
        document.getElementById(
            "rotationAngle"
        ).value
    ) * Math.PI / 180;

    const rotatedX =
        point.x * Math.cos(angle)
        -
        point.y * Math.sin(angle);

    const rotatedY =
        point.x * Math.sin(angle)
        +
        point.y * Math.cos(angle);

    clearCanvas();

    drawGrid();

    ctx.beginPath();

    ctx.arc(
        rotatedX,
        rotatedY,
        5,
        0,
        Math.PI * 2
    );

    ctx.fill();

    document.getElementById(
        "rotationResult"
    ).innerHTML =

        "Rotated Point: (" +
        rotatedX.toFixed(1) +
        ", " +
        rotatedY.toFixed(1) +
        ")";

}




function drawRuler(){

    clearCanvas();


    // ======================
    // RULER BODY
    // ======================

    const dx =
    rulerPointB.x - rulerPointA.x;

    const dy =
    rulerPointB.y - rulerPointA.y;


    const length =
    Math.hypot(dx, dy);


    const angle =
    Math.atan2(dy, dx);



    ctx.save();


    ctx.translate(
        rulerPointA.x,
        rulerPointA.y
    );


    ctx.rotate(angle);



    // ruler body

    ctx.beginPath();

    ctx.rect(
        0,
        -15,
        length,
        30
    );

    ctx.stroke();



   // ======================
// MEASUREMENT SCALE
// ======================

for(
    let i = 0;
    i <= length;
    i += 4
){

    let tickHeight = 5;


    // centimetre marks
    if(i % 40 === 0){

        tickHeight = 18;

    }

    // half centimetre marks
    else if(i % 20 === 0){

        tickHeight = 12;

    }


    ctx.beginPath();

    ctx.moveTo(
        i,
        -15
    );

    ctx.lineTo(
        i,
        -15 + tickHeight
    );

    ctx.stroke();



    // centimetre numbers

    if(i % 40 === 0){

        ctx.font =
        "12px Arial";


        ctx.fillText(
            i / 40,
            i - 5,
            10
        );

    }

}



    ctx.restore();

    // ======================
// ROTATION HANDLE
// ======================

const centerX =
(
    rulerPointA.x +
    rulerPointB.x
) / 2;


const centerY =
(
    rulerPointA.y +
    rulerPointB.y
) / 2;


rulerRotationHandle.x = centerX;
rulerRotationHandle.y = centerY - 50;


ctx.beginPath();

ctx.arc(
    rulerRotationHandle.x,
    rulerRotationHandle.y,
    8,
    0,
    Math.PI * 2
);

ctx.fill();



    // ======================
    // DRAG POINTS
    // ======================


    ctx.beginPath();

    ctx.arc(
        rulerPointA.x,
        rulerPointA.y,
        8,
        0,
        Math.PI * 2
    );


    ctx.arc(
        rulerPointB.x,
        rulerPointB.y,
        8,
        0,
        Math.PI * 2
    );


    ctx.fill();



    // ======================
    // MEASUREMENT
    // ======================


   const centimetres =
length / 40;


document.getElementById(
    "distanceResult"
).innerHTML =

"Length: "
+
centimetres.toFixed(1)
+
" cm";


}

function drawTriangle(){

    clearCanvas();


    // Draw triangle sides

    ctx.beginPath();

    ctx.moveTo(
    trianglePointA.x,
    trianglePointA.y
);

ctx.lineTo(
    trianglePointB.x,
    trianglePointB.y
);

ctx.lineTo(
    trianglePointC.x,
    trianglePointC.y
);


    ctx.closePath();

    ctx.stroke();



    // Draw vertices

   [
    trianglePointA,
    trianglePointB,
    trianglePointC
].forEach(point => {


        ctx.beginPath();


        ctx.arc(

            point.x,

            point.y,

            7,

            0,

            Math.PI * 2

        );


        ctx.fill();


    });



    // Side lengths

    const AB =
Math.hypot(
    trianglePointB.x - trianglePointA.x,
    trianglePointB.y - trianglePointA.y
);


    const BC =
Math.hypot(
    trianglePointC.x - trianglePointB.x,
    trianglePointC.y - trianglePointB.y
);


  const CA =
Math.hypot(
    trianglePointA.x - trianglePointC.x,
    trianglePointA.y - trianglePointC.y
);



    document.getElementById(
        "triangleResult"
    ).innerHTML =


    `
    AB: ${AB.toFixed(1)} px
    <br>

    BC: ${BC.toFixed(1)} px
    <br>

    CA: ${CA.toFixed(1)} px
    `;


}

   // ======================
// ANGLE TOOL
// ======================

function drawAngle(){

    clearCanvas();


    // Draw first arm

    ctx.beginPath();

    ctx.moveTo(
        vertex.x,
        vertex.y
    );

    ctx.lineTo(
        armA.x,
        armA.y
    );

    ctx.stroke();



    // Draw second arm

    ctx.beginPath();

    ctx.moveTo(
        vertex.x,
        vertex.y
    );

    ctx.lineTo(
        armB.x,
        armB.y
    );

    ctx.stroke();



    // Draw points

    [
        armA,
        armB,
        vertex

    ].forEach(point => {

        ctx.beginPath();

        ctx.arc(
            point.x,
            point.y,
            8,
            0,
            Math.PI * 2
        );

        ctx.fill();

    });



    // Calculate angle

    const angle1 =
    Math.atan2(
        armA.y - vertex.y,
        armA.x - vertex.x
    );


    const angle2 =
    Math.atan2(
        armB.y - vertex.y,
        armB.x - vertex.x
    );


    let degrees =
    Math.abs(
        (angle2 - angle1)
        *
        180
        /
        Math.PI
    );


    if(degrees > 180){

        degrees =
        360 - degrees;

    }



    document.getElementById(
        "angleResult"
    ).innerHTML =

    "Angle: "
    +
    degrees.toFixed(1)
    +
    "°";



    // Arc

    ctx.beginPath();

    ctx.arc(
        vertex.x,
        vertex.y,
        80,
        angle1,
        angle2
    );

    ctx.stroke();


    // Label

    const midAngle =
    (angle1 + angle2) / 2;


    ctx.font =
    "18px Arial";


    ctx.fillText(
        degrees.toFixed(1) + "°",
        vertex.x + Math.cos(midAngle) * 100,
        vertex.y + Math.sin(midAngle) * 100
    );

}

canvas.addEventListener(
"mousedown",
function(event){


    const rect =
    canvas.getBoundingClientRect();


    const mouseX =
    event.clientX - rect.left;


    const mouseY =
    event.clientY - rect.top;



// ======================
// MIDPOINT TOOL
// ======================

if(activeTool === "midpoint"){


    if(midpointFirst === null){

        midpointFirst = {
            x: mouseX,
            y: mouseY
        };

        return;

    }


    else if(midpointSecond === null){

        midpointSecond = {
            x: mouseX,
            y: mouseY
        };

        calculateMidpoint();

        return;

    }

}



// ======================
// LINE SEGMENT TOOL
// ======================

else if(activeTool === "segment"){


    if(segmentPointA === null){

        segmentPointA = {
            x: mouseX,
            y: mouseY
        };

    }


    else if(segmentPointB === null){

        segmentPointB = {
            x: mouseX,
            y: mouseY
        };

        drawSegment();

    }

}

// ======================
// PARALLEL LINE TOOL
// ======================

else if(activeTool === "parallel"){


    if(parallelStart === null){


        parallelStart = {

            x: mouseX,
            y: mouseY

        };


    }


    else if(parallelEnd === null){


        parallelEnd = {

            x: mouseX,
            y: mouseY

        };


        document.getElementById(
            "parallelResult"
        ).innerHTML =
        "Now select point for parallel line.";


    }


    else if(parallelThroughPoint === null){


        parallelThroughPoint = {

            x: mouseX,
            y: mouseY

        };


        drawParallelLine();


    }


}



// ======================
// RULER TOOL
// ======================

else if(activeTool === "ruler"){


    if(
        Math.hypot(
            mouseX - rulerRotationHandle.x,
            mouseY - rulerRotationHandle.y
        ) < 15
    ){

        draggingPoint = "rulerRotate";

    }


    else if(
        Math.hypot(
            mouseX - rulerPointA.x,
            mouseY - rulerPointA.y
        ) < 15
    ){

        draggingPoint = "rulerA";

    }


    else if(
        Math.hypot(
            mouseX - rulerPointB.x,
            mouseY - rulerPointB.y
        ) < 15
    ){

        draggingPoint = "rulerB";

    }

}



// ======================
// COMPASS TOOL
// ======================

else if(activeTool === "compass"){


    if(
        Math.hypot(
            mouseX - compassCenter.x,
            mouseY - compassCenter.y
        ) < 15
    ){

        draggingCompassPoint = "center";

    }


    else if(
        Math.hypot(
            mouseX - compassRadiusPoint.x,
            mouseY - compassRadiusPoint.y
        ) < 15
    ){

        draggingCompassPoint = "radius";

    }

}



// ======================
// TRIANGLE TOOL
// ======================

else if(activeTool === "triangle"){


    if(
        Math.hypot(
            mouseX - trianglePointA.x,
            mouseY - trianglePointA.y
        ) < 15
    ){

        draggingPoint = "A";

    }


    else if(
        Math.hypot(
            mouseX - trianglePointB.x,
            mouseY - trianglePointB.y
        ) < 15
    ){

        draggingPoint = "B";

    }

}



// ======================
// ANGLE TOOL
// ======================

else if(activeTool === "angle"){


    if(
        Math.hypot(
            mouseX - armA.x,
            mouseY - armA.y
        ) < 15
    ){

        draggingAnglePoint = "A";

    }


    else if(
        Math.hypot(
            mouseX - armB.x,
            mouseY - armB.y
        ) < 15
    ){

        draggingAnglePoint = "B";

    }

}



// ======================
// POINT PLOTTER
// ======================

else if(activeTool === "point"){


    plottedPoints.push({

        x: mouseX,

        y: mouseY,

        label:
        document.getElementById(
            "pointLabel"
        ).value

    });


    plotPoint();

}


});

    // ======================
    // RULER + TRIANGLE
    // ======================
    canvas.addEventListener(
"mousemove",
function(event){


    const rect =
    canvas.getBoundingClientRect();


    const x =
    event.clientX - rect.left;


    const y =
    event.clientY - rect.top;

    if(draggingCompassPoint){


    if(draggingCompassPoint === "center"){

        const dx =
        x - compassCenter.x;

        const dy =
        y - compassCenter.y;


        compassCenter.x = x;
        compassCenter.y = y;


        compassRadiusPoint.x += dx;
        compassRadiusPoint.y += dy;

    }


    if(draggingCompassPoint === "radius"){

        compassRadiusPoint.x = x;
        compassRadiusPoint.y = y;

    }


    drawCompass();

}

    if(draggingPoint){


        if(draggingPoint === "rulerA"){

            rulerPointA.x = x;
            rulerPointA.y = y;

            drawRuler();

        }

        // ======================
// RULER ROTATION HANDLE
// ======================

if(draggingPoint === "rulerRotate"){

    const centerX =
    (
        rulerPointA.x +
        rulerPointB.x
    ) / 2;


    const centerY =
    (
        rulerPointA.y +
        rulerPointB.y
    ) / 2;


    const angle =
    Math.atan2(
        y - centerY,
        x - centerX
    );


    const length =
    Math.hypot(
        rulerPointB.x - rulerPointA.x,
        rulerPointB.y - rulerPointA.y
    );


    rulerPointA.x =
    centerX -
    Math.cos(angle) *
    length / 2;


    rulerPointA.y =
    centerY -
    Math.sin(angle) *
    length / 2;


    rulerPointB.x =
    centerX +
    Math.cos(angle) *
    length / 2;


    rulerPointB.y =
    centerY +
    Math.sin(angle) *
    length / 2;


    drawRuler();

}

        if(draggingPoint === "rulerB"){

            rulerPointB.x = x;
            rulerPointB.y = y;

            drawRuler();

        }


        if(draggingPoint === "A"){

            trianglePointA.x = x;
            trianglePointA.y = y;

            drawTriangle();

        }


       if(draggingPoint === "B"){

    trianglePointB.x = x;
    trianglePointB.y = y;

    drawTriangle();

}

}


// ======================
// ANGLE TOOL MOVEMENT
// ======================

if(draggingAnglePoint){

    if(draggingAnglePoint === "A"){

        armA.x = x;
        armA.y = y;

    }

    else if(draggingAnglePoint === "B"){

        armB.x = x;
        armB.y = y;

    }

    drawAngle();

}

});

// =======================
// LINE SEGMENT TOOL
// =======================

let segmentPointA = null;
let segmentPointB = null;
 



    
canvas.addEventListener(
"mouseup",
function(){

    draggingAnglePoint = null;

});


// Mouse move


// Mouse release

canvas.addEventListener(
"mouseup",
function(){

    draggingPoint = null;

    draggingCompassPoint = null;

});


