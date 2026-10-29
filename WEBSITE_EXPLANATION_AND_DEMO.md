# CerviCare Website - Explanation, Flow, and Demo Guide

> A complete guide for seminar presentation covering: What the website does, Who uses it, How it works, and a step-by-step real-world example.

---

## SECTION 1: WHAT PROBLEM DOES IT SOLVE?

### The Crisis in Rural India

India loses approximately 60,000 women to cervical cancer every year.
Cervical cancer is the 2nd most common cancer in Indian women - yet it is nearly 100% curable when caught early.

The tragedy is this: in rural Maharashtra and most of India, women never get screened.

Why?

1. The nearest gynecologist is often 50 to 100 km away.
2. Traditional colposcopy requires an expensive lab, trained pathologist, and results take days.
3. Women with no formal education cannot read or understand medical reports.
4. Cost of private diagnosis: Rs. 2,000 to Rs. 5,000 - unaffordable for BPL families.
5. Cultural hesitation and lack of awareness stop women from seeking help.

### The Outcome of No Screening

Without screening, cervical cancer is typically discovered at Stage 3 or Stage 4.
At this stage, the 5-year survival rate drops from 90%+ to below 30%.

CerviCare exists to break this cycle.

---

## SECTION 2: WHAT IS CERVICARE?

CerviCare is a web-based healthcare platform that brings together:
- ASHA workers (community health workers)
- Specialist doctors
- Rural patients (women aged 25 to 65)

...into a single connected system powered by Artificial Intelligence.

The platform uses a deep learning model called CervixNet121 (based on DenseNet121 architecture) to analyze cervical images and classify them as NORMAL or ABNORMAL in under 60 seconds.

It removes the need for a physical specialist to be present during initial screening. The AI does the first-level analysis, and the human doctor reviews, confirms, and prescribes.

---

## SECTION 3: WHO CAN USE CERVICARE?

The platform has 5 distinct user roles, each with their own dashboard and permissions.

### Role 1: ASHA Worker (Accredited Social Health Activist)
ASHA workers are government-trained village-level health workers. They are the backbone of rural healthcare in India.

On CerviCare, an ASHA worker can:
- Register new patients (name, age, address, symptoms, medical history)
- Upload cervical images captured at mobile screening camps for AI analysis
- Assign patients to a specialist doctor for review
- Chat directly with doctors and patients
- Access clinical VIA guidelines for on-field reference
- Track all patients they have registered

### Role 2: Doctor (Specialist)
Doctors review AI-flagged cases remotely from their hospital or clinic.

On CerviCare, a doctor can:
- View all patients assigned to them by ASHA workers
- See the AI analysis result + confidence score for each case
- Add their medical opinion, diagnosis, and recommended next steps
- Access the screening dashboard to directly upload and analyze images
- Review full patient history and past analyses

### Role 3: Patient
Patients are rural women who have undergone cervical screening.

On CerviCare, a patient can:
- View their screening result in simple, plain language (not medical jargon)
- Switch between Hindi and English for their comfort
- Record voice symptoms if they cannot type
- Book an appointment with their assigned doctor
- Chat with their ASHA worker for guidance and support
- Read health awareness guidelines tailored to them

### Role 4: Lab / Pathology / Screening Van
Mobile screening units or labs can log in separately and upload cervical images for AI analysis directly, without going through an ASHA worker.

### Role 5: Admin
The admin has full system access to:
- Create and manage all user accounts (doctors, ASHA workers, labs)
- Manage hospitals and screening units
- Monitor all patients, analyses, and assignments across the platform

---

## SECTION 4: HOW THE WEBSITE WORKS - TECHNICAL OVERVIEW

CerviCare is built in 3 layers that work together.

### Layer 1: Frontend (What the user sees)
- Built with React 19 + Vite + TypeScript
- Styled with Tailwind CSS
- Supports Dark Mode, Light Mode, Hindi, and English
- Fully responsive - works on desktops, tablets, and phones
- Role-based routing: each user type sees only their own dashboard

### Layer 2: Backend (Business logic and data storage)
- Node.js + Express.js server running on Port 5000
- MongoDB database stores:
  - Users (ASHA workers, doctors, patients, admins, labs)
  - Patients (demographics, history, symptoms)
  - Analyses (AI results, doctor feedback)
  - Assignments (which doctor handles which patient)
  - Appointments (scheduled consultations)
  - Chats (messages between roles)
  - Hospitals (partner institutions)
- Authentication: JWT (JSON Web Tokens) - each login generates a secure 30-day token
- Passwords are hashed using bcrypt - never stored in plain text

### Layer 3: AI Model (The brain)
- Python Flask API server running on Port 8000
- Model: DenseNet121 (a Densely Connected Convolutional Neural Network)
- Trained via Transfer Learning: pre-trained on ImageNet, fine-tuned on cervical cancer images
- Input: A 288x288 pixel RGB cervical image
- Output: A score from 0.0 to 1.0
  - Score >= 0.55 = ABNORMAL (flags as high risk)
  - Score < 0.55 = NORMAL (low risk)
- Model hosted on Hugging Face Hub, auto-downloaded on first run (~154 MB)
- Production deployment on Render cloud platform

### How the Image Flows Through the System:
```
ASHA Worker uploads image on website
  --> React frontend sends image to Node.js /api route
  --> Node.js API route forwards image to Python Flask /predict endpoint
  --> Flask loads DenseNet121 model, preprocesses image (resize to 288x288, normalize)
  --> Model runs inference, outputs raw score
  --> Flask returns: prediction, score, confidence, threshold
  --> Node.js stores result in MongoDB Analysis collection
  --> Frontend displays result to ASHA worker and patient
  --> Doctor is notified of flagged case for review
```

---

## SECTION 5: COMPLETE REAL-WORLD EXAMPLE - STEP BY STEP

### Example: Meena, 42 years old, Nashik district, Maharashtra

---

### PHASE 1: Awareness and Registration

**Day 1 - Village Health Camp**

Priya is an ASHA worker assigned to a village near Nashik. She holds a health awareness camp and convinces several women to get a free cervical screening at the mobile clinic.

Meena, 42, agrees to get screened. She has never had a cervical check before.

**Priya logs in to CerviCare:**
- URL: http://localhost:5173 (or the deployed link)
- Username: priya@nashik.nhm.gov.in
- Password: (her registered password)
- Role: ASHA Worker

After login, the system checks her role and automatically redirects her to:
/aasha-worker/dashboard

**Priya registers Meena as a new patient:**
- Tab: "Register Patient"
- Fills in: Name = Meena Patil, Age = 42, Gender = Female
- Phone = 9876XXXXXX, Address = Village Dindori, Nashik
- Symptoms = Occasional spotting after menstruation (typed by Priya)
- Medical History = No previous cancer screening
- Clicks "Register Patient"

What happens in the system:
- The form data is sent to POST /api/patients (Node.js backend)
- MongoDB creates a new Patient record with a unique ID like PAT72341
- A User account is also optionally created for Meena so she can later log in

---

### PHASE 2: Image Upload and AI Screening

**At the Mobile Screening Camp**

A trained healthcare provider takes a standardized cervical image of Meena using a portable imaging device. The image is transferred to Priya's tablet.

**Priya uploads the image:**
- She goes to the Screening Dashboard (accessible from ASHA Worker or Doctor dashboards)
- URL changes to: /screening/dashboard
- She selects Meena's patient ID from the patient list
- Clicks "Upload Image" and selects Meena's cervical image file
- Clicks "Analyze with AI"

**What happens inside the system:**

Step 1: The React frontend creates a FormData object with the image file.

Step 2: It sends a POST request to /api/predict (the Next.js/Vite API route).

Step 3: The API route forwards the image as multipart/form-data to the Python Flask endpoint:
  URL: http://localhost:8000/predict (or the Render production URL)

Step 4: Flask receives the image and runs it through the pipeline:
  - Opens image using Pillow
  - Resizes to 288 x 288 pixels
  - Applies DenseNet121 preprocessing (pixel normalization)
  - Feeds into the trained Keras model
  - Gets a raw score: e.g., 0.7821

Step 5: The score 0.7821 is greater than the threshold 0.55.
  Result: ABNORMAL (Prediction: "Abnormal", Confidence: 78.21%)

Step 6: Flask returns this JSON response:
```
{
  "prediction": "Abnormal",
  "score": 0.7821,
  "confidence": 0.7821,
  "threshold": 0.55,
  "class": "abnormal"
}
```

Step 7: The frontend receives the response and displays to Priya:
  - A red/orange alert box: "ABNORMAL - 78% Confidence"
  - Message: "This result requires doctor review. Please refer the patient immediately."

Step 8: The analysis is saved to MongoDB Analysis collection with:
  - Patient ID: PAT72341
  - Image URL (stored in Vercel Blob)
  - Prediction: "Abnormal"
  - Risk Level: "high"
  - ASHA Worker ID: Priya's ID
  - Status: Pending doctor review

---

### PHASE 3: Doctor Referral

**Priya refers Meena to Dr. Ramesh:**

- Priya goes to the "Patient Referrals" tab on her dashboard
- Selects Meena's patient record
- Chooses Dr. Ramesh (Gynecologist, Nashik Civil Hospital) from a dropdown list of available doctors
- Clicks "Assign to Doctor"

What happens in the system:
- A POST request to /api/assignments creates a new Assignment record:
  - Patient ID: PAT72341
  - Doctor ID: Dr. Ramesh's MongoDB ID
  - ASHA Worker ID: Priya's ID
  - Status: "referred"
- The Patient record is also updated with doctorId = Dr. Ramesh's ID

---

### PHASE 4: Doctor Reviews the Case

**Dr. Ramesh logs into CerviCare:**
- Role: Doctor
- Dashboard: /doctor/dashboard

**He sees the alert:**
- Tab: "Assigned Patients"
- Meena Patil appears in the list with a red "ABNORMAL" badge
- AI Confidence: 78%
- Symptom notes: "Occasional spotting after menstruation"

**Dr. Ramesh reviews:**
- He clicks on Meena's record to expand the full analysis
- He views the uploaded cervical image alongside the AI prediction
- Based on the image quality, symptoms, and the AI score, he agrees with the assessment

**Dr. Ramesh writes his recommendation:**
- He goes to the "Treatment" tab
- Adds feedback: "AI result is consistent with early-stage cervical lesion. Recommend immediate colposcopy and biopsy at Nashik Civil Hospital. Urgency: High."
- Adds next steps: "Patient should visit on or before 25th September. ASHA worker Priya to accompany for support."
- Clicks "Save Treatment Review"

What happens in the system:
- PUT /api/analyses/:id updates the Analysis record with:
  - doctorFeedback: his written feedback
  - nextSteps: his recommendations
  - doctorReviewAt: current timestamp (2024-09-21)
  - result updated to: "abnormal"

---

### PHASE 5: Patient Views Her Report

**Meena logs in to CerviCare (from home via her phone):**
- Role: Patient
- Dashboard: /patient/dashboard
- Language: Hindi (she switches using the language toggle)

**She checks her Report:**
- Tab: "View Reports" (shown in Hindi)
- She sees her result displayed in plain language:
  "Aapki janch mein kuch alag tha. Doctor ne kaha hai jald se jald hospital aaye."
  (Translation: "Something unusual was found in your screening. The doctor says you should visit the hospital soon.")

- She also sees Dr. Ramesh's appointment recommendation:
  "Nashik Civil Hospital mein 25 September se pahle aaye."
  (Translation: "Visit Nashik Civil Hospital before 25th September.")

**She books an appointment:**
- Tab: "Appointments"
- Selects Dr. Ramesh, Date: 24 September 2024, Time: 10:00 AM
- Clicks "Book Appointment"

**She messages Priya:**
- Tab: "Contact ASHA Worker"
- Sends message: "Didi, kab jaana hai hospital?"
  (Translation: "Sister, when do we go to the hospital?")
- Priya replies via her ASHA Worker dashboard

---

### OUTCOME

Meena visits Nashik Civil Hospital on 24th September.
A colposcopy confirms early-stage CIN 2 lesion.
She undergoes LEEP (Loop Electrosurgical Excision Procedure) - a simple 15-minute outpatient procedure.

She is fully cured. No chemotherapy. No surgery. No life lost.

**This entire journey - from screening to diagnosis to appointment - happened in under 4 days, for zero cost to Meena.**

---

## SECTION 6: KEY SCREENS SUMMARY

| Screen | Route | Who Uses It | What It Does |
|--------|-------|-------------|--------------|
| Landing Page | / | Everyone | Shows project overview, roles, awareness facts, CTA |
| Login | /login | All users | Email + password login, JWT issued |
| Signup | /signup | New users | Register with role selection |
| ASHA Worker Dashboard | /aasha-worker/dashboard | ASHA Workers | Register patients, upload images, assign doctors, chat |
| Doctor Dashboard | /doctor/dashboard | Doctors | View cases, add feedback, review analyses |
| Patient Dashboard | /patient/dashboard | Patients | View reports, book appointments, voice symptoms, chat |
| Screening Dashboard | /screening/dashboard | Doctors + Labs + Vans | Upload images, get AI predictions |
| Admin Dashboard | /admin/dashboard | Admin | Manage all users, hospitals, system overview |

---

## SECTION 7: HOW THE LANGUAGE SWITCHER WORKS

CerviCare supports Hindi and English across the entire platform.

The i18n (internationalization) system works via React Context:
- All UI strings are defined in lib/i18n.ts with both English and Hindi translations
- A LanguageSwitcher component in the top navigation bar lets any user toggle between languages
- The selected language is stored in browser state and applied immediately across all text

This is critical for patient-facing screens where low literacy in English is a barrier.

---

## SECTION 8: SECURITY AND PRIVACY

1. **Authentication**: JWT tokens expire in 30 days. Each request checks the token.
2. **Password Storage**: bcrypt hashing - passwords are never stored in plain text.
3. **Role Enforcement**: AuthGuard component checks the user's role before rendering any dashboard. A patient cannot access the doctor dashboard. An ASHA worker cannot see admin controls.
4. **Data Privacy**: Patient data is stored in a private MongoDB database. The AI model processes images transiently - images are not permanently stored on the AI server.
5. **HTTPS Ready**: The system is configured for HTTPS deployment on Vercel and Render.

---

## SECTION 9: WHAT MAKES THIS PROJECT UNIQUE

1. **End-to-end solution**: Not just an AI model - it is a complete healthcare management system connecting all stakeholders.

2. **Designed for rural India**: Hindi support, voice symptom input, simple patient-facing language, and ASHA worker integration make this genuinely accessible.

3. **AI + Human validation**: The system does not replace doctors - it gives doctors AI-flagged cases with quantified confidence scores so they can prioritize and decide faster.

4. **Zero cost to patient**: The platform is free for end-users and designed to be supported under NHM infrastructure.

5. **Multi-role, multi-device**: Works on mobile phones, tablets, and desktops. ASHA workers in the field, doctors in the hospital, patients at home.

6. **Cloud-ready**: Already deployed on Render (AI model) and ready for Vercel (frontend). Can scale nationally.

---

## SECTION 10: SUGGESTED IMPROVEMENTS FOR FUTURE WORK

These are NOT blockers for the current working system - they are next steps for a more powerful product.

### Critical (High Value, Feasible)
1. **SMS/WhatsApp notification** when AI result is ready - rural patients do not check apps regularly
2. **Progressive Web App (PWA) / Offline support** - poor network connectivity in villages
3. **Grad-CAM heatmap visualization** - show doctors which part of the image triggered the abnormal flag (Explainable AI)
4. **Multi-class prediction** - instead of just Normal/Abnormal, classify into CIN 1 / CIN 2 / CIN 3 / Cancer

### Medium Priority
5. **PDF report export** - printable reports for hospitals and patients who need physical copies
6. **Admin region-wise analytics** - which villages have low screening coverage, which doctors have most referrals
7. **Appointment reminders** - automated reminders for scheduled hospital visits

### Simplification (Remove Complexity)
8. **Merge predict.py and cervix-model-api.py** - two Python API files exist; only Flask one (cervix-model-api.py) is used in production. Remove predict.py to reduce confusion.
9. **Replace Vercel Blob with local storage for dev** - Vercel Blob requires API keys and adds complexity for local setup and demos.

---

> CerviCare demonstrates that AI does not need to be complex to save lives.
> A simple image, a trained model, and a connected community worker can make all the difference.
>
> "Detect Early. Protect Mothers. Save Lives."
