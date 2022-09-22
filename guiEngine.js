
var greek = {beta: "\u03B2", eps: "\u03B5", p:"\u03C6"};

function update() {
    // compute shapes from parameters and redraw

    let canvases = document.getElementsByTagName("canvas");
    huhShapes = [];
    for (let k = 1; k < canvases.length; k++) {

        let huh = makeShapeFromInput(k);
        huhShapes.push(huh);

        drawPoints("canvas" + k, huh.curvePoints(), huh.logRadius());

        const canvas = document.getElementById("canvas" + k);
        const ctx = canvas.getContext('2d');

        ctx.font = "16px Verdana";
        ctx.lineWidth = 1;
        if (checkCoPrime(huh.n, huh.m)) {
            ctx.fillStyle = 'black';
            ctx.fillText(greek.beta + "=" + Math.round(100 * huh.beta) / 100, 10, 20);
        } else {
            ctx.fillStyle = 'red';
            ctx.fillText("m and n are not co-prime", 10, 20);
        }

        document.getElementById("val_m" + k).innerHTML = document.getElementById("m" + k).value;
        document.getElementById("val_n" + k).innerHTML = document.getElementById("n" + k).value;
        document.getElementById("val_eps" + k).innerHTML = document.getElementById("eps" + k).value;
        document.getElementById("val_p" + k).innerHTML = document.getElementById("p" + k).value;
    }
    let sumShape = addHuhShapes(huhShapes);
    drawPoints("canvas" + canvases.length, sumShape.curvePoints(), sumShape.logRadius());
}

function makeShapeFromInput(shapeIx) {
    let m = parseInt(document.getElementById("m" + shapeIx).value);
    let n = parseInt(document.getElementById("n" + shapeIx).value);
    let eps = parseFloat(document.getElementById("eps" + shapeIx).value);
    let p = parseFloat(document.getElementById("p" + shapeIx).value) / 180 * Math.PI;
    let huh = new HuhShape(m, n, eps, p);
    return huh;
}

function checkCoPrime(a, b) {
    // check if numbers a and b are co-prime
    if (a == b) {
        return false;
    }
    for (let x = 2; x <= a && x <= b; x++) {
        if (a % x == 0 && b % x == 0) {
            return false;
        }
    }
    return true;
}

function transformPointsToCanvas_(canvas, points) {
    // scale and offset shape points

    const targetScaleVsCanvas = .75;

    const maxX = Math.max.apply(null, points.map(pt => Math.abs(pt.x)));
    const maxY = Math.max.apply(null, points.map(pt => Math.abs(pt.y)));
    const scale = targetScaleVsCanvas * .5 * Math.min(canvas.width, canvas.height) / Math.max(maxX, maxY);

    const center = {x: canvas.width / 2, y: canvas.width / 2};
    for (let point of points) {
        point.x = scale * point.x + center.x;
        point.y = scale * point.y + center.y;
    }
}

function colormapBR(v) {
    // convert 0 < scalar < 1 to an rgb value of a blue-red colormap
    r = v ** .5;
    g = .5 * (1 - v);
    b = (1 - v) ** .5;
    return 'rgb(' + Math.floor(r * 255) + ',' + Math.floor(g * 255) + ',' + Math.floor(b * 255)  + ')';
}

function normalizeArray_(arr) {
    let min = Math.min.apply(null, arr);
    let scale = 1 / (Math.max.apply(null, arr) - min);
    for (let i=0; i < arr.length; i++) {
        arr[i] = scale * (arr[i] - min);
    }
}

function drawPoints(canvasId, points, coloring) {
    // draw shape points to canvas.
    // the color value of points[i] is determined by the value of coloring[i].

    normalizeArray_(coloring);

    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0, canvas.width, canvas.height);

    transformPointsToCanvas_(canvas, points);

    ctx.lineWidth = 5;
    for (let i = 0; i < points.length - 1; i++) {
        ctx.beginPath();
        ctx.moveTo(points[i].x, points[i].y);
        ctx.lineTo(points[i + 1].x, points[i + 1].y);
        ctx.strokeStyle = colormapBR(coloring[i]);
        ctx.stroke();
    }

}

document.addEventListener('DOMContentLoaded', () => {
    buildInterface();
    update();
});

function makeParamInput(param, shapeIx, min, max, step, initVal, labelTxt) {
    
    // slider:
    let inpt = document.createElement("input");
    inpt.id = param + shapeIx + "";
    inpt.type = "range";
    inpt.min = min;
    inpt.step = step;
    inpt.value = initVal;
    inpt.max = max;
    inpt.oninput = update;

    // label:
    let lbl = document.createElement("label");
    lbl.for = inpt.id;
    lbl.innerHTML = labelTxt + " (" + (param in greek ? greek[param] : param) + "):";

    // value display:
    let prg = document.createElement("p");
    prg.innerHTML = "";
    prg.className = "val";
    prg.id = "val_" + inpt.id;

    let li = document.createElement("li");
    li.appendChild(lbl);
    li.appendChild(inpt);
    li.appendChild(prg);
    return li;
}

function buildInterface() {
    const CANVAS_DIM = 350;
    const INIT_SHAPE = [{m: 5, n: 1, eps: 2, p:0}, {m: 5, n: 6, eps: 1.1, p:0}];
    const nShapes = INIT_SHAPE.length;

    for (let k = 0; k <= nShapes; k++) {
        let shapeIx = k + 1;
        const col = document.getElementById("col" + shapeIx);

        let canvas = document.createElement("canvas");
        canvas.id = "canvas" + shapeIx;
        canvas.width = CANVAS_DIM;
        canvas.height = CANVAS_DIM;
        canvas.class = "canvas";
        col.appendChild(canvas);

        let prg = document.createElement("p");
        prg.style.width = "100%";
        prg.innerHTML = k == nShapes ? "Mix" : "Shape " + shapeIx;
        prg.style.fontWeight = "bold";
        prg.style.textAlign = "center";
        col.appendChild(prg);

        if (k == nShapes) {
            continue;
        }

        let ul = document.createElement("ul");
        ul.appendChild(makeParamInput("m", shapeIx, 2, 10, 1, INIT_SHAPE[k].m, "Symmetry"));
        ul.appendChild(makeParamInput("n", shapeIx, 1, 10, 1, INIT_SHAPE[k].n, "Period"));
        ul.appendChild(makeParamInput("eps", shapeIx, 0, 2, .1, INIT_SHAPE[k].eps, "Eccentricity"));
        ul.appendChild(makeParamInput("p", shapeIx, -90, 90, 1, INIT_SHAPE[k].p, "Phase"));
        col.appendChild(ul);
    }

}
