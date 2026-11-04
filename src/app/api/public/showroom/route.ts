import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const showroom = {
      name: 'The Bike Yard',
      address:
        'Shop Number A/01, THE BIKE YARD, Mount Casa Building, Lal Bahadur Shastri Marg, Opposite Amar Gyan Industrial Estate, Khopat Signal, Thane, Maharashtra 400601.',
      city: 'Thane',
      state: 'Maharashtra',
      pincode: '400601',
      phone: '080971 72040',
      email: 'info@thebikeyard.in',
      hours: {
        mondayFriday: '9:00 AM - 8:00 PM',
        saturday: '9:00 AM - 9:00 PM',
        sunday: '10:00 AM - 6:00 PM',
      },
    };
    return NextResponse.json({ data: showroom });
  } catch (error) {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch showroom details' } },
      { status: 500 }
    );
  }
}
