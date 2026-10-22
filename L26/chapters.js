// Chapter content, adapted from notes/L26-svd.md. Code and outputs are copied from the note (demos.js).
// Maths is written \( … \) (inline) and $$ … $$ (display) and typeset by the vendored KaTeX (../assets/katex/).
// Section html uses String.raw so LaTeX backslashes need no doubling.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);
const video = (src) => `<div class="card video" data-video="${src}"></div>`;
const VIDEO_P1 = "media/L26-1.mp4";
const VIDEO_P2 = "media/L26-2.mp4";

const LECTURE = {
  number: 26,
  title: "The Singular Value Decomposition",
  tagline: "Any matrix is rotate, stretch, rotate",
  lead: "Every matrix, of any shape, turns the unit circle into an ellipse. The axes of that ellipse give the singular value decomposition A = UΣVᵀ: perpendicular inputs v, perpendicular outputs u, and stretches σ. Singular values are not eigenvalues, A is a sum of rank-one pieces in order of importance, and a small ratings table reveals two hidden tastes.",
  heroDemo: "svdMini",
  heroLabel: "circle to ellipse",
  heroCaption: "The identity slowly becomes A = [2 3; 0 2]: the circle becomes an ellipse with half-axes 4 and 1.",
  whyTitle: "Why the SVD",
  whySub: "The most useful factorization",
  why: [
    ["Every matrix", "Square or not, symmetric or not: \\(A = U\\Sigma V^\\top\\) always exists, with orthogonal \\(U\\), \\(V\\)."],
    ["In order", "\\(A = \\sum\\sigma_i\\mathbf u_i\\mathbf v_i^\\top\\): the first pieces carry the most."],
    ["Hidden structure", "In a ratings table, the singular vectors are tastes that nobody wrote down."],
  ],
  ctaTitle: "Ready to rotate and stretch?",
  minutes: "About 60–90 minutes",
  videos: {
    [VIDEO_P1]: "Lecture 26 · Part 1 — Rotate, stretch, rotate",
    [VIDEO_P2]: "Lecture 26 · Part 2 — Pieces, subspaces and hidden tastes",
  },
};

const CHAPTERS = [
  {
    slug: "1-ellipse", nav: "Ellipse", title: "Rotate, Stretch, Rotate",
    subtitle: "The circle becomes an ellipse",
    abstract: "A = [2 3; 0 2] sends the unit circle to an ellipse with half-axes 4 and 1. The perpendicular inputs v₁, v₂ land on the perpendicular axes σ₁u₁, σ₂u₂, and A = UΣVᵀ.",
    tags: ["A = UΣVᵀ", "singular values", "orthogonal U, V"],
    hero: "svd", heroCaption: "Type a 2-by-2 matrix or pick one",
    sections: [
      { id: "ellipse", title: "Circle to ellipse", html: String.raw`
        ${video(VIDEO_P1)}
        $$A = \begin{bmatrix} 2 & 3 \\ 0 & 2 \end{bmatrix}, \qquad A\mathbf v_1 = 4\,\mathbf u_1, \quad A\mathbf v_2 = 1\,\mathbf u_2$$
        <p>\(\mathbf v_1 = (1, 2)/\sqrt5\), \(\mathbf v_2 = (2, -1)/\sqrt5\) are perpendicular, and so are \(\mathbf u_1 = (2, 1)/\sqrt5\), \(\mathbf u_2 = (1, -2)/\sqrt5\). The longest stretch is 4, the shortest 1.</p>
        ${run("ellipse")}
        <p>Read \(A = U\Sigma V^\top\) from right to left: \(V^\top\) turns \(\mathbf v_1, \mathbf v_2\) onto the axes, \(\Sigma\) stretches by 4 and 1, \(U\) turns the axes onto \(\mathbf u_1, \mathbf u_2\). (Here both \(U\) and \(V\) are flips, determinant \(-1\).)</p>
        ${run("usv")}
        ${demo("svd", "Demo 1 · Circle to ellipse", "type A or pick one", "Try “rank one”: the ellipse collapses to a segment and σ₂ = 0.")}` },
      { id: "find", title: "Finding the pieces", html: String.raw`
        $$A^\top A = V\,\Sigma^\top\Sigma\,V^\top: \quad \text{eigenvectors } \mathbf v_i,\ \text{eigenvalues } \sigma_i^2, \qquad \mathbf u_i = A\mathbf v_i/\sigma_i$$
        <p>For our \(A\): \(A^\top A = \begin{bmatrix} 4 & 6 \\ 6 & 13 \end{bmatrix}\), trace 17, determinant 16, eigenvalues 16 and 1, so \(\sigma = 4, 1\).</p>
        ${run("ata")}
        ${callout("pitfall", "PITFALL · SIGNS", String.raw`<p>Finding \(U\) separately from \(AA^\top\) can give a \(\mathbf u_2\) with the wrong sign, and then \(U\Sigma V^\top \ne A\). Always take \(\mathbf u_i = A\mathbf v_i/\sigma_i\).</p>` + run("wrong"))}` },
    ],
    takeaways: [
      "A = UΣVᵀ for every matrix.",
      "v's: eigenvectors of AᵀA; σ² its eigenvalues.",
      "uᵢ = Avᵢ/σᵢ, never chosen separately.",
    ],
  },
  {
    slug: "2-not-eigen", nav: "Not eigenvalues", title: "Singular Values Are Not Eigenvalues",
    subtitle: "Lengths, not directions",
    abstract: "An eigenvector keeps its direction; a singular vector is the input stretched the most. [2 3; 0 2] has eigenvalues 2, 2 and singular values 4, 1. They agree (up to sign) only for symmetric matrices; a rotation has σ = 1, 1 and no real eigenvalues.",
    tags: ["σ₁ = max ‖Ax‖", "|det A| = σ₁σ₂", "σ₁ ≥ |λ|"],
    hero: "svd", heroCaption: "Compare the σ's with the λ's",
    sections: [
      { id: "compare", title: "Two different questions", html: String.raw`
        <p>\(|\det A| = \sigma_1\sigma_2 = |\lambda_1\lambda_2|\) (here \(4\cdot 1 = 2\cdot 2\)), and \(\sigma_1 \ge |\lambda|\) for every eigenvalue. For a symmetric matrix the singular values are the eigenvalues without their signs.</p>
        ${run("noteig")}
        ${predict("A rotation by 30 degrees has no real eigenvalues. What are its singular values?", `<p>Both 1: a rotation keeps every length, so the circle stays a circle.</p>${run("rot")}`)}` },
    ],
    takeaways: [
      "Eigenvalues: directions kept. Singular values: stretches.",
      "Equal up to sign only for symmetric A.",
      "Rotation: σ = 1, 1.",
    ],
  },
  {
    slug: "3-pieces", nav: "Pieces & tastes", title: "Rank-One Pieces and Hidden Tastes",
    subtitle: "A = σ₁u₁v₁ᵀ + σ₂u₂v₂ᵀ + ⋯",
    abstract: "Multiplied out, the SVD is a sum of rank-one pieces in order of importance; the first r columns of U and V are orthonormal bases of the column and row spaces. In a 5-friend, 4-film ratings table of rank 2, v₁ is ‘likes films at all’ and v₂ is ‘adventure versus drama’.",
    tags: ["rank-one pieces", "four subspaces", "latent factors"],
    hero: "ratings", heroCaption: "Add a sixth friend and watch the rank",
    sections: [
      { id: "pieces", title: "A sum of pieces", html: String.raw`
        ${video(VIDEO_P2)}
        $$A = \sigma_1\mathbf u_1\mathbf v_1^\top + \cdots + \sigma_r\mathbf u_r\mathbf v_r^\top$$
        <p>For our \(A\), \(4\mathbf u_1\mathbf v_1^\top\) already carries 16 of the 17 units of the sum of squared entries.</p>
        ${run("pieces")}
        <p>The number of positive \(\sigma\)'s is the rank; \(\mathbf u_1, \ldots, \mathbf u_r\) span the column space and \(\mathbf v_1, \ldots, \mathbf v_r\) the row space.</p>
        ${run("rankB")}
        ${callout("pitfall", "PITFALL · Vh HOLDS Vᵀ", String.raw`<p>numpy returns \(V^\top\): the \(\mathbf v\)'s are the <b>rows</b> of <code>Vh</code>, not its columns.</p>` + run("vh"))}` },
      { id: "tastes", title: "Hidden tastes", html: String.raw`
        <p>Five friends rate four films (Star Chase and Robot Run are adventures, Rain Garden and Paris Letters dramas). The table has rank 2.</p>
        ${run("ratings")}
        ${demo("ratings", "Demo 2 · Hidden tastes", "add a sixth friend", "(4, 4, 4, 4) is a multiple of the first taste: the rank stays 2.")}` },
    ],
    takeaways: [
      "Pieces come largest first.",
      "Rank = number of positive σ's.",
      "Singular vectors can be hidden tastes.",
    ],
  },
  {
    slug: "4-practice", nav: "Practice", title: "Check, Practise, Use AI Well",
    subtitle: "Self-check, exercises, check the stretch",
    abstract: "Five quick questions, then the habit for singular values: check σ₁ = ‖Av₁‖ before trusting a claim.",
    tags: ["quiz", "exercises", "working with AI"],
    hero: "toc",
    sections: [
      { id: "quiz", title: "Check your understanding", html: String.raw`${demo("quiz", "Self-check", "five questions")}${run("cyu")}` },
      { id: "exercises", title: "Exercises", html: String.raw`
        <p>Try each exercise on paper first. <b>Hint</b> gives a nudge; <b>Full solution</b> works it through, with the code that checks every number. Stars mark the level: ★ compute or check, ★★ explain or build, ★★★ extend or combine.</p>` },
      { id: "ai", title: "Working with AI", html: String.raw`
        <p>An assistant claims: “\(\begin{bmatrix} 2 & 3 \\ 0 & 2 \end{bmatrix}\) is triangular, so its singular values are the diagonal entries, 2 and 2.” \(2\cdot 2 = |\det A|\) even passes one check. One input refutes it:</p>
        ${run("claim")}
        <p>\(\|A(1, 2)/\sqrt5\| = 4 > 2\): a unit vector is stretched by 4, so \(\sigma_1 \ge 4\) (even \((0, 1)\) is stretched to 3.61). The diagonal of a triangular matrix holds its eigenvalues, not its singular values.</p>` },
    ],
    takeaways: [
      "σ's are not |λ|'s unless A is symmetric.",
      "Check σ₁ = ‖Av₁‖.",
      "v's are the rows of Vh.",
    ],
  },
];
