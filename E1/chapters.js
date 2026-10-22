// Chapter content, adapted from notes/E1-graph-laplacians.md. Code and outputs are copied from the note (demos.js).
// Maths is written \( … \) (inline) and $$ … $$ (display) and typeset by the vendored KaTeX (../assets/katex/).
// Section html uses String.raw so LaTeX backslashes need no doubling.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);
const video = (src) => `<div class="card video" data-video="${src}"></div>`;
const VIDEO_P1 = "media/E1-1.mp4";
const VIDEO_P2 = "media/E1-2.mp4";

const LECTURE = {
  number: "E1",
  id: "E1",
  label: "Elective E1",
  title: "Graph Laplacians and Spectral Clustering",
  tagline: "Grouping the nodes of a graph with eigenvectors",
  lead: "One symmetric matrix, the graph Laplacian L = D − W, turns questions about a graph into eigenvalue questions. Its zero eigenvalues count the connected pieces, and the signs of its second eigenvector, the Fiedler vector, split eight students into their two study groups. Why the smallest cut is not the answer, what a graph with no groups looks like, and spectral clustering of two rings that k-means cannot separate.",
  heroDemo: "graphMini",
  heroLabel: "two groups and a bridge",
  heroCaption: "The signs of the Fiedler vector colour the two study groups; node size shows the size of each entry, and the dashed red edge is the one the split cuts.",
  whyTitle: "Why the Laplacian?",
  whySub: "Connections become eigenvalues",
  why: [
    ["Pieces", "The number of zero eigenvalues of \\(L\\) is the number of connected pieces."],
    ["Splits", "\\(\\mathbf x^\\top L\\mathbf x = \\sum_{\\text{edges}}(x_i - x_j)^2\\): the Fiedler vector is the smoothest non-constant pattern."],
    ["Clusters", "Build a similarity graph of data points, and the smallest eigenvectors find groups by connection, not by centre."],
  ],
  ctaTitle: "Ready to split a graph?",
  minutes: "About 60–90 minutes",
  videos: {
    [VIDEO_P1]: "Elective E1 · Part 1 — The Laplacian and the Fiedler vector",
    [VIDEO_P2]: "Elective E1 · Part 2 — Balanced cuts and spectral clustering",
  },
};

const CHAPTERS = [
  {
    slug: "1-laplacian", nav: "Laplacian", title: "The Laplacian of a Graph",
    subtitle: "L = D − W, a sum over edges, and zero eigenvalues",
    abstract: "Eight students in two study groups, joined by one friendship 4–5. L = D − W = AᵀA, so xᵀLx = Σ(xᵢ − xⱼ)² ≥ 0, and a ±1 labelling gives 4 × (cut edges). Without the bridge the eigenvalues are 0, 0, 2, 2, 4, 4, 4, 4: two zeros, two pieces. With it, λ₂ = 0.2907 is small: almost two pieces.",
    tags: ["L = D − W", "xᵀLx ≥ 0", "zeros count pieces"],
    hero: "graph", heroCaption: "Change the edges and read the eigenvalues",
    sections: [
      { id: "lap", title: "Degree minus adjacency", html: String.raw`
        ${video(VIDEO_P1)}
        <p>The <b>adjacency matrix</b> \(W\) has \(w_{ij} = 1\) for each friendship, the <b>degree matrix</b> \(D\) counts friends, and \(L = D - W\):</p>
        ${run("lap")}
        $$\mathbf x^\top L\mathbf x = \|A\mathbf x\|^2 = \sum_{\text{edges } (i, j)} (x_i - x_j)^2 \;\ge\; 0$$
        ${run("energy")}
        <p>For \(\pm1\) labels each cut edge contributes \(2^2 = 4\): here one cut edge, \(\mathbf x^\top L\mathbf x = 4\).</p>` },
      { id: "pieces", title: "Zero eigenvalues count the pieces", html: String.raw`
        ${run("split")}${run("lam")}
        <p>A small \(\lambda_2\), the <b>algebraic connectivity</b>, says “almost two pieces”.</p>` },
    ],
    takeaways: [
      "Every row of L adds to zero.",
      "xᵀLx = sum of squared differences.",
      "One zero eigenvalue per piece.",
    ],
  },
  {
    slug: "2-fiedler", nav: "Fiedler", title: "The Fiedler Vector and Balanced Cuts",
    subtitle: "The smoothest non-constant pattern",
    abstract: "Minimising xᵀLx over unit x ⊥ 1 gives λ₂ and the Fiedler vector (0.432, 0.37, 0.37, 0.199, −0.199, −0.37, −0.37, −0.432): its signs recover the two groups. The largest eigenvector cuts 9 of 11 edges. A ninth student on a single edge does not fool it (ratio cut 0.45 against 1.125), and the complete graph, eigenvalues 0 and 8 seven times, has nothing to find.",
    tags: ["Fiedler vector", "not the largest", "ratio cut", "no groups"],
    hero: "graph", heroCaption: "Try the ninth student and the complete graph",
    sections: [
      { id: "fiedler", title: "Signs split the graph", html: String.raw`
        <p>By the Rayleigh quotient, \(\min \mathbf x^\top L\mathbf x\) over unit \(\mathbf x \perp \mathbf 1\) is \(\lambda_2\), reached at the <b>Fiedler vector</b> \(\mathbf v_2\).</p>
        ${predict("Which students get positive entries in the Fiedler vector, and which negative?", `<p>Students 1–4 positive, 5–8 negative (up to an overall sign).</p>${run("fiedler")}`)}
        <p>The labelling \((1, 1, 1, 1, -1, -1, -1, -1)\) has zero sum, so \(\lambda_2 \le 4/8 = 0.5\); the Fiedler vector is the best <b>relaxed</b> labelling.</p>
        ${callout("pitfall", "PITFALL · NOT THE LARGEST EIGENVALUE", "<p>The eigenvector of the largest eigenvalue is the roughest pattern: split by its signs, it cuts 9 of the 11 edges.</p>" + run("rough"))}
        ${demo("graph", "Demo 1 · Split a graph", "edit the edges or pick an example", "Tick “largest eigenvalue” to see the pitfall.")}` },
      { id: "balanced", title: "Small cuts and balanced cuts", html: String.raw`
        <p>Add student 9, who knows only student 8. Two cuts remove one edge, but the <b>ratio cut</b> \(\text{cut}\cdot\left(\frac1{|S|} + \frac1{|S^c|}\right)\) prefers the balanced one:</p>
        ${run("ninth")}
        <p><b>A graph with no groups.</b> When everyone knows everyone, every nonzero eigenvalue is 8 and \(\lambda_2\) is repeated: there is no single Fiedler vector.</p>
        ${run("complete")}` },
    ],
    takeaways: [
      "The Fiedler vector: smoothest non-constant pattern.",
      "Smallest eigenvalues, not the largest.",
      "A gap after λ₂ signals real groups.",
    ],
  },
  {
    slug: "3-clustering", nav: "Clustering", title: "Spectral Clustering of Data Points",
    subtitle: "A similarity graph, then the Laplacian",
    abstract: "30 points on a ring of radius 1 inside 90 on a ring of radius 3. k-means agrees with the rings on 52% of the points. With weights e^(−‖pᵢ − pⱼ‖²/2σ²) and σ = 0.5, the eigenvalues 0, 0.0071, 0.043 show a clear gap and the Fiedler signs separate the rings perfectly; with σ = 0.8 the gap is gone and the split is close to chance.",
    tags: ["similarity graph", "k-means fails", "the width σ", "eigenvalue gap"],
    hero: "rings", heroCaption: "Move σ and watch the gap",
    sections: [
      { id: "points", title: "From points to a graph", html: String.raw`
        ${video(VIDEO_P2)}
        $$w_{ij} = e^{-\|\mathbf p_i - \mathbf p_j\|^2/(2\sigma^2)}, \qquad L = D - W$$
        ${run("kmeans")}
        <p>k-means looks for two centres, but the rings have the same centre. The Laplacian looks at connections:</p>
        ${run("spectral")}` },
      { id: "width", title: "The width σ and the gap", html: String.raw`
        ${run("width")}
        <p>For \(k\) groups, use the eigenvectors of the \(k\) smallest eigenvalues as new coordinates and run k-means on them. Libraries usually use the normalised Laplacian \(I - D^{-1/2}WD^{-1/2}\).</p>
        ${demo("rings", "Demo 2 · Two rings", "move σ, draw new rings", "Left: k-means. Right: signs of the Fiedler vector of the similarity graph.")}
        ${callout("ml", "MACHINE LEARNING · GRAPHS", "<p>Community detection, image segmentation, graph neural networks and Laplacian positional encodings all start from \\(W\\), \\(D\\) and \\(L\\); for large graphs the smallest eigenvectors come from iterative methods (Lecture 30).</p>")}` },
    ],
    takeaways: [
      "Build W from distances, then L = D − W.",
      "Connections, not centres.",
      "Check the gap before trusting clusters.",
    ],
  },
  {
    slug: "4-practice", nav: "Practice", title: "Check, Practise, Use AI Well",
    subtitle: "Self-check, exercises, test a clustering claim",
    abstract: "Five quick questions, then the habit for spectral methods: sort the eigenvalues and check which eigenvector you are using.",
    tags: ["quiz", "exercises", "working with AI"],
    hero: "toc",
    sections: [
      { id: "quiz", title: "Check your understanding", html: String.raw`${demo("quiz", "Self-check", "five questions")}${run("cyu")}` },
      { id: "exercises", title: "Exercises", html: String.raw`
        <p>Try each exercise on paper first. <b>Hint</b> gives a nudge; <b>Full solution</b> works it through, with the code that checks every number. Stars mark the level: ★ compute or check, ★★ explain or build, ★★★ extend or combine.</p>` },
      { id: "ai", title: "Working with AI", html: String.raw`
        <p>Asked for three groups, an assistant calls <code>np.linalg.eig(L)</code> and uses columns 1 and 2 as “the two eigenvectors after the constant one”.</p>
        ${run("claim")}
        <p><code>eig</code> returns eigenvalues in no particular order: column 2 belongs to the largest eigenvalue, the roughest pattern. Use <code>eigh</code>, which sorts them, or sort first.</p>` },
    ],
    takeaways: [
      "Sort the eigenvalues (eigh).",
      "Smallest for L, largest for W.",
      "Look at the gap.",
    ],
  },
];
