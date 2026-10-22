// Chapter content, adapted from notes/E6-kronecker-tensors-subspaces.md. Code and outputs are copied from the note (demos.js).
// Maths is written \( … \) (inline) and $$ … $$ (display) and typeset by the vendored KaTeX (../assets/katex/).
// Section html uses String.raw so LaTeX backslashes need no doubling.

const demo = (name, title, instr, hint = "") =>
  `<div class="card demo" data-demo="${name}"><div class="head"><span class="title">${title}</span><span>${instr}</span></div>
   <div class="demo-body"></div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;

const callout = (kind, label, body) => `<div class="callout ${kind}"><b>${label}</b>${body}</div>`;
const predict = (q, a) => callout("predict", "PREDICT", `<p>${q}</p><details class="reveal"><summary>Show the answer</summary>${a}</details>`);
const video = (src) => `<div class="card video" data-video="${src}"></div>`;
const VIDEO_P1 = "media/E6-1.mp4";
const VIDEO_P2 = "media/E6-2.mp4";

const LECTURE = {
  number: "E6",
  id: "E6",
  label: "Elective E6",
  title: "Kronecker Products, Tensors and Sums of Subspaces",
  tagline: "Big structures from small pieces",
  lead: "The Kronecker product A ⊗ B puts a scaled copy of B in every entry of A. With vec, which stacks columns, it turns matrix equations such as AX + XB = C into ordinary systems and builds the grid Laplacian from the line, with eigenvalues that simply add. Then two more ways to combine: sums and intersections of subspaces, with dim(V + W) = dim V + dim W − dim(V ∩ W), and arrays with three indices, their unfoldings, rank-one pieces and contractions.",
  heroDemo: "gridMini",
  heroLabel: "Grid eigenvalues = sums of line eigenvalues",
  heroCaption: "The eigenvalues of K ⊗ I + I ⊗ K on an n × n grid are all the sums λᵢ + λⱼ of the n line eigenvalues.",
  whyTitle: "Why Kronecker products?",
  whySub: "Compute with the small pieces, never the big matrix",
  why: [
    ["Mixed product rule", "\\((A \\otimes B)(C \\otimes D) = AC \\otimes BD\\): inverses, transposes and eigenvalues factor."],
    ["vec", "\\(\\operatorname{vec}(AXB) = (B^\\top \\otimes A)\\operatorname{vec}X\\) turns matrix equations into systems."],
    ["Dimensions", "\\(\\dim(V + W) = \\dim V + \\dim W - \\dim(V \\cap W)\\); tensors unfold into matrices."],
  ],
  ctaTitle: "Ready to build big from small?",
  minutes: "About 60–90 minutes",
  videos: {
    [VIDEO_P1]: "Elective E6 · Part 1 — Kronecker products: matrices made of matrices",
    [VIDEO_P2]: "Elective E6 · Part 2 — Sums of subspaces, and arrays with more indices",
  },
};

const CHAPTERS = [
  {
    slug: "1-kronecker", nav: "Kronecker", title: "The Kronecker Product",
    subtitle: "Blocks aᵢⱼB and the mixed product rule",
    abstract: "A ⊗ B is the block matrix [aᵢⱼB]; B ⊗ A has the same entries rearranged. One rule, (A ⊗ B)(C ⊗ D) = AC ⊗ BD, gives inverses and transposes.",
    tags: ["Kronecker product", "block matrices", "mixed product rule"],
    hero: "code:kron", heroCaption: "[[1, 2], [3, 4]] ⊗ [[0, 1], [1, 1]]",
    sections: [
      { id: "kron", title: "A matrix of scaled copies", html: String.raw`
        ${video(VIDEO_P1)}
        $$A \otimes B = \begin{bmatrix} a_{11}B & \cdots & a_{1n}B \\ \vdots & & \vdots \\ a_{m1}B & \cdots & a_{mn}B \end{bmatrix}\ (mp \times nq).$$
        ${run("kron")}` },
      { id: "rules", title: "One rule does the work", html: String.raw`
        $$(A \otimes B)(C \otimes D) = AC \otimes BD, \qquad (A \otimes B)^{-1} = A^{-1} \otimes B^{-1}, \qquad (A \otimes B)^\top = A^\top \otimes B^\top.$$
        ${run("rules")}
        <p>Sizes multiply: two \(100 \times 100\) matrices give \(10^8\) entries. The rules let us work with the factors.</p>` },
    ],
    takeaways: [
      "A ⊗ B = [aᵢⱼB].",
      "(A ⊗ B)(C ⊗ D) = AC ⊗ BD.",
      "Never form the big matrix if the rules suffice.",
    ],
  },
  {
    slug: "2-vec", nav: "vec", title: "vec and Matrix Equations",
    subtitle: "vec(AXB) = (Bᵀ ⊗ A) vec X",
    abstract: "Stacking columns turns AXB into a matrix–vector product with Bᵀ ⊗ A, not A ⊗ B. NumPy stacks rows by default. The Sylvester equation AX + XB = C becomes a 4 × 4 system.",
    tags: ["vec", "column-major", "Sylvester equation"],
    hero: "vec", heroCaption: "Change X: the right factor matches, the tempting one does not.",
    sections: [
      { id: "vec", title: "Stack the columns", html: String.raw`
        $$\operatorname{vec}(AXB) = (B^\top \otimes A)\operatorname{vec}X.$$
        ${run("vec")}
        ${demo("vec", "vec(AXB)", "move the entries of X")}
        ${callout("pitfall", "PITFALL · NUMPY FLATTENS ROWS", `<p><code>X.flatten()</code> stacks rows; then the identity reads \\(\\operatorname{vec}_{\\text{row}}(AXB) = (A \\otimes B^\\top)\\operatorname{vec}_{\\text{row}}X\\). Use <code>order="F"</code> for columns.</p>`)}
        ${run("rowmajor")}` },
      { id: "sylv", title: "Solving AX + XB = C", html: String.raw`
        $$(I \otimes A + B^\top \otimes I)\operatorname{vec}X = \operatorname{vec}C.$$
        ${run("sylv")}
        <p>Unique exactly when no eigenvalue of \(A\) is minus an eigenvalue of \(B\) (chapter 3).</p>` },
    ],
    takeaways: [
      "Column stacking: Bᵀ ⊗ A.",
      "Row stacking: A ⊗ Bᵀ.",
      "Matrix equations become systems.",
    ],
  },
  {
    slug: "3-eigen", nav: "Eigenvalues", title: "Eigenvalues Multiply and Add",
    subtitle: "Kronecker sums and the grid Laplacian",
    abstract: "A ⊗ B has eigenvalues λᵢμⱼ; the Kronecker sum A ⊗ I + I ⊗ B has λᵢ + μⱼ. The grid Laplacian is K ⊗ I + I ⊗ K: 2, 4, 4, 6 for the 2 × 2 grid.",
    tags: ["Kronecker sum", "grid Laplacian", "fast Poisson solver"],
    hero: "grid", heroCaption: "Grid size n: the n² eigenvalues are all sums of n line eigenvalues.",
    sections: [
      { id: "eig", title: "Products and sums", html: String.raw`
        $$(A \otimes B)(\mathbf x \otimes \mathbf y) = \lambda\mu\,(\mathbf x \otimes \mathbf y), \qquad (A \otimes I + I \otimes B)(\mathbf x \otimes \mathbf y) = (\lambda + \mu)(\mathbf x \otimes \mathbf y).$$
        ${run("kreig")}
        ${run("grid")}
        ${demo("grid", "Grid Laplacian", "move the grid size n")}
        ${callout("ml", "MACHINE LEARNING", `<p>K-FAC approximates a layer's curvature matrix by a Kronecker product \\(G \\otimes A\\) of two small matrices and applies \\(G^{-1} \\otimes A^{-1}\\) through the vec identity, never forming the large matrix.</p>`)}` },
    ],
    takeaways: [
      "Eigenvalues of A ⊗ B: products.",
      "Of the Kronecker sum: sums.",
      "Grid Laplacian = K ⊕ K.",
    ],
  },
  {
    slug: "4-subspaces", nav: "Subspaces", title: "Sums and Intersections of Subspaces",
    subtitle: "dim(V + W) = dim V + dim W − dim(V ∩ W)",
    abstract: "Two planes in ℝ³ fill ℝ³ and share the line through (1, 1, 2): 3 = 2 + 2 − 1. The intersection comes from the nullspace of [V −W]. Dimensions add only for direct sums.",
    tags: ["sum", "intersection", "direct sum"],
    hero: "planes", heroCaption: "Turn the normal of W: its intersection with V and the dimension formula.",
    sections: [
      { id: "planes", title: "Two planes", html: String.raw`
        ${video(VIDEO_P2)}
        ${run("planes")}
        ${demo("planes", "Two planes through 0", "move the normal vector of W")}
        ${callout("pitfall", "PITFALL · DIMENSIONS ADD ONLY FOR DIRECT SUMS", `<p>The \\(xy\\)-plane plus the line through \\((1, 1, 0)\\): \\(2 + 1 = 3\\), but the line lies in the plane, so the sum is only the plane.</p>`)}
        ${run("krank")}
        <p>Ranks multiply for Kronecker products: \(\operatorname{rank}(A \otimes B) = \operatorname{rank}A \cdot \operatorname{rank}B\).</p>` },
    ],
    takeaways: [
      "V + W: both bases together.",
      "V ∩ W: nullspace of [V −W].",
      "Direct sum: V ∩ W = {0}.",
    ],
  },
  {
    slug: "5-tensors", nav: "Tensors", title: "Arrays with Three Indices",
    subtitle: "Slices, unfoldings, rank-one pieces, contractions",
    abstract: "Ratings by 2 users × 3 films × 2 seasons, built from a 'taste' piece and a 'season 2 is better' piece. Every unfolding has rank 2. Contractions such as einsum('ufs,s->uf') and batched attention scores generalise the matrix product.",
    tags: ["tensor", "unfolding", "einsum"],
    hero: "code:tensor", heroCaption: "Two slices of T: seasons 1 and 2",
    sections: [
      { id: "tensor", title: "Slices and rank-one pieces", html: String.raw`
        $$T = \mathbf a_1 \circ \mathbf b_1 \circ \mathbf c_1 + \mathbf a_2 \circ \mathbf b_2 \circ \mathbf c_2, \qquad (\mathbf a \circ \mathbf b \circ \mathbf c)_{ijk} = a_ib_jc_k.$$
        ${run("tensor")}
        ${run("unfold")}
        ${callout("pitfall", "PITFALL · TENSOR RANK IS NOT A MATRIX RANK", `<p>There is no elimination algorithm for the smallest number of rank-one terms; unfolding ranks only give lower bounds.</p>`)}` },
      { id: "contract", title: "Contractions", html: String.raw`
        ${run("contract")}
        ${run("attn")}
        ${callout("ml", "MACHINE LEARNING", `<p>Attention scores \\(S_{bij} = \\sum_d Q_{bid}K_{bjd}\\): the batch index is kept, \\(d\\) is summed — one \\(QK^\\top\\) per example.</p>`)}` },
    ],
    takeaways: [
      "Unfold to use matrix tools.",
      "Rank-one pieces a ∘ b ∘ c.",
      "A missing einsum label is summed.",
    ],
  },
  {
    slug: "6-practice", nav: "Practice", title: "Check, Practise, Use AI Well",
    subtitle: "Self-check, exercises, and an einsum trap",
    abstract: "Five quick questions, the exercises, and why einsum without '->' can silently transpose.",
    tags: ["quiz", "exercises", "working with AI"],
    hero: "toc",
    sections: [
      { id: "quiz", title: "Check your understanding", html: String.raw`${demo("quiz", "Self-check", "five questions")}` },
      { id: "exercises", title: "Exercises", html: String.raw`
        <p>Try each exercise on paper first. <b>Hint</b> gives a nudge; <b>Full solution</b> works it through, with the code that checks every number. Stars mark the level: ★ compute or check, ★★ explain or build, ★★★ extend or combine.</p>` },
      { id: "ai", title: "Working with AI", html: String.raw`
        <p>In implicit mode (no <code>-&gt;</code>), <code>einsum</code> orders the output axes alphabetically, so renaming a letter can transpose the result:</p>
        ${run("claim")}
        <p>Always write the output labels.</p>` },
    ],
    takeaways: [
      "Match the formula to the flattening order.",
      "Test with a non-symmetric B.",
      "Write '->' in every einsum.",
    ],
  },
];
