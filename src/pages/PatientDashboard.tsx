
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { usePatient } from '@/contexts/PatientContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Stethoscope, FileText, TestTube } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const PatientDashboard = () => {
  const { userType, patients, appointments } = usePatient();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);

  // Redirect if not a patient
  useEffect(() => {
    if (userType === 'doctor') {
      navigate('/');
    }
  }, [userType, navigate]);

  // Handle tab navigation
  const handleTabClick = (path: string) => {
    navigate(path);
  };

  const handleAppointmentRequest = (doctorName: string) => {
    setSelectedDoctor(doctorName);
    toast({
      title: "Запись на приём",
      description: `Вы успешно записались на приём к врачу: ${doctorName}`,
      duration: 5000,
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Личный кабинет пациента</h1>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => navigate('/patient-settings')}>
              Настройки
            </Button>
            <Button variant="outline" onClick={() => navigate('/patient-profile')}>
              Редактировать профиль
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="doctors" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="doctors">Найти врача</TabsTrigger>
            <TabsTrigger value="history">История приёмов</TabsTrigger>
            <TabsTrigger value="medcard">Медкарта</TabsTrigger>
            <TabsTrigger value="tests">Результаты анализов</TabsTrigger>
          </TabsList>
          
          <TabsContent value="doctors" className="space-y-4">
            <h2 className="text-xl font-semibold">Доступные специалисты</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Mock doctor data - removed the specific doctor entry */}
              {[
                { name: "Петров Сергей Иванович", specialty: "Терапевт", rating: 4.8, price: 2500 },
                { name: "Смирнова Анна Павловна", specialty: "Кардиолог", rating: 4.9, price: 3500 },
                { name: "Кузнецов Дмитрий Александрович", specialty: "Невролог", rating: 4.7, price: 3000 }
              ].map((doctor, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="bg-medical-light">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{doctor.name}</CardTitle>
                        <CardDescription className="text-foreground/70">{doctor.specialty}</CardDescription>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
                        <Stethoscope className="h-5 w-5 text-medical-primary" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-medium">Рейтинг: {doctor.rating}/5.0</span>
                      <span className="text-sm font-semibold">{doctor.price} ₽/консультация</span>
                    </div>
                    <Button 
                      className="w-full bg-medical-primary hover:bg-medical-secondary"
                      onClick={() => handleAppointmentRequest(doctor.name)}
                    >
                      Записаться на приём
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            <h2 className="text-xl font-semibold">История приёмов</h2>
            
            {appointments.length > 0 ? (
              <div className="space-y-3">
                {appointments.map(appointment => (
                  <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-medical-light flex items-center justify-center">
                          <FileText className="h-5 w-5 text-medical-primary" />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-medium">Приём {new Date(appointment.date).toLocaleDateString('ru-RU')}</h3>
                          <p className="text-sm text-muted-foreground">
                            Статус: {appointment.status === 'scheduled' ? 'Запланирован' : 
                                    appointment.status === 'active' ? 'Активен' : 'Завершен'}
                          </p>
                        </div>
                        
                        <Button variant="outline" size="sm">
                          Подробнее
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 flex flex-col items-center justify-center text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Нет истории приёмов</h3>
                  <p className="text-muted-foreground mb-4">У вас пока нет записей о приёмах врачей</p>
                  <Button>Записаться на приём</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="medcard" className="space-y-4">
            <h2 className="text-xl font-semibold">Медицинская карта</h2>
            
            <Card>
              <CardContent className="p-8 flex flex-col items-center justify-center text-center">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Медицинская карта</h3>
                <p className="text-muted-foreground mb-4">
                  Здесь будет отображаться ваша медицинская карта и история болезней
                </p>
                <Button variant="outline">Запросить медкарту</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tests" className="space-y-4">
            <h2 className="text-xl font-semibold">Результаты анализов</h2>
            
            <Card>
              <CardContent className="p-8 flex flex-col items-center justify-center text-center">
                <TestTube className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Результаты анализов</h3>
                <p className="text-muted-foreground mb-4">
                  Здесь будут отображаться результаты ваших анализов и исследований
                </p>
                <Button variant="outline">Загрузить результаты</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default PatientDashboard;
