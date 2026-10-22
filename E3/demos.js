// Interactive demos for LA101 Elective E3. Flows, cuts and augmenting paths; zero-sum games, mixed strategies and the minimax theorem.
// Every code panel is copied from notes/E3-flows-games.md (checked by tools/check.py); the JS recomputes the same
// numbers so the examples can be changed.

const CODE = {
  network: "import numpy as np\nnodes = [\"s\", \"a\", \"b\", \"c\", \"t\"]\nroads = [(\"s\", \"a\", 6), (\"s\", \"b\", 4), (\"a\", \"b\", 2), (\"a\", \"c\", 3), (\"b\", \"c\", 1), (\"b\", \"t\", 4), (\"c\", \"t\", 5)]\ncap = np.array([c for _, _, c in roads], dtype=float)\nA = np.zeros((len(roads), len(nodes)))\nfor k, (u, v, _) in enumerate(roads):\n    A[k, nodes.index(u)], A[k, nodes.index(v)] = -1.0, 1.0\nf = np.array([4.0, 4.0, 1.0, 3.0, 1.0, 4.0, 4.0])\nprint(A.astype(int).tolist())\nprint((A.T @ f).tolist(), bool(np.all((0 <= f) & (f <= cap))))",
  pile: "g = f.copy()\ng[0], g[2] = 6.0, 2.0\nprint((A.T @ g).tolist(), bool(np.all(g <= cap)))",
  cuts: "from itertools import combinations\nfor k in range(4):\n    for inner in combinations([\"a\", \"b\", \"c\"], k):\n        S = {\"s\", *inner}\n        capacity = sum(c for u, v, c in roads if u in S and v not in S)\n        print(sorted(S), capacity)",
  maxflow: "def max_flow(nodes, roads, s, t):\n    n = len(nodes)\n    C = np.zeros((n, n))\n    for u, v, c in roads:\n        C[nodes.index(u), nodes.index(v)] = c\n    F = np.zeros((n, n))\n    paths = []\n    while True:\n        R = C - F + F.T\n        prev, queue = {nodes.index(s): None}, [nodes.index(s)]\n        while queue:\n            u = queue.pop(0)\n            for v in range(n):\n                if R[u, v] > 0 and v not in prev:\n                    prev[v] = u\n                    queue.append(v)\n        if nodes.index(t) not in prev:\n            return F, paths, sorted(nodes[i] for i in prev)\n        path = [nodes.index(t)]\n        while path[-1] != nodes.index(s):\n            path.append(prev[path[-1]])\n        path.reverse()\n        push = min(R[path[i], path[i + 1]] for i in range(len(path) - 1))\n        for u, v in zip(path, path[1:]):\n            back = min(F[v, u], push)\n            F[v, u] -= back\n            F[u, v] += push - back\n        paths.append((\"\".join(nodes[i] for i in path), int(push)))\n\nF, paths, reachable = max_flow(nodes, roads, \"s\", \"t\")\nprint(paths, int(F[0].sum()), reachable)",
  greedy: "roads2 = [(\"s\", \"a\", 3), (\"s\", \"b\", 2), (\"a\", \"b\", 3), (\"a\", \"t\", 2), (\"b\", \"t\", 3)]\nnodes2 = [\"s\", \"a\", \"b\", \"t\"]\nF2, paths2, cut2 = max_flow(nodes2, roads2, \"s\", \"t\")\nprint(paths2, int(F2[0].sum()), cut2)",
  loops: "A_loop = np.vstack([A, np.eye(5)[nodes.index(\"s\")] - np.eye(5)[nodes.index(\"t\")]])\nm, n = A_loop.shape\nprint(m, n, m - np.linalg.matrix_rank(A_loop), m - n + 1)",
  pure: "G = np.array([[-2.0, 3.0], [1.0, -1.0]])\nprint(G.min(axis=1).tolist(), float(G.min(axis=1).max()), G.max(axis=0).tolist(), float(G.max(axis=0).min()))",
  mix: "from fractions import Fraction as Fr\np, q = Fr(2, 7), Fr(4, 7)\nprint(-2 * p + (1 - p), 3 * p - (1 - p), -2 * q + 3 * (1 - q), q - (1 - q))",
  half: "half = np.array([0.5, 0.5])\nx_opt = np.array([2 / 7, 5 / 7])\nprint((half @ G).tolist(), round(float((half @ G).min()), 4), np.round(x_opt @ G, 4).tolist())",
  equalise: "def equalise(G):\n    m = len(G)\n    K = np.zeros((m + 1, m + 1))\n    K[:m, :m], K[:m, m], K[m, :m] = G.T, -1.0, 1.0\n    rhs = np.zeros(m + 1)\n    rhs[m] = 1.0\n    sol = np.linalg.solve(K, rhs)\n    return sol[:m], sol[m]\n\nx, v = equalise(G)\nprint(np.round(x, 4).tolist(), round(float(v), 4))",
  rps: "RPS = np.array([[0.0, -3.0, 1.0], [3.0, 0.0, -2.0], [-1.0, 2.0, 0.0]])\nx3, v3 = equalise(RPS)\nprint([str(Fr(float(w)).limit_denominator(12)) for w in x3], round(float(v3), 10) + 0.0)\nprint((np.round(x3 @ RPS, 10) + 0.0).tolist(), np.round(np.ones(3) / 3 @ RPS, 4).tolist())",
  cyu: "S2 = np.array([[3.0, 1.0], [5.0, 2.0]])\nprint(S2.min(axis=1).tolist(), S2.max(axis=0).tolist(), float(S2.min(axis=1).max()), float(S2.max(axis=0).min()))",
  ex2: "roads_w = [(u, v, 6 if (u, v) == (\"b\", \"t\") else c) for u, v, c in roads]\nFw, _, cut_w = max_flow(nodes, roads_w, \"s\", \"t\")\nprint(int(Fw[0].sum()), cut_w)",
  ex5: "xs, vs = equalise(S2)\nprint(np.round(xs, 4).tolist(), round(float(vs), 4))",
  claim: "print(G.mean(axis=1).tolist(), G[0].tolist(), float(G[0].min()))",
};

const OUT = {
  network: "[[-1, 1, 0, 0, 0], [-1, 0, 1, 0, 0], [0, -1, 1, 0, 0], [0, -1, 0, 1, 0], [0, 0, -1, 1, 0], [0, 0, -1, 0, 1], [0, 0, 0, -1, 1]]\n[-8.0, 0.0, 0.0, 0.0, 8.0] True",
  pile: "[-10.0, 1.0, 1.0, 0.0, 8.0] True",
  cuts: "['s'] 10\n['a', 's'] 9\n['b', 's'] 11\n['c', 's'] 15\n['a', 'b', 's'] 8\n['a', 'c', 's'] 11\n['b', 'c', 's'] 15\n['a', 'b', 'c', 's'] 9",
  maxflow: "[('sbt', 4), ('sact', 3), ('sabct', 1)] 8 ['a', 'b', 's']",
  greedy: "[('sat', 2), ('sbt', 2), ('sabt', 1)] 5 ['s']",
  loops: "8 5 4 4",
  pure: "[-2.0, -1.0] -1.0 [1.0, 3.0] 1.0",
  mix: "1/7 1/7 1/7 1/7",
  half: "[-0.5, 1.0] -0.5 [0.1429, 0.1429]",
  equalise: "[0.2857, 0.7143] 0.1429",
  rps: "['1/3', '1/6', '1/2'] 0.0\n[0.0, 0.0, 0.0] [0.6667, -0.3333, -0.3333]",
  cyu: "[1.0, 2.0] [5.0, 2.0] 2.0 2.0",
  ex2: "9 ['a', 's']",
  ex5: "[3.0, -2.0] -1.0",
  claim: "[0.5, 0.0] [-2.0, 3.0] -2.0",
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

// ---------- Max flow by augmenting paths (breadth-first, Edmonds–Karp) ----------
function maxFlow(nodes, roads, s, t) {
  const idx = Object.fromEntries(nodes.map((v, i) => [v, i])), n = nodes.length;
  const cap = Array.from({ length: n }, () => Array(n).fill(0)), flow = Array.from({ length: n }, () => Array(n).fill(0));
  roads.forEach(([u, v, c]) => { cap[idx[u]][idx[v]] += c; });
  const paths = [];
  for (let guard = 0; guard < 100; guard++) {
    const prev = Array(n).fill(-1); prev[idx[s]] = idx[s]; const qu = [idx[s]];
    while (qu.length && prev[idx[t]] < 0) { const u = qu.shift(); for (let v = 0; v < n; v++) if (prev[v] < 0 && cap[u][v] - flow[u][v] + flow[v][u] > 1e-12) { prev[v] = u; qu.push(v); } }
    if (prev[idx[t]] < 0) {
      const reach = nodes.filter((_, i) => prev[i] >= 0);
      return { value: paths.reduce((a, p) => a + p[1], 0), paths, cut: reach, flow: roads.map(([u, v]) => flow[idx[u]][idx[v]]) };
    }
    const path = []; for (let v = idx[t]; v !== idx[s]; v = prev[v]) path.unshift(v); path.unshift(idx[s]);
    let push = Infinity; for (let k = 0; k + 1 < path.length; k++) { const u = path[k], v = path[k + 1]; push = Math.min(push, cap[u][v] - flow[u][v] + flow[v][u]); }
    for (let k = 0; k + 1 < path.length; k++) { const u = path[k], v = path[k + 1], back = Math.min(push, flow[v][u]); flow[v][u] -= back; flow[u][v] += push - back; }
    paths.push([path.map((i) => nodes[i]).join(""), push]);
  }
  return null;
}

const NETS = {
  bakery: { nodes: ["s", "a", "b", "c", "t"], roads: [["s", "a", 6], ["s", "b", 4], ["a", "b", 2], ["a", "c", 3], ["b", "c", 1], ["b", "t", 4], ["c", "t", 5]], pos: { s: [40, 110], a: [170, 45], b: [170, 175], c: [310, 70], t: [440, 140] } },
  greedy: { nodes: ["s", "a", "b", "t"], roads: [["s", "a", 3], ["s", "b", 2], ["a", "b", 3], ["a", "t", 2], ["b", "t", 3]], pos: { s: [40, 110], a: [230, 40], b: [230, 180], t: [440, 110] } },
};
function demoFlow(el, opts = {}) {
  let net = NETS.bakery, caps = net.roads.map((r) => r[2]);
  el.innerHTML = `${opts.mini ? "" : `<div class="la-ctrl" style="display:flex;flex-wrap:wrap;gap:8px"><button class="cbtn" data-n="bakery">the bakery network</button> <button class="cbtn" data-n="greedy">the greedy trap</button></div><div class="la-ctrl la-caps" style="display:flex;flex-wrap:wrap;gap:10px"></div>`}<div class="la-fig"></div><div class="la-show"></div>`;
  const draw = () => {
    const roads = net.roads.map(([u, v], k) => [u, v, caps[k]]), R = maxFlow(net.nodes, roads, "s", "t"), P = net.pos, inS = new Set(R.cut);
    let s = `<svg viewBox="0 0 480 220" style="width:100%;max-width:480px"><defs><marker id="arw${el.id || ""}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--stone)"/></marker></defs>`;
    roads.forEach(([u, v, c], k) => {
      const [x1, y1] = P[u], [x2, y2] = P[v], L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L, a = [x1 + 17 * ux, y1 + 17 * uy], b = [x2 - 19 * ux, y2 - 19 * uy];
      const crossing = inS.has(u) && !inS.has(v), full = Math.abs(R.flow[k] - c) < 1e-9 && c > 0;
      s += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${crossing ? "var(--red)" : full ? "var(--amber)" : "var(--stone)"}" stroke-width="${1.5 + 2.5 * (c ? R.flow[k] / c : 0)}" marker-end="url(#arw${el.id || ""})"/>`;
      s += `<text x="${(x1 + x2) / 2 - 12 * uy}" y="${(y1 + y2) / 2 + 12 * ux + 4}" text-anchor="middle" font-size="12" fill="var(--ink, #222)">${R.flow[k]}/${c}</text>`;
    });
    for (const v of net.nodes) s += `<circle cx="${P[v][0]}" cy="${P[v][1]}" r="16" fill="${inS.has(v) ? "var(--teal)" : "var(--amber)"}"/><text x="${P[v][0]}" y="${P[v][1] + 5}" text-anchor="middle" font-size="14" fill="#fff" font-weight="700">${v}</text>`;
    el.querySelector(".la-fig").innerHTML = s + "</svg>";
    const cutCap = roads.filter(([u, v]) => inS.has(u) && !inS.has(v)).reduce((a, r) => a + r[2], 0);
    el.querySelector(".la-show").innerHTML = opts.mini ? `<p class="la-log" style="text-align:center">maximum flow ${R.value} = minimum cut ${cutCap}: red roads cross the cut around {${R.cut.join(", ")}}</p>` :
      `<p>augmenting paths (shortest first): ${R.paths.map(([p, f]) => `${p.split("").join("→")} +${f}`).join(", ")}</p>
       <p>maximum flow <b>${R.value}</b> · minimum cut S = {${R.cut.join(", ")}} (teal), capacity <b>${cutCap}</b> (red roads)</p>
       <p class="la-log">Labels show flow/capacity; amber roads are full. Widen a red road to raise the maximum; widening any other road changes nothing.</p>`;
  };
  const capsUI = () => {
    const box = el.querySelector(".la-caps"); if (!box) return;
    box.innerHTML = net.roads.map(([u, v], k) => `<label>${u}→${v} <input type="number" min="0" max="20" step="1" value="${caps[k]}" data-k="${k}" style="width:3.5em"></label>`).join("");
    box.querySelectorAll("input").forEach((i) => i.addEventListener("input", () => { const v = Math.max(0, Math.min(20, Math.round(+i.value || 0))); caps[+i.dataset.k] = v; draw(); }));
  };
  el.querySelectorAll(".cbtn").forEach((b) => { b.onclick = () => { net = NETS[b.dataset.n]; caps = net.roads.map((r) => r[2]); capsUI(); draw(); }; });
  capsUI(); draw();
}

// ---------- 2-by-2 zero-sum game: the driver's guarantee as a function of p ----------
function solve2x2Game(G) {
  const [[a, b], [c, d]] = G, rowMin = [Math.min(a, b), Math.min(c, d)], colMax = [Math.max(a, c), Math.max(b, d)];
  const maximin = Math.max(...rowMin), minimax = Math.min(...colMax);
  if (Math.abs(maximin - minimax) < 1e-12) return { saddle: true, v: maximin, p: rowMin[0] >= rowMin[1] ? 1 : 0, maximin, minimax };
  const den = a - b - c + d, p = (d - c) / den, q = (d - b) / den, v = (a * d - b * c) / den;
  return { saddle: false, p, q, v, maximin, minimax };
}
function demoGame(el) {
  el.innerHTML = `<div class="la-ctrl la-grid"><label>driver's gains G = <input class="la-in" value="-2 3; 1 -1" style="width:9em"></label></div>
    <div class="la-ctrl">${slider("driver takes North with probability p", 0, 1, 0.01, 0.5)}</div><div class="la-fig"></div><div class="la-show"></div>`;
  const inG = el.querySelector(".la-in"); let p = 0.5;
  const draw = () => {
    const G = parseNumMat(inG.value), show = el.querySelector(".la-show");
    if (!(G.length === 2 && G.every((r) => r.length === 2 && r.every(Number.isFinite)))) { show.innerHTML = "Type a 2-by-2 matrix like −2 3; 1 −1."; return; }
    const S = solve2x2Game(G), lo = Math.min(...G.flat(), 0) - 0.5, hi = Math.max(...G.flat(), 0) + 0.5;
    const W = 480, H = 230, X = (t) => 40 + t * (W - 60), Y = (v) => 15 + ((hi - v) / (hi - lo)) * (H - 45);
    const e = (j, t) => t * G[0][j] + (1 - t) * G[1][j];
    let s = `<svg viewBox="0 0 ${W} ${H}" style="width:100%;max-width:${W}px"><line x1="${X(0)}" y1="${Y(0)}" x2="${X(1)}" y2="${Y(0)}" stroke="var(--stone)" stroke-dasharray="3 3"/>`;
    s += `<text x="${X(0)}" y="${H - 8}" font-size="11" fill="var(--stone)">p = 0 (always South)</text><text x="${X(1)}" y="${H - 8}" font-size="11" text-anchor="end" fill="var(--stone)">p = 1 (always North)</text>`;
    [0, 1].forEach((j) => { s += `<line x1="${X(0)}" y1="${Y(e(j, 0))}" x2="${X(1)}" y2="${Y(e(j, 1))}" stroke="${j ? "var(--amber)" : "var(--teal)"}" stroke-width="2"/>`; });
    const env = Array.from({ length: 101 }, (_, k) => k / 100).map((t) => `${X(t)},${Y(Math.min(e(0, t), e(1, t)))}`).join(" ");
    s += `<polyline points="${env}" fill="none" stroke="var(--red)" stroke-width="3.5" opacity="0.55"/>`;
    s += `<circle cx="${X(p)}" cy="${Y(Math.min(e(0, p), e(1, p)))}" r="6" fill="var(--red)"/>`;
    el.querySelector(".la-fig").innerHTML = s + "</svg>";
    const g = Math.min(e(0, p), e(1, p));
    show.innerHTML = `<p><span style="color:var(--teal)">—</span> inspector checks North: ${num(e(0, p), 4)} · <span style="color:var(--amber)">—</span> checks South: ${num(e(1, p), 4)} · guaranteed (red): <b>${num(g, 4)}</b></p>
      <p>pure strategies: max min = ${num(S.maximin, 4)}, min max = ${num(S.minimax, 4)}${S.saddle ? ` — <b>a saddle point</b>: value ${num(S.v, 4)}, no mixing needed` : ` · optimal p = ${num(S.p, 4)}, inspector q = ${num(S.q, 4)}, value <b>${num(S.v, 4)}</b>`}</p>
      <p class="la-log">The inspector picks the lower line, so the driver maximises the red lower envelope.</p>`;
  };
  inG.addEventListener("input", draw);
  wireSliders(el, ([v]) => { p = v; draw(); });
}

// ---------- Fully mixed equilibrium from a linear system ----------
function equaliseJS(G) {
  const m = G.length, n = m + 1, M = Array.from({ length: n }, () => Array(n + 1).fill(0));
  for (let j = 0; j < m; j++) { for (let i = 0; i < m; i++) M[j][i] = G[i][j]; M[j][m] = -1; }
  for (let i = 0; i < m; i++) M[m][i] = 1; M[m][n] = 1;
  for (let c = 0; c < n; c++) {
    let piv = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[piv][c])) piv = r;
    if (Math.abs(M[piv][c]) < 1e-12) return null;
    [M[c], M[piv]] = [M[piv], M[c]];
    for (let r = 0; r < n; r++) if (r !== c) { const f = M[r][c] / M[c][c]; for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k]; }
  }
  const z = M.map((r, i) => r[n] / r[i]); return { x: z.slice(0, m), v: z[m] };
}
function demoMix(el) {
  el.innerHTML = `<div class="la-ctrl la-grid"><label>G = <input class="la-in" value="0 -3 1; 3 0 -2; -1 2 0" style="width:14em"></label> <label>try a mix x = <input class="la-x" value="1/3 1/3 1/3" style="width:9em"></label></div>
    <div class="la-ctrl" style="display:flex;flex-wrap:wrap;gap:8px"><button class="cbtn" data-g="0 -3 1; 3 0 -2; -1 2 0">uneven rock–paper–scissors</button> <button class="cbtn" data-g="0 -1 1; 1 0 -1; -1 1 0">ordinary rock–paper–scissors</button> <button class="cbtn" data-g="-2 3; 1 -1">driver and inspector</button> <button class="cbtn" data-g="3 1; 5 2">a saddle-point game</button></div><div class="la-show"></div>`;
  const inG = el.querySelector(".la-in"), inX = el.querySelector(".la-x");
  const frac = (s) => s.trim().split(/[\s,]+/).map((t) => { const [a, b] = t.split("/").map(Number); return b ? a / b : a; });
  const draw = () => {
    const G = parseNumMat(inG.value), show = el.querySelector(".la-show"), m = G.length;
    if (!(m >= 2 && m <= 4 && G.every((r) => r.length === m && r.every(Number.isFinite)))) { show.innerHTML = "Type a square payoff matrix (2-by-2 to 4-by-4)."; return; }
    const E = equaliseJS(G), x = frac(inX.value), okx = x.length === m && x.every((t) => Number.isFinite(t) && t >= 0) && Math.abs(x.reduce((a, b) => a + b, 0) - 1) < 1e-6;
    const vs = okx ? G[0].map((_, j) => x.reduce((a, xi, i) => a + xi * G[i][j], 0)) : null;
    show.innerHTML = `<p><b>Equalising system</b> Gᵀx = v·1, x₁ + … + x<sub>m</sub> = 1: ${E ? `x = (${E.x.map((t) => num(r4g(t), 4)).join(", ")}), v = <b>${num(r4g(E.v), 4)}</b>${E.x.some((t) => t < -1e-9) ? ' — <b class="NO">a negative entry: not a probability vector, so some rows should not be played (use linear programming)</b>' : ""}` : '<b class="NO">singular system</b>'}</p>
      <p><b>Your mix</b> ${okx ? `against each column: ${vs.map((t) => num(r4g(t), 4)).join(", ")} · guaranteed <b>${num(r4g(Math.min(...vs)), 4)}</b>` : `type ${m} non-negative numbers adding up to 1 (fractions allowed)`}</p>
      <p class="la-log">The opponent answers with the column that is worst for you: only the minimum counts.</p>`;
  };
  [inG, inX].forEach((i) => i.addEventListener("input", draw));
  el.querySelectorAll(".cbtn").forEach((b) => { b.onclick = () => { inG.value = b.dataset.g; const m = b.dataset.g.split(";").length; inX.value = Array(m).fill(`1/${m}`).join(" "); draw(); }; });
  draw();
}
const r4g = (v) => { const x = Math.round(v * 1e4) / 1e4; return Object.is(x, -0) ? 0 : x; };

// ---------- Self-check quiz (from "Check your understanding") ----------

const QUIZ = [
  { q: "Why is Aᵀf zero at the depots of a flow?", opts: ["the capacities are respected", "entry j is arrivals minus departures at node j", "A has full rank"], a: 1, why: "Conservation: as many vans arrive as leave." },
  { q: "A network has a cut of capacity 7. What do you know about every flow?", opts: ["its value is exactly 7", "its value is at most 7", "its value is at least 7"], a: 1, why: "Every flow is at most every cut." },
  { q: "Does the game [3 1; 5 2] have a saddle point?", opts: ["yes, value 2", "no", "yes, value 3"], a: 0, why: "Row minima 1, 2; column maxima 5, 2: max min = min max = 2." },
  { q: "“The optimal mix plays the action with the biggest prize most often.”", opts: ["True", "False"], a: 1, why: "In uneven rock–paper–scissors, paper wins most and is played least (1/6)." },
  { q: "The value of a game with an antisymmetric payoff matrix is…", opts: ["0", "positive", "it depends on the entries"], a: 0, why: "xᵀGx = 0, and each player can copy the other's optimal strategy." },
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
  flow: (el) => demoFlow(el),
  flowMini: (el) => demoFlow(el, { mini: true }),
  game: (el) => demoGame(el),
  mix: (el) => demoMix(el),
  quiz: (el) => demoQuiz(el, QUIZ),
};
