import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

// GET /api/leads - Get all leads
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: any = {};

    if (status) {
      where.status = status;
    }

    const leads = await prisma.lead.findMany({
      where,
      include: {
        sale: {
          select: {
            id: true,
            saleNumber: true,
            status: true,
            netAmount: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

// POST /api/leads - Create new lead
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'ADMIN' && session.role !== 'MANAGER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { companyName, contactName, email, phone, source, value, assignedTo, notes } = body;

    if (!companyName || !contactName || !email || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate lead number
    const lastLead = await prisma.lead.findFirst({
      orderBy: { leadNumber: 'desc' },
    });

    let leadNumber: string;
    if (lastLead && lastLead.leadNumber.startsWith('LD')) {
      const lastNum = parseInt(lastLead.leadNumber.replace('LD', ''));
      leadNumber = `LD${String(lastNum + 1).padStart(5, '0')}`;
    } else {
      leadNumber = 'LD00001';
    }

    const lead = await prisma.lead.create({
      data: {
        leadNumber,
        companyName,
        contactName,
        email,
        phone,
        source: source || null,
        value: value ? parseFloat(value) : null,
        assignedTo: assignedTo || null,
        notes: notes || null,
        status: 'NEW',
      },
    });

    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch (error) {
    console.error('Create lead error:', error);
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
  }
}

// PUT /api/leads - Update lead
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || (session.role !== 'ADMIN' && session.role !== 'MANAGER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, companyName, contactName, email, phone, source, status, value, assignedTo, notes } = body;

    if (!id) {
      return NextResponse.json({ error: 'Lead ID required' }, { status: 400 });
    }

    const existing = await prisma.lead.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    const updateData: any = {};

    if (companyName) updateData.companyName = companyName;
    if (contactName) updateData.contactName = contactName;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (source !== undefined) updateData.source = source;
    if (status) updateData.status = status;
    if (value !== undefined) updateData.value = value ? parseFloat(value) : null;
    if (assignedTo !== undefined) updateData.assignedTo = assignedTo;
    if (notes !== undefined) updateData.notes = notes;

    const lead = await prisma.lead.update({
      where: { id },
      data: updateData,
      include: {
        sale: {
          select: {
            id: true,
            saleNumber: true,
            status: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error('Update lead error:', error);
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}

// DELETE /api/leads - Delete lead
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Lead ID required' }, { status: 400 });
    }

    // Check if lead has been converted to sale
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: { sale: true },
    });

    if (lead?.sale) {
      return NextResponse.json({ error: 'Cannot delete lead that has been converted to sale' }, { status: 400 });
    }

    await prisma.lead.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete lead error:', error);
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 });
  }
}
