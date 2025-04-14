
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from "@/components/ui/switch";
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast";

const PatientSettings = () => {
  const { toast } = useToast();
  
  const handleSaveSettings = () => {
    toast({
      title: "Настройки сохранены",
      description: "Ваши настройки были успешно сохранены."
    });
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Настройки</h1>
          <Button onClick={handleSaveSettings}>Сохранить изменения</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Основные настройки</CardTitle>
              <CardDescription>Управление уведомлениями и интерфейсом</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications">Уведомления на почту</Label>
                  <Switch id="email-notifications" defaultChecked={true} />
                </div>
                <p className="text-sm text-muted-foreground">
                  Получать уведомления о записях на приём по электронной почте
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="sms-notifications">SMS-уведомления</Label>
                  <Switch id="sms-notifications" defaultChecked={false} />
                </div>
                <p className="text-sm text-muted-foreground">
                  Получать SMS-уведомления о записях на приём
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="app-notifications">Уведомления в приложении</Label>
                  <Switch id="app-notifications" defaultChecked={true} />
                </div>
                <p className="text-sm text-muted-foreground">
                  Показывать уведомления в приложении
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Настройки приватности</CardTitle>
              <CardDescription>Управление конфиденциальностью</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="data-sharing">Передача данных врачам</Label>
                  <Switch id="data-sharing" defaultChecked={true} />
                </div>
                <p className="text-sm text-muted-foreground">
                  Разрешить врачам просматривать вашу медкарту
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="analytics">Аналитические данные</Label>
                  <Switch id="analytics" defaultChecked={true} />
                </div>
                <p className="text-sm text-muted-foreground">
                  Отправлять анонимные данные для улучшения сервиса
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="data-retention">Хранение данных</Label>
                <Select defaultValue="1-year">
                  <SelectTrigger id="data-retention">
                    <SelectValue placeholder="Выберите срок хранения" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-year">1 год</SelectItem>
                    <SelectItem value="2-years">2 года</SelectItem>
                    <SelectItem value="5-years">5 лет</SelectItem>
                    <SelectItem value="indefinite">Неограниченно</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Срок хранения ваших данных в системе
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Reminders Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Напоминания</CardTitle>
              <CardDescription>Настройки напоминаний о приёмах</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="reminder-time">Время напоминания</Label>
                <Select defaultValue="1-day">
                  <SelectTrigger id="reminder-time">
                    <SelectValue placeholder="Выберите время" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-hour">За 1 час</SelectItem>
                    <SelectItem value="3-hours">За 3 часа</SelectItem>
                    <SelectItem value="1-day">За 1 день</SelectItem>
                    <SelectItem value="2-days">За 2 дня</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="reminders-enabled">Включить напоминания</Label>
                  <Switch id="reminders-enabled" defaultChecked={true} />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="calendar-sync">Синхронизация с календарём</Label>
                  <Switch id="calendar-sync" defaultChecked={false} />
                </div>
                <p className="text-sm text-muted-foreground">
                  Добавлять записи к врачу в ваш календарь
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Аккаунт</CardTitle>
              <CardDescription>Управление данными аккаунта</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Button variant="outline" className="w-full">Изменить пароль</Button>
              </div>
              
              <div className="space-y-2">
                <Button variant="outline" className="w-full">Изменить email</Button>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <Button variant="destructive" className="w-full">Удалить аккаунт</Button>
                <p className="text-xs text-muted-foreground text-center">
                  Все ваши данные будут удалены безвозвратно
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default PatientSettings;
