// Interactive demos for LA101 Lecture 15: orthonormal bases, Gram–Schmidt, QR.
// Every code panel is copied from notes/L15-orthonormal-gram-schmidt-qr.md (checked by tools/check.py; generated, not retyped); the JS
// recomputes the same numbers so the examples can be changed.

const CODE = {
  q: "import numpy as np\nfrom fractions import Fraction\n\nQ2 = np.array([[3, -4], [4, 3]]) / 5\nQ3 = np.array([[2, 3, 6], [3, -6, 2], [6, 2, -3]]) / 7\nprint(np.allclose(Q2.T @ Q2, np.eye(2)), np.allclose(Q3.T @ Q3, np.eye(3)), np.allclose(Q3 @ Q3.T, np.eye(3)))\nx = np.array([1.0, 2.0, 2.0])\nprint(round(float(np.linalg.norm(x)), 10), round(float(np.linalg.norm(Q3 @ x)), 10))\nprint(round(float(np.linalg.det(Q2)), 10), round(float(np.linalg.det(Q3)), 10))",
  notsquare: "Qp = Q3[:, :2]\nprint(np.allclose(Qp.T @ Qp, np.eye(2)), np.allclose(Qp @ Qp.T, np.eye(3)), int(np.linalg.matrix_rank(Qp @ Qp.T)))",
  project: "bq = np.array([7.0, 0.0, 7.0])\ncoords = Qp.T @ bq\npq = Qp @ coords\nprint([round(float(c), 10) for c in coords], [round(float(c), 4) for c in pq])\nprint([round(float(c), 10) + 0.0 for c in Qp.T @ (bq - pq)], np.allclose(Qp @ Qp.T @ bq, pq))",
  coords: "c3 = Q3.T @ bq\nprint([round(float(c), 10) for c in c3], [round(float(c), 10) + 0.0 for c in Q3 @ c3])",
  gs: "u = np.array([1.0, 2.0, 1.0])\nv = np.array([1.0, 3.0, 2.0])\nq1 = u / np.linalg.norm(u)\nB = v - (q1 @ v) * q1\nq2 = B / np.linalg.norm(B)\nprint([round(float(c), 10) + 0.0 for c in B], round(float(B[0] - B[1] + B[2]), 10) + 0.0,\n      round(float(q1 @ q2), 10) + 0.0)\nprint(round(float(np.sqrt(6) * q1 @ v), 10), [round(float(c * np.sqrt(2)), 10) + 0.0 for c in q2])",
  drone: "Qd = np.column_stack([q1, q2])\nAd = np.column_stack([u, v])\nP_ne = Ad @ np.linalg.inv(Ad.T @ Ad) @ Ad.T\nb1 = np.ones(3)\nfr = lambda vec: [str(Fraction(float(c)).limit_denominator(1000)) for c in vec]\nprint(np.allclose(Qd @ Qd.T, P_ne), fr(Qd @ (Qd.T @ b1)), [round(float(c), 10) + 0.0 for c in Qd.T @ b1])",
  third: "C = b1 - (q1 @ b1) * q1 - (q2 @ b1) * q2\nq3 = C / np.linalg.norm(C)\nwrong = b1 - (u @ b1) / (u @ u) * u - (v @ b1) / (v @ v) * v\nprint(fr(C), np.allclose(np.column_stack([q1, q2, q3]).T @ np.column_stack([q1, q2, q3]), np.eye(3)))\nprint(fr(wrong), round(float(u @ wrong), 4), round(float(v @ wrong), 4))",
  qr: "t = np.array([0.0, 1.0, 2.0, 3.0])\ny = np.array([2.0, 3.0, 5.0, 6.0])\nAc = np.column_stack([np.ones(4), t])\nQ, R = np.linalg.qr(Ac)\nprint(np.round(R, 4).tolist(), [round(float(c), 4) for c in Q.T @ y])\nsigns = np.sign(np.diag(R))\nQ, R = Q * signs, (R.T * signs).T\nprint((np.round(R, 4) + 0.0).tolist(), round(float(np.sqrt(5)), 4), np.allclose(Q @ R, Ac))\nx_qr = np.linalg.solve(R, Q.T @ y)\nprint(fr(x_qr))",
  chol: "S = Ac.T @ Ac\nL = np.linalg.cholesky(S)\nprint(np.round(L, 4).tolist(), np.allclose(L, R.T), np.allclose(L @ L.T, S))\nz = np.linalg.solve(L, Ac.T @ y)\nprint(fr(np.linalg.solve(L.T, z)))\ntry:\n    np.linalg.cholesky(np.array([[1.0, 2.0], [2.0, 1.0]]))\nexcept np.linalg.LinAlgError as err:\n    print(\"LinAlgError:\", err)\nxbad = np.array([1.0, -1.0])\nprint(float(xbad @ np.array([[1.0, 2.0], [2.0, 1.0]]) @ xbad))",
  cond: "tt = np.arange(11.0)\nV = np.vander(tt, 8, increasing=True)\nw_true = np.ones(8)\nyy = V @ w_true\nprint(int(np.log10(np.linalg.cond(V))), int(np.log10(np.linalg.cond(V.T @ V))))\nw_ne = np.linalg.solve(V.T @ V, V.T @ yy)\nQv, Rv = np.linalg.qr(V)\nw_qrv = np.linalg.solve(Rv, Qv.T @ yy)\nerr_ne, err_qr = float(np.max(np.abs(w_ne - w_true))), float(np.max(np.abs(w_qrv - w_true)))\nprint(err_ne > 1e-7, err_qr < 1e-7, err_ne > 1000 * err_qr)",
  scale: "ts = (tt - 5) / 5\nVs = np.vander(ts, 8, increasing=True)\nws_true = np.linalg.lstsq(Vs, yy, rcond=None)[0]\nws_ne = np.linalg.solve(Vs.T @ Vs, Vs.T @ yy)\nprint(int(np.log10(np.linalg.cond(Vs))), float(np.max(np.abs(ws_ne - ws_true)) / np.max(np.abs(ws_true))) < 1e-10)",
  claim: "claimed_Q = np.column_stack([q1, B, q3])\nprint((np.round(claimed_Q.T @ claimed_Q, 4) + 0.0).tolist())",
};

const OUT = {
  q: "True True True\n3.0 3.0\n1.0 1.0",
  notsquare: "True False 2",
  project: "[8.0, 5.0] [4.4286, -0.8571, 8.2857]\n[0.0, 0.0] True",
  coords: "[8.0, 5.0, 3.0] [7.0, 0.0, 7.0]",
  gs: "[-0.5, 0.0, 0.5] 0.0 0.0\n9.0 [-1.0, 0.0, 1.0]",
  drone: "True ['2/3', '4/3', '2/3'] [1.6329931619, 0.0]",
  third: "['1/3', '-1/3', '1/3'] True\n['-2/21', '-34/21', '-11/21'] -3.8571 -6.0",
  qr: "[[-2.0, -3.0], [0.0, -2.2361]] [-8.0, -3.1305]\n[[2.0, 3.0], [0.0, 2.2361]] 2.2361 True\n['19/10', '7/5']",
  chol: "[[2.0, 0.0], [3.0, 2.2361]] True True\n['19/10', '7/5']\nLinAlgError: Matrix is not positive definite\n-2.0",
  cond: "8 16\nTrue True True",
  scale: "2 True",
  claim: "[[1.0, 0.0, 0.0], [0.0, 0.5, 0.0], [0.0, 0.0, 1.0]]",
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

// ---------- Demo: Gram–Schmidt, step by step, and the factors Q and R ----------

const dot = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0);
const r4 = (v) => { const x = Math.round(v * 10000) / 10000; return Object.is(x, -0) ? 0 : x; };
const vec4 = (v) => `(${v.map((x) => String(r4(x)).replace("-", "−")).join(", ")})`;

// Classical Gram–Schmidt on the columns; stops at the first dependent column.
function gramSchmidt(V) {
  const Qs = [], R = V.map(() => V.map(() => 0)), log = [];
  for (let j = 0; j < V.length; j++) {
    let w = V[j].slice();
    const parts = [];
    for (let i = 0; i < Qs.length; i++) {
      R[i][j] = dot(Qs[i], V[j]);
      w = w.map((x, k) => x - R[i][j] * Qs[i][k]);
      parts.push(`(q${i + 1}·a${j + 1}) q${i + 1} = ${r4(R[i][j])} q${i + 1}`);
    }
    const len = Math.sqrt(dot(w, w));
    if (len < 1e-9) return { Qs, R, log, dependent: j };
    R[j][j] = len;
    Qs.push(w.map((x) => x / len));
    log.push(`a${j + 1} = ${vec4(V[j])}${parts.length ? ` minus ${parts.join(" minus ")}` : ""} leaves ${vec4(w)}, length ${r4(len)}: <b class="A">q${j + 1} = ${vec4(Qs[j])}</b>.`);
  }
  return { Qs, R, log, dependent: -1 };
}

function demoGS(el, opts = {}) {
  el.innerHTML = (opts.mini ? "" : `<div class="la-ctrl la-grid"><label>vectors = <input class="la-in v" style="width:16em" value="1 2 1; 1 3 2"></label></div>
    <p class="hint">One vector per group, separated by ';' (try adding '; 1 1 1').</p>`) +
    `<div class="la-eq la-show"></div><p class="la-log"></p>`;
  const draw = (V) => {
    const show = el.querySelector(".la-show"), log = el.querySelector(".la-log");
    if (!V.length || !V.every((v) => v.length === V[0].length && v.every(Number.isFinite)) || V.length > V[0].length) {
      show.innerHTML = ""; log.innerHTML = "Type numbers; every vector needs the same number of entries, and at most that many vectors."; return;
    }
    const g = gramSchmidt(V);
    if (g.dependent >= 0) { show.innerHTML = ""; log.innerHTML = g.log.join("<br>") + `<br><b class="NO">a${g.dependent + 1} is a combination of the earlier vectors</b>: nothing is left, so the columns are dependent and there is no QR with invertible R.`; return; }
    const m = V[0].length, n = V.length;
    const Q = Array.from({ length: m }, (_, i) => g.Qs.map((qv) => r4(qv[i])));
    const A = Array.from({ length: m }, (_, i) => V.map((v) => v[i]));
    show.innerHTML = `A = ${matHTML(A)} = Q ${matHTML(Q)} R ${matHTML(g.R.slice(0, n).map((row) => row.slice(0, n).map(r4)))}`;
    log.innerHTML = g.log.join("<br>") + `<br>R is upper triangular: column j of A only uses q1, …, qj. QᵀQ = I.`;
  };
  if (opts.mini) {
    const sets = [[[1, 2, 1], [1, 3, 2]], [[1, 2, 1], [1, 3, 2], [1, 1, 1]], [[1, 1, 1, 1], [0, 1, 2, 3]]];
    let k = 0;
    const tick = () => { draw(sets[k % sets.length]); k++; };
    tick(); setInterval(tick, 3000); return;
  }
  const iv = el.querySelector(".v");
  const go = () => draw(iv.value.split(";").map((s) => s.trim()).filter(Boolean).map(parseVec));
  iv.addEventListener("input", go);
  go();
}

// ---------- Self-check quiz (from "Check your understanding") ----------

const QUIZ = [
  { q: "Are (1, 1) and (1, −1) orthonormal?", opts: ["Yes", "Perpendicular, but each has length √2: divide by √2", "No, they are not perpendicular"], a: 1,
    why: "Their dot product is 0, but orthonormal also needs length 1." },
  { q: "Q is 5 × 3 with orthonormal columns. Which is the identity?", opts: ["QᵀQ (3 × 3)", "QQᵀ (5 × 5)", "Both"], a: 0,
    why: "QQᵀ is the 5 × 5 projection onto the column space, of rank 3." },
  { q: "In A = QR, why is R upper triangular?", opts: ["By convention", "Column j of A only uses q1, …, qj"], a: 1,
    why: "Gram–Schmidt builds qj from the first j columns, so a later q is never needed." },
  { q: "Every symmetric matrix has a Cholesky factorization.", opts: ["True", "False: only positive definite ones"], a: 1,
    why: "[[1, 2], [2, 1]] with x = (1, −1) gives xᵀSx = −2: no Cholesky factor." },
  { q: "Why do libraries solve least squares with QR rather than AᵀA?", opts: ["QR is cheaper", "Forming AᵀA squares the condition number"], a: 1,
    why: "Condition 10⁸ becomes 10¹⁶: every digit is at risk." },
];

const DEMOS = {
  gs: (el) => demoGS(el),
  gsMini: (el) => demoGS(el, { mini: true }),
  quiz: (el) => demoQuiz(el, QUIZ),
};
