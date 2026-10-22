// Interactive demos for LA101 Elective E7: multivariate Gaussians and weighted least squares.
// Every code panel is copied from notes/E7-gaussians-weighted-least-squares.md (checked by tools/check.py; generated, not retyped); the JS
// recomputes the same numbers so the examples can be changed.

const CODE = {
  inv: "import numpy as np\n\nmu = np.array([17.0, 5.0])\nC = np.array([[5.0, 2.0], [2.0, 2.0]])\nCi = np.linalg.inv(C)\nprint(np.round(6 * Ci, 10).tolist(), round(float(np.linalg.det(C)), 10))\nprint(round(float(1 / (2 * np.pi * np.sqrt(np.linalg.det(C)))), 5))",
  maha: "def maha2(x):\n    v = np.asarray(x, dtype=float) - mu\n    return float(v @ Ci @ v)\n\n\nfor day in [(19, 6), (15, 6), (20, 5), (17, 7)]:\n    print(day, round(maha2(day), 4), round(float(np.linalg.norm(np.array(day) - mu)), 4))",
  ellipse: "lam, Q = np.linalg.eigh(C)\nprint(np.round(lam, 10).tolist(), np.round(np.sqrt(lam), 4).tolist(), (C @ [2, 1]).tolist(), (C @ [1, -2]).tolist())\nprint([round(float(1 - np.exp(-r * r / 2)), 4) for r in (1, 2, 3)])\nrng = np.random.default_rng(7)\nX = rng.multivariate_normal(mu, C, size=100_000, method=\"cholesky\")\nD2 = np.einsum(\"ij,jk,ik->i\", X - mu, Ci, X - mu)\nprint([round(float(np.mean(D2 <= r * r)), 3) for r in (1, 2, 3)])",
  whiten: "L = np.linalg.cholesky(C)\nprint(np.round(L, 4).tolist(), np.round(L**2, 10).tolist(), np.allclose(L @ L.T, C))\nZ = rng.standard_normal((100_000, 2))\nXs = mu + Z @ L.T\nprint(np.round(Xs.mean(axis=0), 2).tolist(), np.round(np.cov(Xs.T), 2).tolist())\nW = np.linalg.solve(L, (Xs - mu).T).T\nprint((np.round(np.cov(W.T), 2) + 0.0).tolist())\nzA = np.linalg.solve(L, np.array([19.0, 6.0]) - mu)\nprint(np.round(zA, 4).tolist(), round(float(zA @ zA), 4))",
  cond: "Xc = rng.multivariate_normal(mu, C, size=400_000, method=\"cholesky\")\nnear = np.abs(Xc[:, 0] - 20) < 0.1\nprint(int(near.sum()), round(float(Xc[near, 1].mean()), 2), round(float(Xc[near, 1].var()), 2))\nprint(5 + 2 / 5 * 3, 2 - 4 / 5, np.round(np.linalg.cholesky(C)[1, 1] ** 2, 10))",
  combine: "b = np.array([20.0, 21.0, 23.0])\ns = np.array([0.5, 1.0, 2.0])\n\n\ndef combine(wts):\n    est = float(wts @ b / wts.sum())\n    var = float((wts**2 * s**2).sum() / wts.sum() ** 2)\n    return round(est, 4), round(var, 4)\n\n\nprint(\"1/sigma^2\", combine(1 / s**2))\nprint(\"equal    \", combine(np.ones(3)))\nprint(\"1/sigma  \", combine(1 / s))",
  line: "t = np.arange(5.0)\nbt = np.array([1.1, 2.8, 5.3, 6.2, 11.0])\nst = np.array([0.2, 0.2, 0.5, 1.0, 2.0])\nA = np.column_stack([np.ones(5), t])\nWt = np.diag(1 / st**2)\nols = np.linalg.solve(A.T @ A, A.T @ bt)\nwls = np.linalg.solve(A.T @ Wt @ A, A.T @ Wt @ bt)\nprint(np.round(ols, 4).tolist(), np.round(wls, 4).tolist())",
  whitenrows: "print(np.round(np.linalg.lstsq(A / st[:, None], bt / st, rcond=None)[0], 4).tolist())\ncov_w = np.linalg.inv(A.T @ Wt @ A)\nP = np.linalg.solve(A.T @ A, A.T)\ncov_o = P @ np.diag(st**2) @ P.T\nprint(np.round(np.sqrt(np.diag(cov_o)), 3).tolist(), np.round(np.sqrt(np.diag(cov_w)), 3).tolist())",
  sim: "rng2 = np.random.default_rng(1)\nfits_o, fits_w = [], []\nfor _ in range(20_000):\n    bb = A @ [1.0, 2.0] + st * rng2.standard_normal(5)\n    fits_o.append(P @ bb)\n    fits_w.append(cov_w @ A.T @ Wt @ bb)\nprint(np.round(np.mean(fits_o, axis=0), 2).tolist(), np.round(np.std(fits_o, axis=0), 2).tolist())\nprint(np.round(np.mean(fits_w, axis=0), 2).tolist(), np.round(np.std(fits_w, axis=0), 2).tolist())",
  claim: "typo = np.array([[5.0, 2.0], [0.0, 2.0]])\nLt = np.linalg.cholesky(typo)\nprint(np.round(Lt @ Lt.T, 10).tolist(), np.allclose(typo, typo.T))",
};

const OUT = {
  inv: "[[2.0, -2.0], [-2.0, 5.0]] 6.0\n0.06497",
  maha: "(19, 6) 0.8333 2.2361\n(15, 6) 3.5 2.2361\n(20, 5) 3.0 3.0\n(17, 7) 3.3333 2.0",
  ellipse: "[1.0, 6.0] [1.0, 2.4495] [12.0, 6.0] [1.0, -2.0]\n[0.3935, 0.8647, 0.9889]\n[0.395, 0.864, 0.989]",
  whiten: "[[2.2361, 0.0], [0.8944, 1.0954]] [[5.0, 0.0], [0.8, 1.2]] True\n[16.99, 5.0] [[5.01, 2.0], [2.0, 1.99]]\n[[1.0, 0.0], [0.0, 0.99]]\n[0.8944, 0.1826] 0.8333",
  cond: "5824 6.18 1.21\n6.2 1.2 1.2",
  combine: "1/sigma^2 (20.3333, 0.1905)\nequal     (21.3333, 0.5833)\n1/sigma   (20.7143, 0.2449)",
  line: "[0.64, 2.32] [1.0152, 1.934]",
  whitenrows: "[1.0152, 1.934]\n[0.437, 0.415] [0.183, 0.185]",
  sim: "[0.99, 2.0] [0.43, 0.41]\n[1.0, 2.0] [0.18, 0.18]",
  claim: "[[5.0, 0.0], [0.0, 2.0]] False",
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

// ---------- 2 × 2 symmetric matrices: eigenvalues, eigenvectors, a plane to draw on ----------

const r3 = (v) => { const x = Math.round(v * 1000) / 1000; return Object.is(x, -0) ? 0 : x; };
const num = (v) => String(r3(v)).replace("-", "−");

// S = [[a, b], [b, c]]: eigenvalues l1 >= l2 and unit eigenvectors q1, q2 (perpendicular).
function eigSym(a, b, c) {
  const m = (a + c) / 2, d = Math.hypot((a - c) / 2, b);
  const l1 = m + d, l2 = m - d;
  let q1 = Math.abs(b) > 1e-12 ? [b, l1 - a] : a >= c ? [1, 0] : [0, 1];
  const n = Math.hypot(q1[0], q1[1]);
  q1 = [q1[0] / n, q1[1] / n];
  if (q1[0] < 0 || (q1[0] === 0 && q1[1] < 0)) q1 = [-q1[0], -q1[1]];
  return { l1, l2, q1, q2: [q1[1], -q1[0]] };
}

function plane(R, W = 260) {
  const s = W / (2 * R), X = (x) => W / 2 + x * s, Y = (y) => W / 2 - y * s;
  let g = `<svg class="la-plane" viewBox="0 0 ${W} ${W}" width="${W}" height="${W}" role="img">`;
  for (let k = -R; k <= R; k++) g += `<line class="grid" x1="${X(k)}" y1="0" x2="${X(k)}" y2="${W}"/><line class="grid" x1="0" y1="${Y(k)}" x2="${W}" y2="${Y(k)}"/>`;
  g += `<line class="axis" x1="0" y1="${Y(0)}" x2="${W}" y2="${Y(0)}"/><line class="axis" x1="${X(0)}" y1="0" x2="${X(0)}" y2="${W}"/>`;
  const path = (pts, cls, extra = "") => `<polyline points="${pts.map(([x, y]) => `${X(x).toFixed(1)},${Y(y).toFixed(1)}`).join(" ")}" class="${cls}" style="fill:none" stroke-width="2" ${extra}/>`;
  const vec = (v, cls, lbl) => `<line class="vec ${cls}" x1="${X(0)}" y1="${Y(0)}" x2="${X(v[0])}" y2="${Y(v[1])}"/>` +
    (lbl ? `<text class="vlbl ${cls}" x="${X(v[0]) + 5}" y="${Y(v[1]) - 5}">${lbl}</text>` : "");
  const line = (d, cls) => `<line class="${cls}" x1="${X(-R * 1.5 * d[0])}" y1="${Y(-R * 1.5 * d[1])}" x2="${X(R * 1.5 * d[0])}" y2="${Y(R * 1.5 * d[1])}" stroke-dasharray="4 4" stroke-width="1"/>`;
  return { open: g, close: "</svg>", path, vec, line, clip: (pts) => pts.filter(([x, y]) => Math.abs(x) <= R * 1.2 && Math.abs(y) <= R * 1.2) };
}

// ---------- Demo: Mahalanobis distance of a café day ----------

const MU = [17, 5], SI = [[2 / 6, -2 / 6], [-2 / 6, 5 / 6]]; // Σ = [[5, 2], [2, 2]], Σ⁻¹ = (1/6)[[2, −2], [−2, 5]]
const d2 = (v) => v[0] * (SI[0][0] * v[0] + SI[0][1] * v[1]) + v[1] * (SI[1][0] * v[0] + SI[1][1] * v[1]);

function mahaSvg(v) {
  const P = plane(5), q1 = [2 / Math.sqrt(5), 1 / Math.sqrt(5)], q2 = [1 / Math.sqrt(5), -2 / Math.sqrt(5)];
  let g = P.open + P.line(q1, "A") + P.line(q2, "C");
  for (const r of [1, 2]) {
    const pts = [];
    for (let t = 0; t <= 120; t++) {
      const u = (2 * Math.PI * t) / 120, a = r * Math.sqrt(6) * Math.cos(u), b = r * Math.sin(u);
      pts.push([a * q1[0] + b * q2[0], a * q1[1] + b * q2[1]]);
    }
    g += P.path(P.clip(pts), "HL");
  }
  return g + P.vec(v, d2(v) > 4 ? "NO" : "A", "day") + P.close;
}

function demoMaha(el, opts = {}) {
  el.innerHTML = (opts.mini ? "" : `<div class="la-ctrl">${slider("temperature °C", 12, 22, 1, 15)}${slider("iced coffee (tens)", 1, 9, 1, 6)}</div>`) +
    `<div class="la-svgrow"><figure class="fc"></figure></div><p class="la-read"></p>`;
  const draw = ([t, s]) => {
    const v = [t - MU[0], s - MU[1]], dd = d2(v);
    el.querySelector(".fc").innerHTML = mahaSvg(v) + `<figcaption>deviation from the mean (17 °C, 50 cups); ellipses d = 1, 2</figcaption>`;
    el.querySelector(".la-read").innerHTML = `Day (${t} °C, ${s * 10} cups): deviation (${num(v[0])}, ${num(v[1])}). Euclidean distance ${num(Math.hypot(v[0], v[1]))}; ` +
      `Mahalanobis d² = <b class="${dd > 4 ? "NO" : "A"}">${num(dd)}</b> (d = ${num(Math.sqrt(dd))}), ${dd <= 1 ? "inside the d = 1 ellipse" : dd <= 4 ? "between d = 1 and d = 2" : "outside d = 2: unusual"}.`;
  };
  if (opts.mini) {
    const days = [[19, 6], [15, 6], [20, 5], [17, 7]];
    let i = 0;
    const tick = () => { draw(days[i % days.length]); i++; };
    tick(); setInterval(tick, 2600); return;
  }
  wireSliders(el, draw);
}

// ---------- Demo: combining three thermometers ----------

function demoWLS(el) {
  el.innerHTML = `<div class="la-ctrl">${slider("σ₃ (cheap thermometer)", 0.5, 4, 0.25, 2)}${slider("weights 1/σ^p, p =", 0, 2, 1, 2)}</div><p class="la-read"></p>`;
  wireSliders(el, ([s3, p]) => {
    const b = [20, 21, 23], s = [0.5, 1, s3], w = s.map((x) => 1 / x ** p);
    const W = w.reduce((a, c) => a + c, 0), est = w.reduce((a, c, i) => a + c * b[i], 0) / W;
    const varr = w.reduce((a, c, i) => a + c * c * s[i] * s[i], 0) / (W * W);
    const best = 1 / s.reduce((a, c) => a + 1 / (c * c), 0);
    el.querySelector(".la-read").innerHTML = `Readings 20, 21, 23 with σ = 0.5, 1, ${num(s3)}. Weights ${w.map(num).join(", ")} ` +
      `(${p === 2 ? "1/σ², the right ones" : p === 1 ? "1/σ" : "equal"}): estimate <b class="A">${num(est)}</b>, variance <b class="${p === 2 ? "A" : "NO"}">${num(varr)}</b>. ` +
      `The best possible variance is 1/(sum of precisions) = <b class="HL">${num(best)}</b>.`;
  });
}

// ---------- Self-check quiz (from "Check your understanding") ----------

const QUIZ = [
  { q: "Σ = diag(9, 1). The more unusual point is", opts: ["(3, 0)", "(0, 2)", "equally unusual"], a: 1,
    why: "d² = 9/9 = 1 for (3, 0) and 4/1 = 4 for (0, 2)." },
  { q: "The half-axes of the ellipse d = 1 for Σ = diag(9, 1) are", opts: ["3 and 1", "1/3 and 1", "9 and 1"], a: 0,
    why: "Half-axes √λ: the standard deviation along each axis." },
  { q: "Two independent measurements with σ = 1 and 2. The best combination has variance", opts: ["0.8", "1.25", "0.5"], a: 0,
    why: "Precisions 1 and ¼ add to 1.25; the variance is 1/1.25 = 0.8." },
  { q: "To sample N(μ, Σ) from white z, use", opts: ["μ + Σz", "μ + Lz with LLᵀ = Σ", "μ + Σ⁻¹z"], a: 1,
    why: "μ + Lz has covariance LLᵀ = Σ; Σz would have covariance Σ²." },
  { q: "Weighted least squares with W = Σ_noise⁻¹ is, under Gaussian noise,", opts: ["the maximum-likelihood estimate", "biased", "the same as ordinary least squares"], a: 0,
    why: "The log-likelihood is −½(b − Ax)ᵀΣ⁻¹(b − Ax) + const." },
];

const DEMOS = {
  maha: (el) => demoMaha(el),
  mahaMini: (el) => demoMaha(el, { mini: true }),
  wls: (el) => demoWLS(el),
  quiz: (el) => demoQuiz(el, QUIZ),
};
