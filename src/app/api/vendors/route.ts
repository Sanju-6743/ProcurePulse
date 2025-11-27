import { NextRequest, NextResponse } from 'next/server';
import { generateVendors } from '@/lib/mocks/seed-data';

// Generate mock vendors data
const mockVendors = generateVendors(30);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    // Filter vendors based on search term
    let filteredVendors = mockVendors;
    if (search) {
      filteredVendors = mockVendors.filter(vendor =>
        vendor.name.toLowerCase().includes(search.toLowerCase()) ||
        vendor.taxId.toLowerCase().includes(search.toLowerCase()) ||
        vendor.categories.some(category => 
          category.toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    // Paginate results
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedVendors = filteredVendors.slice(start, end);

    return NextResponse.json({
      data: paginatedVendors,
      pagination: {
        page,
        limit,
        total: filteredVendors.length,
        totalPages: Math.ceil(filteredVendors.length / limit),
      },
      success: true,
      timestamp: new Date(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch vendors' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const vendorData = await request.json();
    
    // Generate new vendor with mock data
    const newVendor = {
      id: `vendor-${Date.now()}`,
      ...vendorData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // In a real app, this would save to a database
    mockVendors.push(newVendor);

    return NextResponse.json({
      data: newVendor,
      success: true,
      message: 'Vendor created successfully',
      timestamp: new Date(),
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to create vendor' },
      { status: 400 }
    );
  }
}
