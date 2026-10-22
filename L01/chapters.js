// Chapter content, adapted from notes/L01-three-pictures.md. Code and outputs are copied from the note (demos.js).
// Maths is written \( … \) (inline) and $$ … $$ (display) and typeset by the vendored KaTeX (../assets/katex/).
// Section html uses String.raw so LaTeX backslashes need no doubling.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);
const video = (src) => `<div class="card video" data-video="${src}"></div>`;

const VIDEO_P1 = "media/L01-1.mp4";
const VIDEO_P2 = "media/L01-2.mp4";

const LECTURE = {
  number: 1,
  title: "Three Pictures of a Linear System",
  tagline: "Rows, columns, and one product",
  lead: "A robot with two moves, one target, and two equations. Read them by rows and you see lines that cross; read them by columns and you see arrows that add up. Interactive notes where every picture can be changed and every number was checked by running code.",
  heroDemo: "columnMini",
  heroLabel: "The column picture · 1 a + 3 b",
  heroCaption: "One move a, then three moves b, tip to tail: the robot lands on (7, 0).",
  whyTitle: "Why start with pictures",
  whySub: "Three ways to look at the same equations, used for the rest of the course",
  why: [
    ["The row picture", "Each equation is a <b>line</b> (or a plane). The solution is where they all meet."],
    ["The column picture", "The unknowns are <b>amounts of each column</b>. The solution is the mix that lands on the target."],
    ["One product", "Both pictures are the same computation, \\(A\\mathbf{x} = \\mathbf{b}\\), done by rows or by columns. A neural network's linear layer is that product."],
  ],
  ctaTitle: "Ready to meet the robot?",
  minutes: "About 60–90 minutes",
  videos: {
    [VIDEO_P1]: "Lecture 1 · Part 1 — Row picture and column picture",
    [VIDEO_P2]: "Lecture 1 · Part 2 — Ax = b, three unknowns, no solution, the linear layer",
  },
};

const CHAPTERS = [
  {
    slug: "1-pictures", nav: "Two pictures", title: "Row Picture and Column Picture",
    subtitle: "One system, read across and read down",
    abstract: "Two equations in two unknowns can be drawn as two lines that cross, or as two arrows that add up to a target. Same numbers, different questions.",
    tags: ["robot moves", "lines", "linear combination"],
    hero: "rowMini", heroCaption: "Row picture: x + 2y = 7 and 3x − y = 0 cross at (1, 3).",
    sections: [
      { id: "robot", title: "A robot with two moves", html: String.raw`
        ${video(VIDEO_P1)}
        <p>A delivery robot on a square grid can make two kinds of move. Move <b>a</b> takes it 1 square east and 3 squares north. Move <b>b</b> takes it 2 squares east and 1 square <em>south</em>. It starts at the origin and must stop at the charging point \((7, 0)\): 7 squares east of the start and 0 squares north, level with where it began. How many moves of each kind should it make?</p>
        <p>On the robot's grid a position is written (east, north). Each move is a <b>vector</b>: an ordered pair of numbers, here move <b>a</b> \(= (1, 3)\) and move <b>b</b> \(= (2, -1)\), drawn as an arrow. Making a move adds its numbers to the robot's position.</p>
        <p>Call the number of <b>a</b> moves \(x\) and the number of <b>b</b> moves \(y\). Counting east steps and north steps gives two equations:</p>
        $$\begin{aligned} x + 2y &= 7 \qquad \text{(east)}\\ 3x - y &= 0 \qquad \text{(north)} \end{aligned}$$
        <p>This is a <b>linear system</b>: each unknown appears only multiplied by a number, never squared or multiplied by another unknown. (The numbers on the right, 7 and 0, are allowed: they are the target.)</p>
        ${predict("Before reading on, find \\(x\\) and \\(y\\) any way you like (guessing is fine). Is there more than one answer?",
          `<p>\\(x = 1\\), \\(y = 3\\), checked by substituting it back:</p>${run("substitute")}<p>One move <b>a</b> and three moves <b>b</b>: 1 + 6 = 7 squares east, 3 − 3 = 0 squares north. The next two sections explain why this is the <em>only</em> answer.</p>`)}
        <p>A real robot can only make whole moves, but from now on we let \(x\) and \(y\) be <b>any real numbers</b>: a negative amount means "make the move backwards", and \(x = 2.5\) means two and a half copies of the move.</p>` },
      { id: "row", title: "The row picture: lines that cross", html: String.raw`
        <p><b>Where this picture lives.</b> The row picture is <em>not</em> drawn on the robot's grid. Its axes are the two unknowns: \(x\) (how many <b>a</b> moves) across and \(y\) (how many <b>b</b> moves) up. Each point of this plane is one possible answer, a pair of amounts, and we look for the pair that works.</p>
        <p>Take one equation at a time. All the points \((x, y)\) that satisfy \(x + 2y = 7\) form a straight line; so do the points that satisfy \(3x - y = 0\). A solution of the <em>system</em> must satisfy both, so it lies on both lines: it is the point where they cross. To draw a line, find two of its points:</p>
        ${run("rowLines")}
        <p>The point \((1, 3)\) is on both lists: the lines cross there. They are not parallel (one climbs, the other falls), and two lines in a plane that are not parallel cross at exactly one point. This is the <b>row picture</b>: each row of the system (each equation) is a line, and the solution is the intersection.</p>
        ${demo("row", "Demo 1 · The row picture", "move the targets", "Change the right-hand side: both lines slide, but they never turn, and they always cross exactly once. Why? Their slopes stay 3 and −1/2.")}
        ${predict("Without drawing, decide: does the line \\(3x - y = 0\\) pass through the origin? Which of the two lines is steeper?",
          `<p>Yes: \\(x = 0, y = 0\\) gives 0. Rewriting, \\(y = 3x\\) has slope 3 and \\(y = (7 - x)/2\\) has slope \\(-1/2\\), so the north line is steeper.</p>`)}` },
      { id: "column", title: "The column picture: combining moves", html: String.raw`
        <p>Now read the same two equations <em>down the columns</em>, and draw on the robot's grid again (east across, north up). The numbers multiplying \(x\) are 1 and 3: that is move <b>a</b>. The numbers multiplying \(y\) are 2 and −1: move <b>b</b>. The right-hand side is the target \((7, 0)\). In matrix work we write a vector as a column, top entry first. So the system says:</p>
        $$x \begin{bmatrix} 1 \\ 3 \end{bmatrix} + y \begin{bmatrix} 2 \\ -1 \end{bmatrix} = \begin{bmatrix} 7 \\ 0 \end{bmatrix}.$$
        <p>The left side is a <b>linear combination</b> of the two column vectors: multiply each by a number and add. The question is no longer "where do two lines cross?" but "<b>how much of each column</b> do we need to reach the target?" That is exactly the robot's question.</p>
        ${run("combo")}
        <p>Draw it: one copy of the arrow \((1, 3)\), then three copies of \((2, -1)\) placed tip to tail. The path ends at \((7, 0)\).</p>
        ${run("path")}
        ${demo("column", "Demo 2 · The column picture", "choose the amounts", "Find the amounts that land on the target. Then try to reach it a second way: you can't, because a and b point in different directions.")}
        ${callout("pattern", "PATTERN · TWO PICTURES, ONE SYSTEM", `<p>Row picture: the unknowns are the <em>coordinates of a point</em> that lies on every line (or plane). Column picture: the unknowns are the <em>amounts of each column</em> in a combination that hits the right-hand side. Same numbers, different questions. When one picture is hard to see, switch to the other.</p>`)}
        ${callout("pitfall", "PITFALL · THE COLUMN PICTURE IS NOT THE ROW PICTURE REDRAWN", String.raw`<p>The two pictures are drawn in different planes: the row picture in the plane of answers \((x, y)\), the column picture on the robot's grid (east, north). In the column picture, \((1, 3)\) is <em>move</em> <b>a</b>, and the answer \(x = 1\), \(y = 3\) is a pair of amounts, not an arrow. That they look the same here is a coincidence of this example. Change the target:</p>` + run("other") + `<p>For the target (4, 5) the amounts are 2 and 1, nothing like the first column.</p>` + demo("columnOther", "Try it", "reach (4, 5)"))}` },
    ],
    takeaways: [
      "Row picture: each equation is a line in the plane of answers; the solution is where the lines cross.",
      "Column picture: on the robot's grid, the solution is how much of each column adds up to the target.",
      "The two pictures answer different questions with the same numbers.",
    ],
  },
  {
    slug: "2-product", nav: "Ax = b", title: "One Product: Ax = b",
    subtitle: "A matrix times a vector, by rows or by columns",
    abstract: "Put the columns side by side in a matrix and the unknowns in a vector. The product Ax is the row picture when you compute it by rows, and the column picture when you compute it by columns.",
    tags: ["matrix", "dot product", "numpy @"],
    hero: "toc",
    sections: [
      { id: "matrix", title: "Rows and columns of A", html: String.raw`
        ${video(VIDEO_P2)}
        $$A = \begin{bmatrix} 1 & 2 \\ 3 & -1 \end{bmatrix}, \qquad \mathbf{x} = \begin{bmatrix} x \\ y \end{bmatrix}, \qquad \mathbf{b} = \begin{bmatrix} 7 \\ 0 \end{bmatrix}, \qquad A\mathbf{x} = \mathbf{b}.$$
        <p><b>By rows.</b> Each entry of \(A\mathbf{x}\) is the <b>dot product</b> of one row of \(A\) with \(\mathbf{x}\): multiply matching entries and add. Row 1 is \((1, 2)\), so the first entry is \(1 \cdot 1 + 2 \cdot 3 = 7\). Row 2 is \((3, -1)\), so the second is \(3 \cdot 1 + (-1) \cdot 3 = 0\).</p>
        <p><b>By columns.</b> \(A\mathbf{x}\) is \(x\) times column 1 plus \(y\) times column 2.</p>
        <p>In the code, <code>A[i]</code> is row <code>i</code> and <code>A[:, j]</code> is column <code>j</code> (the <code>:</code> means "every row"). numpy counts from 0, so <code>A[:, 0]</code> is the first column, \((1, 3)\).</p>
        ${run("twoWays")}
        ${demo("matvec", "Demo 3 · Ax two ways", "type a matrix and a vector", "Try a 2-by-3 matrix such as <code>2 0 1; 1 3 -1</code> with x = <code>2 1 4</code> (exercise 1), then give x the wrong length.")}
        <p>To <em>find</em> \(\mathbf{x}\) from \(A\) and \(\mathbf{b}\), numpy has <code>np.linalg.solve</code>, which works when \(A\) is square and the system has exactly one solution:</p>
        ${run("solve")}` },
      { id: "star", title: "Pitfall: A * x", html: String.raw`
        ${callout("pitfall", "PITFALL · IN NUMPY, A * x IS NOT Ax", `<p>The <code>*</code> operator multiplies entry by entry (and stretches <code>x</code> across the rows), so it returns a matrix, not a vector. Use <code>@</code>.</p>` + run("star"))}` },
    ],
    takeaways: [
      "Ax by rows: one dot product per equation.",
      "Ax by columns: a combination of the columns of A.",
      "In numpy it is A @ x, never A * x.",
    ],
  },
  {
    slug: "3-three", nav: "3 unknowns", title: "Three Unknowns",
    subtitle: "Planes in space, columns in space",
    abstract: "With three unknowns each equation is a plane, and three planes are hard to draw. The column picture still works: find the amounts of three columns.",
    tags: ["planes", "3-by-3", "determinant (first look)"],
    hero: "toc",
    sections: [
      { id: "system", title: "Planes and columns in space", html: String.raw`
        $$\begin{aligned} x + y + z &= 6\\ 2x - y + z &= 3\\ x + 2y - z &= 2 \end{aligned}$$
        <p><b>Row picture.</b> Each equation is a plane in space, with axes \(x\), \(y\) and \(z\). Two planes that are not parallel meet in a line; usually the third plane cuts that line at a single point. <b>Column picture.</b> We want amounts of the columns \((1, 2, 1)\), \((1, -1, 2)\) and \((1, 1, -1)\) that add up to \((6, 3, 2)\).</p>
        ${run("three")}
        <p>One of column 1, two of column 2, three of column 3. The columns point in three genuinely different directions, so every right-hand side can be reached, in exactly one way. One quick test, which Lecture 16 explains, is that the <b>determinant</b> is not zero:</p>
        ${run("det")}
        ${predict("Keep the same matrix but change the right-hand side to \\((2, 3, 0)\\), which is column 1 plus column 3. What is the solution?", "<p>\\(x = 1, y = 0, z = 1\\): no computation needed in the column picture.</p>")}` },
    ],
    takeaways: [
      "Three equations in three unknowns: three planes in the row picture.",
      "The column picture is the same question in any dimension: how much of each column?",
      "A nonzero determinant means one solution for every right-hand side (Lecture 16).",
    ],
  },
  {
    slug: "4-singular", nav: "0 or ∞", title: "No Solution, or Infinitely Many",
    subtitle: "When the columns point the same way",
    abstract: "Give the robot a second move that is just twice the first. Now most targets are out of reach, and the reachable ones can be reached in infinitely many ways.",
    tags: ["parallel lines", "singular", "rank (first look)"],
    hero: "toc",
    sections: [
      { id: "parallel", title: "Parallel lines, parallel columns", html: String.raw`
        <p>Move <b>a</b> is still \((1, 3)\); the new second move is \((2, 6)\). The system \(x + 2y = 7\), \(3x + 6y = 5\) has no solution. <b>Row picture:</b> \(3x + 6y = 3(x + 2y)\) would have to be 21, not 5: the lines are parallel. <b>Column picture:</b> every combination \(x\,(1, 3) + y\,(2, 6)\) lies on the line through \((1, 3)\), and \((7, 5)\) is not on it.</p>
        ${run("singular")}
        <p>The <b>rank</b> (here 1) counts how many independent directions the columns give; a 2-by-2 matrix of rank 1 is <b>singular</b>. If the target <em>is</em> on the line, say \((7, 21)\), there are infinitely many answers:</p>
        ${run("many")}
        ${demo("singular", "Demo 4 · Both pictures of a singular system", "move the target", "Left: the row picture (x, y). Right: the columns on the robot's grid. The target is reachable exactly when b₂ = 3 b₁, and then the two lines are one line.")}
        ${callout("pattern", "PATTERN · ZERO, ONE OR INFINITELY MANY", `<p>A linear system never has exactly two solutions. If the columns give enough independent directions, there is exactly one solution for every right-hand side. If they don't, there is no solution for most right-hand sides and infinitely many for the rest.</p>`)}
        ${callout("pitfall", "PITFALL · THREE EQUATIONS, THREE UNKNOWNS, ONE SOLUTION? NO", `<p>If the third column is a combination of the first two, the columns all lie in one plane and most right-hand sides cannot be reached:</p>` + run("rankM3"))}` },
    ],
    takeaways: [
      "Parallel columns (or columns in one plane) make the matrix singular.",
      "Then most targets have no solution and the rest have infinitely many.",
      "Never exactly two solutions.",
    ],
  },
  {
    slug: "5-ml", nav: "Linear layer", title: "Machine Learning: a Linear Layer",
    subtitle: "y = Wx is the column picture",
    abstract: "The simplest layer of a neural network multiplies its input by a weight matrix. Each input feature scales its own column of weights.",
    tags: ["neural network", "weights", "nn.Linear"],
    hero: "toc",
    sections: [
      { id: "layer", title: "Each input has its own column", html: String.raw`
        <p>A <em>linear layer</em> takes an input vector \(\mathbf{x}\) and returns \(\mathbf{y} = W\mathbf{x}\) (usually plus a bias, left out here). PyTorch's <code>nn.Linear</code> stores a weight matrix with one row per output and one column per input.</p>
        ${callout("note", "ML", `<p>Read \\(\\mathbf{y} = W\\mathbf{x}\\) by columns: <b>each input feature has its own column</b>, scaled by the feature's value and added up. Read it by rows: <b>each output is a dot product</b> of one row of weights with the input.</p>`)}
        ${run("layer")}
        <p>Asking "which input produced this output?" is solving \(W\mathbf{x} = \mathbf{y}\). With more inputs than outputs there can be many answers; exercise 6 in the notes finds a second one.</p>` },
    ],
    takeaways: [
      "A linear layer computes y = Wx.",
      "By columns: each input scales its own column of weights.",
      "By rows: each output is a weighted vote over the inputs.",
    ],
  },
  {
    slug: "6-practice", nav: "Practice", title: "Check, Practise, Use AI Well",
    subtitle: "Self-check, exercises, and checking an assistant's answer",
    abstract: "Five quick questions, then the habit that makes AI help safe for linear algebra: multiply the claimed answer back.",
    tags: ["quiz", "exercises", "working with AI"],
    hero: "toc",
    sections: [
      { id: "quiz", title: "Check your understanding", html: String.raw`${demo("quiz", "Self-check", "five questions")}` },
      { id: "exercises", title: "Exercises", html: String.raw`
        <p>Try each exercise on paper first. <b>Hint</b> gives a nudge; <b>Full solution</b> works it through, with the code that checks every number. Stars mark the level: ★ compute or check, ★★ explain or build, ★★★ extend or combine.</p>` },
      { id: "ai", title: "Working with AI", html: String.raw`
        <p>An AI assistant will happily solve a linear system for you. Use it, and then <b>check the answer</b>: a claimed solution of \(A\mathbf{x} = \mathbf{b}\) is right exactly when \(A\mathbf{x}\) equals \(\mathbf{b}\). Here is the check applied to a made-up wrong answer \((2, 1, 3)\) for the 3-by-3 system of chapter 3:</p>
        ${run("claimed")}
        <p>The first equation happens to work, which is why the answer looks plausible; the other two fail. Checking one equation is not enough: check them all.</p>` },
    ],
    takeaways: [
      "Row picture, column picture, Ax = b: three views of one system.",
      "Zero, one or infinitely many solutions.",
      "Check any claimed solution by multiplying back into every equation.",
    ],
  },
];
