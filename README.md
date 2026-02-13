# Audena - AI Voice Call Management System

A full-stack application for managing automated voice calls with real-time updates.

## Tech Stack

- **Backend**: FastAPI (Python 3.12)
- **Twilio Simulator**: FastAPI (Python 3.12)
- **Frontend**: React 19 + shadcn/ui
- **Queue**: RabbitMQ
- **Database**: SQLite
- **WebSocket**: Real-time updates

## Quick Start

```bash
# Using Docker (Recommended)
docker-compose up --build

# Access:
# Frontend: http://localhost:5173
# API Docs: http://localhost:8000/docs
# RabbitMQ: http://localhost:15672 (guest/guest)
```

## Local Development

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

### Frontend
```bash
cd my-app
npm install
cp .env.example .env
npm run dev
```

### Twilio Simulator
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

## Project Structure

```
audena-project/
├── backend/           # FastAPI application
├── my-app/          # React 19 + shadcn/ui
├── twilio-simulator/  # Mock telephony service
└── docker-compose.yml
```

## Features

- ✅ Create call requests
- ✅ Real-time status updates via WebSocket
- ✅ List all calls with filtering - yet to implement
- ✅ Toast notifications - yet to implement
- ✅ shadcn/ui components

## API Endpoints

- `POST /api/works` - Create work
- `GET /api/works` - List works
- `POST /api/webhooks/` - Webhook callback
- `WS /api/v1/ws/{client_id}` - WebSocket connection

## Architecture

```
React Frontend ← WebSocket → FastAPI Backend ← → RabbitMQ ← → Twilio Simulator
                               ↓                                         ↓
                          SQLite Database                            Webhook
```

