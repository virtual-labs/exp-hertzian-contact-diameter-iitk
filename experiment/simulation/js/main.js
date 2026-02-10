/************************************************************
 * GLOBAL VARIABLES
 ************************************************************/
let appliedForce = 0;
let holdTime = 0;
let stage = 0;

let indenter = null;
let baseImg = null;

let heading = document.getElementById("heading");
let resultBtn = document.getElementById("resultBtn");
let conclusionBtn = document.getElementById("conclusionBtn");

resultBtn.style.display = "none";
conclusionBtn.style.display = "none";

const INDENTER_TOP = "1.png";
const BASE_INITIAL = "2.png";
const BASE_TOUCH = "3.png";
const BASE_COMPRESS = "4.png";
const BASE_FINAL = "5.png";

const PNG_BLOCK_HTML = `
<div id="pngStage" class="png-stage" style="display:block;">
    <img id="baseImg" class="base-img" src="">
    <img id="indenterImg" class="indenter-img" src="">
</div>
`;

/************************************************************
 * PROCEDURE POPUP
 ************************************************************/
function openProcedure() {
    document.getElementById("procedure").style.display = "flex";
}
function closeProcedure() {
    document.getElementById("procedure").style.display = "none";
}
function resetExperiment() {
    window.location.reload();
}

/************************************************************
 * FORMULA POPUP
 ************************************************************/
function showformula() {
    document.getElementById("formulaModal").style.display = "flex";
}
function closeFormula() {
    document.getElementById("formulaModal").style.display = "none";
}

/************************************************************
 * MATERIAL SELECTION
 ************************************************************/
function showMaterialOptions() {
    document.getElementById("materialOptions").style.display = "block";
    document.getElementById("performIndentBtn").style.display = "none";
}

function materialSelected() {
    document.getElementById("mildRadio").disabled = true;
    document.getElementById("performIndentBtn").style.display = "block";
}

function showIndentPanel() {
    document.getElementById("indentPanel").style.display = "block";
}

/************************************************************
 * INPUT VALIDATION
 ************************************************************/
const forceInput = document.getElementById("forceInput");
const timeInput = document.getElementById("timeInput");
const submitBtn = document.getElementById("submitIndent");

function validateInputs() {
    const f = parseFloat(forceInput.value);
    const t = parseFloat(timeInput.value);
    submitBtn.disabled = !(f >= 0.1 && f <= 10 && t >= 0);
}
forceInput.addEventListener("input", validateInputs);
timeInput.addEventListener("input", validateInputs);

/************************************************************
 * SUBMIT INDENT VALUES
 ************************************************************/
function submitIndent() {
    holdTime = parseFloat(timeInput.value);
    appliedForce = parseFloat(forceInput.value);

    submitBtn.disabled = true;

    document.querySelector(".parameter-block").style.display = "block";
    resultBtn.style.display = "block";
    conclusionBtn.style.display = "block";

    console.log("Hold Time:", holdTime);
}

/************************************************************
 * 2D VIEW (HIDE SVG + LOAD PNG MACHINE)
 ************************************************************/
function display2d() {
    console.log("2D View Activated");

    // Hide SVG machine
    document.querySelector(".innersvg").style.display = "none";
    document.getElementById("legendBox").style.display = "block";

    const holder = document.getElementById("pngHolder");

    // Insert PNG block only once
    if (!document.getElementById("pngStage")) {
        holder.innerHTML = PNG_BLOCK_HTML;
    }

    // Connect PNG elements
    indenter = document.getElementById("indenterImg");
    baseImg = document.getElementById("baseImg");

    // Load starting images
    baseImg.src = BASE_INITIAL;
    indenter.src = INDENTER_TOP;

    // Reset indenter instantly
    indenter.style.transition = "none";
    indenter.style.transform = "translateX(-50%) translateY(0px)";
    void indenter.offsetWidth;
    indenter.style.transition = "transform 1s linear";

    heading.innerText = "2D Indentation View Ready";
}

/************************************************************
 * START INDENTATION (MOVE DOWN)
 ************************************************************/
function movedown() {
    if (!indenter || !baseImg) return;

    console.log("Indenter moving DOWN...");

    stage = 1;

    indenter.style.transition = "none";
    indenter.style.transform = "translateX(-50%) translateY(0px)";
    void indenter.offsetWidth;
    indenter.style.transition = "transform 1s linear";

    indenter.style.transform = "translateX(-50%) translateY(80px)";
}

/************************************************************
 * TRANSITION END HANDLER
 ************************************************************/
document.addEventListener("transitionend", (e) => {
    if (!indenter || e.target !== indenter) return;

    if (stage === 1) {
        stage = 2;
        touchEvent();
    }
    else if (stage === 2) {
        stage = 3;
        compressionEvent();
    }
    else if (stage === 4) {
        console.log("Indentation Completed");
    }
});

/************************************************************
 * TOUCH EVENT (CHANGE 2 → 3)
 ************************************************************/
function touchEvent() {
    baseImg.src = BASE_TOUCH;
    indenter.style.transform = "translateX(-50%) translateY(110px)";

    // 🎯 Start graph here at REAL contact moment
    document.getElementById("graphBox").style.display = "block";
    initGraph();
    startGraphEngineAtContact();
}

/************************************************************
 * COMPRESSION EVENT (CHANGE 3 → 4)
 ************************************************************/
function compressionEvent() {
    baseImg.src = BASE_COMPRESS;

    setTimeout(() => {
       
    
        retractIndenter();
        
    }, holdTime * 1000);
}

/************************************************************
 * RETRACTION EVENT (SHOW 5)
 ************************************************************/
function retractIndenter() {
    stage = 4;

    baseImg.src = BASE_FINAL;

    indenter.style.transform = "translateX(-50%) translateY(0px)";
}

/************************************************************
 * RESULT POPUP
 ************************************************************/
function showResult() {
    document.getElementById("resultModal").style.display = "flex";
}
function closeResult() {
    document.getElementById("resultModal").style.display = "none";
}

/************************************************************
 * CONCLUSION POPUP
 ************************************************************/
function showConclusion() {
    document.getElementById("conclusionModal").style.display = "flex";
}
function closeConclusion() {
    document.getElementById("conclusionModal").style.display = "none";
}



















function showMaterialOptions() {
    document.getElementById("materialOptions").style.display = "block";

    // Show nanoindentation button immediately (no selection needed)
    document.getElementById("performIndentBtn").style.display = "block";
}
























// show popup when page loads
window.onload = function() {
    document.getElementById("startupOverlay").style.display = "flex";
};

// handle submit
function submitLike() {
    const selected = document.querySelector('input[name="like"]:checked');

    if (!selected) {
        alert("Please select Yes or No.");
        return;
    }

    if (selected.value === "yes") {
        // Close popup
        document.getElementById("startupOverlay").style.display = "none";
    } else {
        // Open Google in new tab
        window.open("https://virtual-labs.github.io/exp-nanoindentation-measurement-iitk/", "_blank");
    }
}

















/* ============================================================
   GRAPH ENGINE — SELF-CONTAINED, EXTRACTED & CLEANED
   ============================================================ */

let canvas, ctx;

const origin = { x: 40, y: 190 };
const gWidth = 160;
const gHeight = 140;

let hmax = gWidth * 0.75;
let Pmax = gHeight * 0.85;
let hf   = gWidth * 0.18;

let animPhase = "idle";
let animT = 0;
let holdStartTime = null;
let holdLength = 0;


function initGraph() {
    canvas = document.getElementById("miniGraph");
    if (!canvas) return;

    ctx = canvas.getContext("2d");
    drawBaseGraph();
}

function drawBaseGraph() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1.5;

    // X axis
    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(origin.x + gWidth, origin.y);
    ctx.stroke();

    // Y axis
    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(origin.x, origin.y - gHeight);
    ctx.stroke();

    ctx.font = "10px Segoe UI";
    ctx.fillStyle = "#000";
    ctx.fillText("Displacement (h)", origin.x + 30, origin.y + 20);

    ctx.save();
    ctx.translate(origin.x - 25, origin.y - 70);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("Load (P)", 0, 0);
    ctx.restore();

    ctx.fillText(`Load = ${appliedForce} mN | Hold = ${holdTime}s`,
        origin.x - 5, origin.y + 35
    );
}

function animateIndentationCurve() {
    drawBaseGraph();

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.beginPath();

    const loadExp = 2.0;
    const unloadExp = 1.5;

    /* =============== LOADING =============== */
    if (animPhase === "loading") {
        animT += 0.010;

        for (let i = 0; i <= animT * 100; i++) {
            const t = i / 100;
            const h = hmax * t;
            const P = Pmax * Math.pow(t, loadExp);
            ctx.lineTo(origin.x + h, origin.y - P);
        }

        ctx.stroke();

        if (animT < 1) {
            requestAnimationFrame(animateIndentationCurve);
        } else {
            animPhase = "holding";
            holdStartTime = performance.now();
            requestAnimationFrame(animateIndentationCurve);
        }
        return;
    }

    /* =============== HOLDING =============== */
    if (animPhase === "holding") {
        for (let i = 0; i <= 100; i++) {
            const t = i / 100;
            ctx.lineTo(origin.x + hmax * t,
                        origin.y - Pmax * Math.pow(t, loadExp));
        }

        ctx.lineTo(origin.x + hmax + holdLength, origin.y - Pmax);
        ctx.stroke();

        if (performance.now() - holdStartTime < holdTime * 1000) {
            requestAnimationFrame(animateIndentationCurve);
        } else {
            startUnloading();
        }
        return;
    }

    /* =============== UNLOADING =============== */
    if (animPhase === "unloading") {
        animT += 0.015;

        // loading curve
        for (let i = 0; i <= 100; i++) {
            const t = i / 100;
            ctx.lineTo(origin.x + hmax * t,
                        origin.y - Pmax * Math.pow(t, loadExp));
        }

        // hold plateau
        ctx.lineTo(origin.x + hmax + holdLength, origin.y - Pmax);

        // unloading curve
        for (let i = 0; i <= animT * 100; i++) {
            const t = i / 100;
            const h = (1 - t) * hmax + t * hf;
            const P = Pmax * Math.pow((h - hf) / (hmax - hf), unloadExp);
            ctx.lineTo(origin.x + h + holdLength, origin.y - P);
        }

        ctx.stroke();

        if (animT < 1) requestAnimationFrame(animateIndentationCurve);
    }
}

function startUnloading() {
    animPhase = "unloading";
    animT = 0;

    requestAnimationFrame(animateIndentationCurve);
}

/* ============================================================
   START GRAPH WHEN POINTER TOUCHES SAMPLE
   ============================================================ */

function startGraphEngineAtContact() {
    animPhase = "loading";
    animT = 0;
    holdLength = Math.min(holdTime * 8, gWidth * 0.2);
    requestAnimationFrame(animateIndentationCurve);
}
