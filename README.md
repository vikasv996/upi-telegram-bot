# UPI Payment Telegram Bot

A Telegram-based payment assistant built with **Node.js**, **TypeScript**, **TypeORM**, and **SQLite** that generates UPI payment requests on demand. Users interact through a conversational Telegram interface to generate UPI deep links, QR codes, and shareable payment URLs — without manually opening any UPI app.

---

## Features

- **Interactive bot workflow** — Conversational `/pay` command guides users step by step
- **UPI deep link generation** — Compatible with GPay, PhonePe, Paytm, and all UPI apps
- **Dynamic QR code generation** — Scannable QR returned directly in Telegram chat
- **Shareable payment URLs** — Redirect endpoints for sharing payment requests externally
- **Session-based state management** — Persistent conversation state stored in SQLite via TypeORM
- **Alias support** *(planned)* — Save frequently used recipients (e.g. `rent → landlord@upi`)
- **Payment history** *(planned)* — Track all generated payment requests via `/history`
- **Scheduled reminders** *(planned)* — `/schedule rent 15000 1` for recurring payments

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Language | TypeScript |
| Framework | Express.js |
| Database | SQLite |
| ORM | TypeORM |
| Bot Integration | Telegram Bot API |
| Payment | UPI Deep Links |
| QR Generation | QR Code library |

---

## How It Works

```
User
 ↓
Telegram Bot
 ↓
Interactive Conversation (collect UPI ID, name, amount, note)
 ↓
Store session state in SQLite
 ↓
Generate UPI Deep Link
 ↓
Generate QR Code
 ↓
Return QR + Payment Link + Shareable URL to user
```

---

## Example User Journey

```
/pay
 ↓ Enter UPI ID       → example@upi
 ↓ Enter Recipient    → John Doe
 ↓ Enter Amount       → 500
 ↓ Enter Note         → Dinner split

Bot returns:
  ✅ UPI Payment Link
  ✅ QR Code image
  ✅ Shareable Payment URL
```

---

## Database Entities

| Entity | Purpose |
|---|---|
| `User` | Stores Telegram user information |
| `Session` | Maintains conversational state between messages |
| `Alias` | Stores saved recipients (e.g. `dad → dad@upi`) |
| `Payment` | Stores generated payment records for history and redirection |

---

## Getting Started

### Prerequisites

- Node.js v18+
- npm
- A Telegram Bot Token (via [@BotFather](https://t.me/botfather))

### Installation

```bash
# Clone the repository
git clone https://github.com/vikasv996/upi-telegram-bot.git
cd upi-telegram-bot

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Add your TELEGRAM_BOT_TOKEN in .env

# Run in development
npm run dev

# Build and run in production
npm run build
npm start
```

---

## Roadmap

- [ ] Alias management (`/alias add`, `/alias list`, `/alias delete`)
- [ ] Payment history (`/history`)
- [ ] Scheduled payment reminders (`/schedule rent 15000 1`)
- [ ] Migrate to PostgreSQL for production
- [ ] Switch from polling to Telegram Webhooks
- [ ] Payment analytics dashboard

---

## Contributing

Contributions are welcome! Fork the repo and submit a pull request for any improvements or new features.

---

## License

MIT
