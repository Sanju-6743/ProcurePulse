import { NextResponse } from 'next/server';

// In-memory storage for requisitions (in production, this would be a database)
let requisitions: any[] = [];

export async function GET() {
  try {
    // Calculate real statistics from stored requisitions
    const totalRequests = requisitions.length;
    const pendingApprovals = requisitions.filter(req => req.status === 'pending').length;
    const approved = requisitions.filter(req => req.status === 'approved').length;
    const totalValue = requisitions
      .filter(req => req.status === 'approved')
      .reduce((sum, req) => sum + (req.totalAmount || 0), 0);

    const stats = {
      totalRequests,
      pendingApprovals,
      approved,
      totalValue,
      requisitions: requisitions.slice(-10).reverse(), // Last 10 requisitions for display
    };

    return NextResponse.json({
      data: stats,
      success: true,
      timestamp: new Date(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch requisition stats' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Create new requisition
    const newRequisition = {
      id: Date.now(), // Simple ID generation
      ...body,
      status: 'pending', // All new requisitions start as pending
      totalAmount: parseFloat(body.totalAmount) || 0,
      createdAt: new Date().toISOString(),
      submittedBy: 'requester', // In real app, this would come from auth
    };

    requisitions.push(newRequisition);

    return NextResponse.json({
      data: newRequisition,
      success: true,
      message: 'Requisition submitted successfully',
      timestamp: new Date(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to create requisition' },
      { status: 500 }
    );
  }
}
