
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { usePatient } from '@/contexts/PatientContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Stethoscope, FileText, TestTube, Bell, DollarSign, Euro, Yen, PoundSterling } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const PatientDashboard = () => {
  const { userType, patients, appointments } = usePatient();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [showDoctors, setShowDoctors] = useState(true);
  const [appointmentConfirmOpen, setAppointmentConfirmOpen] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState<{name: string; specialty: string; price: number} | null>(null);
  const [currency, setCurrency] = useState<{symbol: string; code: string; rate: number}>({
    symbol: '₽',
    code: 'RUB',
    rate: 1
  });
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Новая запись', message: 'Вы успешно записаны на прием', read: false },
    { id: 2, title: 'Напоминание', message: 'Завтра у вас прием в 10:00', read: false }
  ]);

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

  // Available currencies
  const currencies = [
    { symbol: '₽', code: 'RUB', rate: 1 },
    { symbol: '₸', code: 'KZT', rate: 5.5 },
    { symbol: '$', code: 'USD', rate: 0.011 },
    { symbol: '€', code: 'EUR', rate: 0.01 }
  ];

  // Convert price to selected currency
  const convertPrice = (priceInRub: number) => {
    const converted = priceInRub * currency.rate;
    return `${currency.symbol}${Math.round(converted)}`;
  };

  const handleAppointmentRequest = (doctor: {name: string; specialty: string; price: number}) => {
    setCurrentDoctor(doctor);
    setAppointmentConfirmOpen(true);
  };

  const confirmAppointment = () => {
    if (currentDoctor) {
      setSelectedDoctor(currentDoctor.name);
      setShowDoctors(false);
      setAppointmentConfirmOpen(false);
      
      // Add to notifications
      const newNotification = {
        id: notifications.length + 1,
        title: 'Запись на приём',
        message: `Вы записаны на приём к врачу: ${currentDoctor.name}`,
        read: false
      };
      
      setNotifications([...notifications, newNotification]);
      
      toast({
        title: "Запись на приём",
        description: `Вы успешно записались на приём к врачу: ${currentDoctor.name}`,
        duration: 5000,
      });
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({...n, read: true})));
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Личный кабинет пациента</h1>
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {currency.symbol} {currency.code}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {currencies.map((curr, idx) => (
                  <DropdownMenuItem key={idx} onClick={() => setCurrency(curr)}>
                    <div className="flex items-center">
                      {curr.code === 'RUB' && <PoundSterling className="mr-2 h-4 w-4" />}
                      {curr.code === 'KZT' && <DollarSign className="mr-2 h-4 w-4" />}
                      {curr.code === 'USD' && <DollarSign className="mr-2 h-4 w-4" />}
                      {curr.code === 'EUR' && <Euro className="mr-2 h-4 w-4" />}
                      {curr.code}
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="relative">
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between p-2 border-b">
                  <h3 className="font-semibold">Уведомления</h3>
                  {unreadCount > 0 && (
                    <Button 
                      variant="link" 
                      className="text-xs"
                      onClick={markAllAsRead}
                    >
                      Прочитать все
                    </Button>
                  )}
                </div>
                <div className="max-h-80 overflow-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      Нет уведомлений
                    </div>
                  ) : (
                    notifications.map((note) => (
                      <div 
                        key={note.id}
                        className={`p-3 border-b ${note.read ? 'bg-background' : 'bg-muted/30'}`}
                      >
                        <div className="font-medium">{note.title}</div>
                        <div className="text-sm text-muted-foreground">{note.message}</div>
                      </div>
                    ))
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
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
            <h2 className="text-xl font-semibold">Найти врача</h2>
            
            {showDoctors ? (
              <div>
                <h3 className="text-lg mb-4">Доступные специалисты</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Mock doctor data */}
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
                          <span className="text-sm font-semibold">{convertPrice(doctor.price)}/консультация</span>
                        </div>
                        <Button 
                          className="w-full bg-medical-primary hover:bg-medical-secondary"
                          onClick={() => handleAppointmentRequest(doctor)}
                        >
                          Записаться на приём
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedDoctor && (
                  <Alert className="bg-green-50 border-green-200">
                    <AlertTitle className="text-green-700">Вы записаны на приём</AlertTitle>
                    <AlertDescription className="text-green-600">
                      Ваша запись к врачу {selectedDoctor} была успешно создана. Мы свяжемся с вами для подтверждения времени.
                    </AlertDescription>
                  </Alert>
                )}
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="rounded-full bg-green-100 p-3 mb-4">
                        <Stethoscope className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-lg font-medium">Запись создана</h3>
                      <p className="text-muted-foreground mt-2 mb-4">
                        Мы отправили информацию о записи в раздел уведомлений
                      </p>
                      <Button onClick={() => setShowDoctors(true)}>Записаться к другому врачу</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
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
                  <Button onClick={() => {
                    const doctorsTab = document.querySelector('[value="doctors"]');
                    if (doctorsTab instanceof HTMLElement) doctorsTab.click();
                  }}>Записаться на приём</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="medcard" className="space-y-4">
            <h2 className="text-xl font-semibold">Медицинская карта</h2>
            
            <Card>
              <CardContent className="p-8 flex flex-col items-center justify-center text-center">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Медицинская карта отсутствует</h3>
                <p className="text-muted-foreground mb-4">
                  У вас пока нет электронной медицинской карты. Вы можете создать её или загрузить данные из других клиник.
                </p>
                <div className="space-y-2">
                  <Button variant="default" className="w-full">Создать медкарту</Button>
                  <Button variant="outline" className="w-full">Запросить данные из других клиник</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tests" className="space-y-4">
            <h2 className="text-xl font-semibold">Результаты анализов</h2>
            
            <Card>
              <CardContent className="p-8 flex flex-col items-center justify-center text-center">
                <TestTube className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Результаты анализов не найдены</h3>
                <p className="text-muted-foreground mb-4">
                  У вас пока нет загруженных результатов анализов и исследований. Вы можете загрузить их или запросить из лаборатории.
                </p>
                <div className="space-y-2">
                  <Button variant="default" className="w-full">Загрузить результаты</Button>
                  <Button variant="outline" className="w-full">Запросить из лаборатории</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Appointment confirmation dialog */}
      <Dialog open={appointmentConfirmOpen} onOpenChange={setAppointmentConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтверждение записи</DialogTitle>
            <DialogDescription>
              Пожалуйста, подтвердите запись на приём к врачу
            </DialogDescription>
          </DialogHeader>
          
          {currentDoctor && (
            <div className="py-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-medical-light flex items-center justify-center">
                  <Stethoscope className="h-6 w-6 text-medical-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">{currentDoctor.name}</h3>
                  <p className="text-sm text-muted-foreground">{currentDoctor.specialty}</p>
                </div>
              </div>
              
              <div className="rounded-md bg-muted/50 p-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Стоимость консультации:</span>
                  <span className="font-medium">{convertPrice(currentDoctor.price)}</span>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setAppointmentConfirmOpen(false)}>
              Отмена
            </Button>
            <Button onClick={confirmAppointment}>
              Подтвердить запись
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default PatientDashboard;
