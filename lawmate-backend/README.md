# LawMate Backend

Express.js API with MongoDB, JWT auth, MVC structure, and service layer.

## Structure

- `src/config/` – DB connection
- `src/controllers/` – Request handlers
- `src/models/` – Mongoose models (User, LegalQuery, LegalAct, AdvocateProfile, Booking)
- `src/routes/` – Route definitions
- `src/services/` – Business logic
- `src/middleware/` – auth (JWT), errorHandler
- `scripts/seed.js` – Seed sample legal acts

## Setup

```bash
npm install
cp .env.example .env
# Set MONGODB_URI and JWT_SECRET in .env
npm run seed
npm run dev
```

## Seed

`npm run seed` inserts sample legal acts (IPC, CrPC, Indian Contract Act, Hindu Marriage Act, Consumer Protection Act) with sections.
