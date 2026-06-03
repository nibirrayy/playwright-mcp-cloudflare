import { env } from 'cloudflare:workers';

import { createMcpAgent } from '@cloudflare/playwright-mcp';

export const PlaywrightMCP = createMcpAgent(env.BROWSER);

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const auth = request.headers.get('authorization');
    if (auth !== `Bearer ${env.MCP_TOKEN}`) {
      return new Response('Unauthorized', { status: 401 });
    }
    const { pathname }  = new URL(request.url);

    switch (pathname) {
      case '/sse':
      case '/sse/message':
        return PlaywrightMCP.serveSSE('/sse').fetch(request, env, ctx);
      case '/mcp':
        return PlaywrightMCP.serve('/mcp').fetch(request, env, ctx);
      default:
        return new Response('Not Found', { status: 404 });
    }
  },
};
