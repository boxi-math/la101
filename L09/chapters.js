// Chapter content, adapted from notes/L09-independence-basis-dimension.md. Code and outputs are copied from the note (demos.js).
// Maths is written \( … \) (inline) and $$ … $$ (display) and typeset by the vendored KaTeX (../assets/katex/).
// Section html uses String.raw so LaTeX backslashes need no doubling.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);
const video = (src) => `<div class="card video" data-video="${src}"></div>`;
const VIDEO_P1 = "media/L09-1.mp4";
const VIDEO_P2 = "media/L09-2.mp4";

const LECTURE = {
  number: 9,
  title: "Independence, Basis and Dimension",
  tagline: "The fewest vectors that describe a space",
  lead: "Four drone buttons reach a plane, and any two of them would do. Independence says no vector is wasted, spanning says nothing is missing, and together they make a basis. Every basis of a space has the same size: its dimension.",
  heroDemo: "basisMini",
  heroLabel: "Independent? Spanning?",
  heroCaption: "Sets of drone buttons: a basis of the plane, a dependent triple, a basis of R³, and another basis of the plane.",
  whyTitle: "Why a basis",
  whySub: "No waste, nothing missing",
  why: [
    ["Independence", "Only the zero combination gives 0: rank = number of vectors."],
    ["Coordinates", "In a basis, every vector has exactly one set of amounts."],
    ["Dimension", "dim C(A) = r and dim N(A) = n − r. Redundant features are a dependence."],
  ],
  ctaTitle: "Ready to count dimensions?",
  minutes: "About 60–90 minutes",
  videos: {
    [VIDEO_P1]: "Lecture 9 · Part 1 — Independence and span",
    [VIDEO_P2]: "Lecture 9 · Part 2 — Basis and dimension",
  },
};

const CHAPTERS = [
  {
    slug: "1-independence", nav: "Independence", title: "Independence and Span",
    subtitle: "No waste, nothing missing",
    abstract: "Every pair of the drone's four buttons reaches the same plane. Independence and span make that precise.",
    tags: ["independent", "dependent", "span"],
    hero: "basis", heroCaption: "Type vectors; read off rank, independence, span and a basis.",
    sections: [
      { id: "pairs", title: "Four buttons, one plane", html: String.raw`
        ${video(VIDEO_P1)}
        $$A = \begin{bmatrix} 1 & 1 & 3 & 0 \\ 2 & 3 & 7 & 1 \\ 1 & 2 & 4 & 1 \end{bmatrix}, \qquad \mathbf{w} = 2\mathbf{u} + \mathbf{v}, \quad \mathbf{s} = \mathbf{v} - \mathbf{u}.$$
        ${run("pairs")}` },
      { id: "indep", title: "Independence", html: String.raw`
        ${callout("note", "DEFINITION", `<p>Vectors are <b>linearly independent</b> when the only combination giving \\(\\mathbf{0}\\) has all amounts zero. Otherwise they are <b>dependent</b>.</p>`)}
        $$\text{columns independent} \iff N(A) = \{\mathbf{0}\} \iff \text{no free variables} \iff r = n.$$
        ${run("indep")}
        ${callout("pitfall", "PITFALL · DEPENDENT IS NOT PARALLEL", `<p>No two of <b>u</b>, <b>v</b>, <b>w</b> are multiples of each other, yet \\(\\mathbf{w} = 2\\mathbf{u} + \\mathbf{v}\\). Test with the rank, not two at a time.</p>`)}` },
      { id: "span", title: "Span", html: String.raw`
        <p>The <b>span</b> of some vectors is all their combinations; \(C(A)\) is the span of the columns. <b>u</b> and <b>v</b> span the plane \(C(A)\) but not \(\mathbf{R}^3\):</p>
        ${run("span")}` },
    ],
    takeaways: [
      "Independent ⇔ rank = number of vectors.",
      "More than m vectors in Rᵐ are dependent.",
      "Span = all combinations; always name the space.",
    ],
  },
  {
    slug: "2-basis", nav: "Basis", title: "Basis, Coordinates, Dimension",
    subtitle: "Many bases, one size",
    abstract: "A basis is independent and spans. Coordinates in a basis are unique. All bases of a space have the same number of vectors.",
    tags: ["basis", "coordinates", "dimension"],
    hero: "code:coords", heroCaption: "(2, 5, 3) in three bases",
    sections: [
      { id: "basis", title: "Basis and coordinates", html: String.raw`
        ${video(VIDEO_P2)}
        ${callout("note", "DEFINITION", `<p>A <b>basis</b> of a subspace \\(S\\) is a set of vectors that is independent and spans \\(S\\). The amounts that give a vector are its <b>coordinates</b>, and they are unique.</p>`)}
        ${run("coords")}
        ${predict("Do <b>u</b>, <b>v</b>, <b>w</b> form a basis of \\(C(A)\\)? Do <b>u</b>, <b>v</b>, \\((1, 1, 1)\\)?", `<p>Neither. <b>u</b>, <b>v</b>, <b>w</b> are dependent; \\((1, 1, 1)\\) is not in \\(C(A)\\).</p>${run("basischeck")}`)}` },
      { id: "dim", title: "Dimension", html: String.raw`
        <p><b>All bases of a subspace have the same number of vectors</b>: the <b>dimension</b>.</p>
        <table><tr><th>subspace</th><th>a basis</th><th>dimension</th></tr>
        <tr><td>\(C(A)\)</td><td>the pivot columns of \(A\)</td><td>\(r\)</td></tr>
        <tr><td>\(N(A)\)</td><td>the special solutions</td><td>\(n - r\)</td></tr></table>
        <p>For the drone both are 2. <b>The rank is the dimension of the column space.</b></p>
        ${callout("pitfall", "PITFALL · PIVOT COLUMNS OF A, NOT R", run("rpivot"))}` },
    ],
    takeaways: [
      "Basis = independent + spanning.",
      "Coordinates in a basis are unique.",
      "dim C(A) = r, dim N(A) = n − r.",
    ],
  },
  {
    slug: "3-dummy", nav: "Dummy trap", title: "The Dummy-Variable Trap",
    subtitle: "One-hot columns plus an intercept are dependent",
    abstract: "A café's weather as one-hot columns next to an intercept: four columns, rank 3. Drop one category and the coefficients are unique again.",
    tags: ["one-hot", "rank", "ML"],
    hero: "code:onehot", heroCaption: "Intercept + sunny + cloudy + rainy",
    sections: [
      { id: "onehot", title: "Four columns, rank 3", html: String.raw`
        ${run("onehot")}
        <p>Sunny + cloudy + rainy = intercept, so \((1, -1, -1, -1)\) is in the nullspace and the coefficients are not determined. Drop one category; it becomes the baseline:</p>
        ${run("drop")}
        ${callout("note", "ML", `<p>numpy decides rank with a tolerance close to rounding error, so <em>nearly</em> dependent columns count as independent, yet still make fitted weights unstable (Lecture 29).</p>`)}
        ${run("almost")}` },
    ],
    takeaways: [
      "Intercept + all one-hot columns: dependent.",
      "Drop one category: independent, unique coefficients.",
      "Near-dependence depends on the tolerance.",
    ],
  },
  {
    slug: "4-practice", nav: "Practice", title: "Check, Practise, Use AI Well",
    subtitle: "Self-check, exercises, and checking a claimed basis",
    abstract: "Five quick questions, the exercises, and three tests for any claimed basis: the count, independence, and membership.",
    tags: ["quiz", "exercises", "working with AI"],
    hero: "toc",
    sections: [
      { id: "quiz", title: "Check your understanding", html: String.raw`${demo("quiz", "Self-check", "five questions")}` },
      { id: "exercises", title: "Exercises", html: String.raw`
        <p>Try each exercise on paper first. <b>Hint</b> gives a nudge; <b>Full solution</b> works it through, with the code that checks every number. Stars mark the level: ★ compute or check, ★★ explain or build, ★★★ extend or combine.</p>` },
      { id: "ai", title: "Working with AI", html: String.raw`
        <p>A claimed basis of \(C(A)\) must have \(r\) vectors, be independent, and lie in the space (\(b_1 - b_2 + b_3 = 0\)). The classic slip, the pivot columns of \(R\):</p>
        ${run("claim")}
        <p>Count and independence pass; membership fails.</p>` },
    ],
    takeaways: [
      "r vectors.",
      "Independent.",
      "Each one really in the space.",
    ],
  },
];
