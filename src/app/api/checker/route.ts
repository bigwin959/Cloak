import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ status: 'offline', error: 'No URL provided' }, { status: 400 });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // 8 second timeout

    // We do a lightweight fetch to check if the network/DNS resolves and server responds.
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ITRS-Domain-Checker',
        'Accept': 'text/html,application/xhtml+xml',
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeout);

    // If the server replies, it's technically online, even if it's a 403 Forbidden.
    return NextResponse.json({ 
      status: 'online',
      statusCode: res.status 
    });

  } catch (error: any) {
    // Things like DNS_PROBE_FINISHED_NXDOMAIN or timeouts will fall here
    return NextResponse.json({ 
      status: 'offline',
      error: error.message || 'Connection failed' 
    });
  }
}
