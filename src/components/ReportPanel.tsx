
import React, { useState } from 'react';
import { CheckCircle, FileCheck, Loader2, Download, Share2, FilePlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePatient } from '@/contexts/PatientContext';
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ReportPanel = () => {
  const { generateReport, currentPatient, structuredData } = usePatient();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const handleGenerateReport = () => {
    setIsGenerating(true);
    setProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
    
    // Simulate report generation
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      generateReport();
      setIsGenerating(false);
      setIsGenerated(true);
      
      toast({
        title: "Отчет сформирован",
        description: "Отчет о приеме успешно создан и готов к сохранению.",
        variant: "default"
      });
    }, 3000);
  };
  
  const handleSaveReport = () => {
    toast({
      title: "Отчет сохранен",
      description: "Отчет о приеме успешно сохранен в медицинской карте пациента.",
      variant: "default"
    });
  };
  
  return (
    <Card className="shadow-soft overflow-hidden transition-all hover:shadow-medium">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <FileCheck className="h-4 w-4 text-medical-primary" />
          </div>
          <CardTitle className="text-lg">Формирование отчета</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {isGenerating ? (
          <div className="space-y-4 py-4">
            <div className="text-center mb-2">
              <Loader2 className="h-10 w-10 text-medical-primary animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-medium text-medical-dark">Формирование отчета...</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Система анализирует диалог и структурирует информацию
              </p>
            </div>
            
            <Progress value={progress} className="h-2" />
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Анализ данных</span>
              <span>{progress}%</span>
            </div>
          </div>
        ) : isGenerated ? (
          <div className="space-y-4 py-2">
            <div className="rounded-xl bg-green-50 p-4 border border-green-100">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Отчет успешно сформирован</h3>
                  <div className="mt-1 text-sm text-green-700">
                    <p>Все данные структурированы и готовы к сохранению в ЭМК.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="rounded-xl border p-4 space-y-3 bg-white">
              <h3 className="font-medium flex items-center gap-2">
                <FilePlus className="h-4 w-4 text-medical-primary" />
                <span>Предпросмотр отчета</span>
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm items-center">
                  <span className="text-muted-foreground">Пациент:</span>
                  <span className="font-medium text-medical-dark">{currentPatient?.name || "Неизвестный пациент"}</span>
                </div>
                
                <Separator className="my-1" />
                
                <div className="flex justify-between text-sm items-center">
                  <span className="text-muted-foreground">Дата приема:</span>
                  <span className="font-medium text-medical-dark">{new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                </div>
                
                <Separator className="my-1" />
                
                <div className="flex justify-between text-sm items-center">
                  <span className="text-muted-foreground">Диагноз:</span>
                  <span className="font-medium text-blue-600">{structuredData.diagnosis.join(", ")}</span>
                </div>
                
                <Separator className="my-1" />
                
                <div className="flex justify-between text-sm items-center">
                  <span className="text-muted-foreground">Рекомендации:</span>
                  <span className="font-medium text-medical-dark">{structuredData.recommendations.length} пунктов</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="text-center">
              <FileCheck className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="mb-2 text-muted-foreground">
                Нажмите кнопку ниже, чтобы автоматически сформировать отчет о приеме на основе анализа диалога.
              </p>
              <p className="text-sm text-muted-foreground">
                Система проанализирует диалог и сформирует структурированный отчет для медицинской карты.
              </p>
            </div>
            
            <Button 
              onClick={handleGenerateReport} 
              disabled={isGenerating}
              className="w-full mt-2"
            >
              <FileCheck className="mr-2 h-4 w-4" />
              Сформировать отчет
            </Button>
          </div>
        )}
      </CardContent>
      
      {isGenerated && (
        <CardFooter className="flex gap-2 bg-muted/30 border-t px-6 py-3">
          <Button 
            onClick={handleSaveReport} 
            variant="default" 
            className="w-full"
          >
            <FileCheck className="mr-2 h-4 w-4" />
            Сохранить в ЭМК
          </Button>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Скачать отчет</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Поделиться отчетом</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardFooter>
      )}
    </Card>
  );
};

export default ReportPanel;
