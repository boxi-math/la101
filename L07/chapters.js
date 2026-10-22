// Chapter content, adapted from notes/L07-solving-ax-0.md. Code and outputs are copied from the note (demos.js).
// Maths is written \( … \) (inline) and $$ … $$ (display) and typeset by the vendored KaTeX (../assets/katex/).
// Section html uses String.raw so LaTeX backslashes need no doubling.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);
const video = (src) => `<div class="card video" data-video="${src}"></div>`;
const VIDEO_P1 = "media/L07-1.mp4";
const VIDEO_P2 = "media/L07-2.mp4";

const LECTURE = {
  number: 7,
  title: "Solving Ax = 0",
  tagline: "Pivots, free variables and special solutions",
  lead: "Elimination on a rectangular matrix still makes a staircase, but some columns get no pivot. Their unknowns are free. One special solution per free variable describes the whole nullspace, and the reduced form R lets you read them off at a glance.",
  heroDemo: "nullspaceMini",
  heroLabel: "A → R, step by step",
  heroCaption: "The four-button drone: two pivots, two free columns, two special solutions.",
  whyTitle: "Why free variables",
  whySub: "Counting what the data cannot decide",
  why: [
    ["Rank", "The number of pivots, r. The other n − r columns are free."],
    ["Special solutions", "Set one free variable to 1, the others to 0, and back-substitute. Their combinations are N(A)."],
    ["Wide matrices", "More unknowns than equations always leaves a free variable: a nonzero nullspace."],
  ],
  ctaTitle: "Ready to eliminate?",
  minutes: "About 60–90 minutes",
  videos: {
    [VIDEO_P1]: "Lecture 7 · Part 1 — Pivots, free variables and special solutions",
    [VIDEO_P2]: "Lecture 7 · Part 2 — The reduced form R, and counting n − r",
  },
};

const CHAPTERS = [
  {
    slug: "1-pivots", nav: "Pivots", title: "Pivots and Free Variables",
    subtitle: "Elimination on a rectangular matrix",
    abstract: "The drone gets a fourth button s = (0, 1, 1). Three equations, four unknowns: elimination finds two pivots and two free columns.",
    tags: ["echelon form", "rank", "free columns"],
    hero: "nullspace", heroCaption: "Type any matrix and step through the reduction.",
    sections: [
      { id: "drone4", title: "A drone with four buttons", html: String.raw`
        ${video(VIDEO_P1)}
        $$A = \begin{bmatrix} 1 & 1 & 3 & 0 \\ 2 & 3 & 7 & 1 \\ 1 & 2 & 4 & 1 \end{bmatrix}$$
        <p>Which button sequences \(\mathbf{x} = (x_1, x_2, x_3, x_4)\) bring the drone back? That is \(A\mathbf{x} = \mathbf{0}\). The sequence \((2, 1, -1, 0)\) from Lecture 6 still works.</p>
        ${run("drone4")}` },
      { id: "elim", title: "Elimination", html: String.raw`
        <p>The right side is zero and stays zero, so leave it out. Elimination does not change the nullspace: every step can be undone.</p>
        ${run("echelon")}
        ${callout("note", "DEFINITION", `<p>The <b>rank</b> \\(r\\) is the number of pivots. Columns with a pivot are <b>pivot columns</b>; the others are <b>free columns</b>, and their unknowns are the <b>free variables</b>.</p>`)}
        <p>For the drone: \(r = 2\), pivot columns 1 and 2, free columns 3 and 4. numpy agrees:</p>
        ${run("rank")}` },
    ],
    takeaways: [
      "Rectangular elimination gives a staircase U.",
      "Rank r = number of pivots.",
      "Columns without a pivot are free.",
    ],
  },
  {
    slug: "2-special", nav: "Special", title: "Special Solutions",
    subtitle: "One per free variable; the nullspace is all their combinations",
    abstract: "Set one free variable to 1, the others to 0, and back-substitute. The drone has two special solutions, and every do-nothing sequence is a combination of them.",
    tags: ["special solutions", "N(A)", "back substitution"],
    hero: "code:special", heroCaption: "Special solutions from U",
    sections: [
      { id: "special", title: "Back substitution", html: String.raw`
        $$x_1 + x_2 + 3x_3 = 0, \qquad x_2 + x_3 + x_4 = 0$$
        <p>\(x_3 = 1, x_4 = 0\) gives \(\mathbf{s}_1 = (-2, -1, 1, 0)\); \(x_3 = 0, x_4 = 1\) gives \(\mathbf{s}_2 = (1, -1, 0, 1)\).</p>
        ${run("special")}
        <p>The <b>whole nullspace</b> is \(\{c\,\mathbf{s}_1 + d\,\mathbf{s}_2\}\), a plane through \(\mathbf{0}\) in \(\mathbf{R}^4\): any solution has some free entries \(c, d\), and back substitution leaves no choice for the rest.</p>
        ${run("combo")}
        ${callout("pitfall", "PITFALL · FREE MEANS CHOSEN", `<p>Setting every free variable to 0 gives only \\(\\mathbf{x} = \\mathbf{0}\\). The special solutions set them to 1 one at a time; the nullspace is all their combinations.</p>`)}` },
    ],
    takeaways: [
      "s₁ = (−2, −1, 1, 0), s₂ = (1, −1, 0, 1).",
      "N(A) = all c s₁ + d s₂.",
      "Free variables are chosen, not zero.",
    ],
  },
  {
    slug: "3-rref", nav: "R and n − r", title: "The Reduced Form and Counting",
    subtitle: "Read the special solutions off R; there are n − r of them",
    abstract: "Clear above the pivots too and divide by them: the reduced row echelon form R. The free columns of R, with signs flipped, are the special solutions.",
    tags: ["rref", "N = [−F; I]", "n − r"],
    hero: "code:nmat", heroCaption: "The nullspace matrix",
    sections: [
      { id: "rref", title: "The reduced form R", html: String.raw`
        ${video(VIDEO_P2)}
        $$R = \begin{bmatrix} 1 & 0 & 2 & -1 \\ 0 & 1 & 1 & 1 \\ 0 & 0 & 0 & 0 \end{bmatrix}$$
        ${run("rref")}
        <p>The equations read \(x_1 = -2x_3 + x_4\), \(x_2 = -x_3 - x_4\): <b>the special solutions are the free columns of \(R\) with the signs flipped</b>. With pivot columns first, \(R = \begin{bmatrix} I & F \\ 0 & 0 \end{bmatrix}\) and the special solutions are the columns of \(N = \begin{bmatrix} -F \\ I \end{bmatrix}\).</p>
        ${run("nmat")}
        ${predict("Elimination changed the column space. Did it change the nullspace?", `<p>No: every step can be undone, so \\(A\\mathbf{x} = \\mathbf{0}\\) and \\(R\\mathbf{x} = \\mathbf{0}\\) have the same solutions.</p>${run("fromR")}`)}` },
      { id: "count", title: "Counting: n − r", html: String.raw`
        <p>Every column is a pivot column or a free column, so there are \(n - r\) special solutions. A free column can be anywhere:</p>
        $$B = \begin{bmatrix} 1 & 3 & 1 \\ 2 & 6 & 3 \end{bmatrix}$$
        ${run("middle")}
        <p><b>More unknowns than equations means a nonzero nullspace</b>: at most \(m\) pivots, so \(n - r \ge n - m > 0\). A tall matrix need not have one:</p>
        ${run("tall")}` },
      { id: "ml", title: "Weights the data cannot decide", html: String.raw`
        <p>Two training examples, three weights: the data matrix \(X = \begin{bmatrix} 1 & 2 & 0 \\ 1 & 0 & 1 \end{bmatrix}\) is wide, so it has a nullspace. Adding \((-2, 1, 2)\) to the weights changes no training prediction, but changes the prediction on a new input.</p>
        ${run("weights")}
        ${callout("note", "ML", `<p>More weights than training examples: infinitely many weight vectors fit equally well. Something beyond the data must choose (Lectures 14 and 28).</p>`)}` },
    ],
    takeaways: [
      "Special solutions = free columns of R, signs flipped: N = [−F; I].",
      "There are n − r of them.",
      "n > m ⇒ a nonzero nullspace.",
    ],
  },
  {
    slug: "4-practice", nav: "Practice", title: "Check, Practise, Use AI Well",
    subtitle: "Self-check, exercises, and checking an assistant's row reduction",
    abstract: "Five quick questions, the exercises, and the habit for AI help: every special solution must give zero, and there must be n − r of them.",
    tags: ["quiz", "exercises", "working with AI"],
    hero: "toc",
    sections: [
      { id: "quiz", title: "Check your understanding", html: String.raw`${demo("quiz", "Self-check", "five questions")}` },
      { id: "exercises", title: "Exercises", html: String.raw`
        <p>Try each exercise on paper first. <b>Hint</b> gives a nudge; <b>Full solution</b> works it through, with the code that checks every number. Stars mark the level: ★ compute or check, ★★ explain or build, ★★★ extend or combine.</p>` },
      { id: "ai", title: "Working with AI", html: String.raw`
        <p>Check a claimed answer: multiply each special solution by \(A\); count them against \(n - r\). Here is a made-up answer with the most common slip, the sign:</p>
        ${run("claim")}
        <p>The count is right but neither vector goes to zero: the pivot entries were copied from \(R\) without flipping the sign.</p>` },
    ],
    takeaways: [
      "A s = 0 for every special solution.",
      "Count them: n − r.",
      "Each has a 1 in its own free slot, 0 in the others.",
    ],
  },
];
