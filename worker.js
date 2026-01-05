export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // 1. Handle CORS Preflight (OPTIONS)
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*", // Or restrict to your app domain
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
        },
      });
    }

    // 2. Get Target URL
    // Expecting: https://your-worker.dev/?target=https://blocked-site.com
    const targetUrl = url.searchParams.get("target");

    if (!targetUrl) {
      return new Response("Ghost Relay Active. Usage: /?target=<url>", { 
        status: 200,
        headers: { "Access-Control-Allow-Origin": "*" } 
      });
    }

    // 3. Prepare the Request
    // We create a new request to the target, copying the method and body
    const newRequest = new Request(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body
    });

    // 4. Fetch and Return
    try {
      const response = await fetch(newRequest);
      
      // Clone response to modify headers (Response objects are immutable)
      const newResponse = new Response(response.body, response);
      
      // Force CORS on the response
      newResponse.headers.set("Access-Control-Allow-Origin", "*");
      newResponse.headers.set("Access-Control-Expose-Headers", "*");
      
      return newResponse;
    } catch (e) {
      return new Response(`Relay Error: ${e.message}`, { status: 500 });
    }
  },
};
