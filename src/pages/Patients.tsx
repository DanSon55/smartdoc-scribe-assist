
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { usePatient, Patient } from '@/contexts/PatientContext';
import { Card } from '@/components/ui/card';
import { useTherapist } from '@/contexts/TherapistContext';
import { User, Calendar, Search, Plus, Filter, ArrowUpDown, Trash2, Send, CheckCircle, Clock, DollarSign, MessagesSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input'; 
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PatientsList = () => {
  const { patients, appointments, deletePatient, sendInvitation, acceptInvitation } = usePatient();
  const { currentTherapist } = useTherapist();
  const [searchTerm, setSearchTerm] = useState('');
  const [priceInput, setPriceInput] = useState<number>(0);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const { toast } = useToast();
  
  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleDeletePatient = (patientId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    deletePatient(patientId);
    
    toast({
      title: "Пациент удален",
      description: "Пациент был успешно удален из вашего списка",
    });
  };
  
  const handleSendInvitation = (patientId: string) => {
    sendInvitation(patientId, priceInput);
    setSelectedPatientId(null);
    
    toast({
      title: "Приглашение отправлено",
      description: `Приглашение отправлено пациенту${priceInput > 0 ? ` с ценой ${priceInput} ₽` : ' бесплатно'}`,
    });
  };
  
  const handleAcceptInvitation = (patientId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    acceptInvitation(patientId);
    
    toast({
      title: "Приглашение принято",
      description: "Пациент добавлен в активный список",
    });
  };
  
  const getPatientStatusBadge = (patient: Patient) => {
    if (!patient.status) return null;
    
    switch (patient.status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-none">
            <Clock className="h-3 w-3 mr-1" /> Ожидание
          </Badge>
        );
      case 'active':
        return (
          <Badge variant="default" className="bg-green-600 text-white">
            <CheckCircle className="h-3 w-3 mr-1" /> Активен
          </Badge>
        );
      case 'invited':
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-none">
            <Send className="h-3 w-3 mr-1" /> Приглашен
          </Badge>
        );
      default:
        return null;
    }
  };
  
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
              <Card 
                key={patient.id} 
                className="overflow-hidden hover:shadow-medium transition-all duration-300 card-hover cursor-pointer border-t-4 border-t-medical-primary"
              >
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
                        
                        <div className="flex gap-2">
                          {getPatientStatusBadge(patient)}
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-red-500 hover:text-white hover:bg-red-500"
                                  onClick={(e) => handleDeletePatient(patient.id, e)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Удалить пациента</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t">
                    <div className="flex justify-between items-center mb-3">
                      {latestAppointment ? (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(latestAppointment.date).toLocaleDateString('ru-RU')}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Нет приемов</span>
                      )}
                      
                      {patient.price && (
                        <Badge variant="outline" className="bg-green-50 text-green-800 flex items-center gap-1 border-none">
                          <DollarSign className="h-3 w-3" />
                          {patient.price} ₽
                        </Badge>
                      )}
                      
                      {latestAppointment?.diagnosis && latestAppointment.diagnosis.length > 0 && (
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-800 border-none">
                          {latestAppointment.diagnosis[0]}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex justify-between gap-2">
                      {!patient.status && currentTherapist && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full"
                              onClick={() => setSelectedPatientId(patient.id)}
                            >
                              <Send className="h-3.5 w-3.5 mr-1.5" />
                              Пригласить
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Отправить приглашение пациенту</DialogTitle>
                              <DialogDescription>
                                Укажите стоимость ваших услуг или оставьте 0 для бесплатной консультации
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="py-4">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">Стоимость:</span>
                                <Input 
                                  type="number" 
                                  value={priceInput}
                                  onChange={e => setPriceInput(Number(e.target.value))}
                                  className="w-32"
                                  min="0"
                                />
                                <span className="text-sm">₽</span>
                              </div>
                            </div>
                            
                            <DialogFooter>
                              <Button 
                                onClick={() => handleSendInvitation(selectedPatientId || '')}
                                className="w-full sm:w-auto"
                              >
                                Отправить приглашение
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                      
                      {patient.status === 'invited' && (
                        <Button 
                          variant="default"
                          size="sm"
                          className="w-full bg-medical-primary" 
                          onClick={(e) => handleAcceptInvitation(patient.id, e)}
                        >
                          <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                          Принять запрос
                        </Button>
                      )}
                      
                      {patient.status === 'active' && (
                        <>
                          <Link to="/" className="w-full">
                            <Button variant="outline" size="sm" className="w-full">
                              <Calendar className="h-3.5 w-3.5 mr-1.5" />
                              Запись
                            </Button>
                          </Link>
                          <Link to="/" className="w-full">
                            <Button variant="secondary" size="sm" className="w-full">
                              <MessagesSquare className="h-3.5 w-3.5 mr-1.5" />
                              Чат
                            </Button>
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
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
