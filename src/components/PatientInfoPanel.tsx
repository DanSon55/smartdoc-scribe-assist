
import React from 'react';
import { User, Calendar, Phone, MapPin, Clock, ClipboardList } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { usePatient } from '@/contexts/PatientContext';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

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
  
  const getStatusColor = (status?: string) => {
    if (!status) return "bg-gray-100 text-gray-800";
    
    switch(status) {
      case 'active':
        return "bg-green-100 text-green-800 border-green-200";
      case 'scheduled':
        return "bg-blue-100 text-blue-800 border-blue-200";
      case 'completed':
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const getStatusIcon = (status?: string) => {
    switch(status) {
      case 'active':
        return <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1.5"></div>;
      case 'scheduled':
        return <Clock className="h-3.5 w-3.5 text-blue-500 mr-1.5" />;
      case 'completed':
        return <ClipboardList className="h-3.5 w-3.5 text-gray-500 mr-1.5" />;
      default:
        return null;
    }
  };
  
  if (!currentPatient) {
    return (
      <Card className="mb-6 shadow-soft overflow-hidden">
        <CardContent className="p-6 flex items-center justify-center h-24 text-muted-foreground">
          <div className="text-center">
            <User className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
            <p>Пациент не выбран</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const patientInitials = currentPatient.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
  
  return (
    <Card className="mb-6 shadow-soft overflow-hidden transition-all hover:shadow-medium">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="bg-gradient-to-br from-medical-primary to-medical-secondary p-6 text-white md:w-1/3 flex flex-col justify-center">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-white/30">
                <AvatarFallback className="bg-white/20 text-white text-xl">
                  {patientInitials}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h3 className="font-bold text-xl">{currentPatient.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-white/20 hover:bg-white/30 text-white border-none">
                    {currentPatient.age} лет
                  </Badge>
                  <Badge className="bg-white/20 hover:bg-white/30 text-white border-none">
                    {currentPatient.gender === 'male' ? 'Мужчина' : 'Женщина'}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+7 (926) 123-45-67</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Москва</span>
              </div>
            </div>
          </div>
          
          <div className="p-6 md:w-2/3 flex flex-col justify-center">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-lg flex items-center gap-1">
                <Calendar className="h-5 w-5 text-medical-primary" />
                <span>Информация о приеме</span>
              </h4>
              
              <Badge 
                variant="outline" 
                className={`${getStatusColor(currentAppointment?.status)} flex items-center`}
              >
                {getStatusIcon(currentAppointment?.status)}
                <span>
                  {currentAppointment?.status === 'active' ? 'Активен' :
                   currentAppointment?.status === 'scheduled' ? 'Запланирован' : 'Завершен'}
                </span>
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
              <div>
                <div className="text-sm text-muted-foreground">Дата приема</div>
                <div className="font-medium">{formatDate(currentAppointment?.date)}</div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Продолжительность</div>
                <div className="font-medium">30 минут</div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Врач</div>
                <div className="font-medium">Д-р Иванов А.П.</div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Специальность</div>
                <div className="font-medium">Терапевт</div>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-xs h-8">
                История приемов
              </Button>
              <Button variant="outline" size="sm" className="text-xs h-8">
                Медкарта
              </Button>
              <Button variant="outline" size="sm" className="text-xs h-8">
                Результаты анализов
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientInfoPanel;
