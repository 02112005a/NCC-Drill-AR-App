'use client';

import { AnalyzeCadetPoseOutput } from '@/ai/flows/analyze-cadet-pose';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import useProgressData from '@/hooks/use-progress-data';
import { cn } from '@/lib/utils';
import { Camera, CameraOff, Sparkles, Volume2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getAnalysis, AnalysisResult } from '@/lib/actions';

const ScoreIndicator = ({ score }: { score: number }) => {
  const color = score > 80 ? 'text-green-500' : score > 50 ? 'text-yellow-500' : 'text-red-500';
  return (
    <div className={cn('text-center transition-colors duration-500', color)}>
      <p className="text-6xl font-bold">{(score * 100).toFixed(0)}</p>
      <p className="font-semibold">Posture Score</p>
    </div>
  );
};

export function LiveDrillClient() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const analysisIntervalRef = useRef<NodeJS.Timeout>();

  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { addDrillSession } = useProgressData();
  const { toast } = useToast();

  const startCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCameraOn(true);
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        toast({ title: 'Camera Error', description: 'Could not access camera. Please check permissions.', variant: 'destructive' });
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraOn(false);
      stopAnalysis();
    }
  };

  const captureAndAnalyze = useCallback(async () => {
    if (isLoading || !videoRef.current || !canvasRef.current) return;

    setIsLoading(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

    const imageData = canvas.toDataURL('image/jpeg');
    const result = await getAnalysis(imageData);

    if (result) {
      setAnalysisResult(result);
      if (result.audioDataUri && audioRef.current) {
        audioRef.current.src = result.audioDataUri;
        audioRef.current.play().catch(e => console.error("Audio playback failed", e));
      }
    } else {
        toast({ title: 'Analysis Failed', description: 'Could not analyze pose. Please try again.', variant: 'destructive' });
    }
    setIsLoading(false);
  }, [isLoading, toast]);

  const startAnalysis = () => {
    setIsAnalyzing(true);
    analysisIntervalRef.current = setInterval(captureAndAnalyze, 2000); // Analyze every 2 seconds
  };

  const stopAnalysis = () => {
    setIsAnalyzing(false);
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
    }
    if (analysisResult) {
      addDrillSession({ drill: 'Live Drill', score: Math.round(analysisResult.postureCorrectness * 100) });
      setAnalysisResult(null); // Reset for next session
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const feedbackColor = analysisResult?.postureCorrectness ?? 0 > 0.8 ? 'text-green-300' : analysisResult?.postureCorrectness ?? 0 > 0.5 ? 'text-yellow-300' : 'text-red-300';

  return (
    <div className="space-y-4">
      <div className="relative aspect-video w-full max-w-3xl mx-auto rounded-lg overflow-hidden border bg-muted">
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        <canvas ref={canvasRef} className="hidden" />
        <audio ref={audioRef} className="hidden" />

        {!isCameraOn && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
            <CameraOff className="size-16 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Camera is off</p>
          </div>
        )}

        {isAnalyzing && analysisResult && (
          <div className="absolute bottom-4 left-4 right-4 bg-black/60 p-3 rounded-lg backdrop-blur-sm">
            <div className="flex items-start gap-2">
              <Volume2 className={cn("size-5 flex-shrink-0 mt-1", feedbackColor)} />
              <p className={cn("font-medium", feedbackColor)}>{analysisResult.feedback}</p>
            </div>
          </div>
        )}
        
        {isAnalyzing && isLoading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-background">
                    <Sparkles className="animate-pulse" />
                    <p>Analyzing...</p>
                </div>
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
        <Card className="md:col-span-1">
          <CardContent className="p-4 flex flex-col items-center justify-center gap-4">
            {!isCameraOn ? (
              <Button onClick={startCamera} className="w-full">
                <Camera className="mr-2" /> Start Camera
              </Button>
            ) : (
              <Button onClick={stopCamera} variant="outline" className="w-full">
                <CameraOff className="mr-2" /> Stop Camera
              </Button>
            )}

            {isCameraOn && (
              !isAnalyzing ? (
                <Button onClick={startAnalysis} className="w-full">Start Analysis</Button>
              ) : (
                <Button onClick={stopAnalysis} variant="destructive" className="w-full">Stop Analysis</Button>
              )
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardContent className="p-4 flex items-center justify-center h-full">
            {isAnalyzing && analysisResult ? (
              <ScoreIndicator score={analysisResult.postureCorrectness} />
            ) : (
              <div className="text-center text-muted-foreground">
                <p>{isAnalyzing ? "Waiting for first analysis..." : "Start analysis to see your score."}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
