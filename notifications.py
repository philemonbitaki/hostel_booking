import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException

def send_booking_confirmation(client_email, client_name, booking_date):
    """
    Sends a professional booking confirmation email via Brevo API.
    """
    # 1. API Configuration
    configuration = sib_api_v3_sdk.Configuration()
    configuration.api_key['api-key'] = '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' # <--- Insert your Key here

    api_instance = sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(configuration))

    # 2. Email Setup
    sender = {"name": "Hostel Booking System", "email": "your-verified-email@domain.com"}
    to = [{"email": client_email, "name": client_name}]
    
    # HTML Content designed for mobile screens
    html_content = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #2c3e50;">Booking Confirmed! 🏨</h2>
                <p>Hello <strong>{client_name}</strong>,</p>
                <p>Thank you for choosing our hostel. Your stay is scheduled for: <strong>{booking_date}</strong>.</p>
                <p>We are looking forward to seeing you!</p>
                <br>
                <a href="#" style="display: inline-block; background-color: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">View My Reservation</a>
                <p style="font-size: 12px; color: #777; margin-top: 20px;">If you have any questions, reply to this email.</p>
            </div>
        </body>
    </html>
    """
    
    send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
        to=to,
        sender=sender,
        subject="Your Stay Confirmation - Booking ID #12345",
        html_content=html_content
    )

    # 3. Execution
    try:
        api_instance.send_transac_email(send_smtp_email)
        print(f"Success: Notification sent to {client_email}")
        return True
    except ApiException as e:
        print(f"Exception when calling TransactionalEmailsApi->send_transac_email: {e}")
        return False

# --- Quick Test ---
# send_booking_confirmation("test-client@gmail.com", "John Doe", "December 12th, 2024")
