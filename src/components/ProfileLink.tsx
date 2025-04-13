
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserRound } from 'lucide-react';
import { useTherapist } from '@/contexts/TherapistContext';

const ProfileLink = () => {
  const { currentTherapist } = useTherapist();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Профиль терапевта</CardTitle>
        <CardDescription>
          {currentTherapist 
            ? `${currentTherapist.name}` 
            : "Создайте профиль терапевта для работы с системой"
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Button asChild className="w-full">
          <Link to={currentTherapist ? "/profile" : "/register"}>
            <UserRound className="mr-2 h-4 w-4" />
            {currentTherapist ? "Перейти к профилю" : "Зарегистрироваться"}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfileLink;
