import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isbot } from 'isbot';

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const country = request.headers.get('x-vercel-ip-country') || 'US';
  const userAgent = request.headers.get('user-agent') || '';
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

  // Helper to log telemetry asynchronously without crashing the main routing request
  const logHit = async (routeTaken: string, botStatus: boolean) => {
    try {
      await fetch(new URL('/api/logs', request.url).toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ip,
          country,
          device: /Mobile|Android|iPhone/i.test(userAgent) ? 'mobile' : 'desktop',
          routeTaken,
          isBot: botStatus
        }),
        cache: 'no-store'
      });
    } catch (e) {
      console.error('[Proxy] Telemetry fetch failed:', e);
    }
  };

  // --- Campaign Set External Routing (/go/:slug) ---
  if (pathname.startsWith('/go/')) {
    const slug = pathname.replace('/go/', '');
    
    try {
      const apiUrl = new URL('/api/campaigns', request.url);
      const res = await fetch(apiUrl.toString(), { next: { revalidate: 10 } });
      
      if (res.ok) {
        const campaigns = await res.json();
        const campaign = campaigns.find((c: any) => c.slug === slug);

        if (campaign) {
          const detectedBot = isbot(userAgent);
          // Required tracking parameters
          const hasValidParams = searchParams.has('clid') || searchParams.has('ad_id') || searchParams.has('utm_source');

          const isHumanVerifiable = !detectedBot && hasValidParams;
          const targetExternalUrl = isHumanVerifiable ? campaign.moneyUrl : campaign.cloakUrl;

          // Telemetry
          await logHit(`CAMP_${slug.toUpperCase()}_${isHumanVerifiable ? 'MONEY' : 'CLOAK'}`, detectedBot);

          // We use a classic 302 redirect for maximum tracking reliability
          return NextResponse.redirect(targetExternalUrl);
        }
      }
    } catch (error) {
      console.error('[Proxy] Failed to route campaign:', error);
    }

    await logHit('CAMP_NOT_FOUND', false);
    return new NextResponse('Campaign Not Found', { status: 404 });
  }

  // --- SHORT-LINK /R/ ROUTING RULES ---
  // (Preserved from legacy routing system)
  if (pathname.startsWith('/r/')) {
    const isBot = /bot|crawler|spider|crawling/i.test(userAgent);
    if (isBot) {
      await logHit('BOT_BLOCKED', true);
      return new NextResponse('Access Denied', { status: 403 });
    }
    try {
      const apiUrl = new URL('/api/rules', request.url);
      const response = await fetch(apiUrl.toString(), { next: { revalidate: 10 } });
      if (response.ok) {
        const activeRules = await response.json();
        for (const rule of activeRules) {
          if (!rule.isActive) continue;
          let conditions = [];
          try { conditions = JSON.parse(rule.conditions); } catch (e) {}

          let matched = true;
          for (const cond of conditions) {
            let reqValue = '';
            if (cond.param === 'country') reqValue = country;
            else if (cond.param === 'device.type') reqValue = /Mobile|Android|iPhone/i.test(userAgent) ? 'mobile' : 'desktop';
            else if (cond.param === 'ip') reqValue = ip;

            if (cond.operator === '==') { if (reqValue !== cond.value) matched = false; }
            else if (cond.operator === '!=') { if (reqValue === cond.value) matched = false; }
            else if (cond.operator === 'contains') { if (!reqValue.includes(cond.value)) matched = false; }
          }
          if (matched) {
            let action = { type: 'Redirect', target: '/' };
            try { action = JSON.parse(rule.action); } catch (e) {}
            await logHit(`RULE_MATCH_${rule.name}`, false);

            if (action.type === 'Block') return new NextResponse('Blocked by Routing Rule', { status: 403 });
            else if (action.type === 'Rewrite') return NextResponse.rewrite(new URL(action.target, request.url));
            else if (action.type === 'Redirect') {
              const redirectUrl = action.target.startsWith('http') ? action.target : new URL(action.target, request.url).toString();
              return NextResponse.redirect(redirectUrl);
            }
          }
        }
      }
    } catch (error) {
       console.error('[Proxy] Failed to evaluate rules:', error);
    }
    await logHit('DEFAULT_FALLBACK', false);
    return new NextResponse('Route not found or no matching rule.', { status: 404 });
  }

  return NextResponse.next();
}

export const config = { matcher: ['/go/:path*', '/r/:path*'] };
