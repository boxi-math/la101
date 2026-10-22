// Chapter content, adapted from notes/L03-multiply-invert.md. Code and outputs are copied from the note (demos.js).
// Maths is written \( … \) (inline) and $$ … $$ (display) and typeset by the vendored KaTeX (../assets/katex/).
// Section html uses String.raw so LaTeX backslashes need no doubling.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);
const video = (src) => `<div class="card video" data-video="${src}"></div>`;
const VIDEO_P1 = "media/L03-1.mp4";
const VIDEO_P2 = "media/L03-2.mp4";

const LECTURE = {
  number: 3,
  title: "Multiplying and Inverting Matrices",
  tagline: "Four ways to multiply, one way back",
  lead: "One product read four ways: entries, columns, rows, and a sum of column × row pieces. Two linear layers collapse into one. Then the reverse question: when can a matrix be undone, and how do we find the matrix that undoes it?",
  heroDemo: "fourWaysMini",
  heroLabel: "AB four ways",
  heroCaption: "Entries, columns, rows, and column × row pieces all give AB = [[2, 7], [8, −2]].",
  whyTitle: "Why four views",
  whySub: "Each view answers a different question about the same product",
  why: [
    ["Columns and rows", "Every column of \\(AB\\) is a combination of the columns of \\(A\\); every row a combination of the rows of \\(B\\)."],
    ["Rank-one pieces", "\\(AB\\) is a sum of column × row matrices: the start of low-rank approximation and the SVD."],
    ["Undoing", "\\(A^{-1}\\) undoes \\(A\\). Gauss–Jordan finds it; a matrix that sends a nonzero vector to zero has none."],
  ],
  ctaTitle: "Ready to multiply?",
  minutes: "About 60–90 minutes",
  videos: {
    [VIDEO_P1]: "Lecture 3 · Part 1 — Four ways to multiply; two layers make one",
    [VIDEO_P2]: "Lecture 3 · Part 2 — The inverse, Gauss–Jordan, and matrices with no inverse",
  },
};

const CHAPTERS = [
  {
    slug: "1-multiply", nav: "Multiply", title: "Four Ways to Multiply",
    subtitle: "Entries, columns, rows, and column × row pieces",
    abstract: "A 2-by-3 matrix times a 3-by-2 matrix, computed four times. The same answer each time, but each view shows something different.",
    tags: ["shapes", "outer product", "rank one"],
    hero: "code:pieces", heroCaption: "AB as a sum of three column × row pieces",
    sections: [
      { id: "shapes", title: "When does AB exist?", html: String.raw`
        ${video(VIDEO_P1)}
        $$A = \begin{bmatrix} 1 & 2 & 0 \\ 3 & -1 & 2 \end{bmatrix}, \qquad B = \begin{bmatrix} 2 & 1 \\ 0 & 3 \\ 1 & -1 \end{bmatrix}$$
        <p>\(AB\) exists when <b>the number of columns of \(A\) equals the number of rows of \(B\)</b>. The result has the rows of \(A\) and the columns of \(B\): \((2 \times 3)(3 \times 2) = 2 \times 2\). \(BA\) is \(3 \times 3\): a different shape, so a different matrix.</p>
        ${run("shapes")}
        ${predict("What is the entry in row 2, column 1 of \\(AB\\)? (It uses only row 2 of \\(A\\) and column 1 of \\(B\\).)", `<p>\\(3 \\cdot 2 + (-1) \\cdot 0 + 2 \\cdot 1 = 8\\).</p>`)}` },
      { id: "four", title: "Four ways", html: String.raw`
        <p><b>1. Entries.</b> Entry \((i, j)\) of \(AB\) is row \(i\) of \(A\) · column \(j\) of \(B\).</p>
        ${run("entries")}
        <p><b>2. Columns.</b> Column \(j\) of \(AB\) is \(A\) times column \(j\) of \(B\): every column of \(AB\) is a combination of the columns of \(A\).</p>
        ${run("columns")}
        <p><b>3. Rows.</b> Row \(i\) of \(AB\) is row \(i\) of \(A\) times \(B\), a combination of the rows of \(B\) with the amounts in row \(i\) of \(A\). (That is how elimination matrices act.)</p>
        ${run("rows")}
        <p><b>4. Column × row.</b> Column \(k\) of \(A\) times row \(k\) of \(B\) is a whole matrix (an <b>outer product</b>). The three pieces add up to \(AB\). Each piece has all its columns multiples of one column: it is <b>rank one</b>.</p>
        ${run("pieces")}
        ${demo("fourWays", "Demo 1 · Four ways to multiply", "pick a view; type your own A and B", "Make the shapes not fit (for example a 2×3 times a 2×2) and read the message. Then try a B whose rows are all multiples of one row: what happens to the pieces?")}
        ${callout("pitfall", "PITFALL · COLUMN × ROW IS A MATRIX", String.raw`<p>A column times a row is a matrix; a row times a column is a number. Same numbers, opposite order, different shapes.</p>` + run("colrow"))}
        <p><b>Order matters</b>, even for square matrices; the grouping does not: \((AB)C = A(BC)\).</p>
        ${run("order")}` },
      { id: "layers", title: "Two layers make one", html: String.raw`
        <p>A network with two linear layers computes \(W_2(W_1\mathbf{x}) = (W_2W_1)\mathbf{x}\): <b>two linear layers in a row are one linear layer</b>. The first layer sits on the right.</p>
        ${run("layers")}
        ${callout("note", "ML", `<p>This is why networks put a nonlinear activation (such as ReLU) between layers: without it, depth adds nothing.</p>`)}` },
    ],
    takeaways: [
      "(m × n)(n × p) = m × p; AB ≠ BA in general, but (AB)C = A(BC).",
      "Entries, columns, rows, and a sum of rank-one column × row pieces.",
      "Two linear layers are one layer W₂W₁.",
    ],
  },
  {
    slug: "2-inverse", nav: "Inverse", title: "Undoing a Matrix",
    subtitle: "The inverse, by formula and by Gauss–Jordan",
    abstract: "A photo filter mixes two colour channels; its inverse mixes them back. For bigger matrices, eliminate [A | I] until the left half is I.",
    tags: ["inverse", "Gauss–Jordan", "(AB)⁻¹"],
    hero: "inverse2", heroCaption: "Move the entries; when ad − bc = 0 the inverse disappears.",
    sections: [
      { id: "filter", title: "The inverse of a filter", html: String.raw`
        ${video(VIDEO_P2)}
        <p>A filter sends a pixel \((w, c)\) (warm, cool) to \((3w + c,\ 2w + c)\): the matrix \(F = \begin{bmatrix} 3 & 1 \\ 2 & 1 \end{bmatrix}\). Its inverse undoes it. For 2-by-2: swap \(a\) and \(d\), change the signs of \(b\) and \(c\), divide by \(ad - bc\).</p>
        $$\begin{bmatrix} a & b \\ c & d \end{bmatrix}^{-1} = \frac{1}{ad - bc}\begin{bmatrix} d & -b \\ -c & a \end{bmatrix}, \qquad F^{-1} = \begin{bmatrix} 1 & -1 \\ -2 & 3 \end{bmatrix}.$$
        ${run("filter")}
        ${demo("inverse2", "Demo 2 · The 2-by-2 inverse", "move a, b, c, d")}
        ${callout("note", "DEFINITION", `<p>\\(A\\) (square) is <b>invertible</b> when there is \\(A^{-1}\\) with \\(A^{-1}A = AA^{-1} = I\\). Then \\(A\\mathbf{x} = \\mathbf{b}\\) has exactly one solution, \\(\\mathbf{x} = A^{-1}\\mathbf{b}\\).</p>`)}` },
      { id: "gj", title: "Gauss–Jordan", html: String.raw`
        <p>Column \(j\) of \(A^{-1}\) solves \(A\mathbf{x} = \mathbf{e}_j\). Solve all of them at once: write \([A \mid I]\) and, column by column, clear the entries below <em>and above</em> each pivot; then divide each row by its pivot. When the left half is \(I\), the right half is \(A^{-1}\).</p>
        $$K = \begin{bmatrix} 1 & 2 & 0 \\ 0 & 1 & 1 \\ 1 & 2 & 1 \end{bmatrix}$$
        ${run("gj")}
        ${run("gjcheck")}
        ${demo("gaussJordan", "Demo 3 · Gauss–Jordan", "press Next step; type your own matrix", "Try 1 1; 1 1 (no inverse) and 0 1; 1 1 (needs an exchange).")}
        <p>Why it works: all the steps together are one matrix \(E\) with \(EK = I\), so \(E = K^{-1}\), and the right half became \(EI = E\).</p>` },
      { id: "reverse", title: "Undoing two steps", html: String.raw`
        <p>Filter \(B\) first, then \(A\): the pixel becomes \(AB\mathbf{p}\). Undo the <b>last</b> step first: \((AB)^{-1} = B^{-1}A^{-1}\).</p>
        ${run("reverse")}` },
    ],
    takeaways: [
      "A⁻¹A = AA⁻¹ = I; for 2-by-2, swap, negate, divide by ad − bc.",
      "Gauss–Jordan: [A | I] → [I | A⁻¹].",
      "(AB)⁻¹ = B⁻¹A⁻¹.",
    ],
  },
  {
    slug: "3-noinverse", nav: "No inverse", title: "When There Is No Inverse",
    subtitle: "A nonzero vector sent to zero cannot be recovered",
    abstract: "A sum filter sends two different pixels to the same colour, so nothing can undo it. The general test: Ax = 0 for some nonzero x.",
    tags: ["singular", "Ax = 0", "ad − bc = 0"],
    hero: "code:sumfilter", heroCaption: "The sum filter S",
    sections: [
      { id: "sum", title: "The sum filter", html: String.raw`
        <p>\(S = \begin{bmatrix} 1 & 1 \\ 1 & 1 \end{bmatrix}\) sends \((3, 1)\) and \((2, 2)\) both to \((4, 4)\), and their difference \((1, -1)\) to zero. No matrix can undo \(S\).</p>
        ${run("sumfilter")}
        <p><b>If \(A\mathbf{x} = \mathbf{0}\) for some nonzero \(\mathbf{x}\), \(A\) has no inverse</b>: \(\mathbf{x} = A^{-1}A\mathbf{x} = A^{-1}\mathbf{0} = \mathbf{0}\) would be a contradiction. For 2-by-2 this is exactly \(ad - bc = 0\); in general, fewer than \(n\) pivots.</p>
        ${predict("\\(T = \\begin{bmatrix} 2 & 6 \\\\ 1 & 3 \\end{bmatrix}\\). Find a nonzero \\(\\mathbf{x}\\) with \\(T\\mathbf{x} = \\mathbf{0}\\).", `<p>Column 2 is 3 × column 1, so \\(\\mathbf{x} = (3, -1)\\). \\(T\\) has no inverse.</p>${run("tnull")}`)}` },
    ],
    takeaways: [
      "A matrix that sends a nonzero vector to zero has no inverse.",
      "2-by-2: no inverse exactly when ad − bc = 0.",
      "numpy raises LinAlgError for a singular matrix.",
    ],
  },
  {
    slug: "4-practice", nav: "Practice", title: "Check, Practise, Use AI Well",
    subtitle: "Self-check, exercises, and checking an assistant's reason",
    abstract: "Five quick questions, then the habit for AI help with products and inverses: check every view against A @ B, and check the reason, not just the answer.",
    tags: ["quiz", "exercises", "working with AI"],
    hero: "toc",
    sections: [
      { id: "quiz", title: "Check your understanding", html: String.raw`${demo("quiz", "Self-check", "five questions")}` },
      { id: "exercises", title: "Exercises", html: String.raw`
        <p>Try each exercise on paper first. <b>Hint</b> gives a nudge; <b>Full solution</b> works it through, with the code that checks every number. Stars mark the level: ★ compute or check, ★★ explain or build, ★★★ extend or combine.</p>` },
      { id: "ai", title: "Working with AI", html: String.raw`
        <p>Ask for all four views on numbers of your own and check each against <code>A @ B</code>. For a claimed non-invertible matrix, find the nonzero \(\mathbf{x}\) it sends to zero. Here an assistant gives a wrong reason ("no row is a multiple of another") for a right claim:</p>
        ${run("claim")}
        <p>Row 3 is row 1 + row 2, and \((5, -4, 1)\) is sent to zero. A right answer with a wrong reason fails on the next matrix.</p>` },
    ],
    takeaways: [
      "Four views of AB; check them all with A @ B.",
      "Inverse: formula, Gauss–Jordan, and the multiply-back check.",
      "No inverse when a nonzero x has Ax = 0.",
    ],
  },
];
