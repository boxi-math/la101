// Interactive demos for LA101 Lecture 1. Every code panel is copied from notes/L01-three-pictures.md (checked by
// tools/check.py); the JS below recomputes the same numbers so the pictures can be changed.

const CODE = {
  substitute: `x, y = 1, 3
print(x + 2 * y, 3 * x - y)`,
  rowLines: `def east(x, y):
    return x + 2 * y

def north(x, y):
    return 3 * x - y

for point in [(1, 3), (7, 0)]:
    print("east line", point, east(*point))
for point in [(0, 0), (1, 3)]:
    print("north line", point, north(*point))`,
  combo: `import numpy as np

a = np.array([1, 3])
b = np.array([2, -1])
target = np.array([7, 0])

combo = 1 * a + 3 * b
print(combo.tolist(), bool(np.array_equal(combo, target)))`,
  path: `path = [np.array([0, 0])]
for move in [a, b, b, b]:
    path.append(path[-1] + move)
print([p.tolist() for p in path])`,
  other: `other = np.array([4, 5])
x_amt, y_amt = np.linalg.solve(np.column_stack([a, b]), other)
print(round(float(x_amt), 10), round(float(y_amt), 10))`,
  twoWays: `A = np.array([[1, 2],
              [3, -1]])
x_vec = np.array([1, 3])

by_rows = [int(A[i] @ x_vec) for i in range(2)]
by_columns = (x_vec[0] * A[:, 0] + x_vec[1] * A[:, 1]).tolist()
print(by_rows, by_columns, (A @ x_vec).tolist())`,
  solve: `b_vec = np.array([7, 0])
print(np.round(np.linalg.solve(A, b_vec), 10).tolist())`,
  star: `print((A * x_vec).tolist())
print((A @ x_vec).tolist())`,
  three: `A3 = np.array([[1, 1, 1],
               [2, -1, 1],
               [1, 2, -1]])
b3 = np.array([6, 3, 2])

sol3 = np.round(np.linalg.solve(A3, b3), 10)
print(sol3.tolist())
print((1 * A3[:, 0] + 2 * A3[:, 1] + 3 * A3[:, 2]).tolist())`,
  det: `print(round(float(np.linalg.det(A3)), 10))`,
  singular: `M = np.array([[1, 2],
              [3, 6]])
print((2 * M[:, 0]).tolist(), M[:, 1].tolist())
print(int(np.linalg.matrix_rank(M)))
print(bool(np.isclose(np.linalg.det(M), 0)))
try:
    np.linalg.solve(M, np.array([7, 5]))
except np.linalg.LinAlgError as error:
    print("LinAlgError:", error)`,
  many: `for x_amt, y_amt in [(7, 0), (5, 1), (1, 3), (-1, 4)]:
    print((x_amt, y_amt), (M @ np.array([x_amt, y_amt])).tolist())`,
  rankM3: `M3 = np.array([[1, 0, 1],
              [0, 1, 1],
              [2, 1, 3]])
print((M3[:, 0] + M3[:, 1]).tolist(), M3[:, 2].tolist(), int(np.linalg.matrix_rank(M3)))`,
  layer: `W = np.array([[1, 0, 2],
              [0, 1, -1]])
x_in = np.array([3, 1, 1])

y_out = W @ x_in
print(y_out.tolist())
print((3 * W[:, 0] + 1 * W[:, 1] + 1 * W[:, 2]).tolist())`,
  claimed: `claimed = np.array([2, 1, 3])
print((A3 @ claimed).tolist(), b3.tolist(), bool(np.array_equal(A3 @ claimed, b3)))`,
};

const OUT = {
  substitute: "7 0",
  rowLines: "east line (1, 3) 7\neast line (7, 0) 7\nnorth line (0, 0) 0\nnorth line (1, 3) 0",
  combo: "[7, 0] True",
  path: "[[0, 0], [1, 3], [3, 2], [5, 1], [7, 0]]",
  other: "2.0 1.0",
  twoWays: "[7, 0] [7, 0] [7, 0]",
  solve: "[1.0, 3.0]",
  star: "[[1, 6], [3, -3]]\n[7, 0]",
  three: "[1.0, 2.0, 3.0]\n[6, 3, 2]",
  det: "7.0",
  singular: "[2, 6] [2, 6]\n1\nTrue\nLinAlgError: Singular matrix",
  many: "(7, 0) [7, 21]\n(5, 1) [7, 21]\n(1, 3) [7, 21]\n(-1, 4) [7, 21]",
  rankM3: "[1, 1, 3] [1, 1, 3] 2",
  layer: "[5, 0]\n[5, 0]",
  claimed: "[6, 6, 1] [6, 3, 2] False",
};

// A code panel followed by its real output (both from the note).
const run = (name) => codeBlock(CODE[name]) + codeBlock(OUT[name], "out");

// ---------- a small SVG plane ----------

const SVGNS = "http://www.w3.org/2000/svg";
const fmt = (v) => (Math.abs(v - Math.round(v)) < 1e-9 ? String(Math.round(v)) : v.toFixed(2).replace(/0+$/, "").replace(/\.$/, ""));

// stretch > 1 widens the x unit (only for the singular demo, where north runs much further than east).
function plane(el, xr, yr, { xlabel = "x", ylabel = "y", height = 300, stretch = 1 } = {}) {
  const [x0, x1] = xr, [y0, y1] = yr;
  const u = height / (y1 - y0), ux = u * stretch, W = (x1 - x0) * ux, H = height, P = 22;
  const svg = document.createElementNS(SVGNS, "svg");
  svg.setAttribute("viewBox", `${-P} ${-P} ${W + 2 * P} ${H + 2 * P}`);
  svg.setAttribute("class", "la-plane");
  svg.style.width = "100%"; svg.style.maxWidth = `${W + 2 * P}px`;
  el.appendChild(svg);
  const X = (x) => (x - x0) * ux, Y = (y) => (y1 - y) * u;
  const add = (tag, attrs, parent = svg) => {
    const n = document.createElementNS(SVGNS, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    parent.appendChild(n);
    return n;
  };
  for (let x = Math.ceil(x0); x <= x1; x++) add("line", { x1: X(x), y1: 0, x2: X(x), y2: H, class: "grid" });
  for (let y = Math.ceil(y0); y <= y1; y++) add("line", { x1: 0, y1: Y(y), x2: W, y2: Y(y), class: "grid" });
  add("line", { x1: 0, y1: Y(0), x2: W, y2: Y(0), class: "axis" });
  add("line", { x1: X(0), y1: 0, x2: X(0), y2: H, class: "axis" });
  add("text", { x: W + 4, y: Y(0) + 4, class: "albl" }).textContent = xlabel;
  add("text", { x: X(0) + 6, y: -6, class: "albl" }).textContent = ylabel;
  for (let x = Math.ceil(x0); x <= x1; x++) if (x) add("text", { x: X(x), y: Y(0) + 14, class: "tick" }).textContent = x;
  for (let y = Math.ceil(y0); y <= y1; y++) if (y) add("text", { x: X(0) - 8, y: Y(y) + 4, class: "tick r" }).textContent = y;
  const layer = add("g", {});
  const clip = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
  return {
    clear() { layer.innerHTML = ""; },
    // The line p*x + q*y = r, clipped to the window.
    line(p, q, r, cls) {
      const pts = [];
      if (Math.abs(q) > 1e-12) for (const x of [x0, x1]) pts.push([x, (r - p * x) / q]);
      else for (const y of [y0, y1]) pts.push([r / p, y]);
      const [[ax, ay], [bx, by]] = pts;
      add("line", { x1: X(ax), y1: Y(clip(ay, y0 - 50, y1 + 50)), x2: X(bx), y2: Y(clip(by, y0 - 50, y1 + 50)), class: `ln ${cls}` }, layer);
    },
    arrow(from, to, cls, label) {
      const [fx, fy] = [X(from[0]), Y(from[1])], [tx, ty] = [X(to[0]), Y(to[1])];
      const len = Math.hypot(tx - fx, ty - fy);
      if (len < 1) return;
      const ux = (tx - fx) / len, uy = (ty - fy) / len, h = Math.min(11, len * 0.5);
      add("line", { x1: fx, y1: fy, x2: tx - ux * h * 0.8, y2: ty - uy * h * 0.8, class: `vec ${cls}` }, layer);
      add("polygon", { points: `${tx},${ty} ${tx - ux * h - uy * h * 0.45},${ty - uy * h + ux * h * 0.45} ${tx - ux * h + uy * h * 0.45},${ty - uy * h - ux * h * 0.45}`, class: `head ${cls}` }, layer);
      if (label) add("text", { x: (fx + tx) / 2 - uy * 14, y: (fy + ty) / 2 + ux * 14 + 4, class: `vlbl ${cls}` }, layer).textContent = label;
    },
    dot(p, cls, label) {
      add("circle", { cx: X(p[0]), cy: Y(p[1]), r: 4.5, class: `dot ${cls}` }, layer);
      if (label) add("text", { x: X(p[0]) + 7, y: Y(p[1]) - 7, class: `plbl ${cls}` }, layer).textContent = label;
    },
  };
}

function slider(label, min, max, step, value) {
  return `<label class="la-slider"><span>${label}</span><input type="range" min="${min}" max="${max}" step="${step}" value="${value}"><output>${value}</output></label>`;
}

function wireSliders(el, onChange) {
  const inputs = [...el.querySelectorAll(".la-slider input")];
  const read = () => inputs.map((i) => { i.nextElementSibling.textContent = fmt(+i.value); return +i.value; });
  inputs.forEach((i) => i.addEventListener("input", () => onChange(read())));
  onChange(read());
}

// ---------- Demo: the row picture ----------
// Lines x + 2y = b1 and 3x - y = b2 in the plane of answers (x, y); their crossing solves the system.

function demoRow(el, opts = {}) {
  el.innerHTML = `<div class="la-fig"></div>${opts.mini ? "" : `<div class="la-ctrl">${slider("east target b₁", -2, 10, 1, 7)}${slider("north target b₂", -3, 9, 1, 0)}</div>`}<p class="la-read"></p>`;
  const p = plane(el.querySelector(".la-fig"), [-1, 8], [-2, 5], { xlabel: "x (a-moves)", ylabel: "y (b-moves)", height: opts.mini ? 220 : 300 });
  const draw = ([b1, b2]) => {
    p.clear();
    p.line(1, 2, b1, "A"); p.line(3, -1, b2, "C");
    const x = (b1 + 2 * b2) / 7, y = (3 * b1 - b2) / 7;  // det = -7; Cramer's rule
    p.dot([x, y], "HL", `(${fmt(x)}, ${fmt(y)})`);
    el.querySelector(".la-read").innerHTML = `<span class="A">x + 2y = ${b1}</span> and <span class="C">3x − y = ${b2}</span> cross at <b>x = ${fmt(x)}, y = ${fmt(y)}</b>. Check: ${fmt(x)} + 2·${fmt(y)} = ${fmt(x + 2 * y)}, 3·${fmt(x)} − ${fmt(y)} = ${fmt(3 * x - y)}.`;
  };
  if (opts.mini) draw([7, 0]); else wireSliders(el, draw);
}

// ---------- Demo: the column picture ----------
// x copies of a = (1, 3), then y copies of b = (2, -1), tip to tail, on the robot's grid; target (7, 0).

function demoColumn(el, opts = {}) {
  const a = [1, 3], b = [2, -1], target = opts.target || [7, 0];
  el.innerHTML = `<div class="la-fig"></div>${opts.mini ? "" : `<div class="la-ctrl">${slider("x (amount of a)", -2, 4, 0.5, 0)}${slider("y (amount of b)", -2, 4, 0.5, 0)}</div>`}<p class="la-read"></p>`;
  const p = plane(el.querySelector(".la-fig"), [-2, 9], [-3, 5], { xlabel: "east", ylabel: "north", height: opts.mini ? 220 : 300 });
  const draw = ([x, y]) => {
    p.clear();
    p.dot(target, "HL", `target (${target})`);
    const mid = [x * a[0], x * a[1]], end = [mid[0] + y * b[0], mid[1] + y * b[1]];
    p.arrow([0, 0], mid, "A", "x·a");
    p.arrow(mid, end, "C", "y·b");
    const hit = Math.abs(end[0] - target[0]) < 1e-9 && Math.abs(end[1] - target[1]) < 1e-9;
    if (hit) p.arrow([0, 0], end, "HL");
    el.querySelector(".la-read").innerHTML = `${fmt(x)}·(1, 3) + ${fmt(y)}·(2, −1) = <b>(${fmt(end[0])}, ${fmt(end[1])})</b> ${hit ? "— on the target." : `— target is (${target}).`}`;
  };
  if (!opts.mini) { wireSliders(el, draw); return; }
  // Mini: play the path a, b, b, b and repeat.
  const steps = [[0, 0], [1, 0], [1, 1], [1, 2], [1, 3], [1, 3]];
  let k = 0;
  draw(steps[0]);
  setInterval(() => { k = (k + 1) % steps.length; draw(steps[k]); }, 1100);
}

// ---------- Demo: A x by rows and by columns ----------

function demoMatVec(el) {
  el.innerHTML = `<div class="la-ctrl la-grid">
      <label>A = <input class="la-in" value="1 2; 3 -1"></label>
      <label>x = <input class="la-in" value="1 3"></label>
    </div><div class="la-read la-mv"></div>`;
  const [ai, xi] = el.querySelectorAll("input");
  const draw = () => {
    const rows = ai.value.split(";").map((r) => r.trim().split(/[\s,]+/).filter(Boolean).map(Number));
    const x = xi.value.trim().split(/[\s,]+/).filter(Boolean).map(Number);
    const out = el.querySelector(".la-mv");
    const bad = rows.some((r) => r.length !== rows[0].length || r.some((v) => !Number.isFinite(v))) || x.some((v) => !Number.isFinite(v));
    if (bad) { out.innerHTML = "Type the rows of A separated by ';' and the entries by spaces."; return; }
    if (rows[0].length !== x.length) {
      out.innerHTML = `<b class="NO">Sizes do not match:</b> A has ${rows[0].length} columns but x has ${x.length} entries. numpy raises <code>ValueError</code>.`;
      return;
    }
    const byRows = rows.map((r) => r.reduce((s, v, j) => s + v * x[j], 0));
    const rowText = rows.map((r, i) => `row ${i + 1}: ${r.map((v, j) => `${fmt(v)}·${fmt(x[j])}`).join(" + ")} = <b>${fmt(byRows[i])}</b>`).join("<br>");
    const cols = x.map((_, j) => rows.map((r) => r[j]));
    const colText = cols.map((c, j) => `${fmt(x[j])}·(${c.map(fmt).join(", ")})`).join(" + ");
    out.innerHTML = `<p><b>By rows</b> (dot products)<br>${rowText}</p><p><b>By columns</b> (a combination)<br>${colText} = <b>(${byRows.map(fmt).join(", ")})</b></p>`;
  };
  [ai, xi].forEach((i) => i.addEventListener("input", draw));
  draw();
}

// ---------- Demo: a singular system ----------
// M = [[1, 2], [3, 6]]: the lines x + 2y = b1, 3x + 6y = b2 are parallel; the columns lie on one line.

function demoSingular(el) {
  el.innerHTML = `<div class="la-two"><div class="la-fig f1"></div><div class="la-fig f2"></div></div>
    <div class="la-ctrl">${slider("b₁", 0, 4, 1, 2)}${slider("b₂", 0, 12, 1, 5)}</div><p class="la-read"></p>`;
  const rp = plane(el.querySelector(".f1"), [-2, 6], [-2, 4], { xlabel: "x", ylabel: "y", height: 220 });
  const cp = plane(el.querySelector(".f2"), [-1, 5], [-1, 13], { xlabel: "east", ylabel: "north", height: 220, stretch: 2.4 });
  wireSliders(el, ([b1, b2]) => {
    rp.clear(); cp.clear();
    rp.line(1, 2, b1, "A"); rp.line(3, 6, b2, "C");
    cp.line(3, -1, 0, "DIM");
    cp.arrow([0, 0], [1, 3], "A", "a"); cp.arrow([0, 0], [2, 6], "C", "");
    const on = b2 === 3 * b1;
    cp.dot([b1, b2], on ? "HL" : "NO", `(${b1}, ${b2})`);
    el.querySelector(".la-read").innerHTML = on
      ? `<b>Infinitely many solutions.</b> 3·${b1} = ${b2}: the two equations are the same line, and the target is on the line of the columns.`
      : `<b>No solution.</b> 3·${b1} = ${3 * b1} ≠ ${b2}: the lines are parallel, and the target is off the line of the columns.`;
  });
}

// ---------- Self-check quiz (from "Check your understanding") ----------

const QUIZ = [
  { q: "In the row picture of a 2-by-2 system with one solution, what does the solution look like?",
    opts: ["The point where the two lines cross", "The longer of the two column arrows", "The slope of the steeper line"], a: 0,
    why: "Each equation is a line in the plane of answers (x, y); the solution lies on both." },
  { q: "And in the column picture?",
    opts: ["A third arrow next to the columns", "The amounts of each column whose combination is the right-hand side", "The point where the columns cross"], a: 1,
    why: "The column picture asks how much of each column reaches the target. The answer is a pair of amounts." },
  { q: "A student computes <code>A * x</code> in numpy for the robot matrix and gets a 2-by-2 array. What went wrong?",
    opts: ["Nothing: that is the product", "<code>*</code> multiplies entry by entry; the matrix–vector product is <code>A @ x</code>", "x should have been a row"], a: 1,
    why: "<code>*</code> is entry-by-entry (and stretches x across the rows). Use <code>@</code>." },
  { q: "True or false: if the two columns of a 2-by-2 matrix are parallel, the system has no solution.",
    opts: ["True", "False"], a: 1,
    why: "For most right-hand sides there is none, but a right-hand side on the line of the columns has infinitely many." },
  { q: "The columns of the matrix with rows (1, 2) and (3, −1) are…",
    opts: ["(1, 2) and (3, −1)", "(1, 3) and (2, −1)"], a: 1,
    why: "Columns are read downward. (1, 2) and (3, −1) are the rows." },
];

function demoQuiz(el, questions) {
  el.innerHTML = `<div class="quiz">` + questions.map((q, k) => `<div class="card q" data-k="${k}">
      <p><b>Q${k + 1}.</b> ${q.q}</p>
      <div class="opts">${q.opts.map((o, j) => `<button class="opt" data-j="${j}">${o}</button>`).join("")}</div>
      <div class="explain">${q.why}</div></div>`).join("") +
    `<p class="score"></p></div>`;
  let right = 0, done = 0;
  el.querySelectorAll(".q").forEach((qe) => {
    const q = questions[+qe.dataset.k];
    qe.querySelectorAll(".opt").forEach((b) => {
      b.onclick = () => {
        const j = +b.dataset.j;
        qe.querySelectorAll(".opt").forEach((x) => { x.disabled = true; });
        qe.querySelectorAll(".opt")[q.a].classList.add("right");
        if (j !== q.a) b.classList.add("wrong"); else right++;
        qe.classList.add("done");
        done++;
        el.querySelector(".score").textContent = `${right} / ${done} correct` + (done === questions.length ? (right === questions.length ? " — all right!" : " — reread the sections you missed.") : "");
      };
    });
  });
}

// Demo registry: data-demo="name" in chapters.js mounts DEMOS[name].
const DEMOS = {
  row: (el) => demoRow(el),
  rowMini: (el) => demoRow(el, { mini: true }),
  column: (el) => demoColumn(el),
  columnMini: (el) => demoColumn(el, { mini: true }),
  columnOther: (el) => demoColumn(el, { target: [4, 5] }),
  matvec: (el) => demoMatVec(el),
  singular: (el) => demoSingular(el),
  quiz: (el) => demoQuiz(el, QUIZ),
};
