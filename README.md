# CerviCare - AI-Powered Cervical Cancer Early Detection System

> **Final Year B.Tech Project | National Health Mission (NHM) Initiative | Maharashtra, India**

---

## Table of Contents

- [Problem Statement](#problem-statement)
- [Solution Overview](#solution-overview)
- [Key Features](#key-features)
- [Who Can Use This?](#who-can-use-this)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [AI Model - CervixNet121](#ai-model---cervixnet121)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
- [Running the Application](#running-the-application)
- [API Reference](#api-reference)
- [Dataset](#dataset)
- [Suggested Improvements](#suggested-improvements)

---

## Problem Statement

**Cervical cancer is the 2nd most common cancer among Indian women**, yet it is one of the most preventable and curable cancers when detected early.

The core problem in rural India:
- Most women in rural communities have **never had a cervical screening** in their lifetime
- Specialist doctors are concentrated in cities - **rural areas face acute shortage**
- Existing diagnosis requires **colposcopy labs, trained pathologists**, and complex equipment
- Results take **days to weeks**, delaying treatment at a critical window
- **Language barriers and low health literacy** prevent patients from understanding their results
- **Cost** of private diagnosis is prohibitive for families Below the Poverty Line (BPL)

> **Without early screening, cervical cancer is detected at Stage 3 or 4, where survival rates drop below 30%.**

---

## Solution Overview

**CerviCare** is an end-to-end AI-assisted cervical cancer early detection platform that:

1. **Empowers ASHA workers** to register, screen, and refer patients from rural communities
2. **Uses a trained deep learning model (DenseNet121 / CervixNet121)** to classify cervical images as Normal or Abnormal in under 60 seconds
3. **Connects Doctors** to review AI-flagged cases remotely, provide feedback, and recommend treatment
4. **Gives Patients** access to their screening results in simple, multilingual language

### Impact At A Glance

| Metric | Value |
|--------|-------|
| AI Screening Time | Less than 60 seconds |
| Early Detection Accuracy | 95%+ |
| Cost to Patient | Rs. 0 (Free) |
| Supported Languages | Hindi + English |
| Target Population | Rural women aged 25-65 |

---

## Key Features

### For ASHA Workers
- **Patient Registration** - Register new patients with demographics, medical history, and symptoms
- **AI Screening Upload** - Upload cervical images for instant AI analysis
- **Doctor Referral System** - Assign patients to specialist doctors with one click
- **Bidirectional Chat** - Communicate with both doctors and patients in real-time
- **Clinical Guidelines** - Built-in reference guidelines for VIA procedures
- **Patient Tracking** - View and manage all registered patients

### For Doctors
- **Assigned Patient Dashboard** - View all referred patients with their AI analysis results
- **Treatment and Analysis Review** - Add medical feedback, diagnoses, and next steps to each case
- **AI Result Validation** - Review the model prediction alongside the uploaded image
- **AI-Assisted Screening** - Access screening dashboard for direct image uploads
- **Patient History** - Full medical record access for each patient

### For Patients
- **Screening Results in Simple Language** - Reports explained without medical jargon
- **Voice Symptom Reporter** - Record symptoms via voice for patients with low literacy
- **Appointment Booking** - Book follow-up consultations with their assigned doctor
- **Chat with ASHA Worker** - Direct messaging for health guidance and support
- **Health Guidelines** - Personalised preventive health information

### For Admin
- **Full System Dashboard** - Monitor all users, patients, analyses, and assignments
- **User Management** - Create, view, and manage ASHA workers, doctors, labs, and patients
- **Hospital Management** - Add and manage partner hospitals and screening units

### System-Wide
- Dark / Light Mode Toggle
- Multilingual Support (Hindi + English)
- Role-Based Authentication (JWT Tokens)
- Fully Responsive Design (mobile-first)
- Cloud-Ready (Vercel + Render deployment ready)

---

## Who Can Use This?

| Role | Description | Access Level |
|------|-------------|--------------|
| **ASHA Worker** | Government-appointed health worker in rural villages | Register patients, upload images, refer to doctors, chat |
| **Doctor / Specialist** | Licensed gynecologist or oncologist | Review AI results, add diagnoses, recommend treatment |
| **Patient** | Rural woman aged 25-65 | View reports, book appointments, contact ASHA worker |
| **Lab / Pathology / Screening Van** | Diagnostic unit or mobile clinic | Upload cervical images, run AI screening |
| **Admin** | System administrator | Full platform access and user management |

---

## System Architecture

```
+------------------------------------------------------------------+
|                         USER LAYER                               |
|   ASHA Worker ---- Doctor ---- Patient ---- Admin ---- Lab       |
+---------------------------+--------------------------------------+
                            | HTTPS
+---------------------------v--------------------------------------+
|               FRONTEND (React 19 + Vite + TypeScript)            |
|   CerviCare Web App  .  Role-Based Dashboards  .  Tailwind CSS  |
+---------------------------+--------------------------------------+
                            | REST API calls
          +-----------------+-----------------+
          |                                   |
+---------v---------+             +-----------v---------+
|   Node.js/Express |             |  Python Flask API   |
|   Backend Server  |             |  (AI Model Server)  |
|   Port: 5000      |             |  Port: 8000         |
|                   |             |   CervixNet121      |
|  . /api/auth      |             |  DenseNet121 model  |
|  . /api/patients  |             |  . /predict         |
|  . /api/analyses  |             |  . /health          |
|  . /api/doctors   |             |  . /predict-batch   |
|  . /api/chats     |             +---------------------+
|  . /api/hospitals |                       ^
|  . /api/assignments                       |
+---------+---------+              Hugging Face Model
          |                         (auto-downloaded)
+---------v---------+
|     MongoDB       |
|   Database        |
|  Collections:     |
|  . Users          |
|  . Patients       |
|  . Analyses       |
|  . Assignments    |
|  . Appointments   |
|  . Chats          |
|  . Hospitals      |
+-------------------+
```

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19 | UI Framework |
| Vite | 8.x | Build Tool and Dev Server |
| TypeScript | 5.x | Type Safety |
| Tailwind CSS | 4.x | Styling |
| React Router DOM | 7.x | Client-side Routing |
| Radix UI | Latest | Accessible UI Primitives |
| Lucide React | 0.454 | Icons |
| Recharts | Latest | Data Visualization |
| React Hook Form + Zod | Latest | Form Handling and Validation |

### Backend (Node.js)
| Technology | Purpose |
|------------|---------|
| Node.js + Express.js | REST API Server |
| MongoDB + Mongoose | Database and ODM |
| JSON Web Tokens (JWT) | Authentication |
| bcryptjs | Password Hashing |
| CORS | Cross-Origin Resource Sharing |

### AI / ML (Python)
| Technology | Purpose |
|------------|---------|
| TensorFlow / Keras | Deep Learning Framework |
| DenseNet121 | CNN Architecture (Transfer Learning) |
| Flask + Flask-CORS | AI Model API Server |
| FastAPI + Uvicorn | Alternative API variant |
| Pillow / NumPy | Image Preprocessing |

---

## AI Model - CervixNet121

### Architecture
- **Base Model**: DenseNet121 (Densely Connected Convolutional Network)
- **Transfer Learning**: Pre-trained on ImageNet, fine-tuned on cervical cancer dataset
- **Input Size**: 288 x 288 pixels (RGB)
- **Output**: Binary classification - Normal (0) / Abnormal (1)
- **Threshold**: 0.55 confidence score (tunable via env variable)
- **Model Size**: ~154 MB

### Prediction Pipeline
```
Cervical Image
     |
     v  Resize to 288x288
     |
     v  DenseNet121 preprocess_input (normalization)
     |
     v  Model Inference (TensorFlow/Keras)
     |
     v  Raw Score [0.0 to 1.0]
     |
     +-- Score >= 0.55  -->  ABNORMAL (High Risk)
     +-- Score <  0.55  -->  NORMAL   (Low Risk)
```

### Model Hosting
- Primary: Hugging Face Hub (VedantJainnnn/cervixnet121)
- The Flask API auto-downloads the model on first startup if not found locally
- Production API: Deployed on Render (cancer-detection-1-2uz2.onrender.com)

---

## Project Structure

```
Cervical Cancer/
+-- README.md                        <- This file
+-- Cancer_Detection_Model/
|   +-- Model/
|       +-- cervix-model-api.py      <- Flask AI API server (MAIN)
|       +-- predict.py               <- FastAPI variant
|       +-- requirements.txt         <- Python dependencies
|       +-- render.yaml              <- Render deployment config
|       +-- start.sh                 <- Startup script
|       +-- final_cervix_model_optimized.keras  <- Trained model (154MB)
|
+-- Cancer_Detection_WebApp/
|   +-- WebApp/
|       +-- app/                     <- App Router pages
|       |   +-- page.tsx             <- Landing page (CerviCare home)
|       |   +-- layout.tsx           <- Root layout
|       |   +-- login/               <- Authentication pages
|       |   +-- signup/              <- Registration page
|       |   +-- forgot-password/     <- Password recovery
|       |   +-- admin/dashboard/     <- Admin panel
|       |   +-- doctor/dashboard/    <- Doctor portal
|       |   +-- aasha-worker/dashboard/ <- ASHA Worker portal
|       |   +-- patient/dashboard/   <- Patient portal
|       |   +-- screening/dashboard/ <- Lab/Van screening portal
|       |   +-- api/predict/         <- API route to Python AI
|       |
|       +-- components/              <- Reusable UI components
|       |   +-- doctor/              <- Doctor-specific components
|       |   +-- patient/             <- Patient-specific components
|       |   +-- aasha-worker/        <- ASHA Worker components
|       |   +-- screening/           <- Screening dashboard component
|       |   +-- admin/               <- Admin components
|       |   +-- ui/                  <- Generic UI primitives
|       |   +-- auth-guard.tsx       <- Route protection by role
|       |   +-- brand-logo.tsx       <- CerviCare brand logo
|       |   +-- language-switcher.tsx <- Hindi/English toggle
|       |   +-- theme-toggle.tsx     <- Dark/Light mode toggle
|       |
|       +-- lib/                     <- Utilities and services
|       |   +-- auth.ts              <- JWT Auth helpers
|       |   +-- api-services.ts      <- MongoDB REST API calls
|       |   +-- i18n.ts              <- Internationalisation strings
|       |   +-- i18n-context.tsx     <- React context for i18n
|       |   +-- blob-service.ts      <- Vercel Blob image storage
|       |
|       +-- server/                  <- Node.js Express Backend
|           +-- server.js            <- Express app entry point
|           +-- routes/
|           |   +-- auth.js          <- Register / Login routes
|           |   +-- api.js           <- All resource CRUD routes
|           +-- models/
|               +-- User.js          <- User schema (all roles)
|               +-- Patient.js       <- Patient schema
|               +-- Analysis.js      <- AI analysis results
|               +-- Assignment.js    <- Doctor-Patient assignments
|               +-- Appointment.js   <- Appointments
|               +-- Chat.js          <- Chat messages
|               +-- Hospital.js      <- Hospital registry
|
+-- dataset/
    +-- Train/                       <- Training images
    +-- Validate/                    <- Validation images
    +-- Test/                        <- Test images
```

---

## Setup and Installation

### Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js | 18+ |
| npm | 8+ |
| Python | 3.8+ |
| MongoDB | Local or Atlas |

### Step 1: Install Frontend Dependencies
```bash
cd "Cancer_Detection_WebApp/WebApp"
npm install
```

### Step 2: Install Backend (Express) Dependencies
```bash
cd server
npm install
```

### Step 3: Install Python AI Model Dependencies
```bash
cd "Cancer_Detection_Model/Model"
pip install -r requirements.txt
```

### Step 4: Configure Environment Variables

**Frontend** - file: Cancer_Detection_WebApp/WebApp/.env
```
VITE_PYTHON_MODEL_URL=http://localhost:8000/predict
```

**Backend** - create file: Cancer_Detection_WebApp/WebApp/server/.env
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/cancer_detection
JWT_SECRET=your_jwt_secret_key_here
```

---

## Running the Application

You need **3 terminal windows** running simultaneously:

### Terminal 1 - Start Python AI Model Server
```bash
cd "Cancer_Detection_Model/Model"
python cervix-model-api.py
```
Server runs on: http://localhost:8000
(On first run it will auto-download the model ~154MB from Hugging Face)

### Terminal 2 - Start Node.js Backend Server
```bash
cd "Cancer_Detection_WebApp/WebApp/server"
node server.js
```
Server runs on: http://localhost:5000

### Terminal 3 - Start Frontend (React + Vite)
```bash
cd "Cancer_Detection_WebApp/WebApp"
npm run dev
```
App runs on: http://localhost:5173

Open your browser and go to: **http://localhost:5173**

---

## API Reference

### Authentication Endpoints (Node.js - Port 5000)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register a new user (any role) |
| POST | /api/auth/login | Login and receive JWT token |

### Resource Endpoints (Node.js - Port 5000)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | /api/patients | List or create patients |
| GET/PUT/DELETE | /api/patients/:id | Get, update, or delete patient |
| GET | /api/doctors | List all doctors |
| GET | /api/asha-workers | List all ASHA workers |
| GET/POST | /api/analyses | List or create AI analyses |
| PUT | /api/analyses/:id | Update analysis (doctor review) |
| GET/POST | /api/assignments | List or create assignments |
| GET/POST | /api/appointments | List or book appointments |
| GET/POST | /api/chats | List or send chat messages |
| GET/POST | /api/hospitals | List or add hospitals |

### AI Prediction Endpoint (Python Flask - Port 8000)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | Health ping |
| GET | /health | Model status check |
| POST | /predict | Predict single cervical image |
| POST | /predict-batch | Batch predict (base64 list) |

**Sample /predict response:**
```json
{
  "filename": "cervix_image.jpg",
  "prediction": "Abnormal",
  "score": 0.7821,
  "confidence": 0.7821,
  "threshold": 0.55,
  "class": "abnormal",
  "timestamp": "2024-09-21T09:00:00Z"
}
```

---

## Dataset

The training dataset is organized under the dataset/ directory:

- Train/ - Training images (Normal + Abnormal classes)
- Validate/ - Validation set used during training
- Test/ - Held-out test set for evaluation

Image format: Standard colposcopy / VIA cervical images
Preprocessing: Resized to 288x288, DenseNet normalization applied
Classes: Normal, Abnormal

---

## Suggested Improvements

### High Priority
| # | Improvement | Reason |
|---|-------------|--------|
| 1 | SMS/WhatsApp notifications | Most patients do not use apps - SMS alerts for results would be more accessible |
| 2 | Offline mode / PWA support | Rural areas often have intermittent internet - offline-first capability is critical |
| 3 | Real helpline number | Footer shows placeholder 1800-XXX-XXXX - needs a real number for credibility |

### Medium Priority
| # | Improvement | Reason |
|---|-------------|--------|
| 4 | Multi-class AI prediction | Currently binary (Normal/Abnormal) - adding CIN grades 1/2/3 would be more clinically useful |
| 5 | Explainable AI (Grad-CAM) | Visual heatmaps showing which area triggered AI decision - increases doctor trust |
| 6 | Report PDF export | Doctors and patients need a printable PDF report for offline records |
| 7 | Admin analytics dashboard | Charts for screening coverage by region, referral conversion rates, etc. |

### Low Priority / Nice-to-Have
| # | Improvement | Reason |
|---|-------------|--------|
| 8 | Video call integration | Teleconsultation between doctor and ASHA worker for complex cases |
| 9 | More regional languages | Marathi, Gujarati, Tamil for broader reach beyond Hindi |
| 10 | FHIR/HL7 integration | Interoperability with government e-health (ABHA/Ayushman Bharat) records |

### Things That Could Be Simplified
| # | Item | Reason |
|---|------|--------|
| 11 | Two Python API variants (predict.py + cervix-model-api.py) | Only one is needed - cervix-model-api.py is the main one; predict.py can be removed |
| 12 | Vercel Blob dependency | Complex for local dev - simple local file storage would reduce setup friction |

---

> "For every village, for every mother."
>
> (c) 2024 CerviCare - National Health Mission Initiative - All data is private and secure.
