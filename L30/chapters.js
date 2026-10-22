// Chapter content, adapted from notes/L30-iterative-methods.md. Code and outputs are copied from the note (demos.js).
// Maths is written \( … \) (inline) and $$ … $$ (display) and typeset by the vendored KaTeX (../assets/katex/).
// Section html uses String.raw so LaTeX backslashes need no doubling.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);
const video = (src) => `<div class="card video" data-video="${src}"></div>`;
const VIDEO_P1 = "media/L30-1.mp4";
const VIDEO_P2 = "media/L30-2.mp4";

const LECTURE = {
  number: 30,
  title: "Iterative Methods and How Eigenvalues Are Computed",
  tagline: "Step by step to the answer",
  lead: "For a huge sparse system, elimination is too expensive: Jacobi and Gauss–Seidel improve a guess step by step, at a speed set by the spectral radius, and conjugate gradients solve a 400-unknown heated plate in 32 steps instead of 1216. Eigenvalues are not found from the characteristic polynomial either: the shifted QR algorithm, after a reduction to Hessenberg form, is what eig really runs. And a map of the whole course.",
  heroDemo: "iterMini",
  heroLabel: "errors falling step by step",
  heroCaption: "Jacobi (teal) and Gauss–Seidel (amber) on a 3-by-3 system: the error shrinks by ρ per step, and Gauss–Seidel's ρ is the square of Jacobi's.",
  whyTitle: "Why iterate?",
  whySub: "What the libraries really do",
  why: [
    ["Huge sparse systems", "Millions of unknowns, a few nonzeros per row: only the product \\(A\\mathbf x\\) is affordable."],
    ["Speed is a number", "The error shrinks by the spectral radius \\(\\rho\\) per step; CG's pace is set by \\(\\sqrt\\kappa\\)."],
    ["Eigenvalues", "Shifted QR on a Hessenberg matrix, never the roots of \\(\\det(A - \\lambda I)\\)."],
  ],
  ctaTitle: "Ready to iterate?",
  minutes: "About 60–90 minutes",
  videos: {
    [VIDEO_P1]: "Lecture 30 · Part 1 — Step by step to the answer",
    [VIDEO_P2]: "Lecture 30 · Part 2 — How eigenvalues are really computed, and the course map",
  },
};

const CHAPTERS = [
  {
    slug: "1-jacobi", nav: "Jacobi", title: "Jacobi and Gauss–Seidel",
    subtitle: "Split A, improve a guess, watch ρ",
    abstract: "For A = [4 1 0; 1 5 2; 0 2 6] and answer (1, 2, 3), Jacobi's error shrinks by ρ ≈ 0.43 per step (24 steps to 10⁻⁸) and Gauss–Seidel's by 0.18 = 0.43² (13 steps). The invertible B = [1 2; 2 1] is not diagonally dominant, and Jacobi runs away (ρ = 2).",
    tags: ["A = D + L + U", "spectral radius ρ", "diagonal dominance"],
    hero: "iter", heroCaption: "Type a matrix and compare the two iterations",
    sections: [
      { id: "jacobi", title: "Jacobi", html: String.raw`
        ${video(VIDEO_P1)}
        <p>Split \(A = D + L + U\) (diagonal, strictly lower, strictly upper). Jacobi solves each equation for its own unknown with the old values of the others:</p>
        $$D\mathbf x_{k+1} = \mathbf b - (L + U)\mathbf x_k$$
        ${run("jacobi0")}` },
      { id: "rho", title: "Why it converges", html: String.raw`
        <p>The error obeys \(\mathbf e_{k+1} = M\mathbf e_k\) with \(M = -D^{-1}(L + U)\), so \(\mathbf e_k = M^k\mathbf e_0 \to \mathbf 0\) exactly when every eigenvalue of \(M\) has size below 1. The <b>spectral radius</b> \(\rho(M) = \max|\lambda_i|\) is the long-run shrink factor per step. Gauss–Seidel uses new values at once: \((D + L)\mathbf x_{k+1} = \mathbf b - U\mathbf x_k\).</p>
        ${run("rho")}
        ${predict("Jacobi needs 24 steps to get within 10⁻⁸ of (1, 2, 3). Gauss–Seidel's ρ is 0.18 ≈ 0.43². How many steps does it need?", `<p>About half: 13.</p>${run("count")}`)}
        ${callout("pitfall", "PITFALL · A SOLVABLE SYSTEM IS NOT ENOUGH", String.raw`<p>\(B = \begin{bmatrix} 1 & 2 \\ 2 & 1 \end{bmatrix}\) is invertible, but its iteration matrix has eigenvalues \(\pm 2\): Jacobi runs away. Diagonal dominance (or a symmetric positive definite matrix, for Gauss–Seidel) guarantees convergence.</p>` + run("diverge"))}
        ${demo("iter", "Demo 1 · Jacobi against Gauss–Seidel", "type A and the answer x*, or pick an example", "The vertical axis is logarithmic: a straight line means the same shrink factor every step.")}` },
    ],
    takeaways: [
      "Only the diagonal (or a triangle) is inverted.",
      "Error shrinks by ρ(M) per step.",
      "Invertible does not mean convergent.",
    ],
  },
  {
    slug: "2-cg", nav: "Plate & CG", title: "A Large Sparse System and Conjugate Gradients",
    subtitle: "400 unknowns, 1.2% nonzero",
    abstract: "A heated 20-by-20 plate gives 400 unknowns with 1920 nonzeros (1.2%) and κ ≈ 178. Jacobi needs 1216 steps (ρ = cos(π/21) ≈ 0.989), Gauss–Seidel 609, and conjugate gradients 32: their pace is set by √κ ≈ 13.",
    tags: ["sparse", "ρ close to 1", "conjugate gradients"],
    hero: "plate", heroCaption: "Change the grid size and count the steps",
    sections: [
      { id: "plate", title: "The plate", html: String.raw`
        <p>Each interior temperature is the average of its four neighbours plus a small source: \(P\) has 4 on the diagonal and \(-1\) for each neighbour.</p>
        ${run("plate")}${run("steps")}
        ${callout("pitfall", "PITFALL · CONVERGING IS NOT CONVERGING FAST", String.raw`<p>Jacobi converges on the plate, but \(\rho\) is so close to 1 that it needs over a thousand sweeps. Choosing the method (CG with a preconditioner) matters more than any detail of the code.</p>`)}` },
      { id: "cg", title: "Conjugate gradients", html: String.raw`
        <p>For symmetric positive definite \(P\), solving \(P\mathbf x = \mathbf f\) is finding the bottom of \(E(\mathbf x) = \tfrac12\mathbf x^\top P\mathbf x - \mathbf f^\top\mathbf x\). CG starts downhill and keeps each new direction \(P\)-orthogonal to the earlier ones (\(\mathbf p_i^\top P\mathbf p_j = 0\)), so new steps never spoil old progress. The error falls at least like \(\left(\frac{\sqrt\kappa - 1}{\sqrt\kappa + 1}\right)^k\).</p>
        ${run("cg")}
        ${demo("plate", "Demo 2 · Steps on the plate", "move the grid size m", "The browser runs all three methods on the m² unknowns.")}
        ${callout("ml", "MACHINE LEARNING · LARGE SPARSE SYSTEMS", "<p>Graph methods, kernel and Gaussian-process models and second-order optimisers solve systems far too large for elimination; they need only a function that computes \\(A\\mathbf x\\).</p>")}` },
    ],
    takeaways: [
      "Sparse: only Ax is cheap.",
      "ρ near 1 means slow.",
      "CG: pace set by √κ.",
    ],
  },
  {
    slug: "3-eigen", nav: "QR algorithm", title: "How Eigenvalues Are Really Computed",
    subtitle: "Shifted QR, Hessenberg form, and the course map",
    abstract: "Through the characteristic polynomial, 8 of 16 real eigenvalues come out complex; eigvalsh gets all of them to 14 digits. The QR step A → RQ = QᵀAQ keeps the eigenvalues; with the corner as a shift, S = [2 1 0; 1 3 1; 0 1 4] needs 5 steps instead of 34. A Hessenberg reduction first makes each step cheap — but its diagonal is not the eigenvalues.",
    tags: ["not det(A − λI)", "shifted QR", "Hessenberg", "course map"],
    hero: "qr", heroCaption: "Step the QR algorithm, with and without a shift",
    sections: [
      { id: "poly", title: "Not through the polynomial", html: String.raw`
        ${video(VIDEO_P2)}
        ${run("roots")}` },
      { id: "qr", title: "The QR algorithm", html: String.raw`
        $$A_k = Q_kR_k, \qquad A_{k+1} = R_kQ_k = Q_k^\top A_kQ_k$$
        ${run("unshifted")}
        <p><b>Shifts.</b> \(A_k - s_kI = Q_kR_k\), \(A_{k+1} = R_kQ_k + s_kI\), with \(s_k\) the corner entry.</p>
        ${predict("Without a shift the corner of S needs 34 steps to drop below 10⁻¹². How many with the corner shift?", `<p>Five: 0.75, 0.27, 0.0072, 1.2·10⁻⁷, 6·10⁻²². Then the corner 4.732051 = 3 + √3 is deflated.</p>${run("shift")}`)}
        ${demo("qr", "Demo 3 · The QR algorithm", "one step at a time; tick the shift", "Symmetric input keeps every eigenvalue real.")}` },
      { id: "hess", title: "Hessenberg form", html: String.raw`
        <p>Householder reflections on both sides, \(H = Q^\top AQ\), zero everything below the first subdiagonal; QR steps keep that form and cost about \(n^2\) instead of \(n^3\).</p>
        ${run("hess")}${run("hessqr")}
        ${callout("pitfall", "PITFALL · HESSENBERG IS NOT TRIANGULAR", String.raw`<p>The diagonal of \(H\) (\(-4, -0.04, 1.84, -1.944, 1.144\)) has nothing to do with the eigenvalues (\(-5.14 \pm 1.31i\), \(0.93\), \(3.18 \pm 1.93i\)).</p>`)}
        ${demo("hess", "Demo 4 · Reduce to Hessenberg form", "pick a matrix", "For a symmetric matrix the result is tridiagonal.")}
        <p>NumPy's <code>eigvals</code> calls LAPACK's <code>_geev</code>: Hessenberg reduction, then shifted QR.</p>` },
      { id: "map", title: "A map of the course", html: String.raw`
        <table class="la-table"><tr><th>Question</th><th>Factorization</th><th>Lectures</th></tr>
        <tr><td>Solve \(A\mathbf x = \mathbf b\)</td><td>\(PA = LU\); iterations, CG</td><td>2–4, 30</td></tr>
        <tr><td>Which \(\mathbf b\), which \(\mathbf x\)?</td><td>four subspaces, rank</td><td>5–11</td></tr>
        <tr><td>Best \(\mathbf x\) when there is none</td><td>\(A = QR\), \(A^+ = V\Sigma^+U^\top\)</td><td>13–15, 28</td></tr>
        <tr><td>What does \(A\) do to directions?</td><td>\(X\Lambda X^{-1}\), \(Q\Lambda Q^\top\)</td><td>18–25</td></tr>
        <tr><td>What does \(A\) do to lengths?</td><td>\(U\Sigma V^\top\)</td><td>26–29</td></tr></table>
        ${run("map")}` },
    ],
    takeaways: [
      "Never eigenvalues from the polynomial.",
      "QR steps are similarity transforms.",
      "Shift + Hessenberg = fast and cheap.",
    ],
  },
  {
    slug: "4-practice", nav: "Practice", title: "Check, Practise, Use AI Well",
    subtitle: "Self-check, exercises, test an iterative-method claim",
    abstract: "Five quick questions, then the habit for iterative methods: check the conditions (dominance, symmetry, positive definiteness) on a small case.",
    tags: ["quiz", "exercises", "working with AI"],
    hero: "toc",
    sections: [
      { id: "quiz", title: "Check your understanding", html: String.raw`${demo("quiz", "Self-check", "five questions")}${run("cyu")}` },
      { id: "exercises", title: "Exercises", html: String.raw`
        <p>Try each exercise on paper first. <b>Hint</b> gives a nudge; <b>Full solution</b> works it through, with the code that checks every number. Stars mark the level: ★ compute or check, ★★ explain or build, ★★★ extend or combine.</p>` },
      { id: "ai", title: "Working with AI", html: String.raw`
        <p>An assistant runs CG on the nonsymmetric \(N = \begin{bmatrix} 1 & 3 \\ -1 & 2 \end{bmatrix}\) with answer \((1, 1)\) and says “two steps solve any 2-by-2 system”.</p>
        ${run("claim")}
        <p>Two steps give \((2.8462, 1.4615)\). The n-step guarantee needs a symmetric positive definite matrix; check that first, and compare with <code>np.linalg.solve</code>.</p>` },
    ],
    takeaways: [
      "Check the conditions before the method.",
      "Quote ρ or κ, not just “it converges”.",
      "Test on a tiny case.",
    ],
  },
];
