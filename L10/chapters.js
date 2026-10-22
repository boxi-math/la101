// Chapter content, adapted from notes/L10-four-subspaces.md. Code and outputs are copied from the note (demos.js).
// Maths is written \( … \) (inline) and $$ … $$ (display) and typeset by the vendored KaTeX (../assets/katex/).
// Section html uses String.raw so LaTeX backslashes need no doubling.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);
const video = (src) => `<div class="card video" data-video="${src}"></div>`;
const VIDEO_P1 = "media/L10-1.mp4";
const VIDEO_P2 = "media/L10-2.mp4";

const LECTURE = {
  number: 10,
  title: "The Four Fundamental Subspaces",
  tagline: "Read the matrix by rows",
  lead: "The drone's matrix, read by rows, gives two more subspaces: the row space and the left nullspace. With the column space and the nullspace they come in two pairs, with dimensions r, n − r, r and m − r. Then a matrix comes apart into rank-one pieces, and a ratings table into a few tastes.",
  heroDemo: "subspacesMini",
  heroLabel: "Four subspaces",
  heroCaption: "The drone, the robot, a 2 × 3 matrix and the café ratings: a basis of each of the four subspaces.",
  whyTitle: "Why four subspaces",
  whySub: "One rank decides them all",
  why: [
    ["Row space", "All combinations of the rows; elimination keeps it. Dimension r."],
    ["Left nullspace", "Row combinations that cancel: the tests a reachable b must pass. Dimension m − r."],
    ["Rank one", "A column times a row. Rank r = r rank-one pieces; a ratings table = a few tastes."],
  ],
  ctaTitle: "Ready to turn the matrix on its side?",
  minutes: "About 60–90 minutes",
  videos: {
    [VIDEO_P1]: "Lecture 10 · Part 1 — Rows: the row space and the left nullspace",
    [VIDEO_P2]: "Lecture 10 · Part 2 — Rank-one pieces",
  },
};

const CHAPTERS = [
  {
    slug: "1-rows", nav: "Rows", title: "The Row Space and the Left Nullspace",
    subtitle: "Two more subspaces from the same twelve numbers",
    abstract: "Read the drone's matrix by rows. Combinations of the rows form the row space; combinations that cancel form the left nullspace.",
    tags: ["row space", "left nullspace", "transpose"],
    hero: "code:setup", heroCaption: "The drone's A and its transpose",
    sections: [
      { id: "four", title: "Four buttons, four subspaces", html: String.raw`
        ${video(VIDEO_P1)}
        $$A = \begin{bmatrix} 1 & 1 & 3 & 0 \\ 2 & 3 & 7 & 1 \\ 1 & 2 & 4 & 1 \end{bmatrix}, \qquad m = 3,\ n = 4,\ r = 2.$$
        ${run("setup")}
        <table><tr><th>subspace</th><th>made of</th><th>lives in</th></tr>
        <tr><td>column space \(C(A)\)</td><td>combinations of the columns</td><td>\(\mathbf{R}^m\)</td></tr>
        <tr><td>nullspace \(N(A)\)</td><td>solutions of \(A\mathbf{x} = \mathbf{0}\)</td><td>\(\mathbf{R}^n\)</td></tr>
        <tr><td><b>row space</b> \(C(A^\top)\)</td><td>combinations of the rows</td><td>\(\mathbf{R}^n\)</td></tr>
        <tr><td><b>left nullspace</b> \(N(A^\top)\)</td><td>solutions of \(A^\top\mathbf{y} = \mathbf{0}\)</td><td>\(\mathbf{R}^m\)</td></tr></table>` },
      { id: "row", title: "The row space", html: String.raw`
        <p>Every row step replaces a row by a combination of rows, and every step can be undone: <b>elimination does not change the row space</b>. The nonzero rows of \(R\) are a basis.</p>
        ${run("rowspace")}
        ${callout("pitfall", "PITFALL · ROWS OF R, PIVOT COLUMNS OF A", "<p>Elimination keeps the row space and the nullspace, not the column space. The columns of R are not in C(A): (1, 0, 0) fails the test b₁ − b₂ + b₃ = 0.</p>")}` },
      { id: "left", title: "The left nullspace", html: String.raw`
        <p>\(\mathbf{y}^\top A = \mathbf{0}^\top\): the amounts \((1, -1, 1)\) make east − north + up the zero row.</p>
        ${run("leftnull")}
        <p>If \(A\mathbf{x} = \mathbf{b}\) then \(\mathbf{y}^\top\mathbf{b} = \mathbf{y}^\top A\mathbf{x} = 0\): <b>each left-nullspace vector is one test a reachable \(\mathbf{b}\) must pass</b>, here \(b_1 - b_2 + b_3 = 0\). To find it, reduce \([A \mid I]\); the rows of \(E\) at the zero rows of \(R\) are a basis:</p>
        ${run("findE")}
        ${predict("A 5 × 3 matrix has rank 3. How many independent conditions must b satisfy for Ax = b to be solvable?", "<p>One per basis vector of the left nullspace: m − r = 5 − 3 = 2.</p>")}` },
    ],
    takeaways: [
      "Row space C(Aᵀ): nonzero rows of R, dimension r.",
      "Left nullspace N(Aᵀ): rows of E at the zero rows of R, dimension m − r.",
      "Each y in N(Aᵀ) is a test yᵀb = 0.",
    ],
  },
  {
    slug: "2-picture", nav: "Big picture", title: "The Big Picture",
    subtitle: "Dimensions r, n − r, r, m − r",
    abstract: "All four dimensions come from m, n and the rank. The row space and the column space have the same dimension.",
    tags: ["dimension", "rank", "transpose"],
    hero: "subspaces", heroCaption: "Type any matrix; read a basis of each subspace.",
    sections: [
      { id: "dims", title: "Count by rank", html: String.raw`
        <table><tr><th>subspace</th><th>lives in</th><th>dimension</th><th>a basis</th></tr>
        <tr><td>row space</td><td>\(\mathbf{R}^n\)</td><td>\(r\)</td><td>nonzero rows of \(R\)</td></tr>
        <tr><td>nullspace</td><td>\(\mathbf{R}^n\)</td><td>\(n - r\)</td><td>special solutions</td></tr>
        <tr><td>column space</td><td>\(\mathbf{R}^m\)</td><td>\(r\)</td><td>pivot columns of \(A\)</td></tr>
        <tr><td>left nullspace</td><td>\(\mathbf{R}^m\)</td><td>\(m - r\)</td><td>rows of \(E\) at the zero rows of \(R\)</td></tr></table>
        <p>The number of independent rows equals the number of independent columns, because both count the pivots: \(\operatorname{rank}(A^\top) = \operatorname{rank}(A)\).</p>
        ${run("dims")}
` },
    ],
    takeaways: [
      "Rⁿ: row space (r) + nullspace (n − r).",
      "Rᵐ: column space (r) + left nullspace (m − r).",
      "Row rank = column rank.",
    ],
  },
  {
    slug: "3-rankone", nav: "Rank one", title: "Rank One, Spaces of Matrices, Ratings",
    subtitle: "A column times a row",
    abstract: "A rank-one matrix is a column times a row; every rank-r matrix is r of them. Matrices form vector spaces too, and a low-rank ratings table is a few tastes.",
    tags: ["rank one", "A = CR", "matrix spaces", "ML"],
    hero: "tastes", heroCaption: "Choose a customer's two tastes; read their five ratings.",
    sections: [
      { id: "one", title: "Rank-one pieces", html: String.raw`
        ${video(VIDEO_P2)}
        $$\mathbf{u}\,\mathbf{r}_1^\top = \begin{bmatrix} 1 \\ 2 \\ 1 \end{bmatrix}\begin{bmatrix} 1 & 0 & 2 & -1 \end{bmatrix}$$
        ${run("rankone")}
        <p>Put the pivot columns of \(A\) in \(C\) and the nonzero rows of \(R\) in \(R_0\): \(A = CR_0 = \mathbf{u}\,\mathbf{r}_1^\top + \mathbf{v}\,\mathbf{r}_2^\top\).</p>
        ${run("cr")}` },
      { id: "spaces", title: "Spaces of matrices", html: String.raw`
        <p>A \(2 \times 2\) matrix is four numbers: all of them form a space of dimension 4. Symmetric (\(b = c\)) and upper triangular (\(c = 0\)) matrices have dimension 3, diagonal ones 2.</p>
        ${run("matspaces")}
        ${callout("pitfall", "PITFALL · RANK ONE IS NOT A SUBSPACE", run("notsub"))}` },
      { id: "ratings", title: "Ratings as a sum of tastes", html: String.raw`
        <p>Four regulars rate five drinks; each rating is (likes sweet) × (sweetness) + (likes bitter) × (bitterness): \(X = \mathbf{p}\,\mathbf{g}^\top + \mathbf{q}\,\mathbf{h}^\top\).</p>
        ${run("ratings")}
        <p>Caro's tastes are the average of Ana's and Ben's: Ana + Ben − 2 Caro is the zero row (left nullspace).</p>
        ${run("cancel")}
        ${run("scale")}
        ${callout("ml", "ML", "<p>Real ratings are only close to low rank, and many are missing. Finding the tastes is the job of the singular value decomposition (Lectures 26–27).</p>")}` },
    ],
    takeaways: [
      "Rank one = a column times a row: m + n numbers.",
      "A = CR₀: r rank-one pieces.",
      "Rank-one matrices are not a subspace.",
    ],
  },
  {
    slug: "4-practice", nav: "Practice", title: "Check, Practise, Use AI Well",
    subtitle: "Self-check, exercises, and checking a claimed basis",
    abstract: "Four quick questions, the exercises, and three tests for an answer about the four subspaces.",
    tags: ["quiz", "exercises", "working with AI"],
    hero: "toc",
    sections: [
      { id: "quiz", title: "Check your understanding", html: String.raw`${demo("quiz", "Self-check", "four questions")}` },
      { id: "exercises", title: "Exercises", html: String.raw`
        <p>Try each exercise on paper first. <b>Hint</b> gives a nudge; <b>Full solution</b> works it through, with the code that checks every number. Stars mark the level: ★ compute or check, ★★ explain or build, ★★★ extend or combine.</p>` },
      { id: "ai", title: "Working with AI", html: String.raw`
        <p>An answer about the four subspaces passes three tests: the counts \(r, n - r, r, m - r\); multiplying back; and the right number of entries. A typical slip, a left-nullspace vector with four entries:</p>
        ${run("claim")}
        <p>A left-nullspace vector holds one amount per row, so it needs \(m = 3\) entries.</p>` },
    ],
    takeaways: [
      "Count first: r, n − r, r, m − r.",
      "Multiply back: Ax = 0, yᵀA = 0.",
      "Check the number of entries.",
    ],
  },
];
