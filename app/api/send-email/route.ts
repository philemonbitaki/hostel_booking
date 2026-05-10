import { NextRequest, NextResponse } from 'next/server';
import { sendBookingConfirmationEmail } from '../../lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, guestName, roomName, checkIn, checkOut, totalPrice, bookingId } = body;

    if (!to || !guestName || !roomName || !checkIn || !checkOut || !totalPrice || !bookingId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await sendBookingConfirmationEmail({
      to,
      guestName,
      roomName,
      checkIn,
      checkOut,
      totalPrice,
      bookingId
    });

    if (result.success) {
      return NextResponse.json({ success: true, message: 'Email sent successfully' });
    } else {
      return NextResponse.json(
        { error: 'Failed to send email', details: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
