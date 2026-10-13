import worker from '../worker/index.js';

// Vercel rewrites carry the original endpoint separately from the function URL.
// Preserve query filters and the incoming custom-domain origin for calendar links.
export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.searchParams.get('__calendar_path');
    if (path) url.pathname = path;
    url.searchParams.delete('__calendar_path');
    return worker.fetch(new Request(url, request));
  }
};
