// Chapter content, adapted from notes/L18-eigenvalues.md. Code and outputs are copied from the note (demos.js).
// Maths is written \( … \) (inline) and $$ … $$ (display) and typeset by the vendored KaTeX (../assets/katex/).
// Section html uses String.raw so LaTeX backslashes need no doubling.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);
const video = (src) => `<div class="card video" data-video="${src}"></div>`;
const VIDEO_P1 = "media/L18-1.mp4";
const VIDEO_P2 = "media/L18-2.mp4";

const LECTURE = {
  number: 18,
  title: "Eigenvalues and Eigenvectors",
  tagline: "Directions a matrix only stretches",
  lead: "A two-pixel blur filter keeps the average brightness and halves the contrast. Those two directions are its eigenvectors, and they predict what a hundred blurs will do. Then the equation det(A − λI) = 0 finds eigenvalues of any matrix, with two free checks: the trace and the determinant.",
  heroDemo: "huntMini",
  heroLabel: "x and Ax",
  heroCaption: "Turn x: only along the eigenvectors does Ax stay on the line of x.",
  whyTitle: "Why eigenvectors",
  whySub: "Powers, filters and checks",
  why: [
    ["Powers", "Split a vector into eigenvectors and \\(A^k\\mathbf{v} = \\lambda^k\\mathbf{v}\\) part by part: the future of a repeated process."],
    ["Filters and networks", "Repeated averaging keeps the \\(\\lambda = 1\\) direction and fades the rest: blurs, over-smoothing in graph networks."],
    ["Checks", "Eigenvalues add up to the trace and multiply to the determinant; every pair satisfies \\(A\\mathbf{v} = \\lambda\\mathbf{v}\\)."],
  ],
  ctaTitle: "Ready to find the special directions?",
  minutes: "About 60–90 minutes",
  videos: {
    [VIDEO_P1]: "Lecture 18 · Part 1 — Directions that only stretch: the blur filter and repeated blurs",
    [VIDEO_P2]: "Lecture 18 · Part 2 — Finding eigenvalues: det(A − λI) = 0, trace, determinant, surprises",
  },
};

const CHAPTERS = [
  {
    slug: "1-stretch", nav: "Av = λv", title: "Directions That Only Stretch",
    subtitle: "A blur filter on two pixels",
    abstract: "A blur replaces each pixel by three quarters of itself plus a quarter of its neighbour. An even grey comes out unchanged, a sharp edge comes out halved, and every other image changes direction.",
    tags: ["Av = λv", "eigenvector", "eigenvalue"],
    hero: "hunt", heroCaption: "Turn x until Ax lies on its line",
    sections: [
      { id: "blur", title: "The blur filter", html: String.raw`
        ${video(VIDEO_P1)}
        $$B = \begin{bmatrix} 3/4 & 1/4 \\ 1/4 & 3/4 \end{bmatrix}, \qquad B\mathbf{x} = \left(\tfrac34 x_1 + \tfrac14 x_2,\ \tfrac14 x_1 + \tfrac34 x_2\right)$$
        <p>Grey \((1, 1)\) stays, the edge \((1, -1)\) halves, and \((3, 1)\) becomes \((2.5, 1.5)\): a new direction. The edge is the <i>difference</i> part of a picture, added on top of grey.</p>
        ${run("blur")}
        ${callout("note", "DEFINITION", `<p>A nonzero \\(\\mathbf{v}\\) with \\(A\\mathbf{v} = \\lambda\\mathbf{v}\\) is an <b>eigenvector</b>; \\(\\lambda\\) is its <b>eigenvalue</b>. Any nonzero multiple works too: it is the line that matters.</p>`)}
        ${run("multiples")}
        ${demo("hunt", "Demo 1 · Hunt for eigenvectors", "pick a matrix and turn x", "The rotation has no real eigenvector; the shear has only one line.")}
        ${callout("pitfall", "PITFALL · THE ZERO VECTOR", `<p>\\(A\\mathbf{0} = \\lambda\\mathbf{0}\\) for every \\(\\lambda\\), so \\(\\mathbf{0}\\) is excluded. The eigenvalue 0 is allowed: then \\(A\\) is singular.</p>`)}` },
    ],
    takeaways: [
      "Av = λv with v ≠ 0: a direction A only scales.",
      "Multiples of an eigenvector are eigenvectors (same λ).",
      "Most vectors are not eigenvectors: (3, 1) changes direction.",
    ],
  },
  {
    slug: "2-powers", nav: "Powers", title: "Repeated Blurs",
    subtitle: "Eigenvectors predict Aᵏx",
    abstract: "Split (3, 1) into 2 grey + 1 edge. Each blur keeps the grey and halves the edge, so after k blurs the image is 2(1, 1) + (1/2)^k(1, −1). A sharpen filter doubles the edge instead.",
    tags: ["Aᵏv = λᵏv", "over-smoothing"],
    hero: "blur", heroCaption: "Blur or sharpen k times; the formula agrees",
    sections: [
      { id: "powers", title: "Powers act on each part", html: String.raw`
        $$(3, 1) = 2\,(1, 1) + 1\,(1, -1), \qquad B^k (3, 1) = 2\,(1, 1) + \left(\tfrac12\right)^k (1, -1)$$
        <p>2 is the average of the pixels and 1 half their difference. The average survives, the contrast fades.</p>
        ${run("powers")}
        ${demo("blur", "Demo 2 · Repeated blur", "move k; switch to sharpen")}
        ${predict("A sharpen filter \\(S\\) has the same eigenvectors with eigenvalues 1 and 2. What is \\(S^{10}(3, 1)\\)?", `<p>\\(2(1, 1) + 2^{10}(1, -1) = (1026, -1022)\\): the edge explodes.</p>${run("sharpen")}`)}
        ${callout("note", "ML", `<p>Stacking many neighbour-averaging layers in a graph neural network makes all node features drift to the same value (<b>over-smoothing</b>): the \\(\\lambda = 1\\) direction wins.</p>`)}` },
    ],
    takeaways: [
      "Write x in eigenvectors; then Aᵏx multiplies each part by λᵏ.",
      "|λ| < 1 fades, λ = 1 stays, |λ| > 1 explodes.",
      "Next lecture packs this into A = XΛX⁻¹.",
    ],
  },
  {
    slug: "3-finding", nav: "det(A − λI)", title: "Finding Eigenvalues",
    subtitle: "det(A − λI) = 0, trace and determinant",
    abstract: "Av = λv means A − λI is singular, so det(A − λI) = 0: a quadratic for 2-by-2 matrices. Each eigenvector spans the nullspace of A − λI. The eigenvalues add to the trace and multiply to the determinant; elimination changes them.",
    tags: ["characteristic equation", "trace", "complex λ"],
    hero: "char", heroCaption: "Type any 2-by-2 matrix",
    sections: [
      { id: "char", title: "The characteristic equation", html: String.raw`
        ${video(VIDEO_P2)}
        $$\det\begin{bmatrix} a - \lambda & b \\ c & d - \lambda \end{bmatrix} = \lambda^2 - (a + d)\lambda + (ad - bc) = 0$$
        <p>For \(A = \begin{bmatrix} 4 & 1 \\ 2 & 3 \end{bmatrix}\): \((\lambda - 5)(\lambda - 2)\), with \(\mathbf{v} = (1, 1)\) and \((1, -2)\) from the nullspaces of \(A - 5I\) and \(A - 2I\).</p>
        ${run("charpoly")}
        <p>Our NumPy (2.5) returns eigenvalues as complex numbers even when they are real; a helper keeps the real parts after checking:</p>
        ${run("realeigs")}
        <p><b>Checks:</b> \(\lambda_1 + \lambda_2 = \) trace, \(\lambda_1\lambda_2 = \det\). A triangular matrix has its eigenvalues on the diagonal.</p>
        ${run("tri")}
        ${demo("char", "Demo 3 · Eigenvalues of any 2-by-2 matrix", "type A")}
        ${callout("pitfall", "PITFALL · ELIMINATION CHANGES EIGENVALUES", String.raw`<p>\(U\) from elimination has eigenvalues 4 and 2.5, not 5 and 2.</p>` + run("elim"))}
        <p>Same eigenvectors, new eigenvalues: \(A^2 \to \lambda^2\), \(A + cI \to \lambda + c\), \(A^{-1} \to 1/\lambda\).</p>
        ${run("shifts")}` },
      { id: "special", title: "numpy and three surprises", html: String.raw`
        <p><code>np.linalg.eig</code> returns unit-length eigenvectors as columns; divide by the first entry to compare.</p>
        ${run("npeig")}
        <p>A 90° rotation has \(\lambda = \pm i\) (no real eigenvector; Python writes \(i\) as <code>1j</code>), a projection 1 and 0, a shear 1 twice with one line of eigenvectors.</p>
        ${run("special")}` },
    ],
    takeaways: [
      "det(A − λI) = 0 gives λ; the nullspace of A − λI gives v.",
      "Sum = trace, product = det; triangular: read the diagonal.",
      "Never read eigenvalues off U.",
    ],
  },
  {
    slug: "4-practice", nav: "Practice", title: "Check, Practise, Use AI Well",
    subtitle: "Self-check, exercises, multiply it out",
    abstract: "Five quick questions, then the habit that catches most eigenvalue slips: multiply A v and compare with λ v, and check trace and determinant.",
    tags: ["quiz", "exercises", "working with AI"],
    hero: "toc",
    sections: [
      { id: "quiz", title: "Check your understanding", html: String.raw`${demo("quiz", "Self-check", "five questions")}${run("cyu")}` },
      { id: "exercises", title: "Exercises", html: String.raw`
        <p>Try each exercise on paper first. <b>Hint</b> gives a nudge; <b>Full solution</b> works it through, with the code that checks every number. Stars mark the level: ★ compute or check, ★★ explain or build, ★★★ extend or combine.</p>` },
      { id: "ai", title: "Working with AI", html: String.raw`
        <p>Multiply out every claimed pair, and check trace and determinant. Here an assistant gets the eigenvalues right but claims \((1, 2)\) for \(\lambda = 5\):</p>
        ${run("claim")}
        <p>\(A(1, 2) = (6, 8) \ne (5, 10)\): the eigenvalue checks pass, the eigenvector fails. The two checks test different things.</p>` },
    ],
    takeaways: [
      "Multiply it out: Av must equal λv.",
      "Trace and determinant check the eigenvalues, not the eigenvectors.",
      "Complex eigenvalues are allowed; the zero vector is not.",
    ],
  },
];
