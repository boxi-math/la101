// Chapter content, adapted from notes/L14-least-squares.md. Code and outputs are copied from the note (demos.js).
// Maths is written \( … \) (inline) and $$ … $$ (display) and typeset by the vendored KaTeX (../assets/katex/).
// Section html uses String.raw so LaTeX backslashes need no doubling.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);
const video = (src) => `<div class="card video" data-video="${src}"></div>`;
const VIDEO_P1 = "media/L14-1.mp4";
const VIDEO_P2 = "media/L14-2.mp4";

const LECTURE = {
  number: 14,
  title: "Least Squares",
  tagline: "The best line when no line fits",
  lead: "A café's four weeks of cold-brew sales do not lie on one line, so the system has no solution. Least squares takes the closest reachable point instead: the projection. The normal equations give the best line, the residuals are the vertical gaps, and training a linear regression is exactly this computation.",
  heroDemo: "fitMini",
  heroLabel: "The best line",
  heroCaption: "The café's weeks, a festival week that pulls the line, and a gentler trend. Dashed: the residuals.",
  whyTitle: "Why least squares",
  whySub: "More equations than unknowns is the normal case for data",
  why: [
    ["Normal equations", "\\(A^\\top A\\hat{\\mathbf{x}} = A^\\top\\mathbf{b}\\): a small square system for the best fit."],
    ["Residuals", "\\(\\mathbf{e} = \\mathbf{b} - A\\hat{\\mathbf{x}}\\) is perpendicular to every column; with an intercept it adds to zero."],
    ["Linear regression", "Training on squared error is least squares: lstsq and gradient descent give the same weights."],
  ],
  ctaTitle: "Ready to fit a line?",
  minutes: "About 60–90 minutes",
  videos: {
    [VIDEO_P1]: "Lecture 14 · Part 1 — The best line through four points",
    [VIDEO_P2]: "Lecture 14 · Part 2 — Least squares at work",
  },
};

const CHAPTERS = [
  {
    slug: "1-best-line", nav: "Best line", title: "Four Weeks, One Line",
    subtitle: "No exact solution, the normal equations, residuals",
    abstract: "Four equations, two unknowns, no solution. The projection of Lecture 13 gives the best line y = 1.9 + 1.4t.",
    tags: ["least squares", "normal equations", "residuals"],
    hero: "fit", heroCaption: "Move the four sales; the line, the gaps and the error follow.",
    sections: [
      { id: "cafe", title: "No line through four points", html: String.raw`
        ${video(VIDEO_P1)}
        $$\begin{bmatrix} 1 & 0 \\ 1 & 1 \\ 1 & 2 \\ 1 & 3 \end{bmatrix}\begin{bmatrix} C \\ D \end{bmatrix} = \begin{bmatrix} 2 \\ 3 \\ 5 \\ 6 \end{bmatrix}$$
        <p>The first two equations fix \(C = 2\), \(D = 1\); then the third says \(2 + 2 = 5\). Rank 2, but rank 3 with \(\mathbf{b}\) added:</p>
        ${run("cafe")}` },
      { id: "normal", title: "The normal equations", html: String.raw`
        ${callout("note", "DEFINITION", `<p>The <b>least-squares solution</b> \\(\\hat{\\mathbf{x}}\\) minimises \\(\\|\\mathbf{b} - A\\mathbf{x}\\|^2\\) and solves \\(A^\\top A\\hat{\\mathbf{x}} = A^\\top\\mathbf{b}\\). Fitted values \\(\\mathbf{p} = A\\hat{\\mathbf{x}}\\), residuals \\(\\mathbf{e} = \\mathbf{b} - \\mathbf{p}\\).</p>`)}
        $$A^\top A = \begin{bmatrix} 4 & \sum t_i \\ \sum t_i & \sum t_i^2 \end{bmatrix} = \begin{bmatrix} 4 & 6 \\ 6 & 14 \end{bmatrix}, \qquad A^\top\mathbf{b} = \begin{bmatrix} 16 \\ 31 \end{bmatrix}$$
        ${run("normal")}
        <p>The best line is \(y = 1.9 + 1.4t\), steeper than \(y = 2 + t\). \(A^\top\mathbf{e} = \mathbf{0}\): the residuals add to zero and leave no tilt. Week 4:</p>
        ${run("forecast")}` },
      { id: "pictures", title: "Two pictures and a calculus check", html: String.raw`
        <p>In the data picture each \(e_i\) is a <b>vertical</b> gap: we predict \(y\) from \(t\). In \(\mathbf{R}^4\), \(\mathbf{p}\) is the foot of the perpendicular from \(\mathbf{b}\) to the plane \(C(A)\). Setting \(\partial E/\partial C = \partial E/\partial D = 0\) gives the normal equations again:</p>
        ${run("calculus")}
        <p>Centring the weeks, \(s = t - 1.5\), makes the columns perpendicular and \(A^\top A\) diagonal:</p>
        ${run("centre")}` },
    ],
    takeaways: [
      "No exact solution: solve AᵀAx̂ = Aᵀb.",
      "Ax̂ = p, not b; e ⊥ every column.",
      "Residuals are vertical gaps.",
    ],
  },
  {
    slug: "2-at-work", nav: "At work", title: "Least Squares at Work",
    subtitle: "More columns, one outlier, survey heights, regression",
    abstract: "Any model linear in its unknowns uses the same recipe. More columns always fit better, which is not the same as better; one outlier pulls every weight.",
    tags: ["overfitting", "outlier", "linear regression"],
    hero: "code:festival", heroCaption: "One festival week moves the slope from 1.4 to 3.2",
    sections: [
      { id: "columns", title: "More columns, same recipe", html: String.raw`
        ${video(VIDEO_P2)}
        ${run("columns")}
        <p>The best parabola is the line itself (\(\mathbf{e} \perp t^2\)). The cubic passes through every point and forecasts 400 cups where the line says 750.</p>
        ${callout("pitfall", "PITFALL · BETTER FIT IS NOT A BETTER MODEL", `<p>Adding a column can only shrink the error, down to zero. Judge a model on data it has not seen.</p>`)}` },
      { id: "festival", title: "One outlier", html: String.raw`
        ${run("festival")}
        <p>Squares magnify big errors: look at the residuals before trusting a fit.</p>` },
      { id: "survey", title: "Heights from survey climbs", html: String.raw`
        <p>Lecture 11's six climbs do not fit any heights. Least squares spreads the mismatch over the right loop:</p>
        ${run("survey")}` },
      { id: "regression", title: "Linear regression", html: String.raw`
        <p>Training a linear regression on mean squared error <b>is</b> least squares. NumPy's lstsq and gradient descent agree:</p>
        ${run("lstsq")}
        ${run("gd")}` },
    ],
    takeaways: [
      "Same recipe for any model linear in its unknowns.",
      "Small error on the data is not proof of a good model.",
      "Regression = least squares.",
    ],
  },
  {
    slug: "3-practice", nav: "Practice", title: "Check, Practise, Use AI Well",
    subtitle: "Self-check, exercises, and checking a claimed fit",
    abstract: "Five quick questions, the exercises, and a check that catches a perpendicular-distance fit passed off as least squares.",
    tags: ["quiz", "exercises", "working with AI"],
    hero: "toc",
    sections: [
      { id: "quiz", title: "Check your understanding", html: String.raw`${demo("quiz", "Self-check", "five questions")}` },
      { id: "exercises", title: "Exercises", html: String.raw`
        <p>Try each exercise on paper first. <b>Hint</b> gives a nudge; <b>Full solution</b> works it through, with the code that checks every number. Stars mark the level: ★ compute or check, ★★ explain or build, ★★★ extend or combine.</p>` },
      { id: "ai", title: "Working with AI", html: String.raw`
        <p>Check a claimed fit: \(A^\top\mathbf{e} = \mathbf{0}\), the line through \((\bar t, \bar y)\), and no nearby line with a smaller error. A perpendicular-distance fit fails test 1, if only just:</p>
        ${run("claim")}` },
    ],
    takeaways: [
      "Aᵀe = 0.",
      "Through the point of averages.",
      "Vertical gaps for predicting y.",
    ],
  },
];
