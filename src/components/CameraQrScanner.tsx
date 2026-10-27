import React, { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';

interface CameraQrScannerProps {
  onScan: (decodedText: string) => void;
  onClose?: () => void;
  isOpen: boolean;
}

export const CameraQrScanner: React.FC<CameraQrScannerProps> = ({ onScan, onClose, isOpen }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const startCamera = async () => {
    setErrorMessage(null);
    stopCamera();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not available in this browser');
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setCameraActive(true);
        scanFrame();
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      // Try fallback to any video source
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = fallbackStream;
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
          await videoRef.current.play();
          setCameraActive(true);
          scanFrame();
        }
      } catch (fallbackErr: any) {
        setErrorMessage(
          'Live camera unavailable or permission denied. You can use the instant test buttons below or enter order code manually.'
        );
        setCameraActive(false);
      }
    }
  };

  const scanFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });

        if (code && code.data) {
          // Play a small beep audio feedback using Web Audio API
          playBeep();
          stopCamera();
          onScan(code.data);
          return;
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(scanFrame);
  };

  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // High pleasant beep
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch {
      // AudioContext not allowed or not supported
    }
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const toggleCameraFacing = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  if (!isOpen) return null;

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-black border-2 border-[#00652c] shadow-lg flex flex-col items-center">
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Video Viewfinder Container */}
      <div className="relative w-full aspect-[4/3] bg-neutral-900 overflow-hidden flex items-center justify-center">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
        />

        {/* Viewfinder Overlay with corner borders */}
        {cameraActive && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {/* Darkened edges */}
            <div className="absolute inset-0 bg-black/40"></div>

            {/* Scanning square */}
            <div className="relative w-52 h-52 bg-transparent rounded-2xl border-2 border-[#7ffc97] shadow-[0_0_0_9999px_rgba(0,0,0,0.4)] flex items-center justify-center overflow-hidden">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-[#00652c] rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-[#00652c] rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-[#00652c] rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-[#00652c] rounded-br-lg"></div>

              {/* Animated Laser Scanning Line */}
              <div className="w-full h-1 bg-[#7ffc97] shadow-[0_0_8px_#7ffc97] animate-pulse absolute top-1/2 -translate-y-1/2"></div>
            </div>
          </div>
        )}

        {/* Camera Inactive / Error Display */}
        {!cameraActive && (
          <div className="absolute inset-0 p-4 text-center text-white flex flex-col items-center justify-center z-10">
            <span className="material-symbols-outlined text-4xl text-[#ffb690] mb-2 animate-bounce">
              photo_camera
            </span>
            <span className="text-[14px] font-bold">
              {errorMessage ? 'Camera Unavailable' : 'Starting Camera Scanner...'}
            </span>
            {errorMessage && (
              <p className="text-[11px] text-[#becabc] mt-1 leading-snug">
                {errorMessage}
              </p>
            )}
            <button
              onClick={startCamera}
              className="mt-3 px-4 py-1.5 bg-[#00652c] hover:bg-[#15803d] text-white rounded-full text-[12px] font-bold active:scale-95"
            >
              Retry Camera
            </button>
          </div>
        )}

        {/* Camera Control Overlays */}
        {cameraActive && (
          <div className="absolute top-3 inset-x-3 flex items-center justify-between z-20 pointer-events-auto">
            <span className="bg-black/60 backdrop-blur-sm text-[#7ffc97] text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#7ffc97] animate-ping"></span>
              LIVE CAMERA ACTIVE
            </span>

            <button
              onClick={toggleCameraFacing}
              className="w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 active:scale-90"
              title="Flip camera"
            >
              <span className="material-symbols-outlined text-[18px]">flip_camera_ios</span>
            </button>
          </div>
        )}
      </div>

      {/* Helper Bar */}
      <div className="w-full bg-[#0c200d] px-3 py-2 flex items-center justify-between text-white text-[11px]">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px] text-[#7ffc97]">center_focus_strong</span>
          <span>Align customer receipt QR inside green target</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-[#becabc] hover:text-white font-bold cursor-pointer"
          >
            Done
          </button>
        )}
      </div>
    </div>
  );
};
