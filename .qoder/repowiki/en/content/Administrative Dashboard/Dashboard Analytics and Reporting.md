# Dashboard Analytics and Reporting

<cite>
**Referenced Files in This Document**
- [app/admin/page.tsx](file://app/admin/page.tsx)
- [app/admin/dashboard/page.tsx](file://app/admin/dashboard/page.tsx)
- [app/admin/dashboard/real-bookings.tsx](file://app/admin/dashboard/real-bookings.tsx)
- [app/admin/dashboard/real-data.tsx](file://app/admin/dashboard/real-data.tsx)
- [app/admin/simple-dashboard/page.tsx](file://app/admin/simple-dashboard/page.tsx)
- [lib/real-bookings.ts](file://lib/real-bookings.ts)
- [lib/bookings-storage.ts](file://lib/bookings-storage.ts)
- [app/lib/database.ts](file://app/lib/database.ts)
- [app/types/database.ts](file://app/types/database.ts)
- [app/components/FeedbackDisplay.tsx](file://app/components/FeedbackDisplay.tsx)
- [app/admin/components/AdminProtection.tsx](file://app/admin/components/AdminProtection.tsx)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Dependency Analysis](#dependency-analysis)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Conclusion](#conclusion)

## Introduction
This document describes the dashboard analytics and reporting system for the hostel booking platform. It covers real-time booking statistics display, revenue tracking calculations, occupancy analytics, and interactive visualization components. It also documents data aggregation logic, statistical computations, real-time updates, customization examples, filtering approaches, export capabilities, and performance considerations for large datasets with caching strategies.

## Project Structure
The dashboard system is implemented as a Next.js client-side application with multiple dashboard variants and supporting libraries:
- Admin dashboard with live stats and navigation
- Real-time booking dashboards using local storage and Supabase
- Simple dashboard with auto-refresh and localStorage synchronization
- Analytics libraries for booking data and statistics
- Database abstraction layer for Supabase integration
- Types for strong typing across the system

```mermaid
graph TB
subgraph "Admin Dashboards"
A1["app/admin/page.tsx"]
A2["app/admin/dashboard/page.tsx"]
A3["app/admin/dashboard/real-bookings.tsx"]
A4["app/admin/dashboard/real-data.tsx"]
A5["app/admin/simple-dashboard/page.tsx"]
end
subgraph "Analytics Libraries"
L1["lib/real-bookings.ts"]
L2["lib/bookings-storage.ts"]
end
subgraph "Database Layer"
D1["app/lib/database.ts"]
T1["app/types/database.ts"]
end
subgraph "UI Components"
C1["app/components/FeedbackDisplay.tsx"]
C2["app/admin/components/AdminProtection.tsx"]
end
A1 --> D1
A3 --> L1
A4 --> L2
A5 --> L2
A2 --> L1
D1 --> T1
A1 --> C2
A3 --> C2
A4 --> C2
A5 --> C2
A2 --> C2
A1 --> C1
```

**Diagram sources**
- [app/admin/page.tsx:1-181](file://app/admin/page.tsx#L1-L181)
- [app/admin/dashboard/page.tsx:1-205](file://app/admin/dashboard/page.tsx#L1-L205)
- [app/admin/dashboard/real-bookings.tsx:1-347](file://app/admin/dashboard/real-bookings.tsx#L1-L347)
- [app/admin/dashboard/real-data.tsx:1-291](file://app/admin/dashboard/real-data.tsx#L1-L291)
- [app/admin/simple-dashboard/page.tsx:1-257](file://app/admin/simple-dashboard/page.tsx#L1-L257)
- [lib/real-bookings.ts:1-120](file://lib/real-bookings.ts#L1-L120)
- [lib/bookings-storage.ts:1-191](file://lib/bookings-storage.ts#L1-L191)
- [app/lib/database.ts:1-433](file://app/lib/database.ts#L1-L433)
- [app/types/database.ts:1-146](file://app/types/database.ts#L1-L146)
- [app/components/FeedbackDisplay.tsx:1-155](file://app/components/FeedbackDisplay.tsx#L1-L155)
- [app/admin/components/AdminProtection.tsx:1-69](file://app/admin/components/AdminProtection.tsx#L1-L69)

**Section sources**
- [app/admin/page.tsx:1-181](file://app/admin/page.tsx#L1-L181)
- [app/admin/dashboard/page.tsx:1-205](file://app/admin/dashboard/page.tsx#L1-L205)
- [app/admin/dashboard/real-bookings.tsx:1-347](file://app/admin/dashboard/real-bookings.tsx#L1-L347)
- [app/admin/dashboard/real-data.tsx:1-291](file://app/admin/dashboard/real-data.tsx#L1-L291)
- [app/admin/simple-dashboard/page.tsx:1-257](file://app/admin/simple-dashboard/page.tsx#L1-L257)
- [lib/real-bookings.ts:1-120](file://lib/real-bookings.ts#L1-L120)
- [lib/bookings-storage.ts:1-191](file://lib/bookings-storage.ts#L1-L191)
- [app/lib/database.ts:1-433](file://app/lib/database.ts#L1-L433)
- [app/types/database.ts:1-146](file://app/types/database.ts#L1-L146)
- [app/components/FeedbackDisplay.tsx:1-155](file://app/components/FeedbackDisplay.tsx#L1-L155)
- [app/admin/components/AdminProtection.tsx:1-69](file://app/admin/components/AdminProtection.tsx#L1-L69)

## Core Components
- Admin dashboard with live stats cards for total bookings, total revenue, occupied rooms, and pending bookings.
- Real-time booking dashboard with tabbed views for bookings and statistics, including confirmation rate and unique clients.
- Simple dashboard with auto-refresh via localStorage events and periodic polling.
- Analytics library for real bookings using localStorage with save, load, update, and statistics computation.
- Database abstraction layer for Supabase integration with booking retrieval, status updates, and dashboard statistics.
- Types for strong typing across the system including dashboard stats and feedback entities.
- Feedback display component with dynamic star rendering and average rating calculation.

**Section sources**
- [app/admin/page.tsx:75-120](file://app/admin/page.tsx#L75-L120)
- [app/admin/dashboard/real-bookings.tsx:228-339](file://app/admin/dashboard/real-bookings.tsx#L228-L339)
- [app/admin/simple-dashboard/page.tsx:20-97](file://app/admin/simple-dashboard/page.tsx#L20-L97)
- [lib/real-bookings.ts:21-119](file://lib/real-bookings.ts#L21-L119)
- [app/lib/database.ts:184-212](file://app/lib/database.ts#L184-L212)
- [app/types/database.ts:118-146](file://app/types/database.ts#L118-L146)
- [app/components/FeedbackDisplay.tsx:12-70](file://app/components/FeedbackDisplay.tsx#L12-L70)

## Architecture Overview
The system integrates three primary data sources:
- Supabase-backed analytics for production-grade metrics
- Local storage for offline-first and rapid prototyping
- Static mock data for development and testing

```mermaid
sequenceDiagram
participant Admin as "Admin Dashboard"
participant DB as "Supabase Database"
participant Lib as "Database Library"
participant Types as "TypeScript Types"
Admin->>Lib : Request dashboard stats
Lib->>DB : Query bookings and rooms
DB-->>Lib : Return aggregated data
Lib-->>Admin : Stats payload
Admin->>Types : Type-check and render
```

**Diagram sources**
- [app/admin/page.tsx:15-32](file://app/admin/page.tsx#L15-L32)
- [app/lib/database.ts:184-212](file://app/lib/database.ts#L184-L212)
- [app/types/database.ts:118-125](file://app/types/database.ts#L118-L125)

## Detailed Component Analysis

### Admin Dashboard (Live Stats)
The main admin dashboard fetches and displays key metrics:
- Total bookings
- Total revenue
- Occupied rooms
- Pending bookings

```mermaid
flowchart TD
Start(["Load Admin Dashboard"]) --> Fetch["Fetch dashboard stats from Supabase"]
Fetch --> Success{"Stats loaded?"}
Success --> |Yes| Render["Render stats cards"]
Success --> |No| Error["Set error state"]
Render --> End(["Ready"])
Error --> End
```

**Diagram sources**
- [app/admin/page.tsx:15-32](file://app/admin/page.tsx#L15-L32)
- [app/lib/database.ts:184-212](file://app/lib/database.ts#L184-L212)

**Section sources**
- [app/admin/page.tsx:75-120](file://app/admin/page.tsx#L75-L120)
- [app/lib/database.ts:184-212](file://app/lib/database.ts#L184-L212)

### Real-Time Booking Dashboard
This dashboard supports:
- Tabbed interface for bookings and statistics
- Unique client counts
- Confirmation rate calculation
- Manual refresh and cancellation actions

```mermaid
sequenceDiagram
participant User as "Admin User"
participant Dashboard as "Real Bookings Dashboard"
participant Storage as "localStorage"
participant Lib as "real-bookings.ts"
User->>Dashboard : Open dashboard
Dashboard->>Lib : Load bookings and stats
Lib->>Storage : Retrieve saved bookings
Storage-->>Lib : Return bookings
Lib-->>Dashboard : Return bookings and stats
Dashboard->>Dashboard : Render bookings table and stats cards
User->>Dashboard : Click cancel booking
Dashboard->>Lib : Update booking status
Lib->>Storage : Persist updated bookings
Storage-->>Lib : Confirm write
Lib-->>Dashboard : Success
Dashboard->>Dashboard : Re-fetch and re-render
```

**Diagram sources**
- [app/admin/dashboard/real-bookings.tsx:13-33](file://app/admin/dashboard/real-bookings.tsx#L13-L33)
- [lib/real-bookings.ts:40-68](file://lib/real-bookings.ts#L40-L68)
- [lib/real-bookings.ts:84-100](file://lib/real-bookings.ts#L84-L100)

**Section sources**
- [app/admin/dashboard/real-bookings.tsx:75-101](file://app/admin/dashboard/real-bookings.tsx#L75-L101)
- [app/admin/dashboard/real-bookings.tsx:228-339](file://app/admin/dashboard/real-bookings.tsx#L228-L339)
- [lib/real-bookings.ts:40-119](file://lib/real-bookings.ts#L40-L119)

### Simple Dashboard with Auto-Refresh
The simple dashboard:
- Loads initial data plus new customer bookings from localStorage
- Auto-refreshes every 2 seconds
- Responds to storage events and visibility changes
- Calculates totals, confirmed, cancelled, and revenue in real-time

```mermaid
flowchart TD
Init["Initialize dashboard"] --> Load["Load initial + localStorage bookings"]
Load --> SetState["Set bookings state"]
SetState --> Poll["Start 2s poll for changes"]
Poll --> Detect{"New count detected?"}
Detect --> |Yes| Reload["Reload and update status"]
Detect --> |No| Wait["Wait for next tick"]
Reload --> Poll
Wait --> Poll
```

**Diagram sources**
- [app/admin/simple-dashboard/page.tsx:20-97](file://app/admin/simple-dashboard/page.tsx#L20-L97)

**Section sources**
- [app/admin/simple-dashboard/page.tsx:20-97](file://app/admin/simple-dashboard/page.tsx#L20-L97)

### Analytics Library (Local Storage)
The analytics library provides:
- Save new bookings
- Load all bookings
- Update booking status
- Compute statistics (totals, confirmed, cancelled, revenue, confirmation rate)
- Extract unique clients

```mermaid
classDiagram
class RealBookings {
+saveBooking(bookingData) RealBooking
+getBookings() RealBooking[]
+getBookingById(id) RealBooking
+updateBookingStatus(id, status) boolean
+deleteBooking(id) boolean
+getBookingStats() Stats
+getUniqueClients() Client[]
}
class Stats {
+total number
+confirmed number
+cancelled number
+totalRevenue number
+confirmationRate number
}
class Client {
+name string
+email string
+phone string
+firstBooking string
}
RealBookings --> Stats : "returns"
RealBookings --> Client : "returns"
```

**Diagram sources**
- [lib/real-bookings.ts:21-119](file://lib/real-bookings.ts#L21-L119)

**Section sources**
- [lib/real-bookings.ts:21-119](file://lib/real-bookings.ts#L21-L119)

### Database Abstraction Layer
The database layer:
- Provides typed queries for bookings, rooms, and availability
- Computes dashboard statistics from Supabase data
- Exposes CRUD operations for bookings and payments

```mermaid
classDiagram
class DatabaseLibrary {
+getAllBookings() Promise
+getUserBookings(userId) Promise
+createBooking(data, userId) Promise
+updateBookingStatus(id, status) Promise
+getDashboardStats() Promise
+getFeedbacks(roomId?, limit) Promise
+getAverageRating(roomId?) Promise
}
class DashboardStats {
+total_bookings number
+total_revenue number
+occupied_rooms number
+available_rooms number
+pending_bookings number
}
DatabaseLibrary --> DashboardStats : "returns"
```

**Diagram sources**
- [app/lib/database.ts:134-212](file://app/lib/database.ts#L134-L212)
- [app/types/database.ts:118-125](file://app/types/database.ts#L118-L125)

**Section sources**
- [app/lib/database.ts:134-212](file://app/lib/database.ts#L134-L212)
- [app/types/database.ts:118-125](file://app/types/database.ts#L118-L125)

### Feedback Display Component
The feedback display:
- Loads feedbacks from Supabase with fallback to localStorage
- Renders star ratings and average rating
- Supports optional inline feedback form

```mermaid
sequenceDiagram
participant Component as "FeedbackDisplay"
participant Supabase as "Supabase"
participant Local as "localStorage"
Component->>Supabase : getFeedbacks(roomId, limit)
alt Success
Supabase-->>Component : Feedback array
else Error
Component->>Local : Read stored feedbacks
Local-->>Component : Fallback feedbacks
end
Component->>Component : Calculate average rating
Component-->>Component : Render stars and list
```

**Diagram sources**
- [app/components/FeedbackDisplay.tsx:21-52](file://app/components/FeedbackDisplay.tsx#L21-L52)

**Section sources**
- [app/components/FeedbackDisplay.tsx:21-70](file://app/components/FeedbackDisplay.tsx#L21-L70)

## Dependency Analysis
Key dependencies and relationships:
- Admin dashboards depend on AdminProtection for authentication gating
- Real-time dashboards depend on analytics libraries for data operations
- Database layer depends on Supabase client and TypeScript types
- Feedback display depends on database library and localStorage fallback

```mermaid
graph LR
AdminProtection["AdminProtection.tsx"] --> AdminDashboard["admin/page.tsx"]
AdminProtection --> RealBookings["dashboard/real-bookings.tsx"]
AdminProtection --> RealData["dashboard/real-data.tsx"]
AdminProtection --> SimpleDashboard["simple-dashboard/page.tsx"]
RealBookings --> RealBookingsLib["lib/real-bookings.ts"]
RealData --> BookingsStorage["lib/bookings-storage.ts"]
AdminDashboard --> DatabaseLib["app/lib/database.ts"]
DatabaseLib --> Types["app/types/database.ts"]
AdminDashboard --> FeedbackDisplay["components/FeedbackDisplay.tsx"]
```

**Diagram sources**
- [app/admin/components/AdminProtection.tsx:9-68](file://app/admin/components/AdminProtection.tsx#L9-L68)
- [app/admin/page.tsx:1-181](file://app/admin/page.tsx#L1-L181)
- [app/admin/dashboard/real-bookings.tsx:1-347](file://app/admin/dashboard/real-bookings.tsx#L1-L347)
- [app/admin/dashboard/real-data.tsx:1-291](file://app/admin/dashboard/real-data.tsx#L1-L291)
- [app/admin/simple-dashboard/page.tsx:1-257](file://app/admin/simple-dashboard/page.tsx#L1-L257)
- [lib/real-bookings.ts:1-120](file://lib/real-bookings.ts#L1-L120)
- [lib/bookings-storage.ts:1-191](file://lib/bookings-storage.ts#L1-L191)
- [app/lib/database.ts:1-433](file://app/lib/database.ts#L1-L433)
- [app/types/database.ts:1-146](file://app/types/database.ts#L1-L146)
- [app/components/FeedbackDisplay.tsx:1-155](file://app/components/FeedbackDisplay.tsx#L1-L155)

**Section sources**
- [app/admin/components/AdminProtection.tsx:9-68](file://app/admin/components/AdminProtection.tsx#L9-L68)
- [app/admin/page.tsx:1-181](file://app/admin/page.tsx#L1-L181)
- [app/admin/dashboard/real-bookings.tsx:1-347](file://app/admin/dashboard/real-bookings.tsx#L1-L347)
- [app/admin/dashboard/real-data.tsx:1-291](file://app/admin/dashboard/real-data.tsx#L1-L291)
- [app/admin/simple-dashboard/page.tsx:1-257](file://app/admin/simple-dashboard/page.tsx#L1-L257)
- [lib/real-bookings.ts:1-120](file://lib/real-bookings.ts#L1-L120)
- [lib/bookings-storage.ts:1-191](file://lib/bookings-storage.ts#L1-L191)
- [app/lib/database.ts:1-433](file://app/lib/database.ts#L1-L433)
- [app/types/database.ts:1-146](file://app/types/database.ts#L1-L146)
- [app/components/FeedbackDisplay.tsx:1-155](file://app/components/FeedbackDisplay.tsx#L1-L155)

## Performance Considerations
- Data locality: Use localStorage for fast, offline-first experiences during development and prototyping.
- Supabase queries: Optimize dashboard stats by selecting only necessary fields and applying server-side limits.
- Client-side filtering: Keep filtering logic minimal and memoize computed values to reduce re-renders.
- Auto-refresh cadence: Tune polling intervals to balance responsiveness and resource usage.
- Caching strategies:
  - Short-term cache for dashboard stats with refresh on demand
  - Local storage for persistent client-side state
  - Server-side caching for frequently accessed reports
- Large dataset handling:
  - Paginate booking lists
  - Apply date-range and status filters
  - Use indexedDB for extended offline storage needs
- Export capabilities:
  - CSV export for booking lists and feedback
  - PDF generation for revenue and occupancy reports
  - Filtering by date range, room type, and status

## Troubleshooting Guide
Common issues and resolutions:
- Authentication timeouts: The AdminProtection component enforces short session timeouts and redirects to login when expired.
- Data loading errors: The feedback display component falls back to localStorage when Supabase queries fail.
- Dashboard not updating: Verify localStorage events are firing and polling intervals are active in the simple dashboard.
- Stats discrepancies: Ensure consistent status values ("confirmed", "cancelled") across data sources.

**Section sources**
- [app/admin/components/AdminProtection.tsx:14-48](file://app/admin/components/AdminProtection.tsx#L14-L48)
- [app/components/FeedbackDisplay.tsx:21-52](file://app/components/FeedbackDisplay.tsx#L21-L52)
- [app/admin/simple-dashboard/page.tsx:62-96](file://app/admin/simple-dashboard/page.tsx#L62-L96)

## Conclusion
The dashboard analytics and reporting system combines Supabase-backed production metrics with local storage for rapid iteration and offline support. It provides real-time booking statistics, revenue tracking, occupancy analytics, and interactive visualization components. By leveraging typed APIs, modular analytics libraries, and robust fallback mechanisms, the system delivers reliable insights while remaining extensible for future enhancements such as advanced filtering, export features, and enhanced caching strategies.