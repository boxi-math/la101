// Interactive demos for LA101 Lecture 11: incidence matrices, heights, loops, flows and the graph Laplacian.
// Every code panel is copied from notes/L11-graphs-networks.md (checked by tools/check.py; generated, not retyped); the JS
// recomputes the same numbers so the examples can be changed.

const CODE = {
  incidence: "import numpy as np\n\nroutes = [(1, 2), (2, 3), (1, 3), (3, 4), (4, 5), (3, 5)]\nn_pads = 5\n\n\ndef incidence(edges, n):\n    \"\"\"Incidence matrix: one row per edge, -1 at its start node, +1 at its end node (nodes numbered from 1).\"\"\"\n    M = np.zeros((len(edges), n), dtype=int)\n    for k, (start, end) in enumerate(edges):\n        M[k, start - 1] = -1\n        M[k, end - 1] = 1\n    return M\n\n\nA = incidence(routes, n_pads)\nm, n = A.shape\nr = int(np.linalg.matrix_rank(A))\nprint(A.tolist())\nprint(m, n, r, A.sum(axis=1).tolist())",
  climbs: "x = np.array([10, 14, 13, 20, 18])\nclimbs = A @ x\nprint(climbs.tolist())",
  ground: "ones = np.ones(n_pads, dtype=int)\nprint((A @ ones).tolist(), (A @ (x + 7 * ones)).tolist() == climbs.tolist())\nA_grounded = A[:, 1:]          # pad 1 fixed at height 0: drop its column\nprint(int(np.linalg.matrix_rank(A_grounded)), A_grounded.shape[1])",
  loops: "loop1 = np.array([1, 1, -1, 0, 0, 0])     # e1 + e2 - e3\nloop2 = np.array([0, 0, 0, 1, 1, -1])     # e4 + e5 - e6\nprint(int(loop1 @ climbs), int(loop2 @ climbs))\nprint((loop1 @ A).tolist(), (loop2 @ A).tolist())",
  reported: "reported = np.array([4, -1, 3, 7, -2, 6])\nprint(int(loop1 @ reported), int(loop2 @ reported))\nprint(int(np.linalg.matrix_rank(np.column_stack([A, reported]))) > r)",
  job: "f = np.array([-3, 0, 0, 0, 3])\ny_route = np.array([0, 0, 3, 0, 0, 3])\nprint((A.T @ y_route).tolist(), (A.T @ y_route).tolist() == f.tolist())",
  loopflows: "print((A.T @ loop1).tolist(), (A.T @ loop2).tolist())\ny_other = y_route + 2 * loop1 - 1 * loop2\nprint(y_other.tolist(), (A.T @ y_other).tolist())",
  sumzero: "print(int(ones @ (A.T @ np.array([5, -2, 1, 0, 4, -3]))), int(f.sum()))",
  count: "def loops(edges, n):\n    M = incidence(edges, n)\n    return M.shape[0] - int(np.linalg.matrix_rank(M))\n\n\ntree = [(1, 2), (2, 3), (3, 4), (3, 5)]                 # no loops: a tree\nextra = routes + [(2, 4)]                               # one more route\nprint(loops(routes, 5), loops(tree, 5), loops(extra, 5), len(extra) - 5 + 1)",
  laplacian: "L = A.T @ A\ndegree = np.diag(np.diag(L))\nW = degree - L\nprint(L.tolist())\nprint(np.diag(L).tolist(), W.tolist())\nprint((L @ ones).tolist(), int(np.linalg.matrix_rank(L)), (L == L.T).all())",
  rough: "print(int(x @ L @ x), int(climbs @ climbs), sum(int(c) ** 2 for c in climbs))",
  smooth: "noise = np.array([40.0, 42.0, 41.0, 60.0, 43.0])\nalpha = 0.2\nsmoothed = noise - alpha * (L @ noise)\nprint([round(float(v), 1) for v in smoothed])\nprint(round(float(noise @ L @ noise), 1), round(float(smoothed @ L @ smoothed), 1))\nprint(round(float(noise.sum()), 1), round(float(smoothed.sum()), 1))",
  claim: "claimed = A.copy()\nclaimed[5] = [0, 0, 1, 0, 1]\nprint(claimed.sum(axis=1).tolist())\nprint(int(np.linalg.matrix_rank(claimed)), (claimed.T @ claimed @ ones).tolist())",
};

const OUT = {
  incidence: "[[-1, 1, 0, 0, 0], [0, -1, 1, 0, 0], [-1, 0, 1, 0, 0], [0, 0, -1, 1, 0], [0, 0, 0, -1, 1], [0, 0, -1, 0, 1]]\n6 5 4 [0, 0, 0, 0, 0, 0]",
  climbs: "[4, -1, 3, 7, -2, 5]",
  ground: "[0, 0, 0, 0, 0, 0] True\n4 4",
  loops: "0 0\n[0, 0, 0, 0, 0] [0, 0, 0, 0, 0]",
  reported: "0 -1\nTrue",
  job: "[-3, 0, 0, 0, 3] True",
  loopflows: "[0, 0, 0, 0, 0] [0, 0, 0, 0, 0]\n[2, 2, 1, -1, -1, 4] [-3, 0, 0, 0, 3]",
  sumzero: "0 0",
  count: "2 0 3 3",
  laplacian: "[[2, -1, -1, 0, 0], [-1, 2, -1, 0, 0], [-1, -1, 4, -1, -1], [0, 0, -1, 2, -1], [0, 0, -1, -1, 2]]\n[2, 2, 4, 2, 2] [[0, 1, 1, 0, 0], [1, 0, 1, 0, 0], [1, 1, 0, 1, 1], [0, 0, 1, 0, 1], [0, 0, 1, 1, 0]]\n[0, 0, 0, 0, 0] 4 True",
  rough: "104 104 104",
  smooth: "[40.6, 41.4, 45.2, 52.8, 46.0]\n660.0 140.9\n226.0 226.0",
  claim: "[0, 0, 0, 0, 0, 2]\n5 [0, 0, 2, 0, 2]",
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

// ---------- Demo: any network of pads and routes: incidence matrix, rank, loops, climbs, Laplacian ----------

const parseEdges = (s) => s.split(/[,;]/).map((e) => e.trim()).filter(Boolean).map((e) => e.split(/\s*(?:->|>|→|-)\s*/).map(Number));

function incidence(edges, n) {
  return edges.map(([a, b]) => Array.from({ length: n }, (_, j) => (j === a - 1 ? -1 : j === b - 1 ? 1 : 0)));
}

function demoNetwork(el) {
  el.innerHTML = `<div class="la-ctrl la-grid"><label>routes = <input class="la-in e" style="width:22em" value="1>2, 2>3, 1>3, 3>4, 4>5, 3>5"></label>
    <label>heights = <input class="la-in h" style="width:11em" value="10 14 13 20 18"></label></div>
    <p class="hint">Routes as start>end, pads numbered 1, 2, …; one height per pad.</p><div class="la-eq la-show"></div><p class="la-read"></p>`;
  const [ie, ih] = [el.querySelector(".e"), el.querySelector(".h")];
  const go = () => {
    const edges = parseEdges(ie.value), x = parseVec(ih.value), n = x.length;
    const show = el.querySelector(".la-show"), read = el.querySelector(".la-read");
    if (!edges.length || !n || edges.some((e) => e.length !== 2 || e.some((v) => !Number.isInteger(v) || v < 1 || v > n) || e[0] === e[1]) || !x.every(Number.isInteger)) {
      show.innerHTML = ""; read.innerHTML = "Each route joins two different pads between 1 and the number of heights."; return;
    }
    const A = incidence(edges, n), m = A.length, r = rref(A).piv.length;
    const L = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => A.reduce((s, row) => s + row[i] * row[j], 0)));
    const b = A.map((row) => row.reduce((s, v, j) => s + v * x[j], 0));
    show.innerHTML = `A = ${matHTML(A)} L = AᵀA = ${matHTML(L)}`;
    read.innerHTML = `${m} routes, ${n} pads, rank ${r}. ` +
      `<b class="C">Nullspace</b> dimension ${n - r}: ${n - r === 1 ? "the network is connected; equal heights change no climb" : `${n - r} separate pieces`}. ` +
      `<b class="A">Independent loops</b>: m − r = ${m - r}${n - r === 1 ? ` = m − n + 1` : ""}. ` +
      `Climbs Ax = ${vecStr(b)}; sum of squared climbs xᵀLx = ${b.reduce((s, v) => s + v * v, 0)}.`;
  };
  ie.addEventListener("input", go); ih.addEventListener("input", go);
  go();
}

// ---------- Demo: smoothing a signal on the bow tie, x <- x - 0.2 L x ----------

const BOWTIE_L = [[2, -1, -1, 0, 0], [-1, 2, -1, 0, 0], [-1, -1, 4, -1, -1], [0, 0, -1, 2, -1], [0, 0, -1, -1, 2]];
const NOISE = [40, 42, 41, 60, 43];
const lap = (x) => BOWTIE_L.map((row) => row.reduce((s, v, j) => s + v * x[j], 0));

function demoSmooth(el, opts = {}) {
  el.innerHTML = (opts.mini ? "" : `<div class="la-ctrl">${slider("steps", 0, 12, 1, 1)}</div>`) + `<div class="la-show"></div><p class="la-read"></p>`;
  const draw = ([k]) => {
    let x = NOISE.slice();
    for (let t = 0; t < k; t++) { const Lx = lap(x); x = x.map((v, j) => v - 0.2 * Lx[j]); }
    const W = 300, H = 150, lo = 30, hi = 62, Y = (v) => H - 18 - ((v - lo) / (hi - lo)) * (H - 30);
    let g = `<svg class="la-plane" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="pad values">`;
    x.forEach((v, j) => {
      const cx = 30 + j * 60;
      g += `<rect class="${j === 3 ? "HL" : "A"}" x="${cx - 14}" y="${Y(v)}" width="28" height="${H - 18 - Y(v)}" opacity="0.8"/>` +
        `<text class="tick" x="${cx}" y="${H - 4}">pad ${j + 1}</text><text class="tick" x="${cx}" y="${Y(v) - 4}">${v.toFixed(1)}</text>`;
    });
    el.querySelector(".la-show").innerHTML = g + "</svg>";
    const Lx = lap(x), rough = x.reduce((s, v, j) => s + v * Lx[j], 0), total = x.reduce((s, v) => s + v, 0);
    el.querySelector(".la-read").innerHTML = `After ${k} step${k === 1 ? "" : "s"}: roughness xᵀLx = <b class="A">${rough.toFixed(1)}</b>, total = ${total.toFixed(1)} (always 226: L1 = 0).`;
  };
  if (opts.mini) { let k = 0; const tick = () => { draw([k % 9]); k++; }; tick(); setInterval(tick, 1200); return; }
  wireSliders(el, draw);
}

// ---------- Self-check quiz (from "Check your understanding") ----------

const QUIZ = [
  { q: "A connected graph has 7 nodes and 9 edges. Rank of its incidence matrix, and number of independent loops?", opts: ["6 and 3", "7 and 2", "6 and 2"], a: 0,
    why: "Rank n − 1 = 6; loops m − n + 1 = 9 − 7 + 1 = 3." },
  { q: "If the climbs on the six routes add to zero, they come from pad heights.", opts: ["True", "False"], a: 1,
    why: "The condition is one per loop. (1, 0, 0, 0, 0, −1) adds to zero, but the left loop gives 1." },
  { q: "Which subspaces contain the job (2, −1, 0, −1, 0) and the heights (1, 1, 1, 1, 1)?", opts: ["Row space; nullspace", "Left nullspace; column space", "Nullspace; row space"], a: 0,
    why: "The job's entries add to zero, so it is a possible job (row space). Equal heights are the nullspace." },
  { q: "\"The Laplacian has a 1 for each route, so L has six nonzero entries off the diagonal.\" What is wrong?", opts: ["Nothing", "Each route puts −1 at (i, j) and at (j, i): twelve off-diagonal entries, all −1"], a: 1,
    why: "L is symmetric; every route appears twice off the diagonal." },
];

// Demo registry: data-demo="name" in chapters.js mounts DEMOS[name].
const DEMOS = {
  network: (el) => demoNetwork(el),
  smooth: (el) => demoSmooth(el),
  smoothMini: (el) => demoSmooth(el, { mini: true }),
  quiz: (el) => demoQuiz(el, QUIZ),
};
