// Chapter content, adapted from notes/L04-lu.md. Code and outputs are copied from the note (demos.js).
// Maths is written \( … \) (inline) and $$ … $$ (display) and typeset by the vendored KaTeX (../assets/katex/).
// Section html uses String.raw so LaTeX backslashes need no doubling.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);
const video = (src) => `<div class="card video" data-video="${src}"></div>`;
const VIDEO_P1 = "media/L04-1.mp4";
const VIDEO_P2 = "media/L04-2.mp4";

const LECTURE = {
  number: 4,
  title: "A = LU",
  tagline: "Elimination, written down once",
  lead: "Run elimination backwards and the multipliers fall into a lower-triangular matrix L, with nothing to compute. A = LU turns every new right-hand side into two cheap triangular solves, which is why computers factor once and solve many times.",
  heroDemo: "luMini",
  heroLabel: "Building L",
  heroCaption: "Each elimination step drops its multiplier into L: the paint matrix becomes L = [[1, 0, 0], [2, 1, 0], [1, 3, 1]] times U.",
  whyTitle: "Why factor",
  whySub: "One factorization, many solves",
  why: [
    ["Free bookkeeping", "\\(L\\) holds the multipliers exactly as they were used; \\(U\\) is the staircase. Multiply back to check."],
    ["Cheap solves", "Factoring costs about \\(n^3/3\\) steps, each new \\(\\mathbf{b}\\) about \\(n^2\\): for 100 products and 1,000 orders, 33 times less work."],
    ["Structure pays", "A tridiagonal matrix keeps its band in \\(L\\) and \\(U\\): about \\(n\\) steps, not \\(n^3/3\\). A zero pivot needs \\(PA = LU\\)."],
  ],
  ctaTitle: "Ready to factor?",
  minutes: "About 60–90 minutes",
  videos: {
    [VIDEO_P1]: "Lecture 4 · Part 1 — Elimination becomes A = LU; forward and back solves",
    [VIDEO_P2]: "Lecture 4 · Part 2 — Factor once, solve many; banded matrices; PA = LU",
  },
};

const CHAPTERS = [
  {
    slug: "1-lu", nav: "A = LU", title: "Elimination Becomes A = LU",
    subtitle: "Undo the steps, and the multipliers fall into place",
    abstract: "The inverse of an elimination step changes the sign of its multiplier. Undo all the steps of the paint system, last first, and you get L, holding the multipliers 2, 1, 3 exactly where they were used.",
    tags: ["E⁻¹", "lower triangular", "LDU"],
    hero: "code:lu", heroCaption: "Elimination that records L as it goes",
    sections: [
      { id: "undo", title: "Undo one step, then all", html: String.raw`
        ${video(VIDEO_P1)}
        $$A = \begin{bmatrix} 2 & 1 & 1\\ 4 & 3 & 4 \\ 2 & 4 & 8 \end{bmatrix}, \qquad \ell_{21} = 2,\ \ell_{31} = 1,\ \ell_{32} = 3, \qquad U = \begin{bmatrix} 2 & 1 & 1\\ 0 & 1 & 2 \\ 0 & 0 & 1 \end{bmatrix}$$
        <p>\(E_{21}\) subtracts 2 × row 1 from row 2; its inverse adds it back, so \(E_{21}^{-1}\) is \(E_{21}\) with \(+2\) instead of \(-2\).</p>
        ${run("undo")}
        <p>From \(E_{32}E_{31}E_{21}A = U\): \(A = E_{21}^{-1}E_{31}^{-1}E_{32}^{-1}U = LU\). In this order the multipliers do not mix.</p>
        ${run("elim")}
        <p>\(E\) has the 5 that puzzled us in Lecture 2; \(L\) has exactly 2, 1, 3. <b>\(L\) needs no computing</b>: write down the multipliers as you eliminate.</p>
        ${callout("note", "DEFINITION", `<p>\\(A = LU\\): \\(L\\) is <b>lower triangular</b> with ones on its diagonal and the multiplier \\(\\ell_{ij}\\) in position \\((i, j)\\); \\(U\\) is the <b>upper-triangular</b> result of elimination, with the pivots on its diagonal.</p>`)}
        ${run("lu")}
        ${demo("lu", "Demo 1 · Build L while you eliminate", "press Next step; type your own matrix", "Try 1 2 1; 2 4 5; 3 7 2 (a zero pivot) and 1 1; 1 1 (no inverse at all).")}
        ${callout("pitfall", "PITFALL · L GETS +ℓ, E GETS −ℓ", String.raw`<p>Putting the minus signs of \(E\) into \(L\) breaks \(LU = A\). Multiply back to check.</p>` + run("pitfall"))}
        <p><b>Pivots apart.</b> Divide each row of \(U\) by its pivot and keep the pivots in \(D\): \(A = LDU\), with ones on the diagonals of both triangular factors.</p>
        ${run("ldu")}` },
      { id: "solve", title: "Solving with L and U", html: String.raw`
        <p>\(A\mathbf{x} = \mathbf{b}\) is \(L(U\mathbf{x}) = \mathbf{b}\). Solve \(L\mathbf{c} = \mathbf{b}\) from the top down (<b>forward</b>), then \(U\mathbf{x} = \mathbf{c}\) from the bottom up (<b>back</b>). For \(\mathbf{b} = (5, 15, 22)\), \(\mathbf{c} = (5, 5, 2)\): the right side elimination produced in Lecture 2.</p>
        ${run("solve")}
        ${demo("solveLU", "Demo 2 · Forward, then back", "move the order b")}
        ${predict("A second customer orders \\(\\mathbf{b} = (4, 11, 14)\\). Which parts of the work can you reuse?", `<p>All of \\(L\\) and \\(U\\); redo only the two triangular solves. \\(\\mathbf{x} = (1, 1, 1)\\).</p>${run("reuse")}`)}` },
    ],
    takeaways: [
      "E₂₁⁻¹ is E₂₁ with the sign of the multiplier changed.",
      "A = LU: L holds the multipliers, U the staircase; A = LDU splits off the pivots.",
      "Ax = b: forward Lc = b, then back Ux = c.",
    ],
  },
  {
    slug: "2-cost", nav: "Cost", title: "Factor Once, Solve Many",
    subtitle: "About n³/3 to factor, about n² per right-hand side",
    abstract: "A factory with 100 products gets 1,000 orders a day. Counting multiply-subtract steps shows why libraries split \"factor\" from \"solve\", and why you should not invert a matrix just to solve systems.",
    tags: ["operation count", "n³/3", "never invert"],
    hero: "cost", heroCaption: "Move n and the number of orders",
    sections: [
      { id: "count", title: "Counting the steps", html: String.raw`
        ${video(VIDEO_P2)}
        $$(n-1)^2 + (n-2)^2 + \dots + 1^2 = \frac{(n-1)n(2n-1)}{6} \approx \frac{n^3}{3}$$
        <p>Pivot \(k\) has \(n - k\) rows below it and \(n - k\) entries to update in each. The two triangular solves take about \(n^2\) steps together. Our <code>lu</code> counts its own steps:</p>
        ${run("count")}
        ${run("factory")}
        ${demo("cost", "Demo 3 · What factoring once saves", "move n and the number of orders")}
        ${callout("pattern", "PATTERN · MANY RIGHT-HAND SIDES", `<p>Factor \\(A = LU\\) once, then one forward and one back solve per \\(\\mathbf{b}\\). <code>np.linalg.solve(A, B)</code> with one right-hand side per column of <code>B</code> does exactly this. Finding \\(A^{-1}\\) first would cost about \\(n^3\\), three times the factoring.</p>${run("many")}`)}` },
    ],
    takeaways: [
      "Factor ≈ n³/3 steps, each pair of triangular solves ≈ n².",
      "100 products, 1,000 orders: 338 million steps redone vs 10 million factored once.",
      "Never compute A⁻¹ just to solve.",
    ],
  },
  {
    slug: "3-band", nav: "Banded · PA = LU", title: "Banded Matrices and Row Exchanges",
    subtitle: "Zeros that stay zeros, and pivots that are zero",
    abstract: "Smoothing six sensor readings gives a tridiagonal matrix whose L and U keep the band: work grows like n. Then the matrix B of Lecture 2, invertible but without LU, and the fix PA = LU.",
    tags: ["tridiagonal", "sparse", "PA = LU"],
    hero: "code:band", heroCaption: "L and U of the tridiagonal smoothing matrix",
    sections: [
      { id: "smooth", title: "Smoothing a sensor", html: String.raw`
        <p>Readings \(\mathbf{y} = (4, 7, 3, 8, 5, 9)\). Find \(\mathbf{x}\) close to \(\mathbf{y}\) that changes slowly: minimise</p>
        $$\sum_{i=1}^{6} (x_i - y_i)^2 + \sum_{i=1}^{5} (x_{i+1} - x_i)^2 .$$
        <p>Each \(x_i\) gives one equation \((x_i - y_i) + (x_i - x_{i-1}) + (x_i - x_{i+1}) = 0\) (only existing neighbours): inside, \(3x_i - x_{i-1} - x_{i+1} = y_i\). The matrix is <b>tridiagonal</b>.</p>
        ${run("smooth")}
        ${run("band")}
        <p><b>The zeros stay zeros.</b> \(L\) has one nonzero below each diagonal entry, \(U\) one to the right of each pivot: a few \(n\) steps instead of \(n^3/3\). LAPACK's <code>dgtsv</code> does exactly this.</p>
        ${run("visits")}
        ${callout("note", "ML", `<p>Banded and sparse matrices appear wherever data has an order or a graph: time series, images, networks of links (Lecture 11).</p>`)}` },
      { id: "plu", title: "PA = LU", html: String.raw`
        <p>Lecture 2's \(B\) meets a zero in the second pivot position. It is invertible, but plain \(LU\) fails:</p>
        ${run("zero")}
        <p>Do the exchanges first: \(P\) exchanges rows 2 and 3, and \(PB = LU\).</p>
        ${run("plu")}
        <p><b>Every invertible matrix has \(PA = LU\)</b>: that is what <code>np.linalg.solve</code> computes inside (LAPACK <code>dgesv</code>). Real solvers also exchange rows for small pivots, to keep rounding errors down (Lecture 29).</p>` },
    ],
    takeaways: [
      "Tridiagonal stays tridiagonal: L and U are bidiagonal; work ≈ n.",
      "A zero pivot stops plain LU even for an invertible matrix.",
      "PA = LU always exists for invertible A; library solvers compute it.",
    ],
  },
  {
    slug: "4-practice", nav: "Practice", title: "Check, Practise, Use AI Well",
    subtitle: "Self-check, exercises, and multiplying back",
    abstract: "Five quick questions, then the one check that settles any claimed factorization: L lower triangular, U upper triangular, and L @ U equal to A exactly.",
    tags: ["quiz", "exercises", "working with AI"],
    hero: "toc",
    sections: [
      { id: "quiz", title: "Check your understanding", html: String.raw`${demo("quiz", "Self-check", "five questions")}` },
      { id: "exercises", title: "Exercises", html: String.raw`
        <p>Try each exercise on paper first. <b>Hint</b> gives a nudge; <b>Full solution</b> works it through, with the code that checks every number. Stars mark the level: ★ compute or check, ★★ explain or build, ★★★ extend or combine.</p>` },
      { id: "ai", title: "Working with AI", html: String.raw`
        <p>Ask for a factorization, and for a matrix where LU without pivoting fails; check by multiplying \(L\) by \(U\) and finding the zero pivot yourself. Here an assistant's \(L\) is right but its "\(U\)" is the matrix after only two steps:</p>
        ${run("claim")}
        <p>The claimed \(U\) has a 3 below the diagonal, and \(LU\) differs from \(A\) in the last row. Two checks, one line each.</p>` },
    ],
    takeaways: [
      "Check L (lower, ones on the diagonal), U (upper) and L @ U = A.",
      "For a claimed failure, find the zero pivot and the P that fixes it.",
      "Factor once; never invert just to solve.",
    ],
  },
];
