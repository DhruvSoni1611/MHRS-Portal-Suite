import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/ui/Header";
import Sidebar from "../../components/ui/Sidebar";
import PatientHeader from "./components/PatientHeader";
import TabNavigation from "./components/TabNavigation";
import SummaryTab from "./components/SummaryTab";
import VitalsTab from "./components/VitalsTab";
import LabsTab from "./components/LabsTab";
import ImmunizationsTab from "./components/ImmunizationsTab";
import EncountersTab from "./components/EncountersTab";
import FilesTab from "./components/FilesTab";

const PatientSummaryProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("summary");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mock patient data
  const patientData = {
    id: "PAT-2024-001",
    name: "Priya Sharma",
    age: 34,
    gender: "Female",
    abhaId: "91-1234-5678-9012",
    phone: "+91 98765 43210",
    token: "TKN-789456",
    address: "123 MG Road, Bangalore, Karnataka 560001",
    dateOfBirth: "15/03/1990",
    photo:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    consentStatus: "granted", // granted, pending, expired, not_requested
    lastSync: "2 minutes ago",
    registrationDate: "12/01/2023",
  };

  // Mock summary data
  const summaryData = {
    recentVitals: [
      {
        name: "Blood Pressure",
        value: "120/80",
        unit: "mmHg",
        date: "Today, 10:30 AM",
        status: "normal",
        icon: "Heart",
      },
      {
        name: "Heart Rate",
        value: "72",
        unit: "bpm",
        date: "Today, 10:30 AM",
        status: "normal",
        icon: "Activity",
      },
      {
        name: "Temperature",
        value: "98.6",
        unit: "°F",
        date: "Today, 10:30 AM",
        status: "normal",
        icon: "Thermometer",
      },
      {
        name: "Weight",
        value: "65",
        unit: "kg",
        date: "Yesterday, 2:15 PM",
        status: "normal",
        icon: "Scale",
      },
    ],
    activeMedications: [
      {
        name: "Metformin 500mg",
        dosage: "Twice daily with meals",
        prescribedDate: "15/08/2024",
      },
      {
        name: "Lisinopril 10mg",
        dosage: "Once daily in the morning",
        prescribedDate: "20/07/2024",
      },
      {
        name: "Vitamin D3 1000 IU",
        dosage: "Once daily",
        prescribedDate: "10/06/2024",
      },
    ],
    careAlerts: [
      {
        title: "Annual Checkup Due",
        description:
          "Routine annual physical examination is due within 30 days",
        priority: "medium",
        date: "Due: 25/09/2024",
      },
      {
        title: "Lab Results Review",
        description: "Recent HbA1c results require follow-up discussion",
        priority: "high",
        date: "Pending since: 18/09/2024",
      },
    ],
    upcomingAppointments: [
      {
        type: "Follow-up Consultation",
        date: "28/09/2024",
        time: "2:30 PM",
        doctor: "Dr. Rajesh Kumar",
        status: "Confirmed",
      },
      {
        type: "Lab Work",
        date: "02/10/2024",
        time: "9:00 AM",
        doctor: "Lab Technician",
        status: "Scheduled",
      },
    ],
  };

  // Mock vitals data
  const vitalsData = {
    bloodPressure: [
      { date: "20/09", time: "10:30", value: "120/80", status: "normal" },
      { date: "18/09", time: "14:15", value: "118/78", status: "normal" },
      { date: "15/09", time: "09:45", value: "125/82", status: "normal" },
      { date: "12/09", time: "11:20", value: "122/79", status: "normal" },
      { date: "10/09", time: "16:30", value: "119/77", status: "normal" },
    ]?.map((item) => ({ ...item, recordedBy: "Nurse Station" })),
    heartRate: [
      { date: "20/09", time: "10:30", value: 72, status: "normal" },
      { date: "18/09", time: "14:15", value: 75, status: "normal" },
      { date: "15/09", time: "09:45", value: 68, status: "normal" },
      { date: "12/09", time: "11:20", value: 74, status: "normal" },
      { date: "10/09", time: "16:30", value: 71, status: "normal" },
    ]?.map((item) => ({ ...item, recordedBy: "Nurse Station" })),
    temperature: [
      { date: "20/09", time: "10:30", value: 98.6, status: "normal" },
      { date: "18/09", time: "14:15", value: 98.4, status: "normal" },
      { date: "15/09", time: "09:45", value: 99.1, status: "high" },
      { date: "12/09", time: "11:20", value: 98.7, status: "normal" },
      { date: "10/09", time: "16:30", value: 98.5, status: "normal" },
    ]?.map((item) => ({ ...item, recordedBy: "Nurse Station" })),
    weight: [
      { date: "19/09", time: "14:15", value: 65, status: "normal" },
      { date: "12/09", time: "11:20", value: 65.2, status: "normal" },
      { date: "05/09", time: "16:30", value: 64.8, status: "normal" },
      { date: "29/08", time: "10:15", value: 65.5, status: "normal" },
      { date: "22/08", time: "09:30", value: 65.1, status: "normal" },
    ]?.map((item) => ({ ...item, recordedBy: "Dr. Rajesh Kumar" })),
    height: [
      {
        date: "12/01/2023",
        time: "10:00",
        value: 162,
        status: "normal",
        recordedBy: "Registration",
      },
    ],
  };

  // Mock lab data
  const labData = [
    {
      id: "LAB-001",
      testName: "Complete Blood Count (CBC)",
      category: "blood",
      status: "completed",
      testDate: "18/09/2024",
      laboratory: "City Diagnostics Lab",
      orderedBy: "Dr. Rajesh Kumar",
      reportUrl: "#",
      results: [
        {
          parameter: "Hemoglobin",
          value: "12.5",
          normalRange: "12.0-15.5",
          unit: "g/dL",
        },
        {
          parameter: "White Blood Cells",
          value: "7.2",
          normalRange: "4.0-11.0",
          unit: "×10³/μL",
        },
        {
          parameter: "Platelets",
          value: "250",
          normalRange: "150-450",
          unit: "×10³/μL",
        },
        {
          parameter: "Hematocrit",
          value: "38",
          normalRange: "36-46",
          unit: "%",
        },
      ],
      notes: "All values within normal limits. Continue current medications.",
    },
    {
      id: "LAB-002",
      testName: "HbA1c (Glycated Hemoglobin)",
      category: "blood",
      status: "completed",
      testDate: "15/09/2024",
      laboratory: "Metro Lab Services",
      orderedBy: "Dr. Rajesh Kumar",
      reportUrl: "#",
      results: [
        { parameter: "HbA1c", value: "6.8", normalRange: "<7.0", unit: "%" },
      ],
      notes: "Good diabetes control. Continue current management plan.",
    },
    {
      id: "LAB-003",
      testName: "Chest X-Ray",
      category: "imaging",
      status: "completed",
      testDate: "10/09/2024",
      laboratory: "Radiology Center",
      orderedBy: "Dr. Rajesh Kumar",
      reportUrl: "#",
      notes: "Clear lung fields. No acute findings.",
    },
    {
      id: "LAB-004",
      testName: "Urine Analysis",
      category: "urine",
      status: "pending",
      testDate: "20/09/2024",
      laboratory: "City Diagnostics Lab",
      orderedBy: "Dr. Rajesh Kumar",
    },
  ];

  // Mock immunization data
  const immunizationData = [
    {
      id: "IMM-001",
      vaccineName: "COVID-19 Vaccine (Covishield)",
      description: "SARS-CoV-2 Vaccine",
      status: "completed",
      administeredDate: "15/03/2024",
      administeredBy: "Dr. Sarah Johnson",
      batchNumber: "CV2024-001",
      ageRecommendation: "18+ years",
      nextDueDate: "15/03/2025",
    },
    {
      id: "IMM-002",
      vaccineName: "Influenza Vaccine",
      description: "Seasonal Flu Vaccine",
      status: "completed",
      administeredDate: "20/10/2023",
      administeredBy: "Nurse Mary",
      batchNumber: "FLU2023-045",
      ageRecommendation: "Annual",
      nextDueDate: "20/10/2024",
    },
    {
      id: "IMM-003",
      vaccineName: "Hepatitis B Vaccine",
      description: "Hepatitis B Prevention",
      status: "completed",
      administeredDate: "10/01/2020",
      administeredBy: "Dr. Kumar",
      batchNumber: "HEP2020-012",
      ageRecommendation: "Adult Series",
      notes: "Series completed",
    },
    {
      id: "IMM-004",
      vaccineName: "Tetanus-Diphtheria (Td)",
      description: "Tetanus and Diphtheria Booster",
      status: "due",
      dueDate: "15/01/2025",
      ageRecommendation: "Every 10 years",
    },
    {
      id: "IMM-005",
      vaccineName: "Influenza Vaccine",
      description: "Annual Flu Shot",
      status: "overdue",
      dueDate: "20/10/2024",
      ageRecommendation: "Annual",
    },
  ];

  // Mock encounters data
  const encountersData = [
    {
      id: "ENC-001",
      title: "Routine Follow-up Visit",
      type: "follow_up",
      date: "18/09/2024",
      provider: "Dr. Rajesh Kumar",
      location: "Primary Care Clinic",
      chiefComplaint: "Routine diabetes follow-up and medication review",
      vitals: {
        bloodPressure: "120/80 mmHg",
        heartRate: "72 bpm",
        temperature: "98.6°F",
        weight: "65 kg",
      },
      assessment: [
        {
          icdCode: "E11.9",
          diagnosis: "Type 2 diabetes mellitus without complications",
        },
        { icdCode: "I10", diagnosis: "Essential hypertension" },
      ],
      plan: [
        "Continue current Metformin dosage",
        "Monitor blood glucose levels daily",
        "Follow-up in 3 months",
        "Order HbA1c test",
      ],
      medications: [
        {
          name: "Metformin 500mg",
          dosage: "Twice daily with meals",
          duration: "90 days",
          instructions: "Take with food to reduce GI upset",
        },
      ],
      labOrders: ["HbA1c", "Lipid Panel", "Microalbumin"],
      followUp:
        "Schedule follow-up appointment in 3 months for diabetes management review",
      notes: `Patient reports good adherence to medications and diet plan.\nBlood glucose logs show good control with occasional spikes after meals.\nDiscussed importance of regular exercise and weight management.\nPatient understands treatment plan and agrees to continue current regimen.`,
    },
    {
      id: "ENC-002",
      title: "Annual Physical Examination",
      type: "consultation",
      date: "15/08/2024",
      provider: "Dr. Rajesh Kumar",
      location: "Primary Care Clinic",
      chiefComplaint: "Annual health maintenance examination",
      vitals: {
        bloodPressure: "118/78 mmHg",
        heartRate: "75 bpm",
        temperature: "98.4°F",
        weight: "65.2 kg",
        height: "162 cm",
      },
      assessment: [
        {
          icdCode: "Z00.00",
          diagnosis:
            "Encounter for general adult medical examination without abnormal findings",
        },
      ],
      plan: [
        "Continue current medications",
        "Mammography screening due",
        "Colonoscopy screening in 2 years",
        "Annual eye examination",
      ],
      medications: [
        {
          name: "Lisinopril 10mg",
          dosage: "Once daily in the morning",
          duration: "90 days",
          instructions: "Take at the same time each day",
        },
      ],
      labOrders: [
        "Complete Blood Count",
        "Comprehensive Metabolic Panel",
        "Lipid Panel",
      ],
      followUp: "Return in 1 year for annual examination unless problems arise",
      notes:
        "Overall excellent health status. Patient maintains active lifestyle and healthy diet.",
    },
    {
      id: "ENC-003",
      title: "Acute Upper Respiratory Infection",
      type: "consultation",
      date: "05/07/2024",
      provider: "Dr. Sarah Johnson",
      location: "Urgent Care Center",
      chiefComplaint: "Cough, congestion, and sore throat for 3 days",
      vitals: {
        bloodPressure: "125/82 mmHg",
        heartRate: "68 bpm",
        temperature: "99.1°F",
        weight: "64.8 kg",
      },
      assessment: [
        {
          icdCode: "J06.9",
          diagnosis: "Acute upper respiratory infection, unspecified",
        },
      ],
      plan: [
        "Supportive care with rest and fluids",
        "Over-the-counter symptom relief",
        "Return if symptoms worsen or persist >10 days",
      ],
      medications: [
        {
          name: "Guaifenesin 400mg",
          dosage: "Every 4 hours as needed",
          duration: "7 days",
          instructions: "Take with plenty of water",
        },
      ],
      followUp: "Return if symptoms worsen or no improvement in 7-10 days",
      notes:
        "Viral upper respiratory infection. No antibiotic indicated at this time.",
    },
  ];

  // Mock files data
  const filesData = [
    {
      id: "FILE-001",
      fileName: "Lab_Report_CBC_20240918.pdf",
      description: "Complete Blood Count Report",
      category: "reports",
      fileType: "pdf",
      fileSize: 245760,
      uploadDate: "18/09/2024",
      uploadedBy: "City Diagnostics Lab",
    },
    {
      id: "FILE-002",
      fileName: "Chest_Xray_20240910.jpg",
      description: "Chest X-Ray Image",
      category: "images",
      fileType: "jpg",
      fileSize: 1048576,
      uploadDate: "10/09/2024",
      uploadedBy: "Radiology Center",
    },
    {
      id: "FILE-003",
      fileName: "Prescription_Metformin_20240815.pdf",
      description: "Metformin Prescription",
      category: "prescriptions",
      fileType: "pdf",
      fileSize: 102400,
      uploadDate: "15/08/2024",
      uploadedBy: "Dr. Rajesh Kumar",
    },
    {
      id: "FILE-004",
      fileName: "Insurance_Card_Copy.jpg",
      description: "Health Insurance Card",
      category: "documents",
      fileType: "jpg",
      fileSize: 512000,
      uploadDate: "12/01/2023",
      uploadedBy: "Registration Desk",
    },
    {
      id: "FILE-005",
      fileName: "Vaccination_Record.pdf",
      description: "Complete Vaccination History",
      category: "documents",
      fileType: "pdf",
      fileSize: 184320,
      uploadDate: "15/03/2024",
      uploadedBy: "Immunization Clinic",
    },
  ];

  const tabs = [
    { id: "summary", label: "Summary", icon: "Home", count: null },
    { id: "vitals", label: "Vitals", icon: "Activity", count: null },
    { id: "labs", label: "Labs", icon: "TestTube", count: labData?.length },
    {
      id: "immunizations",
      label: "Immunizations",
      icon: "Shield",
      count: immunizationData?.length,
    },
    {
      id: "encounters",
      label: "Encounters",
      icon: "FileText",
      count: encountersData?.length,
    },
    { id: "files", label: "Files", icon: "Folder", count: filesData?.length },
  ];

  const handleNewEncounter = () => {
    console.log("Navigate to new encounter form");
    // navigate('/new-encounter');
  };

  const handleRequestConsent = () => {
    console.log("Request patient consent");
  };

  const handleScheduleAppointment = () => {
    console.log("Navigate to appointment scheduling");
    // navigate('/schedule-appointment');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "summary":
        return <SummaryTab summaryData={summaryData} />;
      case "vitals":
        return <VitalsTab vitalsData={vitalsData} />;
      case "labs":
        return <LabsTab labData={labData} />;
      case "immunizations":
        return <ImmunizationsTab immunizationData={immunizationData} />;
      case "encounters":
        return <EncountersTab encountersData={encountersData} />;
      case "files":
        return <FilesTab filesData={filesData} />;
      default:
        return <SummaryTab summaryData={summaryData} />;
    }
  };

  useEffect(() => {
    document.title = `${patientData?.name} - Patient Profile | MHRS Portal Suite`;
  }, [patientData?.name]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header
        userRole="clinic-staff"
        onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        isMenuOpen={mobileMenuOpen}
      />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          userRole="clinic-staff"
        />

        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 ${
            sidebarCollapsed ? "ml-16" : "ml-60"
          } pt-16`}
        >
          <div className="p-6 max-w-7xl mx-auto">
            {/* Patient Header */}
            <PatientHeader
              patient={patientData}
              onNewEncounter={handleNewEncounter}
              onRequestConsent={handleRequestConsent}
              onScheduleAppointment={handleScheduleAppointment}
            />

            {/* Tab Navigation */}
            <TabNavigation
              activeTab={activeTab}
              onTabChange={setActiveTab}
              tabs={tabs}
            />

            {/* Tab Content */}
            <div className="min-h-[600px]">{renderTabContent()}</div>
          </div>
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-1000 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default PatientSummaryProfile;
