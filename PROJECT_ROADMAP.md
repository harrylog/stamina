# Stamina - K8s Learning Platform Roadmap

## Vision
A Duolingo-style learning platform for Kubernetes and cloud-native technologies. Learn concepts, implement them in the project itself, create questions, and track your mastery through analytics.

---

## Current State

### Services
- **Auth Service** - JWT authentication, login/signup ✅
- **Users Service** - CRUD with RBAC ✅
- **Learning Service** - Courses, Sections, Units, Questions (partial)
- **Frontend** - Angular + NgRx + Material

### Infrastructure
- Docker Compose for local dev ✅
- K8s manifests (basic) ✅
- MongoDB Atlas ✅
- RabbitMQ for service communication ✅

---

## Phase 1: Complete Foundation (Current)
**Goal:** Full CRUD for all entities, solid base to build on

### 1.1 Users Service ✅
- [x] CRUD operations
- [x] RBAC (Admin, Moderator, User roles)
- [x] Seeder for dev users
- [ ] User profile (avatar, preferences, timezone)
- [ ] Password reset flow

### 1.2 Learning Service - Content Management
- [ ] **Courses** - Full CRUD
  - title, description, difficulty, icon, order, isPublished
  - Endpoints: GET/POST/PUT/DELETE /courses

- [ ] **Sections** (within courses) - Full CRUD
  - title, description, courseId, order, isPublished
  - Endpoints: GET/POST/PUT/DELETE /sections

- [ ] **Units** (within sections) - Full CRUD
  - title, description, sectionId, order, type (lesson/quiz)
  - Endpoints: GET/POST/PUT/DELETE /units

- [ ] **Questions** - Full CRUD
  - Multiple types: multiple-choice, true/false, fill-blank, match
  - Fields: unitId, type, question, options, correctAnswer, explanation, difficulty, points
  - Endpoints: GET/POST/PUT/DELETE /questions

### 1.3 Frontend - Admin Panel
- [ ] Course management UI
- [ ] Section management UI
- [ ] Unit management UI
- [ ] Question editor (support all question types)
- [ ] Content preview

---

## Phase 2: Study Mode & User Progress
**Goal:** Users can actually learn and track progress

### 2.1 Progress Service (New)
Track user learning progress:

```
UserProgress {
  userId
  courseId
  sectionId
  unitId
  status: 'not_started' | 'in_progress' | 'completed'
  startedAt
  completedAt
  score (for quizzes)
}
```

Endpoints:
- GET /progress/:userId - Get all progress
- GET /progress/:userId/course/:courseId - Course progress
- POST /progress/start - Start a unit
- POST /progress/complete - Complete a unit

### 2.2 Answer Tracking
```
UserAnswer {
  userId
  questionId
  unitId
  answer
  isCorrect
  timeSpent (seconds)
  attemptNumber
  answeredAt
}
```

Endpoints:
- POST /answers/submit - Submit an answer
- GET /answers/:userId/unit/:unitId - Get answers for a unit

### 2.3 Frontend - Study Mode
- [ ] Course browser (card layout like Duolingo)
- [ ] Section/Unit tree view
- [ ] Lesson viewer (content + mini quizzes)
- [ ] Quiz mode
  - Timer per question
  - Immediate feedback
  - Explanation on wrong answer
  - Progress bar
- [ ] Completion celebration (confetti!)

---

## Phase 3: Analytics Service
**Goal:** Insights into learning patterns and performance

### 3.1 Analytics Service (New Microservice)
Consumes events from RabbitMQ, aggregates data.

**Events to consume:**
- `user.answer.submitted`
- `user.unit.completed`
- `user.course.started`
- `user.session.started`

**Aggregations to compute:**
```
UserStats {
  userId
  totalQuestionsAnswered
  correctAnswers
  incorrectAnswers
  accuracy (%)
  totalTimeSpent
  currentStreak (days)
  longestStreak
  lastActiveAt
  coursesCompleted
  unitsCompleted
}

QuestionStats {
  questionId
  totalAttempts
  correctAttempts
  avgTimeSpent
  difficultyScore (calculated)
}

CourseStats {
  courseId
  totalEnrollments
  completionRate
  avgScore
  avgTimeToComplete
}
```

### 3.2 Analytics Endpoints
- GET /analytics/user/:userId - User dashboard stats
- GET /analytics/user/:userId/weak-areas - Topics needing review
- GET /analytics/user/:userId/streak - Streak info
- GET /analytics/leaderboard - Top learners
- GET /analytics/course/:courseId - Course performance
- GET /analytics/question/:questionId - Question difficulty

### 3.3 Frontend - Analytics Dashboard
- [ ] Personal stats dashboard
  - Accuracy chart over time
  - Time spent per day/week
  - Streak calendar (GitHub-style)
  - Weak areas radar chart
- [ ] Leaderboard
- [ ] Course completion progress
- [ ] Admin analytics (course/question performance)

---

## Phase 4: Gamification
**Goal:** Make learning addictive

### 4.1 Achievements System
```
Achievement {
  id, name, description, icon, criteria
}

UserAchievement {
  userId, achievementId, unlockedAt
}
```

Example achievements:
- First Question Answered
- 7-Day Streak
- Perfect Quiz
- Course Completed
- 100 Questions Answered

### 4.2 XP & Levels
- Earn XP for correct answers, completing units, streaks
- Level up system
- Daily XP goals

### 4.3 Frontend
- [ ] Achievement badges display
- [ ] XP bar and level indicator
- [ ] Daily goal tracker
- [ ] Unlock animations

---

## Phase 5: Advanced Features
**Goal:** Production-ready, portfolio-worthy

### 5.1 Spaced Repetition
- Track question mastery per user
- Schedule reviews based on forgetting curve
- "Review" mode for weak questions

### 5.2 Social Features
- Follow other learners
- Share achievements
- Study groups

### 5.3 Content Import/Export
- Import questions from YAML/JSON
- Export progress reports

### 5.4 Notifications Service
- Email notifications (streak reminders, achievements)
- Push notifications (web)

---

## Phase 6: Infrastructure & DevOps
**Goal:** Demonstrate cloud-native expertise

### 6.1 Kubernetes (your learning focus!)
- [ ] Helm charts for all services
- [ ] HPA for auto-scaling
- [ ] NetworkPolicies
- [ ] ServiceMesh (Istio/Linkerd)
- [ ] Secrets management (External Secrets)

### 6.2 Observability
- [ ] Prometheus metrics
- [ ] Grafana dashboards
- [ ] Distributed tracing (Jaeger)
- [ ] Centralized logging (ELK/Loki)

### 6.3 CI/CD
- [ ] GitHub Actions pipelines
- [ ] ArgoCD for GitOps
- [ ] Preview environments

### 6.4 AWS Deployment
- [ ] EKS cluster (Terraform)
- [ ] RDS/DocumentDB or MongoDB Atlas
- [ ] CloudFront CDN for frontend
- [ ] Route53 + ACM for SSL

---

## Suggested Implementation Order

### Immediate Next Steps (Week 1-2)
1. **Complete Learning Service CRUD** - courses, sections, units, questions
2. **Admin UI** - Create/edit courses and questions
3. **Seed sample K8s content** - A few courses to test with

### Short Term (Week 3-4)
4. **Study mode frontend** - Browse courses, take quizzes
5. **Answer tracking** - Save user answers
6. **Basic progress tracking** - Mark units complete

### Medium Term (Week 5-8)
7. **Analytics service** - Consume events, compute stats
8. **Analytics dashboard** - Visualize progress
9. **Gamification** - XP, streaks, achievements

### Long Term (Ongoing)
10. **K8s infrastructure** - Helm, HPA, observability
11. **Advanced features** - Spaced repetition, notifications
12. **Polish** - Better UI/UX, mobile responsive

---

## Data Model Overview

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Course    │────▶│   Section   │────▶│    Unit     │────▶│  Question   │
│             │ 1:N │             │ 1:N │             │ 1:N │             │
│ - title     │     │ - title     │     │ - title     │     │ - type      │
│ - desc      │     │ - courseId  │     │ - sectionId │     │ - question  │
│ - difficulty│     │ - order     │     │ - order     │     │ - options   │
│ - icon      │     │             │     │ - type      │     │ - answer    │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                                                                    │
                                                                    ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    User     │────▶│  Progress   │     │   Answer    │◀────│   Stats     │
│             │ 1:N │             │     │             │     │ (Analytics) │
│ - email     │     │ - courseId  │     │ - questionId│     │             │
│ - roles     │     │ - unitId    │     │ - isCorrect │     │ - accuracy  │
│ - xp        │     │ - status    │     │ - timeSpent │     │ - streak    │
│ - level     │     │ - score     │     │ - attempt   │     │ - weakAreas │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

---

## Sample K8s Course Structure

```
Course: Kubernetes Fundamentals
├── Section 1: Core Concepts
│   ├── Unit 1.1: What is Kubernetes? (lesson)
│   ├── Unit 1.2: Pods (lesson)
│   ├── Unit 1.3: Quiz - Core Concepts (quiz)
├── Section 2: Workloads
│   ├── Unit 2.1: Deployments (lesson)
│   ├── Unit 2.2: StatefulSets (lesson)
│   ├── Unit 2.3: DaemonSets (lesson)
│   ├── Unit 2.4: Quiz - Workloads (quiz)
├── Section 3: Services & Networking
│   ├── Unit 3.1: Services (lesson)
│   ├── Unit 3.2: Ingress (lesson)
│   ├── Unit 3.3: Network Policies (lesson)
│   ├── Unit 3.4: Quiz - Networking (quiz)
```

---

## Portfolio Highlights

When complete, this project demonstrates:

1. **Microservices Architecture** - Multiple services with clear boundaries
2. **Event-Driven Design** - RabbitMQ for async communication
3. **RBAC & Security** - JWT, role-based access control
4. **State Management** - NgRx on frontend
5. **Kubernetes Expertise** - Helm, HPA, observability
6. **Data Analytics** - Aggregations, statistics, visualizations
7. **Full-Stack Skills** - NestJS, Angular, MongoDB
8. **DevOps/GitOps** - CI/CD, ArgoCD, Terraform

---

## Quick Start for Next Session

```bash
# 1. Start the stack
docker compose up --build

# 2. The app auto-logs in as admin@dev.com

# 3. Next task: Complete Learning Service CRUD
# Start with: nest-stamina/apps/learning/src/
```

Ready to build something awesome! 🚀
