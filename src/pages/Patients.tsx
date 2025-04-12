
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { usePatient } from '@/contexts/PatientContext';
import { Card } from '@/components/ui/card';
import { User, Calendar, Search, Plus, Filter, ArrowUpDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input'; 
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const PatientsList = () => {
  const { patients, appointments } = usePatient();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Список пациентов</h1>
        
        <Button className="shadow-sm">
          <Plus className="h-4 w-4 mr-2" />
          Новый пациент
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Поиск пациентов..." 
            className="pl-10 pr-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 ml-auto">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Фильтрация</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Сортировка</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPatients.length > 0 ? (
          filteredPatients.map(patient => {
            const patientAppointments = appointments.filter(a => a.patientId === patient.id);
            const latestAppointment = patientAppointments.sort((a, b) => 
              new Date(b.date).getTime() - new Date(a.date).getTime()
            )[0];
            
            const patientInitials = patient.name
              .split(' ')
              .map(n => n[0])
              .join('')
              .toUpperCase();
              
            return (
              <Link to="/" key={patient.id}>
                <Card className="overflow-hidden hover:shadow-medium transition-all duration-300 card-hover cursor-pointer border-t-4 border-t-medical-primary">
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12 bg-medical-light">
                        <AvatarFallback className="bg-medical-light text-medical-primary">
                          {patientInitials}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-foreground">{patient.name}</h3>
                            <div className="text-sm text-muted-foreground mt-0.5">
                              {patient.age} лет, {patient.gender === 'male' ? 'муж.' : 'жен.'}
                            </div>
                          </div>
                          
                          {latestAppointment && (
                            <Badge variant={
                              latestAppointment.status === 'scheduled' ? 'outline' :
                              latestAppointment.status === 'active' ? 'default' : 'secondary'
                            }>
                              {latestAppointment.status === 'scheduled' ? 'Запланирован' :
                              latestAppointment.status === 'active' ? 'Активен' : 'Завершен'}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t flex justify-between items-center">
                      {latestAppointment ? (
                        <>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(latestAppointment.date).toLocaleDateString('ru-RU')}</span>
                          </div>
                          
                          {latestAppointment?.diagnosis && latestAppointment.diagnosis.length > 0 && (
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-800 border-none">
                              {latestAppointment.diagnosis[0]}
                            </Badge>
                          )}
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground">Нет приемов</span>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })
        ) : (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            <User className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="mb-2">Пациенты не найдены</p>
            <p className="text-sm">Попробуйте изменить критерии поиска или добавьте нового пациента</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Patients = () => {
  return (
    <Layout>
      <PatientsList />
    </Layout>
  );
};

export default Patients;
