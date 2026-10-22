// Chapter content, adapted from notes/L22-symmetric-positive-definite.md. Code and outputs are copied from the note (demos.js).
// Maths is written \( … \) (inline) and $$ … $$ (display) and typeset by the vendored KaTeX (../assets/katex/).
// Section html uses String.raw so LaTeX backslashes need no doubling.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);
const video = (src) => `<div class="card video" data-video="${src}"></div>`;
const VIDEO_P1 = "media/L22-1.mp4";
const VIDEO_P2 = "media/L22-2.mp4";

const LECTURE = {
  number: 22,
  title: "Symmetric and Positive Definite Matrices",
  tagline: "Real eigenvalues, perpendicular eigenvectors, positive energy",
  lead: "A symmetric matrix has real eigenvalues and perpendicular eigenvectors, so S = QΛQᵀ: a sum of projections. Householder reflections and Givens rotations are the symmetric and orthogonal tools that compute QR stably. Positive definite matrices pass five equivalent tests, and covariance, Gram and kernel matrices are where they come from.",
  heroDemo: "spectralMini",
  heroLabel: "Eigenvectors at right angles",
  heroCaption: "The café covariance C, a matrix with only positive entries that is not positive definite, the second-difference matrix K, and a trough.",
  whyTitle: "Why symmetric matrices",
  whySub: "The matrices data hands you",
  why: [
    ["Spectral theorem", "\\(S = Q\\Lambda Q^\\top = \\lambda_1\\mathbf q_1\\mathbf q_1^\\top + \\dots + \\lambda_n\\mathbf q_n\\mathbf q_n^\\top\\), with real \\(\\lambda\\) and orthonormal \\(\\mathbf q\\)."],
    ["Stable QR", "Householder \\(H = I - 2\\mathbf u\\mathbf u^\\top\\) and Givens rotations keep columns perpendicular to the last digit."],
    ["Positive definite", "Eigenvalues, pivots, upper-left determinants, energy \\(\\mathbf x^\\top S\\mathbf x > 0\\), \\(S = A^\\top A\\): one property."],
  ],
  ctaTitle: "Ready for symmetric matrices?",
  minutes: "About 60–90 minutes",
  videos: {
    [VIDEO_P1]: "Lecture 22 · Part 1 — The spectral theorem and Householder QR",
    [VIDEO_P2]: "Lecture 22 · Part 2 — Positive definite matrices",
  },
};

const CHAPTERS = [
  {
    slug: "1-spectral", nav: "Spectral", title: "The Spectral Theorem",
    subtitle: "Real eigenvalues, perpendicular eigenvectors",
    abstract: "Five days of café data give a covariance matrix whose eigenvectors are at right angles. That is no accident: every symmetric matrix is QΛQᵀ.",
    tags: ["covariance", "spectral theorem", "projections"],
    hero: "spectral", heroCaption: "Move a, b, c: the eigenvectors stay perpendicular.",
    sections: [
      { id: "cafe", title: "A covariance matrix", html: String.raw`
        ${video(VIDEO_P1)}
        <p>Temperatures 14, 16, 17, 18, 20 and iced coffees (tens) 3, 5, 5, 7, 5, centred, give \(C = \frac14 X^\top X\):</p>
        $$C = \begin{bmatrix} 5 & 2 \\ 2 & 2 \end{bmatrix}, \qquad \lambda = 6 \text{ along } (2, 1), \quad \lambda = 1 \text{ along } (1, -2).$$
        ${run("cov")}
        <p>The eigenvectors are perpendicular. Lecture 18's \(\left[\begin{smallmatrix} 4 & 1 \\ 2 & 3 \end{smallmatrix}\right]\), which is not symmetric, has eigenvectors at cosine \(-0.316\).</p>` },
      { id: "spectral", title: "S = QΛQᵀ", html: String.raw`
        ${callout("note", "SPECTRAL THEOREM", `<p>A real symmetric matrix has real eigenvalues and orthonormal eigenvectors: \\(S = Q\\Lambda Q^\\top = \\lambda_1\\mathbf q_1\\mathbf q_1^\\top + \\dots + \\lambda_n\\mathbf q_n\\mathbf q_n^\\top\\).</p>`)}
        ${run("spectral")}
        <p>Each \(\mathbf q\mathbf q^\top\) projects onto a line: \(C = 6P_1 + 1P_2\).</p>` },
      { id: "why", title: "Why perpendicular, why real", html: String.raw`
        $$\lambda\,\mathbf x^\top\mathbf y = (S\mathbf x)^\top\mathbf y = \mathbf x^\top S\mathbf y = \mu\,\mathbf x^\top\mathbf y \;\Rightarrow\; \mathbf x^\top\mathbf y = 0 \text{ when } \lambda \ne \mu.$$
        ${run("s3")}
        ${callout("pitfall", "PITFALL · A REPEATED EIGENVALUE", `<p>For \\(S_3\\) the eigenvalue 1 has a plane of eigenvectors; \\((1, -1, 0)\\) and \\((0, 1, -1)\\) are not perpendicular. Choose a perpendicular pair inside the plane, as <code>eigh</code> does.</p>`)}` },
    ],
    takeaways: [
      "Symmetric: real λ, orthonormal q.",
      "S = Σ λᵢ qᵢqᵢᵀ.",
      "Repeated λ: choose perpendicular vectors.",
    ],
  },
  {
    slug: "2-householder", nav: "Householder", title: "Householder Reflections and Givens Rotations",
    subtitle: "QR that keeps its right angles",
    abstract: "A reflection that is symmetric and orthogonal sends a column to a multiple of e₁. A few reflections and rotations triangularize A, and stay accurate where Gram–Schmidt does not.",
    tags: ["Householder", "Givens", "QR"],
    hero: "code:house", heroCaption: "(3, 4) ↦ (5, 0) with H = [[0.6, 0.8], [0.8, −0.6]]",
    sections: [
      { id: "house", title: "A symmetric reflection", html: String.raw`
        $$H = I - 2\frac{\mathbf v\mathbf v^\top}{\mathbf v^\top\mathbf v}, \qquad H^\top = H, \quad H^2 = I.$$
        ${run("house")}` },
      { id: "qr", title: "QR by reflections and rotations", html: String.raw`
        ${run("qr")}
        <p>\(H_1\) clears the first column below 3; a Givens rotation on rows 2 and 3 turns \((3, 4)\) into \((5, 0)\): \(R = \left[\begin{smallmatrix} 3 & 2 \\ 0 & 5 \end{smallmatrix}\right]\).</p>` },
      { id: "stable", title: "Why not Gram–Schmidt?", html: String.raw`
        ${run("gs")}
        ${run("npqr")}
        ${callout("pitfall", "PITFALL · SIGNS MAY DIFFER", `<p>NumPy's \\(R\\) has \\(-3\\) and \\(-2\\) in its first row: QR is unique only up to the signs of the columns of \\(Q\\) and rows of \\(R\\).</p>`)}` },
    ],
    takeaways: [
      "H = I − 2uuᵀ: symmetric, orthogonal, H² = I.",
      "Reflect, then rotate: A = QR.",
      "Orthogonal steps never amplify rounding.",
    ],
  },
  {
    slug: "3-positive", nav: "Positive", title: "Positive Definite Matrices",
    subtitle: "Five tests, one property",
    abstract: "Positive eigenvalues, positive pivots, positive upper-left determinants, positive energy, and S = AᵀA with independent columns all say the same thing. Positive entries say nothing.",
    tags: ["pivots", "energy", "semidefinite"],
    hero: "code:pivots", heroCaption: "C: pivots 5 and 6/5, energy 5(x + 0.4y)² + 1.2y²",
    sections: [
      { id: "tests", title: "The five tests", html: String.raw`
        ${video(VIDEO_P2)}
        $$\mathbf x^\top C\mathbf x = 5x^2 + 4xy + 2y^2 = 5\left(x + \tfrac25 y\right)^2 + \tfrac65 y^2 > 0.$$
        ${run("pivots")}` },
      { id: "nonex", title: "Positive entries are not enough", html: String.raw`
        ${run("indef")}
        ${callout("pitfall", "PITFALL · ENTRIES DO NOT DECIDE", `<p>\\(M = \\left[\\begin{smallmatrix} 1 & 3 \\\\ 3 & 1 \\end{smallmatrix}\\right]\\) has energy \\(-4\\) at \\((1, -1)\\); \\(K = \\left[\\begin{smallmatrix} 2 & -1 \\\\ -1 & 2 \\end{smallmatrix}\\right]\\) has negative entries and is positive definite.</p>`)}` },
      { id: "semi", title: "Semidefinite: a trough", html: String.raw`
        ${run("semi")}` },
    ],
    takeaways: [
      "Five equivalent tests.",
      "Energy xᵀSx = ‖Ax‖² when S = AᵀA.",
      "Zero eigenvalue: semidefinite.",
    ],
  },
  {
    slug: "4-sources", nav: "Sources", title: "Machine Learning: Covariance, Gram and Kernel Matrices",
    subtitle: "Where positive definite matrices come from",
    abstract: "Variances, dot products and similarities all give positive (semi)definite matrices. Gaussians and Gaussian processes need them; Cholesky tests them; jitter repairs them.",
    tags: ["covariance", "Gram", "kernel", "Cholesky"],
    hero: "code:sources", heroCaption: "Variance 5; Gram eigenvalues 0, 1.70, 5.30; kernel 0.38, 1.00, 1.62",
    sections: [
      { id: "sources", title: "Covariance, Gram and kernel matrices", html: String.raw`
        ${run("sources")}` },
      { id: "chol", title: "Cholesky and jitter", html: String.raw`
        ${run("chol")}
        ${callout("note", "PATTERN", `<p>Need a Gaussian or a Gaussian process? Factor the matrix by Cholesky. If it fails on a semidefinite matrix, add a small multiple of \\(I\\): every eigenvalue rises by that amount.</p>`)}` },
    ],
    takeaways: [
      "Variances and dot products: semidefinite.",
      "Cholesky succeeds exactly for positive definite.",
      "Jitter: S + εI.",
    ],
  },
  {
    slug: "5-practice", nav: "Practice", title: "Check, Practise, Use AI Well",
    subtitle: "Self-check, exercises, and checking claimed eigenvectors",
    abstract: "Five quick questions, the exercises, and the check that catches eigenvectors that are not orthonormal.",
    tags: ["quiz", "exercises", "working with AI"],
    hero: "toc",
    sections: [
      { id: "quiz", title: "Check your understanding", html: String.raw`${demo("quiz", "Self-check", "five questions")}` },
      { id: "exercises", title: "Exercises", html: String.raw`
        <p>Try each exercise on paper first. <b>Hint</b> gives a nudge; <b>Full solution</b> works it through, with the code that checks every number. Stars mark the level: ★ compute or check, ★★ explain or build, ★★★ extend or combine.</p>` },
      { id: "ai", title: "Working with AI", html: String.raw`
        <p>Check a claimed eigenvector matrix twice: \(S\mathbf q = \lambda\mathbf q\) for each column, and \(Q^\top Q = I\). A made-up answer passes the first and fails the second:</p>
        ${run("claim")}` },
    ],
    takeaways: [
      "Check Sq = λq and QᵀQ = I.",
      "Test definiteness by pivots or Cholesky.",
      "Entries alone decide nothing.",
    ],
  },
];
