import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from "@/components/ui/switch";
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast";

const SettingsContent = () => {
  const { toast } = useToast();
  
  const handleSaveSettings = () => {
    toast({
      title: "Настройки сохранены",
      description: "Ваши настройки были успешно сохранены."
    });
  };
  
  return (
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
            <CardDescription>Управление основными параметрами приложения</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-recording">Автоматическая запись</Label>
                <Switch id="auto-recording" defaultChecked={true} />
              </div>
              <p className="text-sm text-muted-foreground">
                Автоматически включать запись при появлении пациента
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="consent-message">Сообщение о согласии</Label>
                <Switch id="consent-message" defaultChecked={true} />
              </div>
              <p className="text-sm text-muted-foreground">
                Проигрывать сообщение о согласии на запись
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications">Уведомления</Label>
                <Switch id="notifications" defaultChecked={true} />
              </div>
              <p className="text-sm text-muted-foreground">
                Включить системные уведомления
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Speech Recognition Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Распознавание речи</CardTitle>
            <CardDescription>Настройки модуля распознавания речи</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="language">Основной язык</Label>
              <Select defaultValue="ru-RU">
                <SelectTrigger id="language">
                  <SelectValue placeholder="Выберите язык" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ru-RU">Русский</SelectItem>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="en-GB">English (UK)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="model">Модель распознавания</Label>
              <Select defaultValue="enhanced">
                <SelectTrigger id="model">
                  <SelectValue placeholder="Выберите модель" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Стандартная</SelectItem>
                  <SelectItem value="enhanced">Расширенная</SelectItem>
                  <SelectItem value="medical">Медицинская (beta)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="local-processing">Локальная обработка</Label>
                <Switch id="local-processing" defaultChecked={false} />
              </div>
              <p className="text-sm text-muted-foreground">
                Обрабатывать аудиоданные локально (требует загрузку моделей)
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Template Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Шаблоны документов</CardTitle>
            <CardDescription>Настройка шаблонов отчетов и документов</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="template">Шаблон отчета</Label>
              <Select defaultValue="standard">
                <SelectTrigger id="template">
                  <SelectValue placeholder="Выберите шаблон" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Стандартный</SelectItem>
                  <SelectItem value="detailed">Расширенный</SelectItem>
                  <SelectItem value="minimal">Минимальный</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-save">Автосохранение</Label>
                <Switch id="auto-save" defaultChecked={true} />
              </div>
              <p className="text-sm text-muted-foreground">
                Автоматически сохранять отчеты в ЭМК
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="include-transcript">Включать транскрипт</Label>
                <Switch id="include-transcript" defaultChecked={false} />
              </div>
              <p className="text-sm text-muted-foreground">
                Включать полный транскрипт беседы в отчет
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Integration Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Интеграции</CardTitle>
            <CardDescription>Настройки интеграции с внешними системами</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="emr-system">Система ЭМК</Label>
              <Select defaultValue="none">
                <SelectTrigger id="emr-system">
                  <SelectValue placeholder="Выберите систему" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Не выбрано</SelectItem>
                  <SelectItem value="mis">МИС</SelectItem>
                  <SelectItem value="emias">ЕМИАС</SelectItem>
                  <SelectItem value="custom">Пользовательская</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="connection-status" className="block mb-1">Статус подключения</Label>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <span className="text-sm">Не подключено</span>
              </div>
            </div>
            
            <Button variant="outline" className="w-full">Настроить подключение</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const Settings = () => {
  return (
    <Layout>
      <SettingsContent />
    </Layout>
  );
};

export default Settings;
