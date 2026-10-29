"use client"

import { useEffect } from "react"

import { useState } from "react"

export type Language = "en" | "hi" | "mr"

export interface Translations {
  // Common
  common: {
    welcome: string
    login: string
    logout: string
    signup: string
    submit: string
    cancel: string
    save: string
    edit: string
    delete: string
    search: string
    loading: string
    error: string
    success: string
    name: string
    email: string
    phone: string
    address: string
    age: string
    gender: string
    male: string
    female: string
    other: string
    date: string
    time: string
    status: string
    actions: string
    view: string
    download: string
    upload: string
    back: string
    next: string
    previous: string
    home: string
    dashboard: string
    profile: string
    settings: string
    help: string
    contact: string
    about: string
    language: string
  }

  // Home Page
  home: {
    title: string
    subtitle: string
    description: string
    getStarted: string
    features: {
      aiDetection: string
      aiDetectionDesc: string
      multiRole: string
      multiRoleDesc: string
      voiceSupport: string
      voiceSupportDesc: string
    }
    cta: string
  }

  // Auth
  auth: {
    loginTitle: string
    signupTitle: string
    forgotPasswordTitle: string
    emailPlaceholder: string
    passwordPlaceholder: string
    rememberMe: string
    forgotPassword: string
    noAccount: string
    hasAccount: string
    createAccount: string
    signIn: string
    resetPassword: string
    backToLogin: string
    selectRole: string
    admin: string
    doctor: string
    patient: string
    username: string
    password: string
    ashaWorker: string
  }

  // Admin
  admin: {
    dashboard: string
    addPatient: string
    addDoctor: string
    addHospital: string
    manageConnections: string
    guidelines: string
    totalPatients: string
    totalDoctors: string
    totalHospitals: string
    recentActivity: string
    patientName: string
    doctorName: string
    hospitalName: string
    specialization: string
    experience: string
    location: string
    symptoms: string
    uploadImage: string
    aiAnalysis: string
    assignDoctor: string
    patientAdded: string
    doctorAdded: string
    hospitalAdded: string
    addAshaWorker: string
    addAshaWorkerDesc: string
    ashaWorkerAdded: string
    ashaWorkerAddError: string
    credentialsGenerated: string
    credentialsDesc: string
    personalInfo: string
    workInfo: string
    dateOfBirth: string
    district: string
    selectDistrict: string
    blockTehsil: string
    villageArea: string
    selectExperience: string
    years: string
    adding: string
    important: string
    credentialsWarning: string
  }

  // Doctor
  doctor: {
    dashboard: string
    assignedPatients: string
    medicalRecords: string
    contactAasha: string
    patientReports: string
    diagnosis: string
    treatment: string
    followUp: string
    normal: string
    abnormal: string
    pending: string
    completed: string
  }

  // Patient
  patient: {
    dashboard: string
    bookAppointment: string
    viewReports: string
    voiceSymptoms: string
    contactAasha: string
    guidelines: string
    healthSummary: string
    upcomingAppointments: string
    recentReports: string
    recordSymptoms: string
    selectHospital: string
    selectDoctor: string
    appointmentDate: string
    appointmentTime: string
    bookNow: string
    reportDate: string
    reportType: string
    result: string
    downloadReport: string
  }

  // ASHA Worker
  ashaWorker: {
    dashboard: string
    addPatient: string
    cervixAnalysis: string
    contactDoctor: string
    guidelines: string
    emergencyCall: string
    patientRegistration: string
    aiAnalysisResult: string
    normalResult: string
    abnormalResult: string
    uploadCervixPhoto: string
    analysisInProgress: string
    patientDetails: string
    medicalInfo: string
    emergencyContact: string
    voiceRecording: string
    useVoiceRecording: string
    hideVoiceRecording: string
    registerPatient: string
    registering: string
    patientRegistered: string
    registrationError: string
  }
}

export const translations: Record<Language, Translations> = {
  en: {
    common: {
      welcome: "Welcome",
      login: "Login",
      logout: "Logout",
      signup: "Sign Up",
      submit: "Submit",
      cancel: "Cancel",
      save: "Save",
      edit: "Edit",
      delete: "Delete",
      search: "Search",
      loading: "Loading...",
      error: "Error",
      success: "Success",
      name: "Name",
      email: "Email",
      phone: "Phone",
      address: "Address",
      age: "Age",
      gender: "Gender",
      male: "Male",
      female: "Female",
      other: "Other",
      date: "Date",
      time: "Time",
      status: "Status",
      actions: "Actions",
      view: "View",
      download: "Download",
      upload: "Upload",
      back: "Back",
      next: "Next",
      previous: "Previous",
      home: "Home",
      dashboard: "Dashboard",
      profile: "Profile",
      settings: "Settings",
      help: "Help",
      contact: "Contact",
      about: "About",
      language: "Language",
    },
    home: {
      title: "Cancer Detection System",
      subtitle: "AI-Powered Early Detection for Better Healthcare",
      description:
        "Advanced cancer detection system with AI analysis, multi-role access, and comprehensive patient care management.",
      getStarted: "Get Started",
      features: {
        aiDetection: "AI-Powered Detection",
        aiDetectionDesc: "Advanced AI algorithms for accurate cancer detection and analysis",
        multiRole: "Multi-Role Access",
        multiRoleDesc: "Separate dashboards for patients, doctors, and healthcare workers",
        voiceSupport: "Voice Support",
        voiceSupportDesc: "Voice-to-text functionality for easy symptom recording",
      },
      cta: "Start Your Health Journey Today",
    },
    auth: {
      loginTitle: "Login to Your Account",
      signupTitle: "Create New Account",
      forgotPasswordTitle: "Reset Your Password",
      emailPlaceholder: "Enter your email",
      passwordPlaceholder: "Enter your password",
      rememberMe: "Remember me",
      forgotPassword: "Forgot password?",
      noAccount: "Don't have an account?",
      hasAccount: "Already have an account?",
      createAccount: "Create Account",
      signIn: "Sign In",
      resetPassword: "Reset Password",
      backToLogin: "Back to Login",
      selectRole: "Select Role",
      admin: "Admin",
      doctor: "Doctor",
      patient: "Patient",
      username: "Username",
      password: "Password",
      ashaWorker: "ASHA Worker",
    },
    admin: {
      dashboard: "Admin Dashboard",
      addPatient: "Add Patient",
      addDoctor: "Add Doctor",
      addHospital: "Add Hospital",
      manageConnections: "Manage Connections",
      guidelines: "Guidelines",
      totalPatients: "Total Patients",
      totalDoctors: "Total Doctors",
      totalHospitals: "Total Hospitals",
      recentActivity: "Recent Activity",
      patientName: "Patient Name",
      doctorName: "Doctor Name",
      hospitalName: "Hospital Name",
      specialization: "Specialization",
      experience: "Experience",
      location: "Location",
      symptoms: "Symptoms",
      uploadImage: "Upload Medical Image",
      aiAnalysis: "AI Analysis",
      assignDoctor: "Assign Doctor",
      patientAdded: "Patient added successfully",
      doctorAdded: "Doctor added successfully",
      hospitalAdded: "Hospital added successfully",
      addAshaWorker: "Add ASHA Worker",
      addAshaWorkerDesc: "Register a new ASHA worker in the system and generate login credentials",
      ashaWorkerAdded: "ASHA Worker Added Successfully",
      ashaWorkerAddError: "Failed to add ASHA worker. Please try again.",
      credentialsGenerated: "Login Credentials Generated",
      credentialsDesc:
        "Please share these credentials with the ASHA worker securely. They can use these to login to the system.",
      personalInfo: "Personal Information",
      workInfo: "Work Information",
      dateOfBirth: "Date of Birth",
      district: "District",
      selectDistrict: "Select district",
      blockTehsil: "Block/Tehsil",
      villageArea: "Village/Area",
      selectExperience: "Select experience",
      years: "years",
      adding: "Adding...",
      important: "Important",
      credentialsWarning: "Please save these credentials securely. They will not be shown again.",
    },
    doctor: {
      dashboard: "Doctor Dashboard",
      assignedPatients: "Assigned Patients",
      medicalRecords: "Medical Records",
      contactAasha: "Contact Aasha Worker",
      patientReports: "Patient Reports",
      diagnosis: "Diagnosis",
      treatment: "Treatment",
      followUp: "Follow Up",
      normal: "Normal",
      abnormal: "Abnormal",
      pending: "Pending",
      completed: "Completed",
    },
    patient: {
      dashboard: "Patient Dashboard",
      bookAppointment: "Book Appointment",
      viewReports: "View Reports",
      voiceSymptoms: "Voice Symptoms",
      contactAasha: "Contact Aasha Worker",
      guidelines: "Health Guidelines",
      healthSummary: "Health Summary",
      upcomingAppointments: "Upcoming Appointments",
      recentReports: "Recent Reports",
      recordSymptoms: "Record Symptoms",
      selectHospital: "Select Hospital",
      selectDoctor: "Select Doctor",
      appointmentDate: "Appointment Date",
      appointmentTime: "Appointment Time",
      bookNow: "Book Now",
      reportDate: "Report Date",
      reportType: "Report Type",
      result: "Result",
      downloadReport: "Download Report",
    },
    ashaWorker: {
      dashboard: "ASHA Worker Dashboard",
      addPatient: "Add Patient",
      cervixAnalysis: "Cervix Analysis",
      contactDoctor: "Contact Doctor",
      guidelines: "Guidelines",
      emergencyCall: "Emergency Call",
      patientRegistration: "Patient Registration",
      aiAnalysisResult: "AI Analysis Result",
      normalResult: "Normal",
      abnormalResult: "Abnormal",
      uploadCervixPhoto: "Upload Cervix Photo",
      analysisInProgress: "Analysis in Progress",
      patientDetails: "Patient Details",
      medicalInfo: "Medical Information",
      emergencyContact: "Emergency Contact",
      voiceRecording: "Voice Recording",
      useVoiceRecording: "Use Voice Recording",
      hideVoiceRecording: "Hide Voice Recording",
      registerPatient: "Register Patient",
      registering: "Registering...",
      patientRegistered: "Patient Registered Successfully",
      registrationError: "Failed to register patient. Please try again.",
    },
  },
  hi: {
    common: {
      welcome: "स्वागत है",
      login: "लॉगिन",
      logout: "लॉगआउट",
      signup: "साइन अप",
      submit: "जमा करें",
      cancel: "रद्द करें",
      save: "सेव करें",
      edit: "संपादित करें",
      delete: "हटाएं",
      search: "खोजें",
      loading: "लोड हो रहा है...",
      error: "त्रुटि",
      success: "सफलता",
      name: "नाम",
      email: "ईमेल",
      phone: "फोन",
      address: "पता",
      age: "उम्र",
      gender: "लिंग",
      male: "पुरुष",
      female: "महिला",
      other: "अन्य",
      date: "तारीख",
      time: "समय",
      status: "स्थिति",
      actions: "कार्य",
      view: "देखें",
      download: "डाउनलोड",
      upload: "अपलोड",
      back: "वापस",
      next: "अगला",
      previous: "पिछला",
      home: "होम",
      dashboard: "डैशबोर्ड",
      profile: "प्रोफाइल",
      settings: "सेटिंग्स",
      help: "सहायता",
      contact: "संपर्क",
      about: "के बारे में",
      language: "भाषा",
    },
    home: {
      title: "कैंसर डिटेक्शन सिस्टम",
      subtitle: "बेहतर स्वास्थ्य सेवा के लिए AI-संचालित प्रारंभिक पहचान",
      description: "AI विश्लेषण, मल्टी-रोल एक्सेस और व्यापक रोगियों देखभाल प्रबंधन के साथ उन्नत कैंसर डिटेक्शन सिस्टम।",
      getStarted: "शुरू करें",
      features: {
        aiDetection: "AI-संचालित पहचान",
        aiDetectionDesc: "सटीक कैंसर पहचान और विश्लेषण के लिए उन्नत AI एल्गोरिदम",
        multiRole: "मल्टी-रोल एक्सेस",
        multiRoleDesc: "रोगियों, डॉक्टरों और स्वास्थ्य कर्मचारियों के लिए अलग डैशबोर्ड",
        voiceSupport: "वॉयस सपोर्ट",
        voiceSupportDesc: "आसान लक्षण रिकॉर्डिंग के लिए वॉयस-टू-टेक्स्ट कार्यक्षमता",
      },
      cta: "आज ही अपनी स्वास्थ्य यात्रा शुरू करें",
    },
    auth: {
      loginTitle: "अपने खाते में लॉगिन करें",
      signupTitle: "नया खाता बनाएं",
      forgotPasswordTitle: "अपना पासवर्ड रीसेट करें",
      emailPlaceholder: "अपना ईमेल दर्ज करें",
      passwordPlaceholder: "अपना पासवर्ड दर्ज करें",
      rememberMe: "मुझे याद रखें",
      forgotPassword: "पासवर्ड भूल गए?",
      noAccount: "खाता नहीं है?",
      hasAccount: "पहले से खाता है?",
      createAccount: "खाता बनाएं",
      signIn: "साइन इन",
      resetPassword: "पासवर्ड रीसेट करें",
      backToLogin: "लॉगिन पर वापस जाएं",
      selectRole: "भूमिका चुनें",
      admin: "एडमिन",
      doctor: "डॉक्टर",
      patient: "रोगी",
      username: "उपयोगकर्ता नाम",
      password: "पासवर्ड",
      ashaWorker: "आशा कार्यकर्ता",
    },
    admin: {
      dashboard: "एडमिन डैशबोर्ड",
      addPatient: "रोगी जोड़ें",
      addDoctor: "डॉक्टर जोड़ें",
      addHospital: "अस्पताल जोड़ें",
      manageConnections: "कनेक्शन प्रबंधित करें",
      guidelines: "दिशानिर्देश",
      totalPatients: "कुल रोगी",
      totalDoctors: "कुल डॉक्टर",
      totalHospitals: "कुल अस्पताल",
      recentActivity: "हाल की गतिविधि",
      patientName: "रोगी का नाम",
      doctorName: "डॉक्टर का नाम",
      hospitalName: "अस्पताल का नाम",
      specialization: "विशेषज्ञता",
      experience: "अनुभव",
      location: "स्थान",
      symptoms: "लक्षण",
      uploadImage: "मेडिकल इमेज अपलोड करें",
      aiAnalysis: "AI विश्लेषण",
      assignDoctor: "डॉक्टर असाइन करें",
      patientAdded: "रोगी सफलतापूर्वक जोड़ा गया",
      doctorAdded: "डॉक्टर सफलतापूर्वक जोड़ा गया",
      hospitalAdded: "अस्पताल सफलतापूर्वक जोड़ा गया",
      addAshaWorker: "आशा कार्यकर्ता जोड़ें",
      addAshaWorkerDesc: "सिस्टम में नया आशा कार्यकर्ता पंजीकृत करें और लॉगिन क्रेडेंशियल जेनरेट करें",
      ashaWorkerAdded: "आशा कार्यकर्ता सफलतापूर्वक जोड़ा गया",
      ashaWorkerAddError: "आशा कार्यकर्ता जोड़ने में विफल। कृपया पुनः प्रयास करें।",
      credentialsGenerated: "लॉगिन क्रेडेंशियल जेनरेट किए गए",
      credentialsDesc:
        "कृपया इन क्रेडेंशियल्स को आशा कार्यकर्ता के साथ सुरक्षित रूप से साझा करें। वे इनका उपयोग सिस्टम में लॉगिन करने के लिए कर सकते हैं।",
      personalInfo: "व्यक्तिगत जानकारी",
      workInfo: "कार्य की जानकारी",
      dateOfBirth: "जन्म तिथि",
      district: "जिला",
      selectDistrict: "जिला चुनें",
      blockTehsil: "ब्लॉक/तहसील",
      villageArea: "गांव/क्षेत्र",
      selectExperience: "अनुभव चुनें",
      years: "वर्ष",
      adding: "जोड़ा जा रहा है...",
      important: "महत्वपूर्ण",
      credentialsWarning: "कृपया इन क्रेडेंशियल्स को सुरक्षित रूप से सेव करें। ये दोबारा नहीं दिखाए जाएंगे।",
    },
    doctor: {
      dashboard: "डॉक्टर डैशबोर्ड",
      assignedPatients: "असाइन किए गए रोगी",
      medicalRecords: "मेडिकल रिकॉर्ड",
      contactAasha: "आशा कार्यकर्ता से संपर्क करें",
      patientReports: "रोगी रिपोर्ट",
      diagnosis: "निदान",
      treatment: "उपचार",
      followUp: "फॉलो अप",
      normal: "सामान्य",
      abnormal: "असामान्य",
      pending: "लंबित",
      completed: "पूर्ण",
    },
    patient: {
      dashboard: "रोगी डैशबोर्ड",
      bookAppointment: "अपॉइंटमेंट बुक करें",
      viewReports: "रिपोर्ट देखें",
      voiceSymptoms: "वॉयस लक्षण",
      contactAasha: "आशा कार्यकर्ता से संपर्क करें",
      guidelines: "स्वास्थ्य दिशानिर्देश",
      healthSummary: "स्वास्थ्य सारांश",
      upcomingAppointments: "आगामी अपॉइंटमेंट",
      recentReports: "हाल की रिपोर्ट",
      recordSymptoms: "लक्षण रिकॉर्ड करें",
      selectHospital: "अस्पताल चुनें",
      selectDoctor: "डॉक्टर चुनें",
      appointmentDate: "अपॉइंटमेंट की तारीख",
      appointmentTime: "अपॉइंटमेंट का समय",
      bookNow: "अभी बुक करें",
      reportDate: "रिपोर्ट की तारीख",
      reportType: "रिपोर्ट का प्रकार",
      result: "परिणाम",
      downloadReport: "रिपोर्ट डाउनलोड करें",
    },
    ashaWorker: {
      dashboard: "आशा कार्यकर्ता डैशबोर्ड",
      addPatient: "रोगी जोड़ें",
      cervixAnalysis: "गर्भाशय ग्रीवा विश्लेषण",
      contactDoctor: "डॉक्टर से संपर्क करें",
      guidelines: "दिशानिर्देश",
      emergencyCall: "आपातकालीन कॉल",
      patientRegistration: "रोगी पंजीकरण",
      aiAnalysisResult: "AI विश्लेषण परिणाम",
      normalResult: "सामान्य",
      abnormalResult: "असामान्य",
      uploadCervixPhoto: "गर्भाशय ग्रीवा फोटो अपलोड करें",
      analysisInProgress: "विश्लेषण प्रगति में है",
      patientDetails: "रोगी विवरण",
      medicalInfo: "चिकित्सा जानकारी",
      emergencyContact: "आपातकालीन संपर्क",
      voiceRecording: "वॉयस रिकॉर्डिंग",
      useVoiceRecording: "वॉयस रिकॉर्डिंग का उपयोग करें",
      hideVoiceRecording: "वॉयस रिकॉर्डिंग छुपाएं",
      registerPatient: "रोगी पंजीकृत करें",
      registering: "पंजीकरण हो रहा है...",
      patientRegistered: "रोगी सफलतापूर्वक पंजीकृत",
      registrationError: "रोगी पंजीकरण में विफल। कृपया पुनः प्रयास करें।",
    },
  },
  mr: {
    common: {
      welcome: "स्वागत आहे",
      login: "लॉगिन",
      logout: "लॉगआउट",
      signup: "साइन अप",
      submit: "सबमिट करा",
      cancel: "रद्द करा",
      save: "सेव्ह करा",
      edit: "संपादित करा",
      delete: "हटवा",
      search: "शोधा",
      loading: "लोड होत आहे...",
      error: "त्रुटी",
      success: "यश",
      name: "नाव",
      email: "ईमेल",
      phone: "फोन",
      address: "पत्ता",
      age: "वय",
      gender: "लिंग",
      male: "पुरुष",
      female: "स्त्री",
      other: "इतर",
      date: "तारीख",
      time: "वेळ",
      status: "स्थिती",
      actions: "कृती",
      view: "पहा",
      download: "डाउनलोड",
      upload: "अपलोड",
      back: "मागे",
      next: "पुढे",
      previous: "मागील",
      home: "होम",
      dashboard: "डॅशबोर्ड",
      profile: "प्रोफाइल",
      settings: "सेटिंग्ज",
      help: "मदत",
      contact: "संपर्क",
      about: "बद्दल",
      language: "भाषा",
    },
    home: {
      title: "कॅन्सर डिटेक्शन सिस्टम",
      subtitle: "चांगल्या आरोग्य सेवेसाठी AI-चालित लवकर ओळख",
      description: "AI विश्लेषण, मल्टी-रोल अॅक्सेस आणि व्यापक रुग्ण काळजी व्यवस्थापनासह प्रगत कॅन्सर डिटेक्शन सिस्टम.",
      getStarted: "सुरुवात करा",
      features: {
        aiDetection: "AI-चालित ओळख",
        aiDetectionDesc: "अचूक कॅन्सर ओळख आणि विश्लेषणासाठी प्रगत AI अल्गोरिदम",
        multiRole: "मल्टी-रोल अॅक्सेस",
        multiRoleDesc: "रुग्ण, डॉक्टर आणि आरोग्य कर्मचाऱ्यांसाठी स्वतंत्र डॅशबोर्ड",
        voiceSupport: "व्हॉइस सपोर्ट",
        voiceSupportDesc: "सोप्या लक्षण रेकॉर्डिंगसाठी व्हॉइस-टू-टेक्स्ट कार्यक्षमता",
      },
      cta: "आजच तुमचा आरोग्य प्रवास सुरू करा",
    },
    auth: {
      loginTitle: "तुमच्या खात्यात लॉगिन करा",
      signupTitle: "नवीन खाते तयार करा",
      forgotPasswordTitle: "तुमचा पासवर्ड रीसेट करा",
      emailPlaceholder: "तुमचा ईमेल टाका",
      passwordPlaceholder: "तुमचा पासवर्ड टाका",
      rememberMe: "मला लक्षात ठेवा",
      forgotPassword: "पासवर्ड विसरलात?",
      noAccount: "खाते नाही?",
      hasAccount: "आधीच खाते आहे?",
      createAccount: "खाते तयार करा",
      signIn: "साइन इन",
      resetPassword: "पासवर्ड रीसेट करा",
      backToLogin: "लॉगिनवर परत जा",
      selectRole: "भूमिका निवडा",
      admin: "अॅडमिन",
      doctor: "डॉक्टर",
      patient: "रुग्ण",
      username: "वापरकर्ता नाव",
      password: "पासवर्ड",
      ashaWorker: "आशा कार्यकर्ता",
    },
    admin: {
      dashboard: "अॅडमिन डॅशबोर्ड",
      addPatient: "रुग्ण जोडा",
      addDoctor: "डॉक्टर जोडा",
      addHospital: "हॉस्पिटल जोडा",
      manageConnections: "कनेक्शन व्यवस्थापित करा",
      guidelines: "मार्गदर्शक तत्त्वे",
      totalPatients: "एकूण रुग्ण",
      totalDoctors: "एकूण डॉक्टर",
      totalHospitals: "एकूण हॉस्पिटल",
      recentActivity: "अलीकडील क्रियाकलाप",
      patientName: "रुग्णाचे नाव",
      doctorName: "डॉक्टरांचे नाव",
      hospitalName: "हॉस्पिटलचे नाव",
      specialization: "विशेषज्ञता",
      experience: "अनुभव",
      location: "स्थान",
      symptoms: "लक्षणे",
      uploadImage: "मेडिकल इमेज अपलोड करा",
      aiAnalysis: "AI विश्लेषण",
      assignDoctor: "डॉक्टर नियुक्त करा",
      patientAdded: "रुग्ण यशस्वीरित्या जोडला गेला",
      doctorAdded: "डॉक्टर यशस्वीरित्या जोडला गेला",
      hospitalAdded: "हॉस्पिटल यशस्वीरित्या जोडले गेले",
      addAshaWorker: "आशा कार्यकर्ता जोडा",
      addAshaWorkerDesc: "सिस्टममध्ये नवीन आशा कार्यकर्ता नोंदणी करा आणि लॉगिन क्रेडेंशियल तयार करा",
      ashaWorkerAdded: "आशा कार्यकर्ता यशस्वीरित्या जोडला गेला",
      ashaWorkerAddError: "आशा कार्यकर्ता जोडण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.",
      credentialsGenerated: "लॉगिन क्रेडेंशियल तयार केले",
      credentialsDesc:
        "कृपया हे क्रेडेंशियल आशा कार्यकर्त्याशी सुरक्षितपणे शेअर करा. ते सिस्टममध्ये लॉगिन करण्यासाठी याचा वापर करू शकतात.",
      personalInfo: "वैयक्तिक माहिती",
      workInfo: "कामाची माहिती",
      dateOfBirth: "जन्म तारीख",
      district: "जिल्हा",
      selectDistrict: "जिल्हा निवडा",
      blockTehsil: "ब्लॉक/तहसील",
      villageArea: "गाव/क्षेत्र",
      selectExperience: "अनुभव निवडा",
      years: "वर्षे",
      adding: "जोडत आहे...",
      important: "महत्वाचे",
      credentialsWarning: "कृपया हे क्रेडेंशियल सुरक्षितपणे सेव्ह करा. ते पुन्हा दाखवले जाणार नाहीत.",
    },
    doctor: {
      dashboard: "डॉक्टर डॅशबोर्ड",
      assignedPatients: "नियुक्त केलेले रुग्ण",
      medicalRecords: "मेडिकल रेकॉर्ड",
      contactAasha: "आशा कार्यकर्त्याशी संपर्क साधा",
      patientReports: "रुग्ण अहवाल",
      diagnosis: "निदान",
      treatment: "उपचार",
      followUp: "फॉलो अप",
      normal: "सामान्य",
      abnormal: "असामान्य",
      pending: "प्रलंबित",
      completed: "पूर्ण",
    },
    patient: {
      dashboard: "रुग्ण डॅशबोर्ड",
      bookAppointment: "अपॉइंटमेंट बुक करा",
      viewReports: "अहवाल पहा",
      voiceSymptoms: "व्हॉइस लक्षणे",
      contactAasha: "आशा कार्यकर्त्याशी संपर्क साधा",
      guidelines: "आरोग्य मार्गदर्शक तत्त्वे",
      healthSummary: "आरोग्य सारांश",
      upcomingAppointments: "आगामी अपॉइंटमेंट",
      recentReports: "अलीकडील अहवाल",
      recordSymptoms: "लक्षणे रेकॉर्ड करा",
      selectHospital: "हॉस्पिटल निवडा",
      selectDoctor: "डॉक्टर निवडा",
      appointmentDate: "अपॉइंटमेंटची तारीख",
      appointmentTime: "अपॉइंटमेंटची वेळ",
      bookNow: "आता बुक करा",
      reportDate: "अहवालाची तारीख",
      reportType: "अहवालाचा प्रकार",
      result: "परिणाम",
      downloadReport: "अहवाल डाउनलोड करा",
    },
    ashaWorker: {
      dashboard: "आशा कार्यकर्ता डॅशबोर्ड",
      addPatient: "रुग्ण जोडा",
      cervixAnalysis: "गर्भाशयाच्या मुखाचे विश्लेषण",
      contactDoctor: "डॉक्टरांशी संपर्क साधा",
      guidelines: "मार्गदर्शक तत्त्वे",
      emergencyCall: "आपत्कालीन कॉल",
      patientRegistration: "रुग्ण नोंदणी",
      aiAnalysisResult: "AI विश्लेषण परिणाम",
      normalResult: "सामान्य",
      abnormalResult: "असामान्य",
      uploadCervixPhoto: "गर्भाशयाच्या मुखाचा फोटो अपलोड करा",
      analysisInProgress: "विश्लेषण सुरू आहे",
      patientDetails: "रुग्णाचे तपशील",
      medicalInfo: "वैद्यकीय माहिती",
      emergencyContact: "आपत्कालीन संपर्क",
      voiceRecording: "व्हॉइस रेकॉर्डिंग",
      useVoiceRecording: "व्हॉइस रेकॉर्डिंग वापरा",
      hideVoiceRecording: "व्हॉइस रेकॉर्डिंग लपवा",
      registerPatient: "रुग्ण नोंदणी करा",
      registering: "नोंदणी करत आहे...",
      patientRegistered: "रुग्ण यशस्वीरित्या नोंदणीकृत",
      registrationError: "रुग्ण नोंदणीत अयशस्वी. कृपया पुन्हा प्रयत्न करा.",
    },
  },
}

export const useTranslation = () => {
  const [language, setLanguage] = useState<Language>("en")

  const t = translations[language]

  const changeLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
  }

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage)
    }
  }, [])

  return { t, language, changeLanguage }
}
