# Backend Webhook Service

A Node.js backend service built with Express, MongoDB, and SQLite that handles secure webhook ingestion, message storage, metrics, and authentication.  
The service is production-ready and supports both **local Node.js execution** and **Docker / Docker Compose deployment**.

---

## 🚀 Features

- 🔐 HMAC-secured Webhook Endpoint
- 📩 Idempotent Message Ingestion (prevents duplicate messages)
- 🗄️ SQLite for webhook message storage
- 🧾 MongoDB for users & contacts
- 📊 Metrics Endpoint (Prometheus-style)
- ❤️ Health Checks (`/health/live`, `/health/ready`)
- 🔑 JWT Authentication
- 📜 Structured JSON Logging
- 🐳 Docker & Docker Compose Support

---

## 🧱 Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- SQLite (better-sqlite3)
- JWT (jsonwebtoken)
- Crypto (HMAC SHA256)
- Docker / Docker Compose

---

## 📂 Project Structure

backend-webhook-service/
├── controllers/
│   ├── userController.js
│   └── messageController.js
├── middleware/
│   ├── authMiddleware.js
│   └── webhookVerify.js
├── models/
│   ├── userModel.js
│   └── contactModel.js
├── routes/
│   ├── userRoutes.js
│   ├── messageRoutes.js
│   └── webhookRoutes.js
├── utils/
│   ├── logger.js
│   └── metrics.js
├── health/
│   ├── live.js
│   └── ready.js
├── data/
│   └── app.db
├── server.js
├── package.json
├── Dockerfile
├── docker-compose.yml
├── .env
└── README.md

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

PORT=5001  
CONNECTION_STRING=mongodb://localhost:27017/webhook_db  
ACCESS_TOKEN_SECRET=your_jwt_secret  
WEBHOOK_SECRET=your_webhook_secret  
SQLITE_DB_PATH=./data/app.db  

### Environment Variable Explanation

- PORT → Server port
- CONNECTION_STRING → MongoDB connection URI
- ACCESS_TOKEN_SECRET → Secret key used to sign JWT tokens
- WEBHOOK_SECRET → Secret used for webhook HMAC verification
- SQLITE_DB_PATH → SQLite database file path

---

## ▶️ Run Locally (Without Docker)

### Install dependencies

npm install  

### Start server

node server.js  

Server will start at:

http://localhost:5001

---

## 🧪 Health Check APIs

GET /health/live  
GET /health/ready  

---

## 📩 Webhook API

### Endpoint

POST /webhook  

### Headers

X-Signature: <HMAC SHA256 signature>  
Content-Type: application/json  

### Body Example

{
  "message_id": "msg-001",
  "from": "919999999999",
  "to": "918888888888",
  "ts": "2024-01-01T10:00:00Z",
  "text": "Hello from webhook"
}

### Notes

- `message_id` must be unique
- Duplicate messages are ignored (idempotent behavior)
- Signature is verified using `WEBHOOK_SECRET`

---

## 📊 Metrics Endpoint

GET /metrics  

### Sample Output

http_requests_total{path="/webhook",status="200"} 1  
webhook_requests_total{result="created"} 1  

---

## 📈 Message APIs

GET /messages  
GET /messages?from=919999999999  
GET /messages?q=Hello  

---

## 📊 Stats API

GET /stats  

Returns aggregated message statistics.

---

## 👤 Authentication APIs

POST /api/users/register  
POST /api/users/login  
GET /api/users/current  

### Authorization Header

Authorization: Bearer <JWT_TOKEN>

---

## 🐳 Docker Support

### Dockerfile

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5001

CMD ["node", "server.js"]

---

## 🧩 Docker Compose Setup

### docker-compose.yml

version: "3.8"

services:
  app:
    build: .
    ports:
      - "5001:5001"
    env_file:
      - .env
    volumes:
      - ./data:/app/data
    depends_on:
      - mongo

  mongo:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:

---

## ▶️ Run with Docker Compose

docker-compose up --build  

Application will be available at:

http://localhost:5001

---

## 🛡️ Security Notes

- JWT secrets and webhook secrets must never be committed
- Use HTTPS in production
- Rotate secrets regularly
- Validate webhook payload signatures strictly

---

## ✅ Summary

This backend service provides a secure, scalable webhook ingestion system with authentication, metrics, health checks, and persistent storage.  
It is ready for **local development**, **Docker-based deployment**, and **production environments**.

