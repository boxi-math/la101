// Chapter content, adapted from notes/E5-jordan-form.md. Code and outputs are copied from the note (demos.js).
// Maths is written \( … \) (inline) and $$ … $$ (display) and typeset by the vendored KaTeX (../assets/katex/).
// Section html uses String.raw so LaTeX backslashes need no doubling.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);
const video = (src) => `<div class="card video" data-video="${src}"></div>`;
const VIDEO_P1 = "media/E5-1.mp4";
const VIDEO_P2 = "media/E5-2.mp4";


const LECTURE = {
  number: "E5",
  id: "E5",
  label: "Elective E5",
  title: "The Jordan Form",
  tagline: "What to do when eigenvectors run out",
  lead: "A matrix with a repeated eigenvalue can have too few eigenvectors to diagonalize. Generalized eigenvectors fill the gap: chains with (A − λI)v₂ = v₁ turn the matrix into Jordan blocks, and the blocks explain the te^(−t) in a cascade of barrels and the k·λ^(k−1) in powers. The same blocks are also why computers avoid the Jordan form: a tiny perturbation changes it completely, while the Schur form and the SVD stay stable.",
  heroDemo: "powersMini",
  heroLabel: "Powers of a Jordan block",
  heroCaption: "The corner of J₂(0.9)ᵏ is k·0.9^(k−1): it climbs to 3.87 before it decays.",
  whyTitle: "Why Jordan blocks?",
  whySub: "The best you can do when A cannot be diagonalized",
  why: [
    ["Chains", "\\((A - \\lambda I)\\mathbf v_1 = \\mathbf 0\\), \\((A - \\lambda I)\\mathbf v_2 = \\mathbf v_1\\): each chain gives one block \\(J_m(\\lambda)\\)."],
    ["Powers and exponentials", "\\(J_2(\\lambda)^k\\) has corner \\(k\\lambda^{k-1}\\); \\(e^{J_2(\\lambda)t}\\) has corner \\(te^{\\lambda t}\\)."],
    ["Fragility", "A perturbation \\(\\varepsilon\\) moves the eigenvalue of \\(J_n\\) by \\(\\varepsilon^{1/n}\\); Schur's \\(Q\\) has condition number 1."],
  ],
  ctaTitle: "Ready for the Jordan form?",
  minutes: "About 60–90 minutes",
  videos: {
    [VIDEO_P1]: "Elective E5 · Part 1 — Missing eigenvectors and Jordan chains",
    [VIDEO_P2]: "Elective E5 · Part 2 — Powers, exponentials, and why computers avoid the Jordan form",
  },
};

const CHAPTERS = [
  {
    slug: "1-cascade", nav: "Cascade", title: "Two Barrels in a Cascade",
    subtitle: "Where te^(−t) comes from",
    abstract: "Barrel 1 drains into barrel 2 and both drain at rate 1: A = [[−1, 0], [1, −1]]. Starting from 400 L in barrel 1, x₂(t) = 4te^(−t) (hundreds of litres) peaks at t = 1 with 4/e ≈ 1.47. The factor t has no place in a sum of pure exponentials.",
    tags: ["differential equations", "repeated eigenvalue", "defective matrix"],
    hero: "code:series", heroCaption: "x₂ = 1.2131, 1.4715, 1.0827 at t = 0.5, 1, 2",
    sections: [
      { id: "cascade", title: "The cascade", html: String.raw`
        ${video(VIDEO_P1)}
        $$\frac{d\mathbf x}{dt} = A\mathbf x, \qquad A = \begin{bmatrix} -1 & 0 \\ 1 & -1 \end{bmatrix}, \qquad \mathbf x(0) = \begin{bmatrix} 4 \\ 0 \end{bmatrix}.$$
        ${run("eig")}
        <p>Only one eigenvector, so \(\mathbf x(t)\) cannot be written as \(c_1e^{\lambda_1 t}\mathbf x_1 + c_2e^{\lambda_2 t}\mathbf x_2\). Solving barrel by barrel gives \(x_1 = 4e^{-t}\) and \(x_2 = 4te^{-t}\):</p>
        ${run("series")}
        ${predict("Barrel 2 starts empty. When is it fullest?", "<p>When inflow equals outflow: \\(x_1 = x_2\\), at \\(t = 1\\), with \\(4/e \\approx 1.47\\) hundred litres.</p>")}` },
    ],
    takeaways: [
      "Repeated eigenvalue −1, one eigenvector.",
      "Solution has te^(−t).",
      "Peak 4/e at t = 1.",
    ],
  },
  {
    slug: "2-multiplicity", nav: "Multiplicity", title: "Repeated Eigenvalues and Missing Eigenvectors",
    subtitle: "Algebraic versus geometric multiplicity",
    abstract: "G and H share trace 6, determinant 8 and characteristic polynomial (λ − 2)³, yet G has one eigenvector and H has two. The count comes from rank(A − λI) on exact integers, never from floating-point eigenvalues.",
    tags: ["algebraic multiplicity", "geometric multiplicity", "rank"],
    hero: "code:geo", heroCaption: "same trace, determinant and polynomial; one vs two eigenvectors",
    sections: [
      { id: "geo", title: "Two look-alikes", html: String.raw`
        $$G = \begin{bmatrix} 0 & -2 & -1 \\ 1 & 3 & 0 \\ 1 & 1 & 3 \end{bmatrix}, \qquad H = \begin{bmatrix} 0 & -2 & -2 \\ 1 & 3 & 1 \\ 1 & 1 & 3 \end{bmatrix}.$$
        ${run("geo")}
        $$\text{geometric multiplicity} = n - \operatorname{rank}(A - \lambda I) \;\le\; \text{algebraic multiplicity}.$$
        ${callout("pitfall", "PITFALL · A REPEATED EIGENVALUE IS NOT A DEFECT", `<p>The identity has eigenvalue 1 repeated n times and is diagonal. A matrix is defective only when the geometric multiplicity is smaller than the algebraic one.</p>`)}` },
    ],
    takeaways: [
      "Algebraic: root multiplicity.",
      "Geometric: n − rank(A − λI).",
      "Defective when geometric < algebraic.",
    ],
  },
  {
    slug: "3-chains", nav: "Chains", title: "Jordan Chains and the Jordan Form",
    subtitle: "Generalized eigenvectors; one block per chain",
    abstract: "A chain v₁ ← v₂ ← v₃ under A − λI gives the block J₃(λ). For G the chain (1, −1, 0), (−1, 0, 1), (0, 0, 1) gives J₃(2); H gives J₂(2) ⊕ J₁(2). The ranks of (A − λI)ᵏ count the blocks of each size.",
    tags: ["generalized eigenvectors", "Jordan block", "similarity"],
    hero: "blocks", heroCaption: "Type a matrix: exact ranks of (A − λI)ᵏ and the Jordan blocks they force.",
    sections: [
      { id: "chains", title: "Generalized eigenvectors", html: String.raw`
        $$(A - \lambda I)\mathbf v_1 = \mathbf 0, \qquad (A - \lambda I)\mathbf v_2 = \mathbf v_1, \qquad (A - \lambda I)\mathbf v_3 = \mathbf v_2 \;\Longrightarrow\; M^{-1}AM = J_3(\lambda).$$
        ${run("chains")}
        ${run("hchain")}
        ${callout("pitfall", "PITFALL · NOT EVERY EIGENVECTOR STARTS A CHAIN", `<p>For H, the chain of length 2 must start at an eigenvector that lies in the column space of \\(H - 2I\\): here \\((-2, 1, 1)\\).</p>`)}` },
      { id: "jordan", title: "The Jordan form", html: String.raw`
        <p>Every square matrix is similar to a block diagonal matrix of Jordan blocks, unique up to the order of the blocks. Diagonalizable means every block is 1 × 1.</p>
        $$\#\{\text{blocks of size} \ge k\} = \operatorname{rank}(A - \lambda I)^{k-1} - \operatorname{rank}(A - \lambda I)^{k}.$$
        ${run("blocks")}
        ${demo("blocks", "Jordan block counter", "pick a preset or type an integer matrix")}
        ${run("minpoly")}` },
    ],
    takeaways: [
      "Chain under A − λI → one block.",
      "Ranks of (A − λI)ᵏ fix the block sizes.",
      "Diagonalizable ⇔ all blocks 1 × 1.",
    ],
  },
  {
    slug: "4-powers", nav: "Powers", title: "Powers and Exponentials of a Jordan Block",
    subtitle: "J = λI + N, and N runs out",
    abstract: "J₂(λ) = λI + N with N² = 0, so Jᵏ = λᵏI + kλ^(k−1)N and e^(Jt) = e^(λt)(I + tN). For λ = 0.9 the corner k·0.9^(k−1) climbs to 3.87 at k = 9 and 10 before decaying: |λ| < 1 still wins, but only eventually.",
    tags: ["matrix powers", "matrix exponential", "nilpotent"],
    hero: "powers", heroCaption: "Move λ and k: the diagonal decays while the corner first grows.",
    sections: [
      { id: "powers", title: "Powers", html: String.raw`
        ${video(VIDEO_P2)}
        $$J_2(\lambda)^k = \begin{bmatrix} \lambda^k & k\lambda^{k-1} \\ 0 & \lambda^k \end{bmatrix}.$$
        ${run("powers")}
        ${demo("powers", "Powers of J₂(λ)", "move λ and k")}
        ${callout("pitfall", "PITFALL · |λ| < 1 DOES NOT MEAN SHRINKING AT ONCE", `<p>The eigenvalues decide the long run. The corner grows as long as \\(0.9(k + 1) > k\\), that is up to \\(k = 9\\), and only then decays.</p>`)}` },
      { id: "expo", title: "Exponentials", html: String.raw`
        $$e^{J_2(\lambda)t} = e^{\lambda t}\begin{bmatrix} 1 & t \\ 0 & 1 \end{bmatrix}, \qquad e^{J_3(\lambda)t} \text{ adds } \tfrac{t^2}{2}e^{\lambda t}.$$
        ${run("expo")}
        ${predict("Three barrels in a cascade: which power of t appears in the last barrel?", "<p>\\(t^2\\): the block is 3 × 3, so \\(N^2 \\neq 0\\). The notes find \\(x_3 = 2t^2e^{-t}\\), with peak \\(8/e^2 \\approx 1.08\\) at \\(t = 2\\).</p>")}` },
    ],
    takeaways: [
      "Jᵏ = λᵏI + kλ^(k−1)N.",
      "e^(Jt) = e^(λt)(I + tN + …).",
      "Transient growth before decay.",
    ],
  },
  {
    slug: "5-fragile", nav: "Fragility", title: "Why Computers Avoid the Jordan Form",
    subtitle: "Near-defective matrices, ε^(1/n), and the Schur form",
    abstract: "Make barrel 2 drain at rate b = 1.001: A is now diagonalizable, but cond(X) = 2000 and the coefficients are ±4000, cancelling to 1.4708. A perturbation 10⁻¹⁰ moves the eigenvalue of J₁₀(0) by 0.1. Schur's QTQ* uses an orthogonal Q and never breaks.",
    tags: ["conditioning", "Schur form", "numerical stability"],
    hero: "barrels", heroCaption: "Move b toward 1: the eigenvectors merge and the coefficients explode.",
    sections: [
      { id: "near", title: "Close to defective", html: String.raw`
        ${run("near")}
        ${demo("barrels", "Nearly equal rates", "move the second drain rate b")}` },
      { id: "fragile", title: "A tiny perturbation", html: String.raw`
        $$J_n(0) + \varepsilon\,\mathbf e_n\mathbf e_1^\top: \quad \lambda^n = \varepsilon, \qquad |\lambda| = \varepsilon^{1/n}.$$
        ${run("fragile")}
        ${demo("fragile", "ε to the power 1/n", "move n and ε")}
        ${run("eigG")}` },
      { id: "schur", title: "Schur and the SVD", html: String.raw`
        $$A = QTQ^*, \quad T \text{ upper triangular}, \; Q \text{ unitary}; \qquad A = U\Sigma V^\top.$$
        ${run("schur")}
        ${callout("note", "PATTERN", `<p>Jordan answers an exact question with an unstable answer. Schur gives the eigenvalues on a triangular diagonal with \\(\\operatorname{cond}(Q) = 1\\), and the SVD gives orthonormal bases for any matrix; both are what libraries compute.</p>`)}` },
    ],
    takeaways: [
      "Near-defective: cond(X) huge.",
      "Perturbation ε moves λ by ε^(1/n).",
      "Compute with Schur or the SVD.",
    ],
  },
  {
    slug: "6-practice", nav: "Practice", title: "Check, Practise, Use AI Well",
    subtitle: "Self-check, exercises, and a misleading eig",
    abstract: "Five quick questions, the exercises, and why three different floating-point eigenvalues do not prove that G is diagonalizable.",
    tags: ["quiz", "exercises", "working with AI"],
    hero: "toc",
    sections: [
      { id: "quiz", title: "Check your understanding", html: String.raw`
        ${demo("quiz", "Self-check", "five questions")}
        ${run("cyu")}` },
      { id: "exercises", title: "Exercises", html: String.raw`
        <p>Try each exercise on paper first. <b>Hint</b> gives a nudge; <b>Full solution</b> works it through, with the code that checks every number. Stars mark the level: ★ compute or check, ★★ explain or build, ★★★ extend or combine.</p>` },
      { id: "ai", title: "Working with AI", html: String.raw`
        <p>An assistant runs <code>np.linalg.eig(G)</code>, sees three different eigenvalues and an eigenvector matrix that is not exactly singular, and answers "diagonalizable". The determinant of \(X\) is below \(10^{-12}\) and its condition number above \(10^8\): the columns are numerically one line.</p>
        ${run("claim")}
        <p>Count eigenvectors with the exact rank of \(G - 2I\) instead.</p>` },
    ],
    takeaways: [
      "Count eigenvectors exactly.",
      "Blocks from ranks of (A − λI)ᵏ.",
      "Compute with Schur, not Jordan.",
    ],
  },
];
