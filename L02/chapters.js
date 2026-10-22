// Chapter content, adapted from notes/L02-elimination.md. Code and outputs are copied from the note (demos.js).
// Maths is written \( … \) (inline) and $$ … $$ (display) and typeset by the vendored KaTeX (../assets/katex/).
// Section html uses String.raw so LaTeX backslashes need no doubling.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);
const video = (src) => `<div class="card video" data-video="${src}"></div>`;

const VIDEO_P1 = "media/L02-1.mp4";
const VIDEO_P2 = "media/L02-2.mp4";

const LECTURE = {
  number: 2,
  title: "Elimination",
  tagline: "One unknown at a time",
  lead: "Three base paints, one target colour, three equations. Remove one unknown at a time until a staircase is left, solve it from the bottom up, and write every step as a matrix you can check with one multiplication.",
  heroDemo: "stepperMini",
  heroLabel: "Elimination on the paint system",
  heroCaption: "Three steps turn [A | b] into a staircase with pivots 2, 1, 1; back substitution gives 1, 1, 2 litres.",
  whyTitle: "Why elimination",
  whySub: "The method every linear solver runs inside",
  why: [
    ["A staircase", "Subtract multiples of a <b>pivot row</b> until each equation has one unknown fewer. Then solve from the bottom up."],
    ["Steps are matrices", "Each step is the identity with one extra entry, \\(E_{ij}\\). All steps together: \\(EA = U\\)."],
    ["Where it breaks", "A zero pivot needs a <b>row exchange</b>. When no row can help, the matrix is <b>singular</b>."],
  ],
  ctaTitle: "Ready to mix some paint?",
  minutes: "About 60–90 minutes",
  videos: {
    [VIDEO_P1]: "Lecture 2 · Part 1 — Elimination and back substitution",
    [VIDEO_P2]: "Lecture 2 · Part 2 — Each step is a matrix; row exchanges; singular matrices",
  },
};

const CHAPTERS = [
  {
    slug: "1-elimination", nav: "Elimination", title: "Elimination and Back Substitution",
    subtitle: "Remove one unknown at a time, then work backwards",
    abstract: "A paint shop's three base paints and a customer's colour give three equations. Three subtractions turn them into a staircase that is solved from the bottom up.",
    tags: ["pivot", "multiplier", "back substitution"],
    hero: "code:eliminate", heroCaption: "Elimination with exact fractions",
    sections: [
      { id: "paint", title: "Mixing paint to a target", html: String.raw`
        ${video(VIDEO_P1)}
        <p>A paint shop sells three base paints, <em>Meadow</em>, <em>Harbour</em> and <em>Brick</em>. Each litre carries a fixed amount of three pigments (grams per litre):</p>
        <table class="tbl"><tr><th></th><th>Meadow</th><th>Harbour</th><th>Brick</th></tr><tr><td>yellow</td><td>2</td><td>1</td><td>1</td></tr><tr><td>blue</td><td>4</td><td>3</td><td>4</td></tr><tr><td>red</td><td>2</td><td>4</td><td>8</td></tr></table>
        <p>A customer's colour needs exactly 5 g of yellow, 15 g of blue and 22 g of red. With \(x, y, z\) litres of Meadow, Harbour and Brick, counting each pigment gives one equation:</p>
        $$\begin{aligned} 2x + y + z &= 5 \qquad \text{(yellow)}\\ 4x + 3y + 4z &= 15 \qquad \text{(blue)}\\ 2x + 4y + 8z &= 22 \qquad \text{(red)} \end{aligned}$$
        <p>The matrix \(A\) is the table itself: row \(i\) is a pigment, column \(j\) is a paint. The columns are the three paints, and we want amounts of them that add up to \(\mathbf{b} = (5, 15, 22)\).</p>
        ${run("setup")}
        ${predict("Guessing three unknowns at once is hard. Which unknown would you try to get rid of first, and using which equation?",
          `<p>Use the first equation to remove \\(x\\) from the other two; then use the new second equation to remove \\(y\\) from the third. The next section does exactly that.</p>`)}` },
      { id: "steps", title: "Elimination, one unknown at a time", html: String.raw`
        <p><b>Step 1.</b> The coefficient 2 of \(x\) in the first equation is the first <b>pivot</b>. The blue equation has \(4x\); the <b>multiplier</b> is \(\ell_{21} = 4/2 = 2\) (entry to remove ÷ pivot). Subtract 2 times the yellow equation, <em>right-hand side included</em>: \(y + 2z = 5\). (Always subtract multiplier × pivot row; a negative multiplier adds.)</p>
        <p><b>Step 2.</b> \(\ell_{31} = 2/2 = 1\): the red equation becomes \(3y + 7z = 17\).</p>
        <p><b>Step 3.</b> The second pivot is the 1 in front of \(y\). \(\ell_{32} = 3/1 = 3\): \((3y + 7z) - 3(y + 2z) = 17 - 15\), so \(z = 2\).</p>
        $$\begin{aligned} 2x + y + z &= 5\\ y + 2z &= 5\\ z &= 2 \end{aligned}$$
        <p>The system is <b>upper triangular</b>, with pivots 2, 1, 1. In code, each row of the <b>augmented matrix</b> \([A \mid \mathbf{b}]\) holds one equation; <code>row 3 -= 1 * row 1</code> means "replace row 3 by row 3 − 1 × row 1":</p>
        ${run("eliminate")}
        ${demo("stepper", "Demo 1 · Elimination, one step per click", "press Next step", "Try the other two presets: one needs a row exchange, the other has no second pivot. Then type a system of your own.")}
        ${callout("pitfall", "PITFALL · CHANGE THE RIGHT-HAND SIDE TOO", `<p>The step "blue − 2 × yellow" is a step on whole <em>equations</em>. If you subtract on the left only, you are solving a different problem. In the augmented matrix the right-hand side is just one more column that every step changes.</p>`)}` },
      { id: "back", title: "Back substitution", html: String.raw`
        <p>The staircase is solved from the bottom up: \(z = 2\); then \(y + 4 = 5\), so \(y = 1\); then \(2x + 1 + 2 = 5\), so \(x = 1\).</p>
        ${run("backsub")}
        <p>One litre of Meadow, one of Harbour and two of Brick give exactly the target colour. Each back-substitution step divides by a pivot, which is why the pivots must not be zero.</p>
        ${predict("Solve \\(3x + y = 7\\), \\(6x + 5y = 23\\) by one elimination step and back substitution. What is the pivot, and the multiplier?",
          `<p>Pivot 3, multiplier \\(6/3 = 2\\). Subtracting twice the first equation: \\(3y = 9\\), so \\(y = 3\\); then \\(x = 4/3\\).</p>${run("check2")}`)}` },
    ],
    takeaways: [
      "Multiplier = entry to remove ÷ pivot; subtract that multiple of the whole pivot row, right side included.",
      "The result is upper triangular: a staircase.",
      "Back substitution solves it from the bottom up.",
    ],
  },
  {
    slug: "2-matrices", nav: "Step matrices", title: "Each Step Is a Matrix",
    subtitle: "Elimination matrices act on the rows from the left",
    abstract: "Row 2 − 2 × row 1 is the identity with −2 in row 2, column 1. Three such matrices multiply to one matrix E with EA = U.",
    tags: ["elimination matrix", "identity", "EA = U"],
    hero: "ematrix", heroCaption: "Choose a row, a column and a multiplier; see which entry becomes zero.",
    sections: [
      { id: "e21", title: "The matrix of one step", html: String.raw`
        ${video(VIDEO_P2)}
        <p>Step 1 replaced row 2 by row 2 − 2 × row 1 and left the other rows alone. Take the identity matrix \(I\) and put \(-2\) in row 2, column 1:</p>
        $$E_{21} = \begin{bmatrix} 1 & 0 & 0\\ -2 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix}.$$
        <p>\(E_{21}A\) works <b>by rows</b>: row \(i\) of \(E_{21}A\) is a combination of the rows of \(A\), with the amounts in row \(i\) of \(E_{21}\). (The entry in row \(i\), column \(k\) is row \(i\) of \(E_{21}\) times column \(k\) of \(A\).) Lecture 1 read \(A\mathbf{x}\) as a combination of columns; a matrix on the <em>left</em> of \(A\) combines the <em>rows</em> of \(A\).</p>
        ${run("steps")}
        ${demo("ematrix", "Demo 2 · An elimination matrix", "move the sliders", "Find the three multipliers of the paint system: each one makes one entry below the diagonal zero.")}` },
      { id: "combine", title: "All steps in one matrix", html: String.raw`
        <p>The three steps combine into one matrix \(E = E_{32}E_{31}E_{21}\) with \(EA = U\), and the same \(E\) turns \(\mathbf{b}\) into the new right-hand side \(\mathbf{c} = E\mathbf{b} = (5, 5, 2)\):</p>
        ${run("combine")}
        <p>The bottom row of \(E\) is \((5, -3, 1)\): a 5 appears although the multipliers were 2, 1 and 3. The single matrix \(E\) mixes the steps together; Lecture 4 shows that running the steps backwards keeps the multipliers clean.</p>
        ${callout("pitfall", "PITFALL · ORDER MATTERS", String.raw`<p>\(E_{21}A\) changes the <em>rows</em> of \(A\); \(AE_{21}\) changes the <em>columns</em>, which is not an elimination step. In \(E_{32}E_{31}E_{21}A\), \(E_{21}\) acts first.</p>` + run("order"))}
        ${callout("pattern", "PATTERN · BUILD AND CHECK A STEP", `<p>For "row \\(i\\) − \\(\\ell\\) × row \\(j\\)": start from \\(I\\) and put \\(-\\ell\\) in row \\(i\\), column \\(j\\). To check it, multiply: <code>E @ A</code> must change row \\(i\\) only, and its entry in column \\(j\\) must become zero.</p>`)}` },
    ],
    takeaways: [
      "A step is the identity with −ℓ in position (i, j), multiplied on the left.",
      "The steps combine: EA = U and Eb = c.",
      "E on the left combines rows; on the right it would combine columns.",
    ],
  },
  {
    slug: "3-breakdown", nav: "Breakdowns", title: "When Elimination Breaks",
    subtitle: "A zero pivot: exchange rows, or the matrix is singular",
    abstract: "Elimination divides by every pivot. A zero is repaired by a row exchange when a row below can help; otherwise the matrix has a missing pivot and is singular.",
    tags: ["row exchange", "permutation matrix", "singular"],
    hero: "stepperB", heroCaption: "B needs one row exchange.",
    sections: [
      { id: "exchange", title: "A zero that a row exchange repairs", html: String.raw`
        $$B = \begin{bmatrix} 1 & 2 & 1\\ 2 & 4 & 5 \\ 3 & 7 & 2 \end{bmatrix}$$
        <p>After removing column 1 from rows 2 and 3, row 2 is \((0, 0, 3)\): the second pivot position holds 0. Row 3 is \((0, 1, -1)\), so exchange rows 2 and 3. The exchange is the <b>permutation matrix</b> \(P_{23}\), the identity with rows 2 and 3 swapped. The pivots are \(1, 1, 3\).</p>
        ${run("exchange")}` },
      { id: "singular", title: "A zero that nothing repairs", html: String.raw`
        $$C = \begin{bmatrix} 1 & 2 & 1\\ 2 & 4 & 5 \\ 3 & 6 & 4 \end{bmatrix}$$
        <p>After the first step both rows below have 0 in column 2, so no exchange gives a second pivot. Column 2 of \(C\) is twice column 1: one base paint is a double-strength copy of another, and no recipe can tell them apart. \(C\) is <b>singular</b>: fewer than three pivots, and \(C\mathbf{x} = \mathbf{b}\) has no solution or infinitely many. (numpy's rank counts the pivots; Lecture 7 defines it.)</p>
        ${run("singular")}
        ${predict("A 3-by-3 matrix has \\(a_{11} = 0\\). Is it singular?",
          `<p>Not necessarily: if some row below has a nonzero first entry, exchange it to the top.</p>${run("firstzero")}`)}
        ${callout("note", "DEFINITION", `<p>A square matrix is <b>nonsingular</b> (invertible, Lecture 3) when elimination, with row exchanges allowed, produces a full set of nonzero pivots. Then \\(A\\mathbf{x} = \\mathbf{b}\\) has exactly one solution for every \\(\\mathbf{b}\\). Otherwise it is <b>singular</b>.</p>`)}` },
      { id: "machine", title: "Elimination inside the machine", html: String.raw`
        <p><code>np.linalg.solve</code> calls LAPACK's <code>gesv</code>, which is elimination with row exchanges recorded as \(A = PLU\) (Lecture 4):</p>
        ${run("solve")}
        ${callout("note", "ML", `<p>Many learning methods end with "now solve a linear system"; least-squares line fitting (Lecture 14) is one. When a library reports a singular matrix, it means a column with no pivot, usually two features that carry the same information.</p>`)}` },
    ],
    takeaways: [
      "A zero pivot with a nonzero entry below: exchange rows (a permutation matrix).",
      "No nonzero entry below: no pivot in that column, the matrix is singular.",
      "Library solvers run elimination with row exchanges.",
    ],
  },
  {
    slug: "4-practice", nav: "Practice", title: "Check, Practise, Use AI Well",
    subtitle: "Self-check, exercises, and checking an assistant's steps",
    abstract: "Five quick questions, then the habit that makes AI help safe for elimination: build the matrix of each claimed step and multiply.",
    tags: ["quiz", "exercises", "working with AI"],
    hero: "toc",
    sections: [
      { id: "quiz", title: "Check your understanding", html: String.raw`${demo("quiz", "Self-check", "five questions")}` },
      { id: "exercises", title: "Exercises", html: String.raw`
        <p>Try each exercise on paper first. <b>Hint</b> gives a nudge; <b>Full solution</b> works it through, with the code that checks every number. Stars mark the level: ★ compute or check, ★★ explain or build, ★★★ extend or combine.</p>` },
      { id: "ai", title: "Working with AI", html: String.raw`
        <p>An assistant can run elimination and show every step. Its steps are easy to check, because <b>each step is a matrix</b>. Here is the check on a made-up slip: it writes "row 2 + 2 × row 1" but shows the row it meant:</p>
        ${run("claimed")}
        <p>The matrix it named gives \((8, 5, 6)\) in row 2, not a zero; the shown row belongs to \(E_{21}\) with \(-2\). One multiplication finds the mismatch.</p>` },
    ],
    takeaways: [
      "Elimination: pivots, multipliers, a staircase, back substitution.",
      "Every step is a matrix; check it with E @ A.",
      "A zero pivot: exchange rows, or the matrix is singular.",
    ],
  },
];
