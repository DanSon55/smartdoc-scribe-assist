
import React from 'react';
import Layout from '@/components/Layout';
import { PatientProvider, usePatient } from '@/contexts/PatientContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, User, Calendar, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';

const RecordsList = () => {
  const { appointments, patients } = usePatient();
  
  // Get patient by ID
  const getPatientName = (patientId: string): string => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? patient.name : 'Неизвестный пациент';
  };
  
  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Записи приемов</h1>
      </div>
      
      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Поиск по записям..."
            className="pl-8"
          />
        </div>
        <Button variant="outline">Фильтры</Button>
      </div>
      
      <div className="space-y-4">
        {appointments.map(appointment => (
          <Link to="/" key={appointment.id}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-medical-light flex items-center justify-center text-medical-primary">
                      <FileText className="h-5 w-5" />
                    </div>
                    
                    <div>
                      <h3 className="font-medium">
                        Прием: {getPatientName(appointment.patientId)}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Calendar className="h-3 w-3 mr-1" /> 
                          {formatDate(appointment.date)}
                        </span>
                        
                        <Badge variant={
                          appointment.status === 'scheduled' ? 'outline' :
                          appointment.status === 'active' ? 'default' : 'secondary'
                        } className="text-xs">
                          {appointment.status === 'scheduled' ? 'Запланирован' :
                           appointment.status === 'active' ? 'Активен' : 'Завершен'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    {appointment.diagnosis && appointment.diagnosis.length > 0 && (
                      <div className="text-sm text-right">
                        {appointment.diagnosis[0]}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

const Records = () => {
  return (
    <PatientProvider>
      <Layout>
        <RecordsList />
      </Layout>
    </PatientProvider>
  );
};

export default Records;
