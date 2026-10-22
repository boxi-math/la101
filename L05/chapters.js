// Chapter content, adapted from notes/L05-transpose-spaces.md. Code and outputs are copied from the note (demos.js).
// Maths is written \( … \) (inline) and $$ … $$ (display) and typeset by the vendored KaTeX (../assets/katex/).
// Section html uses String.raw so LaTeX backslashes need no doubling.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);
const video = (src) => `<div class="card video" data-video="${src}"></div>`;
const VIDEO_P1 = "media/L05-1.mp4";
const VIDEO_P2 = "media/L05-2.mp4";

const LECTURE = {
  number: 5,
  title: "Transposes, Permutations and Rⁿ",
  tagline: "Turn the table, shuffle the rows, stay in the space",
  lead: "A café's sales table turned on its side is the transpose, and it explains where symmetric matrices like XᵀX come from. Shuffling the days is a permutation, undone by its transpose. Then the idea the rest of the course is built on: a subspace, a set of vectors you cannot leave by adding and scaling.",
  heroDemo: "transposeMini",
  heroLabel: "X and Xᵀ",
  heroCaption: "Entry (i, j) of X is entry (j, i) of Xᵀ: days × drinks becomes drinks × days.",
  whyTitle: "Why these three",
  whySub: "Data tables, shuffles and spaces",
  why: [
    ["Data matrices", "Samples × features. \\(X^\\top X\\) (features × features) is symmetric and returns in least squares and PCA."],
    ["Shuffles", "Shuffling rows is \\(PX\\); undo with \\(P^\\top\\). Shuffle the labels with the same \\(P\\)."],
    ["Subspaces", "Closed under adding and scaling, so they contain \\(\\mathbf{0}\\). One counterexample disproves a claim."],
  ],
  ctaTitle: "Ready to turn the table?",
  minutes: "About 60–90 minutes",
  videos: {
    [VIDEO_P1]: "Lecture 5 · Part 1 — Turning the table: transposes, symmetric matrices, permutations",
    [VIDEO_P2]: "Lecture 5 · Part 2 — Spaces you cannot leave: Rⁿ and subspaces",
  },
};

const CHAPTERS = [
  {
    slug: "1-transpose", nav: "Transpose", title: "Turning the Table",
    subtitle: "Rows become columns; products reverse",
    abstract: "Four days of café sales, tea, coffee and juice. The transpose turns days × drinks into drinks × days, writes dot products as xᵀy, and reverses the order of a product.",
    tags: ["Aᵀ", "(AB)ᵀ = BᵀAᵀ", "xᵀy"],
    hero: "code:product", heroCaption: "(XB)ᵀ = BᵀXᵀ, and XᵀBᵀ does not fit",
    sections: [
      { id: "table", title: "The transpose", html: String.raw`
        ${video(VIDEO_P1)}
        $$X = \begin{bmatrix} 12 & 30 & 5 \\ 8 & 25 & 9 \\ 15 & 28 & 4 \\ 10 & 35 & 6 \end{bmatrix}\ \text{(days × drinks)}, \qquad X^\top = \begin{bmatrix} 12 & 8 & 15 & 10 \\ 30 & 25 & 28 & 35 \\ 5 & 9 & 4 & 6 \end{bmatrix}\ \text{(drinks × days)}$$
        <p>One row per sample, one column per feature: the shape of almost every data set. \((A^\top)_{ij} = A_{ji}\).</p>
        ${run("table")}
        ${demo("transpose", "Demo 1 · The transpose", "click an entry; type your own matrix", "Press “show AᵀA” and check that it is symmetric, whatever matrix you type.")}
        ${callout("pitfall", "PITFALL · 1-D ARRAYS", String.raw`<p>A numpy vector of shape <code>(3,)</code> has no transpose: <code>v.T</code> is the same vector. Use shape <code>(3, 1)</code> for a column.</p>` + run("vec"))}
        <p><b>Dot products.</b> \(\mathbf{x}^\top\mathbf{y}\) is \(1 \times 1\); \(\mathbf{x}\mathbf{y}^\top\) is \(n \times n\). With prices \(\mathbf{p} = (2, 3, 4)\) euros, Monday's takings are 134 euros.</p>
        ${run("dot")}` },
      { id: "product", title: "The transpose of a product", html: String.raw`
        <p>With \(B\) = price and cost per drink (3 × 2), \(XB\) is 4 × 2, so \((XB)^\top\) is 2 × 4: only \(B^\top X^\top\) has that shape.</p>
        ${callout("note", "RULE", `<p>\\((AB)^\\top = B^\\top A^\\top\\) and \\((A^{-1})^\\top = (A^\\top)^{-1}\\).</p>`)}
        ${run("product")}
        ${demo("shapes", "Demo 2 · Which order fits?", "move the sizes")}
        ${run("invT")}
        <p><b>What the transpose means:</b> \((A\mathbf{x})\cdot\mathbf{y} = \mathbf{x}\cdot(A^\top\mathbf{y})\).</p>
        ${run("meaning")}` },
    ],
    takeaways: [
      "(Aᵀ)ᵢⱼ = Aⱼᵢ; samples × features becomes features × samples.",
      "(AB)ᵀ = BᵀAᵀ: the shapes force the order.",
      "x·y = xᵀy, and (Ax)·y = x·(Aᵀy).",
    ],
  },
  {
    slug: "2-symmetric", nav: "Symmetric · P", title: "Symmetric Matrices and Permutations",
    subtitle: "XᵀX, and shuffling data with P",
    abstract: "Every RᵀR is symmetric; for a data matrix, XᵀX holds the dot products of the feature columns. A permutation matrix shuffles the rows, and its transpose puts them back.",
    tags: ["Sᵀ = S", "Gram matrix", "P⁻¹ = Pᵀ"],
    hero: "shuffle", heroCaption: "Shuffle, undo, and see what a second shuffle does to the labels",
    sections: [
      { id: "sym", title: "Symmetric matrices", html: String.raw`
        $$(R^\top R)^\top = R^\top (R^\top)^\top = R^\top R$$
        <p>\(X^\top X\) is drink × drink; entry \((i, j)\) is column \(i\) · column \(j\) of \(X\) (a raw, uncentred measure of how drinks sell together).</p>
        ${run("gram")}
        ${callout("note", "ML", `<p>\\(X^\\top X\\) returns in least squares (Lecture 14); after centring, it is the covariance matrix behind PCA (Lecture 27). A matrix of pairwise dot products is a <b>Gram matrix</b>.</p>`)}
        ${predict("\\(A = \\begin{bmatrix} 1 & 2 \\\\ 0 & 1 \\end{bmatrix}\\). Which of \\(A + A^\\top\\), \\(A^\\top A\\), \\(A^2\\) are symmetric?", `<p>The first two, always; \\(A^2\\) need not be.</p>${run("symq")}`)}` },
      { id: "perm", title: "Permutations", html: String.raw`
        <p>A permutation matrix is \(I\) with its rows reordered; \(PX\) shuffles the rows of \(X\). For \(n\) rows there are \(n!\) of them.</p>
        ${run("perm")}
        <p>Each column of \(P\) is a different column of \(I\), so \(P^\top P = I\): <b>\(P^{-1} = P^\top\)</b>.</p>
        ${run("undo")}
        ${demo("shuffle", "Demo 3 · Shuffle and undo", "shuffle, undo, or shuffle the labels separately")}
        ${callout("pitfall", "PITFALL · SHUFFLE LABELS WITH THE SAME P", String.raw`<p>Two different shuffles pair days with the wrong weather.</p>` + run("labels"))}` },
    ],
    takeaways: [
      "Sᵀ = S; every RᵀR (such as XᵀX) is symmetric.",
      "PX reorders rows; P⁻¹ = Pᵀ.",
      "Shuffle samples and labels with the same permutation.",
    ],
  },
  {
    slug: "3-subspaces", nav: "Subspaces", title: "Spaces You Cannot Leave",
    subtitle: "Rⁿ, subspaces, and a closure test",
    abstract: "Adding and scaling never leave Rⁿ. A subspace is a set with the same property, so it contains zero: lines and planes through the origin. Three non-examples, and a random test that can disprove but never prove.",
    tags: ["Rⁿ", "subspace", "closure"],
    hero: "closure", heroCaption: "Pick a set and run random combinations",
    sections: [
      { id: "rn", title: "Rⁿ and subspaces", html: String.raw`
        ${video(VIDEO_P2)}
        <p>Each day of the café is a vector in \(\mathbb{R}^3\); each drink column is a vector in \(\mathbb{R}^4\).</p>
        ${callout("note", "DEFINITION", `<p>A <b>subspace</b> \\(V\\) of \\(\\mathbb{R}^n\\) is closed: \\(\\mathbf{v}, \\mathbf{w} \\in V\\) implies \\(\\mathbf{v} + \\mathbf{w} \\in V\\) and \\(c\\mathbf{v} \\in V\\) for every number \\(c\\). With \\(c = 0\\): every subspace contains \\(\\mathbf{0}\\).</p>`)}
        <p><b>Examples in \(\mathbb{R}^3\):</b> \(\{\mathbf{0}\}\), lines and planes through the origin (such as \(z = x + y\)), and \(\mathbb{R}^3\).</p>
        <p><b>Non-examples in \(\mathbb{R}^2\):</b> the line \(y = x + 1\) (misses the origin); the quarter-plane \(x, y \ge 0\) (left by \(-1\) times a vector); the two axes together (\((1, 0) + (0, 1) = (1, 1)\)).</p>
        ${predict("Is the line \\(y = 2x\\) a subspace? The line \\(y = x + 1\\)?", `<p>Yes; no. Only lines through the origin.</p>`)}` },
      { id: "test", title: "A closure test", html: String.raw`
        <p>Random members, random multipliers: one failure proves "not a subspace"; passing proves nothing.</p>
        ${run("closure")}
        ${demo("closure", "Demo 4 · Closure test", "pick a set")}
        <p><b>Next:</b> all combinations of the columns of \(A\) form a subspace, the <b>column space</b>, where Lecture 6 starts.</p>` },
    ],
    takeaways: [
      "Rⁿ: all vectors with n components.",
      "Subspace: closed under + and scaling, so it contains 0.",
      "One counterexample disproves; the algebra proves.",
    ],
  },
  {
    slug: "4-practice", nav: "Practice", title: "Check, Practise, Use AI Well",
    subtitle: "Self-check, exercises, shapes and closure",
    abstract: "Five quick questions, then two checks for AI answers about transposes and subspaces: run every shape claim, and look for one counterexample.",
    tags: ["quiz", "exercises", "working with AI"],
    hero: "toc",
    sections: [
      { id: "quiz", title: "Check your understanding", html: String.raw`${demo("quiz", "Self-check", "five questions")}` },
      { id: "exercises", title: "Exercises", html: String.raw`
        <p>Try each exercise on paper first. <b>Hint</b> gives a nudge; <b>Full solution</b> works it through, with the code that checks every number. Stars mark the level: ★ compute or check, ★★ explain or build, ★★★ extend or combine.</p>` },
      { id: "ai", title: "Working with AI", html: String.raw`
        <p>Run every shape claim with <code>.shape</code>; test every subspace claim for closure; check that shuffling code uses one permutation for samples and labels. Here an assistant "simplifies" \((XB)^\top\) to \(X^\top B^\top\):</p>
        ${run("claim")}
        <p>The claimed product does not even have a shape; the reversed order does, and it matches.</p>` },
    ],
    takeaways: [
      "Check shapes first: they catch most transpose slips.",
      "One counterexample settles a subspace claim.",
      "Same permutation for samples and labels.",
    ],
  },
];
