
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { usePatient } from '@/contexts/PatientContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Camera, UserRound, Save, Edit } from 'lucide-react';

const PatientProfile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { currentPatient, setCurrentPatient } = usePatient();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentPatient?.name || 'Данияр',
    age: currentPatient?.age?.toString() || '25',
    gender: currentPatient?.gender || 'male',
    phone: '',
    additionalInfo: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // Update patient profile
    const updatedPatient = {
      id: currentPatient?.id || '1',
      name: formData.name,
      age: Number(formData.age),
      gender: formData.gender as 'male' | 'female',
    };
    
    setCurrentPatient(updatedPatient);
    
    toast({
      title: "Профиль обновлен",
      description: "Изменения успешно сохранены"
    });
    
    setIsEditing(false);
  };
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // In a real app, we would upload the file to a server
    toast({
      title: "Аватар обновлен",
      description: "Новое изображение профиля установлено"
    });
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Профиль пациента</CardTitle>
                <CardDescription>Просмотр и редактирование данных профиля</CardDescription>
              </div>
              {!isEditing ? (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Редактировать
                </Button>
              ) : (
                <Button onClick={handleSubmit}>
                  <Save className="mr-2 h-4 w-4" />
                  Сохранить
                </Button>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Avatar section */}
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-32 w-32">
                <AvatarFallback className="text-2xl bg-medical-primary text-white">
                  {formData.name.split(' ').map(n => n[0]).join('').toUpperCase() || <UserRound className="h-12 w-12" />}
                </AvatarFallback>
              </Avatar>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Camera className="mr-2 h-4 w-4" />
                    Изменить фото
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Загрузка фото профиля</DialogTitle>
                    <DialogDescription>
                      Выберите изображение для установки в качестве аватара
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="flex items-center justify-center">
                      <Label htmlFor="avatar-upload" className="cursor-pointer">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center hover:bg-gray-50 transition-colors">
                          <Camera className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="mt-2 text-sm text-gray-500">Нажмите, чтобы выбрать файл</p>
                        </div>
                        <Input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarChange}
                        />
                      </Label>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            {/* Profile details */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">ФИО</Label>
                {isEditing ? (
                  <Input 
                    id="name" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Введите ваше полное имя"
                  />
                ) : (
                  <div className="p-2 bg-gray-50 rounded">{formData.name}</div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Возраст</Label>
                  {isEditing ? (
                    <Input 
                      id="age" 
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="Введите ваш возраст"
                    />
                  ) : (
                    <div className="p-2 bg-gray-50 rounded">{formData.age} лет</div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gender">Пол</Label>
                  {isEditing ? (
                    <Select 
                      value={formData.gender}
                      onValueChange={(value) => handleSelectChange('gender', value)}
                    >
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Выберите пол" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Мужской</SelectItem>
                        <SelectItem value="female">Женский</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="p-2 bg-gray-50 rounded">
                      {formData.gender === 'male' ? 'Мужской' : 'Женский'}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Телефон</Label>
                {isEditing ? (
                  <Input 
                    id="phone" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+7 (XXX) XXX-XX-XX"
                  />
                ) : (
                  <div className="p-2 bg-gray-50 rounded">
                    {formData.phone || 'Не указан'}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="additionalInfo">Дополнительная информация</Label>
                {isEditing ? (
                  <Textarea 
                    id="additionalInfo" 
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleChange}
                    placeholder="Укажите дополнительную информацию (аллергии, хронические заболевания и т.д.)"
                    rows={4}
                  />
                ) : (
                  <div className="p-2 bg-gray-50 rounded whitespace-pre-wrap min-h-[100px]">
                    {formData.additionalInfo || 'Не указано'}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          
          {isEditing && (
            <CardFooter className="flex justify-between border-t p-4">
              <Button variant="outline" onClick={() => setIsEditing(false)}>Отмена</Button>
              <Button onClick={handleSubmit}>Сохранить изменения</Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default PatientProfile;
