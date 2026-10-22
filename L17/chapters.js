// Chapter content, adapted from notes/L17-determinant-formulas-uses.md. Code and outputs are copied from the note (demos.js).
// Maths is written \( … \) (inline) and $$ … $$ (display) and typeset by the vendored KaTeX (../assets/katex/).
// Section html uses String.raw so LaTeX backslashes need no doubling.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);
const video = (src) => `<div class="card video" data-video="${src}"></div>`;
const VIDEO_P1 = "media/L17-1.mp4";
const VIDEO_P2 = "media/L17-2.mp4";

const LECTURE = {
  number: 17,
  title: "Determinant Formulas and Uses",
  tagline: "Formulas, areas, volumes and densities",
  lead: "Splitting every row gives the big formula, one term per permutation. Cofactors organise it and give the inverse and Cramer's rule. Then the meaning: |det A| is an area or a volume, every area is scaled by it, the Jacobian makes that local, and densities are divided by it.",
  heroDemo: "areaMini",
  heroLabel: "Signed area",
  heroCaption: "The robot's moves (det −7), the same columns reversed (+7), a flat pair (0), and the unit square (1).",
  whyTitle: "Why formulas and areas",
  whySub: "Understanding, not computing",
  why: [
    ["Cofactors", "\\(\\det A = \\sum_j a_{ij}C_{ij}\\); \\(A^{-1} = C^\\top/\\det A\\); Cramer's \\(x_j = \\det B_j/\\det A\\)."],
    ["Area and volume", "\\(|\\det A|\\) is the area or volume spanned by the columns; the sign is orientation."],
    ["Densities", "\\(p_X(\\mathbf{x}) = p_Z(M^{-1}\\mathbf{x})/|\\det M|\\); log-likelihoods gain a log-determinant."],
  ],
  ctaTitle: "Ready for the formulas?",
  minutes: "About 60–90 minutes",
  videos: {
    [VIDEO_P1]: "Lecture 17 · Part 1 — Formulas for the determinant",
    [VIDEO_P2]: "Lecture 17 · Part 2 — Determinants as areas, volumes and densities",
  },
};

const CHAPTERS = [
  {
    slug: "1-formulas", nav: "Formulas", title: "The Big Formula and Cofactors",
    subtitle: "One term per permutation",
    abstract: "Rule 3 splits the determinant into n! pieces; cofactors group them by a row, and pay off when a row has zeros.",
    tags: ["permutations", "cofactors", "minors"],
    hero: "code:big", heroCaption: "The paint matrix: 48 + 8 + 16 − 32 − 32 − 6 = 2",
    sections: [
      { id: "big", title: "The big formula", html: String.raw`
        ${video(VIDEO_P1)}
        $$\det A = \sum_{\sigma} (\det P_\sigma)\, a_{1\sigma(1)} a_{2\sigma(2)} \cdots a_{n\sigma(n)}$$
        ${run("big")}
        <p>\(n!\) terms: for understanding, not for computing.</p>` },
      { id: "cof", title: "Cofactors", html: String.raw`
        ${callout("note", "DEFINITION", `<p>The <b>minor</b> \\(M_{ij}\\) deletes row \\(i\\) and column \\(j\\); the <b>cofactor</b> is \\(C_{ij} = (-1)^{i+j}M_{ij}\\). Along row \\(i\\): \\(\\det A = a_{i1}C_{i1} + \\dots + a_{in}C_{in}\\).</p>`)}
        ${run("cof")}
        ${callout("pitfall", "PITFALL · THE SIGN BELONGS TO THE POSITION", `<p>Dropping the minus in position (1, 2) turns the paint matrix's \\(16 - 24 + 10 = 2\\) into 50.</p>`)}` },
      { id: "inverse", title: "The inverse and Cramer's rule", html: String.raw`
        $$A^{-1} = \frac{C^\top}{\det A}, \qquad x_j = \frac{\det B_j}{\det A}$$
        ${run("inverse")}
        ${run("cramer")}
        ${callout("pitfall", "PITFALL · A FORMULA, NOT AN ALGORITHM", `<p>Cramer's rule needs \\(n + 1\\) determinants. Use it for \\(2 \\times 2\\), proofs and formulas with letters; solve numbers by elimination.</p>`)}` },
    ],
    takeaways: [
      "n! terms, one per permutation.",
      "Cofactor signs: a checkerboard.",
      "A⁻¹ = Cᵀ / det A.",
    ],
  },
  {
    slug: "2-area", nav: "Area", title: "Area, Volume and the Jacobian",
    subtitle: "What the determinant measures",
    abstract: "|det| is the area of the parallelogram or the volume of the box; every area is scaled by it; the Jacobian makes it local.",
    tags: ["area", "volume", "Jacobian"],
    hero: "area", heroCaption: "Move the two columns; watch the area and its sign.",
    sections: [
      { id: "area", title: "Area and orientation", html: String.raw`
        ${video(VIDEO_P2)}
        $$\text{area} = \left|\det\begin{bmatrix} 1 & 2 \\ 3 & -1 \end{bmatrix}\right| = 7$$
        ${run("area")}
        <p>The sign records orientation: \(-7\) because \(\mathbf{b}\) turns clockwise from \(\mathbf{a}\).</p>` },
      { id: "volume", title: "Volume and area scaling", html: String.raw`
        ${run("volume")}
        ${run("scale")}` },
      { id: "jacobian", title: "The Jacobian", html: String.raw`
        $$J = \begin{bmatrix} \cos\theta & -r\sin\theta \\ \sin\theta & r\cos\theta \end{bmatrix}, \qquad \det J = r$$
        ${run("polar")}
        ${callout("note", "PATTERN", `<p>\\(dx\\,dy = |\\det J|\\,ds\\,dt\\): the local version of "a matrix scales areas by \\(|\\det A|\\)".</p>`)}` },
    ],
    takeaways: [
      "Area = |det|; the sign is orientation.",
      "Every area is scaled by |det A|.",
      "Jacobian: the local scaling factor.",
    ],
  },
  {
    slug: "3-densities", nav: "Densities", title: "Machine Learning: Densities and log det",
    subtitle: "Probability per unit area",
    abstract: "Mapping data by M divides densities by |det M|. Sampling confirms it; normalizing flows are built on it; log-determinants avoid underflow.",
    tags: ["density", "normalizing flows", "slogdet"],
    hero: "code:density", heroCaption: "200,000 samples: 0.0051 vs the formula's 0.005",
    sections: [
      { id: "density", title: "Densities", html: String.raw`
        $$p_X(\mathbf{x}) = \frac{p_Z(M^{-1}\mathbf{x})}{|\det M|}$$
        ${run("density")}
        ${run("slogdet")}` },
    ],
    takeaways: [
      "Densities are divided by |det|.",
      "Triangular Jacobians: log det = sum of logs.",
      "Use slogdet.",
    ],
  },
  {
    slug: "4-practice", nav: "Practice", title: "Check, Practise, Use AI Well",
    subtitle: "Self-check, exercises, and checking a claimed inverse",
    abstract: "Five quick questions, the exercises, and the one-line check that catches C instead of Cᵀ.",
    tags: ["quiz", "exercises", "working with AI"],
    hero: "toc",
    sections: [
      { id: "quiz", title: "Check your understanding", html: String.raw`${demo("quiz", "Self-check", "five questions")}` },
      { id: "exercises", title: "Exercises", html: String.raw`
        <p>Try each exercise on paper first. <b>Hint</b> gives a nudge; <b>Full solution</b> works it through, with the code that checks every number. Stars mark the level: ★ compute or check, ★★ explain or build, ★★★ extend or combine.</p>` },
      { id: "ai", title: "Working with AI", html: String.raw`
        <p>Multiply: \(AA^{-1}\) must be \(I\). A made-up answer used \(C\) instead of \(C^\top\):</p>
        ${run("claim")}` },
    ],
    takeaways: [
      "AA⁻¹ = I.",
      "Area is |det|, never negative.",
      "Divide densities by |det|.",
    ],
  },
];
