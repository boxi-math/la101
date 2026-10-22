// Chapter content, adapted from notes/L23-positive-definite-minima.md. Code and outputs are copied from the note (demos.js).
// Maths is written \( … \) (inline) and $$ … $$ (display) and typeset by the vendored KaTeX (../assets/katex/).
// Section html uses String.raw so LaTeX backslashes need no doubling.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);
const video = (src) => `<div class="card video" data-video="${src}"></div>`;
const VIDEO_P1 = "media/L23-1.mp4";
const VIDEO_P2 = "media/L23-2.mp4";

const LECTURE = {
  number: 23,
  title: "Positive Definite Matrices, Minima and Quadratic Forms",
  tagline: "The Hessian decides; the eigenvalues name the shape",
  lead: "At a flat point the second derivative matrix decides: positive definite means a minimum, mixed signs a saddle. The Rayleigh quotient measures curvature in a direction and sets the step of gradient descent. Rotating to the eigenvectors puts every quadratic form in canonical form, the signs of the eigenvalues name the conic or quadric surface, and Sylvester's law says those signs survive any change of variables.",
  heroDemo: "conicMini",
  heroLabel: "Level curves of xᵀSx",
  heroCaption: "An ellipse (++), a hyperbola (+−), two lines (+0) and an axis-aligned ellipse.",
  whyTitle: "Why quadratic forms",
  whySub: "Every smooth minimum looks like a bowl",
  why: [
    ["Second derivative test", "\\(f(\\mathbf p + \\mathbf h) \\approx f(\\mathbf p) + \\tfrac12\\mathbf h^\\top H\\mathbf h\\) at a critical point: \\(H\\) positive definite gives a minimum."],
    ["Gradient descent", "Error factors \\(1 - \\eta\\lambda\\): converge for \\(\\eta < 2/\\lambda_{\\max}\\); speed set by \\(\\kappa = \\lambda_{\\max}/\\lambda_{\\min}\\)."],
    ["Principal axes", "\\(\\mathbf x = Q\\mathbf y\\) gives \\(\\lambda_1y_1^2 + \\dots + \\lambda_ny_n^2\\); the signs name the shape and survive \\(B^\\top SB\\)."],
  ],
  ctaTitle: "Ready for minima and quadratic forms?",
  minutes: "About 60–90 minutes",
  videos: {
    [VIDEO_P1]: "Lecture 23 · Part 1 — Minima, saddles and the Rayleigh quotient",
    [VIDEO_P2]: "Lecture 23 · Part 2 — Quadratic forms, conics and Sylvester's law",
  },
};

const CHAPTERS = [
  {
    slug: "1-minima", nav: "Minima", title: "Minimum, Maximum or Saddle",
    subtitle: "The Hessian decides",
    abstract: "Two flat points of one function: the Hessian is positive definite at one and indefinite at the other. A positive diagonal is not enough.",
    tags: ["Hessian", "critical points", "saddle"],
    hero: "code:crit", heroCaption: "(2, −2): minimum, f = −16/3; (−2, 2): saddle, det −8",
    sections: [
      { id: "crit", title: "Two flat points", html: String.raw`
        ${video(VIDEO_P1)}
        $$f(x, y) = \tfrac13x^3 + x^2 + 2xy + y^2 - 4x, \qquad H = \begin{bmatrix} 2x + 2 & 2 \\ 2 & 2 \end{bmatrix}.$$
        ${run("crit")}
        ${run("taylor")}
        <p>The rise along a small step is \(\frac12\mathbf h^\top H\mathbf h\) up to a cubic correction; at the saddle it is negative along the eigenvector of \(-2.83\).</p>` },
      { id: "saddle", title: "A positive diagonal is not enough", html: String.raw`
        ${run("saddle")}
        ${callout("pitfall", "PITFALL · CHECK THE WHOLE MATRIX", `<p>\\(g = x^2 + 4xy + y^2\\) has \\(g_{xx} = g_{yy} = 2 > 0\\), but \\(g(1, -1) = -2\\): eigenvalues 6 and \\(-2\\), a saddle.</p>`)}` },
    ],
    takeaways: [
      "Gradient zero, then look at H.",
      "H positive definite: minimum; indefinite: saddle.",
      "Diagonal entries alone decide nothing.",
    ],
  },
  {
    slug: "2-rayleigh", nav: "Rayleigh", title: "Curvature in a Direction and the Step Size",
    subtitle: "The Rayleigh quotient and gradient descent",
    abstract: "R(x) = xᵀSx / xᵀx lies between the smallest and largest eigenvalue. Power iteration finds the top one; gradient descent converges only for η < 2/λmax.",
    tags: ["Rayleigh quotient", "power iteration", "gradient descent"],
    hero: "gd", heroCaption: "Change η: watch the two error factors.",
    sections: [
      { id: "rayleigh", title: "The Rayleigh quotient", html: String.raw`
        $$R(\mathbf x) = \frac{\mathbf x^\top S\mathbf x}{\mathbf x^\top\mathbf x} = \frac{\lambda_1c_1^2 + \lambda_2c_2^2}{c_1^2 + c_2^2}, \qquad \lambda_{\min} \le R \le \lambda_{\max}.$$
        ${run("rayleigh")}
        ${run("power")}
        <p>The quotient is far more accurate than the vector: at step 2 it is 5.999 while the vector is still 0.8° off.</p>` },
      { id: "gd", title: "How the eigenvalues set the step", html: String.raw`
        $$L(\mathbf w) = \tfrac12\mathbf w^\top C\mathbf w - \mathbf b^\top\mathbf w, \qquad \mathbf e_{k+1} = (I - \eta C)\,\mathbf e_k.$$
        ${run("gd")}
        ${demo("gd", "Gradient descent", "move the learning rate η")}
        ${callout("ml", "MACHINE LEARNING", `<p>A large condition number \\(\\kappa = \\lambda_{\\max}/\\lambda_{\\min}\\) means slow descent: the step must be small for the steep direction and is then tiny for the flat one. Rescaling features changes \\(\\kappa\\) (Lecture 25).</p>`)}` },
    ],
    takeaways: [
      "λmin ≤ R(x) ≤ λmax.",
      "Converge for η < 2/λmax.",
      "Best rate (κ − 1)/(κ + 1).",
    ],
  },
  {
    slug: "3-forms", nav: "Forms", title: "Quadratic Forms and Principal Axes",
    subtitle: "Canonical form, conics and quadric surfaces",
    abstract: "Rotating to the eigenvectors removes the cross terms. The half-axes are √(k/λ), and the signs of the eigenvalues name the curve or surface.",
    tags: ["principal axes", "conics", "quadrics"],
    hero: "conic", heroCaption: "Move a, b, c and the level k: the curve, its axes and its name.",
    sections: [
      { id: "axes", title: "The principal axis theorem", html: String.raw`
        ${video(VIDEO_P2)}
        $$5x^2 + 4xy + 2y^2 = \mathbf x^\top C\mathbf x \;\xrightarrow{\;\mathbf x = Q\mathbf y\;}\; 6y_1^2 + y_2^2.$$
        ${run("axes")}
        ${callout("pitfall", "PITFALL · LARGE EIGENVALUE, SHORT AXIS", `<p>\\(9x^2 + y^2 = 1\\) has half-axes \\(\\frac13\\) along \\(x\\) and 1 along \\(y\\): the steepest direction is the shortest axis.</p>`)}` },
      { id: "conics", title: "Signs name the shape", html: String.raw`
        ${run("conics")}
        ${demo("conic", "Level curves", "move a, b, c and the level k")}` },
    ],
    takeaways: [
      "x = Qy: no cross terms.",
      "Half-axes √(k/λ).",
      "++ ellipse, +− hyperbola, +0 lines.",
    ],
  },
  {
    slug: "4-inertia", nav: "Inertia", title: "Sylvester's Law of Inertia",
    subtitle: "What a change of variables keeps",
    abstract: "Any invertible substitution x = By changes the eigenvalues of S into those of BᵀSB, but never the numbers of positive, negative and zero ones. So pivots tell the signs.",
    tags: ["congruence", "inertia", "pivots"],
    hero: "code:inertia", heroCaption: "M: pivots 1, −8; three B: always one + and one −",
    sections: [
      { id: "inertia", title: "Congruent matrices", html: String.raw`
        $$S \to B^\top SB: \quad \text{same numbers of } +,\ -,\ 0 \text{ eigenvalues.}$$
        ${run("inertia")}
        ${callout("note", "PATTERN", `<p>Elimination is a congruence: \\(S = LDL^\\top\\). So the signs of the pivots are the signs of the eigenvalues — the pivot test for positive definiteness is Sylvester's law.</p>`)}` },
    ],
    takeaways: [
      "Inertia survives x = By.",
      "Signs of pivots = signs of eigenvalues.",
      "Only rotations keep the values.",
    ],
  },
  {
    slug: "5-practice", nav: "Practice", title: "Check, Practise, Use AI Well",
    subtitle: "Self-check, exercises, and a lower-triangle trap",
    abstract: "Five quick questions, the exercises, and why eigvalsh on a non-symmetric typo answers a different question.",
    tags: ["quiz", "exercises", "working with AI"],
    hero: "toc",
    sections: [
      { id: "quiz", title: "Check your understanding", html: String.raw`${demo("quiz", "Self-check", "five questions")}` },
      { id: "exercises", title: "Exercises", html: String.raw`
        <p>Try each exercise on paper first. <b>Hint</b> gives a nudge; <b>Full solution</b> works it through, with the code that checks every number. Stars mark the level: ★ compute or check, ★★ explain or build, ★★★ extend or combine.</p>` },
      { id: "ai", title: "Working with AI", html: String.raw`
        <p><code>eigvalsh</code> reads only the lower triangle. A Hessian mistyped as \(\left[\begin{smallmatrix} 6 & 4 \\ 2 & 2 \end{smallmatrix}\right]\) silently gets the eigenvalues of the symmetric matrix with 2 off the diagonal:</p>
        ${run("claim")}
        <p>Check \(H = H^\top\) first.</p>` },
    ],
    takeaways: [
      "Check symmetry before eigvalsh.",
      "Classify by det and trace in 2D.",
      "Half-axes from eigenvalues.",
    ],
  },
];
