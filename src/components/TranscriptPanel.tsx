
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePatient } from '@/contexts/PatientContext';
import { ScrollArea } from '@/components/ui/scroll-area';

const TranscriptPanel = () => {
  const { recordingData } = usePatient();
  
  // Format timestamp as mm:ss
  const formatTimestamp = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <MessageSquare className="mr-2 h-5 w-5 text-medical-primary" />
          Транскрипция диалога
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64 rounded-md border p-3">
          {recordingData.transcript.length > 0 ? (
            <div className="space-y-4">
              {recordingData.transcript.map((segment, index) => (
                <div key={index} className={`flex gap-3 ${segment.speaker === 'doctor' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`rounded-lg p-3 max-w-[80%] ${
                    segment.speaker === 'doctor' 
                      ? 'bg-medical-light text-medical-dark' 
                      : 'bg-medical-primary/10 text-medical-dark'
                  }`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-sm">
                        {segment.speaker === 'doctor' ? 'Врач' : 'Пациент'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(segment.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm">{segment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Транскрипция диалога появится здесь после начала записи
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TranscriptPanel;
