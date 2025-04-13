
import React from 'react';
import { usePatient } from '@/contexts/PatientContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserRound, Stethoscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserTypeSelector: React.FC = () => {
  const { setUserType } = usePatient();
  const navigate = useNavigate();

  const handleSelectUserType = (type: 'doctor' | 'patient') => {
    setUserType(type);
    localStorage.setItem('userType', type);
    
    // Redirect based on user type
    if (type === 'doctor') {
      navigate('/register');
    } else {
      navigate('/patient-dashboard');
    }
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Добро пожаловать в SmartDoc</h1>
      <p className="text-center text-muted-foreground mb-12">Выберите тип учетной записи, чтобы продолжить</p>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card 
          onClick={() => handleSelectUserType('doctor')}
          className="cursor-pointer border-2 hover:border-medical-primary transition-all hover:shadow-md"
        >
          <CardContent className="p-8 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-medical-light flex items-center justify-center mb-6">
              <Stethoscope className="h-12 w-12 text-medical-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Я врач</h2>
            <p className="text-muted-foreground mb-6">
              Создайте профиль врача, чтобы консультировать пациентов и вести медицинские записи
            </p>
            <Button className="w-full">Продолжить как врач</Button>
          </CardContent>
        </Card>
        
        <Card 
          onClick={() => handleSelectUserType('patient')}
          className="cursor-pointer border-2 hover:border-medical-accent transition-all hover:shadow-md"
        >
          <CardContent className="p-8 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-medical-light/50 flex items-center justify-center mb-6">
              <UserRound className="h-12 w-12 text-medical-accent" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Я пациент</h2>
            <p className="text-muted-foreground mb-6">
              Создайте профиль пациента, чтобы находить врачей, записываться на приём и хранить медицинские данные
            </p>
            <Button className="w-full bg-medical-accent hover:bg-medical-accent/90">
              Продолжить как пациент
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserTypeSelector;
