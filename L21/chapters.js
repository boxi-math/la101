// Chapter content, adapted from notes/L21-markov.md. Code and outputs are copied from the note (demos.js).
// Maths is written \( … \) (inline) and $$ … $$ (display) and typeset by the vendored KaTeX (../assets/katex/).
// Section html uses String.raw so LaTeX backslashes need no doubling.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);
const video = (src) => `<div class="card video" data-video="${src}"></div>`;
const VIDEO_P1 = "media/L21-1.mp4";
const VIDEO_P2 = "media/L21-2.mp4";

const LECTURE = {
  number: 21,
  title: "Markov Matrices and Steady States",
  tagline: "Where things settle, and how fast",
  lead: "A Markov matrix moves a distribution without changing its total. λ = 1 is always an eigenvalue, and its eigenvector is the steady state. Two bike stations, chains that never settle, and a six-page web ranked by the random-surfer idea behind PageRank, computed by power iteration.",
  heroDemo: "bikesMini",
  heroLabel: "two bike stations",
  heroCaption: "All bikes start at the market; day by day the split settles at 60 : 40.",
  whyTitle: "Why λ = 1 matters",
  whySub: "Steady states and their speed",
  why: [
    ["Steady state", "\\(P\\mathbf v = \\mathbf v\\): the eigenvector for \\(\\lambda = 1\\), scaled to total 1."],
    ["Speed", "\\(|\\lambda_2|\\) sets how fast every start approaches it; positive entries guarantee it is reached."],
    ["Ranking", "PageRank is the steady state of a random surfer; power iteration finds it with only the links."],
  ],
  ctaTitle: "Ready to settle down?",
  minutes: "About 60–90 minutes",
  videos: {
    [VIDEO_P1]: "Lecture 21 · Part 1 — Where the bikes settle: Markov matrices and P v = v",
    [VIDEO_P2]: "Lecture 21 · Part 2 — Chains that never settle, PageRank and power iteration",
  },
};

const CHAPTERS = [
  {
    slug: "1-bikes", nav: "Bikes", title: "Two Bike Stations",
    subtitle: "A Markov matrix, day by day",
    abstract: "Each day 20% of the market's bikes are ridden to the beach and 30% of the beach's bikes come back. The columns of P add to 1, the total never changes, and the split settles near 60 : 40.",
    tags: ["Markov matrix", "uₖ₊₁ = Puₖ"],
    hero: "bikes", heroCaption: "Change the rates, the start and the day",
    sections: [
      { id: "bikes", title: "The model", html: String.raw`
        ${video(VIDEO_P1)}
        $$\mathbf u_{k+1} = P\mathbf u_k, \qquad P = \begin{bmatrix} 0.8 & 0.3 \\ 0.2 & 0.7 \end{bmatrix}$$
        <p>Column 1 says where the market's bikes go, column 2 where the beach's go. Entries \(\ge 0\) and columns adding to 1: a <b>Markov matrix</b>.</p>
        ${run("bikes")}
        ${demo("bikes", "Demo 1 · Bikes day by day", "move the sliders", "Try a = b = 1: every bike swaps station every day.")}` },
      { id: "steady", title: "The steady state", html: String.raw`
        $$P\mathbf v = \mathbf v: \quad 0.2v_1 = 0.3v_2, \quad \mathbf v = (0.6, 0.4); \qquad \mathbf u_k = (0.6, 0.4) + 0.4\cdot(0.5)^k(1, -1)$$
        <p>The flows balance: \(0.2\cdot 0.6 = 0.12\) leave the market, \(0.3\cdot 0.4 = 0.12\) come back. numpy's eigenvector has length 1: divide by its sum.</p>
        ${run("steady")}
        ${callout("pitfall", "PITFALL · ROWS OR COLUMNS?", String.raw`<p>With rows adding to 1 the matrix is \(P^\top\), and the steady state is a <b>left</b> eigenvector.</p>` + run("rows"))}` },
    ],
    takeaways: [
      "Markov: entries ≥ 0, columns add to 1.",
      "Steady state: Pv = v, scaled to total 1.",
      "λ₂ = 0.5: the distance halves each day.",
    ],
  },
  {
    slug: "2-why-one", nav: "λ = 1", title: "Why λ = 1, and When It Fails",
    subtitle: "Perron–Frobenius, swings and splits",
    abstract: "The rows of P − I add up to zero, so λ = 1 always appears and no eigenvalue is larger in size. With positive entries every start reaches one steady state; zeros can make a chain swing (λ = −1) or split into parts (λ = 1 twice).",
    tags: ["λ = 1", "|λ| ≤ 1", "periodic", "split"],
    hero: "markov", heroCaption: "Type a 2-by-2 matrix: Markov? Steady state?",
    sections: [
      { id: "one", title: "Why λ = 1 always appears", html: String.raw`
        <p>Adding the rows of \(P - I\) gives (column sum) \(- 1 = 0\) in each column, so \(P - I\) is singular. Each column spreads its entry without creating any, so \(|\lambda| \le 1\). With <b>all entries positive</b> (Perron–Frobenius, stated without proof) the steady state is unique and every start converges.</p>
        ${run("random")}
        ${predict("A third station opens: a 3-by-3 \\(P\\) with positive entries and columns adding to 1. How many eigenvalues equal 1? What happens to any start?", `<p>Exactly one; the others have size below 1, so every start converges to the unique steady state.</p>${run("three")}`)}
        ${demo("markov", "Demo 2 · Markov or not", "type P or pick one", "The 'rows add to 1' button is the transposed bikes matrix: not Markov in our convention.")}` },
      { id: "never", title: "Chains that never settle", html: String.raw`
        ${video(VIDEO_P2)}
        <p><b>Periodic:</b> the swap \(\begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}\) has \(\lambda = \pm 1\); from \((1, 0)\) it alternates forever. <b>Split:</b> two separate pairs of stations give \(\lambda = 1\) twice, and the start decides the end.</p>
        ${run("never")}` },
    ],
    takeaways: [
      "λ = 1 always; |λ| ≤ 1 always.",
      "Positive entries: one steady state, every start converges.",
      "Zeros: λ = −1 swings, λ = 1 twice splits.",
    ],
  },
  {
    slug: "3-pagerank", nav: "PageRank", title: "PageRank and Power Iteration",
    subtitle: "Ranking a six-page web",
    abstract: "A random surfer follows a link with probability d = 0.85 and otherwise jumps to a random page. The Google matrix has all entries positive; its steady state ranks the pages, and repeated multiplication finds it.",
    tags: ["random surfer", "G = dM + (1−d)J/n", "power iteration"],
    hero: "rank", heroCaption: "Move d and the number of steps",
    sections: [
      { id: "web", title: "The mini-web", html: String.raw`
        <p>Links: page 1 → 2, 3; page 2 → 3; page 3 → 1; page 4 → 3, 5; page 5 → 4, 6; page 6 → 5.</p>
        $$G = d\,M + \frac{1 - d}{n}\,J, \qquad d = 0.85,\ n = 6$$
        ${run("web")}
        <p>Page 3 ranks first: three pages link to it. Page 1 is second with only one incoming link, because that link comes from page 3, whose only link points to page 1.</p>` },
      { id: "power", title: "Power iteration", html: String.raw`
        <p>Start uniform and multiply by \(G\) again and again; every other part shrinks by its \(|\lambda| < 1\).</p>
        ${run("power")}
        ${demo("rank", "Demo 3 · PageRank", "move d and the steps; add a link", "Adding 3 → 4 drops page 1 to about 0.127 (exercise 4).")}` },
    ],
    takeaways: [
      "Jumps make every entry positive.",
      "PageRank = steady state of G.",
      "Power iteration: error × |λ₂| ≤ d per step.",
    ],
  },
  {
    slug: "4-practice", nav: "Practice", title: "Check, Practise, Use AI Well",
    subtitle: "Self-check, exercises, check Pv = v",
    abstract: "Five quick questions, then the habit for steady states: state the convention, then check Pv = v, not only the total.",
    tags: ["quiz", "exercises", "working with AI"],
    hero: "toc",
    sections: [
      { id: "quiz", title: "Check your understanding", html: String.raw`${demo("quiz", "Self-check", "five questions")}${run("cyu")}` },
      { id: "exercises", title: "Exercises", html: String.raw`
        <p>Try each exercise on paper first. <b>Hint</b> gives a nudge; <b>Full solution</b> works it through, with the code that checks every number. Stars mark the level: ★ compute or check, ★★ explain or build, ★★★ extend or combine.</p>` },
      { id: "ai", title: "Working with AI", html: String.raw`
        <p>An assistant mixes up the stations and answers \((0.4, 0.6)\). The total is 1, but:</p>
        ${run("claim")}
        <p>\(P(0.4, 0.6) = (0.5, 0.5)\): not steady. It is the steady state of the chain with the stations swapped. State the convention, then check \(P\mathbf v = \mathbf v\).</p>` },
    ],
    takeaways: [
      "Total 1 is not enough: check Pv = v.",
      "Say whether rows or columns add to 1.",
      "Divide numpy's eigenvector by its sum.",
    ],
  },
];
