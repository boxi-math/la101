// Interactive demos for LA101 Elective E1. The graph Laplacian, the Fiedler vector, balanced cuts and spectral clustering.
// Every code panel is copied from notes/E1-graph-laplacians.md (checked by tools/check.py); the JS recomputes the same
// numbers so the examples can be changed.

const CODE = {
  lap: "import numpy as np\nedges = [(1, 2), (1, 3), (2, 3), (2, 4), (3, 4), (4, 5), (5, 6), (5, 7), (6, 7), (6, 8), (7, 8)]\n\ndef laplacian(edges, n):\n    W = np.zeros((n, n))\n    for i, j in edges:\n        W[i - 1, j - 1] = W[j - 1, i - 1] = 1.0\n    return np.diag(W.sum(axis=1)) - W\n\nL = laplacian(edges, 8)\nprint(L.astype(int).tolist())\nprint(L.sum(axis=1).tolist())",
  energy: "A = np.zeros((len(edges), 8))\nfor k, (i, j) in enumerate(edges):\n    A[k, i - 1], A[k, j - 1] = -1.0, 1.0\nx = np.array([1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0])\nprint(bool(np.allclose(A.T @ A, L)), float(x @ L @ x), float(sum((x[i - 1] - x[j - 1]) ** 2 for i, j in edges)))",
  split: "L_split = laplacian([e for e in edges if e != (4, 5)], 8)\nlam_s, V_s = np.linalg.eigh(L_split)\nprint(np.round(lam_s, 4).tolist())\nprint((np.round(np.abs(V_s[:, :2]), 3) + 0.0).tolist())",
  lam: "lam, V = np.linalg.eigh(L)\nprint(np.round(lam, 4).tolist())",
  fiedler: "fiedler = V[:, 1] * np.sign(V[0, 1])\nprint(np.round(fiedler, 3).tolist())\nprint([i + 1 for i in range(8) if fiedler[i] > 0], [i + 1 for i in range(8) if fiedler[i] < 0])",
  rough: "rough = V[:, -1] * np.sign(V[0, -1])\nside = rough > 0\ncut = sum(side[i - 1] != side[j - 1] for i, j in edges)\nprint(np.round(rough, 3).tolist(), [i + 1 for i in range(8) if side[i]], int(cut))",
  ninth: "L9 = laplacian(edges + [(8, 9)], 9)\nlam9, V9 = np.linalg.eigh(L9)\nf9 = V9[:, 1] * np.sign(V9[0, 1])\nprint((np.round(lam9[:3], 4) + 0.0).tolist(), np.round(f9, 3).tolist())\n\ndef ratio_cut(Lg, group):\n    n = len(Lg)\n    x = np.zeros(n)\n    x[group] = 1.0\n    return float(x @ Lg @ x), round(float(x @ Lg @ x) * (1 / len(group) + 1 / (n - len(group))), 3)\n\nprint(ratio_cut(L9, [8]), ratio_cut(L9, [0, 1, 2, 3]))",
  complete: "K = [(i, j) for i in range(1, 9) for j in range(i + 1, 9)]\nprint(np.round(np.linalg.eigvalsh(laplacian(K, 8)), 4).tolist())",
  kmeans: "rng = np.random.default_rng(7)\nt = rng.uniform(0, 2 * np.pi, 120)\nr = np.r_[np.full(30, 1.0), np.full(90, 3.0)] + 0.1 * rng.normal(size=120)\nP = np.c_[r * np.cos(t), r * np.sin(t)]\ntruth = np.r_[np.zeros(30), np.ones(90)].astype(int)\nD2 = ((P[:, None, :] - P[None, :, :]) ** 2).sum(axis=2)\nagree = lambda labels: float(max(np.mean(labels == truth), np.mean(labels != truth)))\n\ndef kmeans2(X, iters=50):\n    centres = X[[0, 30]].copy()\n    for _ in range(iters):\n        labels = np.argmin(((X[:, None, :] - centres[None]) ** 2).sum(axis=2), axis=1)\n        centres = np.array([X[labels == k].mean(axis=0) for k in range(2)])\n    return labels\n\nprint(round(agree(kmeans2(P)), 3))",
  spectral: "def spectral(sigma):\n    Wg = np.exp(-D2 / (2 * sigma ** 2))\n    np.fill_diagonal(Wg, 0.0)\n    Lg = np.diag(Wg.sum(axis=1)) - Wg\n    lam_g, V_g = np.linalg.eigh(Lg)\n    return lam_g, (V_g[:, 1] > 0).astype(int)\n\nlam_g, labels = spectral(0.5)\nprint(np.round(lam_g[:4], 4).tolist(), agree(labels))",
  width: "lam_w, labels_w = spectral(0.8)\nprint(np.round(lam_w[:4], 4).tolist(), round(agree(labels_w), 3))",
  cyu: "print(laplacian([(1, 2), (2, 3)], 3).astype(int).tolist())",
  ex3: "ring = [(i, i % 8 + 1) for i in range(1, 9)]\nprint(np.round(np.linalg.eigvalsh(laplacian(ring, 8)), 4).tolist(), round(float(2 - 2 * np.cos(2 * np.pi / 8)), 4))",
  ex4: "def laplacian_w(edges, n, weights):\n    W = np.zeros((n, n))\n    for (i, j), w in zip(edges, weights):\n        W[i - 1, j - 1] = W[j - 1, i - 1] = w\n    return np.diag(W.sum(axis=1)) - W\n\nfor w in (0.1, 1.0, 3.0):\n    ws = [w if e == (4, 5) else 1.0 for e in edges]\n    print(w, round(float(np.linalg.eigvalsh(laplacian_w(edges, 8, ws))[1]), 4))",
  claim: "lam_e, V_e = np.linalg.eig(L)\nprint((np.round(lam_e.real, 4) + 0.0).tolist())\ncol = V_e[:, 2].real * np.sign(V_e[0, 2].real)\nprint(np.round(col, 3).tolist())",
};

const OUT = {
  lap: "[[2, -1, -1, 0, 0, 0, 0, 0], [-1, 3, -1, -1, 0, 0, 0, 0], [-1, -1, 3, -1, 0, 0, 0, 0], [0, -1, -1, 3, -1, 0, 0, 0], [0, 0, 0, -1, 3, -1, -1, 0], [0, 0, 0, 0, -1, 3, -1, -1], [0, 0, 0, 0, -1, -1, 3, -1], [0, 0, 0, 0, 0, -1, -1, 2]]\n[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]",
  energy: "True 4.0 4.0",
  split: "[0.0, 0.0, 2.0, 2.0, 4.0, 4.0, 4.0, 4.0]\n[[0.5, 0.0], [0.5, 0.0], [0.5, 0.0], [0.5, 0.0], [0.0, 0.5], [0.0, 0.5], [0.0, 0.5], [0.0, 0.5]]",
  lam: "[0.0, 0.2907, 2.0, 2.8061, 4.0, 4.0, 4.0, 4.9032]",
  fiedler: "[0.432, 0.37, 0.37, 0.199, -0.199, -0.37, -0.37, -0.432]\n[1, 2, 3, 4] [5, 6, 7, 8]",
  rough: "[0.179, -0.26, -0.26, 0.576, -0.576, 0.26, 0.26, -0.179] [1, 4, 6, 7] 9",
  ninth: "[0.0, 0.2367, 0.9649] [0.428, 0.378, 0.378, 0.237, -0.099, -0.255, -0.255, -0.351, -0.46]\n(1.0, 1.125) (1.0, 0.45)",
  complete: "[0.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 8.0]",
  kmeans: "0.517",
  spectral: "[0.0, 0.0071, 0.043, 0.0623] 1.0",
  width: "[0.0, 0.4827, 0.5333, 1.0467] 0.542",
  cyu: "[[1, -1, 0], [-1, 2, -1], [0, -1, 1]]",
  ex3: "[0.0, 0.5858, 0.5858, 2.0, 2.0, 3.4142, 3.4142, 4.0] 0.5858",
  ex4: "0.1 0.047\n1.0 0.2907\n3.0 0.4472",
  claim: "[0.0, 0.2907, 4.9032, 4.0, 2.0, 2.8061, 4.0, 4.0]\n[0.179, -0.26, -0.26, 0.576, -0.576, 0.26, 0.26, -0.179]",
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

// ---------- 2-by-2 eigenvalues in closed form (shared by the eigenvalue demos of Lectures 18–21) ----------

const num = (v, d = 4) => (Math.abs(v) < 1e-12 ? "0" : sgn(+v.toFixed(d)));
const vecTxt = (v, d = 4) => `(${v.map((x) => num(x, d)).join(", ")})`;
const parseNumMat = (s) => s.split(";").map((r) => r.trim().split(/[\s,]+/).filter(Boolean).map(Number));
const ok2 = (M) => M.length === 2 && M.every((r) => r.length === 2 && r.every(Number.isFinite));
const mv = (M, x) => M.map((r) => r.reduce((s, v, j) => s + v * x[j], 0));
const mm = (A, B) => A.map((r) => B[0].map((_, j) => r.reduce((s, v, k) => s + v * B[k][j], 0)));
const mpow = (M, k) => { let R = [[1, 0], [0, 1]]; for (let i = 0; i < k; i++) R = mm(M, R); return R; };

// λ² − tr·λ + det = 0. Real roots come with an eigenvector each (null space of A − λI); complex roots as {re, im}.
function eig2([[a, b], [c, d]]) {
  const tr = a + d, det = a * d - b * c, disc = tr * tr - 4 * det;
  if (disc < -1e-12) return { tr, det, disc, complex: true, re: tr / 2, im: Math.sqrt(-disc) / 2 };
  const s = Math.sqrt(Math.max(disc, 0));
  const lams = [(tr + s) / 2, (tr - s) / 2];
  const vecOf = (l) => {
    const r1 = [a - l, b], r2 = [c, d - l];
    const r = Math.hypot(...r1) > Math.hypot(...r2) ? r1 : r2;
    if (Math.hypot(...r) < 1e-12) return null;              // A − λI = 0: every vector is an eigenvector
    const v = [-r[1], r[0]], k = Math.abs(v[0]) > 1e-12 ? v[0] : v[1];
    return v.map((x) => x / k);
  };
  return { tr, det, disc, complex: false, lams, vecs: lams.map(vecOf), repeated: Math.abs(disc) < 1e-12 };
}

// ---------- Symmetric eigenvalues by cyclic Jacobi rotations ----------
// Returns eigenvalues in increasing order and the matching unit eigenvectors (vecs[k] is the k-th eigenvector).
function symEig(A0) {
  const n = A0.length, A = A0.map((r) => r.slice()), V = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
  for (let sweep = 0; sweep < 60; sweep++) {
    let off = 0;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) off += A[p][q] * A[p][q];
    if (off < 1e-22) break;
    for (let p = 0; p < n - 1; p++) for (let q = p + 1; q < n; q++) {
      if (Math.abs(A[p][q]) < 1e-300) continue;
      const th = (A[q][q] - A[p][p]) / (2 * A[p][q]), t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1)), c = 1 / Math.sqrt(t * t + 1), s = t * c;
      for (let k = 0; k < n; k++) { const akp = A[k][p], akq = A[k][q]; A[k][p] = c * akp - s * akq; A[k][q] = s * akp + c * akq; }
      for (let k = 0; k < n; k++) { const apk = A[p][k], aqk = A[q][k]; A[p][k] = c * apk - s * aqk; A[q][k] = s * apk + c * aqk; }
      for (let k = 0; k < n; k++) { const vkp = V[k][p], vkq = V[k][q]; V[k][p] = c * vkp - s * vkq; V[k][q] = s * vkp + c * vkq; }
    }
  }
  const idx = [...Array(n).keys()].sort((a, b) => A[a][a] - A[b][b]);
  return { vals: idx.map((i) => A[i][i]), vecs: idx.map((i) => V.map((r) => r[i])) };
}

const laplacianOf = (edges, n, w = null) => {
  const L = Array.from({ length: n }, () => Array(n).fill(0));
  edges.forEach(([i, j], k) => { const c = w ? w[k] : 1; L[i - 1][j - 1] -= c; L[j - 1][i - 1] -= c; L[i - 1][i - 1] += c; L[j - 1][j - 1] += c; });
  return L;
};
const r4 = (v) => { const x = Math.round(v * 1e4) / 1e4; return Object.is(x, -0) ? 0 : x; };

// ---------- Demo: the Fiedler vector of a small graph ----------
const BASE = "1-2 1-3 2-3 2-4 3-4 4-5 5-6 5-7 6-7 6-8 7-8";
const POS = { 1: [60, 70], 2: [120, 40], 3: [120, 130], 4: [190, 90], 5: [290, 90], 6: [360, 40], 7: [360, 130], 8: [420, 80], 9: [470, 140] };
function parseEdges(s) {
  const e = s.trim().split(/[\s,;]+/).filter(Boolean).map((t) => t.split(/[-–]/).map(Number));
  return e.every((p) => p.length === 2 && p.every((v) => Number.isInteger(v) && v >= 1 && v <= 12) && p[0] !== p[1]) ? e : null;
}
function drawGraph(el, n, edges, x, height) {
  const pos = (i) => (POS[i] && n <= 9 ? POS[i] : [250 + 170 * Math.cos((2 * Math.PI * (i - 1)) / n), 90 + 70 * Math.sin((2 * Math.PI * (i - 1)) / n)]);
  const mx = Math.max(...x.map(Math.abs)) || 1;
  let s = `<svg viewBox="0 0 520 ${height}" style="width:100%;max-width:520px">`;
  for (const [i, j] of edges) { const [a, b] = [pos(i), pos(j)], cut = Math.sign(x[i - 1]) !== Math.sign(x[j - 1]); s += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${cut ? "var(--red)" : "var(--stone)"}" stroke-width="${cut ? 3 : 1.6}" ${cut ? 'stroke-dasharray="6 4"' : ""}/>`; }
  for (let i = 1; i <= n; i++) { const [px, py] = pos(i), v = x[i - 1], r = 9 + 9 * Math.abs(v) / mx; s += `<circle cx="${px}" cy="${py}" r="${r}" fill="${v >= 0 ? "var(--teal)" : "var(--amber)"}" opacity="0.9"/><text x="${px}" y="${py + 4}" text-anchor="middle" font-size="12" fill="#fff" font-weight="700">${i}</text><text x="${px}" y="${py - r - 4}" text-anchor="middle" font-size="10" fill="var(--stone)">${num(v, 2)}</text>`; }
  el.innerHTML = s + "</svg>";
}
function demoGraph(el, opts = {}) {
  if (opts.mini) {
    el.innerHTML = `<div class="la-fig"></div>`;
    const e = parseEdges(BASE), { vecs } = symEig(laplacianOf(e, 8)), v = vecs[1].map((t) => t * Math.sign(vecs[1][0]));
    drawGraph(el.querySelector(".la-fig"), 8, e, v, 180); return;
  }
  el.innerHTML = `<div class="la-ctrl la-grid"><label style="display:flex;gap:6px;align-items:center;max-width:100%">edges <input class="la-in" value="${BASE}" style="width:26em;max-width:100%;min-width:0"></label></div>
    <div class="la-ctrl" style="display:flex;flex-wrap:wrap;gap:8px"><button class="cbtn" data-e="${BASE}">two groups, one bridge</button> <button class="cbtn" data-e="${BASE.replace(" 4-5", "")}">bridge removed</button> <button class="cbtn" data-e="${BASE} 8-9">a ninth student</button> <button class="cbtn" data-e="${[...Array(8).keys()].flatMap((i) => [...Array(8).keys()].filter((j) => j > i).map((j) => `${i + 1}-${j + 1}`)).join(" ")}">everyone knows everyone</button>
    <label><input type="checkbox" class="la-big"> use the largest eigenvalue instead</label></div>
    <div class="la-fig"></div><div class="la-show"></div>`;
  const inE = el.querySelector(".la-in"), big = el.querySelector(".la-big");
  const draw = () => {
    const e = parseEdges(inE.value), show = el.querySelector(".la-show");
    if (!e || !e.length) { show.innerHTML = "Type edges like 1-2 2-3 (nodes 1 to 12)."; return; }
    const n = Math.max(...e.flat()), L = laplacianOf(e, n), { vals, vecs } = symEig(L);
    const k = big.checked ? n - 1 : 1; let v = vecs[k]; const piv = v.find((t) => Math.abs(t) > 1e-9) || 1; v = v.map((t) => r4(t * Math.sign(piv)));
    drawGraph(el.querySelector(".la-fig"), n, e, v, 190);
    const S = v.map((t, i) => (t >= 0 ? i + 1 : 0)).filter(Boolean), cut = e.filter(([i, j]) => Math.sign(v[i - 1] || 1) !== Math.sign(v[j - 1] || 1)).length;
    const zeros = vals.filter((t) => Math.abs(t) < 1e-9).length, rep = vals.filter((t) => Math.abs(t - vals[1]) < 1e-6).length;
    const ratio = S.length && S.length < n ? cut * (1 / S.length + 1 / (n - S.length)) : Infinity;
    show.innerHTML = `<p>eigenvalues ${vals.map((t) => num(r4(t), 4)).join(", ")}</p>
      <p>${zeros} zero eigenvalue${zeros === 1 ? "" : "s"}: <b>${zeros}</b> connected piece${zeros === 1 ? "" : "s"}${zeros === 1 ? ` · λ₂ = ${num(r4(vals[1]), 4)}` : ""}</p>
      <p><span style="color:var(--teal)">●</span> {${S.join(", ")}} · <span style="color:var(--amber)">●</span> the rest · cut edges <b>${cut}</b> of ${e.length} · ratio cut ${Number.isFinite(ratio) ? num(ratio, 3) : "—"}</p>
      <p class="la-log">${big.checked ? '<b class="NO">The largest eigenvalue gives the roughest pattern: it cuts many edges.</b>' : zeros > 1 ? "Several zero eigenvalues: the eigenvectors are only fixed up to mixing, so read the pieces from the zero eigenvalues." : rep > 1 ? `<b class="NO">λ₂ is repeated ${rep} times: there is no single Fiedler vector, and its signs mean nothing.</b>` : "The node size shows |entry|; dashed red edges are cut by the sign split."}</p>`;
  };
  inE.addEventListener("input", draw); big.onchange = draw;
  el.querySelectorAll(".cbtn").forEach((b) => { b.onclick = () => { inE.value = b.dataset.e; draw(); }; });
  draw();
}

// ---------- Demo: spectral clustering of two rings ----------
function rngU(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function ringsData(seed) {
  const u = rngU(seed), g = () => Math.sqrt(-2 * Math.log(u() + 1e-12)) * Math.cos(2 * Math.PI * u()), P = [], lab = [];
  for (const [r, m, c] of [[1, 30, 0], [3, 90, 1]]) for (let i = 0; i < m; i++) { const t = 2 * Math.PI * u(); P.push([r * Math.cos(t) + 0.1 * g(), r * Math.sin(t) + 0.1 * g()]); lab.push(c); }
  return { P, lab };
}
const agree = (a, b) => { const m = a.filter((v, i) => v === b[i]).length / a.length; return Math.max(m, 1 - m); };
function kmeans2(P) {
  let c = [P[0], P.reduce((f, p) => (Math.hypot(p[0] - P[0][0], p[1] - P[0][1]) > Math.hypot(f[0] - P[0][0], f[1] - P[0][1]) ? p : f), P[0])], lab = [];
  for (let it = 0; it < 50; it++) {
    lab = P.map((p) => (Math.hypot(p[0] - c[0][0], p[1] - c[0][1]) <= Math.hypot(p[0] - c[1][0], p[1] - c[1][1]) ? 0 : 1));
    c = [0, 1].map((k) => { const Q = P.filter((_, i) => lab[i] === k); return Q.length ? [Q.reduce((s, p) => s + p[0], 0) / Q.length, Q.reduce((s, p) => s + p[1], 0) / Q.length] : c[k]; });
  }
  return lab;
}
function demoRings(el) {
  el.innerHTML = `<div class="la-ctrl">${slider("width σ", 0.2, 1.2, 0.05, 0.5)}</div><div class="la-ctrl"><button class="cbtn la-new">new random rings</button></div>
    <div style="display:flex;flex-wrap:wrap;gap:12px"><div class="la-fig la-km" style="flex:1;min-width:200px"></div><div class="la-fig la-sp" style="flex:1;min-width:200px"></div></div><div class="la-show"></div>`;
  let seed = 7, data = ringsData(seed), sig = 0.5;
  const plot = (box, lab, title) => {
    const X = (x) => 120 + 33 * x, Y = (y) => 125 - 33 * y;
    box.innerHTML = `<svg viewBox="0 0 240 255" style="width:100%;max-width:250px;display:block;margin:auto"><text x="120" y="250" text-anchor="middle" font-size="12" fill="var(--stone)">${title}</text>${data.P.map((p, i) => `<circle cx="${X(p[0]).toFixed(1)}" cy="${Y(p[1]).toFixed(1)}" r="3.2" fill="${lab[i] ? "var(--amber)" : "var(--teal)"}"/>`).join("")}</svg>`;
  };
  const run = () => {
    const { P, lab } = data, n = P.length, W = P.map((p) => P.map((q) => Math.exp(-((p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2) / (2 * sig * sig))));
    W.forEach((r, i) => { r[i] = 0; });
    const L = W.map((r, i) => r.map((v, j) => (i === j ? r.reduce((s, t) => s + t, 0) : -v)));
    const { vals, vecs } = symEig(L), sp = vecs[1].map((t) => (t >= 0 ? 1 : 0)), km = kmeans2(P);
    plot(el.querySelector(".la-km"), km, `k-means: ${num(agree(km, lab), 3)} agree`);
    plot(el.querySelector(".la-sp"), sp, `Fiedler signs: ${num(agree(sp, lab), 3)} agree`);
    const gap = vals[2] / Math.max(vals[1], 1e-12);
    el.querySelector(".la-show").innerHTML = `<p>${n} points · smallest eigenvalues ${vals.slice(0, 4).map((t) => num(r4(t), 4)).join(", ")}</p>
      <p>λ₃/λ₂ = ${num(gap, 2)}: ${gap > 3 ? "a clear gap, two nearly separate pieces" : '<b class="NO">no clear gap: do not trust the split</b>'}</p>
      <p class="la-log">These rings are drawn in the browser with their own random numbers, so the numbers differ slightly from the note.</p>`;
  };
  wireSliders(el, ([s]) => { sig = s; run(); });
  el.querySelector(".la-new").onclick = () => { data = ringsData(++seed); run(); };
}

// ---------- Self-check quiz (from "Check your understanding") ----------

const QUIZ = [
  { q: "What is the Laplacian of the path 1–2–3?", opts: ["[1 −1 0; −1 2 −1; 0 −1 1]", "[0 1 0; 1 0 1; 0 1 0]", "[2 −1 0; −1 2 −1; 0 −1 2]"], a: 0, why: "Degrees 1, 2, 1 on the diagonal, −1 for each edge." },
  { q: "Why is every row sum of L zero?", opts: ["L is symmetric", "the degree on the diagonal equals the number of −1s in the row", "L is positive semidefinite"], a: 1, why: "Each neighbour puts a −1 in the row and adds 1 to the degree." },
  { q: "Laplacian eigenvalues 0, 0, 0, 1.5, 4. How many connected pieces?", opts: ["one", "two", "three"], a: 2, why: "One zero eigenvalue per piece." },
  { q: "“The eigenvector of the largest Laplacian eigenvalue gives the best split.”", opts: ["True", "False"], a: 1, why: "It is the roughest pattern; the smoothest non-constant one, v₂, gives the split." },
  { q: "Why can the Fiedler vector not be the constant vector?", opts: ["it must be perpendicular to 1", "the constant vector is not an eigenvector", "its eigenvalue would be negative"], a: 0, why: "1 is the eigenvector for λ₁ = 0; v₂ is required to be perpendicular to it." },
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
  graph: (el) => demoGraph(el),
  graphMini: (el) => demoGraph(el, { mini: true }),
  rings: (el) => demoRings(el),
  quiz: (el) => demoQuiz(el, QUIZ),
};
