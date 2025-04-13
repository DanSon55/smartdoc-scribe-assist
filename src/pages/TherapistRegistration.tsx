
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useTherapist } from '@/contexts/TherapistContext';
import { Therapist } from '@/types/therapist';

const TherapistRegistration = () => {
  const { setCurrentTherapist } = useTherapist();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    specialty: '',
    bio: '',
    phone: '',
    experience: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.name || !formData.email || !formData.specialty) {
      toast({
        title: "Ошибка валидации",
        description: "Пожалуйста, заполните обязательные поля",
        variant: "destructive"
      });
      return;
    }
    
    // Create new therapist profile
    const newTherapist: Therapist = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      specialty: formData.specialty,
      bio: formData.bio,
      avatarUrl: '',
      phone: formData.phone || undefined,
      experience: formData.experience ? Number(formData.experience) : undefined
    };
    
    setCurrentTherapist(newTherapist);
    localStorage.setItem('therapist', JSON.stringify(newTherapist));
    
    toast({
      title: "Регистрация успешна",
      description: "Профиль терапевта создан"
    });
    
    navigate('/profile');
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Регистрация терапевта</CardTitle>
            <CardDescription>Создайте профиль терапевта для работы в системе</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">ФИО*</Label>
                <Input 
                  id="name" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Введите ваше полное имя"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email*</Label>
                <Input 
                  id="email" 
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@domain.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="specialty">Специализация*</Label>
                <Input 
                  id="specialty" 
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  placeholder="Психотерапевт, невролог и т.д."
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Телефон</Label>
                <Input 
                  id="phone" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+7 (XXX) XXX-XX-XX"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="experience">Опыт работы (лет)</Label>
                <Input 
                  id="experience" 
                  name="experience"
                  type="number"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="5"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">О себе</Label>
                <Textarea 
                  id="bio" 
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Краткая информация о вашем опыте и подходе к работе"
                  rows={4}
                />
              </div>
              
              <Button type="submit" className="w-full">Зарегистрироваться</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default TherapistRegistration;
