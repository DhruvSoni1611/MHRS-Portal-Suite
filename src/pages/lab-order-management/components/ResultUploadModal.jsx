import React, { useState, useRef } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const ResultUploadModal = ({ order, onClose, onUploadComplete }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [isDragOver, setIsDragOver] = useState(false);
  const [criticalValues, setCriticalValues] = useState([]);
  const [uploadNotes, setUploadNotes] = useState("");
  const [qualityCheck, setQualityCheck] = useState(false);
  const fileInputRef = useRef(null);

  const supportedFileTypes = [
    ".pdf",
    ".jpg",
    ".jpeg",
    ".png",
    ".tiff",
    ".csv",
    ".txt",
    ".xml",
  ];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const handleFileSelect = (files) => {
    const newFiles = Array.from(files)?.filter((file) => {
      const isValidType = supportedFileTypes?.some((type) =>
        file?.name?.toLowerCase()?.endsWith(type?.slice(1))
      );
      const isValidSize = file?.size <= maxFileSize;

      if (!isValidType) {
        alert(
          `Unsupported file type: ${
            file?.name
          }. Supported types: ${supportedFileTypes?.join(", ")}`
        );
        return false;
      }

      if (!isValidSize) {
        alert(`File too large: ${file?.name}. Maximum size is 10MB.`);
        return false;
      }

      return true;
    });

    // Simulate upload progress
    newFiles?.forEach((file) => {
      const fileId = `${file?.name}-${Date.now()}`;
      setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }));

      // Simulate progressive upload
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(progressInterval);
          setUploadedFiles((prev) => [
            ...prev,
            {
              id: fileId,
              name: file?.name,
              size: file?.size,
              type: file?.type,
              uploadedAt: new Date()?.toISOString(),
            },
          ]);
        }
        setUploadProgress((prev) => ({
          ...prev,
          [fileId]: Math.min(progress, 100),
        }));
      }, 200);
    });
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
    const files = e?.dataTransfer?.files;
    handleFileSelect(files);
  };

  const removeFile = (fileId) => {
    setUploadedFiles((prev) => prev?.filter((file) => file?.id !== fileId));
    setUploadProgress((prev) => {
      const newProgress = { ...prev };
      delete newProgress?.[fileId];
      return newProgress;
    });
  };

  const addCriticalValue = () => {
    setCriticalValues((prev) => [
      ...prev,
      {
        id: Date.now(),
        testName: "",
        value: "",
        referenceRange: "",
        severity: "high",
      },
    ]);
  };

  const updateCriticalValue = (id, field, value) => {
    setCriticalValues((prev) =>
      prev?.map((cv) => (cv?.id === id ? { ...cv, [field]: value } : cv))
    );
  };

  const removeCriticalValue = (id) => {
    setCriticalValues((prev) => prev?.filter((cv) => cv?.id !== id));
  };

  const handleUploadComplete = () => {
    if (uploadedFiles?.length === 0) {
      alert("Please upload at least one result file.");
      return;
    }

    if (!qualityCheck) {
      alert("Please confirm quality control validation.");
      return;
    }

    // Simulate upload completion
    setTimeout(() => {
      onUploadComplete({
        orderId: order?.id,
        files: uploadedFiles,
        criticalValues: criticalValues,
        notes: uploadNotes,
        qualityControlled: qualityCheck,
        uploadedBy: "Current Lab Tech",
        uploadedAt: new Date()?.toISOString(),
      });
    }, 1000);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + " " + sizes?.[i];
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg border border-border shadow-clinical max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Upload Lab Results
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Order: {order?.id} • Patient: {order?.patientName}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              iconName="X"
            ></Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Order Information */}
            <div className="bg-muted rounded-lg p-4">
              <h3 className="font-medium text-foreground mb-2">
                Order Details
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Tests: </span>
                  <span className="text-foreground">
                    {order?.testTypes?.join(", ")}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Priority: </span>
                  <span className="text-foreground capitalize">
                    {order?.priority}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">
                    Collection Date:{" "}
                  </span>
                  <span className="text-foreground">
                    {order?.collectionDate}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Due Date: </span>
                  <span className="text-foreground">{order?.dueDate}</span>
                </div>
              </div>
            </div>

            {/* File Upload Area */}
            <div>
              <h3 className="font-medium text-foreground mb-3">Result Files</h3>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-clinical ${
                  isDragOver ? "border-primary bg-primary/5" : "border-border"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Icon
                  name="Upload"
                  size={48}
                  className="mx-auto text-muted-foreground mb-4"
                />
                <p className="text-foreground font-medium mb-2">
                  Drag and drop result files here, or click to browse
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Supported formats: {supportedFileTypes?.join(", ")} • Max
                  size: 10MB per file
                </p>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef?.current?.click()}
                  iconName="FolderOpen"
                  iconPosition="left"
                >
                  Browse Files
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept={supportedFileTypes?.join(",")}
                  onChange={(e) => handleFileSelect(e?.target?.files)}
                  className="hidden"
                />
              </div>
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles?.length > 0 && (
              <div>
                <h4 className="font-medium text-foreground mb-3">
                  Uploaded Files ({uploadedFiles?.length})
                </h4>
                <div className="space-y-2">
                  {uploadedFiles?.map((file) => (
                    <div
                      key={file?.id}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <Icon
                          name="FileText"
                          size={20}
                          className="text-muted-foreground"
                        />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {file?.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(file?.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => removeFile(file?.id)}
                        iconName="X"
                      ></Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Progress */}
            {Object.keys(uploadProgress)?.length > 0 && (
              <div>
                <h4 className="font-medium text-foreground mb-3">
                  Upload Progress
                </h4>
                <div className="space-y-2">
                  {Object.entries(uploadProgress)?.map(([fileId, progress]) => (
                    <div key={fileId} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground">Uploading...</span>
                        <span className="text-muted-foreground">
                          {Math.round(progress)}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary rounded-full h-2 transition-clinical"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Critical Values Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-foreground">Critical Values</h4>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={addCriticalValue}
                  iconName="Plus"
                  iconPosition="left"
                >
                  Add Critical Value
                </Button>
              </div>

              {criticalValues?.map((cv) => (
                <div
                  key={cv?.id}
                  className="p-4 border border-border rounded-lg mb-3"
                >
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <input
                      type="text"
                      placeholder="Test Name"
                      value={cv?.testName}
                      onChange={(e) =>
                        updateCriticalValue(
                          cv?.id,
                          "testName",
                          e?.target?.value
                        )
                      }
                      className="px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={cv?.value}
                      onChange={(e) =>
                        updateCriticalValue(cv?.id, "value", e?.target?.value)
                      }
                      className="px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Reference Range"
                      value={cv?.referenceRange}
                      onChange={(e) =>
                        updateCriticalValue(
                          cv?.id,
                          "referenceRange",
                          e?.target?.value
                        )
                      }
                      className="px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <div className="flex items-center space-x-2">
                      <select
                        value={cv?.severity}
                        onChange={(e) =>
                          updateCriticalValue(
                            cv?.id,
                            "severity",
                            e?.target?.value
                          )
                        }
                        className="flex-1 px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="low">Low</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => removeCriticalValue(cv?.id)}
                        iconName="X"
                      ></Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Upload Notes */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Upload Notes
              </label>
              <textarea
                value={uploadNotes}
                onChange={(e) => setUploadNotes(e?.target?.value)}
                placeholder="Add any additional notes about the results..."
                rows={3}
                className="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </div>

            {/* Quality Control Confirmation */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="qualityCheck"
                  checked={qualityCheck}
                  onChange={(e) => setQualityCheck(e?.target?.checked)}
                  className="mt-1"
                />
                <div>
                  <label
                    htmlFor="qualityCheck"
                    className="text-sm font-medium text-foreground cursor-pointer"
                  >
                    Quality Control Validation
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    I confirm that all results have been quality controlled and
                    validated according to laboratory protocols.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-muted">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {uploadedFiles?.length} file(s) ready for upload
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleUploadComplete}
                iconName="Upload"
                iconPosition="left"
                disabled={uploadedFiles?.length === 0 || !qualityCheck}
              >
                Upload Results
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultUploadModal;
