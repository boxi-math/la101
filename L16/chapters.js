// Chapter content, adapted from notes/L16-determinant-properties.md. Code and outputs are copied from the note (demos.js).
// Maths is written \( … \) (inline) and $$ … $$ (display) and typeset by the vendored KaTeX (../assets/katex/).
// Section html uses String.raw so LaTeX backslashes need no doubling.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);
const video = (src) => `<div class="card video" data-video="${src}"></div>`;
const VIDEO_P1 = "media/L16-1.mp4";
const VIDEO_P2 = "media/L16-2.mp4";

const LECTURE = {
  number: 16,
  title: "Three Properties of the Determinant",
  tagline: "One number, three rules",
  lead: "The determinant packs 'is this matrix invertible?' into one number. Three rules define it: det I = 1, a row exchange flips the sign, and it is linear in each row. Everything follows: elimination leaves it alone, it is ± the product of the pivots, and det AB = det A det B.",
  heroDemo: "detMini",
  heroLabel: "det from the pivots",
  heroCaption: "The paint matrix (det 2), its exchange example B (det −3) and the singular C (det 0).",
  whyTitle: "Why determinants",
  whySub: "A single number with exact rules",
  why: [
    ["Invertibility", "\\(\\det A = 0\\) exactly when \\(A\\) is singular."],
    ["Computable", "Eliminate, count exchanges, multiply pivots: about \\(n^3/3\\) steps."],
    ["Multiplicative", "\\(\\det AB = \\det A\\,\\det B\\), \\(\\det A^\\top = \\det A\\), \\(\\det A^{-1} = 1/\\det A\\)."],
  ],
  ctaTitle: "Ready for the three rules?",
  minutes: "About 60–90 minutes",
  videos: {
    [VIDEO_P1]: "Lecture 16 · Part 1 — Three rules for the determinant",
    [VIDEO_P2]: "Lecture 16 · Part 2 — Determinants from pivots, and the product rule",
  },
};

const CHAPTERS = [
  {
    slug: "1-rules", nav: "Three rules", title: "Three Properties",
    subtitle: "and four consequences",
    abstract: "det I = 1, exchanges flip the sign, linear in each row. Then: equal rows give 0, elimination changes nothing, a zero row gives 0, triangular means the product of the diagonal.",
    tags: ["determinant", "row exchange", "linearity"],
    hero: "code:rules", heroCaption: "ad − bc obeys all three rules",
    sections: [
      { id: "rules", title: "Three properties", html: String.raw`
        ${video(VIDEO_P1)}
        ${callout("note", "DEFINITION", `<p>1. \\(\\det I = 1\\). 2. Exchanging two rows reverses the sign. 3. Linear in <b>each row separately</b>: a row times \\(t\\) gives \\(t\\det A\\); a row that is a sum splits the determinant into a sum.</p>`)}
        ${run("rules")}
        ${callout("pitfall", "PITFALL · ONE ROW, NOT THE WHOLE MATRIX", `<p>\\(\\det(tA) = t^n\\det A\\): doubling the \\(3 \\times 3\\) paint matrix multiplies its determinant by 8.</p>`)}` },
      { id: "conseq", title: "Four consequences", html: String.raw`
        <p><b>4.</b> Two equal rows: 0. <b>5.</b> Row minus a multiple of another: no change. <b>6.</b> A zero row: 0. <b>7.</b> Triangular: the product of the diagonal.</p>
        ${run("conseq")}
        ${predict("The paint matrix with rows 1 and 3 exchanged? With row 2 multiplied by −3?", `<p>\\(-2\\) (rule 2) and \\(-6\\) (rule 3a).</p>${run("predict")}`)}` },
    ],
    takeaways: [
      "Three rules define det.",
      "Elimination steps do not change it.",
      "det(tA) = tⁿ det A.",
    ],
  },
  {
    slug: "2-pivots", nav: "Pivots", title: "The Determinant from the Pivots",
    subtitle: "Products, transposes, inverses",
    abstract: "det A = ± the product of the pivots. It is 0 exactly for singular matrices, it multiplies, and every row rule holds for columns.",
    tags: ["pivots", "det AB", "det Aᵀ"],
    hero: "det", heroCaption: "Type a square matrix; step through the elimination.",
    sections: [
      { id: "pivots", title: "± the product of the pivots", html: String.raw`
        ${video(VIDEO_P2)}
        $$\det A = \pm\,(\text{product of the pivots}),\quad + \text{ even number of exchanges}, - \text{ odd}$$
        ${run("pivots")}
        <p><b>8.</b> \(\det A = 0 \iff A\) is singular.</p>` },
      { id: "product", title: "Products, transposes and inverses", html: String.raw`
        <p><b>9.</b> \(\det AB = \det A\det B\). <b>10.</b> \(\det A^\top = \det A\), so every rule about rows holds for columns.</p>
        ${run("product")}` },
      { id: "notadd", title: "What not to do", html: String.raw`
        ${run("notadd")}
        ${callout("pitfall", "PITFALL · SIZE IS NOT NEAR-SINGULARITY", `<p>\\(\\det(0.1\\,I_{50}) = 10^{-50}\\) with condition number 1; the shear \\(\\left[\\begin{smallmatrix} 1 & 1000 \\\\ 0 & 1 \\end{smallmatrix}\\right]\\) has det 1 and condition number about \\(10^6\\). Test with pivots, rank or the condition number.</p>`)}` },
    ],
    takeaways: [
      "det A = ± product of pivots.",
      "det AB = det A det B; det Aᵀ = det A.",
      "det(A + B) ≠ det A + det B.",
    ],
  },
  {
    slug: "3-practice", nav: "Practice", title: "Check, Practise, Use AI Well",
    subtitle: "Self-check, exercises, and checking a claimed determinant",
    abstract: "Five quick questions, the exercises, and the forgotten sign of a row exchange.",
    tags: ["quiz", "exercises", "working with AI"],
    hero: "toc",
    sections: [
      { id: "quiz", title: "Check your understanding", html: String.raw`${demo("quiz", "Self-check", "five questions")}` },
      { id: "exercises", title: "Exercises", html: String.raw`
        <p>Try each exercise on paper first. <b>Hint</b> gives a nudge; <b>Full solution</b> works it through, with the code that checks every number. Stars mark the level: ★ compute or check, ★★ explain or build, ★★★ extend or combine.</p>` },
      { id: "ai", title: "Working with AI", html: String.raw`
        <p>Recompute, and count the row exchanges. A made-up elimination of \(B\) forgot the sign:</p>
        ${run("claim")}` },
    ],
    takeaways: [
      "Recompute with np.linalg.det or fractions.",
      "Count the exchanges.",
      "Ask for rank and condition, not the size of det.",
    ],
  },
];
