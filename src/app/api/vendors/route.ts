import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// API Route for vendors management

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    // Build where clause for search
    const where = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { taxId: { contains: search, mode: 'insensitive' } }
      ]
    } : {};

    const [vendors, total] = await Promise.all([
      db.vendor.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      db.vendor.count({ where })
    ]);

    // Transform database records to match the expected interface
    const transformedVendors = vendors.map(vendor => ({
      ...vendor,
      address: vendor.address as any,
      contact: vendor.contact as any,
      bankDetails: vendor.bankDetails as any,
      complianceDocs: vendor.complianceDocs as any,
      slaMetrics: vendor.slaMetrics as any,
      categories: vendor.categories as any,
    }));

    return NextResponse.json({
      data: transformedVendors,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      success: true,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Error fetching vendors:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch vendors' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const vendorData = await request.json();

    const newVendor = await db.vendor.create({
      data: {
        name: vendorData.name,
        taxId: vendorData.taxId,
        registrationNumber: vendorData.registrationNumber,
        address: vendorData.address,
        contact: vendorData.contact,
        bankDetails: vendorData.bankDetails,
        complianceDocs: vendorData.complianceDocs,
        riskScore: vendorData.riskScore || 50,
        slaMetrics: vendorData.slaMetrics || { onTimeDelivery: 0, qualityScore: 0, responsiveness: 0 },
        status: vendorData.status || 'pending',
        categories: vendorData.categories || [],
      },
    });

    // Transform for response
    const transformedVendor = {
      ...newVendor,
      address: newVendor.address as any,
      contact: newVendor.contact as any,
      bankDetails: newVendor.bankDetails as any,
      complianceDocs: newVendor.complianceDocs as any,
      slaMetrics: newVendor.slaMetrics as any,
      categories: newVendor.categories as any,
    };

    return NextResponse.json({
      data: transformedVendor,
      success: true,
      message: 'Vendor created successfully',
      timestamp: new Date(),
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating vendor:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create vendor' },
      { status: 400 }
    );
  }
}
