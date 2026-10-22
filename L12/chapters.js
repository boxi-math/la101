// Chapter content, adapted from notes/L12-orthogonality.md. Code and outputs are copied from the note (demos.js).
// Maths is written \( … \) (inline) and $$ … $$ (display) and typeset by the vendored KaTeX (../assets/katex/).
// Section html uses String.raw so LaTeX backslashes need no doubling.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);
const video = (src) => `<div class="card video" data-video="${src}"></div>`;
const VIDEO_P1 = "media/L12-1.mp4";
const VIDEO_P2 = "media/L12-2.mp4";

const LECTURE = {
  number: 12,
  title: "Orthogonality",
  tagline: "Dot products, right angles and the two perpendicular pairs",
  lead: "One number, the dot product, gives lengths, angles and right angles. Then whole subspaces are perpendicular: the row space meets the nullspace at a right angle, the column space meets the left nullspace, and every recipe splits into a part that moves the drone and a part that does nothing.",
  heroDemo: "angleMini",
  heroLabel: "Angles from dot products",
  heroCaption: "Pairs of robot moves: the dot product, the cosine and the angle. A zero dot product is a right angle.",
  whyTitle: "Why perpendicular",
  whySub: "Right angles organise the four subspaces",
  why: [
    ["Dot product", "a·b = aᵀb gives ‖a‖ = √(a·a) and cos θ = a·b / (‖a‖‖b‖)."],
    ["Complements", "N(A) = C(Aᵀ)^⊥ in Rⁿ, N(Aᵀ) = C(A)^⊥ in Rᵐ."],
    ["Cosine similarity", "Compare directions, not sizes: tastes, documents, embeddings."],
  ],
  ctaTitle: "Ready for right angles?",
  minutes: "About 60–90 minutes",
  videos: {
    [VIDEO_P1]: "Lecture 12 · Part 1 — Dot products, lengths and angles",
    [VIDEO_P2]: "Lecture 12 · Part 2 — Orthogonal subspaces and complements",
  },
};

const CHAPTERS = [
  {
    slug: "1-angles", nav: "Angles", title: "Dot Products, Lengths and Angles",
    subtitle: "One number does three jobs",
    abstract: "The dot product multiplies matching entries and adds. Its square root on a·a is the length, divided by two lengths it is a cosine, and zero means perpendicular.",
    tags: ["dot product", "length", "cosine", "perpendicular"],
    hero: "angle", heroCaption: "Drag the entries of a and b.",
    sections: [
      { id: "dot", title: "Dot products and lengths", html: String.raw`
        ${video(VIDEO_P1)}
        $$\mathbf{a}\cdot\mathbf{b} = \mathbf{a}^\top\mathbf{b} = a_1b_1 + \dots + a_nb_n, \qquad \|\mathbf{a}\| = \sqrt{\mathbf{a}\cdot\mathbf{a}}.$$
        <p>One press of the drone's button \(\mathbf{u} = (1, 2, 1)\) moves it \(\sqrt 6\) metres.</p>
        ${run("dot")}
        <p>All the dot products of the buttons at once: \(D^\top D\).</p>
        ${run("gram")}` },
      { id: "angle", title: "Angles", html: String.raw`
        $$\cos\theta = \frac{\mathbf{a}\cdot\mathbf{b}}{\|\mathbf{a}\|\,\|\mathbf{b}\|}, \qquad |\mathbf{a}\cdot\mathbf{b}| \le \|\mathbf{a}\|\,\|\mathbf{b}\|.$$
        ${run("cosine")}
        ${callout("pitfall", "PITFALL · A BIG DOT PRODUCT IS NOT A SMALL ANGLE", "<p>u·(10, 0, 0) = 10 is bigger than u·v = 9, yet the angle is 65.9°, not 10.9°. Divide by the lengths before comparing.</p>")}` },
      { id: "perp", title: "Perpendicular vectors", html: String.raw`
        <p>The robot's row \((1, 2)\) and its nullspace direction \((2, -1)\): dot product zero, and Pythagoras holds.</p>
        ${run("perp")}` },
    ],
    takeaways: [
      "‖a‖² = a·a.",
      "cos θ = a·b / (‖a‖‖b‖).",
      "a·b = 0 ⇔ perpendicular ⇔ ‖a + b‖² = ‖a‖² + ‖b‖².",
    ],
  },
  {
    slug: "2-subspaces", nav: "Subspaces", title: "Orthogonal Subspaces and Complements",
    subtitle: "Row space ⊥ nullspace, column space ⊥ left nullspace",
    abstract: "Ax = 0 read row by row says x is perpendicular to every row. Each pair is more than perpendicular: each contains everything perpendicular to the other, and the dimensions add up.",
    tags: ["orthogonal subspaces", "complement", "dimensions"],
    hero: "code:subs", heroCaption: "Every dot product of the bases is zero",
    sections: [
      { id: "pairs", title: "The two perpendicular pairs", html: String.raw`
        ${video(VIDEO_P2)}
        $$C(A^\top) \perp N(A) \ \text{ in } \mathbf{R}^n, \qquad C(A) \perp N(A^\top) \ \text{ in } \mathbf{R}^m.$$
        ${run("subs")}` },
      { id: "comp", title: "Orthogonal complements", html: String.raw`
        <p>\(N(A)\) is <b>all</b> of the vectors perpendicular to the row space; the dimensions fit, \(r + (n - r) = n\). Together the two bases make a basis of \(\mathbf{R}^4\):</p>
        ${run("basis4")}
        ${callout("pitfall", "PITFALL · PERPENDICULAR PLANES ARE NOT ORTHOGONAL SUBSPACES", "<p>A wall and a floor meet at a right angle, but they share a whole line. Orthogonal subspaces meet only at 0.</p>")}
        ${run("planes")}` },
    ],
    takeaways: [
      "C(Aᵀ) ⊥ N(A), C(A) ⊥ N(Aᵀ).",
      "Complements: dimensions add to n (or m).",
      "Orthogonal subspaces share only 0.",
    ],
  },
  {
    slug: "3-split", nav: "Split", title: "Splitting a Recipe; Cosine Similarity",
    subtitle: "x = xᵣ + xₙ, and comparing tastes",
    abstract: "Every recipe splits into a row-space part, which moves the drone, and a nullspace part, which does nothing. Cosine similarity compares the café drinks by direction.",
    tags: ["split", "row space part", "cosine similarity", "ML"],
    hero: "cafe", heroCaption: "Cosines of the café drinks' rating columns",
    sections: [
      { id: "split", title: "Splitting a recipe", html: String.raw`
        $$\mathbf{x} = \mathbf{x}_r + \mathbf{x}_n, \qquad A\mathbf{x} = A\mathbf{x}_r.$$
        ${run("split")}
        ${run("splitlen")}
        <p>Every recipe that reaches the same place has the <b>same</b> row-space part:</p>
        ${run("splitsame")}` },
      { id: "ml", title: "Machine learning: cosine similarity", html: String.raw`
        ${run("cafe")}
        ${run("unit")}
        ${callout("ml", "ML", "<p>Search engines and recommenders compare embeddings by cosine similarity: normalise each vector to length 1 and the dot product is the cosine.</p>")}` },
    ],
    takeaways: [
      "Only xᵣ moves the drone.",
      "xᵣ is the same for every solution.",
      "Cosine = dot product of unit vectors.",
    ],
  },
  {
    slug: "4-practice", nav: "Practice", title: "Check, Practise, Use AI Well",
    subtitle: "Self-check, exercises, and checking perpendicularity",
    abstract: "Four quick questions, the exercises, and three checks for any claim about orthogonal subspaces or cosines.",
    tags: ["quiz", "exercises", "working with AI"],
    hero: "toc",
    sections: [
      { id: "quiz", title: "Check your understanding", html: String.raw`${demo("quiz", "Self-check", "four questions")}` },
      { id: "exercises", title: "Exercises", html: String.raw`
        <p>Try each exercise on paper first. <b>Hint</b> gives a nudge; <b>Full solution</b> works it through, with the code that checks every number. Stars mark the level: ★ compute or check, ★★ explain or build, ★★★ extend or combine.</p>` },
      { id: "ai", title: "Working with AI", html: String.raw`
        <p><b>Check</b> (1) dot products of the claimed bases are all zero; (2) the dimensions add to \(n\); (3) any cosine lies between −1 and 1. A made-up answer calls the drone's row space and <b>column</b> space perpendicular:</p>
        ${run("claim")}
        <p>Row-space vectors have 4 entries and column-space vectors 3: their dot product is not even defined.</p>` },
    ],
    takeaways: [
      "Check bases with one matrix product.",
      "Dimensions must add up.",
      "Row space pairs with nullspace, column space with left nullspace.",
    ],
  },
];
