import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const FilesTab = ({ filesData }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // grid, list
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const categories = [
    { id: "all", name: "All Files", count: filesData?.length },
    {
      id: "reports",
      name: "Lab Reports",
      count: filesData?.filter((f) => f?.category === "reports")?.length,
    },
    {
      id: "images",
      name: "Medical Images",
      count: filesData?.filter((f) => f?.category === "images")?.length,
    },
    {
      id: "documents",
      name: "Documents",
      count: filesData?.filter((f) => f?.category === "documents")?.length,
    },
    {
      id: "prescriptions",
      name: "Prescriptions",
      count: filesData?.filter((f) => f?.category === "prescriptions")?.length,
    },
  ];

  const filteredFiles =
    selectedCategory === "all"
      ? filesData
      : filesData?.filter((file) => file?.category === selectedCategory);

  const getFileIcon = (fileType) => {
    switch (fileType?.toLowerCase()) {
      case "pdf":
        return "FileText";
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return "Image";
      case "doc":
      case "docx":
        return "FileText";
      case "xls":
      case "xlsx":
        return "FileSpreadsheet";
      default:
        return "File";
    }
  };

  const getFileTypeColor = (fileType) => {
    switch (fileType?.toLowerCase()) {
      case "pdf":
        return "text-error bg-error/10";
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return "text-success bg-success/10";
      case "doc":
      case "docx":
        return "text-primary bg-primary/10";
      case "xls":
      case "xlsx":
        return "text-accent bg-accent/10";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + " " + sizes?.[i];
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setDragOver(false);
    // Handle file drop logic here
    console.log("Files dropped:", e?.dataTransfer?.files);
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-card border border-border rounded-lg shadow-clinical p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Patient Files
          </h3>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-clinical ${
                  viewMode === "grid"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                <Icon name="Grid3X3" size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-clinical ${
                  viewMode === "list"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                <Icon name="List" size={16} />
              </button>
            </div>
            <Button
              variant="default"
              iconName="Upload"
              iconPosition="left"
              onClick={() => setShowUploadModal(true)}
            >
              Upload Files
            </Button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories?.map((category) => (
            <button
              key={category?.id}
              onClick={() => setSelectedCategory(category?.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-clinical ${
                selectedCategory === category?.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {category?.name}
              <span className="ml-2 text-xs opacity-75">
                ({category?.count})
              </span>
            </button>
          ))}
        </div>
      </div>
      {/* Files Display */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredFiles?.map((file) => (
            <div
              key={file?.id}
              className="bg-card border border-border rounded-lg shadow-clinical p-4 hover:shadow-clinical-lg transition-clinical"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${getFileTypeColor(
                    file?.fileType
                  )}`}
                >
                  <Icon name={getFileIcon(file?.fileType)} size={20} />
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1 rounded-md hover:bg-muted transition-clinical">
                    <Icon name="Download" size={14} />
                  </button>
                  <button className="p-1 rounded-md hover:bg-muted transition-clinical">
                    <Icon name="Share" size={14} />
                  </button>
                  <button className="p-1 rounded-md hover:bg-muted transition-clinical">
                    <Icon name="MoreVertical" size={14} />
                  </button>
                </div>
              </div>

              <h4
                className="text-sm font-semibold text-foreground mb-1 truncate"
                title={file?.fileName}
              >
                {file?.fileName}
              </h4>
              <p className="text-xs text-muted-foreground mb-2">
                {file?.description}
              </p>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{formatFileSize(file?.fileSize)}</span>
                <span>{file?.uploadDate}</span>
              </div>

              <div className="mt-3 pt-3 border-t border-border">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Uploaded by:</span>
                  <span className="font-medium text-foreground">
                    {file?.uploadedBy}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg shadow-clinical">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    File Name
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Size
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Upload Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Uploaded By
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles?.map((file) => (
                  <tr
                    key={file?.id}
                    className="border-b border-border hover:bg-muted/50 transition-clinical"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-md flex items-center justify-center ${getFileTypeColor(
                            file?.fileType
                          )}`}
                        >
                          <Icon name={getFileIcon(file?.fileType)} size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {file?.fileName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {file?.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getFileTypeColor(
                          file?.fileType
                        )}`}
                      >
                        {file?.fileType?.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {formatFileSize(file?.fileSize)}
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {file?.uploadDate}
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {file?.uploadedBy}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" iconName="Download">
                          Download
                        </Button>
                        <Button variant="ghost" size="sm" iconName="Share">
                          Share
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {filteredFiles?.length === 0 && (
        <div className="bg-card border border-border rounded-lg shadow-clinical p-12 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="FileText" size={32} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No Files Found
          </h3>
          <p className="text-muted-foreground mb-4">
            No files found for the selected category.
          </p>
          <Button
            variant="outline"
            iconName="Upload"
            iconPosition="left"
            onClick={() => setShowUploadModal(true)}
          >
            Upload First File
          </Button>
        </div>
      )}
      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1200 p-4">
          <div className="bg-card rounded-lg shadow-clinical-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                Upload Files
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 rounded-md hover:bg-muted transition-clinical"
              >
                <Icon name="X" size={20} />
              </button>
            </div>

            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-clinical ${
                dragOver ? "border-primary bg-primary/5" : "border-border"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Upload" size={24} className="text-primary" />
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">
                Drop files here
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                or click to browse files
              </p>
              <Button variant="outline">Choose Files</Button>
            </div>

            <div className="mt-4 text-xs text-muted-foreground">
              <p>Supported formats: PDF, JPG, PNG, DOC, XLS</p>
              <p>Maximum file size: 10MB</p>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowUploadModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button variant="default" className="flex-1">
                Upload
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilesTab;
