// Chapter content, adapted from notes/L13-projections.md. Code and outputs are copied from the note (demos.js).
// Maths is written \( … \) (inline) and $$ … $$ (display) and typeset by the vendored KaTeX (../assets/katex/).
// Section html uses String.raw so LaTeX backslashes need no doubling.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);
const video = (src) => `<div class="card video" data-video="${src}"></div>`;
const VIDEO_P1 = "media/L13-1.mp4";
const VIDEO_P2 = "media/L13-2.mp4";

const LECTURE = {
  number: 13,
  title: "Projections",
  tagline: "The closest point is where the gap is perpendicular",
  lead: "The robot can only move along a line and the customer is off it. The best stop is where the gap meets the line at a right angle. The same idea projects onto the drone's plane through the normal equations AᵀAx̂ = Aᵀb, gives the projection matrix P, and removes an unwanted direction from embeddings.",
  heroDemo: "projectMini",
  heroLabel: "The best stop",
  heroCaption: "The robot tries stops along its line towards the customer at (7, 5): the distance is smallest at 11/5, where the gap is perpendicular.",
  whyTitle: "Why projections",
  whySub: "When Ax = b has no solution, get as close as possible",
  why: [
    ["Line", "x̂ = aᵀb / aᵀa, p = x̂a, P = aaᵀ / aᵀa."],
    ["Subspace", "AᵀA x̂ = Aᵀb, P = A(AᵀA)⁻¹Aᵀ, P² = P = Pᵀ."],
    ["Closest", "‖b − q‖² = ‖e‖² + ‖p − q‖²: no other point is closer."],
  ],
  ctaTitle: "Ready to project?",
  minutes: "About 60–90 minutes",
  videos: {
    [VIDEO_P1]: "Lecture 13 · Part 1 — Projecting onto a line",
    [VIDEO_P2]: "Lecture 13 · Part 2 — Projecting onto a plane",
  },
};

const CHAPTERS = [
  {
    slug: "1-line", nav: "Line", title: "Projecting onto a Line",
    subtitle: "The robot's closest stop",
    abstract: "The robot reaches only multiples of a = (1, 3); the customer waits at b = (7, 5). Choosing the stop so that the gap is perpendicular to the line gives x̂ = aᵀb / aᵀa and the projection matrix P = aaᵀ / aᵀa.",
    tags: ["projection", "error", "projection matrix"],
    hero: "project", heroCaption: "Drag b, a and the trial stop t.",
    sections: [
      { id: "robot", title: "The robot's closest point", html: String.raw`
        ${video(VIDEO_P1)}
        $$\mathbf{a}^\top(\mathbf{b} - \hat{x}\mathbf{a}) = 0 \quad\Longrightarrow\quad \hat{x} = \frac{\mathbf{a}^\top\mathbf{b}}{\mathbf{a}^\top\mathbf{a}} = \frac{22}{10} = \frac{11}{5}.$$
        ${run("robot")}
        <p>Two other stops are farther away:</p>
        ${run("stops")}
        ${run("targets")}` },
      { id: "matrix", title: "The projection matrix onto a line", html: String.raw`
        $$P = \frac{\mathbf{a}\mathbf{a}^\top}{\mathbf{a}^\top\mathbf{a}} = \frac{1}{10}\begin{bmatrix}1 & 3\\ 3 & 9\end{bmatrix}, \qquad P^2 = P = P^\top.$$
        ${run("pline")}
        <p>\(I - P\) gives the error and projects onto the perpendicular line.</p>
        ${run("qline")}
        ${callout("pitfall", "PITFALL · P DEPENDS ON THE LINE, NOT ON THE VECTOR", "<p>a = (2, 6) gives the same P (but x̂ = 11/10): only the direction matters.</p>")}
        ${run("sameline")}` },
    ],
    takeaways: [
      "Gap perpendicular ⇒ x̂ = aᵀb / aᵀa.",
      "P = aaᵀ / aᵀa: rank 1, P² = P = Pᵀ.",
      "e = (I − P)b.",
    ],
  },
  {
    slug: "2-plane", nav: "Plane", title: "Projecting onto a Plane",
    subtitle: "The normal equations AᵀAx̂ = Aᵀb",
    abstract: "The drone with buttons u = (1, 2, 1) and v = (1, 3, 2) cannot reach (1, 1, 1). The error must be perpendicular to both columns: Aᵀ(b − Ax̂) = 0.",
    tags: ["normal equations", "AᵀA", "projection matrix"],
    hero: "normal", heroCaption: "Type A and b: exact x̂, p and e.",
    sections: [
      { id: "normal", title: "The normal equations", html: String.raw`
        ${video(VIDEO_P2)}
        $$A^\top(\mathbf{b} - A\hat{\mathbf{x}}) = \mathbf{0} \quad\Longrightarrow\quad A^\top A\,\hat{\mathbf{x}} = A^\top\mathbf{b}.$$
        ${run("ata")}
        <p>The error is a multiple of the plane's normal \((1, -1, 1)\), the left nullspace of Lecture 10:</p>
        ${run("normal")}
        ${run("b4")}` },
      { id: "pmat", title: "The projection matrix onto a subspace", html: String.raw`
        $$P = A(A^\top A)^{-1}A^\top.$$
        ${run("p3")}
        ${callout("pitfall", "PITFALL · YOU CANNOT SPLIT (AᵀA)⁻¹", "<p>A is 3 × 2 and has no inverse; P has rank 2, not 3. Use independent columns: the plane is the same with any basis.</p>")}
        ${run("ws")}
        ${run("all")}` },
    ],
    takeaways: [
      "AᵀA x̂ = Aᵀb.",
      "e lies in the left nullspace.",
      "P = A(AᵀA)⁻¹Aᵀ needs independent columns.",
    ],
  },
  {
    slug: "3-closest", nav: "Closest", title: "Why It Is Closest; Removing a Direction",
    subtitle: "Pythagoras, and I − P on embeddings",
    abstract: "Any other point of the subspace is farther by Pythagoras. Applying I − P removes an unwanted direction from embeddings, here a 'price' direction in a café recommender.",
    tags: ["closest point", "Pythagoras", "embeddings", "ML"],
    hero: "code:price", heroCaption: "Removing the price direction g = (1, 1, 0)",
    sections: [
      { id: "closest", title: "Why the projection is the closest point", html: String.raw`
        $$\|\mathbf{b} - \mathbf{q}\|^2 = \|\mathbf{e}\|^2 + \|\mathbf{p} - \mathbf{q}\|^2 \ \ge\ \|\mathbf{e}\|^2.$$
        ${run("closest")}` },
      { id: "ml", title: "Machine learning: removing a direction", html: String.raw`
        <p>Made-up café embeddings in \(\mathbf{R}^3\); the direction \(\mathbf{g} = (1, 1, 0)\) tracks price. Comparing by flavour only means applying \(I - P_g\):</p>
        ${run("price")}
        <p>Removing it twice changes nothing more:</p>
        ${run("twice")}
        ${callout("ml", "ML", "<p>A well-known study of word embeddings removed a gender direction from gender-neutral words in exactly this way. One direction removed is not the whole bias: other directions can still carry it.</p>")}` },
    ],
    takeaways: [
      "Projection = closest point.",
      "I − P removes a direction.",
      "(I − P)² = I − P.",
    ],
  },
  {
    slug: "4-practice", nav: "Practice", title: "Check, Practise, Use AI Well",
    subtitle: "Self-check, exercises, and checking a projection",
    abstract: "Four quick questions, the exercises, and three one-line checks for any claimed projection.",
    tags: ["quiz", "exercises", "working with AI"],
    hero: "toc",
    sections: [
      { id: "quiz", title: "Check your understanding", html: String.raw`${demo("quiz", "Self-check", "four questions")}` },
      { id: "exercises", title: "Exercises", html: String.raw`
        <p>Try each exercise on paper first. <b>Hint</b> gives a nudge; <b>Full solution</b> works it through, with the code that checks every number. Stars mark the level: ★ compute or check, ★★ explain or build, ★★★ extend or combine.</p>` },
      { id: "ai", title: "Working with AI", html: String.raw`
        <p><b>Check</b> (1) \(A^\top\mathbf{e} = \mathbf{0}\); (2) \(\mathbf{p}\) is in the subspace; (3) \(P^2 = P = P^\top\) with the right rank. A made-up answer projected onto each column separately and added:</p>
        ${run("claim")}
        <p>The error is not perpendicular to the columns: test (1) fails at once. Piece-by-piece projection needs an orthogonal basis (here u·v = 9).</p>` },
    ],
    takeaways: [
      "Aᵀe = 0 is the test.",
      "P² = P = Pᵀ, rank = dimension.",
      "Separate projections add up only for orthogonal bases.",
    ],
  },
];
