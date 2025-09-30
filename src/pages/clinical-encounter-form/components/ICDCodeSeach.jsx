import React, { useState, useEffect, useMemo } from "react";
import { Search, X, Plus, Clock, BookOpen } from "lucide-react";

const ICDCodeSearch = ({ selectedCodes, onCodesChange, watch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentCodes, setRecentCodes] = useState([]);

  // Mock ICD-10 codes database (in real app, this would be from an API)
  const icdCodesDatabase = [
    { code: "R50.9", description: "Fever, unspecified", category: "Symptoms" },
    {
      code: "R06.00",
      description: "Dyspnea, unspecified",
      category: "Respiratory",
    },
    {
      code: "R10.9",
      description: "Unspecified abdominal pain",
      category: "Digestive",
    },
    {
      code: "M25.50",
      description: "Pain in unspecified joint",
      category: "Musculoskeletal",
    },
    { code: "R51", description: "Headache", category: "Neurological" },
    {
      code: "J00",
      description: "Acute nasopharyngitis [common cold]",
      category: "Respiratory",
    },
    {
      code: "K59.00",
      description: "Constipation, unspecified",
      category: "Digestive",
    },
    {
      code: "M79.3",
      description: "Panniculitis, unspecified",
      category: "Musculoskeletal",
    },
    {
      code: "R42",
      description: "Dizziness and giddiness",
      category: "Neurological",
    },
    {
      code: "I10",
      description: "Essential (primary) hypertension",
      category: "Cardiovascular",
    },
    {
      code: "E78.5",
      description: "Hyperlipidemia, unspecified",
      category: "Endocrine",
    },
    {
      code: "E11.9",
      description: "Type 2 diabetes mellitus without complications",
      category: "Endocrine",
    },
    {
      code: "J44.1",
      description:
        "Chronic obstructive pulmonary disease with acute exacerbation",
      category: "Respiratory",
    },
    {
      code: "N39.0",
      description: "Urinary tract infection, site not specified",
      category: "Genitourinary",
    },
    { code: "L30.9", description: "Dermatitis, unspecified", category: "Skin" },
  ];

  // Get recently used codes from localStorage or mock data
  useEffect(() => {
    const recent = localStorage.getItem("recentIcdCodes");
    if (recent) {
      setRecentCodes(JSON.parse(recent));
    } else {
      // Mock recent codes
      setRecentCodes([
        {
          code: "I10",
          description: "Essential (primary) hypertension",
          category: "Cardiovascular",
        },
        {
          code: "E11.9",
          description: "Type 2 diabetes mellitus without complications",
          category: "Endocrine",
        },
        {
          code: "J00",
          description: "Acute nasopharyngitis [common cold]",
          category: "Respiratory",
        },
      ]);
    }
  }, []);

  // Get suggestions based on chief complaint and present illness
  const suggestedCodes = useMemo(() => {
    const chiefComplaint = watch("chiefComplaint")?.toLowerCase() || "";
    const presentIllness = watch("presentIllness")?.toLowerCase() || "";
    const combinedText = `${chiefComplaint} ${presentIllness}`;

    if (!combinedText?.trim()) return [];

    return icdCodesDatabase
      ?.filter((icd) => {
        const searchText =
          `${icd?.description} ${icd?.category}`?.toLowerCase();
        return combinedText
          ?.split(" ")
          ?.some((word) => word?.length > 2 && searchText?.includes(word));
      })
      ?.slice(0, 6);
  }, [watch("chiefComplaint"), watch("presentIllness")]);

  // Perform search with fuzzy matching
  const performSearch = (term) => {
    if (!term || term?.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    // Simulate API delay
    setTimeout(() => {
      const results = icdCodesDatabase?.filter((icd) => {
        const searchText =
          `${icd?.code} ${icd?.description} ${icd?.category}`?.toLowerCase();
        const searchTermLower = term?.toLowerCase();

        // Exact match gets highest priority
        if (searchText?.includes(searchTermLower)) {
          return true;
        }

        // Fuzzy matching for individual words
        const searchWords = searchTermLower?.split(" ");
        return searchWords?.some(
          (word) => word?.length > 1 && searchText?.includes(word)
        );
      });

      setSearchResults(results?.slice(0, 10));
      setIsSearching(false);
    }, 300);
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      performSearch(searchTerm);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const addCode = (icdCode) => {
    if (!selectedCodes?.find((code) => code?.code === icdCode?.code)) {
      const newCodes = [
        ...selectedCodes,
        { ...icdCode, isPrimary: selectedCodes?.length === 0 },
      ];
      onCodesChange(newCodes);

      // Add to recent codes
      const updatedRecent = [
        icdCode,
        ...(Array.isArray(recentCodes)
          ? recentCodes.filter((code) => code?.code !== icdCode?.code)
          : []),
      ]?.slice(0, 10);
      setRecentCodes(updatedRecent);
      localStorage.setItem("recentIcdCodes", JSON.stringify(updatedRecent));

      setSearchTerm("");
      setSearchResults([]);
    }
  };

  const removeCode = (codeToRemove) => {
    const newCodes = selectedCodes?.filter(
      (code) => code?.code !== codeToRemove
    );
    // If removing primary diagnosis, make the first remaining code primary
    if (newCodes?.length > 0 && !newCodes?.find((code) => code?.isPrimary)) {
      newCodes[0].isPrimary = true;
    }
    onCodesChange(newCodes);
  };

  const setPrimaryCode = (codeToSetPrimary) => {
    const newCodes = selectedCodes?.map((code) => ({
      ...code,
      isPrimary: code?.code === codeToSetPrimary,
    }));
    onCodesChange(newCodes);
  };

  const getCategoryColor = (category) => {
    const colors = {
      Symptoms: "bg-gray-100 text-gray-800",
      Respiratory: "bg-blue-100 text-blue-800",
      Cardiovascular: "bg-red-100 text-red-800",
      Digestive: "bg-green-100 text-green-800",
      Neurological: "bg-purple-100 text-purple-800",
      Musculoskeletal: "bg-yellow-100 text-yellow-800",
      Endocrine: "bg-indigo-100 text-indigo-800",
      Genitourinary: "bg-pink-100 text-pink-800",
      Skin: "bg-orange-100 text-orange-800",
    };
    return colors?.[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <BookOpen className="h-5 w-5 mr-2" />
          Diagnosis & ICD-10 Codes
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Search and select ICD-10 codes for patient diagnoses
        </p>
      </div>
      {/* Search Bar */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search ICD-10 codes by code, description, or symptom..."
          />
          {isSearching && (
            <div className="absolute right-3 top-3">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>

        {/* Search Results */}
        {searchResults?.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {searchResults?.map((icd, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => addCode(icd)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="font-mono text-sm font-medium text-blue-600 mr-3">
                        {icd?.code}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(
                          icd?.category
                        )}`}
                      >
                        {icd?.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">
                      {icd?.description}
                    </p>
                  </div>
                  <Plus className="h-4 w-4 text-gray-400 ml-2" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      {/* Suggested Codes */}
      {suggestedCodes?.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
            <BookOpen className="h-4 w-4 mr-2" />
            Suggested Based on Symptoms
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggestedCodes?.map((icd, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => addCode(icd)}
                className="p-3 text-left border border-blue-200 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <span className="font-mono text-sm font-medium text-blue-600 mr-2">
                        {icd?.code}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(
                          icd?.category
                        )}`}
                      >
                        {icd?.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">
                      {icd?.description}
                    </p>
                  </div>
                  <Plus className="h-4 w-4 text-blue-600" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Recent Codes */}
      {recentCodes?.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Recently Used
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recentCodes?.map((icd, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => addCode(icd)}
                className="p-3 text-left border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <span className="font-mono text-sm font-medium text-gray-600 mr-2">
                        {icd?.code}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(
                          icd?.category
                        )}`}
                      >
                        {icd?.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">
                      {icd?.description}
                    </p>
                  </div>
                  <Plus className="h-4 w-4 text-gray-400" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Selected Codes */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">
          Selected Diagnoses ({selectedCodes?.length})
        </h4>
        {selectedCodes?.length === 0 ? (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
            <BookOpen className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p>No diagnoses selected yet</p>
            <p className="text-sm">Search and add ICD-10 codes above</p>
          </div>
        ) : (
          <div className="space-y-3">
            {selectedCodes?.map((icd, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border-2 ${
                  icd?.isPrimary
                    ? "border-blue-300 bg-blue-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="font-mono text-sm font-medium text-gray-900 mr-3">
                        {icd?.code}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(
                          icd?.category
                        )}`}
                      >
                        {icd?.category}
                      </span>
                      {icd?.isPrimary && (
                        <span className="ml-2 px-2 py-1 text-xs bg-blue-600 text-white rounded-full">
                          PRIMARY
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      {icd?.description}
                    </p>
                    <div className="flex space-x-2">
                      {!icd?.isPrimary && (
                        <button
                          type="button"
                          onClick={() => setPrimaryCode(icd?.code)}
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Set as Primary
                        </button>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCode(icd?.code)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Additional Notes */}
      <div>
        <label
          htmlFor="diagnosisNotes"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Diagnosis Notes & Clinical Reasoning
        </label>
        <textarea
          id="diagnosisNotes"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Document clinical reasoning, differential diagnoses, or additional notes..."
        />
      </div>
    </div>
  );
};

export default ICDCodeSearch;
