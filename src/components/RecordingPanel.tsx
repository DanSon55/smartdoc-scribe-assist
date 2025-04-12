
import React, { useEffect, useState } from 'react';
import { Mic, MicOff, Volume2, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { usePatient } from '@/contexts/PatientContext';
import { useToast } from "@/hooks/use-toast";

const RecordingPanel = () => {
  const { recordingData, startRecording, stopRecording } = usePatient();
  const { toast } = useToast();
  const [consentGiven, setConsentGiven] = useState(false);
  const [animatedBars, setAnimatedBars] = useState<number[]>([]);
  
  // Format seconds as mm:ss
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle consent and start recording
  const handleStartRecording = () => {
    if (!consentGiven) {
      toast({
        title: "Получение согласия",
        description: "Для улучшения качества записи и автоматизации документации включена аудиозапись приёма. Согласны?",
        action: (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                toast({
                  title: "Запись отменена",
                  description: "Запись приема не будет производиться."
                });
              }}
            >
              Нет
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={() => {
                setConsentGiven(true);
                startRecording();
                toast({
                  title: "Запись начата",
                  description: "Аудиозапись приема активирована."
                });
              }}
            >
              Да
            </Button>
          </div>
        )
      });
    } else {
      startRecording();
      toast({
        title: "Запись начата",
        description: "Аудиозапись приема активирована."
      });
    }
  };
  
  // Stop recording
  const handleStopRecording = () => {
    stopRecording();
    toast({
      title: "Запись завершена",
      description: "Аудиозапись приема остановлена."
    });
  };
  
  // Generate animated waveform bars when recording
  useEffect(() => {
    if (recordingData.isRecording) {
      const totalBars = 30;
      const interval = setInterval(() => {
        const newBars = Array.from({ length: totalBars }, () => 
          Math.floor(Math.random() * 40) + 5
        );
        setAnimatedBars(newBars);
      }, 100);
      
      return () => clearInterval(interval);
    } else {
      setAnimatedBars([]);
    }
  }, [recordingData.isRecording]);
  
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium flex items-center">
              <Volume2 className="mr-2 h-5 w-5 text-medical-primary" />
              Аудиозапись приема
            </h3>
            <div className="flex items-center gap-2">
              {recordingData.isRecording && (
                <span className="text-sm font-medium">
                  {formatTime(recordingData.duration)}
                </span>
              )}
              <Button
                variant={recordingData.isRecording ? "destructive" : "default"}
                size="sm"
                onClick={recordingData.isRecording ? handleStopRecording : handleStartRecording}
                className="flex items-center gap-1"
              >
                {recordingData.isRecording ? (
                  <>
                    <MicOff className="h-4 w-4" />
                    <span>Остановить</span>
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4" />
                    <span>Начать запись</span>
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {/* Waveform visualization */}
          <div className="waveform-container">
            <div className="waveform">
              {recordingData.isRecording ? (
                <>
                  {animatedBars.map((height, i) => (
                    <div 
                      key={i} 
                      className="waveform-bar"
                      style={{
                        height: `${height}px`,
                        animation: `animate-wave ${Math.random() * 1 + 0.5}s infinite`
                      }}
                    />
                  ))}
                </>
              ) : (
                <div className="text-muted-foreground text-sm">
                  {recordingData.transcript.length > 0 ? 
                    "Запись завершена" : 
                    "Нажмите 'Начать запись' для старта аудиозаписи приема"}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecordingPanel;
