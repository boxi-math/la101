// Interactive demos for LA101 Lecture 18. Eigenvalues and eigenvectors.
// Every code panel is copied from notes/L18-eigenvalues.md (checked by tools/check.py); the JS recomputes the same
// numbers so the examples can be changed.

const CODE = {
  blur: "import numpy as np\n\nB = np.array([[0.75, 0.25], [0.25, 0.75]])\ngrey = np.array([1.0, 1.0])\nedge = np.array([1.0, -1.0])\nx = np.array([3.0, 1.0])\nprint((B @ grey).tolist(), (B @ edge).tolist(), (B @ x).tolist())",
  multiples: "for v, lam in [(grey, 1.0), (edge, 0.5), (np.array([2.0, 2.0]), 1.0), (np.array([-5.0, 5.0]), 0.5)]:\n    print(v.tolist(), lam, bool(np.allclose(B @ v, lam * v)))",
  powers: "for k in [1, 2, 5, 10]:\n    brute = np.linalg.matrix_power(B, k) @ x\n    predicted = 2 * grey + 0.5**k * edge\n    print(k, np.round(brute, 4).tolist(), bool(np.allclose(brute, predicted)))",
  sharpen: "S = np.array([[1.5, -0.5], [-0.5, 1.5]])\nprint((S @ grey).tolist(), (S @ edge).tolist(), (np.linalg.matrix_power(S, 10) @ x).tolist())",
  charpoly: "A = np.array([[4, 1], [2, 3]])\nprint(np.poly(A).tolist(), np.roots(np.poly(A)).tolist())\nfor lam, v in [(5, np.array([1, 1])), (2, np.array([1, -2]))]:\n    print(lam, ((A - lam * np.eye(2, dtype=int)) @ v).tolist(), (A @ v).tolist(), (lam * v).tolist())",
  realeigs: "def real_eigs(M):\n    vals = np.linalg.eigvals(M)\n    assert np.allclose(vals.imag, 0)\n    return sorted(np.round(vals.real, 10).tolist())\n\nprint(real_eigs(A))",
  tri: "T = np.array([[2, 5, 1], [0, 3, 4], [0, 0, -1]])\nprint(real_eigs(T), int(np.trace(T)), round(float(np.prod(real_eigs(T))), 10), round(float(np.linalg.det(T)), 10))",
  elim: "U = np.array([[4, 1], [0, 2.5]])\nprint(real_eigs(A), real_eigs(U))",
  shifts: "v5 = np.array([1, 1])\nprint((A @ A @ v5).tolist(), ((A + 3 * np.eye(2)) @ v5).tolist(), np.round(np.linalg.inv(A) @ v5, 10).tolist())",
  npeig: "vals, vecs = np.linalg.eig(A)\nassert np.allclose(vals.imag, 0) and np.allclose(vecs.imag, 0)\nvals, vecs = vals.real, vecs.real\nprint(np.round(vals, 10).tolist())\nprint(np.round(vecs, 4).tolist())\nfor i in range(2):\n    v = vecs[:, i]\n    print(np.round(v / v[0], 10).tolist(), bool(np.allclose(A @ v, vals[i] * v)))",
  special: "R = np.array([[0, -1], [1, 0]])\nP = np.array([[0.5, 0.5], [0.5, 0.5]])\nH = np.array([[1, 1], [0, 1]])\nprint(np.linalg.eigvals(R).tolist())\nprint(real_eigs(P))\nhv = np.linalg.eig(H).eigenvectors.real\nprint(real_eigs(H), np.round(hv, 6).tolist(), int(np.linalg.matrix_rank(H - np.eye(2))))",
  cyu: "print(np.roots([1, -6, 8]).tolist(), real_eigs(np.array([[7, 2], [0, -3]])))",
  claim: "claimed_v = np.array([1, 2])\nprint((A @ claimed_v).tolist(), (5 * claimed_v).tolist())\nprint(5 + 2 == np.trace(A), 5 * 2 == round(np.linalg.det(A)))",
};

const OUT = {
  blur: "[1.0, 1.0] [0.5, -0.5] [2.5, 1.5]",
  multiples: "[1.0, 1.0] 1.0 True\n[1.0, -1.0] 0.5 True\n[2.0, 2.0] 1.0 True\n[-5.0, 5.0] 0.5 True",
  powers: "1 [2.5, 1.5] True\n2 [2.25, 1.75] True\n5 [2.0312, 1.9688] True\n10 [2.001, 1.999] True",
  sharpen: "[1.0, 1.0] [2.0, -2.0] [1026.0, -1022.0]",
  charpoly: "[1.0, -7.0, 10.0] [5.0, 2.0]\n5 [0, 0] [5, 5] [5, 5]\n2 [0, 0] [2, -4] [2, -4]",
  realeigs: "[2.0, 5.0]",
  tri: "[-1.0, 2.0, 3.0] 4 -6.0 -6.0",
  elim: "[2.0, 5.0] [2.5, 4.0]",
  shifts: "[25, 25] [8.0, 8.0] [0.2, 0.2]",
  npeig: "[5.0, 2.0]\n[[0.7071, -0.4472], [0.7071, 0.8944]]\n[1.0, 1.0] True\n[1.0, -2.0] True",
  special: "[1j, -1j]\n[0.0, 1.0]\n[1.0, 1.0] [[1.0, -1.0], [0.0, 0.0]] 1",
  cyu: "[4.0, 2.0] [-3.0, 7.0]",
  claim: "[6, 8] [5, 10]\nTrue True",
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

const SVGNS = "http://www.w3.org/2000/svg";
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

// ---------- Demo: hunt for eigenvectors (turn x, watch Ax) ----------

const L18_MATS = {
  "blur B": [[0.75, 0.25], [0.25, 0.75]],
  "A = [4 1; 2 3]": [[4, 1], [2, 3]],
  "rotation": [[0, -1], [1, 0]],
  "projection": [[0.5, 0.5], [0.5, 0.5]],
  "shear": [[1, 1], [0, 1]],
};

function demoHunt(el, opts = {}) {
  el.innerHTML = `${opts.mini ? "" : `<div class="la-btns">${Object.keys(L18_MATS).map((k, i) => `<button class="cbtn m${i === 0 ? " on" : ""}">${k}</button>`).join("")}</div>`}
    <div class="la-fig"></div>${opts.mini ? "" : `<div class="la-ctrl">${slider("angle of x (degrees)", 0, 179, 1, 30)}</div>`}<p class="la-read"></p>`;
  let name = "blur B", ang = 30;
  const fig = el.querySelector(".la-fig");
  const draw = () => {
    fig.innerHTML = "";
    const M = L18_MATS[name];
    const big = name.startsWith("A");
    const p = plane(fig, big ? [-6, 6] : [-1.6, 1.6], big ? [-6, 6] : [-1.6, 1.6], { xlabel: "x₁", ylabel: "x₂", height: opts.mini ? 220 : 300 });
    const t = (ang * Math.PI) / 180, x = [Math.cos(t), Math.sin(t)], y = mv(M, x);
    const cross = x[0] * y[1] - x[1] * y[0], lam = x[0] * y[0] + x[1] * y[1];
    const hit = Math.abs(cross) < 0.02;
    p.arrow([0, 0], x, "A", "x");
    p.arrow([0, 0], y, hit ? "HL" : "C", "Ax");
    const e = eig2(M);
    let msg = `x = ${vecTxt(x, 2)}, Ax = ${vecTxt(y, 2)}. `;
    msg += hit ? `<b class="C">Ax is on the line of x: an eigenvector, λ ≈ ${num(lam, 2)}.</b>` : "Ax points elsewhere: turn x until both arrows lie on one line.";
    if (!opts.mini) msg += e.complex ? ` <br>This matrix has complex eigenvalues ${num(e.re, 2)} ± ${num(e.im, 2)}i: no angle works.` :
      e.repeated && e.vecs[0] ? ` <br>λ = ${num(e.lams[0], 2)} twice, but only one line of eigenvectors.` : "";
    el.querySelector(".la-read").innerHTML = msg;
  };
  if (opts.mini) { draw(); setInterval(() => { ang = (ang + 3) % 180; draw(); }, 120); return; }
  el.querySelectorAll(".m").forEach((b) => { b.onclick = () => { el.querySelectorAll(".m").forEach((x) => x.classList.remove("on")); b.classList.add("on"); name = b.textContent; draw(); }; });
  wireSliders(el, ([a]) => { ang = a; draw(); });
}

// ---------- Demo: repeated blur (or sharpen) of the image (3, 1) ----------

function demoBlur(el) {
  el.innerHTML = `<div class="la-btns"><button class="cbtn f on">blur</button><button class="cbtn f">sharpen</button></div>
    <div class="la-ctrl">${slider("number of steps k", 0, 12, 1, 0)}</div><div class="la-show"></div>`;
  let sharp = false, k = 0;
  const draw = () => {
    const M = sharp ? [[1.5, -0.5], [-0.5, 1.5]] : [[0.75, 0.25], [0.25, 0.75]], lam = sharp ? 2 : 0.5;
    let x = [3, 1];
    for (let i = 0; i < k; i++) x = mv(M, x);
    const pred = [2 + lam ** k, 2 - lam ** k];
    const px = (v) => `<span class="la-px" style="display:inline-block;width:2.4em;height:2.4em;border:1px solid var(--line,#999);background:hsl(0,0%,${Math.max(0, Math.min(100, 100 - v * 25))}%)"></span>`;
    el.querySelector(".la-show").innerHTML = `<p>pixels: ${px(x[0])}${px(x[1])} &nbsp; ${sharp ? "S" : "B"}<sup>${k}</sup>(3, 1) = <b>${vecTxt(x)}</b></p>
      <p>eigenvectors: 2·(1, 1) + ${sgn(lam)}<sup>${k}</sup>·(1, −1) = ${vecTxt(pred)} ${Math.hypot(pred[0] - x[0], pred[1] - x[1]) < 1e-6 ? '<b class="C">— the same</b>' : ""}</p>
      <p class="la-log">average ${num((x[0] + x[1]) / 2)} (λ = 1, never changes) · contrast ${num((x[0] - x[1]) / 2)} (λ = ${sgn(lam)}${sharp ? ", doubles" : ", halves"} each step)</p>`;
  };
  el.querySelectorAll(".f").forEach((b) => { b.onclick = () => { el.querySelectorAll(".f").forEach((x) => x.classList.remove("on")); b.classList.add("on"); sharp = b.textContent === "sharpen"; draw(); }; });
  wireSliders(el, ([v]) => { k = v; draw(); });
}

// ---------- Demo: eigenvalues of any 2-by-2 matrix ----------

function demoChar(el) {
  el.innerHTML = `<div class="la-ctrl la-grid"><label>A = <input class="la-in" value="4 1; 2 3"></label></div><div class="la-show"></div>`;
  const inp = el.querySelector("input");
  const draw = () => {
    const M = parseNumMat(inp.value), show = el.querySelector(".la-show");
    if (!ok2(M)) { show.innerHTML = "Type a 2-by-2 matrix: two rows separated by ';'."; return; }
    const e = eig2(M);
    let h = `<p>trace ${num(e.tr)}, determinant ${num(e.det)}: λ² − ${num(e.tr)}λ + ${num(e.det)} = 0</p>`;
    if (e.complex) h += `<p><b class="NO">complex:</b> λ = ${num(e.re)} ± ${num(e.im)}i. No real eigenvector; the sum ${num(2 * e.re)} is the trace, the product ${num(e.re ** 2 + e.im ** 2)} the determinant.</p>`;
    else {
      h += e.lams.map((l, i) => {
        const v = e.vecs[i];
        if (!v) return `<p>λ = ${num(l)}: A − λI = 0, every nonzero vector is an eigenvector.</p>`;
        const Av = mv(M, v);
        return `<p>λ${i ? "₂" : "₁"} = <b>${num(l)}</b>, v = ${vecTxt(v)}: Av = ${vecTxt(Av)} = ${num(l)}·v</p>`;
      }).join("");
      if (e.repeated && e.vecs[0]) h += `<p><b class="NO">repeated eigenvalue:</b> one line of eigenvectors only (like the shear).</p>`;
      h += `<p class="la-log">check: ${num(e.lams[0])} + ${num(e.lams[1])} = ${num(e.tr)} (trace), ${num(e.lams[0])} · ${num(e.lams[1])} = ${num(e.det)} (det)</p>`;
    }
    show.innerHTML = h;
  };
  inp.addEventListener("input", draw);
  draw();
}

// ---------- Self-check quiz (from "Check your understanding") ----------

const QUIZ = [
  { q: "Av = 3v. What is A(10v)?", opts: ["3v", "30v", "10v"], a: 1, why: "A(10v) = 10·Av = 30v: multiples of an eigenvector are eigenvectors with the same eigenvalue." },
  { q: "A 2-by-2 matrix has trace 6 and determinant 8. Its eigenvalues are…", opts: ["2 and 4", "1 and 8", "3 and 3"], a: 0, why: "They add to 6 and multiply to 8: λ² − 6λ + 8 = (λ − 2)(λ − 4)." },
  { q: "Can you read the eigenvalues off U after elimination?", opts: ["Yes, they are the pivots", "No, row operations change them"], a: 1, why: "For A = [4 1; 2 3] the eigenvalues are 5 and 2, but U has 4 and 2.5." },
  { q: "Which can be an eigenvector?", opts: ["the zero vector", "any nonzero vector Av is a multiple of"], a: 1, why: "The zero vector is excluded; the eigenvalue 0 is allowed (then A is singular)." },
  { q: "Eigenvalues of [7 2; 0 −3]?", opts: ["7 and −3", "7 and 2", "5 and −1"], a: 0, why: "Triangular: the eigenvalues are the diagonal entries." },
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
  hunt: (el) => demoHunt(el),
  huntMini: (el) => demoHunt(el, { mini: true }),
  blur: (el) => demoBlur(el),
  char: (el) => demoChar(el),
  quiz: (el) => demoQuiz(el, QUIZ),
};
