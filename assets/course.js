// LA101 course info and footer. Every page loads this before app.js, so app.js has no course name hard-coded.
// Pattern from peiyuAIForAll/site/assets/course.js.

const COURSE = {
  code: "LA101",
  name: "LA101 Linear Algebra",
  short: "Linear Algebra",
  credit: "培玉智能 · Boxi Yu",
  creditEn: "Peiyu AI · Boxi Yu",
  checked: "Every number and every result in these notes is checked by running code.",
  inspired: `Inspired by Gilbert Strang's MIT 18.06 (<a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/" target="_blank" rel="noopener">MIT OpenCourseWare</a>).`,
  animations: `Animations made with open-source tools from animind-ai (<a href="https://github.com/animind-ai" target="_blank" rel="noopener">https://github.com/animind-ai</a>): rendered with <a href="https://github.com/animind-ai/moxian" target="_blank" rel="noopener">animind-ai/moxian</a>, colours from <a href="https://github.com/animind-ai/palette" target="_blank" rel="noopener">animind-ai/palette</a> (both MIT). Maths typeset with <a href="https://katex.org/" target="_blank" rel="noopener">KaTeX</a> (MIT).`,
  themeKey: "la101-theme",
};

// The lectures and electives that are live (site/PUBLISHED); app.js links "Lecture N" / "elective EN" only to
// these. Written by la101/tools/site_build.py: don't edit by hand.
const LIVE = ["L01", "L02", "L03", "L04", "L05", "L06", "L07", "L08", "L09", "L10", "L11", "L12", "L13", "L14", "L15", "L16", "L17", "L18", "L19", "L20", "L21", "L22", "L23", "L24", "L25", "L26", "L27", "L28", "L29", "L30", "E1", "E2", "E3", "E4", "E5", "E6", "E7"];  // site_build.py, from site/PUBLISHED

// Our own course: Peiyu branding is allowed. Content CC BY-SA 4.0 except the Peiyu name, logo and trademarks
// (see LICENSE-NOTE.md); code MIT. The logo files may go into the published site (user decision 2026-10-20,
// replacing the earlier rule that kept them out); they stay all rights reserved.
function renderFooter(root = "") {
  const f = document.querySelector("footer");
  if (!f) return;
  f.innerHTML = `<div class="wrap">
    <p>${COURSE.name} · ${COURSE.checked}</p>
    <p class="credit">
      <img class="logo-light" src="${root}assets/peiyu-logo.svg" alt="Peiyu AI logo" width="18" height="18">
      <img class="logo-dark" src="${root}assets/peiyu-logo-white.svg" alt="Peiyu AI logo" width="18" height="18">
      <span><b>${COURSE.credit}</b> (${COURSE.creditEn}) · Content licensed
      <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener license">CC BY-SA 4.0</a>
      (the Peiyu name, logo and trademarks excluded, all rights reserved) · Code MIT</span>
    </p>
    <p class="fine">${COURSE.inspired}</p>
    <p class="fine">${COURSE.animations}</p>
  </div>`;
}
