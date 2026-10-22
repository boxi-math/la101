// Interactive demos for LA101 Lecture 17: determinant formulas, areas, densities.
// Every code panel is copied from notes/L17-determinant-formulas-uses.md (checked by tools/check.py; generated, not retyped); the JS
// recomputes the same numbers so the examples can be changed.

const CODE = {
  big: "import itertools\nimport math\nimport numpy as np\nfrom fractions import Fraction\n\n\ndef sign(perm):\n    \"\"\"+1 or -1: the determinant of the permutation matrix (parity of the number of inversions).\"\"\"\n    inv = sum(1 for i in range(len(perm)) for j in range(i + 1, len(perm)) if perm[i] > perm[j])\n    return -1 if inv % 2 else 1\n\n\ndef big_formula(M):\n    n = len(M)\n    return sum(sign(p) * math.prod(M[i][p[i]] for i in range(n)) for p in itertools.permutations(range(n)))\n\n\nA = [[2, 1, 1], [4, 3, 4], [2, 4, 8]]\nterms = [(sign(p), math.prod(A[i][p[i]] for i in range(3))) for p in itertools.permutations(range(3))]\nprint(terms, big_formula(A))\nprint([math.factorial(n) for n in (3, 5, 10, 20)])",
  cof: "def minor(M, i, j):\n    return [row[:j] + row[j + 1:] for k, row in enumerate(M) if k != i]\n\n\ndef cofactor_det(M, i=0):\n    if len(M) == 1:\n        return M[0][0]\n    return sum((-1) ** (i + j) * M[i][j] * cofactor_det(minor(M, i, j)) for j in range(len(M)) if M[i][j] != 0)\n\n\nG = [[2, 0, 1, 0], [1, 3, 0, 2], [0, 0, 4, 0], [5, 1, 0, 1]]\nprint([(-1) ** j * A[0][j] * big_formula(minor(A, 0, j)) for j in range(3)], cofactor_det(A))\nprint(cofactor_det(G, 2), cofactor_det(G, 0), big_formula(G), round(float(np.linalg.det(np.array(G))), 10))",
  inverse: "def cofactor_matrix(M):\n    n = len(M)\n    return [[(-1) ** (i + j) * big_formula(minor(M, i, j)) for j in range(n)] for i in range(n)]\n\n\ndef inverse_by_cofactors(M):\n    d = big_formula(M)\n    C = cofactor_matrix(M)\n    return [[Fraction(C[j][i], d) for j in range(len(M))] for i in range(len(M))]\n\n\nF = [[3, 1], [2, 1]]\nK = [[1, 2, 0], [0, 1, 1], [1, 2, 1]]\nshow = lambda M: [[str(x) for x in row] for row in M]\nprint(show(inverse_by_cofactors(F)), big_formula(K), show(inverse_by_cofactors(K)))\nprint(show(inverse_by_cofactors(A)))",
  cramer: "def cramer(M, b):\n    d = big_formula(M)\n    out = []\n    for j in range(len(M)):\n        Bj = [row[:j] + [bi] + row[j + 1:] for row, bi in zip(M, b)]\n        out.append(Fraction(big_formula(Bj), d))\n    return out\n\n\nprint([str(x) for x in cramer(F, [17, 12])], [str(x) for x in cramer(A, [5, 15, 22])])",
  area: "M1 = np.array([[1.0, 2.0], [3.0, -1.0]])\nprint(round(float(np.linalg.det(M1)), 10), round(float(np.linalg.det(M1[:, ::-1])), 10))\n\n\ndef shoelace(pts):\n    \"\"\"Signed area of a polygon with vertices in order (the 2 x 2 determinants of consecutive vertices, halved).\"\"\"\n    return sum(x1 * y2 - x2 * y1 for (x1, y1), (x2, y2) in zip(pts, pts[1:] + pts[:1])) / 2\n\n\nprint(shoelace([(0, 0), (1, 3), (3, 2), (2, -1)]), shoelace([(0, 0), (1, 3), (2, -1)]))",
  volume: "u, v = np.array([1, 2, 1]), np.array([1, 3, 2])\nprint(round(float(np.linalg.det(np.column_stack([u, v, 2 * u + v]))), 10) + 0.0,\n      round(float(np.linalg.det(np.column_stack([u, v, [1, 1, 1]]))), 10))",
  scale: "tri = [(0, 0), (1, 0), (0, 1)]\nimage = [tuple((M1 @ np.array(pt)).tolist()) for pt in tri]\nprint(shoelace(tri), image, shoelace(image), shoelace(image) / shoelace(tri))",
  polar: "def polar(r, th):\n    return np.array([r * np.cos(th), r * np.sin(th)])\n\n\nr0, th0, h = 1.5, 0.7, 1e-6\nJ = np.column_stack([(polar(r0 + h, th0) - polar(r0 - h, th0)) / (2 * h),\n                     (polar(r0, th0 + h) - polar(r0, th0 - h)) / (2 * h)])\nprint(round(float(np.linalg.det(J)), 6))\nnr, nth = 400, 400\ndr, dth = 2 / nr, 2 * np.pi / nth\nrs = (np.arange(nr) + 0.5) * dr\nprint(round(float(np.sum(rs * dr * dth) * nth), 6), round(4 * np.pi, 6))",
  density: "rng = np.random.default_rng(17)\nz = rng.standard_normal((200_000, 2))\nx = z @ M1.T\ncentre, half = np.array([1.0, 1.0]), 0.25\ninside = np.all(np.abs(x - centre) < half, axis=1).mean()\npz = lambda zz: np.exp(-0.5 * float(zz @ zz)) / (2 * np.pi)\npredicted = pz(np.linalg.solve(M1, centre)) / abs(np.linalg.det(M1)) * (2 * half) ** 2\nprint(round(float(inside), 4), round(float(predicted), 4))",
  slogdet: "D = np.diag(np.full(1200, 0.5))\nsgn, logdet = np.linalg.slogdet(D)\nprint(float(np.linalg.det(D)), float(sgn), round(float(logdet), 4), round(1200 * math.log(0.5), 4))",
  claim: "Cm = np.array(cofactor_matrix(A), dtype=float)\ndetA = big_formula(A)\nprint((np.array(A) @ (Cm / detA)).round(4).tolist())\nprint((np.array(A) @ (Cm.T / detA)).round(4).tolist())",
};

const OUT = {
  big: "[(1, 48), (-1, 32), (-1, 32), (1, 8), (1, 16), (-1, 6)] 2\n[6, 120, 3628800, 2432902008176640000]",
  cof: "[16, -24, 10] 2\n8 8 8 8.0",
  inverse: "[['1', '-1'], ['-2', '3']] 1 [['-1', '-2', '2'], ['1', '1', '-1'], ['-1', '0', '1']]\n[['4', '-2', '1/2'], ['-12', '7', '-2'], ['5', '-3', '1']]",
  cramer: "['5', '2'] ['1', '1', '2']",
  area: "-7.0 7.0\n-7.0 -3.5",
  volume: "0.0 1.0",
  scale: "0.5 [(0.0, 0.0), (1.0, 3.0), (2.0, -1.0)] -3.5 -7.0",
  polar: "1.5\n12.566371 12.566371",
  density: "0.0051 0.005",
  slogdet: "0.0 1.0 -831.7766 -831.7766",
  claim: "[[6.5, -19.0, 8.0], [12.0, -35.0, 15.0], [4.0, -12.0, 6.0]]\n[[1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 1.0]]",
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

// ---------- exact fractions, matrices and row reduction (shared by the demos of this lecture) ----------

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
  neg() { return new Q(-this.n, this.d); }
  get zero() { return this.n === 0; }
  toString() { return this.d === 1 ? String(this.n) : `${this.n}/${this.d}`; }
}
const q = (v) => (v instanceof Q ? v : new Q(v));
const minusTimes = (l) => (l.n < 0 ? `+ ${l.neg()}` : `− ${l}`);
const parseMat = (s) => s.split(";").map((r) => r.trim().split(/[\s,]+/).filter(Boolean).map(Number));
const parseVec = (s) => s.trim().split(/[\s,]+/).filter(Boolean).map(Number);
const okMat = (M) => M.length > 0 && M[0].length > 0 && M.every((r) => r.length === M[0].length && r.every(Number.isInteger));
const mulVec = (A, x) => A.map((r) => r.reduce((s, v, k) => s.add(q(v).mul(q(x[k]))), q(0)));
const vecStr = (v) => `(${v.map((x) => String(x).replace("-", "−")).join(", ")})`;

// Row-reduce with exact fractions. reduced: also clear above each pivot and divide by it. Records every step.
function rref(M0, reduced = true) {
  const R = M0.map((r) => r.map(q));
  const m = R.length, n = R[0].length, piv = [], steps = [];
  const snap = (msg, o = {}) => steps.push({ M: R.map((r) => r.slice()), msg, ...o });
  snap("Start.");
  let r = 0;
  for (let j = 0; j < n && r < m; j++) {
    const k = R.findIndex((row, i) => i >= r && !row[j].zero);
    if (k < 0) { snap(`Column ${j + 1} has no pivot: <b>free column</b>.`, { zCols: [j] }); continue; }
    if (k !== r) { [R[r], R[k]] = [R[k], R[r]]; snap(`Exchange rows ${r + 1} and ${k + 1}.`, { hlRows: [r, k] }); }
    for (let i = 0; i < m; i++) {
      if (i === r || R[i][j].zero || (i < r && !reduced)) continue;
      const l = R[i][j].div(R[r][j]);
      R[i] = R[i].map((v, c) => v.sub(l.mul(R[r][c])));
      snap(`Row ${i + 1} ${minusTimes(l)} × row ${r + 1}.`, { hlRows: [i], hlCells: [[r, j]] });
    }
    if (reduced && !(R[r][j].n === 1 && R[r][j].d === 1)) {
      const p = R[r][j];
      R[r] = R[r].map((v) => v.div(p));
      snap(`Divide row ${r + 1} by ${p}.`, { hlRows: [r], hlCells: [[r, j]] });
    }
    piv.push(j);
    r++;
  }
  return { R, piv, steps };
}

// Special solutions from a reduced R: one per free column, that free variable 1, the other free ones 0.
function specials(R, piv) {
  const n = R[0].length, free = [...Array(n).keys()].filter((j) => !piv.includes(j));
  return free.map((f) => {
    const x = Array.from({ length: n }, () => q(0));
    x[f] = q(1);
    piv.forEach((p, i) => { x[p] = R[i][f].neg(); });
    return x;
  });
}

// A matrix as a small bracketed table. hlRows: rows tinted; hlCells: [[i, j]] in bold; zCols: columns in red; aug: a
// dashed bar before the last column; pivCols: columns in bold teal.
function matHTML(M, { hlRows = [], hlCells = [], zCols = [], pivCols = [], aug = false } = {}) {
  const has = (list, i, j) => list.some(([a, b]) => a === i && b === j);
  return `<table class="la-mat">${M.map((r, i) => `<tr class="${hlRows.includes(i) ? "hl" : ""}">${r.map((v, j) => {
    const cls = [has(hlCells, i, j) || pivCols.includes(j) ? "pv" : "", zCols.includes(j) ? "z" : "", aug && j === r.length - 1 ? "bar" : ""].join(" ");
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
font:15px var(--mono)}.la-btns{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}.la-log{font-size:14px;margin:8px 0 0;min-height:2.6em}
.la-svgrow{display:flex;flex-wrap:wrap;gap:12px;justify-content:center}.la-svgrow figure{margin:0;text-align:center;font-size:13px}`;
  document.head.appendChild(s);
})();

// ---------- Self-check quiz (from "Check your understanding") ----------

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

// ---------- Demo: the parallelogram of two columns, its signed area and orientation ----------

function areaSVG(a, b) {
  const W = 240, R = 6, s = W / (2 * R), X = (x) => W / 2 + x * s, Y = (y) => W / 2 - y * s;
  let g = `<svg class="la-plane" viewBox="0 0 ${W} ${W}" width="${W}" height="${W}" role="img" aria-label="parallelogram">`;
  for (let k = -R; k <= R; k++) g += `<line class="grid" x1="${X(k)}" y1="0" x2="${X(k)}" y2="${W}"/><line class="grid" x1="0" y1="${Y(k)}" x2="${W}" y2="${Y(k)}"/>`;
  g += `<line class="axis" x1="0" y1="${Y(0)}" x2="${W}" y2="${Y(0)}"/><line class="axis" x1="${X(0)}" y1="0" x2="${X(0)}" y2="${W}"/>`;
  const det = a[0] * b[1] - a[1] * b[0], cls = det > 0 ? "A" : det < 0 ? "C" : "NO";
  const pts = [[0, 0], a, [a[0] + b[0], a[1] + b[1]], b].map(([x, y]) => `${X(x)},${Y(y)}`).join(" ");
  g += `<polygon points="${pts}" class="${cls}" fill-opacity="0.18" stroke-width="1.5"/>`;
  g += `<line class="vec A" x1="${X(0)}" y1="${Y(0)}" x2="${X(a[0])}" y2="${Y(a[1])}"/><text class="vlbl A" x="${X(a[0]) + 5}" y="${Y(a[1]) - 5}">a</text>`;
  g += `<line class="vec HL" x1="${X(0)}" y1="${Y(0)}" x2="${X(b[0])}" y2="${Y(b[1])}"/><text class="vlbl HL" x="${X(b[0]) + 5}" y="${Y(b[1]) - 5}">b</text>`;
  return g + "</svg>";
}

function demoArea(el, opts = {}) {
  el.innerHTML = (opts.mini ? "" : `<div class="la-ctrl">${slider("a₁", -5, 5, 1, 1)}${slider("a₂", -5, 5, 1, 3)}${slider("b₁", -5, 5, 1, 2)}${slider("b₂", -5, 5, 1, -1)}</div>`) +
    `<div class="la-svgrow"><figure class="fa"></figure></div><p class="la-read"></p>`;
  const draw = ([a1, a2, b1, b2]) => {
    const det = a1 * b2 - a2 * b1;
    el.querySelector(".fa").innerHTML = areaSVG([a1, a2], [b1, b2]) + `<figcaption>columns a = (${a1}, ${a2}) and b = (${b1}, ${b2})</figcaption>`;
    el.querySelector(".la-read").innerHTML = `det [[${a1}, ${b1}], [${a2}, ${b2}]] = ${a1}·${b2} − ${b1}·${a2} = <b class="${det >= 0 ? "A" : "C"}">${det}</b>. ` +
      (det === 0 ? `<b class="NO">Area 0</b>: a and b lie on one line, the matrix is singular.`
        : `Area <b class="A">${Math.abs(det)}</b>; b turns ${det > 0 ? "counterclockwise" : "clockwise"} from a, so the sign is ${det > 0 ? "+" : "−"}. Every area is multiplied by ${Math.abs(det)}: a disk of area π becomes an ellipse of area ${Math.abs(det)}π.`);
  };
  if (opts.mini) {
    const sets = [[1, 3, 2, -1], [2, -1, 1, 3], [1, 3, 2, 6], [1, 0, 0, 1]];
    let k = 0;
    const tick = () => { draw(sets[k % sets.length]); k++; };
    tick(); setInterval(tick, 2400); return;
  }
  wireSliders(el, draw);
}

// ---------- Self-check quiz (from "Check your understanding") ----------

const QUIZ = [
  { q: "How many terms does the big formula have for a 4 × 4 matrix?", opts: ["16", "24", "64"], a: 1,
    why: "4! = 24, one per permutation; for a triangular matrix only the diagonal term is nonzero." },
  { q: "What is the cofactor sign in position (2, 3)?", opts: ["+", "−"], a: 1, why: "(−1)²⁺³ = −1." },
  { q: "The area of the triangle with corners (0, 0), (4, 1), (1, 3)?", opts: ["11", "5.5", "−5.5"], a: 1,
    why: "½ |4·3 − 1·1| = 5.5." },
  { q: "A map doubles every length in the plane. Areas and densities change by", opts: ["2 and ½", "4 and ¼", "4 and 4"], a: 1,
    why: "det(2I) = 4 multiplies areas; probability is kept, so densities are divided by 4." },
  { q: "The inverse from cofactors is", opts: ["C / det A", "Cᵀ / det A"], a: 1,
    why: "A Cᵀ = (det A) I; with C the product is not the identity." },
];

const DEMOS = {
  area: (el) => demoArea(el),
  areaMini: (el) => demoArea(el, { mini: true }),
  quiz: (el) => demoQuiz(el, QUIZ),
};
