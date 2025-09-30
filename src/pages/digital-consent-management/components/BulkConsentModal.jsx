import React, { useState } from "react";
import {
  X,
  Upload,
  Users,
  FileText,
  Download,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/AppIcon";

const BulkConsentModal = ({ onClose, onSubmit }) => {
  const [operation, setOperation] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [bulkSettings, setBulkSettings] = useState({
    consentType: "",
    expiryDate: "",
    language: "en",
    collectionMethod: "digital",
    notes: "",
    requiresGuardianConsent: false,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);

  const operations = [
    {
      id: "bulk-request",
      title: "Bulk Consent Requests",
      description: "Send consent requests to multiple patients simultaneously",
      icon: FileText,
      color: "text-blue-600 bg-blue-100",
    },
    {
      id: "bulk-renewal",
      title: "Bulk Consent Renewal",
      description: "Renew expired or expiring consents for selected patients",
      icon: Users,
      color: "text-green-600 bg-green-100",
    },
    {
      id: "bulk-upload",
      title: "Bulk Upload from File",
      description: "Upload consent data from CSV or Excel file",
      icon: Upload,
      color: "text-purple-600 bg-purple-100",
    },
  ];

  const consentTypes = [
    { value: "treatment", label: "Treatment Authorization" },
    { value: "data-sharing", label: "Data Sharing" },
    { value: "research", label: "Research Participation" },
    { value: "telehealth", label: "Telehealth Services" },
    { value: "marketing", label: "Marketing Communications" },
  ];

  const languages = [
    { value: "en", label: "English" },
    { value: "hi", label: "Hindi" },
    { value: "te", label: "Telugu" },
    { value: "ta", label: "Tamil" },
    { value: "bn", label: "Bengali" },
    { value: "mr", label: "Marathi" },
  ];

  // Mock patient data for selection
  const availablePatients = [
    {
      id: "P-001",
      name: "Sarah Johnson",
      phone: "+91-9876543210",
      lastConsent: "2023-12-15",
    },
    {
      id: "P-002",
      name: "Michael Chen",
      phone: "+91-9876543211",
      lastConsent: "2023-11-20",
    },
    {
      id: "P-003",
      name: "Emily Davis",
      phone: "+91-9876543212",
      lastConsent: "2023-10-30",
    },
    {
      id: "P-004",
      name: "Robert Wilson",
      phone: "+91-9876543213",
      lastConsent: "2023-09-15",
    },
    {
      id: "P-005",
      name: "Lisa Anderson",
      phone: "+91-9876543214",
      lastConsent: "2023-08-25",
    },
  ];

  const handleFileUpload = (event) => {
    const file = event?.target?.files?.[0];
    if (file) {
      setUploadFile(file);
    }
  };

  const handlePatientSelection = (patientId) => {
    setSelectedPatients((prev) => {
      if (prev?.includes(patientId)) {
        return prev?.filter((id) => id !== patientId);
      } else {
        return [...prev, patientId];
      }
    });
  };

  const selectAllPatients = () => {
    if (selectedPatients?.length === availablePatients?.length) {
      setSelectedPatients([]);
    } else {
      setSelectedPatients(availablePatients?.map((patient) => patient?.id));
    }
  };

  const processBulkOperation = async () => {
    setIsProcessing(true);

    // Simulate bulk processing
    setTimeout(() => {
      const mockResults = {
        total: operation === "bulk-upload" ? 50 : selectedPatients?.length,
        successful:
          operation === "bulk-upload" ? 45 : selectedPatients?.length - 1,
        failed: operation === "bulk-upload" ? 5 : 1,
        errors: [
          { patient: "P-002", error: "Invalid phone number format" },
          ...(operation === "bulk-upload"
            ? [
                { row: 15, error: "Missing required consent type" },
                { row: 23, error: "Invalid expiry date format" },
                { row: 34, error: "Duplicate patient ID" },
                { row: 41, error: "Invalid language code" },
              ]
            : []),
        ],
      };

      setResults(mockResults);
      setIsProcessing(false);
    }, 3000);
  };

  const downloadTemplate = () => {
    // Create a CSV template
    const csvContent = `Patient ID,Patient Name,Phone Number,Consent Type,Expiry Date,Language,Collection Method,Notes,Guardian Required,Guardian Name,Guardian Relation
P-001,John Doe,+91-9876543210,treatment,2024-12-31,en,digital,"Regular treatment consent",false,,
P-002,Jane Smith,+91-9876543211,data-sharing,2024-06-30,hi,otp,"Data sharing for referrals",false,,
P-003,Minor Patient,+91-9876543212,treatment,2024-12-31,en,digital,"Pediatric treatment",true,"Parent Name","Parent"`;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL?.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "bulk_consent_template.csv";
    link?.click();
    window.URL?.revokeObjectURL(url);
  };

  const resetModal = () => {
    setOperation("");
    setUploadFile(null);
    setSelectedPatients([]);
    setBulkSettings({
      consentType: "",
      expiryDate: "",
      language: "en",
      collectionMethod: "digital",
      notes: "",
      requiresGuardianConsent: false,
    });
    setResults(null);
    setIsProcessing(false);
  };

  if (results) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div
            className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
            onClick={onClose}
          ></div>

          <div className="inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
            {/* Header */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  Bulk Operation Results
                </h3>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Results */}
            <div className="px-6 py-6">
              <div className="text-center mb-6">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Operation Completed
                </h4>
                <p className="text-sm text-gray-500">
                  Your bulk consent operation has been processed
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {results?.total}
                  </div>
                  <div className="text-sm text-blue-800">Total Records</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {results?.successful}
                  </div>
                  <div className="text-sm text-green-800">Successful</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {results?.failed}
                  </div>
                  <div className="text-sm text-red-800">Failed</div>
                </div>
              </div>

              {results?.errors?.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h5 className="font-medium text-red-800 mb-3 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Errors ({results?.errors?.length})
                  </h5>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {results?.errors?.map((error, index) => (
                      <div
                        key={index}
                        className="text-sm text-red-700 flex justify-between"
                      >
                        <span>{error?.patient || `Row ${error?.row}`}:</span>
                        <span className="font-medium">{error?.error}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
              <Button
                onClick={downloadTemplate}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
              <div className="flex space-x-3">
                <Button
                  onClick={resetModal}
                  className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  New Operation
                </Button>
                <Button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          {/* Header */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Bulk Consent Operations
              </h3>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6 max-h-96 overflow-y-auto">
            {!operation ? (
              /* Step 1: Select Operation */
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900 mb-4">
                  Choose Bulk Operation
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {operations?.map((op) => {
                    const Icon = op?.icon;
                    return (
                      <button
                        key={op?.id}
                        onClick={() => setOperation(op?.id)}
                        className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-left"
                      >
                        <div className="flex flex-col items-center text-center">
                          <div className={`p-3 rounded-full ${op?.color} mb-3`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <h5 className="font-medium text-gray-900 mb-2">
                            {op?.title}
                          </h5>
                          <p className="text-sm text-gray-500">
                            {op?.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Step 2: Configure Operation */
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-md font-medium text-gray-900">
                    {operations?.find((op) => op?.id === operation)?.title}
                  </h4>
                  <Button
                    onClick={() => setOperation("")}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    ← Change Operation
                  </Button>
                </div>
                {operation === "bulk-upload" ? (
                  /* File Upload */
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700">
                        Upload Consent Data File
                      </label>
                      <Button
                        onClick={downloadTemplate}
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download Template
                      </Button>
                    </div>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4">
                          <label
                            htmlFor="file-upload"
                            className="cursor-pointer"
                          >
                            <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                              Choose File
                            </span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              accept=".csv,.xlsx,.xls"
                              onChange={handleFileUpload}
                              className="sr-only"
                            />
                          </label>
                          <p className="mt-2 text-sm text-gray-600">
                            CSV, Excel files up to 10MB
                          </p>
                        </div>
                        {uploadFile && (
                          <div className="mt-4 text-sm text-gray-900">
                            <strong>Selected:</strong> {uploadFile?.name}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h5 className="font-medium text-blue-800 mb-2">
                        File Format Requirements
                      </h5>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>
                          • Include headers: Patient ID, Patient Name, Phone
                          Number, Consent Type
                        </li>
                        <li>
                          • Use ISO date format for expiry dates (YYYY-MM-DD)
                        </li>
                        <li>• Language codes: en, hi, te, ta, bn, mr</li>
                        <li>• Collection methods: digital, otp, paper</li>
                        <li>• Guardian Required: true/false</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  /* Patient Selection & Settings */
                  <div className="space-y-6">
                    {/* Patient Selection */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Select Patients ({selectedPatients?.length} selected)
                        </label>
                        <Button
                          onClick={selectAllPatients}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          {selectedPatients?.length ===
                          availablePatients?.length
                            ? "Deselect All"
                            : "Select All"}
                        </Button>
                      </div>

                      <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                        {availablePatients?.map((patient) => (
                          <label
                            key={patient?.id}
                            className="flex items-center p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                          >
                            <input
                              type="checkbox"
                              checked={selectedPatients?.includes(patient?.id)}
                              onChange={() =>
                                handlePatientSelection(patient?.id)
                              }
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
                            />
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {patient?.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {patient?.id} • {patient?.phone}
                                  </div>
                                </div>
                                <div className="text-xs text-gray-500">
                                  Last consent: {patient?.lastConsent}
                                </div>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                    {/* Consent Settings */}
                    <div className="space-y-4">
                      <h5 className="font-medium text-gray-900">
                        Consent Settings
                      </h5>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="consentType"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Consent Type *
                          </label>
                          <select
                            id="consentType"
                            value={bulkSettings?.consentType}
                            onChange={(e) =>
                              setBulkSettings((prev) => ({
                                ...prev,
                                consentType: e?.target?.value,
                              }))
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select consent type</option>
                            {consentTypes?.map((type) => (
                              <option key={type?.value} value={type?.value}>
                                {type?.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="expiryDate"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Expiry Date
                          </label>
                          <input
                            type="date"
                            id="expiryDate"
                            value={bulkSettings?.expiryDate}
                            onChange={(e) =>
                              setBulkSettings((prev) => ({
                                ...prev,
                                expiryDate: e?.target?.value,
                              }))
                            }
                            min={new Date()?.toISOString()?.split("T")?.[0]}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="language"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Language
                          </label>
                          <select
                            id="language"
                            value={bulkSettings?.language}
                            onChange={(e) =>
                              setBulkSettings((prev) => ({
                                ...prev,
                                language: e?.target?.value,
                              }))
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            {languages?.map((lang) => (
                              <option key={lang?.value} value={lang?.value}>
                                {lang?.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="collectionMethod"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Collection Method
                          </label>
                          <select
                            id="collectionMethod"
                            value={bulkSettings?.collectionMethod}
                            onChange={(e) =>
                              setBulkSettings((prev) => ({
                                ...prev,
                                collectionMethod: e?.target?.value,
                              }))
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="digital">Digital Signature</option>
                            <option value="otp">OTP Verification</option>
                            <option value="paper">Paper Form</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="notes"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Notes
                        </label>
                        <textarea
                          id="notes"
                          value={bulkSettings?.notes}
                          onChange={(e) =>
                            setBulkSettings((prev) => ({
                              ...prev,
                              notes: e?.target?.value,
                            }))
                          }
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Additional notes for all consent requests..."
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {operation && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
              <div className="text-sm text-gray-600">
                {operation === "bulk-upload"
                  ? uploadFile
                    ? `File: ${uploadFile?.name}`
                    : "No file selected"
                  : `${selectedPatients?.length} patients selected`}
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </Button>
                <Button
                  onClick={processBulkOperation}
                  disabled={
                    isProcessing ||
                    (operation === "bulk-upload" && !uploadFile) ||
                    (operation !== "bulk-upload" &&
                      (selectedPatients?.length === 0 ||
                        !bulkSettings?.consentType))
                  }
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    "Start Processing"
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkConsentModal;
