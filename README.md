# AI Job Matcher

An AI-powered recruitment intelligence platform that matches candidate resumes to job descriptions using semantic embeddings, PostgreSQL + pgvector, and an optional LLM explanation layer.

> **Important:** This is a portfolio project. The matching score is a technical similarity score, not a hiring recommendation or an objective measure of candidate quality.

## Features

- Create and manage job descriptions
- Upload candidate resumes as PDF
- Extract resume text automatically
- Extract structured candidate information with an LLM when configured
- Generate text embeddings for jobs and resumes
- Store embeddings in PostgreSQL using `pgvector`
- Rank candidates using cosine similarity
- Fall back to keyword matching when an AI API key is not configured
- Generate a concise match explanation with an LLM
- Next.js + TypeScript dashboard
- Node.js + Express REST API
- Docker Compose setup for PostgreSQL + pgvector

## Architecture

```text
                         Next.js + TypeScript
                                |
                                | REST / JSON
                                v
                         Express.js API
                                |
              +-----------------+------------------+
              |                 |                  |
              v                 v                  v
          PostgreSQL       OpenAI API         PDF Parser
          + pgvector       embeddings/LLM
              |
              v
      Jobs / Candidates / Matches
```

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Plain CSS

### Backend
- Node.js
- Express.js
- TypeScript
- Multer
- pdf-parse

### Data / AI
- PostgreSQL
- pgvector
- OpenAI-compatible embeddings API
- OpenAI-compatible chat completion API

## Project Structure

```text
ai-job-matcher/
├── frontend/
│   ├── app/
│   │   ├── candidates/
│   │   ├── jobs/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── lib/api.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── next.config.ts
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── candidates.ts
│   │   │   ├── jobs.ts
│   │   │   └── matches.ts
│   │   ├── services/
│   │   │   ├── ai.ts
│   │   │   ├── matching.ts
│   │   │   └── pdf.ts
│   │   ├── db.ts
│   │   ├── server.ts
│   │   └── types.ts
│   ├── sql/schema.sql
│   ├── uploads/.gitkeep
│   ├── package.json
│   └── tsconfig.json
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

## Requirements

- Node.js 20+
- npm
- Docker Desktop
- An OpenAI API key for semantic embeddings and LLM explanations

The application can still run without an API key, but it will use a simple keyword-based fallback instead of semantic embeddings/LLM explanations.

## 1. Clone / create the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd ai-job-matcher
```

## 2. Configure environment variables

Create `.env` in the project root:

```env
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-4o-mini
OPENAI_EMBEDDING_MODEL=text-embedding-3-small

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/jobmatcher

BACKEND_PORT=5000
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

If you do not want to use an AI API immediately, leave `OPENAI_API_KEY` empty. Keyword matching will still work.

## 3. Start PostgreSQL + pgvector

```bash
docker compose up -d
```

Check:

```bash
docker compose ps
```

The database automatically runs `backend/sql/schema.sql` the first time the database volume is created.

## 4. Start the backend

```bash
cd backend
npm install
npm run dev
```

Backend:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

## 5. Start the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:3000
```

## API

### Health

```http
GET /api/health
```

### Jobs

```http
POST /api/jobs
GET /api/jobs
GET /api/jobs/:id
```

Example:

```json
{
  "title": "Software Engineer Intern",
  "description": "Build web applications and APIs.",
  "requiredSkills": ["TypeScript", "React", "Node.js", "SQL"],
  "preferredSkills": ["Next.js", "Express.js", "PostgreSQL"]
}
```

### Candidates

```http
POST /api/candidates
GET /api/candidates
GET /api/candidates/:id
```

Resume upload:

```http
POST /api/candidates/upload
Content-Type: multipart/form-data
```

Field name:

```text
resume
```

Optional form field:

```text
name
```

### Matching

```http
GET /api/matches/job/:jobId
GET /api/matches/job/:jobId/candidate/:candidateId
```

## How matching works

1. A recruiter creates a job.
2. The backend combines the job title, description, required skills and preferred skills.
3. The text is converted into an embedding.
4. A candidate uploads a PDF resume.
5. Resume text is extracted.
6. The resume is converted into an embedding.
7. PostgreSQL + pgvector calculates cosine distance.
8. Candidates are returned in descending similarity order.
9. The LLM can generate an explanation of matched and missing skills.

### Similarity

The project uses cosine similarity conceptually:

```text
similarity = 1 - cosine_distance
```

The UI expresses this as a percentage-like technical match score. It should not be interpreted as a probability of hiring.

## Example interview explanation

> "I built a full-stack AI recruitment prototype using Next.js and TypeScript on the frontend and Node.js/Express on the backend. Resumes are parsed from PDFs, converted into embeddings, and stored in PostgreSQL using pgvector. When a recruiter opens a job, the system performs vector similarity search to retrieve relevant candidates. I also added an LLM layer to explain which skills match and which requirements are missing."

## Engineering decisions

### Why PostgreSQL + pgvector?

It lets the application keep normal relational data and vector embeddings in one database. This simplifies the architecture for a portfolio-scale application.

### Why semantic matching?

Keyword matching can miss related wording. Embeddings allow the system to compare the meaning of job and resume text.

### Why keep a fallback?

The application remains demonstrable without an API key. This also makes local development cheaper and easier.

## Future Improvements

- Authentication and role-based access
- Candidate status workflow
- Redis caching
- Background job queue for resume processing
- Better chunk-level resume embeddings
- Evaluation dataset and precision@K / recall@K metrics
- Admin analytics
- Candidate/job filters
- GitHub profile enrichment
- Automated tests
- CI/CD with GitHub Actions
- Production deployment

## Resume Project Description

Only claim the AI/vector functionality after you have actually configured and tested it.

**AI Job Matcher — Resume & Job Description Matching Platform**  
`Next.js, TypeScript, Node.js, Express.js, PostgreSQL, REST APIs, LLMs, Embeddings, pgvector`

- Built a full-stack recruitment platform that matches resumes with job descriptions using semantic similarity and structured candidate information.
- Developed REST APIs with Node.js and Express.js for job creation, candidate management, resume processing and matching workflows.
- Implemented PDF resume extraction and an AI pipeline using text embeddings with PostgreSQL/pgvector for semantic candidate retrieval.
- Built a Next.js dashboard to display candidate match scores, matched skills, missing requirements and AI-generated explanations.

## License

MIT
