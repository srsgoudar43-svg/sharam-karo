# AgriCure AI — AI-Powered Agriculture Crop Advisory Assistant

[![AI Engine](https://img.shields.io/badge/AI%20Engine-Google%20Gemini%202.5%20Flash-059669?style=flat-square&logo=google)](https://ai.google.dev/)
[![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite%20%2B%20TailwindCSS-0284c7?style=flat-square&logo=react)](https://vitejs.dev/)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express%20%2B%20TypeScript-16a34a?style=flat-square&logo=node.js)](https://expressjs.com/)
[![Database](https://img.shields.io/badge/Database-Supabase%20PostgreSQL%20(RLS)-3ecf8e?style=flat-square&logo=supabase)](https://supabase.com/)

A production-grade, full-stack enterprise web application delivering real-time, data-driven crop health diagnostics, soil condition assessments, weather-integrated farming strategies, and personalized agricultural action plans for farmers, agronomists, and agricultural enterprises.

---

## 🌟 Key Capabilities

- **Multimodal Crop Diagnostics**: Real-time image upload and analysis for leaves, stems, fruit, and soil samples to detect nutrient deficiencies, pests, and fungal/bacterial pathogens.
- **Powered by Google Gemini 2.5 Flash**: Enforces structured JSON responses through `@google/genai` `responseSchema` for 100% reliable programmatic parsing.
- **Dynamic Agronomic Advisory Engine**: Generates structured, chronological action plans categorized into:
  - 🌿 **Organic Interventions**
  - 🧪 **Chemical Treatments**
  - 🚜 **Cultural Practices**
  - 🛡️ **Preventive Measures**
- **Interactive Field Dashboard**: Real-time overview of active fields, health indices, urgent alert ribbons, and agricultural weather telemetry.
- **Integrated Weather & Spray Advisory**: Live weather metrics (temperature, humidity, wind, rain probability, soil moisture approximation) calculating optimal foliar spraying windows to prevent chemical runoff.
- **Secure Authentication & RBAC**: Supabase Auth supporting Email/Password, Magic Link, and role-based personas (**Smallholder Farmer**, **Certified Agronomist**, **Enterprise Admin**).
- **Row Level Security (RLS)**: PostgreSQL schema fortified with native RLS policies isolating farm data per user.
- **Historical Advisory Logs**: Persistent archive searchable and filterable by crop type, urgency tier, and date.
- **Export & Field Utilities**: One-click Markdown report download, print/PDF layout for offline field use, and camera capture.

---

## 🏗️ System Architecture

```plaintext
crop-advisory-assistant/
├── client/                      # React 18 + Vite + Tailwind CSS Frontend
│   ├── src/
│   │   ├── components/          # Reusable UI components (Navbar, Sidebar, WeatherWidget, etc.)
│   │   ├── context/             # AuthContext (Supabase + instant demo personas)
│   │   ├── pages/               # Landing, Login, Dashboard, New Consultation, Result, History, Profile
│   │   ├── services/            # API client layer
│   │   ├── types/               # TypeScript interfaces
│   │   ├── App.tsx              # Routing and application layout
│   │   └── main.tsx             # React entrypoint
│   └── vite.config.ts           # Vite config with API proxy
├── server/                      # Express + TypeScript Backend
│   ├── src/
│   │   ├── config/              # Environment & Supabase initialization
│   │   ├── controllers/         # Consultation, Weather, and Profile controllers
│   │   ├── middleware/          # JWT Auth, Multer (10MB image limit)
│   │   ├── services/            # Gemini 2.5 Flash Multimodal & Persistence service
│   │   ├── validation/          # Zod runtime validation schemas
│   │   └── server.ts            # Express server entry point
├── supabase/
│   └── migrations/              # Production SQL schema with RLS policies & triggers
│       └── 20260324000000_init.sql
├── .env.example                 # Environment variables template
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18.0.0 or later)
- **npm** (v9.0.0 or later)

### 1. Clone & Configure Environment
```bash
git clone https://github.com/srsgoudar43-svg/sharam-karo.git
cd sharam-karo
cp .env.example .env
```

Edit `.env` to configure your keys (optional for immediate demo mode):
```ini
# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase PostgreSQL Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

> **Note:** The application features an intelligent dual-mode architecture. If credentials are not yet supplied, it seamlessly runs with the certified Domain Agronomic Expert Engine and local persistence for testing!

### 2. Install Dependencies
```bash
# Install Server dependencies
cd server
npm install

# Install Client dependencies
cd ../client
npm install
cd ..
```

### 3. Run Development Servers
In two separate terminals:

```bash
# Terminal 1: Backend Server (Port 5000)
cd server
npm run dev

# Terminal 2: Frontend Client (Port 5173)
cd client
npm run dev
```

Open your browser at **`http://localhost:5173`**.

---

## 🔒 Security & Data Isolation
- **Row Level Security (RLS)**: Enforced directly on `profiles`, `consultations`, and `treatment_actions` tables in PostgreSQL.
- **Security Headers**: Protected via `helmet` and strict CORS configurations.
- **Input Sanitization**: Multi-layer validation using `zod` schemas on both client and server.
- **Secure File Ingestion**: Multer memory storage restricted to maximum 10MB images with MIME verification.

---

## 📄 License
This project is open-source under the MIT License.
