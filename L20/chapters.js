// Chapter content, adapted from notes/L20-differential-equations.md. Code and outputs are copied from the note (demos.js).
// Maths is written \( … \) (inline) and $$ … $$ (display) and typeset by the vendored KaTeX (../assets/katex/).
// Section html uses String.raw so LaTeX backslashes need no doubling.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);
const video = (src) => `<div class="card video" data-video="${src}"></div>`;
const VIDEO_P1 = "media/L20-1.mp4";
const VIDEO_P2 = "media/L20-2.mp4";

const LECTURE = {
  number: 20,
  title: "Differential Equations and e^(At)",
  tagline: "Systems that grow, decay or swing",
  lead: "When du/dt = Au, each eigenvector gives a solution e^(λt)x that keeps its direction. Negative eigenvalues decay, positive ones grow, complex ones swing. Two rooms cooling, a spring, the matrix exponential, and gradient descent as small steps along a flow.",
  heroDemo: "roomsMini",
  heroLabel: "two rooms cooling",
  heroCaption: "Room 1 starts at 10°, room 2 at 0°: room 2 warms up first, then both cool like e^(−2t).",
  whyTitle: "Why eigenvalues decide",
  whySub: "Decay, growth, oscillation",
  why: [
    ["Solutions", "\\(\\mathbf u(t) = c_1e^{\\lambda_1t}\\mathbf x_1 + c_2e^{\\lambda_2t}\\mathbf x_2\\), with \\(\\mathbf c = X^{-1}\\mathbf u(0)\\)."],
    ["Stability", "Stable when every eigenvalue has negative real part; for 2-by-2, trace &lt; 0 and determinant &gt; 0."],
    ["Training", "Gradient descent is Euler's method for gradient flow: the largest curvature eigenvalue limits the learning rate."],
  ],
  ctaTitle: "Ready to follow the flow?",
  minutes: "About 60–90 minutes",
  videos: {
    [VIDEO_P1]: "Lecture 20 · Part 1 — Two rooms cooling: eigen-solutions and Euler steps",
    [VIDEO_P2]: "Lecture 20 · Part 2 — Stability, springs, e^(At) and gradient flow",
  },
};

const CHAPTERS = [
  {
    slug: "1-rooms", nav: "Rooms", title: "Two Rooms Cooling",
    subtitle: "du/dt = Au and its eigen-solutions",
    abstract: "Two rooms share a wall; room 1 starts 10 degrees warmer than outside, room 2 at the outside temperature. The eigenvalues −2 and −4 split the answer into a slow common cooling and a fast evening-out.",
    tags: ["du/dt = Au", "e^(λt)x", "Euler's method"],
    hero: "rooms", heroCaption: "Move the time; compare with Euler steps",
    sections: [
      { id: "setup", title: "The model", html: String.raw`
        ${video(VIDEO_P1)}
        $$\frac{dT_1}{dt} = -2T_1 - (T_1 - T_2), \qquad \frac{dT_2}{dt} = -2T_2 - (T_2 - T_1), \qquad A = \begin{bmatrix} -3 & 1 \\ 1 & -3 \end{bmatrix}$$
        <p>Trace \(-6\), determinant 8: \(\lambda = -2\) with \((1, 1)\) (equal rooms only lose heat outside) and \(\lambda = -4\) with \((1, -1)\) (a difference also flows through the wall).</p>
        ${run("setup")}` },
      { id: "solve", title: "Eigen-solutions", html: String.raw`
        <p>If \(A\mathbf x = \lambda\mathbf x\), then \(\frac{d}{dt}(e^{\lambda t}\mathbf x) = \lambda e^{\lambda t}\mathbf x = A(e^{\lambda t}\mathbf x)\). From \((10, 0) = 5(1, 1) + 5(1, -1)\):</p>
        $$\mathbf T(t) = 5e^{-2t}(1, 1) + 5e^{-4t}(1, -1)$$
        <p><b>Euler's method</b> follows the equation in small steps \(\mathbf T \leftarrow \mathbf T + hA\mathbf T\) and agrees with the formula:</p>
        ${run("euler")}
        ${demo("rooms", "Demo 1 · Formula or small steps", "move t and h", "Try h above 0.5: the fast factor 1 − 4h drops below −1.")}
        <p>Room 2 is warmest at \(t = \tfrac12\ln 2\), about 21 minutes:</p>
        ${run("peak")}
        ${callout("pitfall", "PITFALL · FORGETTING THE START", String.raw`<p>\(e^{-2t}(1, 1)\) and \(e^{-4t}(1, -1)\) are solutions, but neither starts at \((10, 0)\). The coefficients \(X^{-1}\mathbf T(0)\) make the answer fit. Always check \(\mathbf u(0)\).</p>`)}` },
    ],
    takeaways: [
      "Each eigenvector gives a solution e^(λt)x.",
      "Coefficients c = X⁻¹u(0): check the start.",
      "Euler steps check any formula.",
    ],
  },
  {
    slug: "2-stability", nav: "Stability", title: "Stability and Oscillation",
    subtitle: "Decay, growth, steady state, swing",
    abstract: "Negative eigenvalues decay, positive ones grow, zero stays. Without outside walls the rooms settle at the average; a heater makes them blow up; a spring swings with λ = ±i, and friction makes the swing die.",
    tags: ["stable", "steady state", "λ = a ± bi"],
    hero: "stab", heroCaption: "Type a 2-by-2 matrix: stable or not?",
    sections: [
      { id: "stable", title: "Stability", html: String.raw`
        ${video(VIDEO_P2)}
        <p>No outside walls: \(B = \begin{bmatrix} -1 & 1 \\ 1 & -1 \end{bmatrix}\), \(\lambda = 0\) and \(-2\). The difference dies and both rooms settle at the average, 5 degrees.</p>
        ${run("nowall")}
        ${predict("Room 1 gets a heater: \\(dT_1/dt = T_1 - (T_1 - T_2)\\), room 2 as before. Stable or not?", `<p>Determinant \(-1 < 0\): the eigenvalues have opposite signs, one is about \(+0.30\). Unstable.</p>${run("heater")}`)}
        ${demo("stab", "Demo 2 · Stable or not", "type A or pick one", "For 2-by-2: stable exactly when trace &lt; 0 and determinant &gt; 0.")}` },
      { id: "spring", title: "Oscillation", html: String.raw`
        $$y'' = -y: \quad \frac{d}{dt}\begin{bmatrix} y \\ y' \end{bmatrix} = \begin{bmatrix} 0 & 1 \\ -1 & 0 \end{bmatrix}\begin{bmatrix} y \\ y' \end{bmatrix}, \quad \lambda = \pm i$$
        <p>Real part 0: \(y = \cos t\) swings forever. With friction, \(\begin{bmatrix} 0 & 1 \\ -2 & -2 \end{bmatrix}\) has \(\lambda = -1 \pm i\): it swings and the swings shrink like \(e^{-t}\), \(y = e^{-t}(\cos t + \sin t)\).</p>
        ${run("spring")}` },
    ],
    takeaways: [
      "λ < 0 decays, λ > 0 grows, λ = 0 stays.",
      "Complex λ = a ± bi: b swings, a decides growth or decay.",
      "2-by-2 stable: trace < 0, determinant > 0.",
    ],
  },
  {
    slug: "3-exponential", nav: "e^(At)", title: "The Matrix Exponential and Gradient Flow",
    subtitle: "e^(At) = Xe^(Λt)X⁻¹, and learning rates",
    abstract: "The series I + At + (At)²/2! + ⋯ solves du/dt = Au for every start, and equals Xe^(Λt)X⁻¹ — never the exponential of each entry. Gradient descent on a quadratic loss is Euler's method for dw/dt = −Hw.",
    tags: ["e^(At)", "expm", "gradient flow", "learning rate"],
    hero: "gd", heroCaption: "Move the learning rate",
    sections: [
      { id: "series", title: "The matrix exponential", html: String.raw`
        $$e^{At} = I + At + \frac{(At)^2}{2!} + \cdots = Xe^{\Lambda t}X^{-1}$$
        ${run("series")}
        ${demo("expm", "Demo 3 · The series", "move t and the number of terms")}
        ${callout("pitfall", "PITFALL · ENTRY BY ENTRY", String.raw`<p><code>np.exp(A * t)</code> exponentiates each entry; use <code>scipy.linalg.expm</code> or the eigen-formula.</p>` + run("entrywise"))}` },
      { id: "flow", title: "Gradient flow", html: String.raw`
        $$\frac{d\mathbf w}{dt} = -H\mathbf w, \qquad H = \begin{bmatrix} 5.5 & 4.5 \\ 4.5 & 5.5 \end{bmatrix}, \quad \lambda = 10, 1$$
        <p>Gradient descent \(\mathbf w \leftarrow (I - \eta H)\mathbf w\) has factors \(1 - 10\eta\) and \(1 - \eta\): it converges only for \(\eta < 0.2\).</p>
        ${run("gd")}
        ${demo("gd", "Demo 4 · Learning rate", "move η", "The steepest direction limits η; the flattest sets the speed.")}` },
    ],
    takeaways: [
      "e^(At) = Xe^(Λt)X⁻¹, not entry by entry.",
      "Gradient descent = Euler steps on gradient flow.",
      "η below 2/λ_max.",
    ],
  },
  {
    slug: "4-practice", nav: "Practice", title: "Check, Practise, Use AI Well",
    subtitle: "Self-check, exercises, check t = 0",
    abstract: "Five quick questions, then the habit for solutions of differential equations: put t = 0 in, and take a few Euler steps.",
    tags: ["quiz", "exercises", "working with AI"],
    hero: "toc",
    sections: [
      { id: "quiz", title: "Check your understanding", html: String.raw`${demo("quiz", "Self-check", "five questions")}${run("cyu")}` },
      { id: "exercises", title: "Exercises", html: String.raw`
        <p>Try each exercise on paper first. <b>Hint</b> gives a nudge; <b>Full solution</b> works it through, with the code that checks every number. Stars mark the level: ★ compute or check, ★★ explain or build, ★★★ extend or combine.</p>` },
      { id: "ai", title: "Working with AI", html: String.raw`
        <p>An assistant answers \(\mathbf T(t) = 5e^{-2t}(1, 1) - 5e^{-4t}(1, -1)\). Every term is an eigen-solution, but at \(t = 0\):</p>
        ${run("claim")}
        <p>All the heat is in room 2. Check \(t = 0\), then a few Euler steps.</p>` },
    ],
    takeaways: [
      "Check u(0) first.",
      "Compare with Euler steps.",
      "Name the eigenvalue that limits stability.",
    ],
  },
];
