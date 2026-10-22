// Interactive demos for LA101 Lecture 5. Transposes, permutations and subspaces: the café table, shuffling, closure tests.
// Every code panel is copied from notes/L05-transpose-spaces.md (checked by tools/check.py); the JS recomputes the same
// numbers so the examples can be changed.

const CODE = {
  table: "import numpy as np\n\nX = np.array([[12, 30, 5], [8, 25, 9], [15, 28, 4], [10, 35, 6]])\nprint(X.shape, X.T.shape)\nprint(X.T.tolist())\nprint(X[3, 1], X.T[1, 3], bool(np.array_equal(X.T.T, X)))",
  vec: "v = np.array([2, 3, 4])\nprint(v.shape, v.T.shape, v.reshape(3, 1).shape, v.reshape(3, 1).T.shape)",
  dot: "p = np.array([[2], [3], [4]])\nmonday = X[0].reshape(3, 1)\nprint((monday.T @ p).tolist(), (monday @ p.T).shape)\nprint((X @ p).ravel().tolist())",
  product: "B = np.array([[2, 1], [3, 1], [4, 2]])\nprint((X @ B).tolist())\nprint(bool(np.array_equal((X @ B).T, B.T @ X.T)))\ntry:\n    X.T @ B.T\nexcept ValueError as error:\n    print(\"ValueError:\", X.T.shape, \"times\", B.T.shape, \"does not fit\")",
  invT: "F = np.array([[3, 1], [2, 1]])\nFinv = np.array([[1, -1], [-2, 3]])\nprint((F.T @ Finv.T).tolist())",
  meaning: "x = np.array([1, 2, 0])\ny = np.array([1, 0, 0, 2])\nprint(int((X @ x) @ y), int(x @ (X.T @ y)))",
  gram: "G = X.T @ X\nprint(G.tolist())\nprint(bool(np.array_equal(G, G.T)), (X @ X.T).shape, bool(np.array_equal(X @ X.T, (X @ X.T).T)))\nprint(int(X[:, 0] @ X[:, 1]), G[0, 1])",
  symq: "A2 = np.array([[1, 2], [0, 1]])\nfor M in [A2 + A2.T, A2.T @ A2, A2 @ A2]:\n    print(M.tolist(), bool(np.array_equal(M, M.T)))",
  perm: "rng = np.random.default_rng(2)\nperm = rng.permutation(4)\nP = np.eye(4, dtype=int)[perm]\nprint(perm.tolist())\nprint(P.tolist())\nprint(bool(np.array_equal(P @ X, X[perm])))",
  undo: "print((P.T @ P).tolist())\nprint(bool(np.array_equal(P.T @ (P @ X), X)), np.argsort(perm).tolist())",
  labels: "weather = np.array([1, 0, 1, 1])\nother = np.random.default_rng(6).permutation(4)\nprint(perm.tolist(), other.tolist())\nprint(list(zip(X[perm][:, 1].tolist(), weather[perm].tolist())))\nprint(list(zip(X[perm][:, 1].tolist(), weather[other].tolist())))",
  closure: "def closure_test(sample, member, trials=200, seed=0):\n    \"\"\"Return a combination that leaves the set, or None if none was found.\"\"\"\n    r = np.random.default_rng(seed)\n    for _ in range(trials):\n        v, w = sample(r), sample(r)\n        c, d = r.integers(-3, 4, size=2)\n        if not member(c * v + d * w):\n            return v.tolist(), w.tolist(), int(c), int(d)\n    return None\n\n\ndef plane(r):\n    x, y = r.integers(-5, 6, size=2)\n    return np.array([x, y, x + y])\n\n\ndef quadrant(r):\n    return r.integers(0, 6, size=2)\n\n\ndef axes(r):\n    t = r.integers(1, 6)\n    return np.array([t, 0]) if r.random() < 0.5 else np.array([0, t])\n\n\nprint(closure_test(plane, lambda u: u[2] == u[0] + u[1]))\nprint(closure_test(quadrant, lambda u: bool(np.all(u >= 0))))\nprint(closure_test(axes, lambda u: u[0] == 0 or u[1] == 0))",
  claim: "try:\n    claimed = X.T @ B.T\nexcept ValueError:\n    print(\"X.T @ B.T does not fit:\", X.T.shape, B.T.shape)\nprint(\"(X @ B).T has shape\", (X @ B).T.shape, \"and equals B.T @ X.T:\", bool(np.array_equal((X @ B).T, B.T @ X.T)))",
};

const OUT = {
  table: "(4, 3) (3, 4)\n[[12, 8, 15, 10], [30, 25, 28, 35], [5, 9, 4, 6]]\n35 35 True",
  vec: "(3,) (3,) (3, 1) (1, 3)",
  dot: "[[134]] (3, 3)\n[134, 127, 130, 149]",
  product: "[[134, 52], [127, 51], [130, 51], [149, 57]]\nTrue\nValueError: (3, 4) times (2, 3) does not fit",
  invT: "[[1, 0], [0, 1]]",
  meaning: "232 232",
  gram: "[[533, 1330, 252], [1330, 3534, 697], [252, 697, 158]]\nTrue (4, 4) True\n1330 1330",
  symq: "[[2, 2], [2, 2]] True\n[[1, 2], [2, 5]] True\n[[1, 4], [0, 1]] False",
  perm: "[3, 2, 0, 1]\n[[0, 0, 0, 1], [0, 0, 1, 0], [1, 0, 0, 0], [0, 1, 0, 0]]\nTrue",
  undo: "[[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]\nTrue [2, 3, 1, 0]",
  labels: "[3, 2, 0, 1] [0, 3, 1, 2]\n[(35, 1), (28, 1), (30, 1), (25, 0)]\n[(35, 1), (28, 1), (30, 0), (25, 1)]",
  closure: "None\n([5, 3], [3, 1], -1, -3)\n([2, 0], [0, 5], 2, -2)",
  claim: "X.T @ B.T does not fit: (3, 4) (2, 3)\n(X @ B).T has shape (2, 4) and equals B.T @ X.T: True",
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

// ---------- Demo: the transpose (and A^T A) ----------

const tr = (M) => M[0].map((_, j) => M.map((r) => r[j]));

function demoTranspose(el, opts = {}) {
  el.innerHTML = (opts.mini ? "" : `<div class="la-ctrl la-grid"><label>A = <input class="la-in" style="width:16em" value="12 30 5; 8 25 9; 15 28 4; 10 35 6"></label></div>
    <div class="la-btns"><button class="cbtn ata">show AᵀA</button></div>`) +
    `<div class="la-eq la-show"></div><p class="la-log"></p>`;
  const inp = el.querySelector("input");
  let cell = [0, 0], showAtA = false;
  const draw = () => {
    const A = opts.mini ? [[12, 30, 5], [8, 25, 9], [15, 28, 4], [10, 35, 6]] : parseMat(inp.value);
    const show = el.querySelector(".la-show"), log = el.querySelector(".la-log");
    if (!okMat(A)) { show.innerHTML = ""; log.innerHTML = "Type whole numbers, rows separated by ';'."; return; }
    const m = A.length, n = A[0].length;
    const [i, j] = [cell[0] % m, cell[1] % n];
    const T = tr(A);
    show.innerHTML = `A = ${matHTML(A, { hlCells: [[i, j]] })} Aᵀ = ${matHTML(T, { hlCells: [[j, i]] })}` +
      (showAtA ? ` AᵀA = ${matHTML(mmul(T, A))}` : "");
    log.innerHTML = `A is ${m}×${n}, Aᵀ is ${n}×${m}. Entry (${i + 1}, ${j + 1}) of A = entry (${j + 1}, ${i + 1}) of Aᵀ = <b>${sgn(A[i][j])}</b>.` +
      (showAtA ? ` AᵀA is ${n}×${n} and symmetric: entry (i, j) is column i · column j of A.` : " Click an entry of A.");
    show.querySelectorAll("table")[0].querySelectorAll("td").forEach((td, k) => {
      td.style.cursor = "pointer";
      td.onclick = () => { cell = [Math.floor(k / n), k % n]; draw(); };
    });
  };
  if (opts.mini) { let k = 0; draw(); setInterval(() => { k++; cell = [k % 4, Math.floor(k / 4) % 3]; draw(); }, 1500); return; }
  el.querySelector(".ata").onclick = (e) => { showAtA = !showAtA; e.target.classList.toggle("on", showAtA); draw(); };
  inp.addEventListener("input", draw);
  draw();
}

// ---------- Demo: which order fits? ----------

function demoShapes(el) {
  el.innerHTML = `<div class="la-ctrl">${slider("m", 1, 6, 1, 4)}${slider("n", 1, 6, 1, 3)}${slider("p", 1, 6, 1, 2)}</div>
    <div class="la-show"></div>`;
  wireSliders(el, ([m, n, p]) => {
    const fit = (a, b) => (a[1] === b[0] ? `<b class="C">${a[0]}×${b[1]}</b>` : `<b class="NO">does not fit</b>`);
    const A = [m, n], B = [n, p], At = [n, m], Bt = [p, n];
    el.querySelector(".la-show").innerHTML = `<p>A is ${m}×${n}, B is ${n}×${p}, so AB is ${m}×${p} and (AB)ᵀ is <b>${p}×${m}</b>.</p>
      <p>Bᵀ Aᵀ = (${p}×${n})(${n}×${m}): ${fit(Bt, At)}</p>
      <p>Aᵀ Bᵀ = (${n}×${m})(${p}×${n}): ${fit(At, Bt)}${At[1] === Bt[0] ? (n === p && m === n ? " — it fits here only because the matrices are square, and it is still not (AB)ᵀ in general" : ` — it fits, but its shape ${n}×${n} is not ${p}×${m}`) : ""}</p>`;
  });
}

// ---------- Demo: shuffle the days, then undo ----------

const DAYS = ["Mon", "Tue", "Wed", "Thu"];
const CAFE = [[12, 30, 5], [8, 25, 9], [15, 28, 4], [10, 35, 6]];
const WEATHER = ["sunny", "rainy", "sunny", "sunny"];

function randPerm(n) {
  const a = [...Array(n).keys()];
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function demoShuffle(el) {
  el.innerHTML = `<div class="la-btns"><button class="cbtn sh">Shuffle</button><button class="cbtn un">Undo with Pᵀ</button>
    <button class="cbtn bad">Shuffle labels separately</button></div><div class="la-eq la-show"></div><p class="la-log"></p>`;
  let perm = [3, 2, 0, 1], lab = [3, 2, 0, 1], undone = false;
  const draw = () => {
    const P = perm.map((k) => DAYS.map((_, j) => (j === k ? 1 : 0)));
    const rows = undone ? [0, 1, 2, 3] : perm, lrows = undone ? [0, 1, 2, 3] : lab;
    const data = rows.map((k) => CAFE[k]);
    const table = `<table class="la-mat">${rows.map((k, i) => `<tr><td>${DAYS[k]}</td>${data[i].map((v) => `<td>${v}</td>`).join("")}<td class="${lrows[i] === k ? "" : "z"}">${WEATHER[lrows[i]]}</td></tr>`).join("")}</table>`;
    el.querySelector(".la-show").innerHTML = `P = ${matHTML(P)} ${undone ? "PᵀPX = X:" : "PX:"} ${table}`;
    const wrong = rows.some((k, i) => lrows[i] !== k);
    el.querySelector(".la-log").innerHTML = undone ? "PᵀP = I: every day is back in its place." :
      `perm = (${perm.join(", ")}): row i of PX is row perm[i] of X.` + (wrong ? ` <b class="NO">The labels used a different shuffle: red days carry another day's weather.</b>` : " Labels shuffled with the same P.");
  };
  el.querySelector(".sh").onclick = () => { perm = randPerm(4); lab = perm.slice(); undone = false; draw(); };
  el.querySelector(".un").onclick = () => { undone = true; lab = perm.slice(); draw(); };
  el.querySelector(".bad").onclick = () => { perm = randPerm(4); do { lab = randPerm(4); } while (lab.every((v, i) => v === perm[i])); undone = false; draw(); };
  draw();
}

// ---------- Demo: closure test ----------

const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const SETS = {
  "line y = 2x": { sample: () => { const t = ri(-5, 5); return [t, 2 * t]; }, member: ([x, y]) => y === 2 * x, sub: true },
  "line y = x + 1": { sample: () => { const t = ri(-5, 5); return [t, t + 1]; }, member: ([x, y]) => y === x + 1, sub: false },
  "quarter x ≥ 0, y ≥ 0": { sample: () => [ri(0, 5), ri(0, 5)], member: ([x, y]) => x >= 0 && y >= 0, sub: false },
  "the two axes": { sample: () => (Math.random() < 0.5 ? [ri(1, 5), 0] : [0, ri(1, 5)]), member: ([x, y]) => x === 0 || y === 0, sub: false },
  "plane z = x + y (in R³)": { sample: () => { const x = ri(-5, 5), y = ri(-5, 5); return [x, y, x + y]; }, member: ([x, y, z]) => z === x + y, sub: true },
};

function demoClosure(el) {
  el.innerHTML = `<div class="la-btns">${Object.keys(SETS).map((k, i) => `<button class="cbtn set" data-k="${i}">${k}</button>`).join("")}</div>
    <div class="la-btns"><button class="cbtn run">Run 200 random tests</button></div><div class="la-show"></div><p class="la-log"></p>`;
  let name = Object.keys(SETS)[0];
  const run = () => {
    const S = SETS[name];
    el.querySelectorAll(".set").forEach((b) => b.classList.toggle("on", b.textContent === name));
    for (let t = 1; t <= 200; t++) {
      const v = S.sample(), w = S.sample(), c = ri(-3, 3), d = ri(-3, 3);
      const u = v.map((vi, i) => c * vi + d * w[i]);
      if (!S.member(u)) {
        el.querySelector(".la-show").innerHTML = `<p><b class="NO">Test ${t} failed:</b> ${sgn(c)}·(${v.map(sgn).join(", ")}) ${d < 0 ? "−" : "+"} ${Math.abs(d)}·(${w.map(sgn).join(", ")}) = (${u.map(sgn).join(", ")}), not in the set.</p>`;
        el.querySelector(".la-log").innerHTML = `One counterexample: <b>${name}</b> is not a subspace.`;
        return;
      }
    }
    el.querySelector(".la-show").innerHTML = `<p><b class="C">200 tests passed.</b></p>`;
    el.querySelector(".la-log").innerHTML = S.sub ? "Passing proves nothing by itself, but here the algebra in the notes proves closure: a subspace." : "Lucky draws: run again.";
  };
  el.querySelectorAll(".set").forEach((b) => { b.onclick = () => { name = b.textContent; run(); }; });
  el.querySelector(".run").onclick = run;
  run();
}

// ---------- Self-check quiz (from "Check your understanding") ----------

const QUIZ = [
  { q: "A is 5×2. What is the shape of AᵀA?", opts: ["5×5", "2×2", "2×5"], a: 1, why: "Aᵀ is 2×5, times A (5×2) gives 2×2. AAᵀ would be 5×5." },
  { q: "(AB)ᵀ equals…", opts: ["AᵀBᵀ", "BᵀAᵀ", "BA"], a: 1, why: "The order reverses; for non-square shapes AᵀBᵀ usually does not even fit." },
  { q: "Is XᵀX symmetric for every data matrix X?", opts: ["Yes", "Only if X is square", "Only if X is symmetric"], a: 0, why: "(XᵀX)ᵀ = Xᵀ(Xᵀ)ᵀ = XᵀX, for any shape of X." },
  { q: "P is a permutation matrix. P⁻¹ = …", opts: ["P", "Pᵀ", "−P"], a: 1, why: "Each column of P is a different column of I, so PᵀP = I. (P⁻¹ = P only for a swap of two rows or the identity.)" },
  { q: "Is the line y = 2x + 3 a subspace of R²?", opts: ["Yes", "No"], a: 1, why: "It does not contain (0, 0); every subspace does." },
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
  transpose: (el) => demoTranspose(el),
  transposeMini: (el) => demoTranspose(el, { mini: true }),
  shapes: (el) => demoShapes(el),
  shuffle: (el) => demoShuffle(el),
  closure: (el) => demoClosure(el),
  quiz: (el) => demoQuiz(el, QUIZ),
};
