import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    
    // Process JSON conversion if necessary
    const updateData: any = { ...body };
    if (updateData.conditions && typeof updateData.conditions !== 'string') {
      updateData.conditions = JSON.stringify(updateData.conditions);
    }
    if (updateData.action && typeof updateData.action !== 'string') {
      updateData.action = JSON.stringify(updateData.action);
    }

    const updatedRule = await prisma.rule.update({
      where: { id: resolvedParams.id },
      data: updateData
    });

    return NextResponse.json(updatedRule);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update rule' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    await prisma.rule.delete({
      where: { id: resolvedParams.id }
    });
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete rule' }, { status: 500 });
  }
}
