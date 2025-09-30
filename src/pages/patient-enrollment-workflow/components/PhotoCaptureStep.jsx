import React, { useState, useRef } from "react";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";

const PhotoCaptureStep = ({
  formData,
  setFormData,
  errors,
  onNext,
  onPrevious,
  onSave,
}) => {
  const [captureMode, setCaptureMode] = useState("upload"); // 'upload', 'camera'
  const [isCapturing, setIsCapturing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(formData?.photo?.url || null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event?.target?.files?.[0];
    if (file) {
      if (file?.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert("File size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e?.target?.result;
        setPreviewUrl(url);
        setFormData((prev) => ({
          ...prev,
          photo: {
            url: url,
            file: file,
            type: "upload",
            timestamp: new Date()?.toISOString(),
          },
        }));
      };
      reader?.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      setIsCapturing(true);
      const stream = await navigator.mediaDevices?.getUserMedia({
        video: { width: 640, height: 480 },
      });
      if (videoRef?.current) {
        videoRef.current.srcObject = stream;
        videoRef?.current?.play();
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert(
        "Unable to access camera. Please check permissions or use file upload."
      );
      setIsCapturing(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef?.current && canvasRef?.current) {
      const canvas = canvasRef?.current;
      const video = videoRef?.current;
      const context = canvas?.getContext("2d");

      canvas.width = video?.videoWidth;
      canvas.height = video?.videoHeight;
      context?.drawImage(video, 0, 0);

      const dataUrl = canvas?.toDataURL("image/jpeg", 0.8);
      setPreviewUrl(dataUrl);

      setFormData((prev) => ({
        ...prev,
        photo: {
          url: dataUrl,
          type: "camera",
          timestamp: new Date()?.toISOString(),
        },
      }));

      // Stop camera stream
      const stream = video?.srcObject;
      if (stream) {
        stream?.getTracks()?.forEach((track) => track?.stop());
      }
      setIsCapturing(false);
    }
  };

  const stopCamera = () => {
    if (videoRef?.current && videoRef?.current?.srcObject) {
      const stream = videoRef?.current?.srcObject;
      stream?.getTracks()?.forEach((track) => track?.stop());
    }
    setIsCapturing(false);
  };

  const removePhoto = () => {
    setPreviewUrl(null);
    setFormData((prev) => ({
      ...prev,
      photo: null,
    }));
    if (fileInputRef?.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateStep = () => {
    return formData?.photo && formData?.photo?.url;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Patient Photo Capture
        </h3>
        <p className="text-muted-foreground">
          Capture or upload a clear photo of the patient for identification
          purposes. This helps healthcare staff verify patient identity during
          visits.
        </p>
      </div>
      {/* Capture Mode Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => setCaptureMode("upload")}
          className={`p-4 border rounded-lg text-left transition-clinical ${
            captureMode === "upload"
              ? "border-primary bg-primary/5 text-primary"
              : "border-border hover:border-primary/50"
          }`}
        >
          <Icon name="Upload" size={20} className="mb-2" />
          <h4 className="font-medium mb-1">Upload Photo</h4>
          <p className="text-sm text-muted-foreground">
            Select photo from device storage
          </p>
        </button>

        <button
          onClick={() => setCaptureMode("camera")}
          className={`p-4 border rounded-lg text-left transition-clinical ${
            captureMode === "camera"
              ? "border-primary bg-primary/5 text-primary"
              : "border-border hover:border-primary/50"
          }`}
        >
          <Icon name="Camera" size={20} className="mb-2" />
          <h4 className="font-medium mb-1">Use Camera</h4>
          <p className="text-sm text-muted-foreground">
            Take photo using webcam
          </p>
        </button>
      </div>
      {/* Photo Capture/Upload Interface */}
      <div className="bg-muted/50 border border-border rounded-lg p-6">
        {captureMode === "upload" && (
          <div className="text-center">
            {!previewUrl ? (
              <div className="space-y-4">
                <div className="w-32 h-32 mx-auto bg-muted border-2 border-dashed border-border rounded-lg flex items-center justify-center">
                  <Icon
                    name="ImagePlus"
                    size={32}
                    className="text-muted-foreground"
                  />
                </div>
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef?.current?.click()}
                    iconName="Upload"
                    iconPosition="left"
                  >
                    Select Photo
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    Supported formats: JPG, PNG, GIF (Max 5MB)
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-48 h-48 mx-auto border border-border rounded-lg overflow-hidden">
                  <Image
                    src={previewUrl}
                    alt="Patient photo preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef?.current?.click()}
                    iconName="RefreshCw"
                    iconPosition="left"
                  >
                    Replace Photo
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={removePhoto}
                    iconName="Trash2"
                    iconPosition="left"
                  >
                    Remove Photo
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {captureMode === "camera" && (
          <div className="text-center">
            {!isCapturing && !previewUrl && (
              <div className="space-y-4">
                <div className="w-32 h-32 mx-auto bg-muted border-2 border-dashed border-border rounded-lg flex items-center justify-center">
                  <Icon
                    name="Camera"
                    size={32}
                    className="text-muted-foreground"
                  />
                </div>
                <div>
                  <Button
                    onClick={startCamera}
                    iconName="Camera"
                    iconPosition="left"
                  >
                    Start Camera
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    Allow camera access to take patient photo
                  </p>
                </div>
              </div>
            )}

            {isCapturing && (
              <div className="space-y-4">
                <div className="relative w-80 h-60 mx-auto border border-border rounded-lg overflow-hidden bg-black">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                  />
                  <div className="absolute inset-0 border-2 border-primary/50 rounded-lg pointer-events-none">
                    <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-primary"></div>
                    <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-primary"></div>
                    <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-primary"></div>
                    <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-primary"></div>
                  </div>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <Button
                    onClick={capturePhoto}
                    iconName="Camera"
                    iconPosition="left"
                  >
                    Capture Photo
                  </Button>
                  <Button
                    variant="outline"
                    onClick={stopCamera}
                    iconName="X"
                    iconPosition="left"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {previewUrl && !isCapturing && (
              <div className="space-y-4">
                <div className="w-48 h-48 mx-auto border border-border rounded-lg overflow-hidden">
                  <Image
                    src={previewUrl}
                    alt="Captured patient photo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <Button
                    variant="outline"
                    onClick={startCamera}
                    iconName="RefreshCw"
                    iconPosition="left"
                  >
                    Retake Photo
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={removePhoto}
                    iconName="Trash2"
                    iconPosition="left"
                  >
                    Remove Photo
                  </Button>
                </div>
              </div>
            )}

            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}

        {/* Photo Guidelines */}
        <div className="mt-6 p-4 bg-accent/10 border border-accent/20 rounded-lg">
          <h4 className="font-medium text-accent mb-2">Photo Guidelines</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Ensure good lighting and clear visibility of face</li>
            <li>• Patient should look directly at the camera</li>
            <li>• Avoid shadows, reflections, or blurred images</li>
            <li>• Photo will be used for patient identification</li>
            <li>• Image should be recent and recognizable</li>
          </ul>
        </div>
      </div>
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={onPrevious}
            iconName="ArrowLeft"
            iconPosition="left"
          >
            Back to ABHA Integration
          </Button>

          <Button
            variant="outline"
            onClick={onSave}
            iconName="Save"
            iconPosition="left"
          >
            Save Draft
          </Button>
        </div>

        <Button
          onClick={onNext}
          disabled={!validateStep()}
          iconName="ArrowRight"
          iconPosition="right"
        >
          Continue to Emergency Contact
        </Button>
      </div>
    </div>
  );
};

export default PhotoCaptureStep;
