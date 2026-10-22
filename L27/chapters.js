// Chapter content, adapted from notes/L27-low-rank-pca.md. Code and outputs are copied from the note (demos.js).
// Maths is written \( … \) (inline) and $$ … $$ (display) and typeset by the vendored KaTeX (../assets/katex/).
// Section html uses String.raw so LaTeX backslashes need no doubling.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);
const video = (src) => `<div class="card video" data-video="${src}"></div>`;
const VIDEO_P1 = "media/L27-1.mp4";
const VIDEO_P2 = "media/L27-2.mp4";

const LECTURE = {
  number: 27,
  title: "Low-Rank Approximation and PCA",
  tagline: "Keep the first pieces",
  lead: "Cut the SVD after k pieces and you get the best matrix of rank k: no search needed, and the error is the next singular value. A small sunset picture keeps 99.5% from a third of the numbers, a centred data table gives its principal directions, and low-rank updates adapt large models cheaply.",
  heroDemo: "compressMini",
  heroLabel: "the sunset at rank k",
  heroCaption: "Our 48 × 64 sunset rebuilt from 1, 2, 3, 5, 10, 20 and all 38 pieces.",
  whyTitle: "Why low rank",
  whySub: "Most of a matrix lives in a few pieces",
  why: [
    ["Best", "Eckart–Young: \\(A_k\\) is the closest rank-\\(k\\) matrix, error \\(\\sigma_{k+1}\\)."],
    ["Compress", "\\(k(m + n + 1)\\) numbers instead of \\(mn\\) when the \\(\\sigma\\)'s fall fast."],
    ["PCA", "Centre, take the SVD: the main directions of the data and their shares \\(\\sigma_i^2/\\sum\\sigma_j^2\\)."],
  ],
  ctaTitle: "Ready to keep only what matters?",
  minutes: "About 60–90 minutes",
  videos: {
    [VIDEO_P1]: "Lecture 27 · Part 1 — Keep the first pieces",
    [VIDEO_P2]: "Lecture 27 · Part 2 — Principal components and low-rank updates",
  },
};

const CHAPTERS = [
  {
    slug: "1-best", nav: "Best rank k", title: "Keep the First Pieces",
    subtitle: "Eckart–Young and the error σₖ₊₁",
    abstract: "A_k = σ₁u₁v₁ᵀ + ⋯ + σₖuₖvₖᵀ is the closest rank-k matrix to A in the 2-norm and the Frobenius norm. On [2 3; 0 2] the best rank-one matrix is at distance 1; keeping a row or a column is at distance 2.",
    tags: ["A_k", "Eckart–Young", "‖A − A_k‖₂ = σₖ₊₁"],
    hero: "compress", heroCaption: "Move k: storage, share kept, errors",
    sections: [
      { id: "best", title: "The best rank-k matrix", html: String.raw`
        ${video(VIDEO_P1)}
        $$A_k = \sigma_1\mathbf u_1\mathbf v_1^\top + \cdots + \sigma_k\mathbf u_k\mathbf v_k^\top, \qquad \|A - A_k\|_2 = \sigma_{k+1}, \quad \|A - A_k\|_F^2 = \sigma_{k+1}^2 + \cdots + \sigma_r^2$$
        <p><b>Eckart–Young</b> (stated without proof): no matrix of rank \(k\) is closer to \(A\) than \(A_k\), in either norm.</p>
        ${run("keep")}` },
    ],
    takeaways: [
      "Keep the k largest pieces: the best rank k.",
      "2-norm error σₖ₊₁.",
      "Frobenius error: the root of the leftover σ².",
    ],
  },
  {
    slug: "2-picture", nav: "Picture", title: "Compressing a Picture",
    subtitle: "A sunset we drew, rank 38",
    abstract: "A 48 × 64 grey picture built from formulas has rank 38, but its singular values drop fast: 20.2, 5.0, 2.0, … Ten pieces keep 99.5% of the sum of squares from 1130 numbers instead of 3072. Pure noise keeps only 49.7%.",
    tags: ["k(m + n + 1)", "share kept", "σ² not σ"],
    hero: "compress", heroCaption: "The same picture, any k",
    sections: [
      { id: "img", title: "The picture and its pieces", html: String.raw`
        ${run("img")}
        <p>\(A_k\) stores \(k\) columns \(\mathbf u_i\), \(k\) rows \(\mathbf v_i^\top\) and \(k\) numbers \(\sigma_i\): \(k(m + n + 1) = 113k\) numbers.</p>
        ${run("table")}
        ${demo("compress", "Demo 1 · The sunset at rank k", "move k", "At k = 28 the stored numbers pass 3072: low rank only pays off when k is small.")}
        ${predict("How many pieces keep 99.9% of the sum of squares?", `<p>Twenty pieces keep 99.91%.</p>${run("share")}`)}` },
      { id: "squares", title: "Measure with σ²", html: String.raw`
        ${callout("pitfall", "PITFALL · σ OR σ²?", String.raw`<p>The sum of squared entries is \(\sum\sigma_i^2\). Measured with \(\sigma\) itself the first piece seems to keep 48.9%; it keeps 91.1%.</p>` + run("squares"))}
        <p><b>Not every matrix compresses.</b> Pure noise has slowly falling singular values:</p>
        ${run("noise")}` },
    ],
    takeaways: [
      "Fast-falling σ: good compression.",
      "Shares use σ².",
      "Noise does not compress.",
    ],
  },
  {
    slug: "3-pca", nav: "PCA", title: "Principal Component Analysis",
    subtitle: "Centre, SVD, read the directions",
    abstract: "200 made-up people: minutes of exercise and resting pulse. After centring, the first right singular vector (0.91, −0.41) carries 95% of the spread; keeping only the exercise column carries 80%. Without centring the direction points at the mean. LoRA adapts a model with a rank-8 update.",
    tags: ["centre", "explained variance", "covariance", "LoRA"],
    hero: "pca", heroCaption: "Toggle ‘centre first’",
    sections: [
      { id: "pca", title: "PCA in three steps", html: String.raw`
        ${video(VIDEO_P2)}
        ${run("data")}
        <ol><li><b>Centre</b>: \(X_c = X - \bar{\mathbf x}\).</li><li><b>SVD</b>: \(X_c = U\Sigma V^\top\); the rows of \(V^\top\) are the principal directions.</li><li><b>Shares</b> \(\sigma_i^2/\sum\sigma_j^2\); <b>scores</b> \(X_c\mathbf v_1\).</li></ol>
        ${run("pca")}
        <p>Keeping only one of the columns is also one number per person, but it carries less:</p>
        ${run("cols")}
        <p>The covariance matrix \(C = X_c^\top X_c/(n - 1)\) has the same directions, with eigenvalues \(\sigma_i^2/(n - 1)\):</p>
        ${run("cov")}
        ${callout("pitfall", "PITFALL · CENTRE FIRST", String.raw`<p>Without centring, the first singular vector points from the origin at the centre of the cloud: the direction of the mean.</p>` + run("raw"))}
        ${demo("pca", "Demo 2 · PCA on a cloud", "move the noise, toggle centring", "These points are drawn in the browser with their own random numbers, so the numbers differ a little from the note.")}` },
      { id: "lora", title: "Low-rank updates of a model", html: String.raw`
        <p>LoRA keeps a layer's \(W\) (4096 × 4096) fixed and learns \(W + BA\) with \(B\) 4096 × 8 and \(A\) 8 × 4096.</p>
        ${run("lora")}` },
    ],
    takeaways: [
      "PCA = SVD of the centred table.",
      "v₁: the longest direction; σ₁²/Σσ² its share.",
      "LoRA: a rank-r change BA.",
    ],
  },
  {
    slug: "4-practice", nav: "Practice", title: "Check, Practise, Use AI Well",
    subtitle: "Self-check, exercises, check the share",
    abstract: "Five quick questions, then the habit for explained variance: centred table, squared singular values, and agreement with the covariance eigenvalues.",
    tags: ["quiz", "exercises", "working with AI"],
    hero: "toc",
    sections: [
      { id: "quiz", title: "Check your understanding", html: String.raw`${demo("quiz", "Self-check", "five questions")}${run("cyu")}` },
      { id: "exercises", title: "Exercises", html: String.raw`
        <p>Try each exercise on paper first. <b>Hint</b> gives a nudge; <b>Full solution</b> works it through, with the code that checks every number. Stars mark the level: ★ compute or check, ★★ explain or build, ★★★ extend or combine.</p>` },
      { id: "ai", title: "Working with AI", html: String.raw`
        <p>An assistant reports that the first component explains \(\sigma_1/(\sigma_1 + \sigma_2)\) of the spread:</p>
        ${run("claim")}
        <p>It says 82% where the right share is 95%, the same as the covariance eigenvalues give. Variance is a sum of squares: use \(\sigma_i^2\), on the centred table.</p>` },
    ],
    takeaways: [
      "Centred? Squared? Matches the covariance?",
      "Error σₖ₊₁ is a free check.",
      "Store k(m + n + 1) numbers.",
    ],
  },
];
