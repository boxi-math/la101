// Chapter content, adapted from notes/L11-graphs-networks.md. Code and outputs are copied from the note (demos.js).
// Maths is written \( … \) (inline) and $$ … $$ (display) and typeset by the vendored KaTeX (../assets/katex/).
// Section html uses String.raw so LaTeX backslashes need no doubling.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);
const video = (src) => `<div class="card video" data-video="${src}"></div>`;
const VIDEO_P1 = "media/L11-1.mp4";
const VIDEO_P2 = "media/L11-2.mp4";

const LECTURE = {
  number: 11,
  title: "Graphs and Networks",
  tagline: "Five pads, six routes, one matrix",
  lead: "The drone delivers between five landing pads joined by six routes. The incidence matrix records the network, and its four subspaces say something plain: equal heights, climbs that pass every loop, deliveries that balance, and flows that go round in circles. Then AᵀA is the graph Laplacian.",
  heroDemo: "smoothMini",
  heroLabel: "Smoothing on a graph",
  heroCaption: "Noise readings on the five pads, smoothed step by step with x ← x − 0.2 Lx: the outlier at pad 4 comes down, the total stays 226.",
  whyTitle: "Why networks",
  whySub: "Every subspace means something",
  why: [
    ["Nullspace", "Equal heights: raising every pad changes no climb. Rank n − 1."],
    ["Loops", "Climbs add to zero round every loop; balanced flows are made of loops: m − n + 1 of them."],
    ["Laplacian", "AᵀA = D − W; xᵀLx adds squared differences along the edges."],
  ],
  ctaTitle: "Ready to read a network?",
  minutes: "About 60–90 minutes",
  videos: {
    [VIDEO_P1]: "Lecture 11 · Part 1 — Heights, climbs and loops",
    [VIDEO_P2]: "Lecture 11 · Part 2 — Flows, loops and the Laplacian",
  },
};

const CHAPTERS = [
  {
    slug: "1-heights", nav: "Heights", title: "Heights, Climbs and the Loop Law",
    subtitle: "The incidence matrix, its nullspace and its column space",
    abstract: "Row k of A has −1 at the start pad and +1 at the end pad of route k. Ax turns heights into climbs; climbs come from heights exactly when they add to zero round every loop.",
    tags: ["incidence matrix", "nullspace", "loop law"],
    hero: "code:incidence", heroCaption: "The bow tie: five pads, six routes",
    sections: [
      { id: "net", title: "Five pads, six routes", html: String.raw`
        ${video(VIDEO_P1)}
        <table><tr><th>route</th><th>\(e_1\)</th><th>\(e_2\)</th><th>\(e_3\)</th><th>\(e_4\)</th><th>\(e_5\)</th><th>\(e_6\)</th></tr>
        <tr><td>from → to</td><td>1 → 2</td><td>2 → 3</td><td>1 → 3</td><td>3 → 4</td><td>4 → 5</td><td>3 → 5</td></tr></table>
        ${run("incidence")}
        ${callout("pitfall", "PITFALL · ROWS ARE EDGES, COLUMNS ARE NODES", "<p>Ax takes one height per pad and gives one climb per route. Writing pads as rows gives Aᵀ and swaps all four subspaces.</p>")}` },
      { id: "null", title: "Heights and climbs: the nullspace", html: String.raw`
        ${run("climbs")}
        <p>\(A\mathbf{x} = \mathbf{0}\): every route has zero climb, so on a connected network all heights are equal. <b>Raising every pad by the same amount changes no climb</b>; grounding one pad leaves four independent columns.</p>
        ${run("ground")}` },
      { id: "loop", title: "The loop law: the column space", html: String.raw`
        $$b_1 + b_2 - b_3 = 0, \qquad b_4 + b_5 - b_6 = 0.$$
        ${run("loops")}
        <p>A surveyor reports \((4, -1, 3, 7, -2, 6)\): the right loop gives \(-1\), so no heights fit.</p>
        ${run("reported")}` },
    ],
    takeaways: [
      "Rows = routes, columns = pads.",
      "N(A) = equal heights; rank n − 1 when connected.",
      "Climbs pass the loop law ⇔ they come from heights.",
    ],
  },
  {
    slug: "2-flows", nav: "Flows", title: "Flows, Balance and Counting Loops",
    subtitle: "The left nullspace lives on the routes",
    abstract: "Crates per hour on the routes balance at every pad exactly when they are made of loops. The number of independent loops is edges − nodes + 1.",
    tags: ["left nullspace", "Kirchhoff", "loops"],
    hero: "network", heroCaption: "Type any network; read its rank, loops, climbs and Laplacian.",
    sections: [
      { id: "flow", title: "Flows and balance", html: String.raw`
        ${video(VIDEO_P2)}
        <p>\((A^\top\mathbf{y})_j\) = crates arriving at pad \(j\) − crates leaving it. A job \(\mathbf{f} = (-3, 0, 0, 0, 3)\) is done by any flow with \(A^\top\mathbf{y} = \mathbf{f}\):</p>
        ${run("job")}
        <p>Flows with \(A^\top\mathbf{y} = \mathbf{0}\) balance at every pad (Kirchhoff's current law): the loops. Adding them gives other plans for the same job.</p>
        ${run("loopflows")}
        <p>Every row of \(A\) adds to zero, so the entries of any possible job add to zero:</p>
        ${run("sumzero")}
        ${callout("pitfall", "PITFALL · ARROWS ARE NOT ONE-WAY STREETS", "<p>A negative flow runs against the arrow. Reversing an arrow multiplies one row of A by −1 and changes no dimension.</p>")}` },
      { id: "count", title: "Counting loops", html: String.raw`
        <table><tr><th>subspace</th><th>lives on</th><th>meaning</th><th>dimension</th></tr>
        <tr><td>\(N(A)\)</td><td>pads</td><td>equal heights</td><td>\(n - r = 1\)</td></tr>
        <tr><td>\(C(A^\top)\)</td><td>pads</td><td>possible jobs</td><td>\(r = 4\)</td></tr>
        <tr><td>\(C(A)\)</td><td>routes</td><td>climbs that pass the loop law</td><td>\(r = 4\)</td></tr>
        <tr><td>\(N(A^\top)\)</td><td>routes</td><td>balanced flows (loops)</td><td>\(m - r = 2\)</td></tr></table>
        $$m - r = m - (n - 1) = \text{edges} - \text{nodes} + 1 = \text{number of independent loops}.$$
        ${run("count")}
` },
    ],
    takeaways: [
      "N(Aᵀ) = balanced flows = loops.",
      "Jobs must add to zero.",
      "Loops = m − n + 1 (connected).",
    ],
  },
  {
    slug: "3-laplacian", nav: "Laplacian", title: "The Graph Laplacian and Graph Data",
    subtitle: "AᵀA = D − W",
    abstract: "AᵀA forgets the arrows: degrees on the diagonal, −1 for each route. xᵀLx is the sum of squared climbs, a roughness that machine learning on graphs keeps small.",
    tags: ["Laplacian", "degree", "graph data", "ML"],
    hero: "smooth", heroCaption: "Smooth the noise readings, step by step.",
    sections: [
      { id: "lap", title: "The Laplacian", html: String.raw`
        ${run("laplacian")}
        $$\mathbf{x}^\top L\mathbf{x} = (A\mathbf{x})^\top(A\mathbf{x}) = \sum_{\text{routes}} (\text{climb})^2.$$
        ${run("rough")}` },
      { id: "ml", title: "Smooth signals on a graph", html: String.raw`
        <p>Pad 4's noise sensor reads high. One step \(\mathbf{x} \leftarrow \mathbf{x} - 0.2\,L\mathbf{x}\) pulls every pad towards its neighbours:</p>
        ${run("smooth")}
        ${callout("ml", "ML", "<p>Graph neural networks mix each node's features with its neighbours' through matrices built from W or L. Constants are invisible to L (its nullspace), and xᵀLx measures disagreement along edges.</p>")}` },
    ],
    takeaways: [
      "L = AᵀA = D − W, symmetric, L1 = 0.",
      "xᵀLx = sum of squared differences on edges.",
      "Smoothing lowers roughness, keeps the total.",
    ],
  },
  {
    slug: "4-practice", nav: "Practice", title: "Check, Practise, Use AI Well",
    subtitle: "Self-check, exercises, and checking an incidence matrix",
    abstract: "Four quick questions, the exercises, and three checks for any claimed incidence matrix or Laplacian.",
    tags: ["quiz", "exercises", "working with AI"],
    hero: "toc",
    sections: [
      { id: "quiz", title: "Check your understanding", html: String.raw`${demo("quiz", "Self-check", "four questions")}` },
      { id: "exercises", title: "Exercises", html: String.raw`
        <p>Try each exercise on paper first. <b>Hint</b> gives a nudge; <b>Full solution</b> works it through, with the code that checks every number. Stars mark the level: ★ compute or check, ★★ explain or build, ★★★ extend or combine.</p>` },
      { id: "ai", title: "Working with AI", html: String.raw`
        <p>Every row of an incidence matrix has one −1 and one +1; \(L\) is symmetric with \(L\mathbf{1} = \mathbf{0}\); a connected graph has rank \(n - 1\). A made-up answer with a sign slip in route \(e_6\):</p>
        ${run("claim")}
        <p>The row sums find the bad row at once, and the rank 5 is impossible for a connected network.</p>` },
    ],
    takeaways: [
      "Row sums of A are 0.",
      "L symmetric, L1 = 0, diagonal = degrees.",
      "Rank n − 1, loops m − n + 1.",
    ],
  },
];
