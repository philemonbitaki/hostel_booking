import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { to, guestName, roomName, price, bookingId } = await request.json();

    console.log('Sending admin confirmation email:', { to, guestName, roomName, price, bookingId });

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.EMAILJS_PRIVATE_KEY}`,
      },
      body: JSON.stringify({
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_PUBLIC_KEY,
        accessToken: process.env.EMAILJS_PRIVATE_KEY,
        template_params: {
          to_email: to,
          to_name: guestName,
          from_name: 'BU Hostel Admin',
          room_name: roomName,
          total_price: price,
          booking_id: bookingId,
          message: `Your booking has been CONFIRMED by our admin team! Your reservation at ${roomName} is now confirmed and ready.`,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('EmailJS API Error:', response.status, errorText);
      return NextResponse.json({ success: false, error: `EmailJS Error: ${response.status} - ${errorText}` }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 });
  }
}
