
export function routeHandler(url) {
    if (url.pathname === "/items/") {
        let item = `<div>One</div>`
        return new Response(item.repeat(10), {
            headers: {
                "Content-Type": "text/html"
            }
        })
    }
}
