export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // --- SECURITY CONFIGURATION ---
    // Change this to your production domain. 
    // This stops random scanners from using your proxy.
    const ALLOWED_ORIGIN = "https://www.room-39.com";
    
    // Common Headers Helper
    const corsHeaders = {
      "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
    };

    // 1. Handle CORS Preflight (OPTIONS)
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders,
      });
    }

    // 2. Get Target URL
    const targetUrl = url.searchParams.get("target");

    if (!targetUrl) {
      return new Response("Ghost Relay Active. Waiting for target...", { 
        status: 200,
        headers: corsHeaders // Restricts who can see this message
      });
    }

    // 3. Prepare the Request
    const newRequest = new Request(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body
    });

    // 4. Fetch and Return
    try {
      const response = await fetch(newRequest);
      
      // Clone response to modify headers
      const newResponse = new Response(response.body, response);
      
      // Force Strict CORS on the response
      newResponse.headers.set("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
      newResponse.headers.set("Access-Control-Expose-Headers", "*");
      
      return newResponse;
    } catch (e) {
      return new Response(`Relay Error: ${e.message}`, { 
          status: 500,
          headers: corsHeaders 
      });
    }
  },
};
