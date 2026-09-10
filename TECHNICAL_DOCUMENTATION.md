# Team-Up - Technical Documentation

## 📋 Project Overview

**Team-Up** is a student peer collaboration platform that helps college students find teammates for hackathons, project collaborations, DSA practice partners, and internship preparation. The platform uses a modern full-stack architecture with intelligent matching algorithms.

### Core Features
- **Smart Student Matching**: AI-powered compatibility scoring based on skills, goals, and preferences
- **Real-time Messaging**: WebSocket-based chat system
- **DSA Streak Tracking**: Daily coding practice accountability
- **Opportunity Board**: Hackathon, project, and internship postings
- **Connection Management**: Request and manage professional connections
- **Profile System**: Comprehensive student profiles with skills, goals, and availability

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js 14)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │ Pages    │  │ Components│  │ Context  │  │ Services │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTP/WebSocket
┌─────────────────────────────────────────────────────────────┐
│               Backend (Spring Boot 3.3.0)                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │Controllers│ │ Services │ │ Security │ │ Config   │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │ Entities │ │ Repos    │ │ WebSocket│ │ JPA      │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↓ JDBC
┌─────────────────────────────────────────────────────────────┐
│              Database (Neon PostgreSQL)                     │
│  • Users • Skills • Connections • Messages • Opportunities  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14.2.3 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.4.4
- **Icons**: Lucide React
- **State Management**: React Context API
- **HTTP Client**: Native Fetch API

### Backend
- **Framework**: Spring Boot 3.3.0
- **Language**: Java 17
- **Build Tool**: Maven
- **ORM**: Spring Data JPA + Hibernate
- **Security**: Spring Security + JWT
- **Real-time**: Spring WebSocket + STOMP
- **Authentication**: JWT (JJWT 0.11.5)

### Database
- **Production**: Neon PostgreSQL (Serverless)
- **Development**: H2 In-Memory Database
- **Connection Pooling**: HikariCP (Spring Boot default)

### Deployment
- **Backend**: Render (Free Tier)
- **Database**: Neon PostgreSQL
- **Version Control**: Git + GitHub

---

## 📁 Project Structure

```
Team-Up/
├── client/                          # Next.js Frontend
│   ├── app/                         # App Router pages
│   │   ├── (app)/                  # Authenticated pages
│   │   │   ├── dashboard/         # Main dashboard
│   │   │   ├── explore/           # Student discovery
│   │   │   ├── connections/       # Network management
│   │   │   ├── messages/          # Chat interface
│   │   │   ├── opportunities/     # Opportunity board
│   │   │   ├── dsa/               # DSA streak tracking
│   │   │   ├── notifications/     # Alert system
│   │   │   ├── profile/           # User profile
│   │   │   └── students/[id]/     # Individual student pages
│   │   ├── login/                 # Login page
│   │   ├── register/              # Registration page
│   │   ├── onboarding/            # First-time setup
│   │   ├── layout.tsx             # Root layout
│   │   └── globals.css            # Global styles
│   ├── components/                # Reusable components
│   │   ├── Sidebar.tsx            # Navigation sidebar
│   │   ├── StudentCard.tsx        # Student profile card
│   │   ├── SkillBadge.tsx         # Skill display component
│   │   ├── GoalChip.tsx           # Goal selection chip
│   │   └── MatchScoreBar.tsx      # Compatibility score display
│   ├── context/                   # React Context
│   │   └── AuthContext.tsx        # Authentication state
│   ├── services/                  # API services
│   │   └── api.ts                 # HTTP client wrapper
│   ├── types/                     # TypeScript types
│   │   └── index.ts               # Shared type definitions
│   ├── tailwind.config.js         # Tailwind configuration
│   ├── next.config.js             # Next.js configuration
│   └── package.json               # Frontend dependencies
│
├── server/                         # Spring Boot Backend
│   ├── src/main/java/com/teamup/
│   │   ├── TeamUpApplication.java  # Main application entry
│   │   ├── config/                # Configuration classes
│   │   │   ├── SecurityConfig.java      # Security + CORS
│   │   │   └── WebSocketConfig.java    # WebSocket setup
│   │   ├── controller/            # REST Controllers
│   │   │   ├── AuthController.java     # Authentication endpoints
│   │   │   ├── UserController.java     # User management
│   │   │   ├── ConnectionController.java # Network management
│   │   │   ├── ChatController.java     # Chat REST API
│   │   │   ├── WebSocketChatController.java # WebSocket handler
│   │   │   ├── OpportunityController.java # Opportunity board
│   │   │   ├── DsaController.java      # DSA streak tracking
│   │   │   ├── NotificationController.java # Alert system
│   │   │   └── HealthController.java   # Health check
│   │   ├── entity/                # JPA Entities
│   │   │   ├── User.java              # User profile
│   │   │   ├── Skill.java             # User skills
│   │   │   ├── DsaProfile.java        # DSA practice data
│   │   │   ├── Connection.java        # User connections
│   │   │   ├── Message.java           # Chat messages
│   │   │   ├── Opportunity.java       # Collaboration opportunities
│   │   │   └── Notification.java      # User notifications
│   │   ├── repository/            # JPA Repositories
│   │   │   ├── UserRepository.java
│   │   │   ├── ConnectionRepository.java
│   │   │   ├── MessageRepository.java
│   │   │   ├── OpportunityRepository.java
│   │   │   └── NotificationRepository.java
│   │   ├── service/               # Business Logic
│   │   │   ├── RecommendationService.java # Matching algorithm
│   │   │   └── DataInitializer.java       # Database seeding
│   │   └── security/              # Security utilities
│   │       └── JwtTokenProvider.java    # JWT token management
│   ├── src/main/resources/
│   │   ├── application.properties        # Base configuration
│   │   ├── application-local.properties # Development config
│   │   └── application-prod.properties  # Production config
│   ├── Dockerfile                    # Container image
│   └── pom.xml                       # Maven dependencies
│
├── docker-compose.yml               # Local development stack
├── .env.example                    # Environment variables template
└── README.md                       # Project overview
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Password reset (placeholder)

### User Management
- `GET /api/users/recommendations` - Get personalized recommendations
- `GET /api/users/explore` - Search and filter students
- `GET /api/users/profile/{id}` - Get student profile with match score
- `PUT /api/users/onboarding` - Complete onboarding
- `PUT /api/users/profile` - Update profile

### Connections
- `GET /api/connections` - Get all connections
- `POST /api/connections/request` - Send connection request
- `POST /api/connections/respond/{id}` - Accept/decline request

### Chat
- `GET /api/chat/conversations` - Get all conversations
- `GET /api/chat/messages/{userId}` - Get messages with specific user
- `POST /api/chat/send` - Send message

### Opportunities
- `GET /api/opportunities` - Get all opportunities
- `POST /api/opportunities` - Create opportunity
- `POST /api/opportunities/{id}/interest` - Express interest

### DSA Tracking
- `GET /api/dsa/matches` - Get DSA practice buddies
- `POST /api/dsa/checkin` - Daily streak check-in

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/{id}/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read

### Health
- `GET /health` - Health check endpoint

### WebSocket
- `ws://host/ws` - WebSocket endpoint for real-time messaging

---

## 🔐 Security Implementation

### JWT Authentication Flow

1. **User Registration/Login**
   - Client sends credentials to `/api/auth/login` or `/api/auth/register`
   - Server validates credentials
   - `JwtTokenProvider` generates JWT token with user ID and email
   - Token stored in localStorage as `teamup_token`

2. **Token Validation**
   - Each API request includes `Authorization: Bearer {token}` header
   - `JwtTokenProvider.validateToken()` verifies signature and expiration
   - Demo mode: tokens starting with `user-` bypass validation (for development)

3. **Security Configuration**
   - Spring Security disabled CSRF for API endpoints
   - CORS configured to allow frontend origins
   - Permissive authentication for demo purposes (should be hardened for production)

### Environment Variables

**Production (Render)**:
- `SPRING_PROFILES_ACTIVE=prod`
- `SPRING_DATASOURCE_URL` - Neon PostgreSQL connection string
- `SPRING_DATASOURCE_USERNAME` - Database username
- `SPRING_DATASOURCE_PASSWORD` - Database password
- `JWT_SECRET` - JWT signing secret (min 32 bytes)
- `FRONTEND_URL` - Frontend URL for CORS

**Development (Local)**:
- Uses H2 in-memory database
- Default JWT secret for local development
- CORS allows localhost:3000, localhost:3001

---

## 🧠 Matching Algorithm

The `RecommendationService` implements a weighted scoring system:

### Scoring Components

1. **Goal Match Score (30%)**
   - Compares user's collaboration goals
   - Higher score for complementary goals

2. **Complementary Skills Score (25%)**
   - Identifies skills that complement each other
   - Rewards different tech stacks that work well together

3. **Common Skills Score (20%)**
   - Shared technical background
   - Facilitates easier collaboration

4. **Experience Level Score (15%)**
   - Similar experience levels
   - Year of study matching

5. **Availability Score (10%)**
   - Matching availability days/times
   - Activity status compatibility

### Match Score Calculation

```java
int totalScore = (goalMatch * 30) + 
                 (complementarySkills * 25) + 
                 (commonSkills * 20) + 
                 (experience * 15) + 
                 (availability * 10);
```

---

## 💾 Database Schema

### User Entity
```java
@Entity
@Table(name = "users")
public class User {
    @Id String id;
    String name;
    @Column(unique = true) String email;
    String password;
    String profilePicture;
    String college;
    String branch;
    String yearOfStudy;
    String bio;
    String activityStatus;
    String github, linkedin, leetcode, portfolio;
    Boolean onboarded;
    LocalDateTime lastActive;
    
    @OneToMany(fetch = FetchType.EAGER) List<Skill> skills;
    @ElementCollection(fetch = FetchType.EAGER) List<String> currentGoals;
    @ElementCollection(fetch = FetchType.EAGER) List<String> availabilityDays;
    String availabilityTime;
    @OneToOne(fetch = FetchType.EAGER) DsaProfile dsaProfile;
}
```

### Key Relationships
- **User → Skills**: One-to-many (EAGER loading)
- **User → Goals**: Element collection (EAGER loading)
- **User → Availability**: Element collection (EAGER loading)
- **User → DSA Profile**: One-to-one (EAGER loading)
- **User → Connections**: Bidirectional relationships
- **User → Messages**: Sender/Receiver relationships

### Database Initialization
- `DataInitializer` seeds demo data on first startup
- Creates 4 sample users with skills, connections, messages, opportunities
- Only runs if database is empty (checks `userRepository.count() > 0`)

---

## 🎨 Frontend Architecture

### Component Hierarchy

```
RootLayout (app/layout.tsx)
└── AuthProvider (context/AuthContext.tsx)
    └── AppLayout (app/(app)/layout.tsx)
        ├── Sidebar (components/Sidebar.tsx)
        └── Page Content
            ├── Dashboard
            ├── Explore
            ├── Connections
            ├── Messages
            ├── Opportunities
            ├── DSA
            ├── Notifications
            └── Profile
```

### State Management

**AuthContext** provides:
- `user` - Current user object
- `loading` - Authentication loading state
- `login()` - User login function
- `register()` - User registration function
- `logout()` - User logout function
- `updateUser()` - Update user state
- `switchDemoUser()` - Switch between demo accounts

### API Service Layer

**api.ts** provides typed HTTP client methods:
- Authentication: `login()`, `register()`, `getMe()`
- Users: `getRecommendations()`, `exploreStudents()`, `getStudentProfile()`
- Connections: `getConnections()`, `sendConnectionRequest()`, `respondToConnection()`
- Chat: `getConversations()`, `getMessages()`, `sendMessage()`
- Opportunities: `getOpportunities()`, `createOpportunity()`, `toggleOpportunityInterest()`
- DSA: `getDSAMatches()`, `checkInDSAStreak()`
- Notifications: `getNotifications()`, `markNotificationRead()`, `markAllNotificationsRead()`

---

## 🚀 Deployment Configuration

### Backend Deployment (Render)

**Build Configuration**:
- **Root Directory**: `server`
- **Build Command**: `mvn clean package -DskipTests`
- **Start Command**: `java -jar target/team-up-server-1.0.0.jar`

**Dockerfile**:
```dockerfile
# Multi-stage build
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests -B

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/team-up-server-1.0.0.jar app.jar
EXPOSE 5000
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**Production Properties**:
```properties
server.port=${PORT:5000}
spring.datasource.url=${SPRING_DATASOURCE_URL}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
```

### Performance Characteristics

**Cold Start Time** (Render Free Tier):
- **Minimum**: 15-20 seconds
- **Typical**: 25-35 seconds
- **Worst Case**: 40-60 seconds

**Contributing Factors**:
- Spring Boot framework initialization (5-15s)
- JPA/Hibernate setup (3-8s)
- Database connection (1-3s)
- DataInitializer (2-5s, first run only)
- Container spin-up (2-5s)

---

## 🎨 UI Design System

### Recent Design Overhaul

**Color Palette**:
- **Primary**: Orange (#EA580C) to Amber gradient
- **Secondary**: Sky (#0EA5E9), Violet (#8B5CF6), Emerald (#10B981)
- **Background**: Warm gradient pattern (#FEF9F3 → #FFF7ED → #FEF3C7)
- **Text**: Stone (#1C1917) for warmth vs. Slate for professionalism

**Design Principles**:
- **Gradient-based**: All major elements use subtle gradients
- **Glass-morphism**: Backdrop blur effects for depth
- **Organic shapes**: Rounded corners (2xl) throughout
- **Dynamic shadows**: Color-tinted shadows for warmth
- **Micro-interactions**: Hover effects, transitions, animations

**Custom CSS Effects**:
- `.text-gradient` - Gradient text for branding
- `.btn-creative` - Shimmer effect on buttons
- `.card-human` - Creative card with gradient border on hover
- Organic scrollbar with gradient colors
- Custom focus rings with orange theme

---

## 🔄 Data Flow Examples

### User Registration Flow

1. **Frontend**: User fills registration form → `/register` page
2. **API**: `POST /api/auth/register` with user data
3. **Backend**: `AuthController.register()` validates email uniqueness
4. **Database**: Creates new User entity with generated ID
5. **Response**: Returns JWT token + user object
6. **Frontend**: Stores token in localStorage, updates AuthContext
7. **Redirect**: Navigates to onboarding page

### Smart Matching Flow

1. **Frontend**: User visits `/explore` or `/dashboard`
2. **API**: `GET /api/users/recommendations` with auth header
3. **Backend**: `UserController.getRecommendations()` extracts user ID from JWT
4. **Service**: `RecommendationService.rankRecommendations()` runs matching algorithm
5. **Algorithm**: Calculates compatibility scores against all users
6. **Response**: Returns ranked list with match percentages
7. **Frontend**: Displays StudentCards with MatchScoreBar components

### Real-time Messaging Flow

1. **Connection**: Frontend establishes WebSocket connection to `/ws`
2. **Subscription**: Client subscribes to `/topic/messages/{userId}`
3. **Send Message**: Client sends to `/app/chat.sendMessage` via WebSocket
4. **Backend**: `WebSocketChatController.sendMessage()` processes message
5. **Database**: Saves message to Message table
6. **Broadcast**: Sends to `/topic/messages/{receiverId}` and `/topic/messages/{senderId}`
7. **Frontend**: Receives message via WebSocket subscription
8. **UI**: Updates chat interface in real-time

---

## 🐛 Known Limitations & Future Improvements

### Current Limitations

1. **Security**
   - Demo mode allows `user-*` tokens without validation
   - Passwords stored in plain text (no hashing)
   - Permissive CORS configuration
   - No rate limiting on API endpoints

2. **Performance**
   - EAGER loading on User entity relationships
   - No database connection pooling optimization
   - No caching layer for frequently accessed data
   - Cold start time on Render free tier

3. **Features**
   - No file upload for profile pictures
   - No email verification for registration
   - No password reset functionality
   - Limited notification system

### Recommended Improvements

1. **Security Hardening**
   - Implement BCrypt password hashing
   - Remove demo mode in production
   - Add rate limiting and request throttling
   - Implement proper input validation
   - Add API key authentication for external access

2. **Performance Optimization**
   - Change EAGER to LAZY loading with JOIN FETCH
   - Implement Redis caching for user data
   - Add database connection pooling configuration
   - Consider Spring Boot Native Image for faster cold starts
   - Implement pagination for large datasets

3. **Feature Enhancements**
   - Add email verification workflow
   - Implement file upload for profile pictures
   - Add proper password reset flow
   - Expand notification system with email/SMS
   - Add advanced search filters
   - Implement group chat functionality

---

## 📊 Development Workflow

### Local Development Setup

1. **Backend Setup**:
   ```bash
   cd server
   mvn clean install
   mvn spring-boot:run
   ```
   - Runs on port 5000
   - Uses H2 in-memory database
   - Access H2 console at http://localhost:5000/h2-console

2. **Frontend Setup**:
   ```bash
   cd client
   npm install
   npm run dev
   ```
   - Runs on port 3000
   - API proxy configured in next.config.js
   - Hot reload enabled

3. **Docker Compose** (Alternative):
   ```bash
   docker-compose up
   ```
   - Starts PostgreSQL database
   - Starts backend server
   - Starts frontend server
   - All services networked together

### Testing Strategy

**Current State**: No automated tests implemented

**Recommended Testing**:
- Unit tests for service layer (RecommendationService)
- Integration tests for API endpoints
- Component tests for React components
- E2E tests with Playwright or Cypress

---

## 🎯 Key Technical Decisions

### Why Spring Boot?
- Mature ecosystem with extensive documentation
- Built-in security and WebSocket support
- Easy database integration with JPA
- Strong typing with Java
- Good for REST API development

### Why Next.js?
- Server-side rendering for SEO
- App Router for modern React patterns
- Built-in API routes for potential backend integration
- Excellent TypeScript support
- Great developer experience

### Why PostgreSQL?
- ACID compliance for data integrity
- Complex query support for matching algorithms
- Scalable for future growth
- Neon provides serverless option
- Better than H2 for production

### Why JWT Authentication?
- Stateless authentication
- Easy to implement across microservices
- Mobile-friendly
- No session management overhead
- Industry standard

---

## 📝 Recent Changes (September 2026)

### Performance Optimization
- Optimized scroll and loading performance
- Added lazy loading for images
- Implemented code splitting
- Seeded 10 student profiles for better demo experience

### UI Redesign
- Complete design system overhaul
- Replaced generic slate/indigo theme with warm orange/amber gradient palette
- Added creative gradient effects throughout the application
- Implemented glass-morphism and organic design elements
- Enhanced micro-interactions and animations

### Configuration Fixes
- Fixed circular reference issue in production properties
- Removed self-referencing environment variables
- Improved Render deployment configuration
- Enhanced Neon PostgreSQL integration

---

## 🔧 Troubleshooting

### Common Issues

**Backend won't start**:
- Check JAVA_HOME is set to Java 17
- Verify port 5000 is not in use
- Check database connection string in environment variables

**Frontend build fails**:
- Clear `.next` folder: `rm -rf .next`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version (should be 20+)

**Database connection errors**:
- Verify Neon PostgreSQL is running
- Check connection string format
- Ensure SSL mode is enabled
- Verify database credentials

**WebSocket connection fails**:
- Check CORS configuration
- Verify WebSocket endpoint URL
- Ensure backend is running
- Check firewall/proxy settings

---

## 📚 Additional Resources

### Documentation
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Neon PostgreSQL Documentation](https://neon.tech/docs)

### APIs & Libraries
- [JJWT Documentation](https://github.com/jwtk/jjwt)
- [Lucide React Icons](https://lucide.dev/)
- [Spring WebSocket](https://docs.spring.io/spring-framework/reference/web/websocket.html)

---

## 🎓 Learning Resources

This project demonstrates:
- Full-stack development with modern frameworks
- REST API design and implementation
- Real-time communication with WebSockets
- Database design with JPA/Hibernate
- Authentication and authorization
- Matching algorithms and recommendation systems
- Modern UI/UX design patterns
- Deployment on cloud platforms

---

**Last Updated**: September 10, 2026
**Version**: 1.0.0
**Maintainers**: Team Up Development Team
