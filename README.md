# Audena - AI Voice Call Management System

A full-stack application for managing automated voice calls with real-time updates.

Added a folder to store references.md and Thought-process diagrams.

## Quick Demo

[Live Demo](https://audena.shashawk.com/)

Deployed in Raspberry pi 3 b with 1GB RAM


## Tech Stack

- **Backend**: FastAPI (Python 3.12)
- **Twilio Simulator**: FastAPI (Python 3.12)
- **Frontend**: React 19 + shadcn/ui
- **Queue**: RabbitMQ
- **Database**: SQLite
- **WebSocket**: Real-time updates

## Quick Start

clone the repository
```bash
git clone https://github.com/shashankusinggithub/audena-project.git
```


```bash
# Using Docker (Recommended)
docker-compose up --build

# IF the front end fails install 

# Access:
# Frontend: http://localhost
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



FLow

Backend server on startup, 
     it will create a SQLite database if it doesn't exist
     It will subscribe to webhooks from Twilio (This should be only one time process in real life but for simplicity, we are doing it on startup)
     It will start a WebSocket server to give real time update to frontend about the status as soon as it gets a webhook event from Twilio

Twilio will send a webhook event to the backend server when a call is initiated, answered, or completed.
     2 in 10 tasks will fail randomly to simulate real world scenario
     Backend server will publish a message to RabbitMQ for each event
     Twilio will consume the message and process it

Nginx will reverse proxy the requests to the backend server

Though process in [1st iteration](./Thought-Process/Iteration1.png)
Though process in [2nd iteration](./Thought-Process/Iteration2.drawio.png)
