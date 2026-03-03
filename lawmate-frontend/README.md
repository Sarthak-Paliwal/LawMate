# LawMate Frontend

React (Vite) + Tailwind CSS + React Router + Axios. i18n (English/Hindi).

## Structure

- `src/api/` – Axios instance (auth header, base URL)
- `src/components/` – Layout, ProtectedRoute, BookAdvocateModal
- `src/context/` – AuthContext
- `src/i18n/` – translations (en, hi), LanguageContext
- `src/pages/` – Home, Login, Register, Dashboard, LegalQuery, LegalActs, LegalActDetail, Advocates, AdvocateProfile, Bookings

## Setup

```bash
npm install
npm run dev
```

Uses Vite proxy: `/api` → `http://localhost:5000`. Run backend on port 5000.
