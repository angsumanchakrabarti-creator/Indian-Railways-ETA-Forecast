# Indian Railways – ETA Forecast System

A passenger-focused web app for **Dynamic Forecast of Expected Time of Arrival (ETA)** for coaching trains.

## Features

- **Login & Sign Up** – Create an account or use the demo account
- **Ticket Status** – Shows if your ticket is booked; links to IRCTC if not
- **16-City Corridor Map** – 16 connected Indian railway cities with color-coded delays, updated every 30s
- **Train Tracking** – Station-by-station ETA with predicted arrivals
- **24 Train Records** – distinct intercity Express, Rajdhani, Shatabdi, and Duronto services across the four metros
- **Real-time Simulation** – Delays and train position update automatically

## Demo Account (Ticket Booked)

| Field    | Value                    |
|----------|--------------------------|
| Email    | `demo@railways.gov.in`   |
| Password | `demo123`                |

Demo account has a confirmed booking on **Train 12345 Poorva Express** (PNR: 4521987634), on the Delhi–Kolkata–Chennai route.

## New Sign-ups

New accounts have **no ticket booked** — a "Book Your Ticket" button redirects to [IRCTC](https://www.irctc.co.in/nget/train).

## Getting Started

```bash
cd railway-eta-forecast
npm install
npm run dev
```

Open http://localhost:5173

## Desktop Shortcut

Double-click **Indian Railways ETA** on your Desktop to launch the app.

## Scripts

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run test     # Run unit tests
npm run preview  # Preview production build
```

## Tech Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · React Router · Vitest


