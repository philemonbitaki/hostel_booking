export async function sendBookingConfirmationEmail(data: any) {
  try {
    const { to, guestName, roomName, checkIn, checkOut, totalPrice, bookingId } = data;
    
    // Log des variables d'environnement pour debug
    console.log('EmailJS Config:', {
      service_id: process.env.EMAILJS_SERVICE_ID,
      template_id: process.env.EMAILJS_TEMPLATE_ID,
      user_id: process.env.EMAILJS_PUBLIC_KEY ? 'SET' : 'NOT SET',
    });
    
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
          from_name: 'Hostel Booking',
          room_name: roomName,
          check_in: checkIn,
          check_out: checkOut,
          total_price: totalPrice,
          booking_id: bookingId,
          message: `Your reservation at ${roomName} has been confirmed!`,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('EmailJS API Error:', response.status, errorText);
      throw new Error(`EmailJS Error: ${response.status} - ${errorText}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error };
  }
}
