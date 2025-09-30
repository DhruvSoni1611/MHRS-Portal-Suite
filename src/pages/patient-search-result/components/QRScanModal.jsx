import React, { useState, useRef, useEffect } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const QRScanModal = ({ isOpen, onClose, onScanResult }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState("");
  const [hasPermission, setHasPermission] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      requestCameraPermission();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices?.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;
      if (videoRef?.current) {
        videoRef.current.srcObject = stream;
      }
      setHasPermission(true);
      setError("");
    } catch (err) {
      setHasPermission(false);
      setError(
        "Camera access denied. Please enable camera permissions to scan QR codes."
      );
    }
  };

  const stopCamera = () => {
    if (streamRef?.current) {
      streamRef?.current?.getTracks()?.forEach((track) => track?.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const startScanning = () => {
    setIsScanning(true);
    setError("");

    // Simulate QR code detection after 3 seconds
    setTimeout(() => {
      const mockPatientToken =
        "PT-" + Math.random()?.toString(36)?.substr(2, 8)?.toUpperCase();
      onScanResult(mockPatientToken);
      setIsScanning(false);
      onClose();
    }, 3000);
  };

  const handleManualEntry = () => {
    const token = prompt("Enter patient token manually:");
    if (token && token?.trim()) {
      onScanResult(token?.trim());
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-clinical-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="QrCode" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Scan Patient QR Code
              </h2>
              <p className="text-sm text-muted-foreground">
                Position the QR code within the camera frame
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            iconName="X"
            className="p-2"
          />
        </div>

        {/* Content */}
        <div className="p-6">
          {hasPermission === null && (
            <div className="text-center py-8">
              <Icon
                name="Camera"
                size={48}
                className="mx-auto text-muted-foreground mb-4"
              />
              <p className="text-muted-foreground">
                Requesting camera access...
              </p>
            </div>
          )}

          {hasPermission === false && (
            <div className="text-center py-8">
              <Icon
                name="CameraOff"
                size={48}
                className="mx-auto text-error mb-4"
              />
              <p className="text-error mb-4">{error}</p>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  onClick={requestCameraPermission}
                  iconName="RefreshCw"
                  iconPosition="left"
                  className="w-full"
                >
                  Try Again
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleManualEntry}
                  iconName="Keyboard"
                  iconPosition="left"
                  className="w-full"
                >
                  Enter Token Manually
                </Button>
              </div>
            </div>
          )}

          {hasPermission === true && (
            <div className="space-y-4">
              {/* Camera Preview */}
              <div className="relative bg-muted rounded-lg overflow-hidden aspect-video">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />

                {/* Scanning Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Scanning Frame */}
                    <div className="w-48 h-48 border-2 border-primary rounded-lg relative">
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-lg"></div>

                      {isScanning && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-full h-1 bg-primary animate-pulse"></div>
                        </div>
                      )}
                    </div>

                    {/* Instructions */}
                    <p className="text-center text-sm text-primary-foreground bg-primary/80 rounded px-3 py-1 mt-2">
                      {isScanning ? "Scanning..." : "Position QR code here"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex gap-2">
                {!isScanning ? (
                  <Button
                    variant="default"
                    onClick={startScanning}
                    iconName="Scan"
                    iconPosition="left"
                    className="flex-1"
                  >
                    Start Scanning
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setIsScanning(false)}
                    iconName="Square"
                    iconPosition="left"
                    className="flex-1"
                  >
                    Stop Scanning
                  </Button>
                )}

                <Button
                  variant="ghost"
                  onClick={handleManualEntry}
                  iconName="Keyboard"
                  className="px-4"
                  title="Manual Entry"
                />
              </div>

              {/* Tips */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-foreground mb-2">
                  Scanning Tips:
                </h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Ensure good lighting conditions</li>
                  <li>• Hold the device steady</li>
                  <li>• Keep QR code within the frame</li>
                  <li>• Clean camera lens if blurry</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRScanModal;
