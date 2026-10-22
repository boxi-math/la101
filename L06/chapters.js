// Chapter content, adapted from notes/L06-column-space-nullspace.md. Code and outputs are copied from the note (demos.js).
// Maths is written \( … \) (inline) and $$ … $$ (display) and typeset by the vendored KaTeX (../assets/katex/).
// Section html uses String.raw so LaTeX backslashes need no doubling.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);
const video = (src) => `<div class="card video" data-video="${src}"></div>`;
const VIDEO_P1 = "media/L06-1.mp4";
const VIDEO_P2 = "media/L06-2.mp4";

const LECTURE = {
  number: 6,
  title: "Column Space and Nullspace",
  tagline: "Where can it go, and what goes nowhere?",
  lead: "Every matrix carries two subspaces. The column space collects every output Ax: the targets a system can reach. The nullspace collects every input with Ax = 0: the recipes that go nowhere. A robot on a grid and a drone in space show both.",
  heroDemo: "spacesMini",
  heroLabel: "C(M) and N(M)",
  heroCaption: "The robot matrix M = [[1, 2], [3, 6]]: reachable targets lie on the line through (1, 3); recipes that go nowhere lie on the line through (2, −1).",
  whyTitle: "Why two subspaces",
  whySub: "Two questions every system of equations asks",
  why: [
    ["Can it be solved?", "\\(A\\mathbf{x} = \\mathbf{b}\\) has a solution exactly when \\(\\mathbf{b}\\) is in the column space \\(C(A)\\)."],
    ["How many ways?", "Two recipes for the same target differ by a vector of the nullspace \\(N(A)\\)."],
    ["What a layer can do", "\\(C(W)\\) is what a linear layer can output; \\(N(W)\\) is what it cannot see."],
  ],
  ctaTitle: "Ready to find the two spaces?",
  minutes: "About 60–90 minutes",
  videos: {
    [VIDEO_P1]: "Lecture 6 · Part 1 — Where can it go, and what goes nowhere?",
    [VIDEO_P2]: "Lecture 6 · Part 2 — A drone in space: a plane of targets, a line of do-nothing recipes",
  },
};

const CHAPTERS = [
  {
    slug: "1-robot", nav: "Robot", title: "Two Questions about a Robot",
    subtitle: "Subspaces, the column space and the nullspace",
    abstract: "The robot of Lecture 1 with moves a = (1, 3) and b = (2, 6). Which targets can it reach, and which recipes leave it where it started? Both answers are lines through the origin, in two different planes.",
    tags: ["subspace", "C(A)", "N(A)"],
    hero: "spaces", heroCaption: "Change the matrix and the target; the two pictures follow.",
    sections: [
      { id: "robot", title: "The robot, again", html: String.raw`
        ${video(VIDEO_P1)}
        $$M = \begin{bmatrix} 1 & 2 \\ 3 & 6 \end{bmatrix}$$
        <p>\(M\mathbf{x}\) is \(x\) copies of <b>a</b> \(= (1, 3)\) plus \(y\) copies of <b>b</b> \(= (2, 6)\). Two recipes land on \((7, 21)\); two land back on the start, because <b>b</b> is twice <b>a</b>.</p>
        ${run("robot")}` },
      { id: "subspaces", title: "Subspaces", html: String.raw`
        ${callout("note", "DEFINITION", `<p>A set \\(S\\) of vectors in \\(\\mathbf{R}^n\\) is a <b>subspace</b> when it is not empty, the sum of any two vectors in \\(S\\) is in \\(S\\), and any number times a vector in \\(S\\) is in \\(S\\). Taking the number 0 shows every subspace contains \\(\\mathbf{0}\\).</p>`)}
        <p>In \(\mathbf{R}^2\) the subspaces are \(\{\mathbf{0}\}\), lines through the origin, and the whole plane. In \(\mathbf{R}^3\) add the planes through the origin. <b>Yes needs an argument, no needs one example</b>: one sum or one multiple that leaves the set is enough to say "not a subspace".</p>` },
      { id: "colspace", title: "The column space", html: String.raw`
        ${callout("note", "DEFINITION", `<p>The <b>column space</b> \\(C(A)\\) of an \\(m \\times n\\) matrix is the set of all combinations of its columns, all \\(A\\mathbf{x}\\). It is a subspace of \\(\\mathbf{R}^m\\), and \\(A\\mathbf{x} = \\mathbf{b}\\) has a solution exactly when \\(\\mathbf{b}\\) is in \\(C(A)\\).</p>`)}
        <p>Every combination \(x\,(1, 3) + y\,(2, 6) = (x + 2y)\,(1, 3)\), so \(C(M)\) is the <b>line through \((1, 3)\)</b>. A numerical test: adding \(\mathbf{b}\) as an extra column must not raise the rank.</p>
        ${run("incol")}
        ${callout("pitfall", "PITFALL · NOT JUST THE COLUMNS", `<p>\\(C(M)\\) is not the two arrows \\((1, 3)\\) and \\((2, 6)\\); it is the whole infinite line of their combinations.</p>`)}` },
      { id: "nullspace", title: "The nullspace", html: String.raw`
        ${callout("note", "DEFINITION", `<p>The <b>nullspace</b> \\(N(A)\\) is the set of all solutions of \\(A\\mathbf{x} = \\mathbf{0}\\). It is a subspace of \\(\\mathbf{R}^n\\).</p>`)}
        <p>\(M\mathbf{x} = \mathbf{0}\) says \(x + 2y = 0\), so \(N(M)\) is the <b>line through \((2, -1)\)</b>: "two a's forward, one b back".</p>
        ${run("null")}
        ${callout("pitfall", "PITFALL · TWO DIFFERENT PLANES", `<p>\\(C(M)\\) lives where the robot moves (positions); \\(N(M)\\) lives where the recipes live (amounts). For an \\(m \\times n\\) matrix, \\(C(A)\\) is in \\(\\mathbf{R}^m\\) and \\(N(A)\\) in \\(\\mathbf{R}^n\\).</p>`)}
        ${demo("spaces", "Demo 1 · Column space and nullspace", "move the entries and the target", "Make the matrix invertible (for example d = 5): the column space becomes the whole plane and the nullspace shrinks to the origin.")}
        ${predict("Can \\(N(A)\\) be just the zero vector?", `<p>Yes: when the columns are independent, as for the paint matrix of Lecture 2.</p>${run("paint")}`)}` },
    ],
    takeaways: [
      "A subspace is closed under adding and scaling, so it contains 0.",
      "C(A): all Ax, in Rᵐ. Ax = b is solvable exactly when b is in C(A).",
      "N(A): all x with Ax = 0, in Rⁿ.",
    ],
  },
  {
    slug: "2-drone", nav: "Drone", title: "A Drone in Space",
    subtitle: "A plane of targets, a line of do-nothing recipes",
    abstract: "Three buttons that look like three directions, but w = 2u + v. Elimination finds the plane the drone can reach; the recipes that bring it back form a line; and the recipes for one target form a shifted line that is not a subspace.",
    tags: ["plane", "b₁ − b₂ + b₃ = 0", "not a subspace"],
    hero: "drone", heroCaption: "Move the target: on the plane or off it?",
    sections: [
      { id: "drone", title: "Three buttons", html: String.raw`
        ${video(VIDEO_P2)}
        $$D = \begin{bmatrix} 1 & 1 & 3 \\ 2 & 3 & 7 \\ 1 & 2 & 4 \end{bmatrix}, \qquad \mathbf{u}, \mathbf{v}, \mathbf{w} = \text{columns}.$$
        <p>Button <b>w</b> is \(2\mathbf{u} + \mathbf{v}\), so \(C(D)\) is the <b>plane</b> spanned by \((1, 2, 1)\) and \((1, 3, 2)\). Elimination on \([D \mid \mathbf{b}]\): row 2 − 2 × row 1 and row 3 − row 1 both leave \((0, 1, 1)\); subtracting them leaves zeros on the left and \(b_1 - b_2 + b_3\) on the right.</p>
        $$\mathbf{b} \text{ is in } C(D) \iff b_1 - b_2 + b_3 = 0.$$
        ${run("drone")}
        ${demo("drone", "Demo 2 · Which targets can the drone reach?", "move b₁, b₂, b₃")}` },
      { id: "dnull", title: "Recipes that go nowhere", html: String.raw`
        <p>Since \(2\mathbf{u} + \mathbf{v} - \mathbf{w} = \mathbf{0}\), \(N(D)\) is the <b>line through \((2, 1, -1)\)</b>. (Lecture 7 finds nullspaces systematically.)</p>
        ${run("dnull")}` },
      { id: "notsub", title: "The solutions of Ax = b are not a subspace", html: String.raw`
        <p>For \(\mathbf{b} = (2, 5, 3)\), one recipe is \((1, 1, 0)\), and \((1, 1, 0) + t\,(2, 1, -1)\) all reach \(\mathbf{b}\):</p>
        ${run("sols")}
        <p>A line, but <b>not</b> a subspace: it misses \(\mathbf{0}\), and the sum of two solutions reaches \(2\mathbf{b}\).</p>
        ${run("notsub")}
        ${predict("If \\(\\mathbf{b} = \\mathbf{0}\\), is the solution set a subspace?", `<p>Yes: it is exactly the nullspace. Only the right-hand side \\(\\mathbf{0}\\) gives a subspace.</p>`)}` },
    ],
    takeaways: [
      "w = 2u + v: the drone reaches only the plane b₁ − b₂ + b₃ = 0.",
      "N(D) is the line through (2, 1, −1).",
      "Solutions of Ax = b: one recipe + the nullspace. Not a subspace unless b = 0.",
    ],
  },
  {
    slug: "3-layer", nav: "Layers", title: "What a Layer Can Produce",
    subtitle: "Column space = possible outputs; nullspace = blind directions",
    abstract: "A linear layer y = Wx. Its column space is everything it can output; its nullspace is every change of input it cannot see.",
    tags: ["linear layer", "bottleneck", "ML"],
    hero: "code:layer", heroCaption: "Two small layers",
    sections: [
      { id: "layer", title: "Outputs and blind directions", html: String.raw`
        <p>A layer from 2 inputs to 3 outputs can only produce vectors on a plane in \(\mathbf{R}^3\). A layer from 3 inputs to 2 outputs has a nonzero nullspace: two different inputs can give the same output.</p>
        ${run("layer")}
        <p>For <code>W_up</code> the third output is always the sum of the first two, so \((1, 1, 2)\) can come out and \((1, 1, 1)\) never can. For <code>W</code>, \((2, 0, 1)\) and \((3, -1, 2)\) both give \((2, 1)\): the change \((1, -1, 1)\) is in its nullspace.</p>
        ${callout("note", "ML", `<p>A layer with fewer outputs than inputs always throws some information away (Lecture 7 shows why). In a bottleneck layer that is the point; it also means some inputs are indistinguishable to everything after it.</p>`)}` },
    ],
    takeaways: [
      "C(W): what a layer can output.",
      "N(W): input changes the layer cannot see.",
      "Fewer outputs than inputs ⇒ a nonzero nullspace.",
    ],
  },
  {
    slug: "4-practice", nav: "Practice", title: "Check, Practise, Use AI Well",
    subtitle: "Self-check, exercises, and checking an assistant's answer",
    abstract: "Five quick questions, the exercises, and the habit for AI help: a 'yes, it is reachable' must come with amounts, and you multiply back every entry.",
    tags: ["quiz", "exercises", "working with AI"],
    hero: "toc",
    sections: [
      { id: "quiz", title: "Check your understanding", html: String.raw`${demo("quiz", "Self-check", "five questions")}` },
      { id: "exercises", title: "Exercises", html: String.raw`
        <p>Try each exercise on paper first. <b>Hint</b> gives a nudge; <b>Full solution</b> works it through, with the code that checks every number. Stars mark the level: ★ compute or check, ★★ explain or build, ★★★ extend or combine.</p>` },
      { id: "ai", title: "Working with AI", html: String.raw`
        <p>"Can \(A\) reach \(\mathbf{b}\)?" has a cheap certificate: a "yes" must come with amounts, and you compute <code>D @ x</code> and compare <em>every</em> entry. Here an assistant claims \((2, -1, 0)\) reaches \((1, 1, 1)\), having checked only east and north:</p>
        ${run("claim")}
        <p>The claimed recipe lands at \((1, 1, 0)\), and the rank test says no recipe reaches \((1, 1, 1)\) at all.</p>` },
    ],
    takeaways: [
      "Yes needs amounts; multiply back every entry.",
      "No: rank test or the plane equation.",
      "A nullspace vector must give all zeros.",
    ],
  },
];
