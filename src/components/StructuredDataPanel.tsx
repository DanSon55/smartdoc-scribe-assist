
import React from 'react';
import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { usePatient } from '@/contexts/PatientContext';
import { Badge } from '@/components/ui/badge';

const StructuredDataPanel = () => {
  const { structuredData } = usePatient();
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <FileText className="mr-2 h-5 w-5 text-medical-primary" />
          Структурированные данные
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <DataSection title="Жалобы" items={structuredData.complaints} />
          <Separator />
          <DataSection title="Анамнез" items={structuredData.anamnesis} />
          <Separator />
          <DataSection title="Предварительный диагноз" items={structuredData.diagnosis} />
          <Separator />
          <DataSection title="Рекомендации" items={structuredData.recommendations} />
        </div>
      </CardContent>
    </Card>
  );
};

interface DataSectionProps {
  title: string;
  items: string[];
}

const DataSection: React.FC<DataSectionProps> = ({ title, items }) => {
  return (
    <div>
      <h4 className="font-medium mb-2 text-medical-dark">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <Badge key={index} variant="outline" className="bg-medical-light text-medical-dark border-none">
            {item}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default StructuredDataPanel;
