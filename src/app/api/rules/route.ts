import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const rules = await prisma.rule.findMany({
      orderBy: { priority: 'desc' }
    });
    return NextResponse.json(rules);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch rules' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Quick validation
    if (!body.name || !body.conditions || !body.action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newRule = await prisma.rule.create({
      data: {
        name: body.name,
        conditions: typeof body.conditions === 'string' ? body.conditions : JSON.stringify(body.conditions),
        action: typeof body.action === 'string' ? body.action : JSON.stringify(body.action),
        priority: body.priority || 0,
        isActive: body.isActive ?? true,
      }
    });

    return NextResponse.json(newRule, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create rule' }, { status: 500 });
  }
}
