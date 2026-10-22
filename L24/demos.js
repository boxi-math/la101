// Interactive demos for LA101 Lecture 24: complex matrices and the FFT.
// Every code panel is copied from notes/L24-complex-matrices-fft.md (checked by tools/check.py; generated, not retyped); the JS
// recomputes the same numbers so the examples can be changed.

const CODE = {
  length: "import numpy as np\n\n\ndef c(z, k=4):\n    \"\"\"Round a complex array or number for printing (and turn -0.0 into 0.0).\"\"\"\n    z = np.atleast_1d(np.asarray(z, dtype=complex))\n    out = [complex(round(v.real, k) + 0.0, round(v.imag, k) + 0.0) for v in z]\n    return out if len(out) > 1 else out[0]\n\n\nz = np.array([1, 1j])\nprint(c(z @ z), c(np.vdot(z, z)), round(float(np.linalg.norm(z)), 4))\nz2 = np.array([3 + 4j, 1 - 2j])\nprint(c(np.vdot(z2, z2)), c(z2.conj().T @ z2))",
  hermitian: "A = np.array([[2, 1 - 1j], [1 + 1j, 3]])\nx1, x2 = np.array([1 - 1j, -1]), np.array([1 - 1j, 2])\nprint(np.allclose(A, A.conj().T), np.round(np.linalg.eigvalsh(A), 10).tolist())\nprint(c(A @ x1), c(A @ x2), c(4 * x2))\nprint(c(np.vdot(x1, x2)), c(x1 @ x2))",
  unitary: "Rot = np.array([[0, -1], [1, 0]])\nU = np.array([[1, 1], [-1j, 1j]]) / np.sqrt(2)\nprint(np.allclose(U.conj().T @ U, np.eye(2)), np.allclose(Rot @ U[:, 0], 1j * U[:, 0]), np.allclose(Rot @ U[:, 1], -1j * U[:, 1]))\nprint([float(round(abs(v), 10)) for v in np.linalg.eigvals(Rot)])",
  f4: "def fourier(n):\n    w = np.exp(2j * np.pi / n)\n    j, k = np.meshgrid(np.arange(n), np.arange(n), indexing=\"ij\")\n    return w ** (j * k)\n\n\nF4 = fourier(4)\nprint([c(row, 10) for row in F4])\nprint(np.allclose(F4.conj().T @ F4, 4 * np.eye(4)), np.allclose(F4, F4.T), np.allclose(np.linalg.inv(F4), F4.conj() / 4))",
  signal: "x = np.array([2, 1, 0, 1])\ncoef = F4.conj() @ x / 4\nprint(c(coef), np.allclose(F4 @ coef, x))\nprint(np.round(np.cos(2 * np.pi * np.arange(4) / 4) + 1, 10).tolist())",
  sign: "spike = np.array([0, 1, 0, 0])\nprint(c(F4 @ spike), c(np.fft.fft(spike)))\nprint(np.allclose(np.fft.fft(x), F4.conj() @ x), np.allclose(np.fft.ifft(np.fft.fft(x)), x))",
  fft: "def fft_rec(x):\n    \"\"\"Radix-2 FFT with NumPy's sign (e^{-2 pi i/n}); returns (result, number of twiddle multiplications).\"\"\"\n    n = len(x)\n    if n == 1:\n        return np.array(x, dtype=complex), 0\n    e, me = fft_rec(x[0::2])\n    o, mo = fft_rec(x[1::2])\n    t = np.exp(-2j * np.pi * np.arange(n // 2) / n) * o\n    return np.concatenate([e + t, e - t]), me + mo + n // 2\n\n\ny, mults = fft_rec(np.array([2, 1, 0, 1]))\nprint(c(y), mults)\nrng = np.random.default_rng(1)\nsig = rng.normal(size=1024)\ny, mults = fft_rec(sig)\nprint(np.allclose(y, np.fft.fft(sig)), mults, 1024**2, round(1024**2 / mults))",
  cost: "for n in [8, 1024, 2**20]:\n    print(n, n * n, n // 2 * int(np.log2(n)), round(n * n / (n // 2 * np.log2(n))))",
  blur: "n = 8\ncvec = np.zeros(n)\ncvec[[0, 1, n - 1]] = [0.5, 0.25, 0.25]\nCirc = np.array([[cvec[(i - j) % n] for j in range(n)] for i in range(n)])\nbar = np.array([0, 0, 8, 8, 8, 0, 0, 0], dtype=float)\nprint((Circ @ bar).tolist(), (np.round(np.fft.ifft(np.fft.fft(cvec) * np.fft.fft(bar)).real, 10) + 0.0).tolist())\nlam = np.fft.fft(cvec)\nprint(np.round(lam.real, 4).tolist(), np.allclose(lam.imag, 0))\nF8 = fourier(8)\nprint(all(np.allclose(Circ @ F8[:, k], lam[(-k) % n] * F8[:, k]) for k in range(n)))",
  claim: "claim = np.array([1, 1j, -1, -1j]) / 4\nprint(np.allclose(claim, np.fft.fft(spike)), np.allclose(claim, np.fft.fft(spike, norm=\"forward\").conj()))",
};

const OUT = {
  length: "0j (2+0j) 1.4142\n(30+0j) (30+0j)",
  hermitian: "True [1.0, 4.0]\n[(1-1j), (-1+0j)] [(4-4j), (8+0j)] [(4-4j), (8+0j)]\n0j (-2-2j)",
  unitary: "True True True\n[1.0, 1.0]",
  f4: "[[(1+0j), (1+0j), (1+0j), (1+0j)], [(1+0j), 1j, (-1+0j), -1j], [(1+0j), (-1+0j), (1+0j), (-1+0j)], [(1+0j), -1j, (-1+0j), 1j]]\nTrue True True",
  signal: "[(1+0j), (0.5+0j), 0j, (0.5+0j)] True\n[2.0, 1.0, 0.0, 1.0]",
  sign: "[(1+0j), 1j, (-1+0j), -1j] [(1+0j), -1j, (-1+0j), 1j]\nTrue True",
  fft: "[(4+0j), (2+0j), 0j, (2+0j)] 4\nTrue 5120 1048576 205",
  cost: "8 64 12 5\n1024 1048576 5120 205\n1048576 1099511627776 10485760 104858",
  blur: "[0.0, 2.0, 6.0, 8.0, 6.0, 2.0, 0.0, 0.0] [0.0, 2.0, 6.0, 8.0, 6.0, 2.0, 0.0, 0.0]\n[1.0, 0.8536, 0.5, 0.1464, 0.0, 0.1464, 0.5, 0.8536] True\nTrue",
  claim: "False True",
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

// ---------- Demo: eight samples and their frequencies (the DFT, NumPy's sign) ----------

const r3 = (v) => { const x = Math.round(v * 1000) / 1000; return Object.is(x, -0) ? 0 : x; };
const num = (v) => String(r3(v)).replace("-", "−");
const cnum = (re, im) => {
  re = r3(re); im = r3(im);
  if (im === 0) return num(re);
  const i = Math.abs(im) === 1 ? "i" : `${num(Math.abs(im))}i`;
  return re === 0 ? `${im < 0 ? "−" : ""}${i}` : `${num(re)} ${im < 0 ? "−" : "+"} ${i}`;
};

// y_k = sum_m x_m e^{-2 pi i m k / n}: numpy.fft.fft, computed directly (n = 8 is small).
function dft(x) {
  const n = x.length;
  return x.map((_, k) => x.reduce(([re, im], v, m) => [re + v * Math.cos((2 * Math.PI * m * k) / n), im - v * Math.sin((2 * Math.PI * m * k) / n)], [0, 0]));
}

function bars(vals, cls, W = 300, H = 120, lbls = null) {
  const n = vals.length, M = Math.max(4, ...vals.map(Math.abs)), bw = W / n, Y = (v) => H / 2 - (v / M) * (H / 2 - 12);
  let g = `<svg class="la-plane" viewBox="0 0 ${W} ${H + 14}" width="${W}" height="${H + 14}" role="img"><line class="axis" x1="0" y1="${Y(0)}" x2="${W}" y2="${Y(0)}"/>`;
  vals.forEach((v, k) => {
    const y0 = Math.min(Y(0), Y(v)), h = Math.abs(Y(v) - Y(0));
    g += `<rect x="${k * bw + 6}" y="${y0}" width="${bw - 12}" height="${Math.max(h, 0.5)}" class="${cls}" fill-opacity="0.75"/>`;
    g += `<text class="tick" x="${k * bw + bw / 2}" y="${H + 10}">${lbls ? lbls[k] : k}</text>`;
  });
  return g + "</svg>";
}

function demoDFT(el, opts = {}) {
  const start = [0, 0, 8, 8, 8, 0, 0, 0];
  el.innerHTML = (opts.mini ? "" : `<div class="la-ctrl">${start.map((v, m) => slider(`x${m}`, -8, 8, 1, v)).join("")}</div>`) +
    `<div class="la-svgrow"><figure class="fx"></figure><figure class="fy"></figure></div><p class="la-read"></p>`;
  const draw = (x) => {
    const y = dft(x), mag = y.map(([re, im]) => Math.hypot(re, im) / x.length);
    el.querySelector(".fx").innerHTML = bars(x, "A") + `<figcaption>the samples x₀ … x₇</figcaption>`;
    el.querySelector(".fy").innerHTML = bars(mag, "C") + `<figcaption>|fft(x)ₖ| / 8: how much of frequency k</figcaption>`;
    const top = mag.map((v, k) => [v, k]).filter(([v, k]) => k > 0 && k <= 4).sort((p, q) => q[0] - p[0])[0];
    el.querySelector(".la-read").innerHTML = `fft(x) = (${y.map(([re, im]) => cnum(re, im)).join(", ")}). ` +
      `Entry 0 is the sum: average <b class="A">${num(y[0][0] / x.length)}</b>. ` +
      (top && top[0] > 1e-9 ? `The strongest oscillation is frequency <b class="C">${top[1]}</b> (${top[1] === 4 ? "the fastest, + − + −" : `${top[1]} turn${top[1] > 1 ? "s" : ""} in 8 samples`}); frequencies k and 8 − k come in conjugate pairs for real samples.` : `No oscillation: a constant signal.`);
  };
  if (opts.mini) {
    const sets = [[3, 3, 3, 3, 3, 3, 3, 3], [4, 3, 0, -3, -4, -3, 0, 3], [0, 8, 0, 0, 0, 0, 0, 0], [0, 0, 8, 8, 8, 0, 0, 0], [2, -2, 2, -2, 2, -2, 2, -2]];
    let i = 0;
    const tick = () => { draw(sets[i % sets.length]); i++; };
    tick(); setInterval(tick, 2400); return;
  }
  wireSliders(el, draw);
}

// ---------- Demo: a circular blur, its eigenvalues and its effect ----------

function demoBlur(el) {
  el.innerHTML = `<div class="la-ctrl">${slider("centre weight", 0, 1, 0.05, 0.5)}</div><div class="la-svgrow"><figure class="fb"></figure><figure class="fe"></figure></div><p class="la-read"></p>`;
  wireSliders(el, ([w0]) => {
    const s = (1 - w0) / 2, c = [w0, s, 0, 0, 0, 0, 0, s], bar = [0, 0, 8, 8, 8, 0, 0, 0];
    const out = bar.map((_, i) => c.reduce((acc, v, j) => acc + v * bar[(i - j + 8) % 8], 0));
    const lam = dft(c).map(([re]) => re);
    el.querySelector(".fb").innerHTML = bars(out, "A") + `<figcaption>C × (0, 0, 8, 8, 8, 0, 0, 0)</figcaption>`;
    el.querySelector(".fe").innerHTML = bars(lam, "C") + `<figcaption>eigenvalues = fft(first column)</figcaption>`;
    el.querySelector(".la-read").innerHTML = `First column (${c.map(num).join(", ")}). Blurred bar (${out.map(num).join(", ")}). ` +
      `Eigenvalues (${lam.map(num).join(", ")}): the average (k = 0) is kept with λ = 1; the fastest alternation (k = 4) gets λ = <b class="${Math.abs(lam[4]) < 1e-9 ? "HL" : "C"}">${num(lam[4])}</b>.`;
  });
}

// ---------- Self-check quiz (from "Check your understanding") ----------

const QUIZ = [
  { q: "‖z‖ for z = (2i, 1 + i)?", opts: ["√2", "√6", "6"], a: 1, why: "|2i|² + |1 + i|² = 4 + 2 = 6." },
  { q: "[[1, i], [−i, 1]] is Hermitian. Its eigenvalues are", opts: ["real", "purely imaginary", "complex in general"], a: 0,
    why: "a₂₁ = −i is the conjugate of a₁₂ = i; Hermitian matrices have real eigenvalues (here 0 and 2)." },
  { q: "Multiplications for n = 16: FFT vs F₁₆x directly?", opts: ["32 vs 256", "64 vs 256", "16 vs 128"], a: 0, why: "(16/2)·log₂16 = 32 against 16² = 256." },
  { q: "Columns 1 and 3 of F₄: f₁ᵀf₃ = 4. Are they orthogonal?", opts: ["No", "Yes: f₁ᴴf₃ = 0"], a: 1, why: "Complex orthogonality uses the conjugate: 1 − 1 + 1 − 1 = 0." },
  { q: "numpy.fft.fft(x) equals", opts: ["F x with w = e^{2πi/n}", "the conjugate matrix times x", "F x / n"], a: 1,
    why: "NumPy uses e^{−2πi/n}: F̄x, with no 1/n; ifft divides by n." },
];

const DEMOS = {
  dft: (el) => demoDFT(el),
  dftMini: (el) => demoDFT(el, { mini: true }),
  blur: (el) => demoBlur(el),
  quiz: (el) => demoQuiz(el, QUIZ),
};
