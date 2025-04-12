
import React, { useRef, useEffect } from 'react';
import { MessageSquare, Copy, User, Stethoscope, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { usePatient } from '@/contexts/PatientContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

const TranscriptPanel = () => {
  const { recordingData } = usePatient();
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Format timestamp as mm:ss
  const formatTimestamp = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current && recordingData.transcript.length > 0) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [recordingData.transcript]);
  
  const copyTranscript = () => {
    const text = recordingData.transcript.map(segment => 
      `[${segment.speaker === 'doctor' ? 'Врач' : 'Пациент'}] ${segment.text}`
    ).join('\n\n');
    navigator.clipboard.writeText(text);
    
    toast({
      title: "Скопировано",
      description: "Транскрипция диалога скопирована в буфер обмена"
    });
  };
  
  return (
    <Card className="mb-6 shadow-soft overflow-hidden transition-all hover:shadow-medium">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <MessageSquare className="h-4 w-4 text-medical-primary" />
          </div>
          <CardTitle className="text-lg">Транскрипция диалога</CardTitle>
        </div>
        
        {recordingData.transcript.length > 0 && (
          <Button variant="ghost" size="sm" onClick={copyTranscript}>
            <Copy className="h-4 w-4 mr-1.5" />
            Копировать
          </Button>
        )}
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea 
          className="h-72 pt-2 px-6" 
          ref={scrollRef} 
          type="always" 
          scrollHideDelay={100}
        >
          {recordingData.transcript.length > 0 ? (
            <div className="space-y-5 py-4">
              {recordingData.transcript.map((segment, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "flex gap-3 animate-fade-in",
                    segment.speaker === 'doctor' ? "justify-start" : "justify-end"
                  )}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {segment.speaker === 'doctor' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Stethoscope className="h-4 w-4 text-medical-primary" />
                    </div>
                  )}
                  
                  <div className={cn(
                    "rounded-2xl p-3 max-w-[80%] shadow-sm",
                    segment.speaker === 'doctor' 
                      ? "bg-white border border-medical-light text-foreground" 
                      : "bg-medical-primary/10 text-medical-dark"
                  )}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-sm">
                        {segment.speaker === 'doctor' ? 'Врач' : 'Пациент'}
                      </span>
                      <span className="text-xs text-muted-foreground bg-background/50 px-1.5 py-0.5 rounded-full">
                        {formatTimestamp(segment.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed">{segment.text}</p>
                  </div>
                  
                  {segment.speaker === 'patient' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                      <User className="h-4 w-4 text-medical-secondary" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-12">
              <MessageSquare className="h-12 w-12 text-muted-foreground/30 mb-3" />
              <p className="text-center mb-1">Транскрипция диалога появится здесь после начала записи</p>
              <p className="text-xs text-center text-muted-foreground/70">
                Система автоматически распознает речь врача и пациента
              </p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
      
      {recordingData.transcript.length > 0 && (
        <CardFooter className="px-6 py-3 border-t bg-muted/30">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Поиск в транскрипции..." className="pl-9 pr-3" />
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default TranscriptPanel;
