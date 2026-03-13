# Konnect - Expert Mentorship Platform

## Complete Platform Documentation

---

## Overview

**Konnect** is a full-stack, real-time mentorship marketplace that connects users (mentees) with expert mentors for paid, per-minute chat and voice/video call sessions. The platform includes three applications and a shared backend.

| Service | Technology | Live URL |
|---------|-----------|----------|
| **Backend API** | Node.js + Express + Socket.IO | `https://konnect-api-852352036956.us-central1.run.app` |
| **User Frontend** | React + Vite + Tailwind | `https://reinovate-363109.web.app` |
| **Mentor Portal** | Next.js 16 + Tailwind | `https://konnect-mentor-852352036956.us-central1.run.app` |

**Firebase Project:** `reinovate-363109`

---

## Architecture

```
                    +-------------------+
                    |   Firebase Auth   |
                    |   Firestore DB    |
                    |   Cloud Storage   |
                    +--------+----------+
                             |
          +------------------+------------------+
          |                  |                  |
  +-------v-------+  +------v------+  +--------v--------+
  | User Frontend  |  | Backend API |  | Mentor Portal   |
  | (React + Vite) |  | (Express +  |  | (Next.js 16)    |
  | Firebase       |  |  Socket.IO) |  | Firebase        |
  | Hosting        |  | Cloud Run   |  | Cloud Run       |
  +-------+--------+  +------+------+  +--------+--------+
          |                  |                   |
          +--------+---------+-------------------+
                   |
            +------v------+
            |  Socket.IO  |
            | (Real-time) |
            | Chat, Calls |
            | Queue, Bill |
            +-------------+
```

---

## Tech Stack

### Backend
- **Runtime:** Node.js 18 + TypeScript
- **Framework:** Express.js
- **Real-time:** Socket.IO 4.8
- **Database:** Firebase Firestore
- **Auth:** Firebase Admin SDK
- **Security:** Helmet, CORS, express-rate-limit, Zod validation
- **Deployment:** Docker + Google Cloud Run

### User Frontend (career-cosmos-connect)
- **Framework:** React 18 + TypeScript + Vite
- **UI:** Tailwind CSS + shadcn/ui (80+ components)
- **State:** TanStack React Query + Context API
- **Real-time:** Socket.IO Client
- **Calling:** WebRTC (native RTCPeerConnection)
- **Auth:** Firebase Auth
- **Deployment:** Firebase Hosting

### Mentor Portal (konnect)
- **Framework:** Next.js 16 + TypeScript
- **UI:** Tailwind CSS + Framer Motion
- **State:** Zustand
- **Real-time:** Socket.IO Client
- **Calling:** WebRTC (RTCPeerConnection)
- **Auth:** Firebase Auth (Google OAuth + Email)
- **Icons:** Lucide React + React Icons
- **Deployment:** Docker + Google Cloud Run

---

## Page Directory

### User Frontend Pages

| # | Route | Page | Description |
|---|-------|------|-------------|
| 1 | `/` | **Home** | Marketing landing page with hero, category cards, expert previews, stats, testimonials, CTA |
| 2 | `/login` | **Login** | Email/password login + Google Sign-In |
| 3 | `/signup` | **Signup** | User registration with name, email, password + Google Sign-Up |
| 4 | `/onboarding` | **Onboarding** | 3-step profile setup: Profile info, Interest categories (12 options), Goals (8 options) |
| 5 | `/explore` | **Explore Mentors** | Browse mentors with search, specialty filter tabs, sort (rating/price/popularity), online toggle |
| 6 | `/expert/:id` | **Mentor Profile** | Detailed mentor view: bio, specialties, rating, reviews, pricing, Chat/Call/Video booking buttons |
| 7 | `/chat` | **Chat & Calls** | Real-time chat + voice/video calls, file attachments, billing bar, queue status, review modal |
| 8 | `/dashboard` | **Dashboard** | Mentor-only: online toggle, stats cards, session history, pending requests, earnings |
| 9 | `/wallet` | **Wallet** | Balance card, quick recharge (100/200/500/1000), transaction history with type filters |
| 10 | `/profile` | **Profile** | Edit name, phone, bio; role/verified badges; notifications; change password; delete account |
| 11 | `/admin` | **Admin Layout** | Protected admin wrapper with sidebar navigation |
| 12 | `/admin` (index) | **Admin Dashboard** | Live stats (online mentors, active sessions, revenue), capacity gauges, live session monitor |
| 13 | `/admin/mentors` | **Mentor Management** | Application pipeline (Applied -> Verified -> Call Scheduled -> Approved), bulk import, export |
| 14 | `/admin/users` | **User Management** | User list, search/filter, session & transaction history per user |
| 15 | `/admin/sessions` | **Session Management** | All sessions with filters, active sessions view, refund capability |
| 16 | `/admin/analytics` | **Analytics** | Historical charts and trends (Recharts) |
| 17 | `/admin/finance` | **Finance** | Revenue tracking, payment settlements, financial reports |
| 18 | `/admin/settings` | **Settings** | Platform configuration management |

### Mentor Portal Pages

| # | Route | Page | Description |
|---|-------|------|-------------|
| 1 | `/` | **Landing** | Hero + How it Works (3 steps) + Stats (200+ mentors, 50k+ sessions) + Features (6 cards) + Testimonials + CTA |
| 2 | `/auth/login` | **Login** | Email/password + Google Sign-In (popup with redirect fallback) + Demo mode |
| 3 | `/auth/signup` | **Signup** | Full name, email, password + Google Sign-Up + Demo mode |
| 4 | `/onboarding` | **Mentor Registration** | 4-step wizard: Professional Info (title, company, exp, bio, price, specialties, languages) -> Social Links (phone, LinkedIn, portfolio) -> Resume Upload (drag-drop to Firebase Storage) -> Review & Submit |
| 5 | `/dashboard` | **Mentor Dashboard** | Online/offline toggle, earnings cards (today/week/month/total), recent sessions, pending requests, quick stats, withdrawal button |
| 6 | `/chat` | **Chat List** | WhatsApp-style conversation list with search, online status, unread badges, timestamps |
| 7 | `/chat/[chatId]` | **Chat & Calls** | Full messaging + WebRTC voice/video calls, incoming call UI (accept/reject), mute/video toggles, billing bar, session timer, system messages |
| 8 | `/explore` | **Explore Mentors** | Browse mentors with category filter tabs, price slider, rating filter, online toggle, sort options |
| 9 | `/mentor/[id]` | **Mentor Profile** | Avatar, specialties, rating, reviews, bio, languages, price, chat/call actions |
| 10 | `/wallet` | **Wallet** | Balance card, quick recharge, transaction history, add money modal |
| 11 | `/profile` | **Profile Settings** | Avatar, name, email, role badge, edit fields, change password, notifications |
| 12 | `/admin` | **Admin Panel** | Stats cards, tabbed interface (Users, Mentors, Categories, Analytics) |
| 13 | `/api/payments` | **Payment API** | Server-side payment processing endpoint |
| 14 | `/api/webhooks` | **Webhook Handler** | Payment/event webhook receiver |

---

## Backend API Endpoints

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/verify` | Required | Verify Firebase token, create/get user profile |

### Experts / Mentors
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/experts` | Public | List experts (filters: specialty, available, minRating, maxPrice, search, sort) |
| GET | `/api/experts/specialties` | Public | List all specialties |
| GET | `/api/experts/:id` | Public | Get expert by ID |
| GET | `/api/experts/:id/reviews` | Public | Get expert reviews (paginated) |
| POST | `/api/experts/register` | Required | Mentor self-registration with onboarding data |
| GET | `/api/experts/me` | Required | Get own mentor profile |
| PUT | `/api/experts/me/resume` | Required | Update resume URL |
| PUT | `/api/experts/:id` | Required | Update own mentor profile |
| POST | `/api/experts` | Admin | Create new expert |
| DELETE | `/api/experts/:id` | Admin | Delete expert |

### Wallet
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/wallet` | Required | Get wallet balance |
| POST | `/api/wallet/deposit` | Required | Add funds (max 10,000) |
| POST | `/api/wallet/withdraw` | Required | Withdraw funds (max 10,000) |
| GET | `/api/wallet/transactions` | Required | Get transaction history (paginated) |
| GET | `/api/wallet/transactions/:id` | Required | Get transaction by ID |

### Sessions
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/sessions` | Required | Book session (expertId, type, scheduledAt, duration) |
| GET | `/api/sessions` | Required | Get user sessions (filters: status, type) |
| GET | `/api/sessions/:id` | Required | Get session by ID |
| POST | `/api/sessions/:id/cancel` | Required | Cancel session with refund |
| GET | `/api/sessions/expert` | Expert | Get expert's sessions |

### Admin
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/metrics` | Admin | Current platform metrics |
| GET | `/api/admin/metrics/history` | Admin | Historical metrics (configurable days) |
| GET | `/api/admin/metrics/peak` | Admin | Peak usage metrics |
| GET | `/api/admin/metrics/realtime` | Admin | Real-time state (online experts, active chats, queues) |
| GET | `/api/admin/users` | Admin | List users (search, role, pagination) |
| GET | `/api/admin/users/:uid` | Admin | User details + wallet + sessions |
| PATCH | `/api/admin/users/:uid` | Admin | Update user (role, disabled, name) |
| GET | `/api/admin/users/:uid/sessions` | Admin | User's sessions |
| GET | `/api/admin/users/:uid/transactions` | Admin | User's transactions |
| GET | `/api/admin/mentors` | Admin | List all mentors |
| PATCH | `/api/admin/mentors/:id` | Admin | Update mentor |
| POST | `/api/admin/mentors/bulk` | Admin | Bulk import mentors (CSV) |
| GET | `/api/admin/mentors/export` | Admin | Export mentors as CSV |
| POST | `/api/admin/mentors/:id/toggle-availability` | Admin | Toggle mentor online/offline |
| POST | `/api/admin/mentors/import-sheet` | Admin | Import from Google Sheets |
| GET | `/api/admin/mentors/import-status/:jobId` | Admin | Check import job progress |
| GET | `/api/admin/mentor-applications` | Admin | List mentor applications |
| PUT | `/api/admin/mentor-applications/:id/status` | Admin | Update application status |
| GET | `/api/admin/sessions` | Admin | List all sessions with filters |
| GET | `/api/admin/sessions/active` | Admin | Active sessions in real-time |
| POST | `/api/admin/sessions/:id/refund` | Admin | Refund a session |
| GET | `/api/admin/transactions` | Admin | List transactions |
| GET | `/api/admin/revenue` | Admin | Revenue breakdown (daily/weekly/monthly) |
| POST | `/api/admin/wallets/:userId/adjust` | Admin | Manual wallet adjustment |
| GET | `/api/admin/config` | Admin | Platform configuration |
| PATCH | `/api/admin/config` | Admin | Update configuration |

### System
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api` | API documentation |

---

## Real-Time Features (Socket.IO)

### Connection Flow
1. Client connects with Firebase auth token in handshake
2. Server verifies token via Firebase Admin SDK
3. Client registers as `user` or `expert` with name

### Chat Events

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `register` | Client -> Server | `{ userId, userType, name }` | Register user on platform |
| `get-online-experts` | Client -> Server | - | Request available experts |
| `online-experts` | Server -> Client | `Expert[]` | List of available experts |
| `expert-online` | Server -> Client | `Expert` | Expert came online |
| `expert-offline` | Server -> Client | `{ expertId }` | Expert went offline |
| `request-chat` | Client -> Server | `{ userId, userName, expertId }` | Request chat with expert |
| `queue-joined` | Server -> Client | `{ position, expertId }` | Added to queue |
| `queue-status` | Server -> Client | `{ position }` | Queue position update |
| `chat-started` | Server -> Client | `{ chatId, expert/user, pricePerMin }` | Chat session begun |
| `chat-message` | Client -> Server | `{ chatId, message, senderId }` | Send message |
| `new-message` | Server -> Client | `{ chatId, message, senderId, timestamp }` | Receive message |
| `billing-update` | Server -> Client | `{ chatId, duration, totalCharged, balance }` | Per-minute billing |
| `chat-warning` | Server -> Client | `{ type: 'low-balance'/'zero-balance' }` | Balance warnings |
| `chat-ended` | Server -> Client | `{ chatId, duration, totalCharged, reason }` | Chat ended |
| `end-chat` | Client -> Server | `{ chatId }` | Client ends chat |
| `leave-queue` | Client -> Server | `{ userId, expertId }` | Leave waiting queue |

### Voice/Video Call Events (WebRTC Signaling)

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `call-offer` | Client -> Server | `{ chatId, offer, callType }` | SDP offer + call type |
| `call-offer` | Server -> Client | `{ chatId, offer, callType, callerId }` | Relayed to other participant |
| `call-answer` | Client -> Server | `{ chatId, answer }` | SDP answer |
| `call-answer` | Server -> Client | `{ chatId, answer }` | Relayed to caller |
| `ice-candidate` | Bidirectional | `{ chatId, candidate }` | ICE candidate exchange |
| `call-ended` | Bidirectional | `{ chatId, reason? }` | Call terminated |
| `call-rejected` | Client -> Server | `{ chatId }` | Call declined |

### WebRTC Call Flow
```
  User (Caller)                    Backend                    Mentor (Callee)
       |                              |                              |
       |-- call-offer {offer, type} ->|                              |
       |                              |-- call-offer {offer, type} ->|
       |                              |                              |
       |                              |<- call-answer {answer} ------|
       |<- call-answer {answer} ------|                              |
       |                              |                              |
       |-- ice-candidate ------------>|-- ice-candidate ------------>|
       |<- ice-candidate -------------|<- ice-candidate -------------|
       |                              |                              |
       |<==========  P2P Audio/Video Connection  ==========>|
       |                              |                              |
       |-- call-ended --------------->|-- call-ended --------------->|
```

---

## Database Schema (Firestore)

### Collections

#### `users`
```json
{
  "id": "firebase-uid",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "user | expert | admin",
  "disabled": false,
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
```

#### `experts`
```json
{
  "id": "auto-generated",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "title": "Senior Software Engineer",
  "company": "Google",
  "experience": 8,
  "rating": 4.8,
  "orders": 150,
  "pricePerMin": 15,
  "specialties": ["Tech Interviews", "System Design"],
  "languages": ["English", "Hindi"],
  "imageUrl": "https://...",
  "bio": "Experienced mentor...",
  "available": true,
  "firebaseUid": "firebase-uid",
  "mentorStatus": "applied | documents_verified | call_scheduled | call_done | approved | rejected",
  "onboardingData": {
    "phone": "+91...",
    "linkedinUrl": "https://linkedin.com/in/...",
    "portfolioUrl": "https://...",
    "resumeUrl": "https://storage.googleapis.com/...",
    "appliedAt": "2025-01-01T00:00:00Z",
    "adminNotes": "...",
    "rejectionReason": "..."
  },
  "reviews": [],
  "createdAt": "2025-01-01T00:00:00Z"
}
```

#### `wallets`
```json
{
  "id": "user-id",
  "userId": "firebase-uid",
  "balance": 500,
  "currency": "INR",
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
```

#### `transactions`
```json
{
  "id": "auto-generated",
  "walletId": "wallet-id",
  "userId": "firebase-uid",
  "type": "deposit | withdraw | payment | earning | refund",
  "amount": 100,
  "currency": "INR",
  "status": "pending | completed | failed",
  "description": "Wallet recharge",
  "referenceId": "session-id",
  "createdAt": "2025-01-01T00:00:00Z"
}
```

#### `sessions`
```json
{
  "id": "auto-generated",
  "userId": "firebase-uid",
  "expertId": "expert-id",
  "type": "chat | call",
  "status": "pending | confirmed | in_progress | completed | cancelled",
  "scheduledAt": "2025-01-01T10:00:00Z",
  "duration": 30,
  "totalAmount": 450,
  "transactionId": "txn-id",
  "createdAt": "2025-01-01T00:00:00Z"
}
```

#### `platform_config`
```json
{
  "maxConcurrentMentors": 50,
  "maxSessionsPerMentor": 1,
  "defaultPricePerMin": 10,
  "platformFeePercent": 20,
  "maxSessionDurationMins": 120
}
```

---

## Mentor Onboarding Pipeline

```
Applied --> Documents Verified --> Call Scheduled --> Call Done --> Approved
                                                                      |
                                                                  Rejected
```

1. **Applied** - Mentor submits registration form (profile, links, resume)
2. **Documents Verified** - Admin reviews uploaded documents
3. **Call Scheduled** - Admin schedules verification call
4. **Call Done** - Verification call completed
5. **Approved** - Mentor can go online and accept sessions
6. **Rejected** - Application denied with reason

---

## Billing System

### Per-Minute Chat Billing
1. User initiates chat with mentor
2. System validates wallet balance (minimum 1 minute)
3. Chat starts - **first minute charged immediately**
4. Every 60 seconds, `pricePerMin` is deducted from user wallet
5. **Low balance warning** at < 3 minutes remaining
6. **Zero balance warning** at 0 balance with 30-second grace period
7. Auto-disconnect if balance remains zero after grace period
8. Session summary sent with total duration and charges

### Currency
All transactions are in **INR (Indian Rupees)**

### Wallet Operations
- **Deposit:** Add funds (max 10,000 per transaction)
- **Withdraw:** Withdraw earnings (max 10,000 per transaction)
- **Payment:** Auto-deducted during chat sessions
- **Earning:** Credited to mentor wallet after session
- **Refund:** Admin-initiated refund for cancelled sessions

---

## Deployment

### Backend (Cloud Run)
```bash
# Build Docker image
docker build --platform linux/amd64 -t us-central1-docker.pkg.dev/reinovate-363109/cloud-run-source-deploy/konnect-api:latest .

# Push to Artifact Registry
docker push us-central1-docker.pkg.dev/reinovate-363109/cloud-run-source-deploy/konnect-api:latest

# Deploy to Cloud Run
gcloud run deploy konnect-api \
  --image us-central1-docker.pkg.dev/reinovate-363109/cloud-run-source-deploy/konnect-api:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --session-affinity \
  --timeout 3600 \
  --min-instances 1
```

### User Frontend (Firebase Hosting)
```bash
cd career-cosmos-connect
npm run build
firebase deploy --only hosting
```

### Mentor Portal (Cloud Run)
```bash
# Build Docker image
docker build --platform linux/amd64 -t us-central1-docker.pkg.dev/reinovate-363109/cloud-run-source-deploy/konnect-mentor:latest .

# Push and deploy
docker push us-central1-docker.pkg.dev/reinovate-363109/cloud-run-source-deploy/konnect-mentor:latest

gcloud run deploy konnect-mentor \
  --image us-central1-docker.pkg.dev/reinovate-363109/cloud-run-source-deploy/konnect-mentor:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated
```

---

## Security

### Authentication
- Firebase Authentication (Email/Password + Google OAuth)
- Bearer token required for all authenticated endpoints
- Role-based access control (user, expert, admin)

### API Security
- **Helmet** - HTTP security headers
- **CORS** - Configured origins
- **Rate Limiting:**
  - General: 100 requests / 15 min
  - Auth: 20 attempts / 15 min
  - Admin: 500 requests / 15 min
- **Zod Validation** - All request bodies validated
- **Socket.IO Auth** - Firebase token verification on connection

### WebRTC
- STUN servers: Google public STUN (`stun.l.google.com:19302`)
- Peer-to-peer encrypted media streams
- No media passes through server (only signaling)

---

## Key Features Summary

| Feature | User Frontend | Mentor Portal | Backend |
|---------|:---:|:---:|:---:|
| Email/Password Auth | Yes | Yes | Yes |
| Google OAuth | Yes | Yes | Yes |
| Mentor Discovery & Search | Yes | Yes | Yes |
| Real-time Chat | Yes | Yes | Yes |
| Voice Calls (WebRTC) | Yes | Yes | Signaling |
| Video Calls (WebRTC) | Yes | Yes | Signaling |
| Per-minute Billing | Yes | - | Yes |
| Wallet & Transactions | Yes | Yes | Yes |
| Queue System | Yes | Yes | Yes |
| Mentor Onboarding | - | Yes (4-step) | Yes |
| Admin Dashboard | Yes | Yes | Yes |
| Mentor CRM Pipeline | Yes | - | Yes |
| Bulk Import (CSV/Sheets) | Yes | - | Yes |
| Session Management | Yes | Yes | Yes |
| Reviews & Ratings | Yes | Yes | Yes |
| File Attachments | Yes | - | - |

---

*Built with Firebase, React, Next.js, Express, Socket.IO, and WebRTC*
*Deployed on Google Cloud Run and Firebase Hosting*
