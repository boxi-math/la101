// Chapter content, adapted from notes/E4-minimum-principles-finite-elements.md. Code and outputs are copied from the note (demos.js).
// Maths is written \( … \) (inline) and $$ … $$ (display) and typeset by the vendored KaTeX (../assets/katex/).
// Section html uses String.raw so LaTeX backslashes need no doubling.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);
const video = (src) => `<div class="card video" data-video="${src}"></div>`;
const VIDEO_P1 = "media/E4-1.mp4";
const VIDEO_P2 = "media/E4-2.mp4";

const LECTURE = {
  number: "E4",
  id: "E4",
  label: "Elective E4",
  title: "Minimum Principles and Finite Elements",
  tagline: "Solve by minimising energy",
  lead: "For a positive definite K, solving Kx = f is the same as minimising the energy P(x) = ½xᵀKx − xᵀf. A chain of springs shows where such matrices come from (K = AᵀCA), the Ritz method minimises over a few trial directions, and finite elements apply the same idea to a bar: hat functions turn −(c u′)′ = f into a sparse, positive definite system in which every element is a spring.",
  heroDemo: "femMini",
  heroLabel: "Broken lines through the nodes",
  heroCaption: "Finite element solutions with 1, 3 and 7 interior nodes (blue) against the exact parabola (orange): exact at the nodes, error h²/8 in between.",
  whyTitle: "Why minimise?",
  whySub: "Nature settles where the energy is lowest",
  why: [
    ["Minimum principle", "For positive definite \\(K\\): \\(P(\\mathbf x) - P(\\mathbf x^*) = \\tfrac12(\\mathbf x - \\mathbf x^*)^\\top K(\\mathbf x - \\mathbf x^*)\\)."],
    ["Approximation", "The Ritz method minimises over \\(\\mathbf x = V\\mathbf y\\): \\(V^\\top KV\\mathbf y = V^\\top\\mathbf f\\), always above the true minimum."],
    ["Finite elements", "Hat functions give a tridiagonal stiffness matrix assembled from one spring \\(\\frac{c_e}{h}\\left[\\begin{smallmatrix}1&-1\\\\-1&1\\end{smallmatrix}\\right]\\) per element."],
  ],
  ctaTitle: "Ready to minimise?",
  minutes: "About 60–90 minutes",
  videos: {
    [VIDEO_P1]: "Elective E4 · Part 1 — Solving by minimising: springs and the Ritz method",
    [VIDEO_P2]: "Elective E4 · Part 2 — Finite elements: every element is a spring",
  },
};

const CHAPTERS = [
  {
    slug: "1-minimum", nav: "Minimum", title: "Solving by Minimising",
    subtitle: "The minimum principle and why it needs positive definiteness",
    abstract: "For K = [[3, −1], [−1, 3]] and f = (4, 0), the solution (1.5, 0.5) is the lowest point of P, with P = −3; every other point is higher by the energy of its error. For an indefinite matrix the solution is a saddle.",
    tags: ["energy", "minimum principle", "saddle"],
    hero: "code:min", heroCaption: "x* = (1.5, 0.5), P* = −3 = −½ fᵀx*",
    sections: [
      { id: "min", title: "The minimum principle", html: String.raw`
        ${video(VIDEO_P1)}
        $$P(\mathbf x) = \tfrac12\mathbf x^\top K\mathbf x - \mathbf x^\top\mathbf f, \qquad \nabla P = K\mathbf x - \mathbf f, \qquad P(\mathbf x) - P(\mathbf x^*) = \tfrac12(\mathbf x - \mathbf x^*)^\top K(\mathbf x - \mathbf x^*).$$
        ${run("min")}
        <p>The last column is the energy of the error: exactly how much higher each point is.</p>` },
      { id: "saddle", title: "Only for positive definite K", html: String.raw`
        ${run("saddle")}
        ${callout("pitfall", "PITFALL · A SOLUTION IS NOT ALWAYS A MINIMUM", `<p>\\(M = \\left[\\begin{smallmatrix}1&3\\\\3&1\\end{smallmatrix}\\right]\\) has eigenvalues 4 and \\(-2\\). The solution \\((1, 1)\\) of \\(M\\mathbf x = (4, 4)\\) is a saddle of \\(P\\): along \\((1, -1)\\) the energy falls without end.</p>`)}` },
    ],
    takeaways: [
      "Positive definite K: solve = minimise.",
      "Extra energy = energy of the error.",
      "Indefinite K: a saddle, no minimum.",
    ],
  },
  {
    slug: "2-springs", nav: "Springs", title: "A Chain of Springs: K = AᵀCA",
    subtitle: "Stretch, tension, balance",
    abstract: "Two masses, three springs with stiffnesses 2, 1, 2 and a force 4: stretch e = Ax, tension w = Ce, balance Aᵀw = f. The stored energy 1.5 is half the work 6, so P = −3.",
    tags: ["AᵀCA", "Hooke's law", "stiffness matrix"],
    hero: "springs", heroCaption: "Change the stiffnesses and the force: the masses settle at the minimum of P.",
    sections: [
      { id: "springs", title: "Three steps, three matrices", html: String.raw`
        $$\mathbf e = A\mathbf x, \qquad \mathbf w = C\mathbf e, \qquad A^\top\mathbf w = \mathbf f \quad\Longrightarrow\quad A^\top CA\,\mathbf x = \mathbf f.$$
        ${run("springs")}
        ${demo("springs", "Spring chain", "move the stiffnesses c₁, c₂, c₃ and the force f₁")}
        ${callout("note", "PATTERN", `<p>\\(A^\\top CA\\) is everywhere: normal equations (\\(C = I\\)), networks (Elective E1), weighted least squares (Elective E7). Positive definite when \\(A\\) has independent columns and \\(C\\) is positive.</p>`)}` },
    ],
    takeaways: [
      "K = AᵀCA is positive definite.",
      "Tension can be negative: compression.",
      "Stored energy = half the work at the minimum.",
    ],
  },
  {
    slug: "3-ritz", nav: "Ritz", title: "The Ritz Method",
    subtitle: "Minimise over a subspace",
    abstract: "Search only x = Vy: the small system VᵀKVy = Vᵀf. Along (1, 1) the energy is −2, along (1, 0) it is −2.67, along (3, 1) it is the exact −3. The error is K-orthogonal to the trial space.",
    tags: ["Ritz–Galerkin", "trial vectors", "Galerkin orthogonality"],
    hero: "ritz", heroCaption: "Turn the trial direction: the Ritz energy never goes below −3.",
    sections: [
      { id: "ritz", title: "One trial vector at a time", html: String.raw`
        $$\mathbf x_R = V\mathbf y, \qquad (V^\top KV)\,\mathbf y = V^\top\mathbf f, \qquad V^\top K(\mathbf x_R - \mathbf x^*) = \mathbf 0.$$
        ${run("ritz")}
        ${demo("ritz", "Ritz in one direction", "turn the trial vector v")}
        ${callout("ml", "MACHINE LEARNING", `<p>Ridge regression minimises a \\(P\\) with \\(K = X^\\top X + \\alpha I\\). Training lowers the energy instead of inverting \\(K\\); restricting parameters to a subspace is a Ritz approximation, so its minimum can only be higher.</p>`)}` },
    ],
    takeaways: [
      "Ritz = minimise on a subspace.",
      "Energy always above the true minimum.",
      "Error K-orthogonal to the subspace.",
    ],
  },
  {
    slug: "4-elements", nav: "Elements", title: "Finite Elements",
    subtitle: "Hat functions, stiffness matrix, accuracy",
    abstract: "A bar −(c u′)′ = f minimises ∫ ½c u′² − f u. Hat functions give K = (1/h)·tridiag(−1, 2, −1) for c = 1: exact at the nodes, error h²/8 between them, 295 nonzeros of 9801 for 99 unknowns. Two materials give element springs 4, 4, 16, 16.",
    tags: ["hat functions", "assembly", "sparsity"],
    hero: "fem", heroCaption: "Change the number of nodes and the stiffness of the right half.",
    sections: [
      { id: "bar", title: "The energy of a bar", html: String.raw`
        ${video(VIDEO_P2)}
        $$-\big(c(x)\,u'(x)\big)' = f(x), \quad u(0) = u(1) = 0, \qquad P(u) = \int_0^1 \tfrac12\,c\,(u')^2\,dx - \int_0^1 f\,u\,dx.$$
        ${run("barenergy")}
        <p>The parabola \(\tfrac12x(1 - x)\) has the lowest energy, \(-\tfrac1{24}\); the best sine wave and \(x(1 - x)^2\) are higher.</p>` },
      { id: "hats", title: "Hat functions and the stiffness matrix", html: String.raw`
        $$K_{ij} = \int_0^1 c\,\varphi_i'\varphi_j'\,dx, \qquad F_i = \int_0^1 f\,\varphi_i\,dx, \qquad \text{one element: } \frac{c_e}{h}\begin{bmatrix}1&-1\\-1&1\end{bmatrix}.$$
        ${run("fem3")}
        ${run("err")}
        ${demo("fem", "Finite elements on a bar", "move the number of nodes and the stiffness of the right half")}` },
      { id: "sparse", title: "Sparse, positive definite, two materials", html: String.raw`
        ${run("sparse")}
        ${callout("pitfall", "PITFALL · THE MATRIX IS SPARSE", `<p>Every unknown influences the whole bar through \\(K^{-1}\\), which is full. \\(K\\) itself only couples neighbours: 295 nonzeros out of 9801 for 99 unknowns.</p>`)}
        ${run("twomat")}
        <p>The exact solution has a kink at \(x = \tfrac12\): the tension \(c\,u'\) is continuous, so the slope shrinks by a factor of 4 where \(c\) jumps.</p>` },
    ],
    takeaways: [
      "Each element is a spring c_e/h.",
      "K tridiagonal, positive definite.",
      "Error O(h²): halve h, divide by 4.",
    ],
  },
  {
    slug: "5-practice", nav: "Practice", title: "Check, Practise, Use AI Well",
    subtitle: "Self-check, exercises, and a positive definiteness test",
    abstract: "Five quick questions, the exercises, and how a Cholesky factorisation tells you whether there is a minimum to find.",
    tags: ["quiz", "exercises", "working with AI"],
    hero: "toc",
    sections: [
      { id: "quiz", title: "Check your understanding", html: String.raw`${demo("quiz", "Self-check", "five questions")}` },
      { id: "exercises", title: "Exercises", html: String.raw`
        <p>Try each exercise on paper first. <b>Hint</b> gives a nudge; <b>Full solution</b> works it through, with the code that checks every number. Stars mark the level: ★ compute or check, ★★ explain or build, ★★★ extend or combine.</p>` },
      { id: "ai", title: "Working with AI", html: String.raw`
        <p>Before minimising, test positive definiteness: <code>numpy.linalg.cholesky</code> raises <code>LinAlgError</code> when it fails. It reads one triangle only, so check symmetry first.</p>
        ${run("claim")}` },
    ],
    takeaways: [
      "Test positive definiteness first.",
      "Stiffness is (1/h)·tridiag, not h·tridiag.",
      "Check nodal values against ½x(1 − x).",
    ],
  },
];
