// Chapter content, adapted from notes/L08-solving-ax-b.md. Code and outputs are copied from the note (demos.js).
// Maths is written \( … \) (inline) and $$ … $$ (display) and typeset by the vendored KaTeX (../assets/katex/).
// Section html uses String.raw so LaTeX backslashes need no doubling.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);
const video = (src) => `<div class="card video" data-video="${src}"></div>`;
const VIDEO_P1 = "media/L08-1.mp4";
const VIDEO_P2 = "media/L08-2.mp4";

const LECTURE = {
  number: 8,
  title: "Solving Ax = b",
  tagline: "When can it get there, and in how many ways?",
  lead: "Carry the right-hand side through elimination. Zero rows turn into conditions on b; if they hold, one particular solution plus the whole nullspace is every solution. The rank decides which of four cases you are in.",
  heroDemo: "completeMini",
  heroLabel: "[A | b] → R",
  heroCaption: "The drone with four targets: (2, 5, 3) and (3, 4, 1) are reachable, (1, 1, 1) and (0, 0, 5) are not.",
  whyTitle: "Why the complete solution",
  whySub: "A library gives you one answer; there may be infinitely many",
  why: [
    ["Solvability", "Every zero row of U gives one condition on b: here b₁ − b₂ + b₃ = 0."],
    ["Complete solution", "x = xₚ + xₙ: one particular solution plus everything in N(A)."],
    ["The rank decides", "r < m: some b fail. r < n: a solution is never alone."],
  ],
  ctaTitle: "Ready to deliver?",
  minutes: "About 60–90 minutes",
  videos: {
    [VIDEO_P1]: "Lecture 8 · Part 1 — Can the drone get there, and in how many ways?",
    [VIDEO_P2]: "Lecture 8 · Part 2 — The rank decides",
  },
};

const CHAPTERS = [
  {
    slug: "1-solvable", nav: "Solvable?", title: "When Is There a Solution?",
    subtitle: "Eliminate with b carried along",
    abstract: "Two deliveries for the four-button drone: (2, 5, 3) and (1, 1, 1). The last row of the augmented matrix decides.",
    tags: ["augmented matrix", "condition on b", "0 = 1"],
    hero: "complete", heroCaption: "Type A and b; read off the case and the complete solution.",
    sections: [
      { id: "where", title: "Where can the drone go?", html: String.raw`
        ${video(VIDEO_P1)}
        $$A = \begin{bmatrix} 1 & 1 & 3 & 0 \\ 2 & 3 & 7 & 1 \\ 1 & 2 & 4 & 1 \end{bmatrix}$$
        ${run("two")}` },
      { id: "aug", title: "The augmented matrix", html: String.raw`
        $$\left[\begin{array}{cccc|c} 1 & 1 & 3 & 0 & b_1 \\ 0 & 1 & 1 & 1 & b_2 - 2b_1 \\ 0 & 0 & 0 & 0 & b_3 - b_2 + b_1 \end{array}\right]$$
        <p>The last row says \(0 = b_1 - b_2 + b_3\): the same plane as in Lecture 6. <b>Every zero row of \(U\) gives one condition on \(\mathbf{b}\)</b>, and a pivot in the last column of the augmented matrix means no solution.</p>
        ${run("aug")}
        ${predict("Without eliminating again: is \\((3, 4, 1)\\) reachable? And \\((0, 0, 5)\\)?", `<p>\\(3 - 4 + 1 = 0\\): yes. \\(0 - 0 + 5 = 5\\): no.</p>${run("predict")}`)}` },
    ],
    takeaways: [
      "Carry b through elimination.",
      "Each zero row of U gives a condition on b.",
      "A pivot in the last column: no solution.",
    ],
  },
  {
    slug: "2-complete", nav: "Complete", title: "The Complete Solution",
    subtitle: "One particular solution plus the nullspace",
    abstract: "Set the free variables to zero for one solution; then add every vector of the nullspace.",
    tags: ["xₚ", "xₙ", "plane in R⁴"],
    hero: "code:complete", heroCaption: "x = xₚ + c s₁ + d s₂",
    sections: [
      { id: "complete", title: "x = xₚ + xₙ", html: String.raw`
        <p>From the reduced rows \(x_1 + 2x_3 - x_4 = 1\), \(x_2 + x_3 + x_4 = 1\): free variables zero gives \(\mathbf{x}_p = (1, 1, 0, 0)\). If \(\mathbf{x}\) is any solution, \(A(\mathbf{x} - \mathbf{x}_p) = \mathbf{0}\), so</p>
        $$\mathbf{x} = \begin{bmatrix} 1 \\ 1 \\ 0 \\ 0 \end{bmatrix} + c \begin{bmatrix} -2 \\ -1 \\ 1 \\ 0 \end{bmatrix} + d \begin{bmatrix} 1 \\ -1 \\ 0 \\ 1 \end{bmatrix}.$$
        ${run("complete")}
        <p>The sequence \((0, 2, 0, -1)\) is \(c = 0, d = -1\). Every recipe that reaches \((2, 5, 3)\) appears exactly once.</p>
        ${callout("pitfall", "PITFALL · NOT ANYTHING GOES", `<p>"Infinitely many solutions" is a plane in \\(\\mathbf{R}^4\\) that misses \\(\\mathbf{0}\\), not every vector: \\((1, 0, 0, 0)\\) is not a solution.</p>`)}` },
    ],
    takeaways: [
      "xₚ: free variables zero.",
      "Complete solution: xₚ + all of N(A).",
      "Any solution can serve as xₚ.",
    ],
  },
  {
    slug: "3-rank", nav: "Rank", title: "The Rank Decides",
    subtitle: "Four cases, and what the libraries do",
    abstract: "Compare r with m and n. Then see why np.linalg.lstsq returns the shortest of many solutions, and why zero training error says little when there are more weights than examples.",
    tags: ["full rank", "lstsq", "more weights than examples"],
    hero: "code:describe", heroCaption: "(rows, columns, rank, number of solutions)",
    sections: [
      { id: "cases", title: "Four cases", html: String.raw`
        ${video(VIDEO_P2)}
        <p>\(r = m\): <b>full row rank</b>. \(r = n\): <b>full column rank</b>.</p>
        <table><tr><th>case</th><th>solutions of \(A\mathbf{x} = \mathbf{b}\)</th><th>example</th></tr>
        <tr><td>\(r = m = n\)</td><td>exactly 1, for every \(\mathbf{b}\)</td><td>the paint matrix</td></tr>
        <tr><td>\(r = n < m\) (tall)</td><td>0 or 1</td><td>a 2-to-3 layer</td></tr>
        <tr><td>\(r = m < n\) (wide)</td><td>infinitely many, for every \(\mathbf{b}\)</td><td>two examples, three weights</td></tr>
        <tr><td>\(r < m,\ r < n\)</td><td>0 or infinitely many</td><td>the drone</td></tr></table>
        ${run("describe")}` },
      { id: "libs", title: "What the libraries do", html: String.raw`
        <p><code>np.linalg.solve</code> handles only square matrices with \(r = n\). <code>np.linalg.lstsq</code> handles every case and, with infinitely many solutions, returns the one of smallest length:</p>
        ${run("lstsq")}
        <p>Not our \(\mathbf{x}_p\), but a different point of the same plane of solutions. Lecture 28 explains how the shortest one is found.</p>` },
      { id: "ml", title: "More weights than examples", html: String.raw`
        ${run("weights")}
        <p>Both weight vectors fit the targets \((3, 2)\) exactly; they differ by a multiple of \((-2, 1, 2)\) and disagree on new inputs.</p>
        ${callout("note", "ML", `<p>"Zero training error" says little when \\(r = m < n\\): a whole plane of models achieves it. Which perfect fit the training procedure lands on matters.</p>`)}` },
    ],
    takeaways: [
      "r < m: some b have no solution.",
      "r < n: a solution is never alone.",
      "lstsq returns the shortest solution, one of many.",
    ],
  },
  {
    slug: "4-practice", nav: "Practice", title: "Check, Practise, Use AI Well",
    subtitle: "Self-check, exercises, and checking a complete solution",
    abstract: "Five quick questions, the exercises, and the habit for AI help: check xₚ, check each nullspace vector, and count them.",
    tags: ["quiz", "exercises", "working with AI"],
    hero: "toc",
    sections: [
      { id: "quiz", title: "Check your understanding", html: String.raw`${demo("quiz", "Self-check", "five questions")}` },
      { id: "exercises", title: "Exercises", html: String.raw`
        <p>Try each exercise on paper first. <b>Hint</b> gives a nudge; <b>Full solution</b> works it through, with the code that checks every number. Stars mark the level: ★ compute or check, ★★ explain or build, ★★★ extend or combine.</p>` },
      { id: "ai", title: "Working with AI", html: String.raw`
        <p>Ask for the complete solution, not "the solution", and check its parts: \(A\mathbf{x}_p = \mathbf{b}\), each \(A\mathbf{s} = \mathbf{0}\), and \(n - r\) nullspace vectors. A made-up answer with one direction missing:</p>
        ${run("claim")}
        <p>Every vector checks out, but \(n - r = 2\) directions are needed: the count catches what multiplication alone cannot.</p>` },
    ],
    takeaways: [
      "A xₚ = b.",
      "A s = 0 for each nullspace vector.",
      "n − r of them.",
    ],
  },
];
