
import React, { useState } from 'react';
import { Check, FileCheck, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePatient } from '@/contexts/PatientContext';
import { useToast } from "@/hooks/use-toast";

const ReportPanel = () => {
  const { generateReport, currentPatient, structuredData } = usePatient();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  
  const handleGenerateReport = () => {
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      generateReport();
      setIsGenerating(false);
      setIsGenerated(true);
      
      toast({
        title: "Отчет сформирован",
        description: "Отчет о приеме успешно создан и готов к сохранению."
      });
    }, 2000);
  };
  
  const handleSaveReport = () => {
    toast({
      title: "Отчет сохранен",
      description: "Отчет о приеме успешно сохранен в медицинской карте пациента.",
      variant: "default"
    });
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <FileCheck className="mr-2 h-5 w-5 text-medical-primary" />
          Формирование отчета
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isGenerated ? (
          <div className="space-y-4">
            <div className="rounded-md bg-green-50 p-4 border border-green-100">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Отчет успешно сформирован</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>Все данные структурированы и готовы к сохранению в ЭМК.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg border p-4 space-y-3">
              <h3 className="font-medium">Предпросмотр отчета</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Пациент:</span>
                  <span className="font-medium">{currentPatient?.name || "Неизвестный пациент"}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Дата приема:</span>
                  <span className="font-medium">{new Date().toLocaleDateString()}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Диагноз:</span>
                  <span className="font-medium">{structuredData.diagnosis.join(", ")}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Рекомендации:</span>
                  <span className="font-medium">{structuredData.recommendations.length} пунктов</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="text-center">
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
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Формирование отчета...
                </>
              ) : (
                <>Сформировать отчет</>
              )}
            </Button>
          </div>
        )}
      </CardContent>
      
      {isGenerated && (
        <CardFooter>
          <Button 
            onClick={handleSaveReport} 
            variant="default" 
            className="w-full"
          >
            Сохранить в ЭМК
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ReportPanel;
