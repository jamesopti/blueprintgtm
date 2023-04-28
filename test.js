addEventListener("fetch", (event) => {
    event.respondWith(
        handleRequest(event.request).catch(
            (err) => new Response(err.stack, { status: 500 })
        )
    );
});

const MARKETING_SITE_BASE_URL = "https://www.gammadoc.com"

/**
 * @param {Request} request
 * @returns {Promise<Response>}
 */
async function handleRequest(request) {
    const { pathname, search  } = new URL(request.url);
    const loggedInCookie = getCookie(request, COOKIE_NAME) === 'true'

    const marketingSiteDestinationURL = MARKETING_SITE_BASE_URL + pathname + search
    if (pathname === "/" && !loggedInCookie) {
        return fetch(marketingSiteDestinationURL);
    }
    // Fetch from Vercel ...
    const requestHeaders = Object.fromEntries(request.headers)
    const isProduction = requestHeaders.host === 'gamma.app'
    const prodDestinationURL = PRODUCTION_APP_BASE_URL + pathname + search
    const stagingDestinationURL = STAGING_APP_BASE_URL + pathname + search

    const finalURL = isProduction ? prodDestinationURL : stagingDestinationURL

    const finalRequest = new Request(finalURL, new Request(request))

    return fetch(finalRequest)
}


  