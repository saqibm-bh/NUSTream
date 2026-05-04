<div align="center">

# NUSTream

### A video conferencing webapp exclusively for NUST

[![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![NextAuth](https://img.shields.io/badge/NextAuth-Google_OAuth-0F172A?style=flat-square)](https://next-auth.js.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![ZEGOCLOUD](https://img.shields.io/badge/ZEGOCLOUD-WebRTC-2563EB?style=flat-square)](https://www.zegocloud.com/)
[![Excalidraw](https://img.shields.io/badge/Excalidraw-Whiteboard-6965DB?style=flat-square)](https://excalidraw.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com/)

</div>

![NUSTream Hero Screenshot](link)

NUSTream is a full-stack video conferencing and academic meeting platform built for the NUST community. It combines institutional Google authentication, real-time video sessions, a pre-join device lobby, attendance export, reactions, and a collaborative whiteboard inside a clean, production-minded Next.js application.

This project shows product thinking, frontend discipline, and systems awareness in one build: secure route protection, server-generated video tokens, serverless-safe MongoDB connections, and a meeting flow designed to feel calm and obvious for the user.

## Why It Stands Out

- Institutional access control: Only approved NUST and SEECS Google accounts can sign in, which makes the platform immediately usable in a real university environment.
- Real meeting flow, not just real-time transport: Users move through a dedicated pre-join lobby before entering the live room, with mic and camera decisions handled at the right moment.
- Product-owned UX on top of the video SDK: Reactions, attendance export, theme support, and whiteboard access are layered into the experience as first-class features.
- Production-aware backend decisions: MongoDB uses a global cache strategy for serverless runtimes, and ZEGOCLOUD tokens are generated server-side rather than exposing sensitive credentials to the client.
- Strong frontend framing: The landing page, dashboard, and meeting surfaces are each designed around a different user job instead of being collapsed into one overloaded screen.

## Screenshots

Use these exact screenshot slots to make the repository scan well for recruiters:

**Landing / Sign-In**
![Landing Screenshot](link)  
Recommended image: the branded NUSTream landing page with the Google sign-in panel visible.

**Dashboard View**
![Dashboard Screenshot](link)  
Recommended image: authenticated dashboard showing the welcome hero, meeting actions, and the agenda panel.

**Meeting Lobby**
![Meeting Lobby Screenshot](link)  
Recommended image: pre-join screen with camera preview, mic/camera toggles, and the room entry CTA.

**Active Video Call**
![Active Meeting Screenshot](link)  
Recommended image: live meeting screen with the ZEGOCLOUD canvas, attendance button, whiteboard button, reactions button, and network badge.

**Whiteboard**
![Whiteboard Screenshot](link)  
Recommended image: Excalidraw whiteboard open during a session.

## Core Features

- Google login with domain restriction  
  Users authenticate through Google, but only approved institutional accounts are allowed through. That keeps the login flow simple while enforcing real access boundaries.

- Instant session creation and join-by-link flow  
  A user can start a room immediately, generate a link for later, or join a room by code or full invite URL.

- Pre-join meeting lobby  
  The meeting experience starts with device preparation, not confusion. Users can preview camera state, manage mic and camera toggles, and enter the room when ready.

- Real-time group video  
  The call layer is powered by ZEGOCLOUD, while the surrounding UX is controlled by the app.

- Attendance tracking and CSV export  
  Join and leave events are recorded during the session and can be exported as a clean attendance sheet.

- In-meeting reactions and whiteboard  
  Sessions support quick visual feedback plus a larger collaboration surface for explanation-heavy conversations.

- Theme support and responsive UI  
  The interface supports light and dark themes and adapts well to both desktop and mobile screens.

## Frontend and UX

One of the strongest parts of this project is that the interface is treated as product design work, not just component assembly.

### 1. The product is broken into clear surfaces

- Landing page: trust, access, and first entry
- Dashboard: create, join, and orient
- Meeting lobby: prepare before entering
- Live room: stay focused during collaboration

That separation matters because each page solves a different problem. Users never have to make every decision at once.

### 2. The meeting lobby improves confidence before the call starts

Instead of throwing users straight into a live room, NUSTream gives them a staging area. That sounds small, but it changes the experience. A student can check camera state, mute status, and room context before appearing in front of other people.

### 3. The app owns the important controls

The live meeting surface is not left entirely to the SDK. Reactions, attendance export, whiteboard access, and theme behavior are shaped at the application layer so the product feels intentional and consistent.

### 4. The UI is designed to feel academic, not generic

The visual language stays structured and calm: clear spacing, predictable panels, minimal clutter, and task-focused actions. That matters for education software, where the interface should support concentration instead of competing with it.

## Tech Stack

**Frontend**

- Next.js 14
- React 18
- Tailwind CSS
- Radix UI
- next-themes
- React Toastify

**Backend and platform**

- Next.js App Router API routes
- NextAuth.js
- MongoDB
- Mongoose
- ZEGOCLOUD UIKit Prebuilt

**Collaboration tools**

- Excalidraw for whiteboarding
- Custom attendance export and in-room reactions

## Technical Highlights

- Serverless MongoDB caching: The database connection uses a global Mongoose cache in `src/lib/dbConnect.js`, which helps prevent connection spikes on Vercel.
- Server-side token generation: ZEGOCLOUD session tokens are created in an API route after session validation, so the frontend never needs the server secret.
- Protected meeting routes: Middleware blocks unauthenticated access to `/video-meeting/*` before the meeting UI is even reached.
- Auth tied to institution rules: The sign-in callback provisions users and rejects accounts outside approved university domains.
- UI layered on top of the call SDK: The app adds custom product behavior around the base video layer instead of accepting a default meeting shell.

## Why This Stack?

Next.js 14 gives the project one coherent place for UI, routing, API logic, and deployment. That keeps the codebase compact and easier to reason about.

MongoDB and Mongoose fit the current data model well, especially for lightweight user records and auth-backed persistence. The key detail is not just the database choice, but the connection strategy: serverless caching prevents the kind of connection churn that can quietly break production systems.

ZEGOCLOUD handles the real-time media layer, which lets the project focus engineering effort on the user experience around the call. In practice, that means the interesting work happens in the product layer: meeting flow, lobby behavior, attendance logic, and safe token delivery.

## Architecture at a Glance

```text
Next.js 14 App Router
        |
        |-- Landing + Dashboard UI
        |-- Login / Unauthorized / Error states
        |-- Dynamic meeting route: /video-meeting/[roomId]
        |
        |-- NextAuth
        |     Google OAuth + domain restriction
        |
        |-- API Routes
        |     /api/auth/[...nextauth]
        |     /api/zego/generate-token
        |
        |-- MongoDB / Mongoose
        |     User persistence
        |     Serverless-safe cached connection
        |
        `-- ZEGOCLOUD
              Real-time group video + server-generated tokens
```

## Project Structure

```text
NUSTream/
|-- public/
|-- src/
|   |-- app/
|   |   |-- api/
|   |   |-- components/
|   |   |-- user-auth/
|   |   |-- unauthorized/
|   |   `-- video-meeting/[roomId]/
|   |-- components/
|   |-- hooks/
|   |-- lib/
|   |-- models/
|   `-- middleware.js
|-- .env.example
|-- next.config.mjs
|-- package.json
`-- README.md
```

## Run It Locally

### Prerequisites

- Node.js 18+
- A MongoDB Atlas connection string
- Google OAuth credentials
- A ZEGOCLOUD project

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd NUSTream
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env.local`

Start from the provided template:

```bash
copy .env.example .env.local
```

Fill in the required values:

```env
NEXTAUTH_URL=
NEXTAUTH_SECRET=
MONGODB_URI=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXT_PUBLIC_ZEGO_APP_ID=
ZEGO_APP_ID=
ZEGO_SERVER_SECRET=
```

### 4. Start the development server

```bash
npm run dev
```

### 5. Open the app

```bash
http://localhost:3000
```

## Deployment

NUSTream is structured for Vercel deployment. The project uses App Router conventions, environment-based secrets, server-side token generation, and a MongoDB connection pattern suitable for serverless runtimes.

## Contact

Built by: `Saqib Mahmood`  
University / Semester: `CS 6th Semester - SEECS - NUST - Islamabad, Pakistan`  
LinkedIn: `https://www.linkedin.com/in/saqib-mahmood-b604651a9/`

## License

Add your preferred license here.
