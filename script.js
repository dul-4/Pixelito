const SIZE = 16;
const colors = ["#10233a", "#e63946", "#ff7a3d", "#ffc93c", "#3a9d5d", "#3b82f6"];

const canvas = document.getElementById("canvas");
const palette = document.getElementById("palette");
const pencil = document.getElementById("pencil");
const eraser = document.getElementById("eraser");

let color = colors[0];
let erasing = false;
let drawing = false;
const cells = [];

for (let i = 0; i < SIZE * SIZE; i++) {
    const cell = document.createElement("div");
    canvas.appendChild(cell);
    cells.push(cell);
}

colors.forEach((c, i) => {
    const b = document.createElement("button");
    b.style.background = c;
    if (i === 0) b.className = "on";
    b.onclick = () => {
        color = c;
        setErasing(false);
        palette.querySelectorAll("button").forEach(x => (x.className = ""));
        b.className = "on";
    };
    palette.appendChild(b);
});

function setErasing(value) {
    erasing = value;
    eraser.className = value ? "on" : "";
    pencil.className = value ? "" : "on";
}

function paint(el) {
    if (el && el.parentElement === canvas) {
        el.style.background = erasing ? "white" : color;
    }
}

canvas.onpointerdown = e => {
    drawing = true;
    paint(e.target);
};

canvas.onpointermove = e => {
    if (drawing) paint(document.elementFromPoint(e.clientX, e.clientY));
};

window.onpointerup = () => (drawing = false);

pencil.onclick = () => setErasing(false);
eraser.onclick = () => setErasing(true);

document.getElementById("clear").onclick = () => {
    cells.forEach(c => (c.style.background = "white"));
};

document.getElementById("download").onclick = () => {
    const scale = 20;
    const cv = document.createElement("canvas");
    cv.width = cv.height = SIZE * scale;
    const ctx = cv.getContext("2d");

    cells.forEach((c, i) => {
        ctx.fillStyle = c.style.background || "white";
        ctx.fillReact((1 % SIZE) * scale, Math.floor(i / SIZE) * scale, scale, scale);
    });

    cv.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "pixelito.png";
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    });
};