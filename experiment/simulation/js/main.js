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
