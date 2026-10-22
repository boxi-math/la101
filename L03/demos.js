// Interactive demos for LA101 Lecture 3. Four ways to multiply, the inverse, Gauss–Jordan.
// Every code panel is copied from notes/L03-multiply-invert.md (checked by tools/check.py); the JS recomputes the same
// numbers so the examples can be changed.

const CODE = {
  shapes: "import numpy as np\n\nA = np.array([[1, 2, 0],\n              [3, -1, 2]])\nB = np.array([[2, 1],\n              [0, 3],\n              [1, -1]])\nprint(A.shape, B.shape, (A @ B).shape, (B @ A).shape)",
  entries: "AB = A @ B\nprint(AB.tolist())\nprint(int(A[1] @ B[:, 0]), [[int(A[i] @ B[:, j]) for j in range(2)] for i in range(2)])",
  columns: "print([(A @ B[:, j]).tolist() for j in range(2)])",
  rows: "print([(A[i] @ B).tolist() for i in range(2)])\nprint((1 * B[0] + 2 * B[1] + 0 * B[2]).tolist())",
  pieces: "pieces = [np.outer(A[:, k], B[k]) for k in range(3)]\nfor P in pieces:\n    print(P.tolist())\nprint(sum(pieces).tolist())",
  colrow: "col, row = np.array([[1], [3]]), np.array([[2, 1]])\nprint((col @ row).tolist(), (row @ col).tolist())",
  order: "F = np.array([[1, 1], [0, 1]])\nG = np.array([[1, 0], [2, 1]])\nH = np.array([[0, 1], [1, 3]])\nprint((F @ G).tolist(), (G @ F).tolist())\nprint(((F @ G) @ H).tolist(), (F @ (G @ H)).tolist())",
  layers: "W1 = A\nW2 = np.array([[1, 1],\n               [2, -1]])\nx = np.array([1, 1, 1])\nhidden = W1 @ x\nprint(hidden.tolist(), (W2 @ hidden).tolist())\nW21 = W2 @ W1\nprint(W21.tolist(), (W21 @ x).tolist())",
  filter: "Fm = np.array([[3, 1],\n               [2, 1]])\nFinv = np.array([[1, -1],\n                 [-2, 3]])\npixel = np.array([5, 2])\nfiltered = Fm @ pixel\nprint(filtered.tolist(), (Finv @ filtered).tolist())\nprint((Finv @ Fm).tolist(), (Fm @ Finv).tolist())",
  gj: "from fractions import Fraction\n\n\ndef gauss_jordan(M):\n    \"\"\"Reduce [M | I] to [I | M^-1] without row exchanges; print each step.\"\"\"\n    n = len(M)\n    R = [[Fraction(v) for v in row] + [Fraction(int(i == j)) for j in range(n)] for i, row in enumerate(M)]\n    for j in range(n):\n        for i in range(n):\n            if i != j and R[i][j] != 0:\n                mult = R[i][j] / R[j][j]\n                R[i] = [a - mult * p for a, p in zip(R[i], R[j])]\n                print(f\"row {i + 1} -= {mult} * row {j + 1}\")\n    for i in range(n):\n        R[i] = [v / R[i][i] for v in R[i]]\n    return [[str(v) for v in row[n:]] for row in R]\n\n\nK = [[1, 2, 0], [0, 1, 1], [1, 2, 1]]\nKinv = gauss_jordan(K)\nprint(Kinv)",
  gjcheck: "Kn = np.array(K)\nKinv_n = np.array([[int(v) for v in row] for row in Kinv])\nprint((Kn @ Kinv_n).tolist(), (Kinv_n @ Kn).tolist())",
  reverse: "Bm = np.array([[1, 0], [2, 1]])\nBinv = np.array([[1, 0], [-2, 1]])\nFB = Fm @ Bm\nprint((Binv @ Finv @ FB).tolist(), (Finv @ Binv @ FB).tolist())",
  sumfilter: "S = np.array([[1, 1], [1, 1]])\nprint((S @ np.array([3, 1])).tolist(), (S @ np.array([2, 2])).tolist(), (S @ np.array([1, -1])).tolist())\nprint(1 * 1 - 1 * 1, int(np.linalg.matrix_rank(S)))\ntry:\n    np.linalg.inv(S)\nexcept np.linalg.LinAlgError as error:\n    print(\"LinAlgError:\", error)",
  tnull: "T = np.array([[2, 6], [1, 3]])\nprint((T @ np.array([3, -1])).tolist(), 2 * 3 - 6 * 1)",
  claim: "claim = np.array([[1, 2, 3], [0, 1, 4], [1, 3, 7]])\nprint((claim[0] + claim[1]).tolist(), claim[2].tolist(), int(np.linalg.matrix_rank(claim)))\nprint((claim @ np.array([5, -4, 1])).tolist())",
};

const OUT = {
  shapes: "(2, 3) (3, 2) (2, 2) (3, 3)",
  entries: "[[2, 7], [8, -2]]\n8 [[2, 7], [8, -2]]",
  columns: "[[2, 8], [7, -2]]",
  rows: "[[2, 7], [8, -2]]\n[2, 7]",
  pieces: "[[2, 1], [6, 3]]\n[[0, 6], [0, -3]]\n[[0, 0], [2, -2]]\n[[2, 7], [8, -2]]",
  colrow: "[[2, 1], [6, 3]] [[5]]",
  order: "[[3, 1], [2, 1]] [[1, 1], [2, 3]]\n[[1, 6], [1, 5]] [[1, 6], [1, 5]]",
  layers: "[3, 4] [7, 2]\n[[4, 1, 2], [-1, 5, -2]] [7, 2]",
  filter: "[17, 12] [5, 2]\n[[1, 0], [0, 1]] [[1, 0], [0, 1]]",
  gj: "row 3 -= 1 * row 1\nrow 1 -= 2 * row 2\nrow 1 -= -2 * row 3\nrow 2 -= 1 * row 3\n[['-1', '-2', '2'], ['1', '1', '-1'], ['-1', '0', '1']]",
  gjcheck: "[[1, 0, 0], [0, 1, 0], [0, 0, 1]] [[1, 0, 0], [0, 1, 0], [0, 0, 1]]",
  reverse: "[[1, 0], [0, 1]] [[11, 2], [-28, -5]]",
  sumfilter: "[4, 4] [4, 4] [0, 0]\n0 1\nLinAlgError: Singular matrix",
  tnull: "[0, 0] 0",
  claim: "[1, 3, 7] [1, 3, 7] 2\n[0, 0, 0]",
};

// A code panel followed by its real output (both from the note).
const run = (name) => codeBlock(CODE[name]) + codeBlock(OUT[name], "out");

const fmt = (v) => (Math.abs(v - Math.round(v)) < 1e-9 ? String(Math.round(v)) : v.toFixed(2).replace(/0+$/, "").replace(/\.$/, ""));

function slider(label, min, max, step, value) {
  return `<label class="la-slider"><span>${label}</span><input type="range" min="${min}" max="${max}" step="${step}" value="${value}"><output>${value}</output></label>`;
}

function wireSliders(el, onChange) {
  const inputs = [...el.querySelectorAll(".la-slider input")];
  const read = () => inputs.map((i) => { i.nextElementSibling.textContent = fmt(+i.value); return +i.value; });
  inputs.forEach((i) => i.addEventListener("input", () => onChange(read())));
  onChange(read());
}

// ---------- exact fractions and matrix display (shared by the matrix demos of this lecture) ----------

const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
class Q {
  constructor(n, d = 1) {
    if (d < 0) { n = -n; d = -d; }
    const g = gcd(n, d) || 1;
    this.n = n / g; this.d = d / g;
  }
  add(o) { return new Q(this.n * o.d + o.n * this.d, this.d * o.d); }
  sub(o) { return new Q(this.n * o.d - o.n * this.d, this.d * o.d); }
  mul(o) { return new Q(this.n * o.n, this.d * o.d); }
  div(o) { return new Q(this.n * o.d, this.d * o.n); }
  get zero() { return this.n === 0; }
  toString() { return this.d === 1 ? String(this.n) : `${this.n}/${this.d}`; }
}
const q = (v) => (v instanceof Q ? v : new Q(v));
const toQ = (M) => M.map((r) => r.map(q));
const sgn = (v) => String(v).replace("-", "−");
// "− ℓ" for a step row − ℓ × row; a negative ℓ reads "+ |ℓ|".
const minusTimes = (l) => (l.n < 0 ? `+ ${new Q(-l.n, l.d)}` : `− ${l}`);
const parseMat = (s) => s.split(";").map((r) => r.trim().split(/[\s,]+/).filter(Boolean).map(Number));
const okMat = (M) => M.length > 0 && M[0].length > 0 && M.every((r) => r.length === M[0].length && r.every(Number.isInteger));
const mmul = (A, B) => A.map((r) => B[0].map((_, j) => r.reduce((s, v, k) => s.add(q(v).mul(q(B[k][j]))), q(0))));
const eye = (n) => Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => q(i === j ? 1 : 0)));
const same = (A, B) => A.length === B.length && A.every((r, i) => r.every((v, j) => q(v).sub(q(B[i][j])).zero));

// A matrix as a small bracketed table. hlRows: rows tinted; hlCells: [[i, j]] in bold; zCells: cells in red; aug: a
// dashed bar before the last column.
function matHTML(M, { hlRows = [], hlCells = [], zCells = [], aug = false } = {}) {
  const has = (list, i, j) => list.some(([a, b]) => a === i && b === j);
  return `<table class="la-mat">${M.map((r, i) => `<tr class="${hlRows.includes(i) ? "hl" : ""}">${r.map((v, j) => {
    const cls = [has(hlCells, i, j) ? "pv" : "", has(zCells, i, j) ? "z" : "", aug && j === r.length - 1 ? "bar" : ""].join(" ");
    return `<td class="${cls}">${String(v).replace("-", "−")}</td>`;
  }).join("")}</tr>`).join("")}</table>`;
}

(function matStyle() {
  if (document.getElementById("la-mat-style")) return;
  const s = document.createElement("style");
  s.id = "la-mat-style";
  s.textContent = `.la-mat{display:inline-table;border-collapse:separate;border-spacing:10px 3px;border-left:2px solid var(--ink-2);
border-right:2px solid var(--ink-2);border-radius:5px;margin:4px 6px;font:14px var(--mono);vertical-align:middle}
article table.la-mat,table.la-mat{width:auto;font-size:14px}.la-mat td,.la-mat th{text-align:right;min-width:1.7em;border:none;padding:0 2px;background:none}.la-mat td.pv{color:var(--teal);font-weight:700}
.la-mat td.z{color:var(--red);font-weight:700}.la-mat td.bar{border-left:1px dashed var(--stone);padding-left:8px}
.la-mat tr.hl td{background:var(--teal-soft)}.la-eq{display:flex;flex-wrap:wrap;align-items:center;gap:4px;margin:8px 0;
font:15px var(--mono)}.la-btns{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}.la-log{font-size:14px;margin:8px 0 0;min-height:2.6em}`;
  document.head.appendChild(s);
})();

// ---------- Demo: four ways to multiply ----------

const MODES = ["entries", "columns", "rows", "pieces"];

function demoFourWays(el, opts = {}) {
  el.innerHTML = (opts.mini ? "" : `<div class="la-ctrl la-grid"><label>A = <input class="la-in" value="1 2 0; 3 -1 2"></label>
    <label>B = <input class="la-in" value="2 1; 0 3; 1 -1"></label></div>
    <div class="la-btns">${MODES.map((m, k) => `<button class="cbtn mode" data-k="${k}">${k + 1}. ${m}</button>`).join("")}</div>`) +
    `<div class="la-eq la-show"></div><p class="la-log"></p>`;
  let mode = 0;
  const ins = [...el.querySelectorAll("input")];
  const draw = () => {
    const A = opts.mini ? [[1, 2, 0], [3, -1, 2]] : parseMat(ins[0].value);
    const B = opts.mini ? [[2, 1], [0, 3], [1, -1]] : parseMat(ins[1].value);
    const show = el.querySelector(".la-show"), log = el.querySelector(".la-log");
    if (!okMat(A) || !okMat(B)) { show.innerHTML = ""; log.innerHTML = "Type whole numbers, rows separated by ';'."; return; }
    const m = A.length, n = A[0].length, p = B[0].length;
    if (B.length !== n) {
      show.innerHTML = "";
      log.innerHTML = `<b class="NO">Shapes do not fit:</b> A is ${m}×${n} and B is ${B.length}×${p}. AB needs as many columns of A as rows of B; numpy raises <code>ValueError</code>.`;
      return;
    }
    const AB = mmul(A, B);
    const col = (M, j) => M.map((r) => [r[j]]);
    if (mode === 0) {
      show.innerHTML = `A = ${matHTML(A, { hlRows: [m - 1] })} B = ${matHTML(B)} AB = ${matHTML(AB, { hlCells: [[m - 1, 0]] })}`;
      log.innerHTML = `<b>Entries.</b> Row ${m} of A · column 1 of B = ${A[m - 1].map((v, k) => `${v}·${B[k][0]}`).join(" + ")} = <b>${AB[m - 1][0]}</b>. Every entry is a row times a column.`;
    } else if (mode === 1) {
      show.innerHTML = B[0].map((_, j) => `A·${matHTML(col(B, j))} = ${matHTML(col(AB, j))}`).join(" ");
      log.innerHTML = `<b>Columns.</b> Column j of AB is A times column j of B, a combination of the columns of A: column 1 = ${B.map((r, k) => `${r[0]}·col${k + 1}`).join(" + ")}.`;
    } else if (mode === 2) {
      show.innerHTML = A.map((r, i) => `${matHTML([r])}·B = ${matHTML([AB[i]])}`).join(" ");
      log.innerHTML = `<b>Rows.</b> Row i of AB is row i of A times B, a combination of the rows of B: row 1 = ${A[0].map((v, k) => `${v}·row${k + 1}`).join(" + ")}.`;
    } else {
      const pieces = A[0].map((_, k) => mmul(col(A, k), [B[k]]));
      show.innerHTML = pieces.map((P) => matHTML(P)).join(" + ") + ` = ${matHTML(AB)}`;
      log.innerHTML = `<b>Column × row.</b> ${n} pieces, column k of A times row k of B, each ${m}×${p} and of rank one (or zero). Their sum is AB.`;
    }
    el.querySelectorAll(".mode").forEach((b, k) => b.classList.toggle("on", k === mode));
  };
  if (opts.mini) { draw(); setInterval(() => { mode = (mode + 1) % 4; draw(); }, 2400); return; }
  el.querySelectorAll(".mode").forEach((b) => { b.onclick = () => { mode = +b.dataset.k; draw(); }; });
  ins.forEach((i) => i.addEventListener("input", draw));
  draw();
}

// ---------- Demo: the 2-by-2 inverse ----------

function demoInverse2(el) {
  el.innerHTML = `<div class="la-ctrl">${slider("a", -4, 4, 1, 3)}${slider("b", -4, 4, 1, 1)}${slider("c", -4, 4, 1, 2)}${slider("d", -4, 4, 1, 1)}</div>
    <div class="la-eq la-show"></div><p class="la-read"></p>`;
  wireSliders(el, ([a, b, c, d]) => {
    const det = a * d - b * c, M = [[a, b], [c, d]];
    const show = el.querySelector(".la-show"), read = el.querySelector(".la-read");
    if (det === 0) {
      const x = b !== 0 || d !== 0 ? [b !== 0 ? b : d, b !== 0 ? -a : -c] : [1, 0];
      show.innerHTML = `M = ${matHTML(M)} M·${matHTML([[x[0]], [x[1]]])} = ${matHTML(mmul(M, [[x[0]], [x[1]]]))}`;
      read.innerHTML = `<b class="NO">ad − bc = ${a}·${d} − ${b}·${c} = 0: no inverse.</b> M sends the nonzero vector (${x.join(", ")}) to zero.`;
      return;
    }
    const inv = [[q(d).div(q(det)), q(-b).div(q(det))], [q(-c).div(q(det)), q(a).div(q(det))]];
    show.innerHTML = `M = ${matHTML(M)} M⁻¹ = ${matHTML(inv)} M⁻¹M = ${matHTML(mmul(inv, M))}`;
    read.innerHTML = `ad − bc = ${a}·${d} − ${b}·${c} = <b>${det}</b>. Swap a and d, negate b and c, divide by ${det}. The check gives I.`;
  });
}

// ---------- Demo: Gauss–Jordan on [A | I] ----------

function gjSteps(M0) {
  const n = M0.length;
  const R = M0.map((r, i) => [...r.map(q), ...Array.from({ length: n }, (_, j) => q(i === j ? 1 : 0))]);
  const steps = [];
  const snap = (msg, o = {}) => steps.push({ M: R.map((r) => r.slice()), msg, ...o });
  snap(`Start: [A | I].`);
  for (let j = 0; j < n; j++) {
    if (R[j][j].zero) {
      const k = R.findIndex((row, i) => i > j && !row[j].zero);
      if (k < 0) { snap(`<b class="NO">Column ${j + 1} has no pivot: A has no inverse.</b>`, { zCells: [[j, j]] }); return steps; }
      [R[j], R[k]] = [R[k], R[j]];
      snap(`Zero pivot: exchange rows ${j + 1} and ${k + 1}.`, { hlRows: [j, k] });
    }
    for (let i = 0; i < n; i++) {
      if (i === j || R[i][j].zero) continue;
      const l = R[i][j].div(R[j][j]);
      R[i] = R[i].map((v, c) => v.sub(l.mul(R[j][c])));
      snap(`Row ${i + 1} ${minusTimes(l)} × row ${j + 1} (clear ${i < j ? "above" : "below"} pivot ${j + 1}).`, { hlRows: [i], zCells: [[i, j]] });
    }
  }
  if (R.some((r, i) => !(r[i].n === 1 && r[i].d === 1))) {
    R.forEach((r, i) => { const p = r[i]; R[i] = r.map((v) => v.div(p)); });
    snap("Divide each row by its pivot.");
  }
  snap(`<b>Left half is I: the right half is A⁻¹.</b>`, { hlCells: R.map((_, i) => [i, n + i]) });
  return steps;
}

function demoGaussJordan(el) {
  el.innerHTML = `<div class="la-ctrl la-grid"><label>A = <input class="la-in" style="width:15em" value="1 2 0; 0 1 1; 1 2 1"></label></div>
    <div class="la-btns"><button class="cbtn next">Next step</button><button class="cbtn reset">Start again</button></div>
    <div class="la-eq la-show"></div><p class="la-log"></p>`;
  const inp = el.querySelector("input");
  let steps = [], k = 0;
  const show = () => {
    const s = steps[k], n = s.M.length;
    el.querySelector(".la-show").innerHTML = matHTML(s.M.map((r) => r.slice(0, n)), s) + matHTML(s.M.map((r) => r.slice(n)), { hlCells: (s.hlCells || []).map(([i, j]) => [i, j - n]), hlRows: s.hlRows || [] });
    el.querySelector(".la-log").innerHTML = `<b>Step ${k} of ${steps.length - 1}.</b> ${s.msg}`;
  };
  const load = () => {
    const M = parseMat(inp.value);
    if (!okMat(M) || M.length !== M[0].length) { el.querySelector(".la-show").innerHTML = ""; el.querySelector(".la-log").innerHTML = "Type a square matrix of whole numbers, rows separated by ';'."; steps = []; return; }
    steps = gjSteps(M); k = 0; show();
  };
  el.querySelector(".next").onclick = () => { if (steps.length && k < steps.length - 1) { k++; show(); } };
  el.querySelector(".reset").onclick = load;
  inp.addEventListener("input", load);
  load();
}

// ---------- Self-check quiz (from "Check your understanding") ----------

const QUIZ = [
  { q: "A is 4-by-2 and B is 2-by-5. Which products exist?", opts: ["Only AB, which is 4-by-5", "Only BA", "Both", "Neither"], a: 0,
    why: "AB: 2 columns of A, 2 rows of B, result 4×5. BA needs 5 = 4, so it does not exist." },
  { q: "Which view shows at once that every column of AB is a combination of the columns of A?", opts: ["Entries", "Columns: A times each column of B", "Column × row pieces"], a: 1,
    why: "Column j of AB is A times column j of B, which is a combination of the columns of A." },
  { q: "For square matrices, AB = I implies BA = I.", opts: ["True", "False"], a: 0, why: "A one-sided inverse of a square matrix is two-sided." },
  { q: "(AB)⁻¹ equals…", opts: ["A⁻¹B⁻¹", "B⁻¹A⁻¹", "AB itself"], a: 1, why: "Undo the last step first: (B⁻¹A⁻¹)(AB) = B⁻¹(A⁻¹A)B = I." },
  { q: "A square matrix sends (1, 2, −1) to (0, 0, 0). Is it invertible?", opts: ["Yes", "No"], a: 1, why: "An inverse would send 0 back to (1, 2, −1), but A⁻¹·0 = 0." },
];

function demoQuiz(el, questions) {
  el.innerHTML = `<div class="quiz">` + questions.map((qq, k) => `<div class="card q" data-k="${k}">
      <p><b>Q${k + 1}.</b> ${qq.q}</p>
      <div class="opts">${qq.opts.map((o, j) => `<button class="opt" data-j="${j}">${o}</button>`).join("")}</div>
      <div class="explain">${qq.why}</div></div>`).join("") +
    `<p class="score"></p></div>`;
  let right = 0, done = 0;
  el.querySelectorAll(".q").forEach((qe) => {
    const qq = questions[+qe.dataset.k];
    qe.querySelectorAll(".opt").forEach((b) => {
      b.onclick = () => {
        const j = +b.dataset.j;
        qe.querySelectorAll(".opt").forEach((x) => { x.disabled = true; });
        qe.querySelectorAll(".opt")[qq.a].classList.add("right");
        if (j !== qq.a) b.classList.add("wrong"); else right++;
        qe.classList.add("done");
        done++;
        el.querySelector(".score").textContent = `${right} / ${done} correct` + (done === questions.length ? (right === questions.length ? " — all right!" : " — reread the sections you missed.") : "");
      };
    });
  });
}

// Demo registry: data-demo="name" in chapters.js mounts DEMOS[name].
const DEMOS = {
  fourWays: (el) => demoFourWays(el),
  fourWaysMini: (el) => demoFourWays(el, { mini: true }),
  inverse2: (el) => demoInverse2(el),
  gaussJordan: (el) => demoGaussJordan(el),
  quiz: (el) => demoQuiz(el, QUIZ),
};
