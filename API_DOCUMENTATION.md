# SkillSwap Backend API

Base URL
/api

==========================
SKILLS
==========================

GET    /api/skills
- Get all skills

GET    /api/skills/search?keyword=react
- Search skills

POST   /api/skills
- Add new skill

PUT    /api/skills/:id
- Update skill

DELETE /api/skills/:id
- Delete skill

==========================
QUESTIONS
==========================

GET    /api/questions/:skillId
- Get questions by skill

POST   /api/questions
- Add question

PUT    /api/questions/:id
- Update question

DELETE /api/questions/:id
- Delete question

==========================
RESULTS
==========================

POST   /api/results
- Save test result

GET    /api/results/:userId
- Get user results

==========================
AUTH
==========================

POST   /api/auth/register
- Register new user
- Body: { name, email, password }

POST   /api/auth/login
- Login user & get token
- Body: { email, password }

GET    /api/auth/me
- Get current logged-in user (protected)
- Headers: Authorization: Bearer <token>

==========================
PROFILE
==========================

GET    /api/users/:id
- Get user profile by ID (public)

PUT    /api/users/:id
- Update user profile (owner only, protected)

GET    /api/users/:id/skills
- Get user skills (offered & wanted)

POST   /api/users/:id/skills
- Add skill to user profile (owner only, protected)
- Body: { name, category, level, type: "offered" | "wanted" }

DELETE /api/users/:id/skills/:skillId
- Remove skill from user profile (owner only, protected)

GET    /api/users/:id/swaps
- Get user swap history

GET    /api/users/:id/reviews
- Get user reviews

==========================
MESSAGES
==========================

GET    /api/conversations
- Get all conversations for logged-in user (protected)

GET    /api/conversations/:id/messages
- Get messages of a conversation (protected)

POST   /api/conversations/:id/messages
- Send a message (protected)
- Body: { text }

PUT    /api/conversations/:id/read
- Mark all messages as read (protected)