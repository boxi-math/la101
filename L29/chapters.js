// Chapter content, adapted from notes/L29-norms-condition.md. Code and outputs are copied from the note (demos.js).
// Maths is written \( … \) (inline) and $$ … $$ (display) and typeset by the vendored KaTeX (../assets/katex/).
// Section html uses String.raw so LaTeX backslashes need no doubling.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);
const video = (src) => `<div class="card video" data-video="${src}"></div>`;
const VIDEO_P1 = "media/L29-1.mp4";
const VIDEO_P2 = "media/L29-2.mp4";

const LECTURE = {
  number: 29,
  title: "Norms and the Condition Number",
  tagline: "How much can errors grow?",
  lead: "Data is never exact and computers round. Norms measure vectors and matrices, ‖A‖₂ = σmax is the largest stretch, and the condition number κ = σmax/σmin bounds how much a relative error in b can grow in x. A nearly singular system, why good software never forms AᵀA, collinear features in regression, and what float32 and float16 do to the data.",
  heroDemo: "condMini",
  heroLabel: "an ellipse getting thin",
  heroCaption: "As [1 1; 1 1 + δ] approaches a singular matrix, the ellipse flattens and κ = σmax/σmin explodes.",
  whyTitle: "Why κ matters",
  whySub: "Solvable on paper is not enough",
  why: [
    ["Error growth", "\\(\\|\\delta\\mathbf x\\|/\\|\\mathbf x\\| \\le \\kappa\\,\\|\\delta\\mathbf b\\|/\\|\\mathbf b\\|\\): a change in the last digit can move the answer completely."],
    ["Least squares", "\\(\\kappa(A^\\top A) = \\kappa(A)^2\\): use QR or the SVD, not the normal equations."],
    ["Machine learning", "Collinear features and float16 are conditioning problems."],
  ],
  ctaTitle: "Ready to measure the danger?",
  minutes: "About 60–90 minutes",
  videos: {
    [VIDEO_P1]: "Lecture 29 · Part 1 — How much can errors grow?",
    [VIDEO_P2]: "Lecture 29 · Part 2 — Squaring, collinear features and low precision",
  },
};

const CHAPTERS = [
  {
    slug: "1-norms", nav: "Norms", title: "Sizes of Vectors and Matrices",
    subtitle: "Three vector norms, the largest stretch",
    abstract: "x = (3, −4, 12) has ‖x‖₁ = 19, ‖x‖₂ = 13, ‖x‖∞ = 12. The 2-norm of a matrix is its largest stretch σmax; for [2 3; 0 2] it is 4, and the Frobenius norm is √17.",
    tags: ["‖x‖₁, ‖x‖₂, ‖x‖∞", "‖A‖₂ = σmax", "Frobenius"],
    hero: "norms", heroCaption: "Move x and compare the three norms",
    sections: [
      { id: "vec", title: "Vector norms", html: String.raw`
        ${video(VIDEO_P1)}
        $$\|\mathbf x\|_1 = \sum|x_i|, \qquad \|\mathbf x\|_2 = \sqrt{\sum x_i^2}, \qquad \|\mathbf x\|_\infty = \max|x_i|$$
        ${run("vnorm")}
        ${demo("norms", "Demo 1 · Three unit balls", "move x", "The unit ‘circles’ are a diamond (1-norm), a circle (2-norm) and a square (∞-norm).")}` },
      { id: "mat", title: "Matrix norms", html: String.raw`
        $$\|A\|_2 = \max_{\mathbf x \ne \mathbf 0}\frac{\|A\mathbf x\|}{\|\mathbf x\|} = \sigma_{\max}, \qquad \|A\|_F = \sqrt{\textstyle\sum a_{ij}^2} = \sqrt{\textstyle\sum\sigma_i^2}, \qquad \|A^{-1}\|_2 = 1/\sigma_{\min}$$
        ${run("mnorm")}` },
    ],
    takeaways: [
      "Several sensible vector norms.",
      "‖A‖₂ = σmax: the largest stretch.",
      "‖A⁻¹‖₂ = 1/σmin.",
    ],
  },
  {
    slug: "2-condition", nav: "κ", title: "The Condition Number",
    subtitle: "Worst-case growth of relative errors",
    abstract: "κ = σmax/σmin. For [1 1; 1 1.001] with b = (2, 2.001), x = (1, 1) and κ ≈ 4002; changing 2.001 to 2.002 moves x to (0, 2), about 2800 times the change in b. A small determinant is not the test: 0.001·I has κ = 1.",
    tags: ["κ = σmax/σmin", "nearly singular", "not the determinant"],
    hero: "cond", heroCaption: "Turn δb and watch the amplification",
    sections: [
      { id: "kappa", title: "The bound", html: String.raw`
        $$\frac{\|\delta\mathbf x\|}{\|\mathbf x\|} \le \kappa(A)\,\frac{\|\delta\mathbf b\|}{\|\mathbf b\|}, \qquad \kappa(A) = \|A\|\,\|A^{-1}\| = \frac{\sigma_{\max}}{\sigma_{\min}}$$
        ${run("system")}
        ${predict("Change only the last digit of b: 2.001 becomes 2.002. How far does x move?", `<p>All the way to (0, 2): about 2800 times the relative change in b.</p>${run("jump")}`)}
        ${demo("cond", "Demo 2 · Error amplification", "type A and b, turn δb", "Try ‘0.001 I’: a tiny determinant, but κ = 1.")}` },
      { id: "det", title: "Not the determinant", html: String.raw`
        ${callout("pitfall", "PITFALL · SMALL DETERMINANT", String.raw`<p>Scaling the whole matrix changes the determinant but not \(\kappa\).</p>` + run("det"))}
        <p><b>Digits.</b> float64 keeps about 16 significant digits; a condition number of \(10^k\) can cost about \(k\) of them (a rule of thumb).</p>` },
    ],
    takeaways: [
      "κ bounds relative error growth.",
      "Worst along the short axis u_min.",
      "κ = 10ᵏ: lose about k digits.",
    ],
  },
  {
    slug: "3-practice-num", nav: "AᵀA & precision", title: "Squaring, Collinear Features and Low Precision",
    subtitle: "Where conditioning bites in practice",
    abstract: "κ(AᵀA) = κ(A)²: with ε = 10⁻⁸, TᵀT rounds to a singular matrix while lstsq on T returns (1, 1). Nearly duplicate features (κ ≈ 215) make regression weights swing while their sum stays near 2. In float16, storing [1 1; 1 1.001] already turns the answer (1, 1) into (0, 2).",
    tags: ["κ(AᵀA) = κ²", "collinear features", "float32 / float16"],
    hero: "collinear", heroCaption: "Make x₂ a closer copy of x₁",
    sections: [
      { id: "ata", title: "Why not form AᵀA", html: String.raw`
        ${video(VIDEO_P2)}
        $$\kappa(A^\top A) = \kappa(A)^2$$
        ${run("normal")}` },
      { id: "collinear", title: "Collinear features", html: String.raw`
        ${run("collinear")}
        <p>The data fixes \(w_1 + w_2\) (the long axis, large \(\sigma_1\)) and hardly says anything about \(w_1 - w_2\) (tiny \(\sigma_2\)). Ridge keeps the weights near \((1, 1)\).</p>
        ${demo("collinear", "Demo 3 · Collinear features", "move the noise in x₂, draw new noise in y", "These samples are drawn in the browser with their own random numbers, so the numbers differ from the note.")}` },
      { id: "precision", title: "float32 and float16", html: String.raw`
        ${run("precision")}
        ${demo("precision", "Demo 4 · Rounding the data", "move δ", "Math.fround gives float32; float16 is rounded to an 11-bit significand.")}` },
    ],
    takeaways: [
      "Never form AᵀA for least squares.",
      "Collinear: only some combinations are determined.",
      "Rounding the data can be enough to fail.",
    ],
  },
  {
    slug: "4-practice", nav: "Practice", title: "Check, Practise, Use AI Well",
    subtitle: "Self-check, exercises, test a stability claim",
    abstract: "Five quick questions, then the habit for conditioning claims: compute κ, then change the data slightly and watch the answer.",
    tags: ["quiz", "exercises", "working with AI"],
    hero: "toc",
    sections: [
      { id: "quiz", title: "Check your understanding", html: String.raw`${demo("quiz", "Self-check", "five questions")}${run("cyu")}` },
      { id: "exercises", title: "Exercises", html: String.raw`
        <p>Try each exercise on paper first. <b>Hint</b> gives a nudge; <b>Full solution</b> works it through, with the code that checks every number. Stars mark the level: ★ compute or check, ★★ explain or build, ★★★ extend or combine.</p>` },
      { id: "ai", title: "Working with AI", html: String.raw`
        <p>An assistant says: “\(\det M = 0.001\) is small, so rescale the matrix by 1000 to fix the conditioning.”</p>
        ${run("claim")}
        <p>The determinant grows to 1000, but \(\kappa\) is still about 4002, and the same last-digit change still gives \((0, 2)\). Change the problem, not the scale.</p>` },
    ],
    takeaways: [
      "Judge by κ, not det.",
      "Test: perturb the data, watch the answer.",
      "Scaling A changes nothing.",
    ],
  },
];
