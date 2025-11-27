import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    // Role mapping based on email
    let role = 'requester';
    if (email.includes('buyer')) role = 'buyer';
    else if (email.includes('approver')) role = 'approver';
    else if (email.includes('finance')) role = 'finance';
    else if (email.includes('admin')) role = 'admin';
    else if (email.includes('auditor')) role = 'auditor';
    
    const user = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0],
      email,
      role,
      department: role === 'finance' ? 'Finance' : 
                 role === 'buyer' ? 'Procurement' :
                 role === 'approver' ? 'Operations' : 'IT',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    return NextResponse.json({
      data: user,
      success: true,
      message: 'Login successful',
      timestamp: new Date(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Login failed' },
      { status: 400 }
    );
  }
}