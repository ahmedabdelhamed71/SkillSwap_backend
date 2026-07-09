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
USERS
==========================

GET    /api/users?page=1&limit=10&search=john
- Get paginated list of users (auth required)
- Query params: page (default 1), limit (default 10, max 100), search (matches username, full_name, email)

GET    /api/users/:id
- Get user by id (auth required)
