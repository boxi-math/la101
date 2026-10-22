// Interactive demos for LA101 Lecture 19. Diagonalization and powers.
// Every code panel is copied from notes/L19-diagonalization-powers.md (checked by tools/check.py); the JS recomputes the same
// numbers so the examples can be changed.

const CODE = {
  play: "import numpy as np\n\nA = np.array([[3, 1], [2, 2]])\nu = np.array([1, 0])\nfor k in range(1, 7):\n    u = A @ u\n    print(k, u.tolist(), round(u[0] / u[1], 4))",
  eigpairs: "for lam, x in [(4, np.array([1, 1])), (1, np.array([1, -2]))]:\n    print(lam, (A @ x).tolist(), (lam * x).tolist())",
  diag: "X = np.array([[1, 1], [1, -2]])\nLam = np.diag([4, 1])\nXinv = np.linalg.inv(X)\nprint((A @ X).tolist(), (X @ Lam).tolist())\nprint(np.round(Xinv * 3, 10).tolist(), bool(np.allclose(X @ Lam @ Xinv, A)))",
  closed: "c = Xinv @ np.array([1, 0])\nprint(np.round(c * 3, 10).tolist())\nu = (1, 0)\nok = True\nfor k in range(1, 21):\n    u = (3 * u[0] + u[1], 2 * u[0] + 2 * u[1])\n    ok = ok and u == ((2 * 4**k + 1) // 3, (2 * 4**k - 2) // 3)\nprint(ok, u)",
  entries: "print((A ** 2).tolist(), np.linalg.matrix_power(A, 2).tolist())\nprint(np.linalg.matrix_power(A, 10).tolist(), np.round(X @ np.diag([4**10, 1]) @ Xinv, 6).tolist())",
  swap: "Xs = X[:, ::-1]\nprint(np.round(Xs @ Lam @ np.linalg.inv(Xs), 10).tolist(), bool(np.allclose(Xs @ np.diag([1, 4]) @ np.linalg.inv(Xs), A)))",
  shear: "H = np.array([[1, 1], [0, 1]])\nprint([np.linalg.matrix_power(H, k).tolist() for k in [2, 3, 10]])\nprint(int(np.linalg.matrix_rank(H - np.eye(2))), int(np.linalg.matrix_rank(np.eye(2) - np.eye(2))))",
  recur: "a = [0, 1]\nfor k in range(2, 13):\n    a.append(2 * a[-1] + 3 * a[-2])\nprint(a)\nprint(all(a[k] == (3**k - (-1) ** k) // 4 for k in range(13)), round(a[12] / a[11], 6))\nprint(sorted(np.round(np.linalg.eigvals(np.array([[2, 3], [1, 0]])).real, 10).tolist()))",
  pop: "L = np.array([[0, 6], [0.5, 0.5]])\nprint(sorted(np.round(np.linalg.eigvals(L).real, 10).tolist()), (L @ np.array([3, 1])).tolist(), (L @ np.array([4, -1])).tolist())\np = np.array([0.0, 10.0])\nfor k in range(1, 13):\n    p = L @ p\n    if k in (1, 2, 3, 6, 12):\n        print(k, np.round(p, 1).tolist(), round(p[0] / p[1], 4))",
  rnn: "W1 = np.array([[0.8, 0.3], [0.3, 0.8]])\nW2 = np.array([[0.7, 0.2], [0.2, 0.7]])\nh0 = np.array([1.0, 0.0])\nfor W in (W1, W2):\n    print(sorted(np.round(np.linalg.eigvals(W).real, 10).tolist()), [round(float(np.linalg.norm(np.linalg.matrix_power(W, k) @ h0)), 4) for k in (10, 50)])",
  cyu: "print(np.linalg.matrix_power(np.diag([2.0, 0.5]), 10).diagonal().tolist(), sorted(np.round(np.linalg.eigvals(np.array([[1, 6], [1, 0]])).real, 10).tolist()))",
  claim: "loop = [1, 3, 11, 43]\nclaimed = [(4**k + 2) / 3 for k in range(4)]\nours = [(2 * 4**k + 1) / 3 for k in range(4)]\nprint(claimed, ours, loop)",
};

const OUT = {
  play: "1 [3, 2] 1.5\n2 [11, 10] 1.1\n3 [43, 42] 1.0238\n4 [171, 170] 1.0059\n5 [683, 682] 1.0015\n6 [2731, 2730] 1.0004",
  eigpairs: "4 [4, 4] [4, 4]\n1 [1, -2] [1, -2]",
  diag: "[[4, 1], [4, -2]] [[4, 1], [4, -2]]\n[[2.0, 1.0], [1.0, -1.0]] True",
  closed: "[2.0, 1.0]\nTrue (733007751851, 733007751850)",
  entries: "[[9, 1], [4, 4]] [[11, 5], [10, 6]]\n[[699051, 349525], [699050, 349526]] [[699051.0, 349525.0], [699050.0, 349526.0]]",
  swap: "[[2.0, -1.0], [-2.0, 3.0]] True",
  shear: "[[[1, 2], [0, 1]], [[1, 3], [0, 1]], [[1, 10], [0, 1]]]\n1 0",
  recur: "[0, 1, 2, 7, 20, 61, 182, 547, 1640, 4921, 14762, 44287, 132860]\nTrue 2.999977\n[-1.0, 3.0]",
  pop: "[-1.5, 2.0] [6.0, 2.0] [-6.0, 1.5]\n1 [60.0, 5.0] 12.0\n2 [30.0, 32.5] 0.9231\n3 [195.0, 31.2] 6.24\n6 [901.9, 414.5] 2.1757\n12 [67992.9, 23961.8] 2.8376",
  rnn: "[0.5, 1.1] [1.8341, 83.0079]\n[0.5, 0.9] [0.2466, 0.0036]",
  cyu: "[1024.0, 0.0009765625] [-2.0, 3.0]",
  claim: "[1.0, 2.0, 6.0, 22.0] [1.0, 3.0, 11.0, 43.0] [1, 3, 11, 43]",
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

// ---------- Demo: the game economy, turn by turn and all at once ----------

function demoGame(el, opts = {}) {
  el.innerHTML = `${opts.mini ? "" : `<div class="la-ctrl">${slider("turn k", 0, 20, 1, 6)}</div>`}<div class="la-show"></div>`;
  const draw = (k) => {
    let g = 1n, m = 0n;
    for (let i = 0; i < k; i++) [g, m] = [3n * g + m, 2n * g + 2n * m];
    const p = 4n ** BigInt(k), fg = (2n * p + 1n) / 3n, fm = (2n * p - 2n) / 3n;
    const big = (x) => x.toLocaleString("en-US");
    el.querySelector(".la-show").innerHTML = `<p><b>loop</b> (k turns of A): gold ${big(g)}, gems ${big(m)}</p>
      <p><b>formula</b> g = (2·4<sup>${k}</sup> + 1)/3 = ${big(fg)}, m = (2·4<sup>${k}</sup> − 2)/3 = ${big(fm)} ${fg === g && fm === m ? '<b class="C">— equal</b>' : '<b class="NO">— differ</b>'}</p>
      <p class="la-log">gold − gems = ${big(g - m)} (the λ = 1 part never grows); growth per turn → 4 (the λ = 4 part)</p>`;
  };
  if (opts.mini) { let k = 0; draw(k); setInterval(() => { k = (k + 1) % 13; draw(k); }, 1100); return; }
  wireSliders(el, ([k]) => draw(k));
}

// ---------- Demo: diagonalize any 2-by-2 matrix and power it ----------

function demoDiag(el) {
  el.innerHTML = `<div class="la-ctrl la-grid"><label>A = <input class="la-in" value="3 1; 2 2"></label></div>
    <div class="la-ctrl">${slider("power k", 1, 12, 1, 3)}</div><div class="la-show"></div>`;
  const inp = el.querySelector("input");
  let k = 3;
  const mtx = (M) => `[${M.map((r) => r.map((v) => num(v, 3)).join(" ")).join("; ")}]`;
  const draw = () => {
    const A = parseNumMat(inp.value), show = el.querySelector(".la-show");
    if (!ok2(A)) { show.innerHTML = "Type a 2-by-2 matrix: two rows separated by ';'."; return; }
    const e = eig2(A), Ak = mpow(A, k);
    if (e.complex) { show.innerHTML = `<p>λ = ${num(e.re)} ± ${num(e.im)}i: complex. Diagonalizable over complex numbers, but not with real X.</p><p>A<sup>${k}</sup> = ${mtx(Ak)}</p>`; return; }
    const [x1, x2] = e.vecs;
    if (!x1 || !x2 || Math.abs(x1[0] * x2[1] - x1[1] * x2[0]) < 1e-9) {
      show.innerHTML = x1 ? `<p><b class="NO">Not diagonalizable:</b> λ = ${num(e.lams[0])} twice, one line of eigenvectors ${vecTxt(x1)}. X would not be invertible.</p><p>A<sup>${k}</sup> = ${mtx(Ak)}</p>` :
        `<p>A = ${num(e.lams[0])}·I is diagonal already: every vector is an eigenvector.</p>`;
      return;
    }
    const X = [[x1[0], x2[0]], [x1[1], x2[1]]], dt = X[0][0] * X[1][1] - X[0][1] * X[1][0];
    const Xi = [[X[1][1] / dt, -X[0][1] / dt], [-X[1][0] / dt, X[0][0] / dt]];
    const F = mm(mm(X, [[e.lams[0] ** k, 0], [0, e.lams[1] ** k]]), Xi);
    const okk = F.every((r, i) => r.every((v, j) => Math.abs(v - Ak[i][j]) < 1e-6 * (1 + Math.abs(v))));
    show.innerHTML = `<p>X = ${mtx(X)} &nbsp; Λ = diag(${num(e.lams[0])}, ${num(e.lams[1])}) &nbsp; X⁻¹ = ${mtx(Xi)}</p>
      <p>XΛ<sup>${k}</sup>X⁻¹ = ${mtx(F)}</p><p>A·A·…·A (${k} times) = ${mtx(Ak)} ${okk ? '<b class="C">— equal</b>' : '<b class="NO">— differ</b>'}</p>`;
  };
  inp.addEventListener("input", draw);
  wireSliders(el, ([v]) => { k = v; draw(); });
}

// ---------- Demo: young and adults ----------

function demoPop(el) {
  el.innerHTML = `<div class="la-ctrl">${slider("young per adult", 0, 8, 0.5, 6)}${slider("young who become adults", 0, 1, 0.05, 0.5)}${slider("adults who survive", 0, 1, 0.05, 0.5)}</div><div class="la-show"></div>`;
  wireSliders(el, ([b, s, a]) => {
    const L = [[0, b], [s, a]], e = eig2(L);
    let p = [0, 10];
    const rows = [];
    for (let k = 1; k <= 12; k++) { p = mv(L, p); if ([1, 2, 3, 6, 12].includes(k)) rows.push(`year ${k}: ${vecTxt(p, 1)}${p[1] > 1e-9 ? `, ratio ${num(p[0] / p[1], 2)}` : ""}`); }
    const lam = e.complex ? null : e.lams[0];
    el.querySelector(".la-show").innerHTML = `<p>${e.complex ? "complex eigenvalues" : `largest λ = <b>${num(lam, 3)}</b>: ${lam > 1 ? "the population grows" : lam < 1 ? "it dies out" : "it stays the same size"} (×${num(lam, 3)} a year)${b > 0 && lam > 0 ? `, long-run ratio ${num(b / lam, 3)} young per adult` : ""}`}</p>
      <p class="la-log">${rows.join("<br>")}</p>`;
  });
}

// ---------- Demo: a linear recurrent network explodes or vanishes ----------

function demoRNN(el) {
  el.innerHTML = `<div class="la-ctrl">${slider("largest eigenvalue of W", 0.5, 1.3, 0.05, 1.1)}${slider("steps k", 1, 80, 1, 50)}</div><div class="la-show"></div>`;
  wireSliders(el, ([l, k]) => {
    const W = [[(l + 0.5) / 2, (l - 0.5) / 2], [(l - 0.5) / 2, (l + 0.5) / 2]];
    let h = [1, 0];
    for (let i = 0; i < k; i++) h = mv(W, h);
    const n = Math.hypot(...h);
    el.querySelector(".la-show").innerHTML = `<p>W = [${W.map((r) => r.map((v) => num(v, 3)).join(" ")).join("; ")}] has eigenvalues ${num(l, 2)} along (1, 1) and 0.5 along (1, −1).</p>
      <p>size of h after ${k} steps: <b class="${n > 10 ? "NO" : n < 0.01 ? "C" : ""}">${n > 1e4 || n < 1e-3 ? n.toExponential(2) : num(n, 4)}</b> ${n > 10 ? "— exploding" : n < 0.01 ? "— vanishing" : ""}</p>`;
  });
}

// ---------- Self-check quiz (from "Check your understanding") ----------

const QUIZ = [
  { q: "A = XΛX⁻¹ with Λ = diag(2, 0.5). For large k, A<sup>k</sup>u is dominated by…", opts: ["the λ = 2 part", "the λ = 0.5 part", "neither"], a: 0, why: "2ᵏ grows, 0.5ᵏ fades (as long as u has a component along the λ = 2 eigenvector)." },
  { q: "Is [5 2; 0 3] diagonalizable?", opts: ["Yes", "No", "Only if 2 = 0"], a: 0, why: "Triangular with distinct eigenvalues 5 and 3; distinct eigenvalues give independent eigenvectors." },
  { q: "A³ is…", opts: ["the matrix of cubed entries", "XΛ³X⁻¹"], a: 1, why: "Only a diagonal matrix powers entry by entry." },
  { q: "Eigenvalues of the matrix of a<sub>k+2</sub> = a<sub>k+1</sub> + 6a<sub>k</sub>?", opts: ["3 and −2", "1 and 6", "2 and −3"], a: 0, why: "M = [1 6; 1 0]: λ² − λ − 6 = (λ − 3)(λ + 2)." },
  { q: "Which eigenvalue sets the long-run growth of u<sub>k+1</sub> = Au<sub>k</sub>?", opts: ["the largest in size", "the smallest", "their sum"], a: 0, why: "|λ|ᵏ is largest for the largest |λ|; the others become negligible in comparison." },
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
  game: (el) => demoGame(el),
  gameMini: (el) => demoGame(el, { mini: true }),
  diag: (el) => demoDiag(el),
  pop: (el) => demoPop(el),
  rnn: (el) => demoRNN(el),
  quiz: (el) => demoQuiz(el, QUIZ),
};
