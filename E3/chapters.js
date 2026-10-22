// Chapter content, adapted from notes/E3-flows-games.md. Code and outputs are copied from the note (demos.js).
// Maths is written \( … \) (inline) and $$ … $$ (display) and typeset by the vendored KaTeX (../assets/katex/).
// Section html uses String.raw so LaTeX backslashes need no doubling.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);
const video = (src) => `<div class="card video" data-video="${src}"></div>`;
const VIDEO_P1 = "media/E3-1.mp4";
const VIDEO_P2 = "media/E3-2.mp4";

const LECTURE = {
  number: "E3",
  id: "E3",
  label: "Elective E3",
  title: "Network Flows and Zero-Sum Games",
  tagline: "Bottlenecks, mixed strategies and minimax",
  lead: "A bakery sends vans to a market through three depots. Conservation at every depot is the linear equation Aᵀf = 0 with the incidence matrix of Lecture 11; every flow is at most every cut, and augmenting paths find a flow of 8 that meets the smallest cut. Then a driver and an inspector play a zero-sum game: no pure choice is safe, the optimal mix comes from a small linear system, and von Neumann's minimax theorem says the two guarantees meet.",
  heroDemo: "flowMini",
  heroLabel: "flow equals cut",
  heroCaption: "Line widths show the flow on each road; the red roads cross the minimum cut around {s, a, b}, and their capacities add up to the maximum flow 8.",
  whyTitle: "Why flows and games?",
  whySub: "Two faces of the same duality",
  why: [
    ["Conservation", "\\(A^\\top\\mathbf f = \\mathbf 0\\) at the inner nodes: flows live in the nullspace of \\(A^\\top\\) (with a return road)."],
    ["Max flow = min cut", "The best flow is limited exactly by the narrowest cut, which names the bottleneck."],
    ["Minimax", "\\(\\max_{\\mathbf x}\\min_{\\mathbf y}\\mathbf x^\\top G\\mathbf y = \\min_{\\mathbf y}\\max_{\\mathbf x}\\mathbf x^\\top G\\mathbf y\\): mixing closes the gap."],
  ],
  ctaTitle: "Ready to find the bottleneck?",
  minutes: "About 60–90 minutes",
  videos: {
    [VIDEO_P1]: "Elective E3 · Part 1 — Flows, cuts and the bottleneck",
    [VIDEO_P2]: "Elective E3 · Part 2 — Zero-sum games and the minimax theorem",
  },
};

const CHAPTERS = [
  {
    slug: "1-flows", nav: "Flows", title: "Flows Through a Network",
    subtitle: "Capacities, conservation and Aᵀf",
    abstract: "Seven one-way roads from the bakery s to the market t. The flow f = (4, 4, 1, 3, 1, 4, 4) gives Aᵀf = (−8, 0, 0, 0, 8): every depot balances, and 8 vans per hour arrive. Numbers within the capacities are not enough: 6 on s → a and 2 on a → b pile vans up at a and b.",
    tags: ["incidence matrix", "Aᵀf = 0", "capacities"],
    hero: "flow", heroCaption: "Change the capacities and watch the flow",
    sections: [
      { id: "network", title: "Conservation", html: String.raw`
        ${video(VIDEO_P1)}
        <p>With the incidence matrix \(A\) (one row per road, \(-1\) at its start, \(+1\) at its end), \(A^\top\mathbf f\) lists arrivals minus departures at every node.</p>
        ${run("network")}
        ${predict("The roads out of the bakery could carry 6 + 4 = 10. Can a cleverer flow move 10 vans per hour?", "<p>No. Every van crosses the line around {s, a, b}, and the roads crossing it outwards carry at most 3 + 1 + 4 = 8.</p>")}
        ${callout("pitfall", "PITFALL · NOT EVERY ASSIGNMENT IS A FLOW", "<p>Within the capacities, but vans pile up at a and b:</p>" + run("pile"))}` },
    ],
    takeaways: [
      "Aᵀf = arrivals − departures.",
      "A flow: 0 ≤ f ≤ c and Aᵀf = 0 inside.",
      "Capacities alone are not enough.",
    ],
  },
  {
    slug: "2-cuts", nav: "Cuts", title: "Cuts and Maximum Flows",
    subtitle: "Every flow is at most every cut",
    abstract: "Of the eight cuts, S = {s, a, b} is smallest, with capacity 8: max flow = min cut. Breadth-first augmenting paths sbt +4, sact +3, sabct +1 reach 8 and find the cut. In a second network, greedily filling the long path stops at 3; the maximum is 5, and the residual path uses a → b backwards. With a return road, flows are the 8 − 5 + 1 = 4-dimensional nullspace of Aᵀ.",
    tags: ["min cut", "augmenting paths", "backward edges", "loops"],
    hero: "flow", heroCaption: "Try the greedy trap",
    sections: [
      { id: "cuts", title: "Cuts", html: String.raw`
        $$\text{value of any flow} \;\le\; \text{capacity of any cut}$$
        ${run("cuts")}` },
      { id: "paths", title: "Augmenting paths", html: String.raw`
        <p>In the <b>residual network</b> a road can be used forwards if it has spare capacity, and backwards if it carries flow that can be cancelled. Shortest path first (Edmonds–Karp):</p>
        ${run("maxflow")}
        ${callout("pitfall", "PITFALL · GREEDY IS NOT ENOUGH", "<p>Filling the long path s → a → b → t first leaves no forward path; only the backward use of a → b reaches the maximum 5.</p>" + run("greedy"))}
        ${demo("flow", "Demo 1 · Maximum flow and minimum cut", "edit the capacities or pick a network", "Teal nodes are still reachable from s when the search stops: they form the minimum cut.")}` },
      { id: "loops", title: "Loops and the nullspace", html: String.raw`
        ${run("loops")}
        <p>The capacities cut a bounded region out of the 4-dimensional loop space, and the maximum flow is a corner of it: a linear program (E2).</p>` },
    ],
    takeaways: [
      "Max flow = min cut.",
      "Residual paths may run backwards.",
      "The min cut names the bottleneck.",
    ],
  },
  {
    slug: "3-games", nav: "Games", title: "Zero-Sum Games and the Minimax Theorem",
    subtitle: "Mixed strategies from a linear system",
    abstract: "Driver against inspector, G = [−2 3; 1 −1]: pure strategies give max min = −1 and min max = 1. Mixing North with p = 2/7 guarantees 1/7, and the inspector's q = 4/7 holds the driver to 1/7: the value. 50–50 can be exploited (−0.5). Uneven rock–paper–scissors is played (1/3, 1/6, 1/2): the biggest prize, paper's, is played least.",
    tags: ["saddle point", "mixed strategies", "value 1/7", "minimax"],
    hero: "game", heroCaption: "Move p and follow the lower envelope",
    sections: [
      { id: "pure", title: "Pure and mixed strategies", html: String.raw`
        ${video(VIDEO_P2)}
        ${run("pure")}
        $$\text{checks North: } 1 - 3p, \qquad \text{checks South: } 4p - 1 \quad\Rightarrow\quad p = 2/7$$
        ${run("mix")}
        ${callout("pitfall", "PITFALL · 50–50 IS NOT SAFE", run("half"))}
        ${demo("game", "Demo 2 · The driver's guarantee", "move p, or type another 2-by-2 game", "Try 3 1; 5 2: a saddle point, no mixing needed.")}` },
      { id: "minimax", title: "Minimax and a linear system", html: String.raw`
        $$\max_{\mathbf x}\min_{\mathbf y}\ \mathbf x^\top G\mathbf y = \min_{\mathbf y}\max_{\mathbf x}\ \mathbf x^\top G\mathbf y = v$$
        <p>When the optimal mix uses every row, \(G^\top\mathbf x = v\mathbf 1\) and \(x_1 + \cdots + x_m = 1\): a square system.</p>
        ${run("equalise")}
        ${predict("Uneven rock–paper–scissors: rock wins 1, scissors 2, paper 3. How often should you play paper?", `<p>Least often: 1/6.</p>${run("rps")}`)}
        ${demo("mix", "Demo 3 · Equalising mixes", "type a payoff matrix and a mix", "Fractions like 1/6 are allowed in the mix.")}
        ${callout("ml", "MACHINE LEARNING · GAMES AND FLOWS", "<p>GANs train on a minimax objective, adversarial training plays against the worst perturbation, and assignment problems and optimal transport are flow problems.</p>")}` },
    ],
    takeaways: [
      "No saddle point: whoever is predictable loses.",
      "Equalise the opponent's options.",
      "Mixing closes the max-min gap.",
    ],
  },
  {
    slug: "4-practice", nav: "Practice", title: "Check, Practise, Use AI Well",
    subtitle: "Self-check, exercises, test a strategy claim",
    abstract: "Five quick questions, then the habit for game advice: ask what the opponent does in reply, not what the average is.",
    tags: ["quiz", "exercises", "working with AI"],
    hero: "toc",
    sections: [
      { id: "quiz", title: "Check your understanding", html: String.raw`${demo("quiz", "Self-check", "five questions")}${run("cyu")}` },
      { id: "exercises", title: "Exercises", html: String.raw`
        <p>Try each exercise on paper first. <b>Hint</b> gives a nudge; <b>Full solution</b> works it through, with the code that checks every number. Stars mark the level: ★ compute or check, ★★ explain or build, ★★★ extend or combine.</p>` },
      { id: "ai", title: "Working with AI", html: String.raw`
        <p>An assistant averages each row of the driver's table (North 0.5, South 0) and advises “always take North”.</p>
        ${run("claim")}
        <p>Averages assume the inspector chooses at random. A predictable driver on North is checked every time and loses 2 per trip; the mix \((2/7, 5/7)\) secures \(+1/7\).</p>` },
    ],
    takeaways: [
      "Ask for the opponent's best reply.",
      "Check a flow with Aᵀf.",
      "Small cases first.",
    ],
  },
];
