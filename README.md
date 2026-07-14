# ☁️ CloudShare

CloudShare is a full-stack cloud file sharing platform with secure authentication, file upload support, and payment integration.
It combines a **Spring Boot + MongoDB backend** with a **React + Vite frontend** for a modern, scalable experience.

---

## 📌 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup-spring-boot)
  - [Frontend Setup](#frontend-setup-react--vite)
- [Environment Variables](#-environment-variables)
- [Run with Docker](#-run-with-docker)
- [Available Scripts](#-available-scripts)
- [API Notes](#-api-notes)
- [Roadmap Ideas](#-roadmap-ideas)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 Features

- ✅ Full-stack architecture (Java backend + React frontend)
- ✅ Token-based authentication with **Clerk**
- ✅ File upload support with multipart configuration
- ✅ MongoDB persistence layer
- ✅ Razorpay payment integration
- ✅ Dockerized backend deployment support
- ✅ Modern frontend tooling (Vite, ESLint, Tailwind CSS)

---

## 🧰 Tech Stack

### Backend
- **Java 21**
- **Spring Boot 4.x**
- **Spring Web MVC**
- **Spring Data MongoDB**
- **Spring Security**
- **JWT (jjwt)**
- **Razorpay Java SDK**

### Frontend
- **React 19**
- **Vite 8**
- **React Router 7**
- **Axios**
- **Tailwind CSS 4**
- **Clerk React SDK**

### DevOps / Runtime
- **Docker** (multi-stage build for backend)

---

## 🗂 Project Structure

```text
CloudShare/
├── src/                          # Spring Boot backend source
│   └── main/
│       ├── java/
│       │   └── cloudshare/
│       └── resources/
│           └── application.properties
├── Frontend/
│   └── cloudsharewebapp/         # React + Vite frontend
│       ├── src/
│       ├── public/
│       └── package.json
├── Dockerfile                    # Backend container build
├── pom.xml                       # Backend dependencies/build config
├── mvnw / mvnw.cmd               # Maven wrapper
└── .mvn/
```

---

## ⚙️ Getting Started

### Prerequisites

Make sure you have:

- **Java 21+**
- **Node.js 18+** (recommended 20+)
- **npm**
- **MongoDB** (local or cloud URI)
- **Maven** (optional if using `mvnw`)
- **Docker** (optional)

---

### Backend Setup (Spring Boot)

From repository root:

```bash
# Linux / macOS
./mvnw spring-boot:run

# Windows
mvnw.cmd spring-boot:run
```

By default backend runs on:

- `http://localhost:5050`

---

### Frontend Setup (React + Vite)

```bash
cd Frontend/cloudsharewebapp
npm install
npm run dev
```

Vite dev server will usually run on:

- `http://localhost:5173`

> If your frontend calls backend APIs, configure the API base URL in your frontend environment/config.

---

## 🔐 Environment Variables

The backend reads sensitive configuration from environment variables (and optionally `.env` via Spring import).

Create a `.env` file in the backend root (or set env vars in your shell/runtime):

```env
MONGODB_URI=<your_mongodb_connection_string>
RAZORPAY_KEY_ID=<your_razorpay_key_id>
RAZORPAY_KEY_SECRET=<your_razorpay_key_secret>
```

Configured application properties include:

- `server.port=5050`
- `spring.mongodb.uri=${MONGODB_URI}`
- `clerk.issuer=...`
- `clerk.jwks-url=...`
- `cloudshare.razorpay.*`
- Multipart limits:
  - `spring.servlet.multipart.max-file-size=5MB`
  - `spring.servlet.multipart.max-request-size=50MB`

---

## 🐳 Run with Docker

The repository includes a multi-stage Dockerfile for the backend.

```bash
# Build image
docker build -t cloudshare-backend .

# Run container
docker run --rm -p 5050:5050 \
  -e MONGODB_URI=<your_mongodb_connection_string> \
  -e RAZORPAY_KEY_ID=<your_razorpay_key_id> \
  -e RAZORPAY_KEY_SECRET=<your_razorpay_key_secret> \
  cloudshare-backend
```

---

## 📜 Available Scripts

### Frontend (`Frontend/cloudsharewebapp/package.json`)

- `npm run dev` → Start dev server
- `npm run build` → Production build
- `npm run preview` → Preview production build locally
- `npm run lint` → Run ESLint

### Backend

- `./mvnw spring-boot:run` → Start development server
- `./mvnw test` → Run tests
- `./mvnw package` → Build JAR

---

## 🔌 API Notes

This repository contains backend APIs under the Spring Boot app (`src/main/java/cloudshare`).

If you want, you can extend this README with a dedicated section documenting:

- Auth endpoints
- File upload/download endpoints
- Payment endpoints
- Request/response examples

---

## 🛣 Roadmap Ideas

- [ ] Add Swagger / OpenAPI documentation
- [ ] Add role-based access control
- [ ] Add resumable/chunk uploads for large files
- [ ] Add unit/integration test coverage badges
- [ ] Add CI workflow (lint + test + build)

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add your feature"`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

No license is currently specified in this repository.

If you plan to open-source this project, consider adding an MIT/Apache-2.0 license file.

---

## 👤 Author

**Pankaj Kurmi**

GitHub: [@Pankaj-kurmi](https://github.com/Pankaj-kurmi)
