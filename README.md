# Team Up 🤝

A full-stack collaborative networking platform built for students and developers to find hackathon teammates, open-source collaborators, DSA study buddies, and project partners.

---

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS & Lucide Icons
- **Animation**: Framer Motion
- **State/Auth**: React Context API (`AuthContext`)

### Backend
- **Framework**: Spring Boot 3.3.0 (Java 17+)
- **Security**: Spring Security with JWT (JSON Web Tokens) & BCrypt
- **Database**: In-Memory H2 Database (PostgreSQL Compatibility Mode) with Spring Data JPA
- **Real-Time**: Spring WebSocket (STOMP protocol) & REST fallback

---

## 🛠️ Getting Started

### Prerequisites
- **Node.js**: v18.x or higher
- **Java Development Kit (JDK)**: JDK 17 or higher
- **Maven**: 3.8+ (included in system path)

### Running the Application

1. **Start the Backend (Port 5000)**:
   ```bash
   cd server
   mvn spring-boot:run
   ```
   *The H2 Database console is available at `http://localhost:5000/h2-console` (JDBC URL: `jdbc:h2:mem:teamupdb`, User: `sa`, Password: `password`).*

2. **Start the Frontend (Port 3000)**:
   ```bash
   cd client
   npm run dev
   ```
   *Open [http://localhost:3000](http://localhost:3000) in your browser.*

---

## 🌟 Key Features

- **🎯 Smart Student Matching**: AI/Heuristic recommendation engine computing match scores based on skill overlap and collaboration goals.
- **🔍 Multi-Filter Explore**: Search prospective teammates by skill, university, branch, and active status.
- **💬 Real-Time Direct Messaging**: Instant chat with connection peers using WebSocket and REST fallbacks.
- **🤝 Connections Management**: Send and manage incoming and outgoing collaboration invites.
- **🔥 DSA Streak & Partner Finder**: Daily check-in system, LeetCode profile integration, and buddy matching.
- **📢 Opportunities Board**: Post and discover hackathons, research projects, and startup ventures.
- **🔔 Notification Center**: Live notifications for invites, acceptances, and messages.

---

## 👥 Demo Accounts

The database comes pre-seeded with sample profiles:

| Email | Password | Role / Focus |
|---|---|---|
| `anshk@example.com` | `password123` | Full Stack Developer & AI Enthusiast |
| `rohit.sharma@example.com` | `password123` | Backend & Systems (Java, Go) |
| `priya.patel@example.com` | `password123` | Frontend & UI/UX (React, Tailwind) |
| `neha.gupta@example.com` | `password123` | Machine Learning & Data Science (Python, PyTorch) |
| `arjun.verma@example.com` | `password123` | Competitive Programmer (C++, DSA) |
