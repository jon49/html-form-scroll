let attrPrefix = "hf-scroll-",
    scrollTo = `${attrPrefix}to`,
    scrollTarget = `${attrPrefix}target`,
    focusIgnore = `hf-focus-ignore`,
    scrollIgnore = `${attrPrefix}ignore`,
    query = x => document.querySelector(x),
    w = window,
    doc = document

doc.addEventListener("hf:swap", beforeUnload)
doc.addEventListener("hf:swapped", onLoad)

let lastClick = null
w.addEventListener('click', e => {
    lastClick = e.target
})

let { attr, hasAttr } = w.htmf
let pageLocation

function beforeUnload(e) {
    let { submitter, form } = e.detail
    let active = doc.activeElement
    let target = active === doc.body ? lastClick : active
    let to = [submitter, form].map(x => attr(x, scrollTo)).find(x => x)
    let $scrollTarget = attr(target, scrollTarget)
    if ($scrollTarget) {
        target = query($scrollTarget)
    }
    pageLocation = {
        y: w.scrollY,
        to,
        // active
        a: {
            // target
            t: { y: calculateY(target), q: target },
        }
    }
}

function onLoad() {
    let focus = query("[autofocus]")
    if (focus) {
        focus.focus()
        return focus.scrollIntoView({
            behavior: "auto",
            block: "center",
            inline: "center"
        })
    }

    if (!pageLocation) return
    let { y, to, a: { t } } = pageLocation

    let scrollTo = query(to)
    if (scrollTo) {
        return scrollTo.scrollIntoView({ behavior: "smooth" })
    }

    let active
    let elY =
        (active = t.q)
            ?  t.y
        : 0
    if (!hasAttr(focusIgnore)(active)) {
        active?.focus?.()
        active?.select?.()
    }

    if (!hasAttr(scrollIgnore)(doc.body)) {
        if (active && elY) {
            // Scroll to where element was before
            w.scrollTo({
                top:
                    w.scrollY
                    // @ts-ignore
                    + calculateY(active)
                    - elY
            })
        } else {
            // Scroll to where page was before
            w.scrollTo({ top: y })
        }
    }
}

function calculateY(el) {
    return el?.getBoundingClientRect().top
}