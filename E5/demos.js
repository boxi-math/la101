// Interactive demos for LA101 Elective E5: the Jordan form.
// Every code panel is copied from notes/E5-jordan-form.md (checked by tools/check.py; generated, not retyped); the JS
// recomputes the same numbers so the examples can be changed.

const CODE = {
  eig: "import numpy as np\n\nA = np.array([[-1.0, 0.0], [1.0, -1.0]])\nx0 = np.array([4.0, 0.0])\nprint((np.round(np.linalg.eigvals(A).real, 10) + 0.0).tolist(), int(np.linalg.matrix_rank(A + np.eye(2))))",
  series: "def expm_series(M, terms=60):\n    S, term = np.eye(len(M)), np.eye(len(M))\n    for k in range(1, terms):\n        term = term @ M / k\n        S = S + term\n    return S\n\n\nfor t in (0.5, 1.0, 2.0):\n    x = expm_series(A * t) @ x0\n    print(t, np.round(x, 4).tolist(), round(4 * np.exp(-t), 4), round(4 * t * np.exp(-t), 4))\nprint(round(4 / np.e, 4))",
  geo: "def geo(M, lam):\n    n = len(M)\n    return int(n - np.linalg.matrix_rank(M - lam * np.eye(n)))\n\n\nG = np.array([[0.0, -2, -1], [1, 3, 0], [1, 1, 3]])\nH = np.array([[0.0, -2, -2], [1, 3, 1], [1, 1, 3]])\nS = np.array([[2.0, 1, 1], [1, 2, 1], [1, 1, 2]])\nprint([float(np.trace(M)) for M in (G, H)], [round(float(np.linalg.det(M)), 10) for M in (G, H)])\nprint((np.round(np.poly(G), 6) + 0.0).tolist(), (np.round(np.poly(H), 6) + 0.0).tolist())\nprint(\"geometric:\", geo(A, -1), geo(G, 2), geo(H, 2), geo(2 * np.eye(2), 2), geo(S, 1))",
  chains: "M2 = np.array([[0.0, 1.0], [1.0, 0.0]])\nprint((np.linalg.inv(M2) @ A @ M2).tolist())\nN = G - 2 * np.eye(3)\nv1, v2, v3 = np.array([1.0, -1, 0]), np.array([-1.0, 0, 1]), np.array([0.0, 0, 1])\nprint((N @ v1 + 0.0).tolist(), (N @ v2).tolist(), (N @ v3).tolist())\nMG = np.column_stack([v1, v2, v3])\nprint((np.round(np.linalg.inv(MG) @ G @ MG, 10) + 0.0).tolist())",
  hchain: "NH = H - 2 * np.eye(3)\nfor start in ([1.0, -1.0, 0.0], [-2.0, 1.0, 1.0]):\n    aug = np.column_stack([NH, start])\n    print(start, (NH @ start + 0.0).tolist(), int(np.linalg.matrix_rank(NH)), int(np.linalg.matrix_rank(aug)))\nMH = np.column_stack([[-2.0, 1, 1], [1.0, 0, 0], [1.0, -1, 0]])\nprint((np.round(np.linalg.inv(MH) @ H @ MH, 10) + 0.0).tolist())",
  blocks: "def jordan_blocks(M, lam):\n    n = len(M)\n    Nl = M - lam * np.eye(n)\n    r = [int(np.linalg.matrix_rank(np.linalg.matrix_power(Nl, k))) for k in range(n + 2)]\n    at_least = [r[k - 1] - r[k] for k in range(1, n + 2)]\n    sizes = [k for k in range(1, n + 1) for _ in range(at_least[k - 1] - at_least[k])]\n    return r[: n + 1], sorted(sizes, reverse=True)\n\n\nfor name, M in ((\"G\", G), (\"H\", H), (\"S\", S), (\"A\", A)):\n    lam = {\"G\": 2, \"H\": 2, \"S\": 1, \"A\": -1}[name]\n    print(name, lam, *jordan_blocks(M, lam))",
  minpoly: "print(int(np.abs(np.linalg.matrix_power(N, 2)).max()), int(np.abs(np.linalg.matrix_power(N, 3)).max()),\n      int(np.abs(NH @ NH).max()))",
  powers: "J = np.array([[0.9, 1.0], [0.0, 0.9]])\ncorner = [float(np.linalg.matrix_power(J, k)[0, 1]) for k in range(1, 61)]\nprint([round(c, 2) for c in corner[:3]], int(np.argmax(corner)) + 1, round(max(corner), 3))\nprint(round(9 * 0.9**8, 6), round(10 * 0.9**9, 6), round(corner[29], 2), round(corner[49], 2))\nprint([round(float(np.linalg.norm(np.linalg.matrix_power(0.9 * np.eye(2), k), 2)), 3) for k in (1, 9, 30)])",
  expo: "t = 1.5\nJA = np.array([[-1.0, 1.0], [0.0, -1.0]])\nformula = np.exp(-t) * np.array([[1.0, t], [0.0, 1.0]])\nprint(np.allclose(expm_series(JA * t), formula), np.allclose(M2 @ formula @ np.linalg.inv(M2), expm_series(A * t)))\nprint(np.round(M2 @ formula @ np.linalg.inv(M2), 4).tolist(), round(t * np.exp(-t), 4))",
  near: "for b in (1.1, 1.01, 1.001):\n    Ab = np.array([[-1.0, 0.0], [1.0, -b]])\n    w, X = np.linalg.eig(Ab)\n    c = np.linalg.solve(np.array([[b - 1, 0.0], [1.0, 1.0]]), x0)\n    x2 = 4 * (np.exp(-1) - np.exp(-b)) / (b - 1)\n    print(b, round(float(np.linalg.cond(X)), 1), np.round(c, 2).tolist(), round(float(x2), 4))\nprint(round(4 / np.e, 4))",
  fragile: "for n, eps in ((2, 1e-10), (10, 1e-10), (16, 1e-16)):\n    Jn = np.diag(np.ones(n - 1), 1)\n    Je = Jn.copy()\n    Je[-1, 0] = eps\n    lam_e = np.linalg.eigvals(Je)\n    ds = np.abs(np.linalg.svd(Je, compute_uv=False) - np.linalg.svd(Jn, compute_uv=False)).max()\n    print(n, eps, f\"{np.abs(lam_e).max():.3g}\", f\"{eps ** (1 / n):.3g}\", bool(ds <= 1.01 * eps))",
  eigG: "ev = np.linalg.eigvals(G)\nprint(len(set(np.round(ev, 12))), f\"{np.abs(ev - 2).max():.0e}\", f\"{np.finfo(float).eps ** (1 / 3):.0e}\")",
  schur: "Q, _ = np.linalg.qr(MG)\nT = Q.T @ G @ Q\nprint((np.round(T, 4) + 0.0).tolist(), round(float(np.linalg.cond(Q)), 10))\nfor b in (1.1, 1.001, 1.0):\n    Ab = np.array([[-1.0, 0.0], [1.0, -b]])\n    print(b, (M2.T @ Ab @ M2).tolist())",
  cyu: "print(np.linalg.matrix_power(np.array([[2, 1], [0, 2]]), 3).tolist())",
  ex1: "P = np.array([[5.0, 1.0], [-1.0, 3.0]])\nMP = np.column_stack([[1.0, -1.0], [1.0, 0.0]])\nprint(float(np.trace(P)), round(float(np.linalg.det(P)), 10), geo(P, 4), (np.linalg.inv(MP) @ P @ MP + 0.0).tolist())",
  ex2: "print(np.linalg.matrix_power(np.array([[3, 1], [0, 3]]), 4).tolist(), 3**4, 4 * 3**3)",
  ex3: "A3 = np.array([[-1.0, 0, 0], [1, -1, 0], [0, 1, -1]])\nprint(jordan_blocks(A3, -1)[1], round(float((expm_series(A3 * 2.0) @ [4.0, 0, 0])[2]), 4), round(8 / np.e**2, 4))",
  ex4: "N3 = np.diag([1, 1], 1)\nprint((N3 @ N3).tolist(), int(np.abs(np.linalg.matrix_power(N3, 3)).max()))",
  ex5: "J32 = 2 * np.eye(3) + np.diag([1.0, 1.0], 1)\nJp = J32.copy()\nJp[2, 0] = 1e-9\nmoved = np.abs(np.linalg.eigvals(Jp) - 2).max()\ndsv = np.abs(np.linalg.svd(Jp, compute_uv=False) - np.linalg.svd(J32, compute_uv=False)).max()\nprint(f\"{moved:.3g}\", bool(dsv <= 1e-9))",
  ex6: "Jz = np.zeros((5, 5))\nJz[0, 1] = Jz[1, 2] = Jz[3, 4] = 1\nB = np.eye(5)\nB[:4, 4] = 1\nZ = B @ Jz @ np.linalg.inv(B)\nprint(*jordan_blocks(Z, 0))",
  claim: "w, X = np.linalg.eig(G)\nprint(len(set(np.round(w, 12))), bool(abs(np.linalg.det(X)) < 1e-12), bool(np.linalg.cond(X) > 1e8), geo(G, 2))",
};

const OUT = {
  eig: "[-1.0, -1.0] 1",
  series: "0.5 [2.4261, 1.2131] 2.4261 1.2131\n1.0 [1.4715, 1.4715] 1.4715 1.4715\n2.0 [0.5413, 1.0827] 0.5413 1.0827\n1.4715",
  geo: "[6.0, 6.0] [8.0, 8.0]\n[1.0, -6.0, 12.0, -8.0] [1.0, -6.0, 12.0, -8.0]\ngeometric: 1 1 2 2 2",
  chains: "[[-1.0, 1.0], [0.0, -1.0]]\n[0.0, 0.0, 0.0] [1.0, -1.0, 0.0] [-1.0, 0.0, 1.0]\n[[2.0, 1.0, 0.0], [0.0, 2.0, 1.0], [0.0, 0.0, 2.0]]",
  hchain: "[1.0, -1.0, 0.0] [0.0, 0.0, 0.0] 1 2\n[-2.0, 1.0, 1.0] [0.0, 0.0, 0.0] 1 1\n[[2.0, 1.0, 0.0], [0.0, 2.0, 0.0], [0.0, 0.0, 2.0]]",
  blocks: "G 2 [3, 2, 1, 0] [3]\nH 2 [3, 1, 0, 0] [2, 1]\nS 1 [3, 1, 1, 1] [1, 1]\nA -1 [2, 1, 0] [2]",
  minpoly: "1 0 0",
  powers: "[1.0, 1.8, 2.43] 9 3.874\n3.874205 3.874205 1.41 0.29\n[0.9, 0.387, 0.042]",
  expo: "True True\n[[0.2231, 0.0], [0.3347, 0.2231]] 0.3347",
  near: "1.1 20.0 [40.0, -40.0] 1.4003\n1.01 200.0 [400.0, -400.0] 1.4642\n1.001 2000.0 [4000.0, -4000.0] 1.4708\n1.4715",
  fragile: "2 1e-10 1e-05 1e-05 True\n10 1e-10 0.1 0.1 True\n16 1e-16 0.1 0.1 True",
  eigG: "3 1e-05 6e-06",
  schur: "[[2.0, -1.1547, 2.8577], [0.0, 2.0, 2.1213], [0.0, 0.0, 2.0]] 1.0\n1.1 [[-1.1, 1.0], [0.0, -1.0]]\n1.001 [[-1.001, 1.0], [0.0, -1.0]]\n1.0 [[-1.0, 1.0], [0.0, -1.0]]",
  cyu: "[[8, 12], [0, 8]]",
  ex1: "8.0 16.0 1 [[4.0, 1.0], [0.0, 4.0]]",
  ex2: "[[81, 108], [0, 81]] 81 108",
  ex3: "[3] 1.0827 1.0827",
  ex4: "[[0, 0, 1], [0, 0, 0], [0, 0, 0]] 0",
  ex5: "0.001 True",
  ex6: "[5, 3, 1, 0, 0, 0] [3, 2]",
  claim: "3 True True 1",
};
// A code panel followed by its real output (both from the note).
const run = (name) => codeBlock(CODE[name]) + codeBlock(OUT[name], "out");

const fmt = (v) => (Math.abs(v - Math.round(v)) < 1e-9 ? String(Math.round(v)) : v.toFixed(2).replace(/0+$/, "").replace(/\.$/, ""));
const r3 = (v) => { const x = Math.round(v * 1000) / 1000; return Object.is(x, -0) ? 0 : x; };
const num = (v) => String(r3(v)).replace("-", "−");
const sci = (v) => { if (v === 0) return "0"; const e = Math.floor(Math.log10(Math.abs(v)) + 1e-9), m = v / 10 ** e;
  return Math.abs(e) <= 3 ? num(v) : `${(Math.round(m * 100) / 100).toString().replace("-", "−")}·10<sup>${String(e).replace("-", "−")}</sup>`; };

function slider(label, min, max, step, value) {
  return `<label class="la-slider"><span>${label}</span><input type="range" min="${min}" max="${max}" step="${step}" value="${value}"><output>${value}</output></label>`;
}

function wireSliders(el, onChange, show = fmt) {
  const inputs = [...el.querySelectorAll(".la-slider input")];
  const read = () => inputs.map((i) => { i.nextElementSibling.textContent = show(+i.value, i); return +i.value; });
  inputs.forEach((i) => i.addEventListener("input", () => onChange(read())));
  onChange(read());
}

// ---------- exact fractions and ranks (for the block counter) ----------

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
const parseMat = (s) => s.split(";").map((r) => r.trim().split(/[\s,]+/).filter(Boolean).map(Number));
const okSquare = (M) => M.length > 0 && M.length <= 6 && M.every((r) => r.length === M.length && r.every(Number.isInteger));
const matMul = (A, B) => A.map((r) => B[0].map((_, j) => r.reduce((s, v, k) => s.add(q(v).mul(q(B[k][j]))), q(0))));
const identity = (n) => Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => q(i === j ? 1 : 0)));

function rank(M0) {
  const R = M0.map((r) => r.map(q)), m = R.length, n = R[0].length;
  let r = 0;
  for (let j = 0; j < n && r < m; j++) {
    const k = R.findIndex((row, i) => i >= r && !row[j].zero);
    if (k < 0) continue;
    [R[r], R[k]] = [R[k], R[r]];
    for (let i = r + 1; i < m; i++) {
      if (R[i][j].zero) continue;
      const l = R[i][j].div(R[r][j]);
      R[i] = R[i].map((v, c) => v.sub(l.mul(R[r][c])));
    }
    r++;
  }
  return r;
}

// Ranks of (A − λI)^k for k = 0..n and the Jordan block sizes they imply (the note's jordan_blocks).
function jordanBlocks(A, lam) {
  const n = A.length, N = A.map((r, i) => r.map((v, j) => q(v).sub(q(i === j ? lam : 0))));
  const ranks = [];
  let P = identity(n);
  for (let k = 0; k <= n + 1; k++) { ranks.push(rank(P)); P = matMul(P, N); }
  const atLeast = ranks.slice(1).map((r, k) => ranks[k] - r); // atLeast[k-1] = number of blocks of size ≥ k
  const sizes = [];
  for (let k = 1; k <= n; k++) for (let c = 0; c < atLeast[k - 1] - atLeast[k]; c++) sizes.push(k);
  return { ranks: ranks.slice(0, n + 1), sizes: sizes.sort((a, b) => b - a) };
}

function jordanHTML(sizes, lam) {
  const n = sizes.reduce((a, b) => a + b, 0), M = Array.from({ length: n }, () => Array(n).fill(""));
  let o = 0;
  for (const s of sizes) {
    for (let i = 0; i < s; i++) { M[o + i][o + i] = String(lam).replace("-", "−"); if (i + 1 < s) M[o + i][o + i + 1] = "1"; }
    o += s;
  }
  return `<table class="la-mat">${M.map((r) => `<tr>${r.map((v) => `<td class="${v === "1" ? "pv" : ""}">${v || "0"}</td>`).join("")}</tr>`).join("")}</table>`;
}

(function matStyle() {
  if (document.getElementById("la-mat-style")) return;
  const s = document.createElement("style");
  s.id = "la-mat-style";
  s.textContent = `.la-mat{display:inline-table;border-collapse:separate;border-spacing:10px 3px;border-left:2px solid var(--ink-2);
border-right:2px solid var(--ink-2);border-radius:5px;margin:4px 6px;font:14px var(--mono);vertical-align:middle}
article table.la-mat,table.la-mat{width:auto;font-size:14px}.la-mat td,.la-mat th{text-align:right;min-width:1.7em;border:none;padding:0 2px;background:none}.la-mat td.pv{color:var(--teal);font-weight:700}
.la-btns{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}.la-svgrow{display:flex;flex-wrap:wrap;gap:12px;justify-content:center}
.la-svgrow figure{margin:0;text-align:center;font-size:13px}.la-in{font:14px var(--mono);width:100%;max-width:340px;padding:6px 8px;
border:1px solid var(--stone);border-radius:6px;background:var(--paper);color:var(--ink)}.la-row{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin:6px 0}`;
  document.head.appendChild(s);
})();

// ---------- a small x–y plot ----------

function xyPlot({ xr, yr, W = 340, H = 230, series = [], marks = [], xlabel = "", ylabel = "" }) {
  const pad = 30, X = (x) => pad + ((x - xr[0]) / (xr[1] - xr[0])) * (W - pad - 8), Y = (y) => H - pad - ((y - yr[0]) / (yr[1] - yr[0])) * (H - pad - 8);
  let g = `<svg class="la-plane" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img">`;
  g += `<line class="axis" x1="${pad}" y1="${Y(0)}" x2="${W - 4}" y2="${Y(0)}"/><line class="axis" x1="${pad}" y1="${H - pad + 4}" x2="${pad}" y2="4"/>`;
  g += `<text class="vlbl" x="${W - 12}" y="${Y(0) + 16}">${xlabel}</text><text class="vlbl" x="${pad + 4}" y="12">${ylabel}</text>`;
  g += `<text class="vlbl" x="${pad - 4}" y="${Y(yr[1]) + 4}" text-anchor="end">${num(yr[1])}</text><text class="vlbl" x="${X(xr[1])}" y="${Y(0) + 16}" text-anchor="end">${num(xr[1])}</text>`;
  for (const s of series) {
    const pts = s.pts.filter(([, y]) => Number.isFinite(y)).map(([x, y]) => `${X(x).toFixed(1)},${Y(Math.max(yr[0], Math.min(yr[1] * 1.05, y))).toFixed(1)}`).join(" ");
    g += `<polyline points="${pts}" class="${s.cls}" style="fill:none" stroke-width="2.2" ${s.dash ? 'stroke-dasharray="5 4"' : ""}/>`;
    if (s.label) { const [lx, ly] = s.pts[Math.floor(s.pts.length * (s.at ?? 0.7))]; g += `<text class="vlbl ${s.cls}" x="${X(lx) + 4}" y="${Y(ly) - 6}">${s.label}</text>`; }
  }
  for (const m of marks) g += `<circle cx="${X(m.x)}" cy="${Y(m.y)}" r="4.5" class="${m.cls}"/><text class="vlbl ${m.cls}" x="${X(m.x) + 7}" y="${Y(m.y) - 7}">${m.label}</text>`;
  return g + "</svg>";
}

// ---------- Demo: the barrels, with barrel 2's rate b ----------

function cond2(M) { // 2-norm condition number of a 2×2 matrix
  const [[a, b], [c, d]] = M, s = a * a + b * b + c * c + d * d, det = Math.abs(a * d - b * c);
  const r = Math.sqrt(Math.max(s * s / 4 - det * det, 0));
  return Math.sqrt((s / 2 + r) / Math.max(s / 2 - r, 1e-300));
}

function demoBarrels(el) {
  el.innerHTML = `<div class="la-ctrl">${slider("rate b of barrel 2", 0.5, 1.5, 0.01, 1)}</div><div class="la-svgrow"><figure class="fc"></figure></div><p class="la-read"></p>`;
  wireSliders(el, ([b]) => {
    const T = [...Array(121).keys()].map((i) => i / 20), same = Math.abs(b - 1) < 1e-9;
    const x2 = (t) => (same ? 4 * t * Math.exp(-t) : (4 * (Math.exp(-t) - Math.exp(-b * t))) / (b - 1));
    const series = [
      { pts: T.map((t) => [t, 4 * Math.exp(-t)]), cls: "A", label: "x₁", at: 0.12 },
      { pts: T.map((t) => [t, 4 * t * Math.exp(-t)]), cls: "HL", dash: true, label: same ? "" : "4te⁻ᵗ", at: 0.55 },
      { pts: T.map((t) => [t, x2(t)]), cls: "C", label: "x₂", at: 0.35 },
    ];
    let tmax = 0; T.forEach((t) => { if (x2(t) > x2(tmax)) tmax = t; });
    el.querySelector(".fc").innerHTML = xyPlot({ xr: [0, 6], yr: [0, 4.2], series, marks: [{ x: tmax, y: x2(tmax), cls: "HL", label: num(x2(tmax)) }], xlabel: "t (h)", ylabel: "hundred L" }) +
      `<figcaption>barrel 1 (x₁) and barrel 2 (x₂) from (4, 0); dashed: 4te⁻ᵗ, the b = 1 answer</figcaption>`;
    const v = [b - 1, 1], nv = Math.hypot(...v), X = [[v[0] / nv, 0], [v[1] / nv, 1]];
    el.querySelector(".la-read").innerHTML = same
      ? `b = 1: eigenvalue <b>−1 twice, one eigenvector</b> (0, 1). Defective: the Jordan form is J₂(−1) and x₂ = 4te⁻ᵗ peaks at t = 1 with <b class="HL">${num(4 / Math.E)}</b>.`
      : `b = ${num(b)}: eigenvalues −1 and ${num(-b)}, eigenvectors (${num(b - 1)}, 1) and (0, 1). Diagonalizable, Jordan form diag(−1, ${num(-b)}). ` +
        `Condition number of the eigenvector matrix <b class="${cond2(X) > 50 ? "NO" : "A"}">${num(cond2(X))}</b>; coefficients ±${num(4 / Math.abs(b - 1))}; x₂(1) = ${num(x2(1))}.`;
  });
}

// ---------- Demo: count Jordan blocks from ranks ----------

const PRESETS = {
  G: ["0 -2 -1; 1 3 0; 1 1 3", 2], H: ["0 -2 -2; 1 3 1; 1 1 3", 2], S: ["2 1 1; 1 2 1; 1 1 2", 1],
  "three barrels": ["-1 0 0; 1 -1 0; 0 1 -1", -1], Z: ["0 1 0 0 -1; 0 0 1 0 -1; 0 0 0 0 0; 0 0 0 0 1; 0 0 0 0 0", 0],
};

function demoBlocks(el) {
  el.innerHTML = `<div class="la-row"><input class="la-in mat" value="${PRESETS.G[0]}" aria-label="matrix, rows separated by ;">
    <label>λ = <input class="la-in lam" value="2" style="width:4em"></label></div>
    <div class="la-btns">${Object.keys(PRESETS).map((k) => `<button class="btn" data-p="${k}">${k}</button>`).join("")}</div><div class="la-read"></div>`;
  const draw = () => {
    const A = parseMat(el.querySelector(".mat").value), lam = Number(el.querySelector(".lam").value);
    const out = el.querySelector(".la-read");
    if (!okSquare(A) || !Number.isInteger(lam)) { out.innerHTML = "Enter a square integer matrix (up to 6×6, rows separated by ;) and an integer λ."; return; }
    const { ranks, sizes } = jordanBlocks(A, lam), n = A.length;
    if (!sizes.length) { out.innerHTML = `rank(A − ${lam}I) = ${ranks[1]} = n: <b class="NO">${lam} is not an eigenvalue</b>.`; return; }
    const alg = sizes.reduce((a, b) => a + b, 0);
    out.innerHTML = `<p>Ranks of (A − ${String(lam).replace("-", "−")}I)<sup>k</sup>, k = 0…${n}: <b>${ranks.join(", ")}</b>. Blocks of size ≥ k: ${ranks.slice(1).map((r, k) => ranks[k] - r).join(", ")}.</p>
      <p>Jordan blocks for λ = ${String(lam).replace("-", "−")}: <b class="HL">${sizes.join(" + ")}</b> (${sizes.length} eigenvector${sizes.length > 1 ? "s" : ""}, multiplicity ${alg})` +
      `${sizes.every((s) => s === 1) ? " — no missing eigenvectors for this λ." : " — defective."}</p>${jordanHTML(sizes, lam)}`;
  };
  el.querySelectorAll("[data-p]").forEach((b) => b.addEventListener("click", () => {
    const [m, l] = PRESETS[b.dataset.p];
    el.querySelector(".mat").value = m; el.querySelector(".lam").value = l; draw();
  }));
  el.querySelectorAll("input").forEach((i) => i.addEventListener("input", draw));
  draw();
}

// ---------- Demo: powers of a Jordan block ----------

const binom = (k, j) => { let r = 1; for (let i = 0; i < j; i++) r = (r * (k - i)) / (i + 1); return r; };

function demoPowers(el, opts = {}) {
  el.innerHTML = (opts.mini ? "" : `<div class="la-ctrl">${slider("λ", 0.5, 1.05, 0.01, 0.9)}${slider("block size m", 2, 4, 1, 2)}</div>`) +
    `<div class="la-svgrow"><figure class="fc"></figure></div><p class="la-read"></p>`;
  const draw = ([lam, m], kmark = null) => {
    const K = [...Array(61).keys()], corner = (k) => (k < m - 1 ? 0 : binom(k, m - 1) * lam ** (k - m + 1));
    let kp = 0; K.forEach((k) => { if (corner(k) > corner(kp) + 1e-12) kp = k; });
    const top = Math.max(1.2, Math.min(corner(kp) * 1.15, 1e4)), km = kmark ?? kp;
    el.querySelector(".fc").innerHTML = xyPlot({ xr: [0, 60], yr: [0, top],
      series: [{ pts: K.map((k) => [k, corner(k)]), cls: "C", label: `corner of J${"₂₃₄"[m - 2]}(λ)ᵏ`, at: 0.45 }, { pts: K.map((k) => [k, Math.abs(lam) ** k]), cls: "A", label: "λᵏ", at: 0.2 }],
      marks: [{ x: km, y: corner(km), cls: "HL", label: `k = ${km}: ${num(corner(km))}` }], xlabel: "k" }) +
      `<figcaption>top-right entry of Jᵏ (C(k, m−1) λ^(k−m+1)) against λᵏ, the size of (λI)ᵏ</figcaption>`;
    el.querySelector(".la-read").innerHTML = lam >= 1 ? `|λ| ≥ 1: the corner never decays (at k = 60 it is ${sci(corner(60))}).`
      : `Every |λ| < 1, so Jᵏ → 0 eventually. But the corner first grows to <b class="NO">${num(corner(kp))}</b> at k = ${kp}${Math.abs(corner(kp + 1) - corner(kp)) < 1e-9 ? ` (and k = ${kp + 1})` : ""}; at k = 60 it is ${sci(corner(60))}. (λI)ᵏ just shrinks: λ⁶⁰ = ${sci(lam ** 60)}.`;
  };
  if (opts.mini) { let k = 0; const tick = () => { draw([0.9, 2], k); k = (k + 3) % 61; }; tick(); setInterval(tick, 700); return; }
  wireSliders(el, (v) => draw(v));
}

// ---------- Demo: eigenvalues of a perturbed block ----------

function demoFragile(el) {
  el.innerHTML = `<div class="la-ctrl">${slider("block size n", 2, 16, 1, 10)}${slider("log₁₀ ε", -16, -1, 1, -10)}</div><div class="la-svgrow"><figure class="fc"></figure></div><p class="la-read"></p>`;
  wireSliders(el, ([n, le]) => {
    const eps = 10 ** le, r = eps ** (1 / n), W = 250, s = W / 2.6, C = W / 2;
    let g = `<svg class="la-plane" viewBox="0 0 ${W} ${W}" width="${W}" height="${W}" role="img"><line class="axis" x1="0" y1="${C}" x2="${W}" y2="${C}"/><line class="axis" x1="${C}" y1="0" x2="${C}" y2="${W}"/>`;
    g += `<circle cx="${C}" cy="${C}" r="${s}" class="grid" style="fill:none" stroke-dasharray="3 4"/><text class="vlbl" x="${C + s + 3}" y="${C - 4}">1</text>`;
    g += `<circle cx="${C}" cy="${C}" r="${Math.max(r * s, 0.5)}" class="HL" style="fill:none" stroke-width="1"/>`;
    for (let j = 0; j < n; j++) { const a = (2 * Math.PI * j) / n; g += `<circle cx="${C + r * s * Math.cos(a)}" cy="${C - r * s * Math.sin(a)}" r="4" class="NO"/>`; }
    g += `<circle cx="${C}" cy="${C}" r="3" class="A"/></svg>`;
    el.querySelector(".fc").innerHTML = g + `<figcaption>complex plane: eigenvalues of Jₙ(0) with ε in the corner (red); unperturbed: all at 0 (dot); dashed: |λ| = 1</figcaption>`;
    el.querySelector(".la-read").innerHTML = `λⁿ = ε, so the ${n} eigenvalues move from 0 to radius ε<sup>1/${n}</sup> = <b class="NO">${sci(r)}</b> — ${sci(r / eps)} times the perturbation ε = ${sci(eps)}. ` +
      `The singular values move by at most ε (Weyl): from 1 (n − 1 times) and 0 to 1 and <b class="A">${sci(eps)}</b>.`;
  }, (v, i) => (i.closest("label").textContent.includes("log") ? String(v).replace("-", "−") : fmt(v)));
}

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

const QUIZ = [
  { q: "A 3×3 matrix has the eigenvalue 5 three times and rank(A − 5I) = 1. Its Jordan blocks are", opts: ["one block of size 3", "sizes 2 and 1", "three blocks of size 1"], a: 1,
    why: "3 − 1 = 2 eigenvectors, so two blocks; their sizes add to 3." },
  { q: "A 2×2 matrix with eigenvalues 3 and 4 can be defective.", opts: ["true", "false"], a: 1,
    why: "Distinct eigenvalues always give independent eigenvectors." },
  { q: "J₂(2)³ equals", opts: ["[[8, 3], [0, 8]]", "[[8, 12], [0, 8]]", "[[8, 8], [0, 8]]"], a: 1,
    why: "The corner is kλ^(k−1) = 3 · 4 = 12." },
  { q: "The corner of e^(J₂(λ)t) is", opts: ["eᵗ", "t e^(λt)", "λ e^(λt)"], a: 1,
    why: "e^(Jt) = e^(λt)(I + tN); at t = 0 it must be I." },
  { q: "NumPy returns three different eigenvalues for G. So G is", opts: ["diagonalizable", "not diagonalizable: rounding split a triple eigenvalue"], a: 1,
    why: "Exactly, G has the single eigenvalue 2 with one eigenvector; rounding errors are amplified to about 10⁻⁵." },
];

const DEMOS = {
  barrels: (el) => demoBarrels(el),
  blocks: (el) => demoBlocks(el),
  powers: (el) => demoPowers(el),
  powersMini: (el) => demoPowers(el, { mini: true }),
  fragile: (el) => demoFragile(el),
  quiz: (el) => demoQuiz(el, QUIZ),
};
