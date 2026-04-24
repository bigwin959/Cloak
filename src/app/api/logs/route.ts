import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate payload
    if (!body.ip || typeof body.isBot !== 'boolean' || !body.routeTaken) {
      return NextResponse.json({ error: 'Invalid log payload' }, { status: 400 });
    }

    // Hash the IP address for privacy rendering / compliance
    const ipHash = crypto.createHash('sha256').update(body.ip).digest('hex').substring(0, 16);

    const newLog = await prisma.log.create({
      data: {
        ipHash,
        country: body.country || 'Unknown',
        device: body.device || 'Unknown',
        routeTaken: body.routeTaken,
        isBot: body.isBot
      }
    });

    return NextResponse.json({ success: true, logId: newLog.id }, { status: 201 });
  } catch (error) {
    console.error('Failed to ingest log:', error);
    return NextResponse.json({ error: 'Failed to ingest log' }, { status: 500 });
  }
}

export async function GET() {
  // A simple endpoint to get raw log tails if ever needed outside the dashboard UI
  try {
    const logs = await prisma.log.findMany({
      take: 50,
      orderBy: { timestamp: 'desc' }
    });
    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve logs' }, { status: 500 });
  }
}
