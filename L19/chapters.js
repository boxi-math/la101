// Chapter content, adapted from notes/L19-diagonalization-powers.md. Code and outputs are copied from the note (demos.js).
// Maths is written \( … \) (inline) and $$ … $$ (display) and typeset by the vendored KaTeX (../assets/katex/).
// Section html uses String.raw so LaTeX backslashes need no doubling.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);
const video = (src) => `<div class="card video" data-video="${src}"></div>`;
const VIDEO_P1 = "media/L19-1.mp4";
const VIDEO_P2 = "media/L19-2.mp4";

const LECTURE = {
  number: 19,
  title: "Diagonalization and Powers",
  tagline: "A hundred steps ahead without taking them",
  lead: "Put the eigenvectors in X and the eigenvalues in Λ, and A = XΛX⁻¹. Then Aᵏ = XΛᵏX⁻¹: a game economy, a number sequence, a population and a recurrent network can all be read off many steps ahead, and the largest eigenvalue tells you how fast they grow.",
  heroDemo: "gameMini",
  heroLabel: "gold and gems",
  heroCaption: "The loop and the closed form (2·4ᵏ + 1)/3 agree turn after turn.",
  whyTitle: "Why diagonalize",
  whySub: "Powers, growth and stability",
  why: [
    ["Powers", "\\(A^k = X\\Lambda^kX^{-1}\\): powers of numbers instead of \\(k\\) matrix products."],
    ["Long-run behaviour", "The largest \\(|\\lambda|\\) sets the growth, its eigenvector the long-run mix (young : adults = 3 : 1)."],
    ["Networks", "A linear recurrent network explodes when an eigenvalue is above 1 in size, and vanishes when all are below."],
  ],
  ctaTitle: "Ready to skip ahead?",
  minutes: "About 60–90 minutes",
  videos: {
    [VIDEO_P1]: "Lecture 19 · Part 1 — A hundred turns ahead: A = XΛX⁻¹ and the game economy",
    [VIDEO_P2]: "Lecture 19 · Part 2 — Sequences, populations, networks; when diagonalization fails",
  },
};

const CHAPTERS = [
  {
    slug: "1-game", nav: "Game", title: "A Game Economy",
    subtitle: "Gold and gems, turn by turn",
    abstract: "Each gold coin earns 2 gold and 2 gems per turn; each gem earns 1 gold and 1 gem. The wealth grows about four-fold per turn and gold and gems become almost equal: the eigenvalues 4 and 1 explain both.",
    tags: ["uₖ₊₁ = Auₖ", "λ = 4, 1"],
    hero: "game", heroCaption: "Move the turn: loop and formula",
    sections: [
      { id: "play", title: "Playing the game", html: String.raw`
        ${video(VIDEO_P1)}
        $$g_{k+1} = 3g_k + m_k, \qquad m_{k+1} = 2g_k + 2m_k, \qquad A = \begin{bmatrix} 3 & 1 \\ 2 & 2 \end{bmatrix}$$
        ${run("play")}
        <p>Trace 5, determinant 4: \(\lambda = 4\) with \((1, 1)\) and \(\lambda = 1\) with \((1, -2)\).</p>
        ${run("eigpairs")}
        ${demo("game", "Demo 1 · Loop or formula", "move the turn", "Exact integers (BigInt): at turn 20 both give 733,007,751,851 gold.")}` },
    ],
    takeaways: [
      "One turn = one multiplication by A.",
      "λ = 4 along (1, 1): equal amounts grow four-fold.",
      "λ = 1 along (1, −2): that mix never changes.",
    ],
  },
  {
    slug: "2-diagonalize", nav: "A = XΛX⁻¹", title: "A = XΛX⁻¹",
    subtitle: "Eigenvectors in X, eigenvalues in Λ",
    abstract: "Column by column, AX = XΛ. With independent eigenvectors X is invertible, so A = XΛX⁻¹ and Aᵏ = XΛᵏX⁻¹. Split the start into eigenvectors and the closed form follows.",
    tags: ["AX = XΛ", "Aᵏ = XΛᵏX⁻¹", "closed form"],
    hero: "diag", heroCaption: "Diagonalize any 2-by-2 matrix and power it",
    sections: [
      { id: "diag", title: "Diagonalization", html: String.raw`
        $$AX = X\Lambda, \qquad X = \begin{bmatrix} 1 & 1 \\ 1 & -2 \end{bmatrix}, \quad \Lambda = \begin{bmatrix} 4 & 0 \\ 0 & 1 \end{bmatrix}, \qquad A = X\Lambda X^{-1}$$
        ${run("diag")}
        <p>In \(A^2 = X\Lambda X^{-1}X\Lambda X^{-1}\) the middle cancels: \(A^k = X\Lambda^kX^{-1}\).</p>
        ${demo("diag", "Demo 2 · Diagonalize and power", "type A; move k", "Try the shear 1 1; 0 1 and the identity 1 0; 0 1.")}
        ${predict("Swap the columns of \\(X\\) but keep \\(\\Lambda = \\operatorname{diag}(4, 1)\\). Is \\(X\\Lambda X^{-1}\\) still \\(A\\)?", `<p>No: each eigenvalue must sit where its eigenvector sits.</p>${run("swap")}`)}` },
      { id: "closed", title: "The closed form", html: String.raw`
        $$\mathbf{u}_0 = \tfrac23(1, 1) + \tfrac13(1, -2), \qquad g_k = \frac{2\cdot 4^k + 1}{3}, \quad m_k = \frac{2\cdot 4^k - 2}{3}$$
        ${run("closed")}
        ${callout("pitfall", "PITFALL · POWERING THE ENTRIES", String.raw`<p>In numpy <code>A ** 2</code> squares each entry; <code>matrix_power</code> (or <code>A @ A</code>) is the matrix power.</p>` + run("entries"))}` },
    ],
    takeaways: [
      "AX = XΛ; with independent eigenvectors, A = XΛX⁻¹.",
      "Aᵏ = XΛᵏX⁻¹: power the eigenvalues, never the entries.",
      "Same order in X and Λ.",
    ],
  },
  {
    slug: "3-uses", nav: "Uses", title: "Sequences, Populations, Networks",
    subtitle: "When it fails, and three uses",
    abstract: "Distinct eigenvalues guarantee diagonalization; the shear shows what a missing eigenvector costs. Then a recurrence aₖ₊₂ = 2aₖ₊₁ + 3aₖ, a young/adult population, and a linear recurrent network.",
    tags: ["diagonalizable", "recurrence", "growth rate"],
    hero: "pop", heroCaption: "Change births and survival rates",
    sections: [
      { id: "fail", title: "When diagonalization fails", html: String.raw`
        ${video(VIDEO_P2)}
        <p>The identity has \(\lambda = 1\) twice and is diagonal; the shear has \(\lambda = 1\) twice and one line of eigenvectors. Its powers grow like \(k\).</p>
        ${run("shear")}` },
      { id: "recur", title: "A recurrence and a population", html: String.raw`
        $$\begin{bmatrix} a_{k+2} \\ a_{k+1} \end{bmatrix} = \begin{bmatrix} 2 & 3 \\ 1 & 0 \end{bmatrix}\begin{bmatrix} a_{k+1} \\ a_k \end{bmatrix}, \qquad a_k = \frac{3^k - (-1)^k}{4}$$
        ${run("recur")}
        <p>Young \(y\) and adults \(d\): \(\begin{bmatrix} 0 & 6 \\ 0.5 & 0.5 \end{bmatrix}\), \(\lambda = 2\) with \((3, 1)\) and \(-1.5\) with \((4, -1)\).</p>
        ${run("pop")}
        ${demo("pop", "Demo 3 · A population", "move the rates")}` },
      { id: "rnn", title: "Explode or vanish", html: String.raw`
        <p>\(\mathbf{h}_{k+1} = W\mathbf{h}_k\) gives \(\mathbf{h}_k = X\Lambda^kX^{-1}\mathbf{h}_0\).</p>
        ${run("rnn")}
        ${demo("rnn", "Demo 4 · A linear recurrent network", "move the largest eigenvalue")}
        ${callout("note", "ML", `<p>Exploding and vanishing gradients face the same powers; initialisations with eigenvalues near size 1, and gating, are responses to \\(\\lambda^k\\).</p>`)}` },
    ],
    takeaways: [
      "Distinct eigenvalues ⇒ diagonalizable; a repeated one may lack eigenvectors.",
      "Recurrences and populations: powers of the eigenvalues.",
      "|λ| > 1 explodes, |λ| < 1 vanishes.",
    ],
  },
  {
    slug: "4-practice", nav: "Practice", title: "Check, Practise, Use AI Well",
    subtitle: "Self-check, exercises, check several k",
    abstract: "Five quick questions, then the habit for closed forms: compare with a loop at several values of k, not only k = 0.",
    tags: ["quiz", "exercises", "working with AI"],
    hero: "toc",
    sections: [
      { id: "quiz", title: "Check your understanding", html: String.raw`${demo("quiz", "Self-check", "five questions")}${run("cyu")}` },
      { id: "exercises", title: "Exercises", html: String.raw`
        <p>Try each exercise on paper first. <b>Hint</b> gives a nudge; <b>Full solution</b> works it through, with the code that checks every number. Stars mark the level: ★ compute or check, ★★ explain or build, ★★★ extend or combine.</p>` },
      { id: "ai", title: "Working with AI", html: String.raw`
        <p>An assistant gives \(g_k = (4^k + 2)/3\). At \(k = 0\) it is right; one turn later it is not:</p>
        ${run("claim")}
        <p>\(4^0 = 1\) hides which coefficient goes with which eigenvalue. Check a closed form at several \(k\).</p>` },
    ],
    takeaways: [
      "Test AX = XΛ column by column.",
      "Compare a closed form with a loop for k = 0, 1, 2, … 20.",
      "Distinct eigenvalues: diagonalizable.",
    ],
  },
];
