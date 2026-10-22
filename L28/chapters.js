// Chapter content, adapted from notes/L28-pseudoinverse.md. Code and outputs are copied from the note (demos.js).
// Maths is written \( … \) (inline) and $$ … $$ (display) and typeset by the vendored KaTeX (../assets/katex/).
// Section html uses String.raw so LaTeX backslashes need no doubling.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);
const video = (src) => `<div class="card video" data-video="${src}"></div>`;
const VIDEO_P1 = "media/L28-1.mp4";
const VIDEO_P2 = "media/L28-2.mp4";

const LECTURE = {
  number: 28,
  title: "The Pseudoinverse",
  tagline: "The best answer to any Ax = b",
  lead: "Only square matrices of full rank have an inverse. A tall matrix with independent columns has a left inverse, a wide one a right inverse, and every matrix has the pseudoinverse A⁺ = VΣ⁺Uᵀ from the SVD. A⁺b is the least-squares answer, and when there are many, the shortest one. Tiny singular values must be cut off, and ridge regression tends to A⁺b.",
  heroDemo: "shortestMini",
  heroLabel: "the shortest solution",
  heroCaption: "Every point on the line solves x + 2y = 5; x⁺ = (1, 2) is the shortest, at right angles to the line.",
  whyTitle: "Why the pseudoinverse",
  whySub: "One best answer, every time",
  why: [
    ["Every matrix", "\\(A^+ = V\\Sigma^+U^\\top\\) inverts the nonzero singular values and nothing else."],
    ["Best and shortest", "\\(A^+\\mathbf b\\) is a least-squares solution, and the shortest one: it lies in the row space."],
    ["Machine learning", "More features than samples: the minimum-norm fit, and the limit of ridge regression."],
  ],
  ctaTitle: "Ready for the best answer?",
  minutes: "About 60–90 minutes",
  videos: {
    [VIDEO_P1]: "Lecture 28 · Part 1 — Left, right and pseudo inverses",
    [VIDEO_P2]: "Lecture 28 · Part 2 — The shortest best answer",
  },
};

const CHAPTERS = [
  {
    slug: "1-left-right", nav: "Left & right", title: "Left and Right Inverses",
    subtitle: "Tall and wide matrices",
    abstract: "Three readings 1, 2, 4 at t = 0, 1, 2 give a tall A with a left inverse L = (AᵀA)⁻¹Aᵀ: LA = I, but AL is the projection onto the column space. One equation x₁ + x₂ + 2x₃ = 4 has a right inverse (1, 1, 2)/6.",
    tags: ["LA = I", "AR = I", "AL is a projection"],
    hero: "pinv", heroCaption: "Type A and b, or pick one",
    sections: [
      { id: "left", title: "A left inverse", html: String.raw`
        ${video(VIDEO_P1)}
        ${run("left")}
        <p>\(L\mathbf b\) gives the least-squares line \(c = 5/6\), \(d = 3/2\). The other order is a projection, not \(I\):</p>
        ${run("alr")}` },
      { id: "right", title: "A right inverse", html: String.raw`
        $$R = A^\top(AA^\top)^{-1}, \qquad AR = I$$
        ${run("right")}
        ${predict("\\(B = \\begin{bmatrix} 1 & 2 \\\\ 2 & 4 \\\\ 2 & 4 \\end{bmatrix}\\) has rank one. A left inverse? A right inverse?", "<p>Neither: its columns are dependent and so are its rows. It still has a pseudoinverse.</p>")}` },
    ],
    takeaways: [
      "Tall, independent columns: LA = I.",
      "Wide, independent rows: AR = I.",
      "The other order: a projection.",
    ],
  },
  {
    slug: "2-pseudo", nav: "A⁺", title: "The Pseudoinverse from the SVD",
    subtitle: "Invert the nonzero σ's only",
    abstract: "A⁺ = VΣ⁺Uᵀ sends each uᵢ back to vᵢ/σᵢ and the rest to zero. For the rank-one B, B⁺ = Bᵀ/45. AA⁺ and A⁺A are the projections onto the column and row spaces (the Penrose conditions).",
    tags: ["A⁺ = VΣ⁺Uᵀ", "Penrose conditions", "B⁺ = Bᵀ/45"],
    hero: "pinv", heroCaption: "Watch which σ's are inverted",
    sections: [
      { id: "svd", title: "Built from the SVD", html: String.raw`
        $$A^+ = V\Sigma^+U^\top = \sum_{i \le r}\frac{1}{\sigma_i}\,\mathbf v_i\mathbf u_i^\top$$
        ${run("bplus")}
        ${run("penrose")}
        <p>With independent columns \(A^+\) is the left inverse; with independent rows, the right inverse:</p>
        ${run("same")}
        ${callout("pitfall", "PITFALL · A⁺A IS NOT I", String.raw`<p>\(B(2, 0) = B(0, 1) = (2, 4, 4)\): no matrix can tell the two inputs apart afterwards. Undoing works only on the row space.</p>`)}
        ${demo("pinv", "Demo 1 · Pseudoinverse calculator", "type A and b, move the cut-off", "Pick ‘nearly singular N’: with rcond 10⁻¹⁵ the tiny σ is inverted and the answer is about 10⁷; raise it to 10⁻⁸.")}` },
    ],
    takeaways: [
      "Σ⁺: 1/σ for nonzero σ, zeros stay.",
      "AA⁺, A⁺A: projections.",
      "Rank-one B: B⁺ = Bᵀ/σ₁².",
    ],
  },
  {
    slug: "3-shortest", nav: "Shortest", title: "The Shortest Best Answer",
    subtitle: "Least squares, minimum norm, ridge",
    abstract: "A⁺b lies in the row space, and every other least-squares solution adds a perpendicular null-space vector, so A⁺b is the shortest. Tiny σ's must be cut off. With 3 samples and 5 features, ridge regression tends to the pseudoinverse fit as λ → 0.",
    tags: ["minimum norm", "rcond", "ridge"],
    hero: "shortest", heroCaption: "Move the equation and the other solution",
    sections: [
      { id: "short", title: "Why the shortest", html: String.raw`
        ${video(VIDEO_P2)}
        $$\|\mathbf x^+ + \mathbf n\|^2 = \|\mathbf x^+\|^2 + \|\mathbf n\|^2, \qquad \mathbf x^+ \in \text{row space},\ \mathbf n \in \text{null space}$$
        ${run("shortest")}
        ${run("both")}
        ${demo("shortest", "Demo 2 · The shortest solution", "move a, b and the other solution", "The step along the line is always perpendicular to x⁺.")}
        ${callout("pitfall", "PITFALL · TINY σ", String.raw`<p>A \(\sigma\) of \(5\cdot 10^{-11}\) is rounding noise for zero; inverting it turns a change of 0.001 into an answer of size \(10^7\).</p>` + run("tiny"))}` },
      { id: "ml", title: "More features than samples", html: String.raw`
        ${run("features")}
        <p>Ridge \(\mathbf w_\lambda = (X^\top X + \lambda I)^{-1}X^\top\mathbf y\) replaces \(1/\sigma_i\) by \(\sigma_i/(\sigma_i^2 + \lambda)\) and tends to \(\mathbf w^+\):</p>
        ${run("ridge")}
        ${demo("ridge", "Demo 3 · Ridge tends to w⁺", "move λ", "X is the note's 3-by-5 matrix rounded to 4 decimals, so the last digit can differ.")}` },
    ],
    takeaways: [
      "A⁺b: least squares, then shortest.",
      "Cut off tiny σ's.",
      "Ridge → A⁺b as λ → 0.",
    ],
  },
  {
    slug: "4-practice", nav: "Practice", title: "Check, Practise, Use AI Well",
    subtitle: "Self-check, exercises, avoid (BᵀB)⁻¹",
    abstract: "Five quick questions, then the habit for least squares: never invert BᵀB without knowing the columns are independent; compare with lstsq or pinv.",
    tags: ["quiz", "exercises", "working with AI"],
    hero: "toc",
    sections: [
      { id: "quiz", title: "Check your understanding", html: String.raw`${demo("quiz", "Self-check", "five questions")}${run("cyu")}` },
      { id: "exercises", title: "Exercises", html: String.raw`
        <p>Try each exercise on paper first. <b>Hint</b> gives a nudge; <b>Full solution</b> works it through, with the code that checks every number. Stars mark the level: ★ compute or check, ★★ explain or build, ★★★ extend or combine.</p>` },
      { id: "ai", title: "Working with AI", html: String.raw`
        <p>An assistant answers with <code>np.linalg.inv(B.T @ B) @ B.T @ c</code> for the rank-one \(B\):</p>
        ${run("claim")}
        <p>\(B^\top B\) is singular, so the formula fails (or, with rounding, returns huge numbers). <code>lstsq</code> or <code>pinv</code> give the shortest least-squares answer \((0.2444, 0.4889)\).</p>` },
    ],
    takeaways: [
      "(AᵀA)⁻¹ needs independent columns.",
      "Check against lstsq or pinv.",
      "Many solutions: ask for the shortest.",
    ],
  },
];
