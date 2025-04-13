
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useTherapist } from '@/contexts/TherapistContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Camera, UserRound, Save, Edit } from 'lucide-react';

const TherapistProfile = () => {
  const { currentTherapist, updateTherapist } = useTherapist();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentTherapist?.name || '',
    specialty: currentTherapist?.specialty || '',
    bio: currentTherapist?.bio || '',
    phone: currentTherapist?.phone || '',
    experience: currentTherapist?.experience?.toString() || ''
  });
  
  // Redirect to registration if no therapist data
  React.useEffect(() => {
    if (!currentTherapist) {
      navigate('/register');
    }
  }, [currentTherapist, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    updateTherapist({
      name: formData.name,
      specialty: formData.specialty,
      bio: formData.bio,
      phone: formData.phone || undefined,
      experience: formData.experience ? Number(formData.experience) : undefined
    });
    
    toast({
      title: "Профиль обновлен",
      description: "Изменения успешно сохранены"
    });
    
    setIsEditing(false);
  };
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Create a local URL for the selected image
    const imageUrl = URL.createObjectURL(file);
    updateTherapist({ avatarUrl: imageUrl });
    
    toast({
      title: "Аватар обновлен",
      description: "Новое изображение профиля установлено"
    });
  };
  
  if (!currentTherapist) {
    return null; // We'll redirect in the useEffect
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Профиль терапевта</CardTitle>
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
                <AvatarImage src={currentTherapist.avatarUrl} />
                <AvatarFallback className="text-2xl">
                  <UserRound className="h-12 w-12" />
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
                  <div className="p-2 bg-gray-50 rounded">{currentTherapist.name}</div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="p-2 bg-gray-50 rounded">{currentTherapist.email}</div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="specialty">Специализация</Label>
                {isEditing ? (
                  <Input 
                    id="specialty" 
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                    placeholder="Психотерапевт, невролог и т.д."
                  />
                ) : (
                  <div className="p-2 bg-gray-50 rounded">{currentTherapist.specialty}</div>
                )}
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
                    {currentTherapist.phone || 'Не указан'}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="experience">Опыт работы (лет)</Label>
                {isEditing ? (
                  <Input 
                    id="experience" 
                    name="experience"
                    type="number"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="5"
                  />
                ) : (
                  <div className="p-2 bg-gray-50 rounded">
                    {currentTherapist.experience ? `${currentTherapist.experience} лет` : 'Не указан'}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">О себе</Label>
                {isEditing ? (
                  <Textarea 
                    id="bio" 
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Краткая информация о вашем опыте и подходе к работе"
                    rows={4}
                  />
                ) : (
                  <div className="p-2 bg-gray-50 rounded whitespace-pre-wrap min-h-[100px]">
                    {currentTherapist.bio || 'Информация не добавлена'}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default TherapistProfile;
