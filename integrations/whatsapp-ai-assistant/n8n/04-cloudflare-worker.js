export default {
  async fetch(request, env) {
    // Meta uses GET for verification and POST for event delivery.
    const target = request.method === "GET" ? env.N8N_VERIFY_URL
      : request.method === "POST" ? env.N8N_POST_URL : null;
    if (!target) return new Response("Method not allowed", { status: 405 });
    const targetUrl = new URL(target);
    targetUrl.search = new URL(request.url).search;
    // Forward the original request body/headers without logging customer content.
    return fetch(new Request(targetUrl, request));
  }
};
