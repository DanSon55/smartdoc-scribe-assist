
import React from 'react';
import { User, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { usePatient } from '@/contexts/PatientContext';
import { Badge } from '@/components/ui/badge';

const PatientInfoPanel = () => {
  const { currentPatient, currentAppointment } = usePatient();
  
  // Format date string
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Не указано';
    
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (!currentPatient) {
    return (
      <Card className="mb-6">
        <CardContent className="p-4 flex items-center justify-center h-24 text-muted-foreground">
          Пациент не выбран
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-medical-light flex items-center justify-center text-medical-primary">
              <User className="h-6 w-6" />
            </div>
            
            <div>
              <h3 className="font-semibold text-lg">{currentPatient.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-muted-foreground">{currentPatient.age} лет</span>
                <Badge variant="outline" className={
                  currentPatient.gender === 'male' 
                    ? 'bg-blue-50 text-blue-700 border-none' 
                    : 'bg-pink-50 text-pink-700 border-none'
                }>
                  {currentPatient.gender === 'male' ? 'Мужчина' : 'Женщина'}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{formatDate(currentAppointment?.date)}</span>
            </div>
            
            <Badge className="mt-1" variant={
              currentAppointment?.status === 'scheduled' ? 'outline' :
              currentAppointment?.status === 'active' ? 'default' : 'secondary'
            }>
              {currentAppointment?.status === 'scheduled' ? 'Запланирован' :
               currentAppointment?.status === 'active' ? 'Активен' : 'Завершен'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientInfoPanel;
