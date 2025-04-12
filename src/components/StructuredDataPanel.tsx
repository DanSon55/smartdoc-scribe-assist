
import React from 'react';
import { FileText, Check, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { usePatient } from '@/contexts/PatientContext';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';

const StructuredDataPanel = () => {
  const { structuredData, recordingData } = usePatient();
  
  const hasData = Object.values(structuredData).some(arr => arr.length > 0);
  
  return (
    <Card className="mb-6 shadow-soft overflow-hidden transition-all hover:shadow-medium">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <FileText className="h-4 w-4 text-medical-primary" />
          </div>
          <CardTitle className="text-lg">Структурированные данные</CardTitle>
        </div>
      </CardHeader>
      <CardContent className={hasData ? "p-5" : "p-0"}>
        {hasData ? (
          <div className="space-y-5">
            {structuredData.complaints.length > 0 && (
              <DataSection 
                title="Жалобы" 
                items={structuredData.complaints} 
                colorScheme="red"
                icon={<AlertCircle className="h-3.5 w-3.5" />} 
              />
            )}
            
            {structuredData.complaints.length > 0 && structuredData.anamnesis.length > 0 && (
              <Separator className="my-4" />
            )}
            
            {structuredData.anamnesis.length > 0 && (
              <DataSection 
                title="Анамнез" 
                items={structuredData.anamnesis} 
                colorScheme="amber" 
              />
            )}
            
            {structuredData.anamnesis.length > 0 && structuredData.diagnosis.length > 0 && (
              <Separator className="my-4" />
            )}
            
            {structuredData.diagnosis.length > 0 && (
              <DataSection 
                title="Предварительный диагноз" 
                items={structuredData.diagnosis} 
                colorScheme="blue"
                icon={<Check className="h-3.5 w-3.5" />} 
              />
            )}
            
            {structuredData.diagnosis.length > 0 && structuredData.recommendations.length > 0 && (
              <Separator className="my-4" />
            )}
            
            {structuredData.recommendations.length > 0 && (
              <DataSection 
                title="Рекомендации" 
                items={structuredData.recommendations} 
                colorScheme="green" 
              />
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center text-muted-foreground">
            <FileText className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="mb-1">Структурированные данные будут отображаться здесь</p>
            <p className="text-xs text-muted-foreground/70">
              {recordingData.isRecording 
                ? "Идет анализ диалога..." 
                : "Начните запись для автоматического анализа диалога"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface DataSectionProps {
  title: string;
  items: string[];
  colorScheme: "red" | "amber" | "blue" | "green";
  icon?: React.ReactNode;
}

const DataSection: React.FC<DataSectionProps> = ({ title, items, colorScheme, icon }) => {
  const colorMap = {
    red: {
      bg: "bg-red-50",
      text: "text-red-800",
      border: "border-red-100"
    },
    amber: {
      bg: "bg-amber-50",
      text: "text-amber-800",
      border: "border-amber-100"
    },
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-800",
      border: "border-blue-100"
    },
    green: {
      bg: "bg-green-50",
      text: "text-green-800",
      border: "border-green-100"
    }
  };
  
  return (
    <div className="animate-fade-in">
      <h4 className="font-medium mb-3 text-medical-dark flex items-center gap-2">
        {icon && <span>{icon}</span>}
        <span>{title}</span>
      </h4>
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge 
                  variant="outline" 
                  className={cn(
                    colorMap[colorScheme].bg,
                    colorMap[colorScheme].text,
                    "border-none py-1.5 px-3"
                  )}
                >
                  {item}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Обнаружено в диалоге</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
};

export default StructuredDataPanel;
