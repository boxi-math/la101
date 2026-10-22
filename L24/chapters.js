// Chapter content, adapted from notes/L24-complex-matrices-fft.md. Code and outputs are copied from the note (demos.js).
// Maths is written \( … \) (inline) and $$ … $$ (display) and typeset by the vendored KaTeX (../assets/katex/).
// Section html uses String.raw so LaTeX backslashes need no doubling.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);
const video = (src) => `<div class="card video" data-video="${src}"></div>`;
const VIDEO_P1 = "media/L24-1.mp4";
const VIDEO_P2 = "media/L24-2.mp4";

const LECTURE = {
  number: 24,
  title: "Complex Matrices and the Fast Fourier Transform",
  tagline: "Conjugate first; then split even from odd",
  lead: "Complex vectors need the conjugate: the length of z is √(zᴴz). With it, Hermitian matrices have real eigenvalues, unitary matrices keep lengths, and the Fourier matrix has orthogonal columns that split a signal into frequencies. The FFT computes the same transform in n/2 log₂ n steps, and because Fourier vectors diagonalize every circulant, convolution becomes multiplication.",
  heroDemo: "dftMini",
  heroLabel: "Samples and frequencies",
  heroCaption: "A constant, a slow cosine, a spike, a bright bar and the fastest alternation.",
  whyTitle: "Why complex matrices and the FFT",
  whySub: "Signals, images and convolutions",
  why: [
    ["Conjugate", "\\(\\|\\mathbf z\\|^2 = \\mathbf z^{\\mathsf H}\\mathbf z\\); Hermitian \\(A^{\\mathsf H} = A\\): real \\(\\lambda\\); unitary \\(U^{\\mathsf H}U = I\\): \\(|\\lambda| = 1\\)."],
    ["Fourier matrix", "\\((F_n)_{jk} = w^{jk}\\), \\(F_n^{\\mathsf H}F_n = nI\\), \\(F_n^{-1} = \\bar F_n/n\\)."],
    ["FFT and convolution", "\\(\\frac n2\\log_2 n\\) multiplications; \\(\\mathbf c \\circledast \\mathbf x = \\) ifft(fft(c) · fft(x))."],
  ],
  ctaTitle: "Ready for complex numbers and the FFT?",
  minutes: "About 60–90 minutes",
  videos: {
    [VIDEO_P1]: "Lecture 24 · Part 1 — Complex vectors and the Fourier matrix",
    [VIDEO_P2]: "Lecture 24 · Part 2 — The fast Fourier transform and convolution",
  },
};

const CHAPTERS = [
  {
    slug: "1-complex", nav: "Complex", title: "Complex Vectors and Matrices",
    subtitle: "Length, Hermitian and unitary",
    abstract: "zᵀz can be zero for a nonzero z. The conjugate fixes length and inner products, and gives the complex versions of symmetric and orthogonal matrices.",
    tags: ["conjugate transpose", "Hermitian", "unitary"],
    hero: "code:length", heroCaption: "z = (1, i): zᵀz = 0 but zᴴz = 2",
    sections: [
      { id: "length", title: "Length of a complex vector", html: String.raw`
        ${video(VIDEO_P1)}
        $$\|\mathbf z\|^2 = \mathbf z^{\mathsf H}\mathbf z = |z_1|^2 + \dots + |z_n|^2, \qquad \mathbf z^{\mathsf H} = \bar{\mathbf z}^\top.$$
        ${run("length")}
        <p>In NumPy, <code>np.vdot</code> conjugates its first argument; <code>@</code> does not.</p>` },
      { id: "hermitian", title: "Hermitian matrices", html: String.raw`
        $$A = \begin{bmatrix} 2 & 1 - i \\ 1 + i & 3 \end{bmatrix} = A^{\mathsf H}: \quad \lambda = 1,\ 4.$$
        ${run("hermitian")}
        ${callout("pitfall", "PITFALL · FORGETTING THE CONJUGATE", `<p>\\(\\mathbf x_1^{\\mathsf H}\\mathbf x_2 = 0\\), but \\(\\mathbf x_1^\\top\\mathbf x_2 = -2 - 2i\\): without the conjugate, orthogonal eigenvectors look non-orthogonal.</p>`)}` },
      { id: "unitary", title: "Unitary matrices", html: String.raw`
        ${run("unitary")}
        <p>The rotation by 90° is unitary: eigenvalues \(\pm i\), eigenvectors \((1, \mp i)/\sqrt2\), orthonormal once conjugated.</p>` },
    ],
    takeaways: [
      "Lengths and inner products: zᴴ.",
      "Hermitian: real λ, orthogonal x.",
      "Unitary: |λ| = 1, lengths kept.",
    ],
  },
  {
    slug: "2-fourier", nav: "Fourier", title: "The Fourier Matrix",
    subtitle: "Orthogonal columns that turn around the circle",
    abstract: "Entry (j, k) is w^{jk} with w = e^{2πi/n}. The columns are orthogonal, so the inverse is the conjugate divided by n, and multiplying by it splits a signal into frequencies.",
    tags: ["roots of unity", "DFT", "NumPy sign"],
    hero: "dft", heroCaption: "Move the eight samples: watch the frequencies.",
    sections: [
      { id: "f4", title: "F₄", html: String.raw`
        $$F_4 = \begin{bmatrix} 1 & 1 & 1 & 1 \\ 1 & i & -1 & -i \\ 1 & -1 & 1 & -1 \\ 1 & -i & -1 & i \end{bmatrix}, \qquad F_n^{\mathsf H}F_n = nI.$$
        ${run("f4")}` },
      { id: "signal", title: "Splitting a signal", html: String.raw`
        <p>Readings \((2, 1, 0, 1)\) every hour of a four-hour cycle: \(\mathbf c = \frac14\bar F_4\mathbf x = (1, \frac12, 0, \frac12)\), an average of 1 plus a slow cosine.</p>
        ${run("signal")}
        ${demo("dft", "Frequencies of eight samples", "move the samples")}` },
      { id: "sign", title: "NumPy's sign", html: String.raw`
        ${run("sign")}
        ${callout("pitfall", "PITFALL · TWO CONVENTIONS", `<p><code>numpy.fft.fft</code> uses \\(e^{-2\\pi i/n}\\): it computes \\(\\bar F_n\\mathbf x\\) with no \\(\\frac1n\\), and <code>ifft</code> divides by \\(n\\). Check the sign before comparing a book's formula with code.</p>`)}` },
    ],
    takeaways: [
      "F_n: w^{jk}, orthogonal columns.",
      "F⁻¹ = F̄ / n.",
      "NumPy: e^{−2πi/n}.",
    ],
  },
  {
    slug: "3-fft", nav: "FFT", title: "The Fast Fourier Transform",
    subtitle: "Even and odd, again and again",
    abstract: "A transform of size n is two of size n/2 plus n/2 multiplications. log₂ n levels give n/2 log₂ n — the same numbers, about 100,000 times faster for a million samples.",
    tags: ["FFT", "recursion", "cost"],
    hero: "code:cost", heroCaption: "1024 samples: 5,120 multiplications instead of 1,048,576",
    sections: [
      { id: "split", title: "The split", html: String.raw`
        ${video(VIDEO_P2)}
        $$y_k = e_k + w^k o_k, \qquad y_{k+n/2} = e_k - w^k o_k \qquad (w^{k + n/2} = -w^k).$$
        ${run("fft")}` },
      { id: "cost", title: "The cost", html: String.raw`
        ${run("cost")}
        ${callout("pitfall", "PITFALL · FAST IS NOT APPROXIMATE", `<p>The recursive FFT agrees with <code>np.fft.fft</code> (and with \\(F_n\\mathbf x\\)) to rounding error: it is the same multiplication, organized so that most of the work is shared.</p>`)}` },
    ],
    takeaways: [
      "Split even/odd: two half-size transforms.",
      "n/2 log₂ n multiplications.",
      "Exact, not approximate.",
    ],
  },
  {
    slug: "4-convolution", nav: "Convolution", title: "Machine Learning: Circulants and Convolution",
    subtitle: "Fourier vectors diagonalize every circulant",
    abstract: "A circular blur is a circulant matrix; its eigenvectors are the Fourier columns and its eigenvalues are the FFT of its first column. Convolution becomes an entry-by-entry product.",
    tags: ["circulant", "convolution", "CNN"],
    hero: "blur", heroCaption: "Change the centre weight: the blurred bar and the eigenvalues.",
    sections: [
      { id: "blur", title: "A blur in a loop", html: String.raw`
        ${run("blur")}
        ${demo("blur", "Circular blur", "move the centre weight")}
        ${callout("ml", "MACHINE LEARNING", `<p>Convolutional layers slide small filters across images; long convolutions in audio and some sequence models are computed with the rule \\(\\mathbf c \\circledast \\mathbf x = \\) ifft(fft(\\(\\mathbf c\\)) · fft(\\(\\mathbf x\\))). Pad with zeros first: without padding the product wraps around.</p>`)}` },
    ],
    takeaways: [
      "Circulant = F Λ F⁻¹.",
      "Eigenvalues = fft(first column).",
      "Pad before convolving.",
    ],
  },
  {
    slug: "5-practice", nav: "Practice", title: "Check, Practise, Use AI Well",
    subtitle: "Self-check, exercises, and checking a claimed transform",
    abstract: "Five quick questions, the exercises, and the sign-and-scale check that explains a claimed fft of a spike.",
    tags: ["quiz", "exercises", "working with AI"],
    hero: "toc",
    sections: [
      { id: "quiz", title: "Check your understanding", html: String.raw`${demo("quiz", "Self-check", "five questions")}` },
      { id: "exercises", title: "Exercises", html: String.raw`
        <p>Try each exercise on paper first. <b>Hint</b> gives a nudge; <b>Full solution</b> works it through, with the code that checks every number. Stars mark the level: ★ compute or check, ★★ explain or build, ★★★ extend or combine.</p>` },
      { id: "ai", title: "Working with AI", html: String.raw`
        <p>A claimed <code>fft</code> of the spike \((0, 1, 0, 0)\) is \((1, i, -1, -i)/4\). It matches neither NumPy's sign nor its scale; it is the conjugate with <code>norm="forward"</code>:</p>
        ${run("claim")}` },
    ],
    takeaways: [
      "Check the sign convention.",
      "Check the 1/n.",
      "Compare with np.fft on a spike.",
    ],
  },
];
