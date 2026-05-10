# BU ONLINE HOSTEL BOOKING - Complete Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Features](#features)
4. [Project Structure](#project-structure)
5. [Installation & Setup](#installation--setup)
6. [Configuration](#configuration)
7. [Database Schema](#database-schema)
8. [API Routes](#api-routes)
9. [Components](#components)
10. [User Guide](#user-guide)
11. [Admin Guide](#admin-guide)
12. [Deployment](#deployment)

---

## Project Overview

**BU ONLINE HOSTEL BOOKING** is a modern, full-stack hostel booking management system built with Next.js. It provides a complete solution for managing hostel reservations, payments, and customer feedback with an intuitive admin dashboard.

**Key Highlights:**
- Real-time booking management
- Mobile money payment integration (MTN & Airtel)
- Email notifications via EmailJS
- Admin dashboard with dynamic statistics
- Customer feedback and review system
- Dark/Light theme support
- Responsive design

---

## Tech Stack

### Frontend
- **Framework**: Next.js 16.2.4 (App Router)
- **Language**: TypeScript 5.x
- **UI Library**: React 19.2.4
- **Styling**: Tailwind CSS 4.x
- **Icons**: Emojis & SVG icons

### Backend
- **API**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Custom admin authentication with localStorage

### Third-Party Services
- **Email**: EmailJS (@emailjs/browser)
- **Payment**: Stripe (optional), MTN Mobile Money, Airtel Money
- **Database ORM**: Supabase JS Client

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint 9.x
- **Type Checking**: TypeScript

---

## Features

### For Customers
- **Room Browsing**: View available university and private hostels
- **Room Selection**: Choose from Clifford, Bensdonf, Mukasa (University) and New Generation, Annex, Hundreb (Private)
- **Booking Form**: Complete booking with guest details, dates, and special requests
- **Payment Options**: MTN Mobile Money and Airtel Money integration
- **Email Confirmation**: Automatic booking confirmation emails
- **Feedback System**: Leave reviews and ratings for hostels
- **Theme Toggle**: Switch between dark and light modes

### For Admins
- **Authentication**: Secure login system with session management
- **Dashboard**: Real-time statistics and metrics
- **Booking Management**: View, confirm, and cancel bookings
- **Admin Confirmation**: Manual booking confirmation with email notifications
- **Feedback Management**: View and delete customer reviews
- **Dynamic Statistics**: Auto-updating stats (bookings, payments, rooms, availability)
- **Payment Tracking**: Monitor payment status and revenue

### System Features
- **Real-time Updates**: Statistics refresh every 5 seconds
- **Local Storage**: Client-side data persistence
- **Responsive Design**: Mobile-friendly interface
- **Transparent Navigation**: Modern glass-morphism UI
- **Error Handling**: Comprehensive error management
- **Email Notifications**: Booking confirmations via EmailJS

---

## Project Structure

```
Pythonhostel/
├── app/
│   ├── admin/                    # Admin panel
│   │   ├── availability/         # Room availability management
│   │   ├── bookings/            # Booking management
│   │   ├── components/          # Admin-specific components
│   │   ├── dashboard/           # Main admin dashboard
│   │   ├── login/               # Admin login
│   │   ├── payments/            # Payment management
│   │   ├── rooms/               # Room management
│   │   └── simple-dashboard/    # Simplified admin view
│   ├── api/                     # API routes
│   │   ├── create-payment-intent/ # Stripe payment intent
│   │   ├── send-confirmation-email/ # Admin confirmation emails
│   │   └── send-email/          # Booking confirmation emails
│   ├── booking/                 # Booking page
│   ├── components/              # Reusable components
│   │   ├── FeedbackDisplay.tsx  # Feedback list component
│   │   ├── FeedbackForm.tsx     # Feedback submission form
│   │   ├── FixedHeader.tsx      # Fixed header with logo
│   │   ├── Navbar.tsx           # Navigation bar
│   │   ├── RoomList.tsx         # Room listing component
│   │   └── StarRating.tsx       # Star rating component
│   ├── contact/                 # Contact page
│   ├── contexts/                # React contexts
│   │   └── ThemeContext.tsx     # Theme management
│   ├── feedback/                # Feedback page
│   ├── hostels/                 # Hostel listings
│   │   ├── private/             # Private hostels
│   │   └── university/          # University hostels
│   ├── lib/                     # Utility libraries
│   │   ├── database.ts          # Database functions
│   │   ├── email.ts             # Email functions
│   │   └── supabase.ts          # Supabase client
│   ├── payment/                 # Payment processing
│   │   └── success/             # Payment success page
│   ├── types/                   # TypeScript types
│   │   └── database.ts          # Database type definitions
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                # Home page
├── public/                      # Static assets
│   ├── bu.jpg                   # BU logo
│   └── hostels/                # Hostel images
├── .env.local                  # Environment variables
├── package.json                # Project dependencies
├── tsconfig.json               # TypeScript configuration
├── next.config.ts              # Next.js configuration
└── README.md                   # Project readme
```

---

## Installation & Setup

### Prerequisites
- Node.js 20.x or higher
- npm or yarn package manager
- Supabase account
- EmailJS account

### Installation Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd Pythonhostel
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EMAILJS_SERVICE_ID=your_emailjs_service_id
EMAILJS_TEMPLATE_ID=your_emailjs_template_id
EMAILJS_PUBLIC_KEY=your_emailjs_public_key
EMAILJS_PRIVATE_KEY=your_emailjs_private_key
```

4. **Set up Supabase database**
Run the SQL scripts in order:
```bash
- database-schema.sql
- create-missing-tables.sql
- fix-database-types.sql
- fix-rls-policies.sql
- rls-policies.sql
```

5. **Run development server**
```bash
npm run dev
```

6. **Access the application**
- Frontend: http://localhost:3000
- Admin: http://localhost:3000/admin

---

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `EMAILJS_SERVICE_ID` | EmailJS service ID | Yes |
| `EMAILJS_TEMPLATE_ID` | EmailJS template ID | Yes |
| `EMAILJS_PUBLIC_KEY` | EmailJS public key | Yes |
| `EMAILJS_PRIVATE_KEY` | EmailJS private key | Yes |

### EmailJS Setup

1. Create an EmailJS account at https://www.emailjs.com/
2. Create an email service (e.g., Gmail)
3. Create an email template with the following variables:
   - `to_email`: Recipient email
   - `to_name`: Recipient name
   - `from_name`: Sender name
   - `room_name`: Room/hostel name
   - `check_in`: Check-in date
   - `check_out`: Check-out date
   - `total_price`: Total amount
   - `booking_id`: Booking reference
   - `message`: Custom message
4. Copy your Service ID, Template ID, Public Key, and Private Key
5. Add them to your `.env.local` file

### Supabase Setup

1. Create a Supabase project at https://supabase.com/
2. Run the provided SQL scripts to create tables
3. Configure Row Level Security (RLS) policies
4. Copy your project URL and anon key
5. Add them to your `.env.local` file

---

## Database Schema

### Tables

#### Users
```sql
- id (uuid, primary key)
- email (text, unique)
- full_name (text)
- phone (text)
- created_at (timestamp)
- updated_at (timestamp)
```

#### Rooms
```sql
- id (uuid, primary key)
- name (text)
- description (text)
- capacity (integer)
- price_per_night (numeric)
- image_url (text)
- available (boolean)
- created_at (timestamp)
- updated_at (timestamp)
```

#### Bookings
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key)
- room_id (uuid, foreign key)
- check_in_date (date)
- check_out_date (date)
- total_price (numeric)
- status (text: 'pending' | 'confirmed' | 'cancelled')
- special_requests (text)
- created_at (timestamp)
- updated_at (timestamp)
```

#### Payments
```sql
- id (uuid, primary key)
- booking_id (uuid, foreign key)
- amount (numeric)
- payment_method (text)
- payment_status (text: 'pending' | 'completed' | 'failed')
- transaction_id (text)
- created_at (timestamp)
- updated_at (timestamp)
```

#### Feedback
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key, nullable)
- room_id (uuid, foreign key, nullable)
- booking_id (uuid, foreign key, nullable)
- rating (integer, 1-5)
- comment (text)
- created_at (timestamp)
- updated_at (timestamp)
```

#### RoomAvailability
```sql
- id (uuid, primary key)
- room_id (uuid, foreign key)
- date (date)
- is_available (boolean)
- created_at (timestamp)
- updated_at (timestamp)
```

---

## API Routes

### POST `/api/send-email`
Sends booking confirmation email to customer.

**Request Body:**
```json
{
  "to": "customer@email.com",
  "guestName": "John Doe",
  "roomName": "Clifford",
  "checkIn": "2026-05-20",
  "checkOut": "2026-05-30",
  "totalPrice": 250,
  "bookingId": "booking-123456"
}
```

**Response:**
```json
{
  "success": true
}
```

### POST `/api/send-confirmation-email`
Sends admin confirmation email to customer.

**Request Body:**
```json
{
  "to": "customer@email.com",
  "guestName": "John Doe",
  "roomName": "Clifford",
  "price": 250,
  "bookingId": "booking-123456"
}
```

**Response:**
```json
{
  "success": true
}
```

### POST `/api/create-payment-intent`
Creates Stripe payment intent (optional feature).

**Request Body:**
```json
{
  "amount": 25000,
  "currency": "eur",
  "metadata": {
    "bookingId": "booking-123456",
    "userId": "user-123",
    "roomName": "Clifford"
  }
}
```

**Response:**
```json
{
  "clientSecret": "pi_123456_secret",
  "paymentIntentId": "pi_123456"
}
```

---

## Components

### Core Components

#### Navbar
**Location:** `app/components/Navbar.tsx`
- Navigation bar with links
- Theme toggle button (☀️/🌙)
- Transparent background
- Responsive design

#### FixedHeader
**Location:** `app/components/FixedHeader.tsx`
- Fixed header with BU logo
- Main navigation links
- Theme toggle button
- Glass-morphism effect

#### FeedbackForm
**Location:** `app/components/FeedbackForm.tsx`
- Star rating input (1-5)
- Comment textarea
- Form validation
- Submit to Supabase or localStorage

#### FeedbackDisplay
**Location:** `app/components/FeedbackDisplay.tsx`
- List of customer feedbacks
- Star rating display
- Average rating calculation
- Admin delete functionality (when isAdmin=true)
- "Write a Review" button

#### RoomList
**Location:** `app/components/RoomList.tsx`
- Room listing with details
- Price display
- Availability status
- Book Now buttons

#### StarRating
**Location:** `app/components/StarRating.tsx`
- Interactive star rating
- Hover effects
- Read-only mode option

### Page Components

#### Home Page
**Location:** `app/page.tsx`
- Hero section with background image
- Hostel type selection (University/Private)
- Features section
- Feedback display
- Theme-aware styling

#### Booking Page
**Location:** `app/booking/page.tsx`
- Room selection
- Guest information form
- Date picker
- Special requests
- Payment method selection
- Email confirmation integration
- Form validation

#### Payment Page
**Location:** `app/payment/page.tsx`
- Payment method selection
- MTN Mobile Money option (0766615673)
- Airtel Money option (0756661543)
- Booking summary
- Payment processing
- Success redirect

#### Admin Dashboard
**Location:** `app/admin/page.tsx`
- Real-time statistics
- Quick action buttons
- Navigation to admin sections
- Logout functionality
- Auto-refreshing stats (5 seconds)

#### Admin Simple Dashboard
**Location:** `app/admin/simple-dashboard/page.tsx`
- Booking list
- Confirmation/cancellation buttons
- Statistics display
- Auto-refresh functionality

---

## User Guide

### Making a Booking

1. **Navigate to Home Page**
   - Visit http://localhost:3000
   - Choose between University Hostel or Private Hostel

2. **Select a Hostel**
   - **University Hostels:** Clifford, Bensdonf, Mukasa
   - **Private Hostels:** New Generation, Annex, Hundreb

3. **Fill Booking Form**
   - Full Name (required)
   - Email (required)
   - Phone (optional)
   - Check-in date (required)
   - Check-out date (required)
   - Special requests (optional)

4. **Select Payment Method**
   - MTN Mobile Money → Send to 0766615673
   - Airtel Money → Send to 0756661543

5. **Complete Payment**
   - Click "Pay with MTN" or "Pay with Airtel"
   - Follow payment instructions
   - Receive confirmation email

6. **Wait for Admin Confirmation**
   - Admin will review and confirm booking
   - Receive final confirmation email
   - Booking status changes to "confirmed"

### Leaving Feedback

1. Navigate to any hostel page
2. Scroll to "Guest Reviews" section
3. Click "Write a Review" button
4. Select rating (1-5 stars)
5. Write your comment
6. Submit review

### Theme Toggle

- Click ☀️/🌙 button in Navbar or FixedHeader
- Switch between dark and light modes
- Preference saved in localStorage

---

## Admin Guide

### Admin Login

1. Navigate to http://localhost:3000/admin
2. Enter admin credentials
3. Session expires after 1 hour
4. Auto-logout on page refresh after 1 second away

### Dashboard Overview

**Statistics (auto-refresh every 5 seconds):**
- Total Bookings
- Total Payments (UGX)
- Total Rooms
- Available Rooms

**Quick Actions:**
- Manage Bookings
- Manage Payments
- Manage Rooms
- Availability

### Booking Management

1. **View Bookings**
   - Navigate to Admin Dashboard
   - View all bookings with status
   - See guest details and room information

2. **Confirm Booking**
   - Find booking with "pending" status
   - Click green "✅ Confirm" button
   - Booking status changes to "confirmed"
   - Email sent to customer automatically

3. **Cancel Booking**
   - Click on booking to cancel
   - Confirm cancellation
   - Status changes to "cancelled"

### Feedback Management

1. **View Feedback**
   - Click "Show Feedbacks" button in dashboard
   - View all customer reviews
   - See ratings and comments

2. **Delete Feedback**
   - Click "🗑️ Delete" button on any review
   - Confirm deletion
   - Review removed from display

### Statistics

**Dynamic Statistics:**
- Total Bookings: Count of all bookings
- Total Payments: Sum of all confirmed payments
- Total Rooms: Total number of rooms
- Available Rooms: Rooms currently available

**Auto-refresh:**
- Statistics update every 5 seconds
- Changes reflect immediately
- No manual refresh needed

---

## Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect to Vercel**
   - Go to https://vercel.com/
   - Import your GitHub repository
   - Configure project settings

3. **Add Environment Variables**
   - Add all variables from `.env.local`
   - Ensure they're marked as sensitive

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Access your deployed site

### Environment Variables for Production

Ensure all environment variables are set in your hosting platform:
- Supabase URL and keys
- EmailJS credentials
- Any other required API keys

### Database Setup for Production

1. Create a Supabase project for production
2. Run all SQL scripts on production database
3. Configure RLS policies for production security
4. Test all database connections

### Post-Deployment Checklist

- [ ] Test booking flow
- [ ] Test payment integration
- [ ] Test email notifications
- [ ] Test admin authentication
- [ ] Test admin dashboard
- [ ] Verify all environment variables
- [ ] Test feedback system
- [ ] Verify responsive design
- [ ] Test theme toggle
- [ ] Check for console errors

---

## Troubleshooting

### Common Issues

**Email not sending:**
- Verify EmailJS credentials in `.env.local`
- Check EmailJS service is active
- Ensure template variables match
- Check browser console for errors

**Admin login not working:**
- Clear localStorage
- Check admin credentials
- Verify session timeout settings

**Booking not saving:**
- Check localStorage availability
- Verify form validation
- Check browser console for errors

**Statistics not updating:**
- Wait 5 seconds for auto-refresh
- Check localStorage data
- Verify database connection

**Theme not switching:**
- Check ThemeContext is wrapped
- Verify localStorage theme value
- Check browser console for errors

---

## Support & Maintenance

### Regular Maintenance Tasks

- Monitor database storage usage
- Review and clean up old bookings
- Update EmailJS templates as needed
- Review feedback and respond to customers
- Update room availability
- Monitor payment transactions

### Security Considerations

- Keep environment variables secret
- Regularly update dependencies
- Monitor for security vulnerabilities
- Use strong admin passwords
- Enable HTTPS in production
- Implement rate limiting on API routes

### Performance Optimization

- Optimize images before upload
- Use Next.js image optimization
- Implement caching strategies
- Monitor API response times
- Optimize database queries

---

## License

This project is proprietary software. All rights reserved.

---

## Contact

For support or questions, please contact the development team.

**Last Updated:** May 2026
**Version:** 1.0.0
