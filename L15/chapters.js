// Chapter content, adapted from notes/L15-orthonormal-gram-schmidt-qr.md. Code and outputs are copied from the note (demos.js).
// Maths is written \( … \) (inline) and $$ … $$ (display) and typeset by the vendored KaTeX (../assets/katex/).
// Section html uses String.raw so LaTeX backslashes need no doubling.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);
const video = (src) => `<div class="card video" data-video="${src}"></div>`;
const VIDEO_P1 = "media/L15-1.mp4";
const VIDEO_P2 = "media/L15-2.mp4";

const LECTURE = {
  number: 15,
  title: "Orthonormal Bases, Gram–Schmidt and QR",
  tagline: "Coordinates without solving",
  lead: "With perpendicular unit vectors, every coordinate is one dot product and every projection is a sum. Gram–Schmidt makes such a basis from any basis, and recording what it did gives A = QR: how computers really do least squares. The same R gives the Cholesky factor of AᵀA.",
  heroDemo: "gsMini",
  heroLabel: "Gram–Schmidt",
  heroCaption: "The drone's plane, all of space, and the café's two columns: subtract, then divide by the length.",
  whyTitle: "Why orthonormal",
  whySub: "Dot products instead of systems",
  why: [
    ["QᵀQ = I", "Coordinates are \\(Q^\\top\\mathbf{b}\\), projections are \\(QQ^\\top\\mathbf{b}\\), lengths are kept."],
    ["A = QR", "Least squares becomes one triangular solve, \\(R\\hat{\\mathbf{x}} = Q^\\top\\mathbf{b}\\)."],
    ["Stable regression", "QR keeps the digits that \\(A^\\top A\\) loses; Cholesky is the fast route for well-conditioned \\(S\\)."],
  ],
  ctaTitle: "Ready to straighten a basis?",
  minutes: "About 60–90 minutes",
  videos: {
    [VIDEO_P1]: "Lecture 15 · Part 1 — Orthonormal bases and Gram–Schmidt",
    [VIDEO_P2]: "Lecture 15 · Part 2 — A = QR, Cholesky, and stable least squares",
  },
};

const CHAPTERS = [
  {
    slug: "1-orthonormal", nav: "Orthonormal", title: "Orthonormal Vectors and Q",
    subtitle: "Perpendicular, length 1, and projections by dot products",
    abstract: "Orthonormal columns make QᵀQ = I. Coordinates are dot products, and the 'project on each vector and add' shortcut becomes exact.",
    tags: ["orthonormal", "orthogonal matrix", "projection"],
    hero: "code:q", heroCaption: "Q₂ (3-4-5) and Q₃ (2-3-6 over 7)",
    sections: [
      { id: "q", title: "Orthonormal vectors and the matrix Q", html: String.raw`
        ${video(VIDEO_P1)}
        ${callout("note", "DEFINITION", `<p>\\(\\mathbf{q}_1, \\dots, \\mathbf{q}_n\\) are <b>orthonormal</b> when \\(\\mathbf{q}_i^\\top\\mathbf{q}_j = 0\\) for \\(i \\ne j\\) and \\(\\mathbf{q}_i^\\top\\mathbf{q}_i = 1\\): \\(Q^\\top Q = I\\). A square such \\(Q\\) is an <b>orthogonal matrix</b>, \\(Q^{-1} = Q^\\top\\).</p>`)}
        $$Q_3 = \frac17\begin{bmatrix} 2 & 3 & 6 \\ 3 & -6 & 2 \\ 6 & 2 & -3 \end{bmatrix}$$
        ${run("q")}
        ${callout("pitfall", "PITFALL · QᵀQ = I IS NOT QQᵀ = I", run("notsquare"))}` },
      { id: "project", title: "Projecting with an orthonormal basis", html: String.raw`
        $$\hat{\mathbf{x}} = Q^\top\mathbf{b}, \qquad \mathbf{p} = QQ^\top\mathbf{b} = \sum (\mathbf{q}_i^\top\mathbf{b})\,\mathbf{q}_i$$
        ${run("project")}
        ${predict("Write \\((7, 0, 7)\\) in the full basis of the columns of \\(Q_3\\).", `<p>Three dot products: \\((8, 5, 3)\\).</p>${run("coords")}`)}` },
    ],
    takeaways: [
      "QᵀQ = I; for square Q, Q⁻¹ = Qᵀ.",
      "Coordinates are dot products.",
      "Orthogonal matrices keep lengths and angles.",
    ],
  },
  {
    slug: "2-gram-schmidt", nav: "Gram–Schmidt", title: "Gram–Schmidt and A = QR",
    subtitle: "Subtract, divide, and record what you did",
    abstract: "Gram–Schmidt on the drone's buttons gives an orthonormal basis of its plane; run backwards, it is A = QR.",
    tags: ["Gram–Schmidt", "QR", "least squares"],
    hero: "gs", heroCaption: "Type vectors; read off each step, Q and R.",
    sections: [
      { id: "gs", title: "Gram–Schmidt", html: String.raw`
        <p>\(\mathbf{q}_1 = \mathbf{u}/\|\mathbf{u}\|\); \(\mathbf{B} = \mathbf{v} - (\mathbf{q}_1^\top\mathbf{v})\mathbf{q}_1\), \(\mathbf{q}_2 = \mathbf{B}/\|\mathbf{B}\|\).</p>
        ${run("gs")}
        ${run("drone")}
        ${callout("pitfall", "PITFALL · SUBTRACT ALONG THE NEW q's", run("third"))}` },
      { id: "qr", title: "A = QR, and least squares with it", html: String.raw`
        ${video(VIDEO_P2)}
        ${callout("note", "DEFINITION", `<p>Every \\(A\\) with independent columns factors as \\(A = QR\\): \\(Q\\) with orthonormal columns, \\(R = Q^\\top A\\) upper triangular with positive diagonal. Least squares: \\(R\\hat{\\mathbf{x}} = Q^\\top\\mathbf{b}\\).</p>`)}
        ${run("qr")}
        <p>NumPy's \(R\) has a negative diagonal; flipping matching columns of \(Q\) and rows of \(R\) changes nothing.</p>` },
      { id: "chol", title: "Cholesky", html: String.raw`
        <p>\(A^\top A = R^\top R = LL^\top\) with \(L = R^\top\). It needs a positive definite matrix:</p>
        ${run("chol")}` },
    ],
    takeaways: [
      "Subtract along the q's built so far, then normalise.",
      "A = QR; least squares is Rx̂ = Qᵀb.",
      "AᵀA = LLᵀ (Cholesky), for positive definite matrices.",
    ],
  },
  {
    slug: "3-stable", nav: "Stable regression", title: "Machine Learning: Stable Regression",
    subtitle: "Why libraries prefer QR",
    abstract: "Forming AᵀA squares the condition number. A degree-7 polynomial fit shows the digits lost, and scaling the features shows the fix.",
    tags: ["condition number", "QR", "feature scaling"],
    hero: "code:cond", heroCaption: "cond V ≈ 10⁸, cond VᵀV ≈ 10¹⁶",
    sections: [
      { id: "cond", title: "Normal equations versus QR", html: String.raw`
        ${run("cond")}
        <p>Scaling time to \([-1, 1]\) brings the condition number down to a few hundred:</p>
        ${run("scale")}
        ${callout("note", "ML", `<p>Solve least squares with QR (or the SVD), not by forming \\(X^\\top X\\); standardise the features. Cholesky is the fast way to solve with a well-conditioned positive definite matrix, such as a covariance matrix.</p>`)}` },
    ],
    takeaways: [
      "AᵀA squares the condition number.",
      "lstsq uses an orthogonal factorization.",
      "Centre and scale features.",
    ],
  },
  {
    slug: "4-practice", nav: "Practice", title: "Check, Practise, Use AI Well",
    subtitle: "Self-check, exercises, and checking a claimed Q",
    abstract: "Five quick questions, the exercises, and a one-line check of any claimed orthonormal basis: QᵀQ = I.",
    tags: ["quiz", "exercises", "working with AI"],
    hero: "toc",
    sections: [
      { id: "quiz", title: "Check your understanding", html: String.raw`${demo("quiz", "Self-check", "five questions")}` },
      { id: "exercises", title: "Exercises", html: String.raw`
        <p>Try each exercise on paper first. <b>Hint</b> gives a nudge; <b>Full solution</b> works it through, with the code that checks every number. Stars mark the level: ★ compute or check, ★★ explain or build, ★★★ extend or combine.</p>` },
      { id: "ai", title: "Working with AI", html: String.raw`
        <p>A claimed orthonormal basis must satisfy \(Q^\top Q = I\). A common slip forgets to divide by the length:</p>
        ${run("claim")}` },
    ],
    takeaways: [
      "QᵀQ = I, entry by entry.",
      "Same span as the original vectors.",
      "R upper triangular, positive diagonal.",
    ],
  },
];
