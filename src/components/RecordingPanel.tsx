
import React, { useEffect, useState } from 'react';
import { Mic, MicOff, Volume2, SkipForward, Waves, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { usePatient } from '@/contexts/PatientContext';
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const RecordingPanel = () => {
  const { recordingData, startRecording, stopRecording } = usePatient();
  const { toast } = useToast();
  const [consentGiven, setConsentGiven] = useState(false);
  const [animatedBars, setAnimatedBars] = useState<number[]>([]);
  const [showControls, setShowControls] = useState(false);
  
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
                setShowControls(true);
                toast({
                  title: "Запись начата",
                  description: "Аудиозапись приема активирована.",
                  variant: "default" 
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
      setShowControls(true);
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
      description: "Аудиозапись приема успешно сохранена для анализа."
    });
  };
  
  // Generate animated waveform bars when recording
  useEffect(() => {
    if (recordingData.isRecording) {
      const totalBars = 40;
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
    <Card className="mb-6 shadow-soft overflow-hidden transition-all hover:shadow-medium">
      <CardContent className="p-5">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {recordingData.isRecording ? (
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center recording-pulse">
                  <Mic className="h-4 w-4 text-red-500" />
                </div>
              ) : (
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Waves className="h-4 w-4 text-medical-primary" />
                </div>
              )}
              <h3 className="text-lg font-medium">
                {recordingData.isRecording ? 'Запись активна' : 'Аудиозапись приема'}
              </h3>
            </div>
            
            <div className="flex items-center gap-3">
              {recordingData.isRecording && (
                <div className="bg-red-50 px-3 py-1 rounded-full flex items-center">
                  <div className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse"></div>
                  <span className="text-sm font-medium text-red-500">
                    {formatTime(recordingData.duration)}
                  </span>
                </div>
              )}
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={recordingData.isRecording ? "destructive" : "default"}
                      size="sm"
                      onClick={recordingData.isRecording ? handleStopRecording : handleStartRecording}
                      className="flex items-center gap-1 shadow-sm"
                    >
                      {recordingData.isRecording ? (
                        <>
                          <MicOff className="h-4 w-4 mr-1" />
                          <span>Остановить</span>
                        </>
                      ) : (
                        <>
                          <Mic className="h-4 w-4 mr-1" />
                          <span>Начать запись</span>
                        </>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {recordingData.isRecording 
                      ? "Остановить запись приема" 
                      : "Начать запись приема с согласия пациента"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          {/* Waveform visualization */}
          <div className="waveform-container rounded-xl">
            <div className="waveform">
              {recordingData.isRecording ? (
                <>
                  {animatedBars.map((height, i) => (
                    <div 
                      key={i} 
                      className="waveform-bar"
                      style={{
                        height: `${height}px`,
                        animation: `animate-wave ${Math.random() * 1 + 0.5}s infinite`,
                        backgroundColor: i % 5 === 0 ? '#2563EB' : '#3B82F6'
                      }}
                    />
                  ))}
                </>
              ) : (
                <div className="text-muted-foreground text-sm flex flex-col items-center">
                  {recordingData.transcript.length > 0 ? (
                    <>
                      <span className="text-medical-primary font-medium mb-1">Запись завершена</span>
                      <span className="text-xs opacity-70">Длительность: {formatTime(recordingData.duration || 0)}</span>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center px-4">
                      <AlertCircle className="h-5 w-5 text-muted-foreground mb-2 opacity-60" />
                      <span>Нажмите 'Начать запись' для старта аудиозаписи приема</span>
                      <span className="text-xs mt-1 opacity-70">Транскрипция начнется автоматически</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {showControls && (
            <div className="flex items-center justify-between pt-1 animate-slide-up">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Volume2 className="h-3.5 w-3.5" />
                <Progress value={70} className="w-24 h-1.5" />
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-8 text-xs">
                  <SkipForward className="h-3.5 w-3.5 mr-1" />
                  Пропустить паузу
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecordingPanel;
