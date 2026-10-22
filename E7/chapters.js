// Chapter content, adapted from notes/E7-gaussians-weighted-least-squares.md. Code and outputs are copied from the note (demos.js).
// Maths is written \( … \) (inline) and $$ … $$ (display) and typeset by the vendored KaTeX (../assets/katex/).
// Section html uses String.raw so LaTeX backslashes need no doubling.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);
const video = (src) => `<div class="card video" data-video="${src}"></div>`;
const VIDEO_P1 = "media/E7-1.mp4";
const VIDEO_P2 = "media/E7-2.mp4";

const LECTURE = {
  number: "E7",
  id: "E7",
  label: "Elective E7",
  title: "Multivariate Gaussians and Weighted Least Squares",
  tagline: "One quadratic form with the inverse covariance",
  lead: "The exponent of a multivariate Gaussian is −½ times a quadratic form with Σ⁻¹: the squared Mahalanobis distance. Its level sets are the covariance ellipses of Lecture 23, a Cholesky factor whitens and samples, and conditioning is one step of elimination. When measurements have unequal noise, the same inverse covariance becomes the weights of least squares: AᵀWAx̂ = AᵀWb, the maximum-likelihood answer.",
  heroDemo: "mahaMini",
  heroLabel: "Same distance, different surprise",
  heroCaption: "Days on the café's covariance ellipses d = 1 and d = 2: Mahalanobis distance follows the trend; ordinary distance does not.",
  whyTitle: "Why the inverse covariance?",
  whySub: "Measure every deviation in its own units of noise",
  why: [
    ["Density", "\\(p(\\mathbf x) \\propto \\exp\\!\\big(-\\tfrac12(\\mathbf x - \\boldsymbol\\mu)^\\top\\Sigma^{-1}(\\mathbf x - \\boldsymbol\\mu)\\big)\\): ellipses along the eigenvectors of \\(\\Sigma\\)."],
    ["Whitening", "\\(\\Sigma = LL^\\top\\): sample \\(\\boldsymbol\\mu + L\\mathbf z\\), whiten \\(L^{-1}(\\mathbf x - \\boldsymbol\\mu)\\); conditional variances are pivots."],
    ["Weighted least squares", "\\(A^\\top WA\\hat{\\mathbf x} = A^\\top W\\mathbf b\\) with \\(W = \\Sigma_{\\text{noise}}^{-1}\\); precisions add."],
  ],
  ctaTitle: "Ready for Gaussians?",
  minutes: "About 60–90 minutes",
  videos: {
    [VIDEO_P1]: "Elective E7 · Part 1 — The Gaussian is a quadratic form",
    [VIDEO_P2]: "Elective E7 · Part 2 — Weighted least squares: trust each measurement by its noise",
  },
};

const CHAPTERS = [
  {
    slug: "1-density", nav: "Density", title: "The Gaussian Is a Quadratic Form",
    subtitle: "Σ⁻¹ in the exponent",
    abstract: "The bell curve in n dimensions: exp(−½ d²), with d² = (x − μ)ᵀΣ⁻¹(x − μ). For the café of Lecture 22, μ = (17, 5) and Σ = [[5, 2], [2, 2]], so Σ⁻¹ = (1/6)[[2, −2], [−2, 5]].",
    tags: ["multivariate Gaussian", "covariance", "Mahalanobis distance"],
    hero: "code:inv", heroCaption: "6Σ⁻¹ and det Σ = 6; peak density 0.065",
    sections: [
      { id: "inv", title: "The density", html: String.raw`
        ${video(VIDEO_P1)}
        $$p(\mathbf x) = \frac{1}{(2\pi)^{n/2}\sqrt{\det\Sigma}}\exp\!\Big(-\tfrac12(\mathbf x - \boldsymbol\mu)^\top\Sigma^{-1}(\mathbf x - \boldsymbol\mu)\Big).$$
        ${run("inv")}
        ${callout("pitfall", "PITFALL · Σ⁻¹, NOT Σ", `<p>In one variable the exponent divides by \\(\\sigma^2\\): a large variance must make the density fall off slowly. \\(\\Sigma\\) in the exponent would turn the ellipse the wrong way.</p>`)}` },
    ],
    takeaways: [
      "Exponent: −½ d², d² with Σ⁻¹.",
      "Σ⁻¹ positive definite: a bowl.",
      "√det Σ plays the role of σ.",
    ],
  },
  {
    slug: "2-ellipse", nav: "Ellipses", title: "Mahalanobis Distance and the Covariance Ellipse",
    subtitle: "Which day is unusual?",
    abstract: "Days (19, 6) and (15, 6) are both √5 from the mean, but d² = 5/6 and 3.5: cold and busy goes against the trend. The ellipse d = r has half-axes r√λ along the eigenvectors (√6 and 1); in 2D it holds 1 − e^(−r²/2) of the probability.",
    tags: ["Mahalanobis", "covariance ellipse", "outliers"],
    hero: "maha", heroCaption: "Move the day: its Mahalanobis and Euclidean distances.",
    sections: [
      { id: "maha", title: "Two busy days", html: String.raw`
        ${run("maha")}
        ${demo("maha", "Café days", "move the temperature and the sales")}
        ${callout("pitfall", "PITFALL · ORDINARY DISTANCE DOES NOT RANK OUTLIERS", `<p>Euclidean distance ignores the different variances and the correlation. Days A and B are equally far in it; B is four times as far in \\(d^2\\).</p>`)}` },
      { id: "ellipse", title: "The covariance ellipse", html: String.raw`
        $$\Sigma = Q\Lambda Q^\top: \quad d^2 = \frac{y_1^2}{\lambda_1} + \frac{y_2^2}{\lambda_2}, \qquad \text{half-axes } r\sqrt{\lambda_i}.$$
        ${run("ellipse")}` },
    ],
    takeaways: [
      "d² uses Σ⁻¹.",
      "Half-axes r√λ along the eigenvectors.",
      "2D: P(d ≤ r) = 1 − e^(−r²/2).",
    ],
  },
  {
    slug: "3-whiten", nav: "Whitening", title: "Whitening and Conditioning",
    subtitle: "Cholesky samples; elimination conditions",
    abstract: "Σ = LLᵀ: x = μ + Lz samples, z = L⁻¹(x − μ) whitens, and ‖z‖² = d². Knowing tomorrow is 20 °C, expected sales are 5 + (2/5)·3 = 6.2 with variance 6/5, the second pivot.",
    tags: ["Cholesky", "whitening", "Schur complement"],
    hero: "code:cond", heroCaption: "simulated 20 °C days: mean 6.18, variance 1.21; predicted 6.2 and 1.2",
    sections: [
      { id: "whiten", title: "Whitening and sampling", html: String.raw`
        $$\Sigma = LL^\top, \qquad \mathbf x = \boldsymbol\mu + L\mathbf z, \qquad \mathbf z = L^{-1}(\mathbf x - \boldsymbol\mu), \qquad \|\mathbf z\|^2 = d^2.$$
        ${run("whiten")}
        ${callout("ml", "MACHINE LEARNING", `<p>PCA whitening is a classical preprocessing step, and \\(\\mathbf x = \\boldsymbol\\mu + L\\mathbf z\\) is the reparameterisation that lets variational autoencoders train \\(\\boldsymbol\\mu\\) and \\(L\\) through a random sample.</p>`)}` },
      { id: "cond", title: "Conditioning is elimination", html: String.raw`
        $$\mathbb E[x_2 \mid x_1] = \mu_2 + \frac{\Sigma_{21}}{\Sigma_{11}}(x_1 - \mu_1), \qquad \operatorname{var}[x_2 \mid x_1] = \Sigma_{22} - \frac{\Sigma_{21}^2}{\Sigma_{11}}.$$
        ${run("cond")}
        ${predict("If Σ₂₁ = 0, what does tomorrow's temperature tell the café about sales?", "<p>Nothing: the multiplier is 0 and the conditional variance is Σ₂₂. For a Gaussian, uncorrelated means independent.</p>")}` },
    ],
    takeaways: [
      "Sample μ + Lz; whiten L⁻¹(x − μ).",
      "Multiplier Σ₂₁/Σ₁₁: regression slope.",
      "Conditional variance = pivot.",
    ],
  },
  {
    slug: "4-weights", nav: "Weights", title: "Weighted Least Squares",
    subtitle: "Weights 1/σ², and precisions add",
    abstract: "Thermometers reading 20, 21, 23 with σ = 0.5, 1, 2: weights 4, 1, ¼ give 20.33 with variance 0.19, better than the best thermometer alone. Weights 1/σ give 0.245; equal weights 0.583.",
    tags: ["weighted least squares", "precision", "Gauss–Markov"],
    hero: "wls", heroCaption: "Change the third thermometer's noise and the weighting rule.",
    sections: [
      { id: "combine", title: "Combining measurements", html: String.raw`
        ${video(VIDEO_P2)}
        $$\min_{\mathbf x}\ (\mathbf b - A\mathbf x)^\top W(\mathbf b - A\mathbf x) \;\Longrightarrow\; A^\top WA\,\hat{\mathbf x} = A^\top W\mathbf b, \qquad W = \Sigma_{\text{noise}}^{-1}.$$
        ${run("combine")}
        ${demo("wls", "Three thermometers", "move the third σ and the weighting")}
        ${callout("pitfall", "PITFALL · 1/σ², NOT 1/σ", `<p>The residual divided by \\(\\sigma_i\\) is what gets squared, so the weight is \\(1/\\sigma_i^2\\). Weights \\(1/\\sigma\\) give variance 0.245 instead of 0.190.</p>`)}` },
    ],
    takeaways: [
      "Weight = 1/σ² = precision.",
      "Precisions add.",
      "cov x̂ = (AᵀWA)⁻¹.",
    ],
  },
  {
    slug: "5-line", nav: "Line fit", title: "Fitting a Line with Unequal Noise",
    subtitle: "Whitening the residuals; maximum likelihood",
    abstract: "Readings with σ growing from 0.2 to 2: ordinary least squares gives 0.64 + 2.32t, weighted 1.02 + 1.93t. Both are unbiased, but the weighted slope has spread 0.185 against 0.415. Under Gaussian noise, weighted least squares is maximum likelihood.",
    tags: ["generalised least squares", "whitening", "maximum likelihood"],
    hero: "code:line", heroCaption: "ordinary (0.64, 2.32) vs weighted (1.0152, 1.934)",
    sections: [
      { id: "line", title: "Ordinary and weighted fits", html: String.raw`
        ${run("line")}
        ${run("whitenrows")}
        <p>Dividing each row of \(A\) and \(\mathbf b\) by \(\sigma_i\) makes the noise white; ordinary least squares on the scaled problem is the weighted fit. For correlated noise, multiply by \(L^{-1}\).</p>
        ${run("sim")}` },
      { id: "mle", title: "Why 1/σ²: maximum likelihood", html: String.raw`
        $$\log p(\mathbf b \mid \mathbf x) = -\tfrac12(\mathbf b - A\mathbf x)^\top\Sigma_{\text{noise}}^{-1}(\mathbf b - A\mathbf x) + \text{const}.$$
        ${callout("ml", "MACHINE LEARNING", `<p>Mean squared error is maximum likelihood under equal Gaussian noise. A model that predicts a mean \\(m\\) and a variance \\(v\\) minimises \\(\\tfrac12\\big((y - m)^2/v + \\log v\\big)\\): weighted least squares with learned weights.</p>`)}
        ${callout("note", "PATTERN", `<p>One quadratic form with \\(\\Sigma^{-1}\\), four jobs: the density, the Mahalanobis distance, the length after whitening, and the loss of weighted least squares.</p>`)}` },
    ],
    takeaways: [
      "Whiten, then ordinary least squares.",
      "Unbiased either way; weighted is more precise.",
      "Weighted LS = maximum likelihood.",
    ],
  },
  {
    slug: "6-practice", nav: "Practice", title: "Check, Practise, Use AI Well",
    subtitle: "Self-check, exercises, and a one-triangle trap",
    abstract: "Five quick questions, the exercises, and why a non-symmetric 'covariance' can be factored without any warning.",
    tags: ["quiz", "exercises", "working with AI"],
    hero: "toc",
    sections: [
      { id: "quiz", title: "Check your understanding", html: String.raw`${demo("quiz", "Self-check", "five questions")}` },
      { id: "exercises", title: "Exercises", html: String.raw`
        <p>Try each exercise on paper first. <b>Hint</b> gives a nudge; <b>Full solution</b> works it through, with the code that checks every number. Stars mark the level: ★ compute or check, ★★ explain or build, ★★★ extend or combine.</p>` },
      { id: "ai", title: "Working with AI", html: String.raw`
        <p><code>numpy.linalg.cholesky</code> uses only one triangle and does not check symmetry. A covariance typed as \(\left[\begin{smallmatrix} 5 & 2 \\ 0 & 2 \end{smallmatrix}\right]\) is factored as \(\operatorname{diag}(5, 2)\), and the samples come out uncorrelated:</p>
        ${run("claim")}
        <p>Check <code>np.allclose(S, S.T)</code> first.</p>` },
    ],
    takeaways: [
      "Σ⁻¹ in the exponent.",
      "μ + Lz, not μ + Σz.",
      "Weights 1/σ².",
    ],
  },
];
