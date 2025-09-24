(() => {
  let attrPrefix = "hf-scroll-";
  let scrollTo = `${attrPrefix}to`;
  let scrollTarget = `${attrPrefix}target`;
  let focusIgnore = `hf-focus-ignore`;
  let scrollIgnore = `${attrPrefix}ignore`;
  let query = (x) => document.querySelector(x);
  let w = window;
  let doc = document;
  doc.addEventListener("hf:swap", beforeUnload);
  doc.addEventListener("hf:swapped", onLoad);
  let lastClick = null;
  w.addEventListener("click", (e) => {
    lastClick = e.target;
  });
  let { attr, hasAttr } = w.htmf;
  let pageLocation;
  function beforeUnload(e) {
    let { submitter, form } = e.detail;
    let active = doc.activeElement;
    let target = active === doc.body ? lastClick : active;
    let to = [submitter, form].map((x) => attr(x, scrollTo)).find((x) => x);
    let $scrollTarget = attr(target, scrollTarget);
    if ($scrollTarget) {
      target = query($scrollTarget);
    }
    pageLocation = {
      y: w.scrollY,
      to,
      // active
      a: {
        // target
        t: { y: calculateY(target), q: target }
      }
    };
  }
  function onLoad() {
    let focus = query("[autofocus]");
    if (focus) {
      focus.focus();
      return focus.scrollIntoView({
        behavior: "auto",
        block: "center",
        inline: "center"
      });
    }
    if (!pageLocation) return;
    let { y, to, a: { t } } = pageLocation;
    let scrollTo2 = query(to);
    if (scrollTo2) {
      return scrollTo2.scrollIntoView({ behavior: "smooth" });
    }
    let active;
    let elY = (active = t.q) ? t.y : 0;
    if (!hasAttr(focusIgnore)(active)) {
      active?.focus?.();
      active?.select?.();
    }
    if (!hasAttr(scrollIgnore)(doc.body)) {
      if (active && elY) {
        w.scrollTo({
          top: w.scrollY + calculateY(active) - elY
        });
      } else {
        w.scrollTo({ top: y });
      }
    }
  }
  function calculateY(el) {
    return el?.getBoundingClientRect().top;
  }
})();
