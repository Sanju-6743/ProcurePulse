import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const stats = {
      totalSpend: 2500000,
      openPOs: 45,
      pendingApprovals: 12,
      vendorOTD: 94.5,
      budgetUtilization: 78.2,
      activeVendors: 20,
      pendingInvoices: 23,
      overduePayments: 5,
    };
    
    return NextResponse.json({
      data: stats,
      success: true,
      timestamp: new Date(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}