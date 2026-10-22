// Chapter content, adapted from notes/L25-linear-transformations-change-of-basis.md. Code and outputs are copied from the note (demos.js).
// Maths is written \( … \) (inline) and $$ … $$ (display) and typeset by the vendored KaTeX (../assets/katex/).
// Section html uses String.raw so LaTeX backslashes need no doubling.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);
const video = (src) => `<div class="card video" data-video="${src}"></div>`;
const VIDEO_P1 = "media/L25-1.mp4";
const VIDEO_P2 = "media/L25-2.mp4";

const LECTURE = {
  number: 25,
  title: "Linear Transformations, Change of Basis and Similar Matrices",
  tagline: "One map, many matrices",
  lead: "Polynomials and functions are vectors too, and a basis gives them coordinates. A linear map is known from what it does to a basis, so its matrix is built column by column — the derivative becomes a matrix. Change the basis and the same map gets the similar matrix B⁻¹AB, with the same eigenvalues, trace and determinant. Diagonalizing is changing to the eigenvector basis; when there are too few eigenvectors, a Jordan block is the best possible.",
  heroDemo: "basisMini",
  heroLabel: "Lecture 18's A in three bases",
  heroCaption: "Standard basis, the shear basis (1, 0), (1, 1), and the eigenvectors (1, 1), (1, −2): diagonal.",
  whyTitle: "Why change the basis",
  whySub: "A good basis makes a property visible",
  why: [
    ["The matrix of a map", "Column \\(j\\) = coordinates of \\(T(\\mathbf v_j)\\); \\(D\\) on \\(P_2\\) is \\(\\left[\\begin{smallmatrix} 0 & 1 & 0 \\\\ 0 & 0 & 2 \\\\ 0 & 0 & 0 \\end{smallmatrix}\\right]\\)."],
    ["Similar matrices", "\\(C = M^{-1}AM\\): one map, two bases; same eigenvalues, trace, determinant, rank."],
    ["Reparameterizing", "Same predictions with \\(\\mathbf w' = M^{-\\top}\\mathbf w\\); different Hessian, different training speed."],
  ],
  ctaTitle: "Ready for maps and bases?",
  minutes: "About 60–90 minutes",
  videos: {
    [VIDEO_P1]: "Lecture 25 · Part 1 — Vector spaces, coordinates and the matrix of a map",
    [VIDEO_P2]: "Lecture 25 · Part 2 — Change of basis and similar matrices",
  },
};

const CHAPTERS = [
  {
    slug: "1-spaces", nav: "Spaces", title: "Vectors That Are Not Columns",
    subtitle: "Vector spaces and coordinates",
    abstract: "Anything you can add and scale is a vector. A basis turns each one into coordinates, and the change-of-basis matrix B goes from new coordinates to old.",
    tags: ["vector spaces", "coordinates", "change of basis"],
    hero: "code:coords", heroCaption: "3 − 2t + t² = 2 + (t − 1)²: coordinates (3, −2, 1) and (2, 0, 1)",
    sections: [
      { id: "coords", title: "Coordinates in two bases", html: String.raw`
        ${video(VIDEO_P1)}
        <p>\(P_2\), the polynomials of degree at most 2, is a vector space; the polynomials of degree exactly 2 are not (\(t^2 + (1 - t^2) = 1\)).</p>
        $$\mathbf c_{\text{old}} = B\,\mathbf c_{\text{new}}, \qquad B = \begin{bmatrix} 1 & -1 & 1 \\ 0 & 1 & -2 \\ 0 & 0 & 1 \end{bmatrix}.$$
        ${run("coords")}
        ${callout("pitfall", "PITFALL · B GOES FROM NEW TO OLD", `<p>\\(B(3, -2, 1) = (6, -4, 1)\\) rebuilds \\(11 - 6t + t^2\\), a different polynomial. New coordinates need \\(B^{-1}\\): \\((2, 0, 1)\\).</p>`)}` },
    ],
    takeaways: [
      "Vectors: anything you can add and scale.",
      "Coordinates depend on the basis.",
      "c_old = B c_new.",
    ],
  },
  {
    slug: "2-maps", nav: "Maps", title: "Linear Transformations and Their Matrices",
    subtitle: "Column j = coordinates of T(vⱼ)",
    abstract: "A linear map respects sums and multiples. Its matrix records what it does to the basis: the derivative on P₂ becomes D, and on cos t, sin t a quarter turn.",
    tags: ["linear maps", "derivative", "matrix of a map"],
    hero: "code:deriv", heroCaption: "D(3, −2, 1) = (−2, 2, 0): (3 − 2t + t²)′ = −2 + 2t",
    sections: [
      { id: "deriv", title: "The derivative is a matrix", html: String.raw`
        $$D = \begin{bmatrix} 0 & 1 & 0 \\ 0 & 0 & 2 \\ 0 & 0 & 0 \end{bmatrix}, \qquad D^3 = 0.$$
        ${run("deriv")}
        <p>Not linear: \(\mathbf x + (1, 0)\) moves \(\mathbf 0\); \(p^2\) becomes \(4p^2\) when \(p\) doubles.</p>` },
      { id: "trig", title: "A map on functions", html: String.raw`
        ${run("trig")}
        <p>On \(\cos t, \sin t\) the derivative is a rotation by \(-90°\) with eigenvalues \(\pm i\): why \(e^{\pm it}\) appeared for the spring in Lecture 20.</p>
        ${run("shift")}` },
    ],
    takeaways: [
      "Linear: sums and multiples.",
      "Column j = coordinates of T(vⱼ).",
      "Composition = matrix product.",
    ],
  },
  {
    slug: "3-similar", nav: "Similar", title: "Same Map, Different Bases",
    subtitle: "B⁻¹AB and what it keeps",
    abstract: "The projection onto y = x becomes diag(1, 0) in a basis along and across the line. In general the new matrix is B⁻¹AB: similar, with the same eigenvalues, trace, determinant and rank.",
    tags: ["similar matrices", "diagonalization", "Jordan block"],
    hero: "basis", heroCaption: "Pick a map and a basis: B⁻¹AB, and what it shares with A.",
    sections: [
      { id: "proj", title: "One projection, two tables", html: String.raw`
        ${video(VIDEO_P2)}
        ${run("proj")}
        <p>Diagonalizing is changing to the eigenvector basis: \(B = X\), \(B^{-1}AB = \Lambda\).</p>` },
      { id: "similar", title: "Similar matrices", html: String.raw`
        ${run("similar")}
        ${demo("basis", "Change of basis", "choose a map and two basis vectors")}
        ${callout("pitfall", "PITFALL · SAME EIGENVALUES, DIFFERENT MAPS", `<p>\\(I\\) and the shear \\(\\left[\\begin{smallmatrix} 1 & 1 \\\\ 0 & 1 \\end{smallmatrix}\\right]\\) share eigenvalues, trace and determinant, but \\(M^{-1}IM = I\\) for every \\(M\\).</p>`)}` },
      { id: "jordan", title: "When no basis makes it diagonal", html: String.raw`
        ${run("jordan")}
        <p>In the basis \(1, t, \frac12t^2\) each basis vector goes to the previous one: a Jordan block. Every square matrix is similar to blocks like this.</p>` },
    ],
    takeaways: [
      "A_new = B⁻¹AB.",
      "Similar: same λ, trace, det, rank.",
      "Too few eigenvectors: Jordan block.",
    ],
  },
  {
    slug: "4-reparam", nav: "Reparameterize", title: "Machine Learning: Reparameterizing a Model",
    subtitle: "Same predictions, different training",
    abstract: "Measuring features differently changes the weights the other way and keeps every prediction. But the Hessian changes, and with it the condition number and the speed of gradient descent.",
    tags: ["features", "condition number", "preconditioning"],
    hero: "code:reparam", heroCaption: "w = (3, 20) → (30, 20) or (3.67, 20): still 300",
    sections: [
      { id: "reparam", title: "Features one way, weights the other", html: String.raw`
        $$\mathbf x' = M\mathbf x \;\Rightarrow\; \mathbf w' = M^{-\top}\mathbf w.$$
        ${run("reparam")}
        ${run("hessian")}
        ${callout("ml", "MACHINE LEARNING", `<p>Rescaling area to tens of m² moves the condition number from about 119,000 to 1,600. Standardization, batch normalization and preconditioning are changes of basis chosen to make the Hessian closer to a multiple of \\(I\\).</p>`)}` },
    ],
    takeaways: [
      "Predictions do not see the basis.",
      "Training does.",
      "Rescale features to shrink κ.",
    ],
  },
  {
    slug: "5-practice", nav: "Practice", title: "Check, Practise, Use AI Well",
    subtitle: "Self-check, exercises, and the wrong direction",
    abstract: "Five quick questions, the exercises, and the rebuild check that catches B used in the wrong direction.",
    tags: ["quiz", "exercises", "working with AI"],
    hero: "toc",
    sections: [
      { id: "quiz", title: "Check your understanding", html: String.raw`${demo("quiz", "Self-check", "five questions")}` },
      { id: "exercises", title: "Exercises", html: String.raw`
        <p>Try each exercise on paper first. <b>Hint</b> gives a nudge; <b>Full solution</b> works it through, with the code that checks every number. Stars mark the level: ★ compute or check, ★★ explain or build, ★★★ extend or combine.</p>` },
      { id: "ai", title: "Working with AI", html: String.raw`
        <p>A made-up answer gives the coordinates of \(3 - 2t + t^2\) in the basis \(1, t - 1, (t - 1)^2\) as \((6, -4, 1)\). Rebuild the polynomial:</p>
        ${run("claim")}` },
    ],
    takeaways: [
      "Rebuild the vector from its coordinates.",
      "Check trace and det after B⁻¹AB.",
      "B: new → old.",
    ],
  },
];
