# 🇮🇳 Samvidhan Saathi (संविधान साथी)
### *Your Constitutional Companion — AI-Powered Civic Literacy Platform for Bharat*

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python%203.12-blue?logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite-61DAFB?logo=react)](https://vitejs.dev/)
[![AI](https://img.shields.io/badge/AI-Google%20Gemini%20%7C%20RAG-orange?logo=google)](https://ai.google.dev/)
[![Database](https://img.shields.io/badge/Database-Async%20SQLAlchemy%20%7C%20SQLite%20%7C%20Supabase-green?logo=postgresql)](https://supabase.com/)
[![License](https://img.shields.io/badge/SIH-Hackathon%20Prototype-saffron)](https://sih.gov.in/)

---

## 📋 Executive Overview
**Samvidhan Saathi (संविधान साथी)** is an AI-powered constitutional empowerment and civic education platform. It democratizes constitutional knowledge across India by converting complex Bare Act legal text into accessible, real-life, scenario-driven learning in **English, Hindi (हिंदी), and Hinglish**.

Whether a common citizen is stopped by police, a tenant is facing unlawful eviction, or a student is preparing for competitive examinations (UPSC, SSC, CLAT), Samvidhan Saathi delivers instant, legally-verified constitutional protections grounded in the Constitution of India and Supreme Court judgments.

> 📖 **Looking for comprehensive technical docs, database schemas, and background processes?**  
> Check out the [SYSTEM_ARCHITECTURE.md](file:///c:/Users/Samarpan%20Rupeja/OneDrive/Desktop/SIH%20Project/SYSTEM_ARCHITECTURE.md) guide!

---

## 🌟 Core Features & Modules

### 1. 🔍 Situation-Based Natural Language Search
* Citizens don't search by legal numbers like *"Article 22(1)"*; they search by everyday problems (e.g. *"Can police search my phone without a warrant?"* or *"Mera landlord bina notice ke nikaal sakta hai kya?"*).
* Hybrid in-memory token ranker + AI classifier maps natural vernacular queries directly to relevant Constitutional Articles and fundamental rights.

### 2. 📖 3-Tier Multi-Level Explanation Engine
Every constitutional article is translated across 3 customized tiers:
* 🟢 **Simple Mode (Class 6-10 / Everyday Citizens)**: Plain language, zero legal jargon, relatable analogies.
* 🟡 **Student Mode (Class 11-Graduation)**: Balanced legal terminology, historical drafting context, and key landmark judgments.
* 🔴 **Detailed Mode (Law Students & Exam Aspirants)**: Full Bare Act statutory text, doctrine linkages (e.g. Golden Triangle of Articles 14, 19, 21), and scholarly constitutional analysis.
* 🔊 **Audio Speech Synthesis**: 1-tap read-aloud feature for auditory learning and accessibility.

### 3. 🚨 SOS Emergency Pocket Rights (Offline-Ready)
Instant 1-tap emergency cheat sheets designed for high-stress situations:
* 🚔 **Arrest & Police Encounters** (Art 20, 21, 22, D.K. Basu guidelines, 24-hr magistrate rule).
* 👩 **Women's Rights in Custody** (Sunset-to-sunrise arrest ban, female officer mandate).
* 🏠 **Tenant Eviction & Lockout Safeguards** (Due process, utility cutoff ban, security deposits).
* 📱 **Phone Searches & Digital Privacy** (Puttaswamy 9-judge bench ruling, anti-self-incrimination).
* 📢 **Right to Peaceful Assembly & Protest** (Article 19(1)(b) safeguards).
* ⚡ Features: **1-Tap Copy**, **SpeechSynthesis Read Aloud**, and **Direct Emergency Helpline Calling** (112, 1091, 1930, 15100).

### 4. 🎭 "What Would You Do?" Interactive Decision Simulator
* Real-world branching dilemmas (e.g., *"The Midnight Search"*, *"Religious Freedom at School"*, *"College Protest Ban"*).
* Immediate constitutional feedback, points rewards, and associated Supreme Court precedents.

### 5. 🤖 Source-Grounded RAG AI Assistant
* Powered by **Google Gemini** with custom Retrieval-Augmented Generation (RAG).
* **Zero Hallucination Guarantee:** Every response is verified against the Bare Act database with clickable source badges, confidence metrics, and formatted markdown rendering.

### 6. 🪪 Digital Citizen Passport & Personal Dashboard
* **Citizen Passport Card**: Displays Level Title (*Active Citizen*, *Constitutional Scholar*, *Rights Guardian*, *Samvidhan Ratna*), Total XP, Day Streak Flame, and 1-tap shareable card.
* **Daily Quests**: 3 daily civic missions with claimable XP rewards and celebratory confetti.
* **Constitutional Mastery Matrix**: Progress tracking across Part III (Rights), Part IV (DPSP), Part IVA (Duties), and Cases.
* **Pocket Vault**: 1-click bookmarks for saved articles and saved AI Q&A answers.
* **National Leaderboard**: Weekly and All-Time civic literacy rankings.

### 7. 🔐 Frictionless Authentication & Guest-to-User State Sync
* Seamless guest browsing — all points, badges, and streaks earned as a guest automatically merge into the user account upon registration.

---

## 🏗️ Architecture & Tech Stack

```
SIH Project/
├── backend/                       # FastAPI Modular Monolith (Python 3.12)
│   ├── app/
│   │   ├── main.py                # FastAPI app instance, CORS & lifespan
│   │   ├── core/                  # Database, Config, Security (JWT + bcrypt)
│   │   ├── models/                # User, Article, Scenario, Gamification ORM
│   │   ├── schemas/               # Pydantic v2 Request/Response Models
│   │   ├── services/              # AI (Gemini RAG), Content, Search, Scenarios, Gamification
│   │   ├── api/v1/                # Clean Modular Routers (Auth, Users, Articles, AI, Scenarios)
│   │   └── seed/                  # 25+ Articles, 15+ Scenarios & Seed Script
│   └── requirements.txt
│
└── frontend/                      # Modern React 18 + Vite Web Application
    ├── src/
    │   ├── components/            # Header, AuthModal, SOSPocketModal, ScenarioPlayer, ChatMessage, ArticleCard
    │   ├── contexts/              # AuthContext, LanguageContext (EN/HI/Hinglish), ThemeContext
    │   ├── pages/                 # Home, Article (3-Tier), Scenarios, AIChat, Profile (Dashboard), Explore, NotFound
    │   └── services/api.js        # Resilient API Client with offline fallbacks & Pocket Vault storage
    └── package.json
```

| Layer | Technologies |
| :--- | :--- |
| **Backend** | Python 3.12, FastAPI, Uvicorn, Pydantic v2, Google Gemini API (`gemini-3.6-flash`) |
| **Database** | SQLAlchemy Async, aiosqlite (Local zero-config dev) / asyncpg & Supabase (PostgreSQL Cloud) |
| **Authentication** | JWT (python-jose), bcrypt password hashing (passlib) |
| **Frontend** | React 18, Vite, React Router v6, React-Markdown, Canvas-Confetti, Lucide-React |
| **Design System** | Custom Glassmorphic Dark UI, CSS Variables, Responsive Grid, Ashoka Navy & Saffron accents |

---

## 🚀 Getting Started

### 1. Prerequisites
- **Python 3.10+** (Python 3.12 recommended)
- **Node.js 18+** & npm

---

### 2. Backend Setup

```powershell
# Navigate to backend directory
cd backend

# Create & activate virtual environment
python -m venv .venv

# On Windows (PowerShell):
.venv\Scripts\Activate.ps1
# On Linux/macOS:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run initial database seed (creates tables & seeds 25+ articles and scenarios)
python -m app.seed.seed_db

# Start the FastAPI server
uvicorn app.main:app --reload --port 8000
```

* Backend API: **[http://localhost:8000](http://localhost:8000)**
* Interactive Swagger Docs: **[http://localhost:8000/docs](http://localhost:8000/docs)**
* ReDoc API Reference: **[http://localhost:8000/redoc](http://localhost:8000/redoc)**

---

### 3. Frontend Setup

```powershell
# In a separate terminal, navigate to frontend
cd frontend

# Install packages
npm install

# Start Vite dev server
npm run dev
```

* Frontend UI: **[http://localhost:5173](http://localhost:5173)**

---

## 📡 REST API Overview

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/v1/users/register` | Register new citizen account | No |
| `POST` | `/api/v1/users/login` | Login and receive JWT access token | No |
| `GET` | `/api/v1/users/profile` | Fetch authenticated user profile & XP | Yes |
| `PUT` | `/api/v1/users/preferences` | Update display name, language, mode | Yes |
| `GET` | `/api/v1/articles` | List all constitutional articles | No |
| `GET` | `/api/v1/articles/by-number/{num}` | Fetch article by number (e.g. `21`, `Preamble`) | No |
| `GET` | `/api/v1/articles/{id}/simplified` | Get 3-tier explanation (simple/student/detailed) | No |
| `POST` | `/api/v1/search/situation` | Natural language situation search | No |
| `POST` | `/api/v1/ai/ask` | RAG-powered AI question answering | No |
| `GET` | `/api/v1/scenarios` | List interactive decision scenarios | No |
| `POST` | `/api/v1/scenarios/{id}/submit` | Submit scenario choice & receive feedback/points | No |
| `GET` | `/api/v1/gamification/leaderboard` | Get weekly / all-time citizen leaderboard | No |

---

## 🎯 5-Minute Hackathon Demo Script

1. **Problem Statement (30s)**: 90%+ of Indian citizens cannot read or interpret their constitutional rights due to complex legal jargon, language barriers, and lack of contextual examples.
2. **Situation Search (1m)**: Type *"Can police arrest me without telling the reason?"* in Hinglish $\rightarrow$ System maps immediately to **Article 22**.
3. **3-Tier Depth Switch (45s)**: Toggle between **Simple 🟢**, **Student 🟡**, and **Detailed 🔴** to show adaptive learning for school students vs law aspirants.
4. **SOS Pocket Rights (45s)**: Click the **SOS Rights** button $\rightarrow$ Showcase instant, high-contrast emergency cheat sheets for police stops with 1-tap audio speech synthesis.
5. **Scenario Simulator (1m)**: Solve a real-life dilemma live $\rightarrow$ show points awarded, streak increment, and confetti.
6. **RAG AI Companion (45s)**: Ask Gemini a tough constitutional question $\rightarrow$ Highlight verified Bare Act citations and *"Save to Vault"* feature.
7. **Digital Citizen Passport (30s)**: Open the **Dashboard** $\rightarrow$ Show Citizen Level, Daily Quests, Mastery Matrix, and National Leaderboard.

---

## 🛡️ Grounding & Compliance
All content in Samvidhan Saathi is strictly grounded in:
- The **Constitution of India (Bare Act)** as published by the Ministry of Law and Justice, Government of India.
- Official judgments and rulings of the **Supreme Court of India** (e.g., *Kesavananda Bharati*, *Maneka Gandhi*, *K.S. Puttaswamy*, *D.K. Basu*).

---

## 👥 Smart India Hackathon (SIH)
* **Project Name**: Samvidhan Saathi (संविधान साथी)
* **Vision**: Democratizing Constitutional Literacy and Civic Empowerment across every corner of Bharat. 🇮🇳
