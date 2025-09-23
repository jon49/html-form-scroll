(() => {
  let attrPrefix = "hf-scroll-";
  let miss = `${attrPrefix}miss`;
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
    let { submitter, form } = e.detail.submitter;
    let active = doc.activeElement;
    let target = active === doc.body ? lastClick : active;
    let to = [submitter, form].find((x) => attr(x, scrollTo));
    let $scrollTarget = attr(target, scrollTarget);
    if ($scrollTarget) {
      target = query($scrollTarget);
    }
    let miss2 = attr(target?.closest(`[${miss2}]`), miss2);
    let name = attr(target, "name");
    pageLocation = {
      y: w.scrollY,
      to,
      // active
      a: {
        // target
        t: { y: calculateY(target), q: target?.id && `#${target.id}` || name && `[name="${name}"]` },
        // miss
        m: { y: calculateY(query(miss2)), q: miss2 }
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
    let { y, to, a: { t, m } } = pageLocation;
    let scrollTo2 = query(to);
    if (scrollTo2) {
      return scrollTo2.scrollIntoView({ behavior: "smooth" });
    }
    let active;
    let elY = t.q && (active = query(t.q)) ? t.y : m.q && (active = query(m.q)) ? m.y : 0;
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
